import React from 'react';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showBackButton = false }) => {
  const goBack = () => window.history.back();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={goBack}
                className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-base font-medium text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader; 