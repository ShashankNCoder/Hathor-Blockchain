import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WalletContextType {
  wallet: {
    address: string;
  } | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  isAuthenticated: false,
  logout: () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<{ address: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Debug the auth state when it changes
  useEffect(() => {
    console.log("WalletContext: Authentication state changed:", isAuthenticated, "Wallet:", wallet);
  }, [isAuthenticated, wallet]);

  const logout = () => {
    setWallet(null);
    setIsAuthenticated(false);
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
