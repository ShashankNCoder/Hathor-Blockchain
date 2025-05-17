import { Token, TokenBalance } from '@/types';

interface SendTokenParams {
  recipient: string;
  tokenId: number;
  amount: number;
  message?: string;
}

interface HathorApi {
  getCurrentUser: () => Promise<any>;
  getWallet: () => Promise<any>;
  getCommunityTokens: () => Promise<(Token & TokenBalance)[]>;
  getTransactions: () => Promise<any>;
  sendToken: (params: SendTokenParams) => Promise<any>;
  getNftBadges: () => Promise<any>;
  createToken: (params: { name: string; symbol: string; amount: number }) => Promise<any>;
}

const hathorApi: HathorApi = {
  getCurrentUser: async () => {
    const response = await fetch('/api/users/me');
    return response.json();
  },

  getWallet: async () => {
    const response = await fetch('/api/wallets');
    return response.json();
  },

  getCommunityTokens: async (): Promise<(Token & TokenBalance)[]> => {
    const response = await fetch('/api/tokens/community');
    return response.json();
  },

  getTransactions: async () => {
    const response = await fetch('/api/transactions');
    return response.json();
  },

  sendToken: async (params: SendTokenParams) => {
    const response = await fetch('/api/transactions/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  getNftBadges: async () => {
    const response = await fetch('/api/wallet/nft-badges');
    return response.json();
  },

  createToken: async (params) => {
    const response = await fetch('/api/tokens/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },
};

export default hathorApi; 