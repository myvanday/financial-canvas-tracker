
import React from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionItem from './TransactionItem';

const HistoryTab: React.FC = () => {
  const { transactions } = useFinance();

  // Group transactions by date (YYYY-MM-DD)
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="tab-container pb-20">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No transactions yet</p>
        </div>
      ) : (
        <>
          {sortedDates.map(date => (
            <div key={date} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {formatDate(date)}
              </h3>
              {groupedTransactions[date]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(transaction => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default HistoryTab;
