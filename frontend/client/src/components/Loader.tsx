import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const fontSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
  };

  return (
    <div className={`inline-block relative ${sizes[size]} ${className}`}>
      <div className="absolute inset-0 rounded-full border-4 border-hathor-purple opacity-25 animate-pulse-light"></div>
      <div className="absolute inset-2 rounded-full border-t-4 border-hathor-purple animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-hathor-purple font-bold ${fontSizes[size]}`}>HTR</span>
      </div>
    </div>
  );
};

export default Loader;
