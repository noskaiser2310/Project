
import React from 'react';
import { Link } from 'react-router-dom';
import { StyledButton } from '../components/StyledButton';
import { Page } from '../types';
import { IconChevronLeft } from '../constants'; 

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-15rem)] flex flex-col items-center justify-center text-center p-6 bg-brand-bg-card rounded-2xl shadow-card max-w-2xl mx-auto my-10">
      <h1 className="text-7xl sm:text-9xl font-extrabold text-brand-primary mb-4">404</h1>
      <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark-text mb-6">
        Ối! Có vẻ bạn đi lạc đường rồi.
      </h2>
      <p className="text-lg text-brand-light-text mb-10 max-w-md leading-relaxed">
        Đừng lo lắng, ngay cả những người cha tốt nhất đôi khi cũng cần tìm lại phương hướng. Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <StyledButton 
        size="lg" 
        onClick={() => {}} 
        className="w-auto"
        leftIcon={<IconChevronLeft className="w-5 h-5"/>}
      >
        <Link to={Page.Home} className="flex items-center">
          Về Trang Chủ An Toàn
        </Link>
      </StyledButton>
    </div>
  );
};