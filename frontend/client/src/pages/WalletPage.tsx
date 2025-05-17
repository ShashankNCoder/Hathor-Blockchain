import React, { useState } from "react";
import Layout from "@/components/Layout";
import SendTokenModal from "@/components/SendTokenModal";
import ReceiveTokenModal from "@/components/ReceiveTokenModal";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import hathorApi from "@/lib/api";
import { initTelegramApp, getUserInfo } from "@/lib/telegram";
import { Token, TokenBalance } from "@/types";

type TokenWithBalance = Token & TokenBalance;

type Transaction = {
  id: string;
  type: 'received' | 'sent' | 'created';
  symbol: string;
  amount: number;
  from?: string;
  to?: string;
  group?: string;
  time: string;
};

const Wallet: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenWithBalance | undefined>(undefined);
  
  // Initialize Telegram WebApp
  initTelegramApp();
  const userInfo = getUserInfo();

  // Get current user info
  const { 
    data: user,
    isLoading: isUserLoading
  } = useQuery({
    queryKey: ['/api/users/me'],
    queryFn: async () => hathorApi.getCurrentUser()
  });

  // Get wallet info
  const { 
    data: wallet,
    isLoading: isWalletLoading,
    refetch: refetchWallet
  } = useQuery({
    queryKey: ['/api/wallets'],
    queryFn: async () => hathorApi.getWallet(),
    enabled: !!user
  });

  // Get community tokens
  const {
    data: tokens = [],
    isLoading: isTokensLoading,
    refetch: refetchTokens
  } = useQuery({
    queryKey: ['/api/tokens/community'],
    queryFn: async () => hathorApi.getCommunityTokens(),
    enabled: !!user
  });

  // Get transactions
  const {
    data: transactions = [],
    isLoading: isTransactionsLoading
  } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
    queryFn: async () => hathorApi.getTransactions(),
    enabled: !!user
  });

  // Send token mutation
  const sendTokenMutation = useMutation({
    mutationFn: async (data: {
      recipient: string;
      tokenId: number;
      amount: number;
      message?: string;
    }) => {
      return hathorApi.sendToken({
        recipient: data.recipient,
        tokenId: data.tokenId,
        amount: data.amount,
        message: data.message
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/community'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    }
  });

  const handleSendToken = async (recipient: string, tokenId: string, amount: number, message?: string) => {
    await sendTokenMutation.mutateAsync({ recipient, tokenId: parseInt(tokenId), amount, message });
  };

  const handleRefreshWallet = () => {
    refetchWallet();
    refetchTokens();
  };

  const handleTokenSelect = (token: TokenWithBalance) => {
    setSelectedToken(token);
    setShowSendModal(true);
  };

  return (
    <Layout showHeader showNavigation>
      <div className="p-4">
        <div className="bg-[#2aabee] rounded-xl p-5 text-white shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-medium opacity-80">Total Balance</h2>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold">
                  {wallet?.balance.toLocaleString() || '0'}
                </span>
                <span className="ml-1 text-sm opacity-80">HTR</span>
              </div>
            </div>
            <button 
              onClick={handleRefreshWallet}
              className="bg-white/20 rounded-lg p-2 hover:bg-white/30 transition-colors"
            >
              <i className="fas fa-sync-alt text-white"></i>
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
              {wallet?.address || "Loading..."}
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
          {isTokensLoading && (
            <div className="w-6 h-6 border-t-2 border-b-2 border-[#2aabee] rounded-full animate-spin"></div>
          )}
        </div>
        
        <div className="space-y-3">
          {tokens.length === 0 && !isTokensLoading ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm text-center border border-neutral-200 dark:border-neutral-700 mb-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-neutral-500 dark:text-neutral-400">No tokens yet</p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Create or receive tokens to see them here</p>
            </div>
          ) : (
            tokens.map((token: TokenWithBalance) => (
              <div 
                key={token.id} 
                className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                onClick={() => handleTokenSelect(token)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#2aabee] bg-opacity-10 flex items-center justify-center mr-3">
                    <i className="fas fa-coins text-[#2aabee]"></i>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{token.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-900 dark:text-white">{token.balance.toFixed(2)}</p>
                  <p 
                    className="text-xs text-[#2aabee] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTokenSelect(token);
                    }}
                  >
                    Send
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Transaction History</h2>
          {isTransactionsLoading && (
            <div className="w-6 h-6 border-t-2 border-b-2 border-[#2aabee] rounded-full animate-spin"></div>
          )}
        </div>
        
        <div className="space-y-3">
          {transactions.length === 0 && !isTransactionsLoading ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm text-center border border-neutral-200 dark:border-neutral-700 mb-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-neutral-500 dark:text-neutral-400">No transactions yet</p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Start sending or receiving tokens to see your transaction history</p>
            </div>
          ) : (
            transactions.map((tx: Transaction) => (
              <div 
                key={tx.id} 
                className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-center">
                  {tx.type === 'received' && (
                    <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 mr-3">
                      <i className="fas fa-arrow-down text-green-500"></i>
                    </div>
                  )}
                  {tx.type === 'sent' && (
                    <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-2 mr-3">
                      <i className="fas fa-arrow-up text-red-500"></i>
                    </div>
                  )}
                  {tx.type === 'created' && (
                    <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-2 mr-3">
                      <i className="fas fa-plus text-yellow-500"></i>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {tx.type === 'received' && `Received ${tx.symbol}`}
                        {tx.type === 'sent' && `Sent ${tx.symbol}`}
                        {tx.type === 'created' && `Created ${tx.symbol}`}
                      </p>
                      <p className={`font-bold ${
                        tx.type === 'received' ? 'text-green-500' : 
                        tx.type === 'sent' ? 'text-red-500' : 
                        'text-yellow-500'
                      }`}>
                        {tx.type === 'received' && `+${tx.amount}`}
                        {tx.type === 'sent' && `-${tx.amount}`}
                        {tx.type === 'created' && tx.amount}
                      </p>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {tx.from && `From: ${tx.from}`}
                        {tx.to && `To: ${tx.to}`}
                        {tx.group && tx.group}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{tx.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SendTokenModal 
        isVisible={showSendModal}
        onClose={() => setShowSendModal(false)}
        tokens={tokens}
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
