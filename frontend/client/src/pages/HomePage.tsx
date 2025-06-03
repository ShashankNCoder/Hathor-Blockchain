import React, { useState } from 'react';
import { useWallet } from '@/lib/wallet/WalletContext';
import Layout from '@/components/Layout';
import TokenCard from '@/components/wallet/TokenCard';
import NftBadgeCard from '@/components/wallet/NftBadge';
import TransactionItem from '@/components/wallet/TransactionItem';
import SendTokenModal from '@/components/SendTokenModal';
import ReceiveTokenModal from '@/components/ReceiveTokenModal';
import { Transaction, NFTBadge } from '@/lib/hathor';
import { useToast } from '@/hooks/use-toast';
import { useComingSoon } from '@/hooks/use-coming-soon';
import { useLocation } from 'wouter';

const HomePage: React.FC = () => {
  const { wallet } = useWallet();
  const isAuthenticated = !!wallet;
  const { toast } = useToast();
  const { notifyComingSoon } = useComingSoon();
  const [, setLocation] = useLocation();
  
  const [tokens, setTokens] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [badges, setBadges] = useState<NFTBadge[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(undefined);

  const handleCopyAddress = async () => {
    const address = wallet?.address;
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Success",
        description: "Wallet address copied to clipboard!",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy address to clipboard",
      });
    }
  };

  const handleSendToken = async (recipient: string, tokenId: string, amount: number, message?: string) => {
    if (!wallet?.address) return;

    try {
      toast({
        title: "Success",
        description: "Transaction sent successfully!",
      });
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send transaction",
      });
    }
  };

  const handleViewAll = (section: string) => {
    setLocation('/wallet');
  };

  return (
    <Layout showHeader showNavigation>
      <div className="p-4">
        <div className="bg-[#2aabee] rounded-xl p-5 text-white shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-medium opacity-80">Wallet</h2>
            </div>
            <button 
              onClick={() => setShowReceiveModal(true)}
              className="bg-white/20 rounded-lg p-2 hover:bg-white/30 transition-colors"
            >
              <i className="fas fa-qrcode text-white"></i>
            </button>
          </div>
          <div className="flex space-x-3 mt-5">
            <button 
              onClick={() => {
                setSelectedToken(undefined);
                setShowSendModal(true);
              }}
              className="flex-1 bg-white/20 rounded-lg py-2 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <i className="fas fa-arrow-up mr-2"></i>
              <span>Send</span>
            </button>
            <button 
              onClick={() => setShowReceiveModal(true)}
              className="flex-1 bg-white/20 rounded-lg py-2 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <i className="fas fa-arrow-down mr-2"></i>
              <span>Receive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Address (Copyable) */}
      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 flex items-center justify-between shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="truncate flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Wallet Address</p>
            <p className="text-sm font-mono truncate" id="wallet-address">
              {wallet?.address || "Connect your wallet"}
            </p>
          </div>
          <button
            className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
            onClick={handleCopyAddress}
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
      </div>

      {/* My Tokens Section */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">My Tokens</h2>
          <button 
            className="text-sm text-hathor-purple dark:text-hathor-light"
            onClick={() => handleViewAll('tokens')}
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="text-center py-4 text-neutral-500">
            <p>No tokens found</p>
          </div>
        </div>
      </div>

      {/* My NFT Badges */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">My NFT Badges</h2>
          <button 
            className="text-sm text-hathor-purple dark:text-hathor-light"
            onClick={() => handleViewAll('badges')}
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center py-4 col-span-3 text-neutral-500">
            <p>No badges found</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Recent Activity</h2>
          <button 
            className="text-sm text-hathor-purple dark:text-hathor-light"
            onClick={() => handleViewAll('transactions')}
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="text-center py-4 text-neutral-500">
            <p>No recent activity</p>
          </div>
        </div>
      </div>

      {/* Content Teaser - Token-Gated Access */}
      <div className="px-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 text-white shadow-md mb-20">
          <div className="w-full h-32 bg-blue-400/30 rounded-lg mb-4 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-16 h-16 text-white/80"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M8 10h8" />
              <path d="M12 14V6" />
            </svg>
          </div>
          
          <h3 className="font-bold text-lg mb-1">Exclusive Content Available</h3>
          <p className="text-sm opacity-90 mb-4">Access premium resources by holding 10+ BREW tokens in your wallet.</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-500 mr-2">
                <i className="fas fa-lock-open text-xs"></i>
              </div>
              <span className="text-sm font-medium">You qualify!</span>
            </div>
            <button 
              className="bg-white text-blue-500 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-50"
              onClick={() => notifyComingSoon("Premium Content")}
            >
              View Content
            </button>
          </div>
        </div>
      </div>

      <SendTokenModal 
        isVisible={showSendModal}
        onClose={() => setShowSendModal(false)}
        tokens={[]}
        selectedToken={selectedToken}
        onSend={handleSendToken}
      />
      <ReceiveTokenModal 
        isVisible={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        walletAddress={wallet?.address || ""}
      />
    </Layout>
  );
};

export default HomePage;
