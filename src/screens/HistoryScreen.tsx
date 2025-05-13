
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { colors } from '../navigation/TabNavigator';
import Icon from '../components/Icon';

const HistoryScreen = () => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Transaction History</Text>
        
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        ) : (
          <>
            {sortedDates.map(date => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>
                  {formatDate(date)}
                </Text>
                {groupedTransactions[date]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(transaction => {
                    const difference = transaction.newBalance - transaction.previousBalance;
                    const isPositive = difference >= 0;

                    return (
                      <View key={transaction.id} style={styles.transactionItem}>
                        <View style={styles.transactionContent}>
                          <View style={styles.transactionLeft}>
                            <Text style={styles.assetIcon}>
                              {transaction.assetType === 'money' ? '💵' : 
                               transaction.assetType === 'investment' ? '📈' : 
                               transaction.assetType === 'property' ? '🏠' : 
                               transaction.assetType === 'vehicle' ? '🚗' : '📦'}
                            </Text>
                            <View>
                              <Text style={styles.accountName}>{transaction.accountName}</Text>
                              <Text style={styles.transactionDate}>
                                {new Date(transaction.date).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.transactionRight}>
                            <Text style={[
                              styles.differenceAmount,
                              isPositive ? styles.positiveAmount : styles.negativeAmount
                            ]}>
                              {isPositive ? '+' : ''}{formatCurrency(difference)}
                            </Text>
                            <Text style={styles.balanceChange}>
                              {formatCurrency(transaction.previousBalance)} → {formatCurrency(transaction.newBalance)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            ))}
          </>
        )}
        
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.lightText,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.muted,
    marginBottom: 8,
  },
  transactionItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  assetIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.lightText,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  differenceAmount: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  positiveAmount: {
    color: colors.success,
  },
  negativeAmount: {
    color: colors.error,
  },
  balanceChange: {
    fontSize: 12,
    color: colors.lightText,
  }
});

export default HistoryScreen;
