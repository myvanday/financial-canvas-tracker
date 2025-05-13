
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useFinance, Account, AssetType, AssetSubType } from '../context/FinanceContext';
import { useToast } from '../hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface AddAccountPageProps {
  existingAccount?: Account;
}

const AddAccountPage = () => {
  const { addAccount, updateAccount, deleteAccount } = useFinance();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const existingAccount = location.state?.account as Account | undefined;
  
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedBalance = parseFloat(balance);
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Account name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid balance",
        variant: "destructive",
      });
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
      toast({
        title: "Account updated",
        description: `Updated balance for ${name}`,
      });
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
      toast({
        title: "Account added",
        description: `Added ${name} to your portfolio`,
      });
    }
    
    navigate(-1);
  };

  const handleDelete = () => {
    if (isEditing && existingAccount) {
      deleteAccount(existingAccount.id);
      toast({
        title: "Account deleted",
        description: `Deleted ${existingAccount.name} from your portfolio`,
      });
      navigate(-1);
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
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-1">
              Duration (months)
            </label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 12"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium mb-1">
              Interest Rate (%)
            </label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g., 2.5"
              className="w-full p-2 border rounded-md"
              step="0.01"
            />
          </div>
        </>
      );
    } else if (assetType === 'investments') {
      return (
        <>
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium mb-1">
              {assetSubType === 'stocks' ? 'Stock Name' : 
               assetSubType === 'bonds' ? 'Bond Name' :
               assetSubType === 'funds' ? 'Fund Name' :
               assetSubType === 'crypto' ? 'Cryptocurrency Name' : 'Item Name'}
            </label>
            <input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., AAPL"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 10"
              className="w-full p-2 border rounded-md"
              step="0.000001"
            />
          </div>
          
          <div>
            <label htmlFor="pricePerUnit" className="block text-sm font-medium mb-1">
              Price Per Unit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                id="pricePerUnit"
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 pl-6 border rounded-md"
                step="0.01"
              />
            </div>
          </div>
        </>
      );
    } else if (assetType === 'physical') {
      if (assetSubType === 'property') {
        return (
          <div>
            <label htmlFor="rentalIncome" className="block text-sm font-medium mb-1">
              Monthly Rental Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                id="rentalIncome"
                type="number"
                value={rentalIncome}
                onChange={(e) => setRentalIncome(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 pl-6 border rounded-md"
                step="0.01"
              />
            </div>
          </div>
        );
      } else if (assetSubType === 'metal') {
        return (
          <>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                Quantity (oz/g)
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 10"
                className="w-full p-2 border rounded-md"
                step="0.01"
              />
            </div>
            
            <div>
              <label htmlFor="pricePerUnit" className="block text-sm font-medium mb-1">
                Price Per Unit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  id="pricePerUnit"
                  type="number"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 pl-6 border rounded-md"
                  step="0.01"
                />
              </div>
            </div>
          </>
        );
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-finance-light-gray">
      <div className="max-w-lg mx-auto bg-white min-h-screen pb-20">
        {/* Header */}
        <header className="sticky top-0 bg-gradient-primary text-white p-4 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">{isEditing ? 'Edit Account' : 'Add New Account'}</h1>
          </div>
        </header>
        
        <main className="p-4">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isEditing && (
              <>
                <div>
                  <label htmlFor="asset-type" className="block text-sm font-medium mb-1">
                    Asset Type
                  </label>
                  <select
                    id="asset-type"
                    value={assetType}
                    onChange={(e) => {
                      setAssetType(e.target.value as AssetType);
                      // Reset subtype when asset type changes
                      const subTypes = getSubTypeOptions();
                      if (subTypes.length > 0) {
                        setAssetSubType(subTypes[0].value);
                      }
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="money">💵 Money</option>
                    <option value="savings">💰 Savings</option>
                    <option value="investments">📈 Investments</option>
                    <option value="physical">🏠 Physical Assets</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="asset-subtype" className="block text-sm font-medium mb-1">
                    Asset Sub-Type
                  </label>
                  <select
                    id="asset-subtype"
                    value={assetSubType}
                    onChange={(e) => setAssetSubType(e.target.value as AssetSubType)}
                    className="w-full p-2 border rounded-md"
                  >
                    {getSubTypeOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="account-name" className="block text-sm font-medium mb-1">
                Account Name
              </label>
              <input
                id="account-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Chase Checking"
                className="w-full p-2 border rounded-md"
                disabled={isEditing}
                required
              />
            </div>
            
            {isEditing && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Transaction Type
                </label>
                <div className="flex space-x-2">
                  {['buy', 'sell', 'update'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`flex-1 py-2 px-3 border rounded-md text-center ${
                        transactionType === type 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border'
                      }`}
                      onClick={() => setTransactionType(type as 'buy' | 'sell' | 'update')}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="account-balance" className="block text-sm font-medium mb-1">
                {isEditing 
                  ? (transactionType === 'buy' 
                      ? 'Purchase Amount' 
                      : transactionType === 'sell' 
                        ? 'Sale Amount' 
                        : 'New Balance')
                  : 'Balance'
                }
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  id="account-balance"
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 pl-6 border rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="CHF">CHF (Fr)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            
            {!isEditing && (
              <div>
                <label htmlFor="institution" className="block text-sm font-medium mb-1">
                  Institution (Optional)
                </label>
                <input
                  id="institution"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g., Chase Bank"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            )}
            
            {/* Render asset-type specific fields */}
            {renderAssetTypeFields()}
            
            <div className="flex space-x-3 pt-4">
              {isEditing ? (
                <>
                  <button 
                    type="button"
                    className="flex-1 py-3 border border-destructive text-destructive rounded-lg hover:bg-destructive/5"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button 
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Add Account
                </button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddAccountPage;
