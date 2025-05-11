
import React from 'react';
import { Transaction } from '../context/FinanceContext';
import { formatDistanceToNow } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
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

  const getFormattedDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const difference = transaction.newBalance - transaction.previousBalance;
  const isPositive = difference >= 0;

  const assetIcons: Record<string, string> = {
    cash: '💵',
    investment: '📈',
    property: '🏠',
    vehicle: '🚗',
    other: '📦'
  };

  return (
    <div className="asset-card">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <span className="mr-2">{assetIcons[transaction.assetType]}</span>
            <h4 className="font-medium">{transaction.accountName}</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{getFormattedDate(transaction.date)}</p>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${isPositive ? 'text-finance-green' : 'text-finance-red'}`}>
            {isPositive ? '+' : ''}{formatCurrency(difference)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(transaction.previousBalance)} → {formatCurrency(transaction.newBalance)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
