
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Message } from '../types';
import { AuthContext } from '../App';
import { ChatMessage } from '../components/ChatMessage';
import { StyledButton } from '../components/StyledButton';
import { IconSend, IconPaperClip, IconThumbUp, IconThumbDown, GEMINI_MODEL_TEXT, ROBOT_AVATAR_URL } from '../constants';
import { LoadingIcon } from '../components/LoadingIcon';

export const AskMePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      setError("API Key is not configured. Please set your Gemini API Key.");
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey });
      const newChat = ai.chats.create({
        model: GEMINI_MODEL_TEXT,
        config: {
          systemInstruction: "You are DadMind AI, a supportive and understanding assistant for fathers. Provide helpful advice, resources, and a listening ear. Be empathetic and encouraging.",
        },
      });
      setChat(newChat);
    } catch (err) {
      console.error("Failed to initialize Gemini chat:", err);
      setError(`Failed to initialize AI: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Handle initial message from HomePage navigation
    const initialMessageFromState = (location.state as { initialMessage?: string })?.initialMessage;
    if (initialMessageFromState && messages.length === 0) {
        setInput(initialMessageFromState);
        // Automatically send if there's an initial message.
        // Add a slight delay to ensure chat is initialized.
        setTimeout(() => {
            handleSend(initialMessageFromState);
        }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, chat]);


  const handleSend = async (messageToSend?: string) => {
    const textToSend = messageToSend || input;
    if (!textToSend.trim() || !chat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chat.sendMessageStream({ message: textToSend });
      let botResponseText = '';
      // Create a placeholder for the bot message to update it progressively
      const botMessageId = (Date.now() + 1).toString();
      const initialBotMessage: Message = {
        id: botMessageId,
        text: '',
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, initialBotMessage]);

      for await (const chunk of stream) { // chunk is GenerateContentResponse
        botResponseText += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: botResponseText } : msg
          )
        );
      }
    } catch (err) {
      console.error("Error sending message to Gemini:", err);
      const errorMessage = `AI Error: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error. ${errorMessage}`,
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl min-h-[calc(100vh-12rem)]">
      {/* Chat Area */}
      <div className="flex-grow flex flex-col h-[calc(100vh-15rem)] lg:h-auto">
        <h2 className="text-2xl font-bold text-brand-dark-text mb-4 border-b pb-2">Ask Me!</h2>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md my-2">{error}</p>}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg mb-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-10">
              <img src={ROBOT_AVATAR_URL} alt="DadMind AI" className="w-24 h-24 mx-auto rounded-full mb-4 opacity-70" />
              <p>Xin chào! Tôi là DadMind AI. Bạn cần chia sẻ điều gì hôm nay?</p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
            <div className="flex items-end space-x-3 my-3">
              <img src={ROBOT_AVATAR_URL} alt="bot avatar" className="w-8 h-8 rounded-full object-cover" />
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow bg-white text-gray-700 rounded-bl-none">
                <LoadingIcon size="sm" />
              </div>
            </div>
          )}
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
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Write a message..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
            disabled={isLoading || !chat}
          />
          <StyledButton
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim() || !chat}
            className="!p-3"
          >
            <IconSend className="w-6 h-6" />
          </StyledButton>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-1/3 p-4 bg-indigo-50 rounded-lg">
        <div className="text-center mb-6">
          <img src={ROBOT_AVATAR_URL} alt="DadMind AI" className="w-24 h-24 mx-auto rounded-full mb-3 shadow-md" />
          <h3 className="text-lg font-semibold text-brand-dark-text">DadMind AI</h3>
          <p className="text-sm text-gray-600">Your personal assistant</p>
        </div>
        
        <h4 className="font-semibold text-gray-700 mb-2">Lịch sử (Chat History)</h4>
        <div className="space-y-2 mb-6">
            {['Lịch sử 1', 'Lịch sử 2', 'Lịch sử 3'].map((item, idx) => (
                <button key={idx} className="w-full text-left p-2 bg-white hover:bg-indigo-100 rounded-md text-sm text-gray-700 transition-colors shadow-sm">
                    {item}
                </button>
            ))}
        </div>

        <h4 className="font-semibold text-gray-700 mb-2">Feedback</h4>
        <div className="flex space-x-2">
            <StyledButton variant="secondary" size="sm" className="flex-1">
                <IconThumbUp className="w-4 h-4 mr-1" /> Like
            </StyledButton>
            <StyledButton variant="secondary" size="sm" className="flex-1">
                <IconThumbDown className="w-4 h-4 mr-1" /> Dislike
            </StyledButton>
        </div>
        {auth?.currentUser && (
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Logged in as: {auth.currentUser.name}</p>
            </div>
        )}
      </div>
    </div>
  );
};
