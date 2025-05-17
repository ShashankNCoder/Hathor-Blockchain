import * as React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CreditCard } from 'lucide-react';
import SignClient from '@walletconnect/sign-client';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { WalletConnectModal } from "@walletconnect/modal";
import { SessionTypes } from '@walletconnect/types';
import {
  DEFAULT_APP_METADATA,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
  HATHOR_TESTNET_CHAIN,
  DEFAULT_HATHOR_METHODS
} from '../constants';

export interface WalletConnectProps {}

// Create a singleton instance
let signClientPromise: Promise<SignClient> | null = null;
let walletConnectModal: WalletConnectModal | null = null;

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || DEFAULT_PROJECT_ID;
if (!projectId) {
  throw new Error('VITE_WALLET_CONNECT_PROJECT_ID is not defined');
}

const initSignClient = async () => {
  if (!signClientPromise) {
    signClientPromise = SignClient.init({
      projectId,
      relayUrl: DEFAULT_RELAY_URL,
      metadata: DEFAULT_APP_METADATA
    });
  }
  return signClientPromise;
};

const initWalletConnectModal = () => {
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

const WalletConnect = () => {
  const [connected, setConnected] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);
  const [address, setAddress] = React.useState<string>('');
  const [session, setSession] = React.useState<SessionTypes.Struct | null>(null);
  const [client, setClient] = React.useState<SignClient | null>(null);

  const cleanup = React.useCallback(() => {
    if (walletConnectModal) {
      walletConnectModal.closeModal();
    }
    setConnecting(false);
  }, []);

  const checkPersistedSession = React.useCallback(async (signClient: SignClient) => {
    if (!signClient.session.length) return;

    try {
      const lastKeyIndex = signClient.session.keys.length - 1;
      const _session = signClient.session.get(signClient.session.keys[lastKeyIndex]);
      
      // Verify if the session is still valid
      if (_session.expiry * 1000 > Date.now()) {
        setSession(_session);
        setConnected(true);
        const accounts = _session.namespaces.hathor?.accounts[0].split(':');
        if (accounts) {
          setAddress(accounts[2]);
        }
      } else {
        // Session expired, clean it up
        await signClient.disconnect({
          topic: _session.topic,
          reason: { code: 6000, message: 'Session expired' }
        });
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
    }
  }, []);

  React.useEffect(() => {
    const init = async () => {
      try {
        const signClient = await initSignClient();
        setClient(signClient);
        initWalletConnectModal();

        await checkPersistedSession(signClient);

        // Setup event listeners
        signClient.on('session_proposal', ({ id, params }) => {
          console.log('Session proposal:', { id, params });
        });

        signClient.on('session_event', ({ params }) => {
          const { event, chainId } = params;
          console.log('Session event:', event, 'Chain:', chainId);
          if (event.name === 'accountsChanged' && Array.isArray(event.data)) {
            setAddress(event.data[0]);
          }
        });

        signClient.on('session_request', async (event) => {
          const { id, topic, params } = event;
          const { request } = params;
          console.log('Session request:', request.method, request.params);
          
          if (request.method === DEFAULT_HATHOR_METHODS.HATHOR_SIGN_MESSAGE) {
            console.log('Sign message request:', request.params);
          } else if (request.method === DEFAULT_HATHOR_METHODS.HATHOR_SEND_NANO_TX) {
            console.log('Send nano contract tx request:', request.params);
          }
        });

        signClient.on('session_ping', ({ topic }) => {
          console.log('Session ping:', topic);
        });

        signClient.on('session_update', ({ topic, params }) => {
          const { namespaces } = params;
          const _session = signClient.session.get(topic);
          const updatedSession = { ..._session, namespaces };
          setSession(updatedSession);
          console.log('Session updated:', updatedSession);
        });

        signClient.on('session_delete', () => {
          console.log('Session deleted');
          cleanup();
          setSession(null);
          setConnected(false);
          setAddress('');
        });

        signClient.on('session_expire', ({ topic }) => {
          console.log('Session expired:', topic);
          cleanup();
          setSession(null);
          setConnected(false);
          setAddress('');
        });
      } catch (err) {
        console.error('Failed to initialize:', err);
        cleanup();
      }
    };

    init();
    return cleanup;
  }, [cleanup, checkPersistedSession]);

  const handleConnect = async () => {
    if (!client) return;

    try {
      setConnecting(true);
      const modal = initWalletConnectModal();

      const { uri, approval } = await client.connect({
        requiredNamespaces: {
          hathor: {
            methods: Object.values(DEFAULT_HATHOR_METHODS),
            chains: [HATHOR_TESTNET_CHAIN],
            events: []
          }
        }
      });

      if (uri) {
        await modal.openModal({ uri });
      }

      try {
        const session = await approval();
        setSession(session);
        
        const accounts = session.namespaces.hathor?.accounts[0].split(':');
        if (accounts) {
          setAddress(accounts[2]);
        }
        setConnected(true);
      } catch (err) {
        console.warn('Session approval failed:', err);
      } finally {
        cleanup();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      cleanup();
    }
  };

  const handleDisconnect = async () => {
    if (!session || !client) return;

    try {
      await client.disconnect({
        topic: session.topic,
        reason: {
          code: 6000,
          message: 'User disconnected'
        }
      });
      cleanup();
      setSession(null);
      setConnected(false);
      setAddress('');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      cleanup();
    }
  };

  return (
    <Card>
      <CardContent className='flex justify-between p-4 items-center space-x-4'>
        <div className="flex items-center space-x-2">
          <CreditCard />
          {connected && (
            <span className="text-sm text-gray-600">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          )}
        </div>
        {!connected && (
          <Button 
            className='bg-hathor-purple-700 hover:bg-hathor-purple-600 text-white rounded-full outline outline-1 outline-hathor-purple-600'
            onClick={handleConnect}
            disabled={connecting || !client}
          >
            {connecting ? 'Connecting...' : 'Connect wallet'}
          </Button>
        )}
        {connected && (
          <Button 
            className='bg-hathor-purple-700 hover:bg-hathor-purple-600 text-white rounded-full outline outline-1 outline-hathor-purple-600'
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export { WalletConnect }; 