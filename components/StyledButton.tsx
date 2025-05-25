
import React from 'react';

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const StyledButton: React.FC<StyledButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = `font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 
                     flex items-center justify-center space-x-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]`;
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-gradient-button text-white hover:opacity-95 focus:ring-pink-500';
      break;
    case 'secondary':
      variantStyle = 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 focus:ring-brand-primary';
      break;
    case 'outline':
      variantStyle = 'border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10 focus:ring-brand-accent';
      break;
    case 'subtle':
      variantStyle = 'bg-transparent text-brand-light-text hover:text-brand-primary hover:bg-brand-primary/5 focus:ring-brand-primary/50';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-3.5 py-2 text-sm';
      break;
    case 'md':
      sizeStyle = 'px-5 py-2.5 text-base';
      break;
    case 'lg':
      sizeStyle = 'px-8 py-3.5 text-lg';
      break;
  }

  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-1.5">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="ml-1.5">{rightIcon}</span>}
    </button>
  );
};