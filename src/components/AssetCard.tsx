
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
    cash: '💵',
    investment: '📈',
    property: '🏠',
    vehicle: '🚗',
    other: '📦'
  };

  const assetLabels: Record<AssetType, string> = {
    cash: 'Cash',
    investment: 'Investments',
    property: 'Properties',
    vehicle: 'Vehicles',
    other: 'Other Assets'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div 
      className="asset-card"
      onClick={() => onClickAsset(type)}
    >
      <div className="asset-card-header">
        <div className="flex items-center">
          <span className="text-xl mr-2">{assetIcons[type]}</span>
          <h3 className="font-medium">{assetLabels[type]}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="card-amount">{formatCurrency(totalBalance)}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <p className="card-label">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
    </div>
  );
};

export default AssetCard;
