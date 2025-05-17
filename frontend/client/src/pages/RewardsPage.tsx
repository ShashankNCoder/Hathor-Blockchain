import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useComingSoon } from "@/hooks/use-coming-soon";

const mockBadges = [
  {
    id: 1,
    name: "Early Adopter",
    description: "One of the first members of our community",
    imageUrl: null
  },
  {
    id: 2,
    name: "Active Contributor",
    description: "Regular participant in community discussions",
    imageUrl: null
  }
];

const mockCommunities = [
  {
    id: 1,
    name: "Premium Chat",
    description: "Exclusive discussion group for token holders",
    chatId: "premiumchat",
    userHasAccess: true,
    requiredAmount: 100,
    token: { symbol: "HTR" },
    missingAmount: 0
  },
  {
    id: 2,
    name: "VIP Room",
    description: "Special access for dedicated members",
    chatId: "viproom",
    userHasAccess: false,
    requiredAmount: 500,
    token: { symbol: "HTR" },
    missingAmount: 300
  }
];

const Rewards: React.FC = () => {
  const { toast } = useToast();
  const { notifyComingSoon } = useComingSoon();
  const [badges] = useState(mockBadges);
  const [communities] = useState(mockCommunities);
  const [isBadgesLoading] = useState(false);
  const [isCommunitiesLoading] = useState(false);

  const handleAccessCommunity = (communityId: number, hasAccess: boolean, missing?: number, symbol?: string) => {
    if (hasAccess) {
      notifyComingSoon("Community Access");
    } else {
      toast({
        title: "Access Denied",
        description: `You need ${missing} more ${symbol} tokens to access this community.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Rewards & Access">
      <div className="p-4">
        <div className="bg-[#2aabee] rounded-xl p-5 text-white shadow-md mb-6">
          <h2 className="text-xl font-bold mb-2">Your Rewards</h2>
          <p className="text-sm opacity-80">Access exclusive communities and earn badges</p>
        </div>
      </div>

      <div className="px-4">
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-4">Your NFT Badges</h2>
          
          {isBadgesLoading ? (
            <div className="flex justify-center my-8">
              <div className="w-8 h-8 border-4 border-[#2aabee] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : badges.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm text-center border border-neutral-200 dark:border-neutral-700 mb-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <p className="text-neutral-500 dark:text-neutral-400">You don't have any badges yet</p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Participate in communities to earn badges</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {badges.map(badge => (
                <button
                  key={badge.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-700 text-left"
                  onClick={() => notifyComingSoon("Badge Details")}
                >
                  <div className="aspect-square bg-neutral-100 dark:bg-neutral-700 relative">
                    {badge.imageUrl ? (
                      <img 
                        src={badge.imageUrl} 
                        alt={badge.name} 
                        className="object-cover w-full h-full" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#2aabee] bg-opacity-10">
                        <svg className="h-16 w-16 text-[#2aabee] opacity-60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H13V16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H11V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13Z" fill="currentColor"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-neutral-900 dark:text-white">{badge.name}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{badge.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
        
        <section className="mb-20">
          <h2 className="font-semibold text-lg mb-4">Token-Gated Communities</h2>
          
          {isCommunitiesLoading ? (
            <div className="flex justify-center my-8">
              <div className="w-8 h-8 border-4 border-[#2aabee] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : communities.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm text-center border border-neutral-200 dark:border-neutral-700 mb-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-neutral-500 dark:text-neutral-400">No token-gated communities available</p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Communities will appear here when they require tokens for access</p>
            </div>
          ) : (
            <div className="space-y-4">
              {communities.map(community => (
                <div 
                  key={community.id} 
                  className={`bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border-l-4 ${
                    community.userHasAccess ? 'border-[#2aabee]' : 'border-neutral-200 dark:border-neutral-700'
                  } border border-neutral-200 dark:border-neutral-700`}
                >
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-neutral-900 dark:text-white">{community.name}</h3>
                      <span 
                        className={`${
                          community.userHasAccess 
                            ? 'bg-[#2aabee] bg-opacity-10 text-[#2aabee]' 
                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                        } text-xs font-medium px-2 py-1 rounded-full`}
                      >
                        {community.requiredAmount} {community.token.symbol} required
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{community.description}</p>
                  </div>
                  
                  <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Your balance:</span>
                      <span className="text-xs font-medium text-neutral-900 dark:text-white">
                        {community.requiredAmount - (community.missingAmount || 0)} / {community.requiredAmount} {community.token.symbol}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#2aabee]"
                        style={{ 
                          width: `${((community.requiredAmount - (community.missingAmount || 0)) / community.requiredAmount) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    className={`w-full ${
                      community.userHasAccess 
                        ? 'bg-[#2aabee] text-white' 
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                    } font-medium text-sm py-3 rounded-lg transition-colors`}
                    onClick={() => handleAccessCommunity(
                      community.id,
                      community.userHasAccess,
                      community.missingAmount,
                      community.token.symbol
                    )}
                  >
                    {community.userHasAccess 
                      ? 'Access Community' 
                      : `Need ${community.missingAmount} more ${community.token.symbol}`}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Rewards;
