
import React from 'react';
import { Account } from '../context/FinanceContext';
import { formatDistanceToNow } from 'date-fns';

interface AccountCardProps {
  account: Account;
  onClickAccount: (account: Account) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onClickAccount }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Calculate growth rate
  const calculateGrowth = () => {
    if (account.initialBalance === 0) return 0;
    return ((account.balance - account.initialBalance) / account.initialBalance) * 100;
  };
  
  const growth = calculateGrowth();

  return (
    <div 
      className="asset-card flex flex-col"
      onClick={() => onClickAccount(account)}
    >
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium">{account.name}</h4>
        <span className="card-amount">{formatCurrency(account.balance)}</span>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {account.institution ? `${account.institution} • ` : ''}
          Updated {getTimeAgo(account.lastUpdated)}
        </p>
        <p className={`text-xs font-medium ${growth >= 0 ? 'growth-positive' : 'growth-negative'}`}>
          {growth >= 0 ? '+' : ''}{growth.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default AccountCard;
