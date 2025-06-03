import { SessionTypes } from '@walletconnect/types';

export interface WalletConnectProps {}

export interface WalletSession {
  session: SessionTypes.Struct | null;
  client: any | null;
  address: string;
  connecting: boolean;
}

export interface WalletConnectHandlers {
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handleStart: () => void;
  cleanup: () => void;
} 