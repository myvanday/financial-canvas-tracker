
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFinance, AssetType } from '../context/FinanceContext';
import AssetCard from '../components/AssetCard';
import GrowthChart from '../components/charts/GrowthChart';
import { colors } from '../navigation/TabNavigator';
import Icon from '../components/Icon';

const HomeScreen = () => {
  const { accounts, netWorth, totalInvested, historicalNetWorth, assetAllocation } = useFinance();
  const [timeFrame, setTimeFrame] = useState<'1M' | '3M' | '6M' | '1Y' | 'All'>('6M');
  const navigation = useNavigation();

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

  const handleAssetClick = (assetType: AssetType) => {
    navigation.navigate('Portfolio', { selectedAssetType: assetType });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Net Worth Tracker</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Icon name="settings" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Net Worth Section */}
        <View style={styles.netWorthCard}>
          <Text style={styles.sectionTitle}>Your Net Worth</Text>
          <Text style={styles.netWorthValue}>{formatCurrency(netWorth)}</Text>
          <View style={styles.netWorthDetails}>
            <Text style={styles.investedText}>Invested: {formatCurrency(totalInvested)}</Text>
            <Text style={[styles.growthText, growth >= 0 ? styles.positiveGrowth : styles.negativeGrowth]}>
              {growth >= 0 ? '+' : ''}{growth.toFixed(2)}% growth
            </Text>
          </View>
        </View>

        {/* Growth Chart */}
        <View style={styles.chartContainer}>
          <GrowthChart 
            data={historicalNetWorth} 
            timeFrame={timeFrame} 
            onTimeFrameChange={setTimeFrame}
          />
        </View>

        {/* Assets List */}
        <View style={styles.assetsSection}>
          <Text style={styles.sectionTitle}>Your Assets</Text>
          {(['money', 'savings', 'investments', 'physical'] as AssetType[])
            .filter(assetType => assetAllocation[assetType])
            .map((assetType) => (
              <AssetCard
                key={assetType}
                type={assetType}
                accounts={accountsByAssetType[assetType] || []}
                totalBalance={assetAllocation[assetType] || 0}
                onClickAsset={() => handleAssetClick(assetType)}
              />
            ))}
        </View>
        
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddAccount')}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBg,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
  },
  settingsButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  netWorthCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  netWorthValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 4,
  },
  netWorthDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  investedText: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '500',
  },
  positiveGrowth: {
    color: colors.success,
  },
  negativeGrowth: {
    color: colors.error,
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  assetsSection: {
    marginBottom: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default HomeScreen;
