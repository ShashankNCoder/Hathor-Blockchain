import React from 'react';
import { TokenWithBalance } from '@/types';

interface TokenDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  token: TokenWithBalance;
  onSend: () => void;
  onReceive: () => void;
}

const TokenDetailsModal: React.FC<TokenDetailsModalProps> = ({
  isVisible,
  onClose,
  token,
  onSend,
  onReceive
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Token Details</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-[#2aabee]/10 rounded-full flex items-center justify-center mr-4">
              <span className="text-[#2aabee] text-2xl font-medium">{token.symbol}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{token.name}</h3>
              <p className="text-neutral-500 dark:text-neutral-400">{token.symbol}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Balance</p>
              <p className="text-lg font-semibold">{token.balance.toLocaleString()} {token.symbol}</p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">USD Value</p>
              <p className="text-lg font-semibold">${token.usdValue?.toLocaleString() ?? '0.00'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Token Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Type</span>
                <span>{token.type === 'native' ? 'Native Token' : 'Community Token'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Token ID</span>
                <span className="font-mono">{token.id}</span>
              </div>
              {token.change && (
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">24h Change</span>
                  <span className={token.change.direction === 'up' ? 'text-success' : 'text-error'}>
                    {token.change.direction === 'up' ? '+' : '-'}{token.change.value}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onSend}
              className="flex-1 py-2 bg-[#2aabee] text-white rounded-lg font-medium hover:bg-[#2aabee]/90"
            >
              Send
            </button>
            <button
              onClick={onReceive}
              className="flex-1 py-2 border border-[#2aabee] text-[#2aabee] rounded-lg font-medium hover:bg-[#2aabee]/10"
            >
              Receive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailsModal; 