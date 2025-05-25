
import React, { useEffect, useState, Fragment } from 'react';
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
    let currentMaxScore = maxScore;
    if (maxScore === 0 && numQuestions > 0) { 
        currentMaxScore = numQuestions * 3; 
    }
    
    if (currentMaxScore > 0) {
        const percentage = Math.round((score / currentMaxScore) * 100);
        setResult({ score, maxScore: currentMaxScore, percentage, feedback: getFeedback(percentage) });
    } else {
        setResult({ score: 0, maxScore: 0, percentage: 0, feedback: "Không có dữ liệu điểm số để hiển thị." });
    }
  }, [score, maxScore, numQuestions]);

  const getFeedback = (percentage: number): string => {
    if (percentage <= 25) return "Mức độ stress của bạn ở mức rất thấp. Tuyệt vời! Hãy tiếp tục duy trì lối sống tích cực này.";
    if (percentage <= 50) return "Mức độ stress của bạn ở mức thấp đến trung bình. Bạn đang kiểm soát khá tốt, hãy chú ý thư giãn đều đặn.";
    if (percentage <= 75) return "Mức độ stress của bạn ở mức trung bình đến cao. Bạn nên xem xét các biện pháp giảm stress và tìm kiếm sự cân bằng.";
    return "Mức độ stress của bạn ở mức cao. Rất quan trọng để bạn tìm sự hỗ trợ chuyên nghiệp và áp dụng các chiến lược đối phó hiệu quả.";
  };

  useEffect(() => {
    const fetchAdvice = async () => {
      if (!result || typeof result.percentage !== 'number' || result.percentage < 0) {
        setIsLoadingAdvice(false);
        setResult(prev => prev ? { ...prev, advice: "Không đủ thông tin để tạo lời khuyên." } : null);
        return;
      }
      
      setIsLoadingAdvice(true);
      setAdviceError(null);

      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        setAdviceError("API Key is not configured. Personalized advice cannot be generated.");
        setIsLoadingAdvice(false);
        setResult(prev => prev ? { ...prev, advice: "Không thể tải lời khuyên do lỗi cấu hình." } : null);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Là một chuyên gia tâm lý cho DadMind, hãy phân tích kết quả test stress của một người cha.
        Người này có mức độ stress là ${result.percentage}%.
        Điểm số: ${result.score} / ${result.maxScore}.
        Dựa trên mức độ stress này (${result.feedback}), hãy cung cấp:
        1.  Một đoạn nhận xét ngắn (2-3 câu) về ý nghĩa của mức độ stress này đối với một người cha.
        2.  Từ 3 đến 4 lời khuyên cụ thể, thực tế, và mang tính động viên để giúp người cha này quản lý stress. Tập trung vào các giải pháp mà một người cha có thể áp dụng trong cuộc sống hàng ngày, liên quan đến gia đình, công việc, và bản thân.
        Sử dụng ngôn ngữ thân thiện, hỗ trợ.
        ĐỊNH DẠNG CÂU TRẢ LỜI: Sử dụng markdown. Mỗi mục lời khuyên phải bắt đầu bằng dấu gạch ngang và một khoảng trắng (ví dụ: "- Lời khuyên..."). Các đoạn văn bản (nhận xét, giới thiệu lời khuyên) phải được tách biệt nhau bằng một dòng trống. Không sử dụng các thẻ HTML.`;
        
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL_TEXT,
          contents: prompt,
        });
        
        const generatedAdvice = response.text;
        setResult(prev => prev ? { ...prev, advice: generatedAdvice } : null);
      } catch (err) {
        console.error("Error generating advice with Gemini:", err);
        const errorMsg = `Xin lỗi, đã có lỗi xảy ra khi tạo lời khuyên. Vui lòng thử lại sau. (${err instanceof Error ? err.message : String(err)})`;
        setAdviceError(errorMsg);
        setResult(prev => prev ? { ...prev, advice: "Không thể tải lời khuyên vào lúc này." } : null);
      } finally {
        setIsLoadingAdvice(false);
      }
    };

    if (result) {
      fetchAdvice();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.percentage, result?.score, result?.maxScore]); // Only re-fetch if these specific properties change after initial result object creation.

  if (!result) {
    return (
      <div className="text-center py-20">
        <LoadingIcon size="lg" />
        <p className="mt-6 text-lg text-brand-light-text">Đang tổng hợp kết quả của bạn...</p>
      </div>
    );
  }
  
  const renderMarkdown = (markdownText: string | undefined) => {
    if (!markdownText) return null;

    // Split by one or more newlines to handle paragraphs and lists
    const blocks = markdownText.split(/\n\s*\n/).filter(block => block.trim() !== '');

    return (
      <div className="prose prose-sm sm:prose-base max-w-none text-brand-light-text prose-headings:text-brand-primary prose-strong:text-brand-dark-text prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-p:my-2">
        {blocks.map((block, index) => {
          const lines = block.split('\n').map(line => line.trim()).filter(line => line !== '');
          const isList = lines.every(line => line.startsWith('- ') || line.startsWith('* '));

          if (isList) {
            return (
              <ul key={index}>
                {lines.map((item, i) => (
                  <li key={i}>{item.substring(2)}</li>
                ))}
              </ul>
            );
          } else {
            // Join lines back for a paragraph, but render each line for safety if they were meant to be separate visually
            // Prose class should handle styling for <p>
            return <p key={index}>{lines.join(' ')}</p>; 
          }
        })}
      </div>
    );
  };


  return (
    <div className="max-w-3xl mx-auto bg-brand-bg-card p-6 sm:p-10 rounded-2xl shadow-card">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark-text text-center mb-8 sm:mb-10">Kết Quả Test Tâm Lý</h1>
      
      <div className="bg-brand-bg-light p-6 sm:p-8 rounded-xl shadow-inner border border-brand-border/50 mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-brand-primary mb-3 text-center">Mức Độ Stress Của Bạn:</h2>
        <p className="text-5xl sm:text-6xl font-bold text-brand-accent mb-4 text-center">{result.percentage}%</p>
        <div className="w-full bg-brand-border rounded-full h-5 mb-4 shadow-inner">
          <div 
            className="bg-gradient-button h-5 rounded-full transition-width duration-1000 ease-out flex items-center justify-center text-white text-xs font-medium" 
            style={{ width: `${result.percentage}%` }}
            role="progressbar"
            aria-valuenow={result.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {result.percentage > 10 ? `${result.percentage}%` : ''}
          </div>
        </div>
        <p className="text-brand-dark-text text-base sm:text-lg text-center font-medium">{result.feedback}</p>
      </div>

      <div className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-brand-primary mb-4">Nhận Xét & Lời Khuyên từ DadMind AI:</h2>
        {isLoadingAdvice ? (
          <div className="flex flex-col items-center text-center space-y-3 text-brand-light-text bg-brand-bg-subtle/70 p-6 rounded-lg shadow-sm border border-brand-border/30">
            <LoadingIcon size="md" /> 
            <span className="text-sm font-medium">Đang tạo lời khuyên được cá nhân hóa cho bạn...</span>
          </div>
        ) : adviceError ? (
          <p className="text-red-500 bg-red-100 p-4 rounded-lg text-sm shadow-sm border border-red-200">{adviceError}</p>
        ) : (
          // The prose classes are defined in tailwind.config.js and will style the HTML elements generated by renderMarkdown
           renderMarkdown(result.advice)
        )}
      </div>
      
      <div className="text-center mb-8 sm:mb-10">
         <Link to={Page.TestQuiz} className="text-brand-primary hover:text-brand-accent font-medium hover:underline transition-colors text-sm">
            Làm lại bài test
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
            Liên hệ Chuyên gia
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