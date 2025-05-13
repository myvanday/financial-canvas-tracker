
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFinance, Account, AssetType } from '../context/FinanceContext';
import AccountCard from '../components/AccountCard';
import Icon from '../components/Icon';
import { colors } from '../navigation/TabNavigator';
import AssetAllocationChart from '../components/charts/AssetAllocationChart';
import GrowthChart from '../components/charts/GrowthChart';

const PortfolioScreen = () => {
  const { accounts, assetAllocation, assetAllocations, historicalNetWorth, getAssetTypeLabel } = useFinance();
  const [internalSelectedAsset, setInternalSelectedAsset] = useState<AssetType | null>(null);
  const [timeFrame, setTimeFrame] = useState<'1M' | '3M' | '6M' | '1Y' | 'All'>('6M');
  const navigation = useNavigation();
  const route = useRoute();
  
  // Check if assetType was passed from HomeScreen
  useEffect(() => {
    if (route.params?.selectedAssetType) {
      setInternalSelectedAsset(route.params.selectedAssetType);
    }
  }, [route.params?.selectedAssetType]);

  // Use external selected asset if provided, otherwise use internal state
  const selectedAsset = internalSelectedAsset;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter accounts by selected asset type
  const filteredAccounts = selectedAsset 
    ? accounts.filter(account => account.assetType === selectedAsset) 
    : [];

  // Calculate total for asset type
  const totalForAssetType = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate initial investment for asset type
  const initialInvestmentForAssetType = filteredAccounts.reduce((sum, account) => sum + account.initialBalance, 0);
  
  // Growth percentage for the asset type
  const assetGrowth = initialInvestmentForAssetType > 0 
    ? ((totalForAssetType - initialInvestmentForAssetType) / initialInvestmentForAssetType) * 100
    : 0;

  // Get historical data for this asset type only
  const getAssetHistoricalData = () => {
    if (!selectedAsset) return [];
    
    return historicalNetWorth.map(data => ({
      date: data.date,
      purchaseAmount: data.purchaseAmount * (initialInvestmentForAssetType / data.purchaseAmount),
      currentAmount: data.currentAmount * (totalForAssetType / data.currentAmount)
    }));
  };

  const handleAssetClick = (assetType: AssetType) => {
    setInternalSelectedAsset(assetType);
  };

  const handleBackClick = () => {
    setInternalSelectedAsset(null);
  };

  const handleAccountClick = (account: Account) => {
    navigation.navigate('AccountDetail', { accountId: account.id });
  };

  const getAssetColor = (assetType: AssetType): string => {
    // In React Native, we'll return style properties instead of class names
    switch (assetType) {
      case 'money':
        return colors.primary;
      case 'savings':
        return colors.primary; 
      case 'investments':
        return colors.primary;
      case 'physical':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {!selectedAsset ? (
          <>
            <Text style={styles.sectionTitle}>Asset Allocation</Text>
            <View style={styles.chartCard}>
              <AssetAllocationChart 
                data={assetAllocation} 
                historicalData={assetAllocations}
                title="Asset Distribution" 
                showTimeSelector={true}
              />
            </View>
            
            <View style={styles.assetsSection}>
              <Text style={styles.sectionTitle}>Your Assets</Text>
              {Object.entries(assetAllocation)
                .sort(([, a], [, b]) => b - a) // Sort by value descending
                .map(([assetType, totalBalance]) => {
                  // Calculate asset-specific growth
                  const assetAccounts = accounts.filter(acc => acc.assetType === assetType);
                  const initialTotal = assetAccounts.reduce((sum, acc) => sum + acc.initialBalance, 0);
                  const currentTotal = assetAccounts.reduce((sum, acc) => sum + acc.balance, 0);
                  const growthPercent = initialTotal > 0 
                    ? ((currentTotal - initialTotal) / initialTotal) * 100
                    : 0;

                  return (
                    <TouchableOpacity 
                      key={assetType}
                      style={styles.assetCard}
                      onPress={() => handleAssetClick(assetType as AssetType)}
                    >
                      <View style={styles.assetCardContent}>
                        <View style={styles.leftContent}>
                          <Text style={styles.assetTitle}>{getAssetTypeLabel(assetType as AssetType)}</Text>
                          <Text style={styles.accountsCount}>
                            {accounts.filter(acc => acc.assetType === assetType).length} accounts
                          </Text>
                        </View>
                        <View style={styles.rightContent}>
                          <Text style={styles.balanceText}>{formatCurrency(totalBalance)}</Text>
                          <View style={styles.growthRow}>
                            <Text style={[
                              styles.growthText, 
                              growthPercent >= 0 ? styles.positiveGrowth : styles.negativeGrowth
                            ]}>
                              {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(1)}%
                            </Text>
                            <Text style={styles.percentageText}>
                              ({((totalBalance / Object.values(assetAllocation).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)
                            </Text>
                          </View>
                        </View>
                        <Icon name="chevron-right" size={20} color={colors.muted} style={styles.chevron} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackClick}
            >
              <Icon name="arrow-left" size={18} color={colors.primary} />
              <Text style={styles.backText}>Back to Asset Allocation</Text>
            </TouchableOpacity>
            
            <View style={[styles.assetHeader, { backgroundColor: getAssetColor(selectedAsset) }]}>
              <Text style={styles.assetHeaderTitle}>{getAssetTypeLabel(selectedAsset)}</Text>
              <Text style={styles.assetHeaderValue}>{formatCurrency(totalForAssetType)}</Text>
              <Text style={styles.assetHeaderDetails}>
                Initially invested: {formatCurrency(initialInvestmentForAssetType)} | 
                Growth: {assetGrowth >= 0 ? '+' : ''}{assetGrowth.toFixed(2)}%
              </Text>
            </View>

            {/* Asset Growth Chart */}
            <View style={styles.chartCard}>
              <GrowthChart 
                data={getAssetHistoricalData()} 
                timeFrame={timeFrame}
                onTimeFrameChange={setTimeFrame} 
              />
            </View>
            
            <View style={styles.assetsSection}>
              <Text style={styles.sectionTitle}>Accounts</Text>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map(account => (
                  <AccountCard 
                    key={account.id} 
                    account={account} 
                    onClickAccount={handleAccountClick} 
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No accounts in this category</Text>
                </View>
              )}
            </View>
          </>
        )}
        
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  chartCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  assetsSection: {
    marginBottom: 20,
  },
  assetCard: {
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
  assetCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  accountsCount: {
    fontSize: 14,
    color: colors.lightText,
    opacity: 0.8,
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
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  percentageText: {
    fontSize: 12,
    color: colors.lightText,
    marginLeft: 4,
  },
  chevron: {
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  assetHeader: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  assetHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.background,
    marginBottom: 4,
  },
  assetHeaderValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 4,
  },
  assetHeaderDetails: {
    fontSize: 12,
    color: colors.background,
    opacity: 0.9,
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
  addButton: {
    position: 'absolute',
    bottom: 20,
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

export default PortfolioScreen;
