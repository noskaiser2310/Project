
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
    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-20 min-h-[calc(100vh-15rem)] py-8 sm:py-12">
      <div className="lg:w-1/2 text-center lg:text-left">
        {auth?.currentUser ? (
          <>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark-text mb-6 leading-tight">
              Chào mừng <span className="text-brand-accent">{auth.currentUser.name}</span>,
              <br />
              Hôm nay bạn muốn chia sẻ với DadMind điều gì?
            </h1>
            <p className="text-lg sm:text-xl text-brand-light-text mb-10 leading-relaxed">
              Gõ vào câu chuyện, thắc mắc hoặc bất cứ điều gì bạn đang nghĩ. DadMind luôn sẵn sàng lắng nghe và hỗ trợ.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark-text mb-6 leading-tight">
              Làm cha rồi, <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">vẫn lạc lối?</span>
            </h1>
            <p className="text-lg sm:text-xl text-brand-light-text mb-10 leading-relaxed">
              Đừng lo, hãy để DadMind lắng nghe câu chuyện của bạn. Chúng tôi ở đây để hỗ trợ bạn trên hành trình làm cha tuyệt vời này.
            </p>
          </>
        )}
        
        <div className="relative max-w-xl mx-auto lg:mx-0 group">
          <input
            type="text"
            value={storyInput}
            onChange={(e) => setStoryInput(e.target.value)}
            placeholder={auth?.currentUser ? "Chia sẻ câu chuyện của bạn..." : "Chia sẻ ngay tại đây..."}
            className="w-full py-4 pl-6 pr-20 text-brand-dark-text bg-brand-bg-card border-2 border-brand-border rounded-full shadow-card focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-300 ease-in-out focus:shadow-interactive-lg placeholder-gray-500 text-base"
            onKeyPress={(e) => e.key === 'Enter' && handleShareStory()}
            aria-label={auth?.currentUser ? "Enter your story or question" : "Share your story now"}
          />
          <StyledButton
            variant="primary"
            size="md"
            onClick={handleShareStory}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 !rounded-full !p-3 sm:!p-3.5 !shadow-lg group-hover:scale-105 transition-transform"
            aria-label={auth?.currentUser ? "Send your story" : "Share now"}
          >
            <IconSearch className="w-5 h-5 sm:w-6 sm:h-6" />
          </StyledButton>
        </div>
      </div>

      <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center p-4">
        <img 
          src={DAD_CHILD_ILLUSTRATION_URL} 
          alt="Father and child bonding" 
          className="rounded-2xl shadow-2xl object-cover w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto aspect-[4/3] transition-transform duration-300 hover:scale-105 border-4 border-white"
          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x450.png?text=DadMind+Illustration")}
        />
      </div>
    </div>
  );
};