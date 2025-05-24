
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { StyledButton } from '../components/StyledButton';
import { IconChevronLeft } from '../constants';
import { Page } from '../types';


export const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }
    // Mock login
    console.log('Login attempt with:', email, password);
    auth?.login({ id: '1', name: email.split('@')[0] || 'User', email });
    navigate(Page.Home);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-2xl rounded-xl relative">
        <Link to={Page.Home} className="absolute top-4 left-4 text-brand-primary hover:text-brand-accent">
          <IconChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-dark-text">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đăng nhập ngay để cùng DadMind giải quyết vấn đề của bạn!
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
              />
            </div>
            <div>
              <label htmlFor="password sr-only">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <div>
            <StyledButton type="submit" className="w-full" size="lg">
              Tiếp tục
            </StyledButton>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to={Page.Register} className="font-medium text-brand-primary hover:text-brand-accent">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
