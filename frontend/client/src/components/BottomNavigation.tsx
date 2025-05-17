import React from "react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  activeTab: 'home' | 'wallet' | 'rewards' | 'profile';
  onCreateClick: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onCreateClick }) => {
  const [, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around items-center h-16">
        <button 
          className="flex flex-col items-center justify-center w-full h-full"
          onClick={() => setLocation("/home")}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${activeTab === 'home' ? 'text-[#2aabee]' : 'text-neutral-400'}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className={`text-[10px] mt-0.5 ${activeTab === 'home' ? 'text-[#2aabee] font-medium' : 'text-neutral-500'}`}>Home</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center w-full h-full"
          onClick={() => setLocation("/wallet")}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${activeTab === 'wallet' ? 'text-[#2aabee]' : 'text-neutral-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className={`text-[10px] mt-0.5 ${activeTab === 'wallet' ? 'text-[#2aabee] font-medium' : 'text-neutral-500'}`}>Wallet</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center w-full h-full"
          onClick={onCreateClick}
        >
          <div className="bg-[#2aabee] rounded-full p-2 -mt-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center w-full h-full"
          onClick={() => setLocation("/rewards")}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${activeTab === 'rewards' ? 'text-[#2aabee]' : 'text-neutral-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <span className={`text-[10px] mt-0.5 ${activeTab === 'rewards' ? 'text-[#2aabee] font-medium' : 'text-neutral-500'}`}>Rewards</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center w-full h-full"
          onClick={() => setLocation("/profile")}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${activeTab === 'profile' ? 'text-[#2aabee]' : 'text-neutral-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className={`text-[10px] mt-0.5 ${activeTab === 'profile' ? 'text-[#2aabee] font-medium' : 'text-neutral-500'}`}>Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;
