
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BackgroundArt } from './BackgroundArt';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-main text-brand-dark-text font-sans relative overflow-x-hidden">
      <BackgroundArt />
      <Header />
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 sm:pt-32 md:pt-28"> {/* Adjusted md:pt-28 in case mobile nav takes more space */}
        <Outlet />
      </main>
      {/* Footer could go here 
      <footer className="relative z-10 text-center py-8 mt-12 border-t border-brand-primary/20">
        <p className="text-sm text-brand-light-text">&copy; {new Date().getFullYear()} DadMind. All rights reserved.</p>
      </footer>
      */}
    </div>
  );
};