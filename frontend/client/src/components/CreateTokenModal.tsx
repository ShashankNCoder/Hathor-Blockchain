import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useComingSoon } from "@/hooks/use-coming-soon";

interface CreateTokenModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CreateTokenModal: React.FC<CreateTokenModalProps> = ({ isVisible, onClose }) => {
  const { toast } = useToast();
  const { notifyComingSoon } = useComingSoon();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notifyComingSoon("Token Creation");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Token</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Token Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                placeholder="e.g. My Token"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Token Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full p-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                placeholder="e.g. MTK"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Initial Supply</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                placeholder="e.g. 1000000"
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2aabee] text-white rounded-lg hover:bg-[#2aabee]/90"
            >
              Create Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTokenModal; 