import React from 'react';
import { TokenBalance } from '@/lib/hathor';

interface TokenCardProps {
  token: TokenBalance;
  onClick?: () => void;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, onClick }) => {
  const getBgColorClass = () => {
    switch (token.symbol) {
      case 'HTR':
        return 'bg-hathor-purple/10';
      case 'BREW':
        return 'bg-blue-500/10';
      case 'VIBE':
        return 'bg-green-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  const getTextColorClass = () => {
    switch (token.symbol) {
      case 'HTR':
        return 'text-hathor-purple';
      case 'BREW':
        return 'text-blue-500';
      case 'VIBE':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getChangeTextColorClass = () => {
    if (!token.change) return 'text-neutral-500 dark:text-neutral-400';
    
    if (token.change.direction === 'up') {
      return 'text-success';
    } else if (token.change.direction === 'down') {
      return 'text-error';
    } else {
      return 'text-neutral-500 dark:text-neutral-400';
    }
  };

  return (
    <div
      className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center"
      onClick={onClick}
    >
      <div className={`w-10 h-10 ${getBgColorClass()} rounded-full flex items-center justify-center mr-3`}>
        <span className={`font-semibold ${getTextColorClass()}`}>{token.symbol}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium">{token.name}</span>
          <span className="font-semibold">{token.balance.toLocaleString()} {token.symbol}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {token.type === 'native' ? 'Native Token' : 'Community Token'}
          </span>
          <span className={`text-xs ${getChangeTextColorClass()}`}>
            {token.usdValue ? `≈ $${token.usdValue.toLocaleString()}` : ''}
            {token.change ? `${token.change.direction === 'up' ? '+' : '-'}${token.change.value}% today` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
