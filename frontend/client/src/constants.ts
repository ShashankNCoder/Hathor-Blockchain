// Hathor Network Configuration
export const HATHOR_MAINNET_CHAIN = null;
export const HATHOR_TESTNET_CHAIN = 'hathor:testnet';

export const DEFAULT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '868d5c6bbd001b56ac89546699c5270f';
export const DEFAULT_RELAY_URL = import.meta.env.VITE_RELAY_URL || 'wss://relay.walletconnect.com';
export const BASE_PATH = import.meta.env.VITE_BASE_PATH || '';
export const URL = import.meta.env.VITE_URL || 'http://localhost:3000';
export const FULLNODE_URL = import.meta.env.VITE_FULLNODE_URL || 'https://hathorplay.nano-testnet.hathor.network/v1a/';

export const DEFAULT_LOGGER = 'debug';

export const DEFAULT_APP_METADATA = {
  name: 'Hathor Wallet',
  description: 'Hathor Wallet',
  url: URL,
  icons: ['https://hathor-public-files.s3.amazonaws.com/hathor-demo-icon.png'],
};

export enum DEFAULT_HATHOR_METHODS {
  HATHOR_SIGN_MESSAGE = 'htr_signWithAddress',
  HATHOR_SEND_NANO_TX = 'htr_sendNanoContractTx'
}

export enum DEFAULT_HATHOR_EVENTS {}

export const NETWORK = 'testnet';

export const EXPLORER_URL = 'https://explorer.alpha.nano-testnet.hathor.network/';

export const EVENT_TOKEN = '00';
export const EVENT_TOKEN_SYMBOL = 'HTR';

export const WAIT_CONFIRMATION_MAX_RETRIES = 800;