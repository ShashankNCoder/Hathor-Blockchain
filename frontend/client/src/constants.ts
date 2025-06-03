// Hathor Network Configuration
export const HATHOR_MAINNET_CHAIN = null;
export const HATHOR_TESTNET_CHAIN = 'hathor:testnet';

export const DEFAULT_PROJECT_ID = '868d5c6bbd001b56ac89546699c5270f';
export const DEFAULT_RELAY_URL = 'wss://relay.walletconnect.com';
export const BASE_PATH = '';
export const URL = 'http://localhost:5000';
export const FULLNODE_URL = 'https://hathorplay.nano-testnet.hathor.network/v1a/';

export const DEFAULT_LOGGER = 'debug';

export const DEFAULT_APP_METADATA = {
  name: 'HathorChat',
  description: 'HathorChat - A decentralized chat application',
  url: 'http://localhost:5000',
  icons: ['https://hathor-public-files.s3.amazonaws.com/hathor-demo-icon.png']
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