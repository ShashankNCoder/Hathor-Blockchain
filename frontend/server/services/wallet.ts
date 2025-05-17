// Hathor wallet service implementation
// This is a simplified mock implementation for demonstration purposes
// In a real application, this would integrate with the Hathor Wallet API

import { TokenBalance, Transaction, NFTBadge } from "../../clientlib/hathor";

// Mock data
const mockWallets = new Map<string, {
  address: string;
  publicKey: string;
  encryptedPrivateKey: string;
  pin?: string;
}>();

const mockTokens = [
  {
    id: 'htr',
    name: 'Hathor',
    symbol: 'HTR',
    balance: 1254.75,
    type: 'native' as const,
    usdValue: 125.47,
  },
  {
    id: 'brew',
    name: 'CoffeeCoin',
    symbol: 'BREW',
    balance: 25.5,
    type: 'community' as const,
    change: { value: 12, direction: 'up' as const },
  },
  {
    id: 'vibe',
    name: 'VibeToken',
    symbol: 'VIBE',
    balance: 75,
    type: 'community' as const,
    change: { value: 3, direction: 'down' as const },
  },
];

const mockTransactions = [
  {
    id: 'tx1',
    type: 'receive' as const,
    amount: 5,
    tokenSymbol: 'VIBE',
    counterparty: '@alexcoder',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'confirmed' as const,
  },
  {
    id: 'tx2',
    type: 'nft' as const,
    amount: 1,
    tokenSymbol: 'NFT',
    description: 'Top Tipper Badge',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'confirmed' as const,
  },
  {
    id: 'tx3',
    type: 'send' as const,
    amount: 2.5,
    tokenSymbol: 'BREW',
    counterparty: '@coffeelover',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'confirmed' as const,
  },
];

const mockNFTBadges = [
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
    imageUrl: 'https://pixabay.com/get/gbd5a6ce4c282aeabd242812b757af66bf31ecc9ae360c138d56b3507d69c2f4fd51c6b5d04c52c6906b3162295df7eb5eed4bd0252090fa0851824d38c80dca4_1280.jpg',
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

/**
 * Get a wallet by Telegram ID
 */
export async function getWalletByTelegramId(telegramId: string) {
  // In a real implementation, this would query the database
  // For demonstration, add a mock wallet if it doesn't exist
  if (!mockWallets.has(telegramId)) {
    console.log(`Creating mock wallet for telegram ID: ${telegramId}`);
    const address = `HTRxk2T39XFd7LJ51mDECJWbMDvqQu98D9`;
    const publicKey = `pub_${Math.random().toString(36).substring(2, 15)}`;
    const encryptedPrivateKey = `enc_${Math.random().toString(36).substring(2, 15)}`;
    
    mockWallets.set(telegramId, {
      address,
      publicKey,
      encryptedPrivateKey,
      pin: undefined
    });
  }
  
  return mockWallets.get(telegramId);
}

/**
 * Create a new wallet
 */
export async function createWallet(telegramId: string, pin?: string) {
  // In a real implementation, this would call the Hathor Wallet API to create a wallet
  // and store the encrypted private key in the database
  
  // Generate a mock address
  const address = `HTR${Math.random().toString(36).substring(2, 15)}`;
  const publicKey = `pub_${Math.random().toString(36).substring(2, 15)}`;
  const encryptedPrivateKey = `enc_${Math.random().toString(36).substring(2, 15)}`;
  
  const wallet = {
    address,
    publicKey,
    encryptedPrivateKey,
    pin
  };
  
  mockWallets.set(telegramId, wallet);
  
  return wallet;
}

/**
 * Import an existing wallet
 */
export async function importWallet(telegramId: string, seedPhrase: string, pin?: string) {
  // In a real implementation, this would call the Hathor Wallet API to import a wallet
  // using the seed phrase and store the encrypted private key in the database
  
  // Generate a mock address from the seed phrase
  const address = `HTR${seedPhrase.slice(0, 8).replace(/\s/g, '')}`;
  const publicKey = `pub_${Math.random().toString(36).substring(2, 15)}`;
  const encryptedPrivateKey = `enc_${Math.random().toString(36).substring(2, 15)}`;
  
  const wallet = {
    address,
    publicKey,
    encryptedPrivateKey,
    pin
  };
  
  mockWallets.set(telegramId, wallet);
  
  return wallet;
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(telegramId: string): Promise<{ htr: number; tokens: TokenBalance[] }> {
  // In a real implementation, this would call the Hathor Wallet API to get the balance
  
  // Check if wallet exists
  const wallet = mockWallets.get(telegramId);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  
  // Return mock balance data
  return {
    htr: mockTokens[0].balance,
    tokens: mockTokens.slice(1) as TokenBalance[],
  };
}

/**
 * Get transaction history
 */
export async function getTransactionHistory(telegramId: string): Promise<Transaction[]> {
  // In a real implementation, this would call the Hathor Wallet API to get transaction history
  
  // Check if wallet exists
  const wallet = mockWallets.get(telegramId);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  
  // Return mock transaction data
  return mockTransactions;
}

/**
 * Get NFT badges
 */
export async function getNFTBadges(telegramId: string): Promise<NFTBadge[]> {
  // In a real implementation, this would query the database for NFT badges
  
  // Check if wallet exists
  const wallet = mockWallets.get(telegramId);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  
  // Return mock NFT badge data
  return mockNFTBadges;
}

/**
 * Create a new token
 */
export async function createToken(
  telegramId: string, 
  name: string, 
  symbol: string, 
  supply: number, 
  imageUrl?: string
): Promise<TokenBalance> {
  // In a real implementation, this would call the Hathor Wallet API to create a token
  
  // Check if wallet exists
  const wallet = mockWallets.get(telegramId);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  
  // Create mock token
  const token: TokenBalance = {
    id: `token_${Math.random().toString(36).substring(2, 9)}`,
    name,
    symbol,
    balance: supply,
    type: 'community',
    ...(imageUrl && { logoUrl: imageUrl }),
  };
  
  // Return the new token
  return token;
}

/**
 * Send tokens
 */
export async function sendTokens(
  telegramId: string, 
  recipient: string, 
  amount: number, 
  tokenSymbol: string
): Promise<Transaction> {
  // In a real implementation, this would call the Hathor Wallet API to send tokens
  
  // Check if wallet exists
  const wallet = mockWallets.get(telegramId);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  
  // Create mock transaction
  const transaction: Transaction = {
    id: `tx_${Math.random().toString(36).substring(2, 9)}`,
    type: 'send',
    amount,
    tokenSymbol,
    counterparty: recipient,
    timestamp: new Date(),
    status: 'confirmed',
  };
  
  // Return the new transaction
  return transaction;
}
