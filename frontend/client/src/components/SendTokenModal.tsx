import React, { useState } from 'react';
import { TokenWithBalance } from '@/types';

interface SendTokenModalProps {
  isVisible: boolean;
  onClose: () => void;
  tokens: TokenWithBalance[];
  selectedToken?: TokenWithBalance;
  onSend: (recipient: string, tokenId: string, amount: number, message?: string) => Promise<void>;
}

const SendTokenModal: React.FC<SendTokenModalProps> = ({
  isVisible,
  onClose,
  tokens,
  selectedToken,
  onSend
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTokenId, setSelectedTokenId] = useState<string | undefined>(selectedToken?.id);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTokenId || !amount || !recipient) return;

    setIsLoading(true);
    try {
      await onSend(recipient, selectedTokenId, parseFloat(amount), message);
      onClose();
    } catch (error) {
      console.error('Error sending token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl w-full max-w-md max-h-[75vh] flex flex-col">
        <div className="flex justify-between items-center p-6 pb-3">
          <h2 className="text-xl font-bold">Send Tokens</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Token</label>
              <select
                value={selectedTokenId}
                onChange={(e) => setSelectedTokenId(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-700"
                required
              >
                <option value="">Select a token</option>
                {tokens.map(token => (
                  <option key={token.id} value={token.id}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-700"
                placeholder="Enter recipient address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-700"
                placeholder="Enter amount"
                step="0.000001"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-700"
                placeholder="Add a message"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-[#2aabee] text-white rounded-lg font-medium hover:bg-[#2aabee]/90 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Tokens'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendTokenModal; 