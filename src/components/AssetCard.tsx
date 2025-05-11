import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Account, AssetType } from '../context/FinanceContext';

interface AssetCardProps {
  type: AssetType;
  accounts: Account[];
  totalBalance: number;
  onClickAsset: (type: AssetType) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ 
  type, 
  accounts, 
  totalBalance,
  onClickAsset
}) => {
  const assetIcons: Record<AssetType, string> = {
    money: '💵',
    savings: '💰',
    investments: '📈',
    physical: '🏠'
  };

  const assetLabels: Record<AssetType, string> = {
    money: 'Money',
    savings: 'Savings',
    investments: 'Investments',
    physical: 'Physical Assets'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate growth rate (mock data for now)
  const calculateGrowth = () => {
    const initialTotal = accounts.reduce((sum, account) => sum + account.initialBalance, 0);
    if (initialTotal === 0) return 0;
    return ((totalBalance - initialTotal) / initialTotal) * 100;
  };
  
  const growth = calculateGrowth();

  const getAssetClassName = () => {
    return `asset-card asset-${type} cursor-pointer`;
  };

  return (
    <div 
      className={`asset-card asset-${type} cursor-pointer`}
      onClick={() => onClickAsset(type)}
    >
      <div className="asset-card-header">
        <div className="flex items-center">
          <div className="asset-icon-container mr-2">
            <span className="text-xl">{assetIcons[type]}</span>
          </div>
          <h3 className="font-medium">{assetLabels[type]}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="card-amount">{formatCurrency(totalBalance)}</span>
          <ChevronRight className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="flex justify-between">
        <p className="card-label text-white/80">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        <p className={`text-xs font-medium ${growth >= 0 ? 'text-white' : 'text-white/80'}`}>
          {growth >= 0 ? '+' : ''}{growth.toFixed(2)}% growth
        </p>
      </div>
    </div>
  );
};

export default AssetCard;
