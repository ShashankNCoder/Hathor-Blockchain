import { apiRequest } from './queryClient';
import { showAlert } from './telegram';

// Define types for Hathor Wallet operations
export interface HathorWallet {
  address: string;
  balance: {
    htr: number;
    tokens: TokenBalance[];
  };
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
  type: 'send' | 'receive' | 'nft' | 'mint';
  amount: number;
  tokenSymbol: string;
  counterparty?: string; // Username of sender/receiver
  timestamp: Date;
  status: 'confirmed' | 'pending';
  description?: string;
}

export interface NFTBadge {
  id: string;
  name: string;
  imageUrl: string;
  isLocked: boolean;
  description?: string;
  earnedAt?: Date;
}

// Function to create a new wallet
export async function createWallet(pin?: string): Promise<{ success: boolean; address?: string; error?: string }> {
  try {
    const response = await apiRequest('POST', '/api/wallet/create', { pin });
    const data = await response.json();
    
    if (data.success && data.address) {
      return { success: true, address: data.address };
    } else {
      return { success: false, error: data.error || 'Unknown error occurred' };
    }
  } catch (error) {
    console.error('Error creating wallet:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create wallet' 
    };
  }
}

// Function to import a wallet from seed phrase
export async function importWallet(seedPhrase: string, pin?: string): Promise<{ success: boolean; address?: string; error?: string }> {
  try {
    const response = await apiRequest('POST', '/api/wallet/import', {
      seedPhrase,
      pin
    });
    const data = await response.json();
    
    if (data.success && data.address) {
      return { success: true, address: data.address };
    } else {
      return { success: false, error: data.error || 'Unknown error occurred' };
    }
  } catch (error) {
    console.error('Error importing wallet:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to import wallet' 
    };
  }
}

// Function to get wallet balance
export async function getWalletBalance(): Promise<{ success: boolean; balance?: { htr: number; tokens: TokenBalance[] }; error?: string }> {
  try {
    const response = await apiRequest('GET', '/api/wallet/balance');
    const data = await response.json();
    
    if (data.success) {
      return { success: true, balance: data.balance };
    } else {
      return { success: false, error: data.error || 'Unknown error occurred' };
    }
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get wallet balance' 
    };
  }
}

// Function to get transaction history
export async function getTransactionHistory(): Promise<{ success: boolean; transactions?: Transaction[]; error?: string }> {
  try {
    const response = await apiRequest('GET', '/api/wallet/transactions');
    const data = await response.json();
    
    if (data.success) {
      return { success: true, transactions: data.transactions };
    } else {
      return { success: false, error: data.error || 'Unknown error occurred' };
    }
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get transaction history' 
    };
  }
}

// Function to get NFT badges
export async function getNFTBadges(): Promise<{ success: boolean; badges?: NFTBadge[]; error?: string }> {
  try {
    const response = await apiRequest('GET', '/api/wallet/nft-badges');
    const data = await response.json();
    
    if (data.success) {
      return { success: true, badges: data.badges };
    } else {
      return { success: false, error: data.error || 'Unknown error occurred' };
    }
  } catch (error) {
    console.error('Error getting NFT badges:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get NFT badges' 
    };
  }
}

// Function to create a new token
export async function createToken(name: string, symbol: string, supply: number, imageUrl?: string): Promise<{ success: boolean; token?: TokenBalance; error?: string }> {
  try {
    const response = await apiRequest('POST', '/api/token/create', {
      name,
      symbol,
      supply,
      imageUrl
    });
    const data = await response.json();
    
    if (data.success) {
      return { success: true, token: data.token };
    } else {
      return { success: false, error: data.error || 'Unknown error occurred' };
    }
  } catch (error) {
    console.error('Error creating token:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create token' 
    };
  }
}

// Function to send tokens
export async function sendTokens(recipient: string, amount: number, tokenSymbol: string): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
  try {
    const response = await apiRequest('POST', '/api/wallet/send', {
      recipient,
      amount,
      tokenSymbol
    });
    const data = await response.json();
    
    if (data.success) {
      return { success: true, transaction: data.transaction };
    } else {
      return { success: false, error: data.error || 'Unknown error occurred' };
    }
  } catch (error) {
    console.error('Error sending tokens:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send tokens' 
    };
  }
}

// Function to check if a wallet exists for the current user
export async function checkWalletExists(): Promise<boolean> {
  try {
    const response = await apiRequest('GET', '/api/wallet/exists');
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Error checking wallet existence:', error);
    return false;
  }
}

// Mock data for development
export const mockTokens: TokenBalance[] = [
  {
    id: 'htr',
    name: 'Hathor',
    symbol: 'HTR',
    balance: 1254.75,
    type: 'native',
    usdValue: 125.47,
  },
  {
    id: 'brew',
    name: 'CoffeeCoin',
    symbol: 'BREW',
    balance: 25.5,
    type: 'community',
    change: { value: 12, direction: 'up' },
  },
  {
    id: 'vibe',
    name: 'VibeToken',
    symbol: 'VIBE',
    balance: 75,
    type: 'community',
    change: { value: 3, direction: 'down' },
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    type: 'receive',
    amount: 5,
    tokenSymbol: 'VIBE',
    counterparty: '@alexcoder',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'confirmed',
  },
  {
    id: 'tx2',
    type: 'nft',
    amount: 1,
    tokenSymbol: 'NFT',
    description: 'Top Tipper Badge',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'confirmed',
  },
  {
    id: 'tx3',
    type: 'send',
    amount: 2.5,
    tokenSymbol: 'BREW',
    counterparty: '@coffeelover',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'confirmed',
  },
];

export const mockNFTBadges: NFTBadge[] = [
  {
    id: 'badge1',
    name: 'Early Supporter',
    imageUrl: 'https://images.unsplash.com/photo-1627163439134-7a8c47e08208?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
    isLocked: false,
    earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'badge2',
    name: 'Top Tipper',
    imageUrl: 'https://www.lgt.com/resource/image/30772/landscape_ratio3x2/972/648/d5af612d9764815ee70802081836b5ef/27499101CE9538EE9A0754E5ADECC2D0/22-246-bored-ape-nft-en.webp',
    isLocked: false,
    earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'badge3',
    name: 'Community Leader',
    imageUrl: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
    isLocked: true,
    description: 'Earn this badge by being active for 30 days',
  },
];
