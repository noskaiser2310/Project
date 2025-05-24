
import React from 'react';
import { IconHeart, IconStar, IconWatch, IconTie } from '../constants';

const BackgroundIcon: React.FC<{ icon: React.ElementType; top: string; left?: string; right?: string; size: string; opacity: string; rotate?: string; animate?: string }> = 
  ({ icon: IconComponent, top, left, right, size, opacity, rotate = '0', animate }) => {
  const style: React.CSSProperties = {
    top,
    ...(left && { left }),
    ...(right && { right }),
    transform: `rotate(${rotate})`,
    animation: animate,
  };
  return (
    <div className={`absolute ${size} ${opacity} text-indigo-200/50`} style={style}>
      <IconComponent className="w-full h-full" />
    </div>
  );
};


export const BackgroundArt: React.FC = () => {
  return (
    <>
      {/* Subtle pattern elements */}
      <BackgroundIcon icon={IconHeart} top="10%" left="5%" size="w-16 h-16" opacity="opacity-30" rotate="-15deg" />
      <BackgroundIcon icon={IconStar} top="15%" right="8%" size="w-12 h-12" opacity="opacity-20" rotate="10deg" />
      <BackgroundIcon icon={IconWatch} top="60%" left="10%" size="w-20 h-20" opacity="opacity-25" rotate="5deg" />
      <BackgroundIcon icon={IconTie} top="70%" right="12%" size="w-16 h-16" opacity="opacity-30" rotate="-5deg" />
      <BackgroundIcon icon={IconHeart} top="30%" left="35%" size="w-8 h-8" opacity="opacity-10" rotate="25deg" />
      <BackgroundIcon icon={IconStar} top="80%" left="45%" size="w-10 h-10" opacity="opacity-15" rotate="0deg" />

      {/* Large decorative circles/shapes from design */}
      <div 
        className="absolute top-[-50px] right-[-100px] w-[400px] h-[400px] bg-purple-200/20 rounded-full filter blur-2xl opacity-50 pointer-events-none"
      />
      <div 
        className="absolute bottom-[-80px] left-[-120px] w-[350px] h-[350px] bg-pink-200/20 rounded-full filter blur-2xl opacity-40 pointer-events-none"
      />
       <div 
        className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-dashed border-indigo-300/30 rounded-full opacity-30 pointer-events-none"
      />
    </>
  );
};
