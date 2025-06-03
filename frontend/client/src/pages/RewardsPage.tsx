import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useComingSoon } from "@/hooks/use-coming-soon";

interface Community {
  id: number;
  name: string;
  description: string;
  chatId: string;
  requiredAmount: number;
  token: { symbol: string };
}

const communities: Community[] = [
  {
    id: 1,
    name: "Premium Chat",
    description: "Exclusive discussion group for token holders",
    chatId: "premiumchat",
    requiredAmount: 100,
    token: { symbol: "HTR" }
  },
  {
    id: 2,
    name: "VIP Room",
    description: "Special access for dedicated members",
    chatId: "viproom",
    requiredAmount: 500,
    token: { symbol: "HTR" }
  }
];

const Rewards: React.FC = () => {
  const { toast } = useToast();
  const { notifyComingSoon } = useComingSoon();
  const [badges] = useState<any[]>([]);

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

  // Static balance for demo purposes
  const getUserBalance = (): number => 0;

  const hasAccessToCommunity = (requiredAmount: number): boolean => {
    return getUserBalance() >= requiredAmount;
  };

  const getMissingAmount = (requiredAmount: number): number => {
    const balance = getUserBalance();
    return Math.max(0, requiredAmount - balance);
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
          
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm text-center border border-neutral-200 dark:border-neutral-700 mb-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <p className="text-neutral-500 dark:text-neutral-400">No badges yet</p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Complete tasks to earn badges</p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="font-semibold text-lg mb-4">Token-Gated Communities</h2>
          
          <div className="space-y-4">
            {communities.map(community => {
              const hasAccess = hasAccessToCommunity(community.requiredAmount);
              const missingAmount = getMissingAmount(community.requiredAmount);
              const currentBalance = getUserBalance();

              return (
                <div 
                  key={community.id} 
                  className={`bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border-l-4 ${
                    hasAccess ? 'border-[#2aabee]' : 'border-neutral-200 dark:border-neutral-700'
                  } border border-neutral-200 dark:border-neutral-700`}
                >
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-neutral-900 dark:text-white">{community.name}</h3>
                      <span 
                        className={`${
                          hasAccess 
                            ? 'bg-[#2aabee] bg-opacity-10 text-[#2aabee]' 
                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                        } text-xs font-medium px-2 py-1 rounded-full`}
                      >
                        {community.requiredAmount} {community.token.symbol} required
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{community.description}</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Your balance:</span>
                      <span className="text-xs font-medium text-neutral-900 dark:text-white">
                        {currentBalance} / {community.requiredAmount} {community.token.symbol}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#2aabee]"
                        style={{ 
                          width: `${Math.min((currentBalance / community.requiredAmount) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    className={`w-full ${
                      hasAccess 
                        ? 'bg-[#2aabee] text-white' 
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                    } font-medium text-sm py-3 rounded-lg transition-colors`}
                    onClick={() => handleAccessCommunity(
                      community.id,
                      hasAccess,
                      missingAmount,
                      community.token.symbol
                    )}
                  >
                    {hasAccess 
                      ? 'Access Community' 
                      : `Need ${missingAmount} more ${community.token.symbol}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Rewards;
