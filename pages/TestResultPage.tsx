
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { StyledButton } from '../components/StyledButton';
import { LoadingIcon } from '../components/LoadingIcon';
import { IconChevronRight, GEMINI_MODEL_TEXT } from '../constants';
import { Page, TestResult } from '../types';

export const TestResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, maxScore, numQuestions } = (location.state as { score: number; maxScore: number; numQuestions: number; }) || { score: 0, maxScore: 0, numQuestions: 0};
  
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(true);
  const [adviceError, setAdviceError] = useState<string | null>(null);

  useEffect(() => {
    if (maxScore === 0 && numQuestions > 0) { // if maxScore wasn't passed correctly, estimate it
        const estimatedMaxScore = numQuestions * 3; // Assuming each question has max 3 points for stress
        const percentage = estimatedMaxScore > 0 ? Math.round((score / estimatedMaxScore) * 100) : 0;
        setResult({ score, maxScore: estimatedMaxScore, percentage, feedback: getFeedback(percentage) });
    } else if (maxScore > 0) {
        const percentage = Math.round((score / maxScore) * 100);
        setResult({ score, maxScore, percentage, feedback: getFeedback(percentage) });
    } else {
        // Handle case where scores are not available
        setResult({ score: 0, maxScore: 0, percentage: 0, feedback: "Không có dữ liệu điểm số." });
    }
  }, [score, maxScore, numQuestions]);

  const getFeedback = (percentage: number): string => {
    if (percentage <= 30) return "Mức độ stress của bạn ở mức thấp. Hãy tiếp tục duy trì lối sống tích cực!";
    if (percentage <= 60) return "Mức độ stress của bạn ở mức trung bình. Hãy chú ý hơn đến việc thư giãn và cân bằng cuộc sống.";
    if (percentage <= 80) return "Mức độ stress của bạn ở mức cao. Bạn nên tìm hiểu các biện pháp giảm stress và cân nhắc tìm sự hỗ trợ.";
    return "Mức độ stress của bạn ở mức rất cao. Điều quan trọng là bạn cần tìm sự hỗ trợ chuyên nghiệp để cải thiện tình hình.";
  };

  useEffect(() => {
    const fetchAdvice = async () => {
      if (!result) return;
      setIsLoadingAdvice(true);
      setAdviceError(null);

      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        setAdviceError("API Key is not configured for advice generation.");
        setIsLoadingAdvice(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Một người cha vừa hoàn thành bài test tâm lý và có mức độ stress là ${result.percentage}%.
        Hãy đưa ra những nhận xét và lời khuyên cụ thể, mang tính hỗ trợ và xây dựng cho người cha này để giúp họ quản lý stress.
        Tập trung vào các giải pháp thiết thực mà một người cha có thể áp dụng trong cuộc sống hàng ngày.
        Lời khuyên nên ngắn gọn, khoảng 3-4 gạch đầu dòng.`;
        
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL_TEXT,
          contents: prompt,
        });
        
        const generatedAdvice = response.text;
        setResult(prev => prev ? { ...prev, advice: generatedAdvice } : null);
      } catch (err) {
        console.error("Error generating advice:", err);
        setAdviceError(`Không thể tạo lời khuyên: ${err instanceof Error ? err.message : String(err)}`);
        setResult(prev => prev ? { ...prev, advice: "Không thể tải lời khuyên lúc này." } : null);
      } finally {
        setIsLoadingAdvice(false);
      }
    };

    if (result && result.percentage > 0) { // Only fetch advice if there's a valid result
      fetchAdvice();
    } else if (result && result.percentage === 0) {
      setIsLoadingAdvice(false); // No need to fetch advice for 0% stress.
      setResult(prev => prev ? { ...prev, advice: "Chúc mừng bạn! Dường như bạn đang quản lý stress rất tốt." } : null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.percentage]); // Depend on result.percentage to refetch if it changes.

  if (!result) {
    return (
      <div className="text-center py-10">
        <LoadingIcon size="lg" />
        <p className="mt-4 text-lg text-gray-600">Đang tải kết quả...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-xl">
      <h1 className="text-4xl font-bold text-brand-dark-text text-center mb-8">Kết Quả Test Tâm Lý</h1>
      
      <div className="bg-indigo-50 p-6 rounded-lg shadow-inner mb-8">
        <h2 className="text-xl font-semibold text-brand-primary mb-2">Mức Độ Stress Của Bạn:</h2>
        <p className="text-5xl font-bold text-brand-accent mb-3">{result.percentage}%</p>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-gradient-button h-4 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${result.percentage}%` }}
          ></div>
        </div>
        <p className="text-gray-700 text-lg">{result.feedback}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-brand-primary mb-3">Nhận Xét & Lời Khuyên:</h2>
        {isLoadingAdvice ? (
          <div className="flex items-center space-x-2 text-gray-600">
            <LoadingIcon size="sm" /> <span>Đang tạo lời khuyên...</span>
          </div>
        ) : adviceError ? (
          <p className="text-red-500 bg-red-100 p-3 rounded-md">{adviceError}</p>
        ) : (
          <div className="text-gray-700 space-y-2 whitespace-pre-line">
            {result.advice?.split('\n').map((line, index) => (
              line.trim() ? <p key={index}>{line.startsWith('- ') || line.startsWith('* ') ? line : `- ${line}`}</p> : null
            ))}
          </div>
        )}
      </div>
      
      <div className="text-center mb-6">
         <Link to={Page.TestQuiz} className="text-brand-primary hover:text-brand-accent font-medium hover:underline">
            Xem lại & Giải thích đáp án (Tính năng sắp ra mắt)
          </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <StyledButton 
            onClick={() => navigate(Page.ContactExpert)}
            rightIcon={<IconChevronRight className="w-5 h-5"/>}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
        >
            Liên hệ chuyên gia
        </StyledButton>
        <StyledButton 
            onClick={() => navigate(Page.Home)}
            rightIcon={<IconChevronRight className="w-5 h-5"/>}
            size="lg"
            className="w-full sm:w-auto"
        >
            Về Trang chủ
        </StyledButton>
      </div>
    </div>
  );
};
