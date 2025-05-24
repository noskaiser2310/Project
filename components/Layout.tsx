
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BackgroundArt } from './BackgroundArt';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-main text-brand-dark-text font-sans relative overflow-x-hidden">
      <BackgroundArt />
      <Header />
      <main className="relative z-10 container mx-auto px-4 py-8 pt-24">
        <Outlet />
      </main>
      {/* Footer could go here */}
    </div>
  );
};
