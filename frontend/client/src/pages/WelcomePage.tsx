import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useWallet } from '@/context/WalletContext';
import logo from '@/assets/logo.png';
import { WalletConnect } from '@/components/WalletConnect';

const WelcomePage: React.FC = () => {
  const { isAuthenticated, wallet } = useWallet();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Only redirect if we have both authentication and a wallet address
    if (isAuthenticated && wallet?.address) {
      setLocation('/home');
    }
  }, [isAuthenticated, wallet, setLocation]);

  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-40 h-40 rounded-full overflow-hidden mb-8 bg-hathor-purple/10 flex items-center justify-center">
          <img 
            src={logo}
            alt="Hathor Logo"
            className="w-24 h-24"
          />
        </div>
        
        <div className="w-full max-w-[200px] mb-4">
          <WalletConnect />
        </div>
        
        <button 
          onClick={() => setLocation('/home')} 
          className="bg-hathor-purple-700 hover:bg-hathor-purple-600 text-white rounded-full px-8 py-2 mb-8 font-medium outline outline-1 outline-hathor-purple-600"
        >
          Start
        </button>
        
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome to HathorChat</h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-10">Tokenized Communities in Telegram</p>
      </div>
      
      <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p>Your wallet is securely tied to your Telegram account.</p>
        <p className="mt-1">No seed phrases to remember!</p>
      </div>
    </div>
  );
};

export default WelcomePage;
