
import React, { useState } from 'react';
import GrowthChart from './charts/GrowthChart';
import AssetCard from './AssetCard';
import { useFinance, AssetType } from '../context/FinanceContext';

type TimeFrame = '1M' | '3M' | '6M' | '1Y' | 'All';

interface HomeTabProps {
  onAssetClick: (assetType: AssetType) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ onAssetClick }) => {
  const { accounts, netWorth, totalInvested, historicalNetWorth, assetAllocation } = useFinance();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('6M');

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
      <div className="mb-6 bg-gradient-primary text-white p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-1">Your Net Worth</h2>
        <p className="text-3xl font-bold">{formatCurrency(netWorth)}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm">Invested: {formatCurrency(totalInvested)}</p>
          <p className={`text-sm font-medium ${growth >= 0 ? '' : 'text-red-300'}`}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(2)}% growth
          </p>
        </div>
      </div>

      {/* Time Frame Selector */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
        {(['1M', '3M', '6M', '1Y', 'All'] as TimeFrame[]).map((frame) => (
          <button
            key={frame}
            className={`px-3 py-1 rounded-full text-sm ${
              timeFrame === frame
                ? 'bg-primary text-white font-medium'
                : 'bg-muted text-muted-foreground'
            }`}
            onClick={() => setTimeFrame(frame)}
          >
            {frame}
          </button>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="mb-6">
        <GrowthChart data={historicalNetWorth} timeFrame={timeFrame} />
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
