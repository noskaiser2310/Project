
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTestQuestions, scoreAnswer } from '../services/mockTestData';
import { StyledButton } from '../components/StyledButton';
import { IconChevronRight } from '../constants';
import { Page } from '../types';

export const TestQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = mockTestQuestions.length;
  const currentQuestion = mockTestQuestions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    setError(null); 
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
        setError("Vui lòng chọn một đáp án để tiếp tục.");
        return;
    }
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handleSubmit = () => {
    if (!answers[currentQuestion.id]) {
        setError("Vui lòng chọn một đáp án trước khi nộp bài.");
        return;
    }
    let totalScore = 0;
    let maxPossibleScore = 0;

    mockTestQuestions.forEach(q => {
      const selectedOptionId = answers[q.id];
      if (selectedOptionId) {
        totalScore += scoreAnswer(q, selectedOptionId);
      }
      maxPossibleScore += 3; 
    });
    
    navigate(Page.TestResults, { state: { score: totalScore, maxScore: maxPossibleScore, numQuestions: totalQuestions } });
  };

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto bg-brand-bg-card p-6 sm:p-10 rounded-2xl shadow-card">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-dark-text">
            Câu hỏi {currentQuestionIndex + 1}
          </h2>
          <span className="px-3 py-1 bg-gradient-button text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm">
             {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-brand-border rounded-full h-3 shadow-inner">
          <div 
            className="bg-brand-primary h-3 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
            aria-label={`Progress: ${progressPercentage}%`}
          ></div>
        </div>
      </div>

      <div className="bg-brand-bg-light p-6 sm:p-8 rounded-xl mb-8 shadow-inner border border-brand-border/50">
        <p className="text-lg sm:text-xl text-brand-dark-text leading-relaxed font-medium">{currentQuestion.text}</p>
      </div>

      {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-100 p-2.5 rounded-md shadow-sm">{error}</p>}

      <div className="space-y-3 sm:space-y-4 mb-10">
        {currentQuestion.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 ease-in-out transform focus:outline-none
              ${answers[currentQuestion.id] === option.id 
                ? 'bg-brand-primary border-brand-accent text-white shadow-lg scale-[1.02]' 
                : 'bg-white border-brand-border hover:border-brand-primary/70 hover:bg-brand-primary/10 text-brand-dark-text focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/70'
              }`}
            aria-pressed={answers[currentQuestion.id] === option.id}
          >
            <span className={`font-semibold mr-2.5 text-sm ${answers[currentQuestion.id] === option.id ? 'text-white/90' : 'text-brand-primary'}`}>{String.fromCharCode(65 + index)}.</span> 
            <span className="text-sm sm:text-base">{option.text}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        {currentQuestionIndex < totalQuestions - 1 ? (
          <StyledButton 
            onClick={handleNext}
            rightIcon={<IconChevronRight className="w-4 h-4 sm:w-5 sm:h-5"/>}
            size="md"
            disabled={!answers[currentQuestion.id]}
          >
            Tiếp tục
          </StyledButton>
        ) : (
          <StyledButton 
            onClick={handleSubmit}
            variant="primary"
            size="md"
            disabled={!answers[currentQuestion.id]}
          >
            Nộp bài & Xem Kết Quả
          </StyledButton>
        )}
      </div>
    </div>
  );
};