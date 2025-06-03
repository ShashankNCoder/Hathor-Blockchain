import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useWallet } from "@/lib/wallet/WalletContext";
import { useComingSoon } from "@/hooks/use-coming-soon";
import { initSignClient } from "@/lib/wallet/wallet-client";

const Profile: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [, setLocation] = useLocation();
  const { wallet, disconnect } = useWallet();
  const { notifyComingSoon } = useComingSoon();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");

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
      // Get the WalletConnect client
      const signClient = await initSignClient();
      
      // Disconnect from WalletConnect if there's an active session
      if (signClient.session.keys.length > 0) {
        const lastKeyIndex = signClient.session.keys.length - 1;
        const session = signClient.session.get(signClient.session.keys[lastKeyIndex]);
        
        if (session) {
          await signClient.disconnect({
            topic: session.topic,
            reason: {
              code: 6000,
              message: "User disconnected"
            }
          });
          console.log('WalletConnect session disconnected');
        }
      }

      // Disconnect from our wallet context
      if (wallet) {
        await disconnect();
        console.log('Wallet context disconnected');
      }

      // Clear all wallet-related data
      localStorage.removeItem('wallet-session');
      sessionStorage.removeItem('wallet-session');
      localStorage.removeItem('walletconnect');
      sessionStorage.removeItem('walletconnect');

      // Show success message
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });

      // Add a small delay before redirecting to ensure the disconnect is complete
      setTimeout(() => {
        // Force a hard redirect to the welcome page
        window.location.href = '/';
      }, 500);

    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile saving
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
  };

  return (
    <Layout title="Profile" showNavigation>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2aabee] bg-opacity-10 flex items-center justify-center mr-4">
                  <i className="fas fa-user text-[#2aabee] text-xl sm:text-2xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-lg px-3 py-1 text-base sm:text-lg font-semibold"
                      placeholder="Enter display name"
                    />
                  ) : (
                    <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white truncate">
                      {displayName || "Anonymous User"}
                    </h2>
                  )}
                </div>
              </div>
              {isEditing ? (
                <button
                  onClick={handleSaveProfile}
                  className="w-full sm:w-auto bg-[#2aabee] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#2aabee]/90 transition-colors"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Wallet Address */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 flex items-center justify-between shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
            <div className="truncate flex-1 min-w-0">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Wallet Address</p>
              <p className="text-sm font-mono truncate">
                {wallet?.address || "Connect your wallet"}
              </p>
            </div>
            <button
              className="ml-2 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
              onClick={copyWalletAddress}
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 text-center">
              <p className="text-neutral-900 dark:text-white text-sm font-bold truncate">
                -
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">HTR Balance</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 text-center">
              <p className="text-neutral-900 dark:text-white text-sm font-bold truncate">
                0
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">Tokens</p>
            </div>
          </div>
          
          {/* Settings Section */}
          <section className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm mb-6">
            <h3 className="px-4 pt-4 font-medium text-neutral-900 dark:text-white mb-2">Settings</h3>
            
            <div className="border-b border-neutral-200 dark:border-neutral-700">
              <button 
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                onClick={() => notifyComingSoon("Help & Support")}
              >
                <div className="flex items-center min-w-0">
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded-full p-2 mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-neutral-900 dark:text-white truncate">Help & Support</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div>
              <button 
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                onClick={() => notifyComingSoon("Terms of Service")}
              >
                <div className="flex items-center min-w-0">
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded-full p-2 mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-neutral-900 dark:text-white truncate">Terms of Service</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </section>
          
          <button 
            className="w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 font-medium py-3 rounded-lg mb-6 transition-colors"
            onClick={handleLogout}
          >
            Disconnect Wallet
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
          </div>
          
          <p className="text-center text-neutral-400 dark:text-neutral-500 text-xs mb-8">
            HathorChat v1.0.0 • Powered by Hathor Network
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default Profile;