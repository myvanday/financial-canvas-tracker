
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Picker
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFinance, Account, AssetType, AssetSubType } from '../context/FinanceContext';
import Icon from '../components/Icon';
import { colors } from '../navigation/TabNavigator';

type RootStackParamList = {
  Main: undefined;
  AddAccount: { account?: Account };
  AccountDetail: { accountId: string };
};

type AddAccountScreenRouteProp = RouteProp<RootStackParamList, 'AddAccount'>;
type AddAccountScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AddAccountScreen = () => {
  const route = useRoute<AddAccountScreenRouteProp>();
  const existingAccount = route.params?.account;
  const navigation = useNavigation<AddAccountScreenNavigationProp>();
  const { addAccount, updateAccount, deleteAccount } = useFinance();
  
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
      alert("Account name is required");
      return;
    }
    
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      alert("Please enter a valid balance");
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
      alert(`Updated balance for ${name}`);
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
      alert(`Added ${name} to your portfolio`);
    }
    
    navigation.goBack();
  };

  const handleDelete = () => {
    if (isEditing && existingAccount) {
      deleteAccount(existingAccount.id);
      alert(`Deleted ${existingAccount.name} from your portfolio`);
      navigation.goBack();
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
          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration (months)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g., 12"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Interest Rate (%)</Text>
            <TextInput
              style={styles.input}
              value={interestRate}
              onChangeText={setInterestRate}
              placeholder="e.g., 2.5"
              keyboardType="numeric"
            />
          </View>
        </>
      );
    } else if (assetType === 'investments') {
      return (
        <>
          <View style={styles.formGroup}>
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
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="e.g., 10"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Price Per Unit</Text>
            <View style={styles.inputWithPrefix}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.prefixedInput}
                value={pricePerUnit}
                onChangeText={setPricePerUnit}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </View>
        </>
      );
    } else if (assetType === 'physical') {
      if (assetSubType === 'property') {
        return (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Monthly Rental Income</Text>
            <View style={styles.inputWithPrefix}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.prefixedInput}
                value={rentalIncome}
                onChangeText={setRentalIncome}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </View>
        );
      } else if (assetSubType === 'metal') {
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity (oz/g)</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="e.g., 10"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Price Per Unit</Text>
              <View style={styles.inputWithPrefix}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.prefixedInput}
                  value={pricePerUnit}
                  onChangeText={setPricePerUnit}
                  placeholder="0.00"
                  keyboardType="numeric"
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
          <Icon name="ArrowLeft" size={24} color={colors.background} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Account' : 'Add New Account'}
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {!isEditing && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Asset Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={assetType}
                  onValueChange={(value) => {
                    setAssetType(value as AssetType);
                    // Reset subtype when asset type changes
                    const subTypes = getSubTypeOptions();
                    if (subTypes.length > 0) {
                      setAssetSubType(subTypes[0].value);
                    }
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="💵 Money" value="money" />
                  <Picker.Item label="💰 Savings" value="savings" />
                  <Picker.Item label="📈 Investments" value="investments" />
                  <Picker.Item label="🏠 Physical Assets" value="physical" />
                </Picker>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Asset Sub-Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={assetSubType}
                  onValueChange={(value) => setAssetSubType(value as AssetSubType)}
                  style={styles.picker}
                >
                  {getSubTypeOptions().map((option) => (
                    <Picker.Item 
                      key={option.value} 
                      label={option.label} 
                      value={option.value} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </>
        )}
        
        <View style={styles.formGroup}>
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
          <View style={styles.formGroup}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.transactionTypes}>
              {['buy', 'sell', 'update'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.transactionType,
                    transactionType === type && styles.activeTransactionType
                  ]}
                  onPress={() => setTransactionType(type as 'buy' | 'sell' | 'update')}
                >
                  <Text style={[
                    styles.transactionTypeText,
                    transactionType === type && styles.activeTransactionTypeText
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.formGroup}>
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
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Currency</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currency}
              onValueChange={(value) => setCurrency(value)}
              style={styles.picker}
            >
              <Picker.Item label="USD ($)" value="USD" />
              <Picker.Item label="EUR (€)" value="EUR" />
              <Picker.Item label="GBP (£)" value="GBP" />
              <Picker.Item label="JPY (¥)" value="JPY" />
              <Picker.Item label="AUD ($)" value="AUD" />
              <Picker.Item label="CAD ($)" value="CAD" />
              <Picker.Item label="CHF (Fr)" value="CHF" />
              <Picker.Item label="CNY (¥)" value="CNY" />
              <Picker.Item label="INR (₹)" value="INR" />
            </Picker>
          </View>
        </View>
        
        {!isEditing && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Institution (Optional)</Text>
            <TextInput
              style={styles.input}
              value={institution}
              onChangeText={setInstitution}
              placeholder="e.g., Chase Bank"
            />
          </View>
        )}
        
        {/* Render asset-type specific fields */}
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
                style={styles.saveButton}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Add Account</Text>
            </TouchableOpacity>
          )}
        </View>
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
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputPrefix: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
  },
  prefixedInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  transactionTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionType: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  activeTransactionType: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  transactionTypeText: {
    color: colors.text,
  },
  activeTransactionTypeText: {
    color: colors.primary,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddAccountScreen;
