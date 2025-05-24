
import React from 'react';
import { Link } from 'react-router-dom';
import { StyledButton } from '../components/StyledButton';
import { Page } from '../types';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-brand-dark-text mb-6">Oops! Trang không tồn tại.</h2>
      <p className="text-lg text-gray-600 mb-8">
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn yêu cầu.
        <br />
        Có vẻ như bạn đã đi lạc một chút.
      </p>
      <StyledButton size="lg" onClick={() => {}} className="w-auto">
        <Link to={Page.Home}>Về Trang Chủ</Link>
      </StyledButton>
    </div>
  );
};
