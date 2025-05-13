
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Account } from '../context/FinanceContext';
import { formatDistanceToNow } from 'date-fns';
import { colors } from '../navigation/TabNavigator';

interface AccountCardProps {
  account: Account;
  onClickAccount: (account: Account) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onClickAccount }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency || 'USD',
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
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onClickAccount(account)}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{account.name}</Text>
          <Text style={styles.subtitle}>
            {account.institution ? `${account.institution} • ` : ''}
            Updated {getTimeAgo(account.lastUpdated)}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{formatCurrency(account.balance)}</Text>
          <Text style={[
            styles.growthText, 
            growth >= 0 ? styles.positiveGrowth : styles.negativeGrowth
          ]}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.lightText,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  positiveGrowth: {
    color: colors.success,
  },
  negativeGrowth: {
    color: colors.error,
  },
});

export default AccountCard;
