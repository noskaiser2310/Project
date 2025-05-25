
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from '../components/StyledButton';
import { DAD_CHILD_ILLUSTRATION_URL, IconChevronRight } from '../constants';
import { Page } from '../types';

export const PsychologicalTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 xl:gap-16 min-h-[calc(100vh-15rem)] py-8 sm:py-12">
      <div className="lg:w-3/5 text-center lg:text-left bg-brand-bg-card p-8 sm:p-12 rounded-2xl shadow-card">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark-text mb-6 leading-tight">
          Bài Test Tâm Lý
        </h1>
        <div className="prose prose-base max-w-none mb-10">
          <p>
            Trong cuộc sống, không ít lần bạn cảm thấy căng thẳng, chán nản vì những khó khăn, thử thách.
            Tuy nhiên, mỗi người sẽ có những mức độ stress khác nhau.
          </p>
          <p>
            Còn bạn thì sao? Thử nhé! Bài test này sẽ giúp bạn hiểu rõ hơn về mức độ căng thẳng của mình và đưa ra những gợi ý hữu ích.
          </p>
        </div>
        <div className="bg-brand-bg-light p-6 sm:p-8 rounded-xl shadow-inner border border-brand-border/50">
            <p className="text-xl sm:text-2xl font-semibold text-brand-primary mb-5 text-center lg:text-left">
                Đo lường mức độ stress của bạn!
            </p>
            <StyledButton 
                size="lg" 
                onClick={() => navigate(Page.TestQuiz)}
                rightIcon={<IconChevronRight className="w-5 h-5" />}
                className="w-full sm:w-auto mx-auto lg:mx-0"
            >
                Bắt đầu Test
            </StyledButton>
        </div>
      </div>
      <div className="lg:w-2/5 mt-12 lg:mt-0 flex justify-center p-4">
        <img 
            src={DAD_CHILD_ILLUSTRATION_URL} 
            alt="Illustration for psychological test" 
            className="rounded-2xl shadow-2xl object-cover w-full max-w-md lg:max-w-lg h-auto aspect-square transition-transform duration-300 hover:scale-105 border-4 border-white"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/500x500.png?text=Test+Illustration")}
        />
      </div>
    </div>
  );
};