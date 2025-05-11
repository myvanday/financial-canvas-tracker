
import React, { useState } from 'react';
import AssetAllocationChart from './charts/AssetAllocationChart';
import GrowthChart from './charts/GrowthChart';
import { useFinance, Account, AssetType } from '../context/FinanceContext';
import AccountCard from './AccountCard';
import { ArrowLeft } from 'lucide-react';

interface PortfolioTabProps {
  onAccountClick: (account: Account) => void;
  selectedAssetType?: AssetType | null;
}

const PortfolioTab: React.FC<PortfolioTabProps> = ({ onAccountClick, selectedAssetType: externalSelectedAsset }) => {
  const { accounts, assetAllocation, assetAllocations, historicalNetWorth, getAssetTypeLabel } = useFinance();
  const [internalSelectedAsset, setInternalSelectedAsset] = useState<AssetType | null>(null);
  const [timeFrame, setTimeFrame] = useState<'1M' | '3M' | '6M' | '1Y' | 'All'>('6M');
  
  // Use external selected asset if provided, otherwise use internal state
  const selectedAsset = externalSelectedAsset !== undefined ? externalSelectedAsset : internalSelectedAsset;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  // Calculate total for asset type
  const totalForAssetType = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate initial investment for asset type
  const initialInvestmentForAssetType = filteredAccounts.reduce((sum, account) => sum + account.initialBalance, 0);
  
  // Growth percentage for the asset type
  const assetGrowth = initialInvestmentForAssetType > 0 
    ? ((totalForAssetType - initialInvestmentForAssetType) / initialInvestmentForAssetType) * 100
    : 0;

  const accountDistribution = getAccountDistribution();

  // Get historical data for this asset type only
  const getAssetHistoricalData = () => {
    if (!selectedAsset) return [];
    
    return historicalNetWorth.map(data => ({
      date: data.date,
      purchaseAmount: data.purchaseAmount * (initialInvestmentForAssetType / data.purchaseAmount),
      currentAmount: data.currentAmount * (totalForAssetType / data.currentAmount)
    }));
  };

  const handleAssetClick = (assetType: AssetType) => {
    setInternalSelectedAsset(assetType);
  };

  const handleBackClick = () => {
    setInternalSelectedAsset(null);
  };

  const getAssetColor = (assetType: AssetType): string => {
    const colors: Record<AssetType, string> = {
      money: "bg-gradient-money",
      savings: "bg-gradient-savings", 
      investments: "bg-gradient-investments",
      physical: "bg-gradient-physical"
    };
    return colors[assetType] || "";
  };

  return (
    <div className="tab-container pb-20">
      {!selectedAsset ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
          <AssetAllocationChart 
            data={assetAllocation} 
            historicalData={assetAllocations}
            title="Asset Distribution" 
            showTimeSelector={true}
          />
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Your Assets</h3>
            {Object.entries(assetAllocation)
              .sort(([, a], [, b]) => b - a) // Sort by value descending
              .map(([assetType, totalBalance]) => {
                // Calculate asset-specific growth
                const assetAccounts = accounts.filter(acc => acc.assetType === assetType);
                const initialTotal = assetAccounts.reduce((sum, acc) => sum + acc.initialBalance, 0);
                const currentTotal = assetAccounts.reduce((sum, acc) => sum + acc.balance, 0);
                const growthPercent = initialTotal > 0 
                  ? ((currentTotal - initialTotal) / initialTotal) * 100
                  : 0;

                return (
                  <div 
                    key={assetType}
                    className={`asset-card ${getAssetColor(assetType as AssetType)}`}
                    onClick={() => handleAssetClick(assetType as AssetType)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{getAssetTypeLabel(assetType as AssetType)}</h4>
                        <p className="text-xs opacity-80">
                          {accounts.filter(acc => acc.assetType === assetType).length} accounts
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="card-amount">{formatCurrency(totalBalance)}</p>
                        <p className="text-xs font-medium">
                          {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(1)}%
                          <span className="ml-1 opacity-80">
                            ({((totalBalance / Object.values(assetAllocation).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <>
          <button 
            className="flex items-center text-primary mb-4"
            onClick={handleBackClick}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Asset Allocation
          </button>
          
          <div className={`p-4 rounded-xl mb-4 ${getAssetColor(selectedAsset)}`}>
            <h2 className="text-xl font-semibold">{getAssetTypeLabel(selectedAsset)}</h2>
            <p className="text-2xl font-bold">{formatCurrency(totalForAssetType)}</p>
            <p className="text-xs mt-1">
              Initially invested: {formatCurrency(initialInvestmentForAssetType)} | 
              Growth: {assetGrowth >= 0 ? '+' : ''}{assetGrowth.toFixed(2)}%
            </p>
          </div>

          {/* Asset Growth Chart */}
          <div className="mb-6">
            <GrowthChart 
              data={getAssetHistoricalData()} 
              timeFrame={timeFrame}
              onTimeFrameChange={setTimeFrame} 
            />
          </div>
          
          {Object.keys(accountDistribution).length > 1 && (
            <AssetAllocationChart data={accountDistribution} title="Account Distribution" />
          )}
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Accounts</h3>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map(account => (
                <AccountCard 
                  key={account.id} 
                  account={account} 
                  onClickAccount={onAccountClick} 
                />
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">No accounts in this category</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioTab;
