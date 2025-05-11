
import React, { useState } from 'react';
import AssetAllocationChart from './charts/AssetAllocationChart';
import { useFinance, Account, AssetType } from '../context/FinanceContext';
import AccountCard from './AccountCard';

interface PortfolioTabProps {
  onAccountClick: (account: Account) => void;
}

const PortfolioTab: React.FC<PortfolioTabProps> = ({ onAccountClick }) => {
  const { accounts, assetAllocation } = useFinance();
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const assetLabels: Record<AssetType, string> = {
    cash: 'Cash',
    investment: 'Investments',
    property: 'Properties',
    vehicle: 'Vehicles',
    other: 'Other Assets'
  };

  // Filter accounts by selected asset type
  const filteredAccounts = selectedAsset 
    ? accounts.filter(account => account.assetType === selectedAsset) 
    : [];

  // Get account distribution for a specific asset type
  const getAccountDistribution = () => {
    if (!selectedAsset) return {};

    return filteredAccounts.reduce((distribution, account) => {
      distribution[account.name] = account.balance;
      return distribution;
    }, {} as Record<string, number>);
  };

  const accountDistribution = getAccountDistribution();
  const totalForAssetType = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);

  const handleAssetClick = (assetType: AssetType) => {
    setSelectedAsset(assetType);
  };

  const handleBackClick = () => {
    setSelectedAsset(null);
  };

  return (
    <div className="tab-container pb-20">
      {!selectedAsset ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
          <AssetAllocationChart data={assetAllocation} title="Asset Distribution" />
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Your Assets</h3>
            {Object.entries(assetAllocation)
              .sort(([, a], [, b]) => b - a) // Sort by value descending
              .map(([assetType, totalBalance]) => (
                <div 
                  key={assetType}
                  className="asset-card flex justify-between items-center"
                  onClick={() => handleAssetClick(assetType as AssetType)}
                >
                  <div>
                    <h4 className="font-medium">{assetLabels[assetType as AssetType]}</h4>
                    <p className="text-xs text-muted-foreground">
                      {accounts.filter(acc => acc.assetType === assetType).length} accounts
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="card-amount">{formatCurrency(totalBalance)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((totalBalance / Object.values(assetAllocation).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <button 
            className="flex items-center text-primary mb-4"
            onClick={handleBackClick}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Asset Allocation
          </button>
          
          <h2 className="text-xl font-semibold mb-2">{assetLabels[selectedAsset]}</h2>
          <p className="text-lg font-bold text-primary mb-4">{formatCurrency(totalForAssetType)}</p>
          
          {Object.keys(accountDistribution).length > 1 && (
            <AssetAllocationChart data={accountDistribution} title="Account Distribution" />
          )}
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Accounts</h3>
            {filteredAccounts.map(account => (
              <AccountCard 
                key={account.id} 
                account={account} 
                onClickAccount={onAccountClick} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioTab;
