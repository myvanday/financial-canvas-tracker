
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

  // Calculate growth rate
  const calculateGrowth = () => {
    const initialTotal = accounts.reduce((sum, account) => sum + account.initialBalance, 0);
    if (initialTotal === 0) return 0;
    return ((totalBalance - initialTotal) / initialTotal) * 100;
  };
  
  const growth = calculateGrowth();

  return (
    <div 
      className={`asset-card asset-${type} cursor-pointer`}
      onClick={() => onClickAsset(type)}
    >
      <div className="asset-card-header">
        <div className="flex items-start flex-col">
          <div className="flex items-center">
            <div className="asset-icon-container mr-2">
              <span className="text-xl">{assetIcons[type]}</span>
            </div>
            <h3 className="font-medium">{assetLabels[type]}</h3>
          </div>
          <p className="card-label ml-12">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="card-amount">{formatCurrency(totalBalance)}</span>
          <p className={`text-xs font-medium ${growth >= 0 ? 'growth-positive' : 'growth-negative'}`}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(2)}% growth
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
