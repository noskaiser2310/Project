
import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { APP_LOGO_TEXT, IconLogo, IconUserCircle } from '../constants';
import { StyledButton } from './StyledButton';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, children, isMobile }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap
        ${isMobile ? 'block w-full text-center text-base py-3 ' : 'text-sm '}
        ${isActive 
          ? 'bg-white/20 text-white shadow-inner font-semibold scale-105' 
          : 'text-indigo-100 hover:bg-white/10 hover:text-white'
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-header">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          <Link to="/home" className="flex items-center text-brand-primary hover:text-brand-accent transition-colors group">
            <IconLogo className="h-9 w-9 sm:h-10 sm:w-10 mr-2.5 text-brand-primary transition-transform duration-300 group-hover:scale-105" />
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark-text group-hover:text-brand-accent">
              {APP_LOGO_TEXT}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-gradient-nav p-1.5 rounded-xl shadow-md">
            <NavItem to="/home">Trang chủ</NavItem>
            <NavItem to="/ask-me">Ask me!</NavItem>
            <NavItem to="/test">Test tâm lý</NavItem>
            <NavItem to="/contact-expert">Liên hệ chuyên gia</NavItem>
          </nav>
          
          <div className="flex items-center">
            {auth?.currentUser ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <IconUserCircle className="h-8 w-8 text-brand-primary hidden sm:block" />
                <span className="text-sm font-medium text-brand-dark-text">
                  Chào, <span className="font-semibold">{auth.currentUser.name}</span>
                </span>
                <StyledButton
                  variant="outline"
                  size="sm"
                  onClick={auth.logout}
                  aria-label="Đăng xuất"
                  className="!px-3 !py-1.5 text-xs sm:!text-sm"
                >
                  Đăng xuất
                </StyledButton>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-200 rounded-lg border-2 border-brand-primary hover:shadow-interactive"
              >
                Đăng ký / Đăng nhập
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around space-x-0.5 bg-gradient-nav p-1 rounded-xl shadow-md my-2">
            <NavItem to="/home" isMobile>Home</NavItem>
            <NavItem to="/ask-me" isMobile>Ask</NavItem>
            <NavItem to="/test" isMobile>Test</NavItem>
            <NavItem to="/contact-expert" isMobile>Expert</NavItem>
        </div>
      </div>
    </header>
  );
};