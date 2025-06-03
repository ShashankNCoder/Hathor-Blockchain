import SignClient from '@walletconnect/sign-client';
import { WalletConnectModal } from "@walletconnect/modal";
import {
  DEFAULT_APP_METADATA,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
  HATHOR_TESTNET_CHAIN,
} from '@/constants';

// Create a singleton instance
let signClientPromise: Promise<SignClient> | null = null;
let walletConnectModal: WalletConnectModal | null = null;

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || DEFAULT_PROJECT_ID;
if (!projectId) {
  throw new Error('VITE_WALLET_CONNECT_PROJECT_ID is not defined');
}

export const initSignClient = async () => {
  if (!signClientPromise) {
    signClientPromise = SignClient.init({
      projectId,
      relayUrl: DEFAULT_RELAY_URL,
      metadata: DEFAULT_APP_METADATA
    });
  }
  return signClientPromise;
};

export const initWalletConnectModal = () => {
  if (!walletConnectModal) {
    walletConnectModal = new WalletConnectModal({
      projectId,
      chains: [HATHOR_TESTNET_CHAIN],
      themeMode: 'light',
      themeVariables: {
        '--wcm-font-family': 'inherit',
        '--wcm-accent-color': '#7C3AED',
        '--wcm-accent-fill-color': '#7C3AED'
      }
    });
  }
  return walletConnectModal;
};

export const getWalletConnectModal = () => walletConnectModal; 