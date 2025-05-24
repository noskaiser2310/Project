
import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { User } from '../types';
import { APP_NAME, IconLogo, IconUserCircle } from '../constants';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-white/20 ${
          isActive ? 'text-white font-semibold' : 'text-indigo-100'
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export const Header: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/home" className="flex items-center text-brand-primary hover:text-brand-accent transition-colors">
            <IconLogo className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 bg-gradient-nav p-1 rounded-xl shadow-md">
            <NavItem to="/home">Trang chủ</NavItem>
            <NavItem to="/ask-me">Ask me!</NavItem>
            <NavItem to="/test">Test tâm lý</NavItem>
            <NavItem to="/contact-expert">Liên hệ chuyên gia</NavItem>
          </nav>
          
          <div className="flex items-center">
            {auth?.currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Chào, {auth.currentUser.name}
                </span>
                <IconUserCircle className="h-8 w-8 text-brand-primary" />
                <button
                  onClick={auth.logout}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors rounded-md border border-brand-primary hover:border-brand-accent"
              >
                Đăng ký / Đăng nhập
              </Link>
            )}
          </div>
        </div>
        {/* Mobile Nav (simplified) */}
        <div className="md:hidden flex items-center justify-center space-x-1 bg-gradient-nav p-1 rounded-xl shadow-md my-2">
            <NavItem to="/home">Home</NavItem>
            <NavItem to="/ask-me">Ask</NavItem>
            <NavItem to="/test">Test</NavItem>
            <NavItem to="/contact-expert">Expert</NavItem>
        </div>
      </div>
    </header>
  );
};
