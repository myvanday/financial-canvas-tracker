import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFinance, Account, AssetType, AssetSubType } from '../context/FinanceContext';
import Icon from '../components/Icon';
import { colors } from '../navigation/TabNavigator';

const AddAccountScreen = () => {
  const { addAccount, updateAccount, deleteAccount } = useFinance();
  const navigation = useNavigation();
  const route = useRoute();
  const existingAccount = route.params?.account as Account | undefined;
  
  const [assetType, setAssetType] = useState<AssetType>(existingAccount?.assetType || 'money');
  const [assetSubType, setAssetSubType] = useState<AssetSubType>(existingAccount?.assetSubType || 'bank');
  const [name, setName] = useState<string>(existingAccount?.name || '');
  const [balance, setBalance] = useState<string>(existingAccount ? existingAccount.balance.toString() : '');
  const [institution, setInstitution] = useState<string>(existingAccount?.institution || '');
  const [transactionType, setTransactionType] = useState<'buy' | 'sell' | 'update'>('update');
  const [currency, setCurrency] = useState<string>(existingAccount?.currency || 'USD');
  
  // Additional fields
  const [duration, setDuration] = useState<string>(existingAccount?.duration?.toString() || '');
  const [interestRate, setInterestRate] = useState<string>(existingAccount?.interestRate?.toString() || '');
  const [quantity, setQuantity] = useState<string>(existingAccount?.quantity?.toString() || '');
  const [itemName, setItemName] = useState<string>(existingAccount?.itemName || '');
  const [pricePerUnit, setPricePerUnit] = useState<string>(existingAccount?.pricePerUnit?.toString() || '');
  const [rentalIncome, setRentalIncome] = useState<string>(existingAccount?.rentalIncome?.toString() || '');

  const isEditing = !!existingAccount;

  const handleSubmit = () => {
    const parsedBalance = parseFloat(balance);
    
    if (!name.trim()) {
      Alert.alert("Error", "Account name is required");
      return;
    }
    
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      Alert.alert("Error", "Please enter a valid balance");
      return;
    }

    // Prepare additional fields based on asset type
    const additionalFields: Partial<Account> = {
      currency,
    };

    // Add asset type specific fields
    if (assetType === 'savings') {
      additionalFields.duration = duration ? parseInt(duration) : undefined;
      additionalFields.interestRate = interestRate ? parseFloat(interestRate) : undefined;
    } 
    else if (assetType === 'investments') {
      additionalFields.quantity = quantity ? parseFloat(quantity) : undefined;
      additionalFields.itemName = itemName || undefined;
      additionalFields.pricePerUnit = pricePerUnit ? parseFloat(pricePerUnit) : undefined;
    }
    else if (assetType === 'physical') {
      if (assetSubType === 'property') {
        additionalFields.rentalIncome = rentalIncome ? parseFloat(rentalIncome) : undefined;
      } else if (assetSubType === 'metal') {
        additionalFields.quantity = quantity ? parseFloat(quantity) : undefined;
        additionalFields.pricePerUnit = pricePerUnit ? parseFloat(pricePerUnit) : undefined;
      }
    }

    if (isEditing && existingAccount) {
      updateAccount(existingAccount.id, parsedBalance, transactionType);
      Alert.alert("Success", `Updated balance for ${name}`);
    } else {
      addAccount({
        name,
        balance: parsedBalance,
        initialBalance: parsedBalance,
        assetType,
        assetSubType,
        institution: institution.trim() || undefined,
        ...additionalFields
      });
      Alert.alert("Success", `Added ${name} to your portfolio`);
    }
    
    navigation.goBack();
  };

  const handleDelete = () => {
    if (isEditing && existingAccount) {
      Alert.alert(
        "Confirm Delete",
        `Are you sure you want to delete ${existingAccount.name}?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: () => {
              deleteAccount(existingAccount.id);
              Alert.alert("Success", `Deleted ${existingAccount.name} from your portfolio`);
              navigation.goBack();
            },
            style: "destructive"
          }
        ]
      );
    }
  };
  
  const getSubTypeOptions = (): { value: AssetSubType; label: string }[] => {
    switch(assetType) {
      case 'money':
        return [
          { value: 'cash', label: 'Cash' },
          { value: 'bank', label: 'Bank Account' },
          { value: 'digital', label: 'Digital Wallet' }
        ];
      case 'savings':
        return [
          { value: 'fixed', label: 'Fixed Duration' },
          { value: 'accumulating', label: 'Accumulating' },
          { value: 'other_savings', label: 'Other' }
        ];
      case 'investments':
        return [
          { value: 'stocks', label: 'Stocks' },
          { value: 'bonds', label: 'Bonds' },
          { value: 'funds', label: 'Funds' },
          { value: 'crypto', label: 'Crypto' },
          { value: 'other_investments', label: 'Other' }
        ];
      case 'physical':
        return [
          { value: 'property', label: 'Property' },
          { value: 'vehicle', label: 'Vehicle' },
          { value: 'metal', label: 'Precious Metal' },
          { value: 'other_physical', label: 'Other' }
        ];
      default:
        return [];
    }
  };
  
  // Helper function to render asset type specific fields
  const renderAssetTypeFields = () => {
    if (assetType === 'savings') {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (months)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g., 12"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Interest Rate (%)</Text>
            <TextInput
              style={styles.input}
              value={interestRate}
              onChangeText={setInterestRate}
              placeholder="e.g., 2.5"
              keyboardType="decimal-pad"
            />
          </View>
        </>
      );
    } else if (assetType === 'investments') {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {assetSubType === 'stocks' ? 'Stock Name' : 
               assetSubType === 'bonds' ? 'Bond Name' :
               assetSubType === 'funds' ? 'Fund Name' :
               assetSubType === 'crypto' ? 'Cryptocurrency Name' : 'Item Name'}
            </Text>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder="e.g., AAPL"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="e.g., 10"
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price Per Unit</Text>
            <View style={styles.inputWithPrefix}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.prefixedInput}
                value={pricePerUnit}
                onChangeText={setPricePerUnit}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </>
      );
    } else if (assetType === 'physical') {
      if (assetSubType === 'property') {
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly Rental Income</Text>
            <View style={styles.inputWithPrefix}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.prefixedInput}
                value={rentalIncome}
                onChangeText={setRentalIncome}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        );
      } else if (assetSubType === 'metal') {
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity (oz/g)</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="e.g., 10"
                keyboardType="decimal-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price Per Unit</Text>
              <View style={styles.inputWithPrefix}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.prefixedInput}
                  value={pricePerUnit}
                  onChangeText={setPricePerUnit}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </>
        );
      }
    }
    
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.background} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Account' : 'Add New Account'}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {!isEditing && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Asset Type</Text>
              <View style={styles.optionsContainer}>
                {[
                  { value: 'money', label: 'Money', icon: '💵' },
                  { value: 'savings', label: 'Savings', icon: '💰' },
                  { value: 'investments', label: 'Investments', icon: '📈' },
                  { value: 'physical', label: 'Physical', icon: '🏠' }
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.assetOption,
                      assetType === option.value && styles.selectedAssetOption
                    ]}
                    onPress={() => {
                      setAssetType(option.value as AssetType);
                      const subTypes = getSubTypeOptions();
                      if (subTypes.length > 0) {
                        setAssetSubType(subTypes[0].value);
                      }
                    }}
                  >
                    <Text style={styles.assetOptionIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.assetOptionLabel,
                      assetType === option.value && styles.selectedAssetOptionLabel
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Asset Sub-Type</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subTypeContainer}
              >
                {getSubTypeOptions().map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.subTypeOption,
                      assetSubType === option.value && styles.selectedSubTypeOption
                    ]}
                    onPress={() => setAssetSubType(option.value)}
                  >
                    <Text style={[
                      styles.subTypeLabel,
                      assetSubType === option.value && styles.selectedSubTypeLabel
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Chase Checking"
            editable={!isEditing}
          />
        </View>
        
        {isEditing && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.transactionTypeContainer}>
              {['buy', 'sell', 'update'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.transactionTypeOption,
                    transactionType === type && styles.selectedTransactionType
                  ]}
                  onPress={() => setTransactionType(type as 'buy' | 'sell' | 'update')}
                >
                  <Text style={[
                    styles.transactionTypeLabel,
                    transactionType === type && styles.selectedTransactionTypeLabel
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {isEditing 
              ? (transactionType === 'buy' 
                  ? 'Purchase Amount' 
                  : transactionType === 'sell' 
                    ? 'Sale Amount' 
                    : 'New Balance')
              : 'Balance'
            }
          </Text>
          <View style={styles.inputWithPrefix}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.prefixedInput}
              value={balance}
              onChangeText={setBalance}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Currency</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.currencyContainer}
          >
            {[
              { code: 'USD', symbol: '$' },
              { code: 'EUR', symbol: '€' },
              { code: 'GBP', symbol: '£' },
              { code: 'JPY', symbol: '¥' },
              { code: 'AUD', symbol: 'A$' },
              { code: 'CAD', symbol: 'C$' }
            ].map((currencyOption) => (
              <TouchableOpacity
                key={currencyOption.code}
                style={[
                  styles.currencyOption,
                  currency === currencyOption.code && styles.selectedCurrencyOption
                ]}
                onPress={() => setCurrency(currencyOption.code)}
              >
                <Text style={[
                  styles.currencyLabel,
                  currency === currencyOption.code && styles.selectedCurrencyLabel
                ]}>
                  {currencyOption.symbol} {currencyOption.code}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {!isEditing && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Institution (Optional)</Text>
            <TextInput
              style={styles.input}
              value={institution}
              onChangeText={setInstitution}
              placeholder="e.g., Chase Bank"
            />
          </View>
        )}
        
        {renderAssetTypeFields()}
        
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Add Account</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  inputPrefix: {
    paddingLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  prefixedInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  assetOption: {
    width: '48%',
    padding: 16,
    marginBottom: 10,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedAssetOption: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  assetOptionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  assetOptionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedAssetOptionLabel: {
    color: colors.primary,
  },
  subTypeContainer: {
    paddingVertical: 4,
  },
  subTypeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  selectedSubTypeOption: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  subTypeLabel: {
    fontSize: 14,
    color: colors.text,
  },
  selectedSubTypeLabel: {
    color: colors.primary,
    fontWeight: '500',
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionTypeOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTransactionType: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  transactionTypeLabel: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTransactionTypeLabel: {
    color: colors.primary,
    fontWeight: '500',
  },
  currencyContainer: {
    paddingVertical: 4,
  },
  currencyOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  selectedCurrencyOption: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  currencyLabel: {
    fontSize: 14,
    color: colors.text,
  },
  selectedCurrencyLabel: {
    color: colors.primary,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: isEditing => isEditing ? 8 : 0,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
    marginRight: 8,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  additionalField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  additionalFieldLabel: {
    fontSize: 14,
    color: colors.muted,
    width: 110,
  },
  additionalFieldValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});

export default AddAccountScreen;
