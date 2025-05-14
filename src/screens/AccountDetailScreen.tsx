
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFinance, Account } from '../context/FinanceContext';
import { formatDistanceToNow } from 'date-fns';
import GrowthChart from '../components/charts/GrowthChart';
import Icon from '../components/Icon';
import { colors } from '../navigation/TabNavigator';

type RootStackParamList = {
  Main: undefined;
  AddAccount: { account?: Account };
  AccountDetail: { accountId: string };
};

type AccountDetailScreenRouteProp = RouteProp<RootStackParamList, 'AccountDetail'>;
type AccountDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AccountDetailScreen = () => {
  const route = useRoute<AccountDetailScreenRouteProp>();
  const { accountId } = route.params;
  const navigation = useNavigation<AccountDetailScreenNavigationProp>();
  const { accounts, transactions } = useFinance();
  const [timeFrame, setTimeFrame] = useState<'1M' | '3M' | '6M' | '1Y' | 'All'>('6M');
  
  // Find account by ID
  const account = accounts.find(acc => acc.id === accountId);
  
  if (!account) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Account not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

  // Get transactions for this account
  const accountTransactions = transactions.filter(t => t.accountId === account.id);
  
  // Mocked historical data for the account
  const historicalData = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 9 + i);
    
    // Start with initial balance and add transactions up to this date
    let balance = account.initialBalance;
    accountTransactions.forEach(tx => {
      if (new Date(tx.date) <= date) {
        balance += tx.amount;
      }
    });
    
    // Slight growth each month
    const growthFactor = 1 + (Math.random() * 0.03); // 0-3% random growth
    
    return {
      date,
      purchaseAmount: account.initialBalance,
      currentAmount: balance * (i === 9 ? 1 : growthFactor) // Ensure last point matches current balance
    };
  });

  // Find asset-specific additional fields to display
  const renderAdditionalFields = () => {
    const fields = [];
    
    if (account.assetType === 'savings') {
      if (account.duration !== undefined) {
        fields.push(
          <View key="duration" style={styles.additionalField}>
            <Text style={styles.fieldLabel}>Duration:</Text>
            <Text style={styles.fieldValue}>{account.duration} months</Text>
          </View>
        );
      }
      
      if (account.interestRate !== undefined) {
        fields.push(
          <View key="interestRate" style={styles.additionalField}>
            <Text style={styles.fieldLabel}>Interest Rate:</Text>
            <Text style={styles.fieldValue}>{account.interestRate}%</Text>
          </View>
        );
      }
    } 
    else if (account.assetType === 'investments') {
      if (account.itemName) {
        fields.push(
          <View key="itemName" style={styles.additionalField}>
            <Text style={styles.fieldLabel}>Name:</Text>
            <Text style={styles.fieldValue}>{account.itemName}</Text>
          </View>
        );
      }
      
      if (account.quantity !== undefined) {
        fields.push(
          <View key="quantity" style={styles.additionalField}>
            <Text style={styles.fieldLabel}>Quantity:</Text>
            <Text style={styles.fieldValue}>{account.quantity}</Text>
          </View>
        );
      }
      
      if (account.pricePerUnit !== undefined) {
        fields.push(
          <View key="pricePerUnit" style={styles.additionalField}>
            <Text style={styles.fieldLabel}>Price Per Unit:</Text>
            <Text style={styles.fieldValue}>{formatCurrency(account.pricePerUnit)}</Text>
          </View>
        );
      }
    }
    else if (account.assetType === 'physical') {
      if (account.assetSubType === 'property' && account.rentalIncome !== undefined) {
        fields.push(
          <View key="rentalIncome" style={styles.additionalField}>
            <Text style={styles.fieldLabel}>Monthly Rental Income:</Text>
            <Text style={styles.fieldValue}>{formatCurrency(account.rentalIncome)}</Text>
          </View>
        );
      } 
      else if (account.assetSubType === 'metal') {
        if (account.quantity !== undefined) {
          fields.push(
            <View key="quantity" style={styles.additionalField}>
              <Text style={styles.fieldLabel}>Quantity:</Text>
              <Text style={styles.fieldValue}>{account.quantity} oz</Text>
            </View>
          );
        }
        
        if (account.pricePerUnit !== undefined) {
          fields.push(
            <View key="pricePerUnit" style={styles.additionalField}>
              <Text style={styles.fieldLabel}>Price Per Unit:</Text>
              <Text style={styles.fieldValue}>{formatCurrency(account.pricePerUnit)}</Text>
            </View>
          );
        }
      }
    }
    
    return fields.length > 0 ? (
      <View style={styles.additionalFieldsContainer}>
        {fields}
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="ArrowLeft" size={24} color={colors.background} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Details</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.navigate('AddAccount', { account })}
        >
          <Icon name="Edit" size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Account Summary */}
        <View style={styles.accountSummary}>
          <Text style={styles.accountName}>{account.name}</Text>
          {account.institution && (
            <Text style={styles.institution}>{account.institution}</Text>
          )}
          <Text style={styles.accountBalance}>{formatCurrency(account.balance)}</Text>
          <View style={styles.accountDetails}>
            <Text style={styles.updatedText}>Updated {getTimeAgo(account.lastUpdated)}</Text>
            <Text style={[
              styles.growthText, 
              growth >= 0 ? styles.positiveGrowth : styles.negativeGrowth
            ]}>
              {growth >= 0 ? '+' : ''}{growth.toFixed(2)}%
            </Text>
          </View>
          
          {renderAdditionalFields()}
        </View>
        
        {/* Growth Chart */}
        <View style={styles.chartCard}>
          <GrowthChart 
            data={historicalData} 
            timeFrame={timeFrame}
            onTimeFrameChange={setTimeFrame} 
          />
        </View>
        
        {/* Transaction History */}
        <View style={styles.transactionCard}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          
          {accountTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            <View style={styles.transactionList}>
              {accountTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View>
                    <Text style={styles.transactionType}>{transaction.type}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.amount >= 0 ? styles.positiveAmount : styles.negativeAmount
                  ]}>
                    {transaction.amount > 0 ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <View style={{ height: 20 }} />
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
  },
  headerButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  accountSummary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
  },
  institution: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.8,
  },
  accountBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background,
    marginVertical: 8,
  },
  accountDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updatedText: {
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
  additionalFieldsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  additionalField: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
    marginRight: 6,
  },
  fieldValue: {
    fontSize: 14,
    color: colors.background,
    fontWeight: '500',
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
  transactionCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.lightText,
  },
  transactionList: {
    marginTop: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionType: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.lightText,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '500',
  },
  positiveAmount: {
    color: colors.success,
  },
  negativeAmount: {
    color: colors.error,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    marginBottom: 16,
    color: colors.text,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  backButtonText: {
    color: colors.background,
    fontWeight: '500',
  },
});

export default AccountDetailScreen;
