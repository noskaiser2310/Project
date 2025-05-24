
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { StyledButton } from '../components/StyledButton';
import { IconSearch, DAD_CHILD_ILLUSTRATION_URL } from '../constants';
import { Page } from '../types';

export const HomePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [storyInput, setStoryInput] = useState('');

  const handleShareStory = () => {
    if (storyInput.trim()) {
      navigate(Page.AskMe, { state: { initialMessage: storyInput } });
    } else {
      navigate(Page.AskMe);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[calc(100vh-10rem)] py-10">
      <div className="lg:w-1/2 text-center lg:text-left">
        {auth?.currentUser ? (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark-text mb-6 leading-tight">
              Chào mừng <span className="text-brand-accent">{auth.currentUser.name}</span>,
              <br />
              Hôm nay bạn muốn chia sẻ với DadMind điều gì?
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Gõ vào câu chuyện, thắc mắc hoặc bất cứ điều gì bạn đang nghĩ. DadMind luôn sẵn sàng lắng nghe.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark-text mb-6 leading-tight">
              Làm cha rồi, <span className="text-brand-primary">vẫn lạc lối?</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Đừng lo, hãy để DadMind lắng nghe câu chuyện của bạn. Chúng tôi ở đây để hỗ trợ bạn trên hành trình làm cha tuyệt vời này.
            </p>
          </>
        )}
        
        <div className="relative max-w-lg mx-auto lg:mx-0">
          <input
            type="text"
            value={storyInput}
            onChange={(e) => setStoryInput(e.target.value)}
            placeholder={auth?.currentUser ? "Your story..." : "Chia sẻ ngay!"}
            className="w-full py-4 pl-6 pr-16 text-gray-700 bg-white border-2 border-transparent rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-shadow"
            onKeyPress={(e) => e.key === 'Enter' && handleShareStory()}
          />
          <StyledButton
            variant="primary"
            size="md"
            onClick={handleShareStory}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 !rounded-full !p-3 !shadow-none"
            aria-label={auth?.currentUser ? "Send your story" : "Share now"}
          >
            <IconSearch className="w-5 h-5" />
          </StyledButton>
        </div>
      </div>

      <div className="lg:w-1/2 mt-10 lg:mt-0">
        <img 
          src={DAD_CHILD_ILLUSTRATION_URL}
          alt="Father and child illustration" 
          className="rounded-lg shadow-2xl object-cover w-full max-w-md mx-auto lg:max-w-full"
        />
      </div>
    </div>
  );
};
