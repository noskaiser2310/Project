
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
    setError(null); // Clear error when an option is selected
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
        setError("Vui lòng chọn một đáp án.");
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
    // Calculate score
    let totalScore = 0;
    let maxPossibleScore = 0;

    mockTestQuestions.forEach(q => {
      const selectedOptionId = answers[q.id];
      if (selectedOptionId) {
        totalScore += scoreAnswer(q, selectedOptionId);
      }
      maxPossibleScore += 3; // Assuming max points per question is 3
    });
    
    navigate(Page.TestResults, { state: { score: totalScore, maxScore: maxPossibleScore, numQuestions: totalQuestions } });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-dark-text">
          Câu {currentQuestionIndex + 1}: {currentQuestion.id.startsWith("Đề bài") ? currentQuestion.id : `Đề bài`}
        </h2>
        <span className="px-3 py-1.5 bg-gradient-button text-white text-sm font-semibold rounded-full">
          Số lượng: {currentQuestionIndex + 1} / {totalQuestions}
        </span>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 min-h-[150px] flex items-center">
        <p className="text-lg text-gray-700">{currentQuestion.text}</p>
      </div>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-150
              ${answers[currentQuestion.id] === option.id 
                ? 'bg-indigo-500 border-indigo-500 text-white shadow-md scale-105' 
                : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
          >
            <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span> {option.text}
          </button>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        {currentQuestionIndex < totalQuestions - 1 ? (
          <StyledButton 
            onClick={handleNext}
            rightIcon={<IconChevronRight className="w-4 h-4"/>}
          >
            Tiếp tục
          </StyledButton>
        ) : (
          <StyledButton 
            onClick={handleSubmit}
            variant="primary"
          >
            Nộp bài
          </StyledButton>
        )}
      </div>
    </div>
  );
};
