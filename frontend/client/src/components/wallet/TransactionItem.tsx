import React from 'react';
import { Transaction } from '@/lib/hathor';
import { formatDistanceToNow } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
  const getIconClass = () => {
    switch (transaction.type) {
      case 'receive':
        return 'fas fa-arrow-down text-success';
      case 'send':
        return 'fas fa-arrow-up text-error';
      case 'nft':
        return 'fas fa-badge-check text-blue-500';
      case 'mint':
        return 'fas fa-coins text-amber-500';
      default:
        return 'fas fa-exchange-alt text-neutral-500';
    }
  };

  const getBgColorClass = () => {
    switch (transaction.type) {
      case 'receive':
        return 'bg-success/10';
      case 'send':
        return 'bg-error/10';
      case 'nft':
        return 'bg-blue-500/10';
      case 'mint':
        return 'bg-amber-500/10';
      default:
        return 'bg-neutral-500/10';
    }
  };

  const getAmountText = () => {
    switch (transaction.type) {
      case 'receive':
        return `+${transaction.amount} ${transaction.tokenSymbol}`;
      case 'send':
        return `-${transaction.amount} ${transaction.tokenSymbol}`;
      case 'nft':
        return 'NFT';
      case 'mint':
        return `+${transaction.amount} ${transaction.tokenSymbol}`;
      default:
        return `${transaction.amount} ${transaction.tokenSymbol}`;
    }
  };

  const getAmountColorClass = () => {
    switch (transaction.type) {
      case 'receive':
        return 'text-success';
      case 'send':
        return 'text-error';
      case 'nft':
        return 'text-blue-500';
      case 'mint':
        return 'text-amber-500';
      default:
        return 'text-neutral-500';
    }
  };

  const getTitle = () => {
    switch (transaction.type) {
      case 'receive':
        return `Received ${transaction.amount} ${transaction.tokenSymbol}`;
      case 'send':
        return `Sent ${transaction.amount} ${transaction.tokenSymbol}`;
      case 'nft':
        return 'NFT Badge Earned';
      case 'mint':
        return `Minted ${transaction.amount} ${transaction.tokenSymbol}`;
      default:
        return 'Transaction';
    }
  };

  const getSubtitle = () => {
    if (transaction.type === 'nft' && transaction.description) {
      return transaction.description;
    } else if (transaction.counterparty) {
      return `${transaction.type === 'receive' ? 'From' : 'To'}: ${transaction.counterparty}`;
    } else {
      return 'No details';
    }
  };

  return (
    <div 
      className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-700"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={`w-10 h-10 ${getBgColorClass()} rounded-full flex items-center justify-center mr-3`}>
            <i className={getIconClass()}></i>
          </div>
          <div>
            <p className="font-medium">{getTitle()}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{getSubtitle()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-medium ${getAmountColorClass()}`}>{getAmountText()}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
