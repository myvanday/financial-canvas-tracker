
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Account, AssetType } from '../context/FinanceContext';
import { colors } from '../navigation/TabNavigator';
import Icon from './Icon';

interface AssetCardProps {
  type: AssetType;
  accounts: Account[];
  totalBalance: number;
  onClickAsset: (type: AssetType) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ 
  type, 
  accounts, 
  totalBalance,
  onClickAsset
}) => {
  const assetIcons: Record<AssetType, string> = {
    money: '💵',
    savings: '💰',
    investments: '📈',
    physical: '🏠'
  };

  const assetLabels: Record<AssetType, string> = {
    money: 'Money',
    savings: 'Savings',
    investments: 'Investments',
    physical: 'Physical Assets'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate growth rate
  const calculateGrowth = () => {
    const initialTotal = accounts.reduce((sum, account) => sum + account.initialBalance, 0);
    if (initialTotal === 0) return 0;
    return ((totalBalance - initialTotal) / initialTotal) * 100;
  };
  
  const growth = calculateGrowth();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onClickAsset(type)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.leftContent}>
          <View style={styles.assetInfo}>
            <Text style={styles.assetIcon}>{assetIcons[type]}</Text>
            <Text style={styles.assetTitle}>{assetLabels[type]}</Text>
          </View>
          <Text style={styles.accountsCount}>
            {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.balanceText}>{formatCurrency(totalBalance)}</Text>
          <Text style={[
            styles.growthText, 
            growth >= 0 ? styles.positiveGrowth : styles.negativeGrowth
          ]}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(2)}% growth
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.muted} style={styles.chevron} />
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  assetIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  accountsCount: {
    fontSize: 14,
    color: colors.lightText,
    marginLeft: 28,
  },
  rightContent: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  balanceText: {
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
  chevron: {
    alignSelf: 'center',
  }
});

export default AssetCard;
