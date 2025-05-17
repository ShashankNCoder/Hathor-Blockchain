import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import hathorApi from "@/lib/api";
import { initTelegramApp, getUserInfo } from "@/lib/telegram";
import { useLocation } from "wouter";
import { useWallet } from "@/context/WalletContext";
import { useComingSoon } from "@/hooks/use-coming-soon";

const Profile: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [, setLocation] = useLocation();
  const { logout } = useWallet();
  const { notifyComingSoon } = useComingSoon();

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
    isLoading: isWalletLoading
  } = useQuery({
    queryKey: ['/api/wallets'],
    queryFn: async () => hathorApi.getWallet(),
    enabled: !!user
  });

  // Get NFT badges count
  const {
    data: badges = [],
    isLoading: isBadgesLoading
  } = useQuery({
    queryKey: ['/api/badges'],
    queryFn: async () => hathorApi.getNftBadges(),
    enabled: !!user
  });

  // Get tokens count
  const {
    data: tokens = [],
    isLoading: isTokensLoading
  } = useQuery({
    queryKey: ['/api/tokens/community'],
    queryFn: async () => hathorApi.getCommunityTokens(),
    enabled: !!user
  });

  // Get transaction count
  const {
    data: transactions = [],
    isLoading: isTransactionsLoading
  } = useQuery({
    queryKey: ['/api/transactions'],
    queryFn: async () => hathorApi.getTransactions(),
    enabled: !!user
  });

  const telegramUser = getUserInfo();
  const username = user?.username || telegramUser?.username || "User";
  
  const copyWalletAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      toast({
        title: "Wallet Address Copied",
        description: "The wallet address has been copied to clipboard."
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear wallet data
      logout();
      
      // Show success message
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });

      // Redirect to root page
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout title="Profile" showNavigation>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Profile Header */}
          <div className="bg-[#2aabee] rounded-xl p-5 text-white shadow-md mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-3 text-3xl font-bold text-[#2aabee]">
                {username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-white text-xl font-bold">@{username}</h2>
              <p className="text-white text-sm opacity-80 mb-4">Telegram User</p>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 flex items-center justify-between shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
            <div className="truncate flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Wallet Address</p>
              <p className="text-sm font-mono truncate">
                {isWalletLoading ? "Loading..." : wallet?.address}
              </p>
            </div>
            <button
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
              onClick={copyWalletAddress}
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 text-center">
              <p className="text-neutral-900 dark:text-white text-sm font-bold">
                {isTokensLoading ? "-" : tokens.length}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">Tokens</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 text-center">
              <p className="text-neutral-900 dark:text-white text-sm font-bold">
                {isBadgesLoading ? "-" : badges.length}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">Badges</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 text-center">
              <p className="text-neutral-900 dark:text-white text-sm font-bold">
                {isTransactionsLoading ? "-" : transactions.length}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">Transactions</p>
            </div>
          </div>
          
          {/* Settings Section */}
          <section className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm mb-6">
            <h3 className="px-4 pt-4 font-medium text-neutral-900 dark:text-white mb-2">Settings</h3>
            
            <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
              <button 
                className="w-full flex items-center justify-between"
                onClick={() => notifyComingSoon("Help & Support")}
              >
                <div className="flex items-center">
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-neutral-900 dark:text-white">Help & Support</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
              <button 
                className="w-full flex items-center justify-between"
                onClick={() => notifyComingSoon("Privacy Policy")}
              >
                <div className="flex items-center">
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-neutral-900 dark:text-white">Privacy Policy</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <button 
                className="w-full flex items-center justify-between"
                onClick={() => notifyComingSoon("Terms of Service")}
              >
                <div className="flex items-center">
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-neutral-900 dark:text-white">Terms of Service</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </section>
          
          <button 
            className="w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 font-medium py-3 rounded-lg mb-6 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="https://twitter.com/HathorNetwork" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#2aabee] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://t.me/HathorOfficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#2aabee] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.74 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.23 3.59-1.44 4-1.44.09 0 .29.02.42.12.11.08.14.19.15.27-.01.06.01.24 0 .38z"/>
              </svg>
            </a>
            <a 
              href="https://discord.com/invite/Eq6wcTkTGs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#2aabee] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/HathorNetwork" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#2aabee] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/company/hathornetwork/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#2aabee] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              href="https://hathor.network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#2aabee] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/hathornetworkofficial/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#2aabee] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a 
              href="https://www.facebook.com/HathorNetwork/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#2aabee] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
          
          {/* Add email address below the icons */}
          <p className="text-center text-neutral-400 dark:text-neutral-500 text-sm mb-2">
            <a href="mailto:contact@hathor.network" className="text-neutral-400 hover:text-[#2aabee] transition-colors">mail: contact@hathor.network</a>
          </p>
          
          <p className="text-center text-neutral-400 dark:text-neutral-500 text-xs mb-8">
            HathorChat v1.0.0 • Powered by Hathor Network
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default Profile;