
import React, { useState, useEffect, useRef } from 'react';
import { Message, Expert } from '../types';
import { ChatMessage } from '../components/ChatMessage';
import { StyledButton } from '../components/StyledButton';
import { IconSend, IconPaperClip, IconThumbUp, IconThumbDown, EXPERT_AVATAR_URL, USER_AVATAR_URL } from '../constants';
import { LoadingIcon } from '../components/LoadingIcon';

const mockExpert: Expert = {
  id: 'expert1',
  name: 'BS. Nguyễn Văn Minh', 
  specialty: 'Chuyên gia Tâm lý Gia đình & Trẻ em',
  phone: '0901 234 567',
  email: 'bs.nguyenvanminh@dadmind.com',
  avatarUrl: EXPERT_AVATAR_URL,
};

export const ContactExpertPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpertReplying, setIsExpertReplying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      { 
        id: 'expert-intro', 
        text: `Xin chào bạn, tôi là ${mockExpert.name}, ${mockExpert.specialty}. Rất vui được lắng nghe và hỗ trợ bạn. Bạn có thể bắt đầu chia sẻ vấn đề hoặc câu hỏi của mình.`, 
        sender: 'expert', 
        timestamp: Date.now(),
        avatar: mockExpert.avatarUrl,
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now(),
      avatar: USER_AVATAR_URL, 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsExpertReplying(true);

    setTimeout(() => {
      const expertReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Cảm ơn bạn đã chia sẻ. Tôi đang xem xét thông tin bạn cung cấp và sẽ phản hồi sớm nhất có thể. Bạn có muốn bổ sung thêm điều gì không?",
        sender: 'expert',
        timestamp: Date.now(),
        avatar: mockExpert.avatarUrl,
      };
      setMessages(prev => [...prev, expertReply]);
      setIsExpertReplying(false);
    }, 2000 + Math.random() * 1500);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected for expert chat:", file.name);
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Đã đính kèm: ${file.name} (Tính năng tải file đang được phát triển)`,
        sender: 'user',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto bg-brand-bg-card p-4 sm:p-6 rounded-xl shadow-card min-h-[calc(100vh-15rem)]">
      {/* Chat Area */}
      <div className="flex-grow flex flex-col h-[calc(100vh-18rem)] sm:h-[calc(100vh-17rem)] lg:min-h-[calc(100vh-20rem)] lg:max-h-[calc(100vh-20rem)]">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark-text mb-4 border-b border-brand-border pb-3">
          Trao đổi với: <span className="text-brand-primary">{mockExpert.name}</span>
        </h2>
        <div className="flex-grow overflow-y-auto p-1 sm:p-4 space-y-1 bg-brand-bg-subtle/60 rounded-lg mb-4 custom-scrollbar">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isExpertReplying && (
            <div className="flex items-end space-x-3 my-3">
               <img 
                src={mockExpert.avatarUrl} 
                alt="Expert avatar loading" 
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/36?text=E")}
              />
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md bg-brand-bg-card text-brand-dark-text rounded-bl-lg border border-brand-border">
                <LoadingIcon size="sm" color="text-brand-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-auto flex items-center gap-2 p-2.5 border-t border-brand-border bg-brand-bg-card/70 rounded-b-lg">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,application/pdf,.doc,.docx"
          />
          <button 
            onClick={handleFileUploadClick}
            className="p-2.5 text-brand-light-text hover:text-brand-primary rounded-full hover:bg-brand-primary/10 transition-colors disabled:opacity-50"
            aria-label="Attach file"
            title="Đính kèm tệp (Tính năng đang phát triển)"
            disabled={isExpertReplying}
          >
            <IconPaperClip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isExpertReplying && handleSend()}
            placeholder="Nhập tin nhắn cho chuyên gia..."
            className="flex-grow p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-sm placeholder-gray-500 disabled:bg-gray-100"
            disabled={isExpertReplying}
            aria-label="Message to expert"
          />
          <StyledButton 
            onClick={handleSend} 
            className="!p-3 !rounded-lg" 
            disabled={!input.trim() || isExpertReplying}
            aria-label="Send message to expert"
          >
            <IconSend className="w-5 h-5" />
          </StyledButton>
        </div>
      </div>

      {/* Sidebar with Expert Info */}
      <div className="lg:w-2/5 xl:w-1/3 p-4 sm:p-5 bg-brand-bg-light rounded-lg flex flex-col shadow-sm border border-brand-border/50">
        <div className="text-center mb-6 pb-6 border-b border-brand-border/70">
          <img 
            src={mockExpert.avatarUrl} 
            alt={mockExpert.name} 
            className="w-28 h-28 mx-auto rounded-full mb-4 shadow-xl border-4 border-white object-cover"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/112?text=Expert")}
          />
          <h3 className="text-xl font-semibold text-brand-dark-text">{mockExpert.name}</h3>
          <p className="text-sm text-brand-primary font-medium">{mockExpert.specialty}</p>
        </div>
        
        <div className="space-y-3 mb-6">
            <div className="p-3.5 bg-brand-bg-card rounded-lg shadow-sm border border-brand-border/70">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Số điện thoại</p>
                <p className="text-sm text-brand-dark-text font-medium">{mockExpert.phone}</p>
            </div>
            <div className="p-3.5 bg-brand-bg-card rounded-lg shadow-sm border border-brand-border/70">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                <p className="text-sm text-brand-dark-text font-medium">{mockExpert.email}</p>
            </div>
             <p className="text-xs text-center text-gray-400 mt-2">Đây là thông tin giả lập cho mục đích demo.</p>
        </div>

        <div className="mt-auto pt-6 border-t border-brand-border/70">
            <h4 className="font-semibold text-brand-dark-text mb-2 text-sm text-center">Đánh giá buổi tư vấn (WIP)</h4>
            <div className="flex space-x-2">
                <StyledButton variant="secondary" size="sm" className="flex-1 text-xs" title="Tính năng đang phát triển">
                    <IconThumbUp className="w-4 h-4 mr-1" /> Hài lòng
                </StyledButton>
                <StyledButton variant="secondary" size="sm" className="flex-1 text-xs" title="Tính năng đang phát triển">
                    <IconThumbDown className="w-4 h-4 mr-1" /> Cần cải thiện
                </StyledButton>
            </div>
        </div>
      </div>
    </div>
  );
};