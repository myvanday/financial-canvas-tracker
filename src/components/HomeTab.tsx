
import React, { useState } from 'react';
import GrowthChart from './charts/GrowthChart';
import AssetCard from './AssetCard';
import { useFinance, AssetType } from '../context/FinanceContext';

type TimeFrame = '1M' | '3M' | '6M' | '1Y' | 'All';

interface HomeTabProps {
  onAssetClick: (assetType: AssetType) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ onAssetClick }) => {
  const { accounts, netWorth, historicalNetWorth, assetAllocation } = useFinance();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('6M');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Your Net Worth</h2>
        <p className="text-3xl font-bold text-primary">{formatCurrency(netWorth)}</p>
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
        {Object.entries(assetAllocation).map(([assetType, totalBalance]) => (
          <AssetCard
            key={assetType}
            type={assetType as AssetType}
            accounts={accountsByAssetType[assetType as AssetType] || []}
            totalBalance={totalBalance}
            onClickAsset={onAssetClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeTab;
