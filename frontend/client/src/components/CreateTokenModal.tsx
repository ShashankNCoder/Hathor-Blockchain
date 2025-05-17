import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import hathorApi from '@/lib/api';

interface CreateTokenModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: (tokenId: string, name: string, symbol: string) => void;
}

const CreateTokenModal: React.FC<CreateTokenModalProps> = ({ isVisible, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !symbol || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await hathorApi.createToken({
        name,
        symbol,
        amount: parseInt(amount)
      });

      onSuccess(response.id, name, symbol);
      onClose();
      
      // Reset form
      setName('');
      setSymbol('');
      setAmount('');
    } catch (error) {
      console.error('Error creating token:', error);
      toast({
        title: "Error Creating Token",
        description: "There was an error creating your token. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-dark dark:text-white">Create New Token</h3>
            <button className="p-1" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Token Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2aabee] focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder="e.g. Community Token"
              />
            </div>

            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Token Symbol
              </label>
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2aabee] focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder="e.g. CTK"
                maxLength={5}
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Initial Supply
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2aabee] focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder="e.g. 1000000"
                min="1"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2aabee] hover:bg-[#2196d3] text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Token'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTokenModal; 