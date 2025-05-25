
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
    const nameFromEmail = email.split('@')[0];
    auth?.login({ id: '1', name: nameFromEmail || 'User', email });
    navigate(Page.Home);
  };

  return (
    <div className="min-h-[calc(100vh-15rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 bg-brand-bg-card shadow-card rounded-2xl relative">
        <Link to={Page.Home} className="absolute top-6 left-6 text-brand-primary hover:text-brand-accent transition-colors" aria-label="Quay về trang chủ">
          <IconChevronLeft className="w-7 h-7" />
        </Link>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-dark-text">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-brand-light-text">
            Đăng nhập ngay để cùng DadMind giải quyết vấn đề của bạn!
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg shadow-sm">{error}</p>}
          <div className="rounded-md space-y-4">
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
                className="appearance-none relative block w-full px-4 py-3 border border-brand-border placeholder-gray-500 text-brand-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:z-10 sm:text-sm transition-shadow focus:shadow-md"
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
                className="appearance-none relative block w-full px-4 py-3 border border-brand-border placeholder-gray-500 text-brand-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:z-10 sm:text-sm transition-shadow focus:shadow-md"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            {/* <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand-primary focus:ring-brand-accent border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-brand-light-text"> Remember me </label>
            </div> */}
            <Link to="#" className="font-medium text-brand-primary hover:text-brand-accent transition-colors">
              Quên mật khẩu?
            </Link>
          </div>

          <div>
            <StyledButton type="submit" fullWidth size="lg">
              Tiếp tục
            </StyledButton>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-brand-light-text">
          Chưa có tài khoản?{' '}
          <Link to={Page.Register} className="font-medium text-brand-primary hover:text-brand-accent transition-colors hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};