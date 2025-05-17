import React, { useState } from 'react';
import { useLocation } from 'wouter';
import CreateTokenModal from './CreateTokenModal';
import { useToast } from '@/hooks/use-toast';

interface ActionPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ isVisible, onClose }) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showCreateTokenModal, setShowCreateTokenModal] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case 'send':
        onClose();
        navigate('/wallet');
        toast({
          title: "Send Tokens",
          description: "You can send tokens from the wallet page"
        });
        break;
      case 'create-token':
        onClose();
        navigate('/create-token');
        break;
      case 'create-community':
        onClose();
        navigate('/create-token');
        break;
      default:
        onClose();
        break;
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="slide-up-panel bg-white dark:bg-neutral-800 fixed bottom-0 left-0 right-0 p-5 z-50 max-w-md mx-auto rounded-t-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Actions</h3>
          <button className="p-1" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <button
            className="w-full flex items-center p-4 bg-[#2aabee] bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
            onClick={() => handleAction('send')}
          >
            <div className="bg-[#2aabee] rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-medium text-neutral-900 dark:text-white">Send Tokens</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Send HTR or community tokens to others</p>
            </div>
          </button>
          
          <button
            className="w-full flex items-center p-4 bg-[#2aabee] bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
            onClick={() => handleAction('create-token')}
          >
            <div className="bg-[#2aabee] rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-medium text-neutral-900 dark:text-white">Create Token</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Create a new community token</p>
            </div>
          </button>
          
          <button
            className="w-full flex items-center p-4 bg-[#2aabee] bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
            onClick={() => handleAction('create-community')}
          >
            <div className="bg-[#2aabee] rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-medium text-neutral-900 dark:text-white">Create Token-Gated Community</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Require tokens to access a Telegram group</p>
            </div>
          </button>
        </div>
      </div>
      
      <CreateTokenModal 
        isVisible={showCreateTokenModal}
        onClose={() => setShowCreateTokenModal(false)}
        onSuccess={(tokenId, name, symbol) => {
          toast({
            title: "Token Created Successfully",
            description: `${name} (${symbol}) has been created. You can now use it in your communities.`
          });
        }}
      />
    </>
  );
};

export default ActionPanel; 