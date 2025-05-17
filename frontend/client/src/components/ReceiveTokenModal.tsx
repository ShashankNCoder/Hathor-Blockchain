import React from 'react';
import { TokenWithBalance } from '@/types';

interface ReceiveTokenModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedToken?: TokenWithBalance;
  walletAddress: string;
}

const ReceiveTokenModal: React.FC<ReceiveTokenModalProps> = ({
  isVisible,
  onClose,
  selectedToken,
  walletAddress
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Receive Tokens</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white p-4 rounded-lg">
              {/* QR Code would go here */}
              <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                <i className="fas fa-qrcode text-4xl text-neutral-400"></i>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Wallet Address</label>
            <div className="relative">
              <input
                type="text"
                value={walletAddress}
                readOnly
                className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-700 pr-10"
              />
              <button
                onClick={() => navigator.clipboard.writeText(walletAddress)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>

          {selectedToken && (
            <div>
              <label className="block text-sm font-medium mb-1">Selected Token</label>
              <div className="p-2 border rounded-lg bg-white dark:bg-neutral-700">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#2aabee]/10 rounded-full flex items-center justify-center mr-2">
                    <span className="text-[#2aabee] font-medium">{selectedToken.symbol}</span>
                  </div>
                  <span>{selectedToken.name}</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            <p>Share this address to receive tokens. Make sure you're receiving the correct token type.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveTokenModal; 