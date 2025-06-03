import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WalletContextType {
  wallet: {
    address: string;
  } | null;
  setWallet: (wallet: { address: string } | null) => void;
  disconnect: () => void;
  isAuthenticated: boolean;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {},
  disconnect: () => {},
  isAuthenticated: false,
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<{ address: string } | null>(() => {
    // Initialize from localStorage
    const savedWallet = localStorage.getItem('wallet');
    return savedWallet ? JSON.parse(savedWallet) : null;
  });
  const { toast } = useToast();


  const handleSetWallet = (newWallet: { address: string } | null) => {
    setWallet(newWallet);
    // Save to localStorage
    if (newWallet) {
      localStorage.setItem('wallet', JSON.stringify(newWallet));
    } else {
      localStorage.removeItem('wallet');
    }
  };

  const disconnect = () => {
    setWallet(null);
    localStorage.removeItem('wallet');
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet: handleSetWallet,
        disconnect,
        isAuthenticated: !!wallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}; 