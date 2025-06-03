import React, { useState } from "react";
import Layout from "@/components/Layout";
import SendTokenModal from "@/components/SendTokenModal";
import ReceiveTokenModal from "@/components/ReceiveTokenModal";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/lib/wallet/WalletContext";

type Transaction = {
  id: string;
  type: 'received' | 'sent' | 'created';
  symbol: string;
  amount: number;
  from?: string;
  to?: string;
  group?: string;
  time: string;
  token?: {
    id: string;
    name: string;
    symbol: string;
    type: string;
    balance: number;
  };
};

const Wallet: React.FC = () => {
  const { toast } = useToast();
  const { wallet } = useWallet();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(undefined);
  const [transactions] = useState<Transaction[]>([]);

  const handleSendToken = async (recipient: string, tokenId: string, amount: number, message?: string) => {
    // Show coming soon notification
    toast({
      title: "Coming Soon",
      description: "Token sending functionality will be available soon!",
    });
  };

  const handleTokenSelect = (token: any) => {
    setSelectedToken(token);
    setShowSendModal(true);
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

      {/* Wallet Address */}
      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 flex items-center justify-between shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="truncate flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Wallet Address</p>
            <p className="text-sm font-mono truncate">
              {wallet?.address || "Connect your wallet"}
            </p>
          </div>
          <button
            className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
            onClick={() => {
              if (wallet?.address) {
                navigator.clipboard.writeText(wallet.address);
                toast({
                  title: "Success",
                  description: "Wallet address copied to clipboard!",
                });
              }
            }}
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
      </div>

      {/* All Tokens Section */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">All Tokens</h2>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm text-center border border-neutral-200 dark:border-neutral-700 mb-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-neutral-500 dark:text-neutral-400">No tokens yet</p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Create or receive tokens to see them here</p>
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

export default Wallet;
