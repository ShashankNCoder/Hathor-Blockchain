import React, { useEffect, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import Layout from '@/components/Layout';
import TokenCard from '@/components/wallet/TokenCard';
import NftBadgeCard from '@/components/wallet/NftBadge';
import TransactionItem from '@/components/wallet/TransactionItem';
import SendTokenModal from '@/components/SendTokenModal';
import ReceiveTokenModal from '@/components/ReceiveTokenModal';
import { TokenBalance, Transaction, NFTBadge, mockTokens, mockTransactions, mockNFTBadges } from '@/lib/hathor';
import { copyToClipboard, hapticFeedback } from '@/lib/telegram';
import { useToast } from '@/hooks/use-toast';
import { useComingSoon } from '@/hooks/use-coming-soon';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useLocation } from 'wouter';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WalletBalance {
  balance: {
    htr: number;
    tokens: TokenBalance[];
  };
}

const HomePage: React.FC = () => {
  const { wallet, isAuthenticated } = useWallet();
  const { toast } = useToast();
  const { notifyComingSoon } = useComingSoon();
  const [, setLocation] = useLocation();
  
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [badges, setBadges] = useState<NFTBadge[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenBalance | undefined>();

  // Queries for wallet data
  const { data: balanceData, isLoading: isBalanceLoading, refetch: refreshWallet } = useQuery<WalletBalance>({
    queryKey: ['/api/wallet/balance'],
    enabled: isAuthenticated,
  });

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['/api/wallet/transactions'],
    enabled: isAuthenticated,
  });

  const { data: badgesData, isLoading: isBadgesLoading } = useQuery({
    queryKey: ['/api/wallet/nft-badges'],
    enabled: isAuthenticated,
  });

  // Add new state for price data
  const [priceData, setPriceData] = useState<{
    currentPrice: number;
    priceChange24h: number;
    priceChangePercentage24h: number;
    chartData: number[];
  }>({
    currentPrice: 0,
    priceChange24h: 0,
    priceChangePercentage24h: 0,
    chartData: []
  });

  // Fetch HTR price data
  const { data: priceDataResponse, isLoading: isPriceLoading } = useQuery({
    queryKey: ['htr-price'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hathor&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true');
      const data = await response.json();
      return data.hathor;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch historical price data for the chart
  const { data: chartDataResponse } = useQuery({
    queryKey: ['htr-chart'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/hathor/market_chart?vs_currency=usd&days=7&interval=daily');
      const data = await response.json();
      return data.prices.map((price: [number, number]) => price[1]);
    },
    refetchInterval: 3600000, // Refetch every hour
  });

  // Update price data when responses change
  useEffect(() => {
    if (priceDataResponse && chartDataResponse) {
      setPriceData({
        currentPrice: priceDataResponse.usd,
        priceChange24h: priceDataResponse.usd_24h_change,
        priceChangePercentage24h: priceDataResponse.usd_24h_change,
        chartData: chartDataResponse
      });
    }
  }, [priceDataResponse, chartDataResponse]);

  // Chart configuration
  const chartConfig = {
    labels: Array.from({ length: priceData.chartData.length }, (_, i) => i + 1),
    datasets: [
      {
        label: 'HTR Price (USD)',
        data: priceData.chartData,
        borderColor: '#2aabee',
        backgroundColor: 'rgba(42, 171, 238, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#2aabee',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2aabee',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(250, 242, 242, 0.03)',
          drawBorder: false,
          tickLength: 0,
          lineWidth: 1,
        },
        ticks: {
          display: false,
          maxTicksLimit: 6,
        },
        border: {
          display: false
        }
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(255, 252, 252, 0.03)',
          drawBorder: false,
          tickLength: 0,
          lineWidth: 1,
        },
        ticks: {
          display: false,
          maxTicksLimit: 6,
        },
        border: {
          display: false
        }
      },
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  // Always use mock data for this demo
  useEffect(() => {
    // Always set mock data for demo purposes, regardless of authentication state
    console.log("HomePage: Setting mock data for wallet display");
    
    // Use mock data directly without API calls
    setTokens(mockTokens);
    setTransactions(mockTransactions);
    setBadges(mockNFTBadges);
    
  }, []);

  const handleCopyAddress = async () => {
    const address = wallet?.address || "HTRxk2T39XFd7LJ51mDECJWbMDvqQu98D9";
    try {
      await navigator.clipboard.writeText(address);
      hapticFeedback('impact', 'light');
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
    // TODO: Implement send token logic
    console.log('Sending token:', { recipient, tokenId, amount, message });
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
              <h2 className="text-sm font-medium opacity-80">Total Balance</h2>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold">
                  {balanceData?.balance?.htr?.toLocaleString() || '0'}
                </span>
                <span className="ml-1 text-sm opacity-80">HTR</span>
              </div>
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
              {wallet?.address || "HTRxk2T39XFd7LJ51mDECJWbMDvqQu98D9"}
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

      {/* HTR Price and Chart */}
      <div className="px-4 mb-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">HTR Price</p>
              <div className="flex items-baseline mt-1">
                <span className="text-xl font-bold">
                  ${priceData.currentPrice.toFixed(4)}
                </span>
                <span className={`ml-2 text-sm ${priceData.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceData.priceChangePercentage24h >= 0 ? '+' : ''}{priceData.priceChangePercentage24h.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              24h Change
            </div>
          </div>
          
          <div className="h-24">
            {isPriceLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-6 h-6 border-t-2 border-b-2 border-[#2aabee] rounded-full animate-spin"></div>
              </div>
            ) : (
              <Line data={chartConfig} options={chartOptions} />
            )}
          </div>
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
          {isBalanceLoading ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-t-2 border-b-2 border-hathor-purple rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-neutral-500 mt-2">Loading tokens...</p>
            </div>
          ) : tokens.length > 0 ? (
            tokens.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))
          ) : (
            <div className="text-center py-4 text-neutral-500">
              <p>No tokens found</p>
            </div>
          )}
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
          {isBadgesLoading ? (
            <div className="text-center py-4 col-span-3">
              <div className="w-6 h-6 border-t-2 border-b-2 border-hathor-purple rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-neutral-500 mt-2">Loading badges...</p>
            </div>
          ) : badges.length > 0 ? (
            badges.map((badge) => (
              <NftBadgeCard key={badge.id} badge={badge} />
            ))
          ) : (
            <div className="text-center py-4 col-span-3 text-neutral-500">
              <p>No badges found</p>
            </div>
          )}
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
          {isTransactionsLoading ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-t-2 border-b-2 border-hathor-purple rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-neutral-500 mt-2">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="text-center py-4 text-neutral-500">
              <p>No recent activity</p>
            </div>
          )}
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
        tokens={tokens as any}
        selectedToken={selectedToken as any}
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
