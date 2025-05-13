
import React, { useState } from 'react';
import GrowthChart from './charts/GrowthChart';
import AssetCard from './AssetCard';
import { useFinance, AssetType } from '../context/FinanceContext';

interface HomeTabProps {
  onAssetClick: (assetType: AssetType) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ onAssetClick }) => {
  const { accounts, netWorth, totalInvested, historicalNetWorth, assetAllocation } = useFinance();
  const [timeFrame, setTimeFrame] = useState<'1M' | '3M' | '6M' | '1Y' | 'All'>('6M');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate growth percentage
  const calculateGrowth = () => {
    if (totalInvested === 0) return 0;
    return ((netWorth - totalInvested) / totalInvested) * 100;
  };

  const growth = calculateGrowth();
  const interest = netWorth - totalInvested;

  // Group accounts by asset type
  const accountsByAssetType = accounts.reduce((groups, account) => {
    if (!groups[account.assetType]) {
      groups[account.assetType] = [];
    }
    groups[account.assetType].push(account);
    return groups;
  }, {} as Record<AssetType, typeof accounts>);

  return (
    <div className="tab-container pb-20">
      {/* Net Worth Section */}
      <div className="mb-6 bg-gradient-primary text-white p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-1">Your Net Worth</h2>
        <p className="text-3xl font-bold">{formatCurrency(netWorth)}</p>
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-sm text-white/70">Initial Investment</p>
            <p className="text-md font-medium">{formatCurrency(totalInvested)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70">Total Growth</p>
            <p className={`text-md font-medium ${growth >= 0 ? '' : 'text-red-300'}`}>
              {interest >= 0 ? '+' : ''}{formatCurrency(interest)} ({growth.toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="mb-6">
        <GrowthChart 
          data={historicalNetWorth} 
          timeFrame={timeFrame} 
          onTimeFrameChange={setTimeFrame}
        />
      </div>

      {/* Assets List */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Your Assets</h3>
        {/* Show assets in a specific order */}
        {(['money', 'savings', 'investments', 'physical'] as AssetType[])
          .filter(assetType => assetAllocation[assetType])
          .map((assetType) => (
            <AssetCard
              key={assetType}
              type={assetType}
              accounts={accountsByAssetType[assetType] || []}
              totalBalance={assetAllocation[assetType] || 0}
              onClickAsset={onAssetClick}
            />
          ))}
      </div>
    </div>
  );
};

export default HomeTab;
