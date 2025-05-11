
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

  return (
    <div 
      className="asset-card flex justify-between items-center"
      onClick={() => onClickAccount(account)}
    >
      <div>
        <h4 className="font-medium">{account.name}</h4>
        <p className="text-xs text-muted-foreground">
          {account.institution ? `${account.institution} • ` : ''}
          Updated {getTimeAgo(account.lastUpdated)}
        </p>
      </div>
      <span className="card-amount">{formatCurrency(account.balance)}</span>
    </div>
  );
};

export default AccountCard;
