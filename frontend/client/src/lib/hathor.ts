// Define types for Hathor Wallet operations
export interface HathorWallet {
  address: string;
}

export interface TokenBalance {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  type: 'native' | 'community';
  logoUrl?: string;
  usdValue?: number;
  change?: { value: number; direction: 'up' | 'down' | 'stable' };
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'nft';
  amount: number;
  tokenSymbol: string;
  counterparty?: string;
  description?: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface NFTBadge {
  id: string;
  name: string;
  imageUrl: string;
  isLocked: boolean;
  earnedAt?: Date;
  description?: string;
}
