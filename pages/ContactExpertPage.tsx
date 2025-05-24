
import React, { useState, useEffect, useRef } from 'react';
import { Message, Expert } from '../types';
import { ChatMessage } from '../components/ChatMessage';
import { StyledButton } from '../components/StyledButton';
import { IconSend, IconPaperClip, IconThumbUp, IconThumbDown, EXPERT_AVATAR_URL } from '../constants';

const mockExpert: Expert = {
  id: 'expert1',
  name: 'BS. Nguyễn Văn A',
  specialty: 'Chuyên gia tâm lý Gia đình',
  phone: '090xxxxxxx',
  email: 'bs.nguyenvana@dadmind.com',
  avatarUrl: EXPERT_AVATAR_URL,
};

export const ContactExpertPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { 
        id: 'expert-intro', 
        text: `Xin chào bạn, tôi là ${mockExpert.name}. Rất vui được hỗ trợ bạn. Bạn có thể chia sẻ vấn đề của mình.`, 
        sender: 'expert', 
        timestamp: Date.now() 
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
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Mock expert reply
    setTimeout(() => {
      const expertReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Cảm ơn bạn đã chia sẻ. Tôi đang xem xét thông tin của bạn...",
        sender: 'expert',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, expertReply]);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl min-h-[calc(100vh-12rem)]">
      {/* Chat Area */}
      <div className="flex-grow flex flex-col h-[calc(100vh-15rem)] lg:h-auto">
        <h2 className="text-2xl font-bold text-brand-dark-text mb-4 border-b pb-2">
          Liên hệ chuyên gia: <span className="text-brand-primary">{mockExpert.name}</span>
        </h2>
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg mb-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-auto flex items-center gap-2 p-2 border-t border-gray-200">
          <button className="p-2 text-gray-500 hover:text-brand-primary">
            <IconPaperClip className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write a message..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
          />
          <StyledButton onClick={handleSend} className="!p-3">
            <IconSend className="w-6 h-6" />
          </StyledButton>
        </div>
      </div>

      {/* Sidebar with Expert Info */}
      <div className="lg:w-1/3 p-4 bg-indigo-50 rounded-lg">
        <div className="text-center mb-6">
          <img src={mockExpert.avatarUrl} alt={mockExpert.name} className="w-24 h-24 mx-auto rounded-full mb-3 shadow-md object-cover" />
          <h3 className="text-xl font-semibold text-brand-dark-text">{mockExpert.name}</h3>
          <p className="text-sm text-gray-600">{mockExpert.specialty}</p>
        </div>
        
        <div className="space-y-3 mb-6">
            <div className="p-3 bg-white rounded-md shadow-sm">
                <p className="text-xs text-gray-500">Số điện thoại</p>
                <p className="text-sm text-gray-800 font-medium">{mockExpert.phone}</p>
            </div>
            <div className="p-3 bg-white rounded-md shadow-sm">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-800 font-medium">{mockExpert.email}</p>
            </div>
        </div>

        <h4 className="font-semibold text-gray-700 mb-2">Đánh giá buổi tư vấn</h4>
        <div className="flex space-x-2">
            <StyledButton variant="secondary" size="sm" className="flex-1">
                <IconThumbUp className="w-4 h-4 mr-1" /> Hài lòng
            </StyledButton>
            <StyledButton variant="secondary" size="sm" className="flex-1">
                <IconThumbDown className="w-4 h-4 mr-1" /> Chưa hài lòng
            </StyledButton>
        </div>
      </div>
    </div>
  );
};
