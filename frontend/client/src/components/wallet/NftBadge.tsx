import React from 'react';
import { NFTBadge } from '@/lib/hathor';

interface NftBadgeProps {
  badge: NFTBadge;
  onClick?: () => void;
}

const NftBadgeCard: React.FC<NftBadgeProps> = ({ badge, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-neutral-800 rounded-lg p-2 shadow-sm border border-neutral-200 dark:border-neutral-700 relative"
      onClick={onClick}
    >
      <img 
        src={badge.imageUrl} 
        alt={badge.name} 
        className={`w-full aspect-square object-cover rounded-lg mb-2 ${badge.isLocked ? 'opacity-50 filter grayscale' : ''}`}
      />
      {badge.isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-lock text-white text-xl"></i>
        </div>
      )}
      <p className={`text-xs font-medium text-center truncate ${badge.isLocked ? 'text-neutral-400' : ''}`}>
        {badge.name}
      </p>
    </div>
  );
};

export default NftBadgeCard;
