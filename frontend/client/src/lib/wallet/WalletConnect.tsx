import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Copy, Check } from 'lucide-react';
import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { useWallet } from '@/lib/wallet/WalletContext';
import { useLocation } from 'wouter';
import { DEFAULT_HATHOR_METHODS, HATHOR_TESTNET_CHAIN } from '@/constants';
import { initSignClient, initWalletConnectModal, getWalletConnectModal } from './wallet-client';
import { WalletConnectProps, WalletSession, WalletConnectHandlers } from './types';
import { useToast } from '@/hooks/use-toast';

const WalletConnect: React.FC<WalletConnectProps> = () => {
  const [connecting, setConnecting] = React.useState(false);
  const [address, setAddress] = React.useState<string>('');
  const [session, setSession] = React.useState<SessionTypes.Struct | null>(null);
  const [client, setClient] = React.useState<SignClient | null>(null);
  const [connectionUri, setConnectionUri] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);
  const { setWallet, disconnect: disconnectWallet } = useWallet();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const cleanup = React.useCallback(() => {
    const modal = getWalletConnectModal();
    if (modal) {
      modal.closeModal();
    }
    setConnecting(false);
  }, []);

  const updateWalletContext = React.useCallback((address: string | null) => {
    if (address) {
      setWallet({ address });
    } else {
      setWallet(null);
    }
  }, [setWallet]);

  const handleStart = () => {
    setLocation('/home');
  };

  const checkPersistedSession = React.useCallback(async (signClient: SignClient) => {
    if (!signClient.session.length) {
      console.log('No persisted session found');
      return;
    }

    try {
      const lastKeyIndex = signClient.session.keys.length - 1;
      const _session = signClient.session.get(signClient.session.keys[lastKeyIndex]);
      
      // Verify if the session is still valid
      if (_session.expiry * 1000 > Date.now()) {
        setSession(_session);
        const accounts = _session.namespaces.hathor?.accounts[0].split(':');
        if (accounts) {
          const walletAddress = accounts[2];
          setAddress(walletAddress);
          updateWalletContext(walletAddress);
        }
      } else {
        console.log('Session expired, cleaning up');
        // Session expired, clean it up
        await signClient.disconnect({
          topic: _session.topic,
          reason: { code: 6000, message: 'Session expired' }
        });
        updateWalletContext(null);
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
      updateWalletContext(null);
    }
  }, [updateWalletContext]);

  React.useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing wallet connection');
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
            const newAddress = event.data[0];
            console.log('Account changed:', newAddress);
            setAddress(newAddress);
            updateWalletContext(newAddress);
          }
        });

        signClient.on('session_request', async (event) => {
          const { id, topic, params } = event;
          const { request } = params;
          console.log('Session request:', request.method, request.params);
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
          setAddress('');
          updateWalletContext(null);
        });

        signClient.on('session_expire', ({ topic }) => {
          console.log('Session expired:', topic);
          cleanup();
          setSession(null);
          setAddress('');
          updateWalletContext(null);
        });
      } catch (err) {
        console.error('Failed to initialize:', err);
        cleanup();
        updateWalletContext(null);
      }
    };

    init();
    return cleanup;
  }, [cleanup, checkPersistedSession, updateWalletContext]);

  const handleConnect = async () => {
    if (!client) return;

    try {
      console.log('Starting wallet connection');
      setConnecting(true);
      const modal = initWalletConnectModal();

      console.log('Connecting with chain:', HATHOR_TESTNET_CHAIN);
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
        setConnectionUri(uri);
        console.log('Opening wallet connect modal');
        await modal.openModal({ uri });
      }

      try {
        console.log('Waiting for session approval');
        const session = await approval();
        console.log('Session approved:', session);
        setSession(session);
        
        const accounts = session.namespaces.hathor?.accounts[0].split(':');
        if (accounts && accounts.length >= 3) {
          const walletAddress = accounts[2];
          console.log('Setting address from new session:', walletAddress);
          setAddress(walletAddress);
          updateWalletContext(walletAddress);
          
          // Navigate to home page after successful connection
          setLocation('/home');
        } else {
          console.error('Invalid account format:', accounts);
          throw new Error('Invalid account format');
        }
      } catch (err) {
        console.warn('Session approval failed:', err);
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again."
        });
        updateWalletContext(null);
      } finally {
        cleanup();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again."
      });
      cleanup();
      updateWalletContext(null);
    }
  };

  const handleDisconnect = async () => {
    if (!session || !client) return;

    try {
      console.log('Disconnecting wallet');
      await client.disconnect({
        topic: session.topic,
        reason: {
          code: 6000,
          message: 'User disconnected'
        }
      });
      cleanup();
      setSession(null);
      setAddress('');
      updateWalletContext(null);
    } catch (error) {
      console.error('Failed to disconnect:', error);
      cleanup();
      updateWalletContext(null);
    }
  };

  const handleCopyUri = async () => {
    if (connectionUri) {
      try {
        await navigator.clipboard.writeText(connectionUri);
        setCopied(true);
        toast({
          title: "Success",
          description: "Connection URI copied to clipboard!",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy URI to clipboard",
        });
      }
    }
  };

  const formatUri = (uri: string) => {
    if (!uri) return '';
    const parts = uri.split('@');
    if (parts.length !== 2) return uri;
    
    const [prefix, rest] = parts;
    const [id, params] = rest.split('?');
    
    return `${prefix}@${id.slice(0, 6)}...${id.slice(-4)}?${params}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="w-full">
        <CardContent className='flex justify-between p-4 sm:p-6 items-center space-x-4'>
          <div className="flex items-center space-x-2 min-w-0">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            {address && (
              <span className="text-sm sm:text-base text-gray-600 truncate">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            )}
          </div>
          {!address && (
            <Button 
              className='bg-hathor-purple-700 hover:bg-hathor-purple-600 text-white rounded-full outline outline-1 outline-hathor-purple-600 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base whitespace-nowrap'
              onClick={handleConnect}
              disabled={connecting || !client}
            >
              {connecting ? 'Connecting...' : 'Connect wallet'}
            </Button>
          )}
          {address && (
            <Button 
              className='bg-hathor-purple-700 hover:bg-hathor-purple-600 text-white rounded-full outline outline-1 outline-hathor-purple-600 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base whitespace-nowrap'
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          )}
        </CardContent>
      </Card>

      {connectionUri && !address && (
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-3">
              <div className="text-sm sm:text-base text-gray-500 font-medium">Connection URI</div>
              <div className="flex items-center space-x-3">
                <code className="flex-1 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded break-all">
                  {formatUri(connectionUri)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyUri}
                  className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {address && (
        <Button 
          className='bg-hathor-purple-700 hover:bg-hathor-purple-600 text-white rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium outline outline-1 outline-hathor-purple-600 w-full sm:w-auto'
          onClick={handleStart}
        >
          Start
        </Button>
      )}
    </div>
  );
};

export { WalletConnect }; 