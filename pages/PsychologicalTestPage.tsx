
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from '../components/StyledButton';
import { DAD_CHILD_ILLUSTRATION_URL, IconChevronRight } from '../constants';
import { Page } from '../types';

export const PsychologicalTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 min-h-[calc(100vh-10rem)] py-10">
      <div className="lg:w-3/5 text-center lg:text-left bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark-text mb-6">
          Test Tâm Lý
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Trong cuộc sống, không ít lần bạn cảm thấy căng thẳng, chán nản vì những khó khăn, thử thách.
          Tuy nhiên, mỗi người sẽ có những mức độ stress khác nhau.
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Còn bạn thì sao? Thử nhé! Bài test này sẽ giúp bạn hiểu rõ hơn về mức độ căng thẳng của mình và đưa ra những gợi ý hữu ích.
        </p>
        <div className="bg-indigo-50 p-6 rounded-lg shadow-inner">
            <p className="text-xl font-semibold text-brand-primary mb-3">
                Thang đo mức độ stress của bạn!
            </p>
            <StyledButton 
                size="lg" 
                onClick={() => navigate(Page.TestQuiz)}
                rightIcon={<IconChevronRight className="w-5 h-5" />}
            >
                Làm Test
            </StyledButton>
        </div>
      </div>
      <div className="lg:w-2/5 mt-10 lg:mt-0">
        <img 
            src={DAD_CHILD_ILLUSTRATION_URL}
            alt="Illustration for test" 
            className="rounded-lg shadow-2xl object-cover w-full max-w-md mx-auto lg:max-w-full"
        />
      </div>
    </div>
  );
};
