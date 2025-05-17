import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-neutral-900 z-50">
      <div className="text-center">
        <div className="inline-block relative w-20 h-20">
          {/* Animated HTR logo loader */}
          <div className="absolute inset-0 rounded-full border-4 border-hathor-purple opacity-25 animate-pulse-light"></div>
          <div className="absolute inset-2 rounded-full border-t-4 border-hathor-purple animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-hathor-purple text-2xl font-bold">HTR</span>
          </div>
        </div>
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">Loading HathorChat...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
