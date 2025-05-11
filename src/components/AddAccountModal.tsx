
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance, AssetType, Account } from '../context/FinanceContext';
import { useToast } from '../hooks/use-toast';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingAccount?: Account;
}

type InputMethod = 'manual' | 'chat';

const AddAccountModal: React.FC<AddAccountModalProps> = ({ 
  isOpen, 
  onClose,
  existingAccount
}) => {
  const { addAccount, updateAccount, deleteAccount } = useFinance();
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [inputMethod, setInputMethod] = useState<InputMethod>('manual');
  const [assetType, setAssetType] = useState<AssetType>(existingAccount?.assetType || 'cash');
  const [name, setName] = useState<string>(existingAccount?.name || '');
  const [balance, setBalance] = useState<string>(existingAccount ? existingAccount.balance.toString() : '');
  const [institution, setInstitution] = useState<string>(existingAccount?.institution || '');

  const isEditing = !!existingAccount;

  const handleSubmit = () => {
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

    if (isEditing && existingAccount) {
      updateAccount(existingAccount.id, parsedBalance);
      toast({
        title: "Account updated",
        description: `Updated balance for ${name}`,
      });
    } else {
      addAccount({
        name,
        balance: parsedBalance,
        assetType,
        institution: institution.trim() || undefined,
      });
      toast({
        title: "Account added",
        description: `Added ${name} to your portfolio`,
      });
    }
    
    resetForm();
    onClose();
  };

  const handleDelete = () => {
    if (isEditing && existingAccount) {
      deleteAccount(existingAccount.id);
      toast({
        title: "Account deleted",
        description: `Deleted ${existingAccount.name} from your portfolio`,
      });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setStep(1);
    setInputMethod('manual');
    setAssetType('cash');
    setName('');
    setBalance('');
    setInstitution('');
  };

  if (!isOpen) return null;

  const assetTypeOptions: { value: AssetType; label: string; icon: string; }[] = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'investment', label: 'Investment', icon: '📈' },
    { value: 'property', label: 'Property', icon: '🏠' },
    { value: 'vehicle', label: 'Vehicle', icon: '🚗' },
    { value: 'other', label: 'Other', icon: '📦' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Update Account' : 'Add New Account'}
          </h2>
          <button 
            className="p-1 rounded-full hover:bg-muted"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Step 1: Choose Input Method */}
        {step === 1 && !isEditing && (
          <div className="space-y-4">
            <h3 className="font-medium">How would you like to add your account?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className={`p-4 rounded-lg border-2 text-center ${
                  inputMethod === 'manual' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setInputMethod('manual')}
              >
                <div className="text-2xl mb-2">🖊️</div>
                <div className="font-medium">Manual Entry</div>
              </button>
              <button 
                className={`p-4 rounded-lg border-2 text-center ${
                  inputMethod === 'chat' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setInputMethod('chat')}
              >
                <div className="text-2xl mb-2">💬</div>
                <div className="font-medium">Chat</div>
              </button>
            </div>
            <button 
              className="w-full mt-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        )}
        
        {/* Step 2: Choose Asset Type */}
        {step === 2 && !isEditing && (
          <div className="space-y-4">
            <h3 className="font-medium">Select asset type</h3>
            <div className="grid grid-cols-2 gap-4">
              {assetTypeOptions.map((option) => (
                <button 
                  key={option.value}
                  className={`p-4 rounded-lg border-2 text-center ${
                    assetType === option.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setAssetType(option.value)}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-medium">{option.label}</div>
                </button>
              ))}
            </div>
            <div className="flex space-x-3 mt-4">
              <button 
                className="flex-1 py-2 border border-border rounded-lg hover:bg-muted"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button 
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                onClick={() => setStep(3)}
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Account Details */}
        {(step === 3 || isEditing) && (
          <div className="space-y-4">
            {!isEditing && inputMethod === 'chat' ? (
              <div className="border rounded-lg p-4">
                <p className="text-muted-foreground mb-4">
                  Tell us about your account and we'll help you set it up. For example:
                </p>
                <div className="bg-muted p-3 rounded text-sm italic">
                  "I have a checking account at Chase with $2,500"
                </div>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Chat input is simulated in this demo. Please switch to manual entry.
                  </p>
                  <button
                    className="text-primary text-sm"
                    onClick={() => {
                      setInputMethod('manual');
                    }}
                  >
                    Switch to manual entry
                  </button>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {!isEditing && (
                  <div>
                    <label htmlFor="asset-type" className="block text-sm font-medium mb-1">
                      Asset Type
                    </label>
                    <select
                      id="asset-type"
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value as AssetType)}
                      className="w-full p-2 border rounded-md"
                    >
                      {assetTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
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
                
                <div>
                  <label htmlFor="account-balance" className="block text-sm font-medium mb-1">
                    Balance
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
                
                <div className="flex space-x-3 pt-2">
                  {isEditing ? (
                    <>
                      <button 
                        type="button"
                        className="flex-1 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/5"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                      <button 
                        type="button"
                        className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        onClick={handleSubmit}
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="button"
                        className="flex-1 py-2 border border-border rounded-lg hover:bg-muted"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </button>
                      <button 
                        type="button"
                        className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        onClick={handleSubmit}
                      >
                        Add Account
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAccountModal;
