// Telegram Mini App types
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

// Hathor wallet types
export interface Wallet {
  id: string;
  address: string;
  publicKey: string;
  encryptedPrivateKey?: string;
  telegramId: number;
  createdAt: Date;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  supply: number;
  creatorId: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface TokenBalance {
  walletId: string;
  tokenId: string;
  balance: number;
  lastUpdated: Date;
}

export interface TokenWithBalance extends Token {
  balance: number;
  lastUpdated: Date;
  usdValue?: number;
  type?: 'native' | 'community';
  change?: {
    direction: 'up' | 'down';
    value: number;
  };
}

export interface BadgeMetadata {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  conditions?: {
    type: 'message_count' | 'tip_amount' | 'activity_days';
    threshold: number;
    tokenId?: string;
  };
}

export interface WalletBadge {
  walletId: string;
  badgeId: string;
  earnedAt: Date;
  txHash?: string;
}

export interface TransactionRecord {
  id: string;
  type: 'send' | 'receive' | 'mint' | 'nft';
  amount: number;
  tokenId: string;
  fromWalletId?: string;
  toWalletId?: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
  description?: string;
}
