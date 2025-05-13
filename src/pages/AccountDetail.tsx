import React, { useState } from 'react';
import { ArrowLeft, Edit, Pencil } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useFinance, Account } from '../context/FinanceContext';
import GrowthChart from '../components/charts/GrowthChart';
import { formatDistanceToNow } from 'date-fns';

const AccountDetail = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { accounts, transactions } = useFinance();
  const [timeFrame, setTimeFrame] = useState<'1M' | '3M' | '6M' | '1Y' | 'All'>('6M');
  
  // Get account from state if available (for transitions), otherwise find by ID
  const account = location.state?.account as Account || 
    accounts.find(acc => acc.id === accountId);
  
  if (!account) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p>Account not found. <button onClick={() => navigate(-1)} className="text-primary">Go back</button></p>
      </div>
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

  // Get historical data for this account
  const accountTransactions = transactions.filter(t => t.accountId === account.id);
  
  // Mocked historical data for the account
  const historicalData = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 9 + i);
    
    // Start with initial balance and add transactions up to this date
    let balance = account.initialBalance;
    accountTransactions.forEach(tx => {
      if (new Date(tx.date) <= date) {
        balance += tx.amount ?? 0;
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
          <div key="duration" className="text-sm">
            <span className="text-muted-foreground">Duration:</span> {account.duration} months
          </div>
        );
      }
      
      if (account.interestRate !== undefined) {
        fields.push(
          <div key="interestRate" className="text-sm">
            <span className="text-muted-foreground">Interest Rate:</span> {account.interestRate}%
          </div>
        );
      }
    } 
    else if (account.assetType === 'investments') {
      if (account.itemName) {
        fields.push(
          <div key="itemName" className="text-sm">
            <span className="text-muted-foreground">Name:</span> {account.itemName}
          </div>
        );
      }
      
      if (account.quantity !== undefined) {
        fields.push(
          <div key="quantity" className="text-sm">
            <span className="text-muted-foreground">Quantity:</span> {account.quantity}
          </div>
        );
      }
      
      if (account.pricePerUnit !== undefined) {
        fields.push(
          <div key="pricePerUnit" className="text-sm">
            <span className="text-muted-foreground">Price Per Unit:</span> {formatCurrency(account.pricePerUnit)}
          </div>
        );
      }
    }
    else if (account.assetType === 'physical') {
      if (account.assetSubType === 'property' && account.rentalIncome !== undefined) {
        fields.push(
          <div key="rentalIncome" className="text-sm">
            <span className="text-muted-foreground">Monthly Rental Income:</span> {formatCurrency(account.rentalIncome)}
          </div>
        );
      } 
      else if (account.assetSubType === 'metal') {
        if (account.quantity !== undefined) {
          fields.push(
            <div key="quantity" className="text-sm">
              <span className="text-muted-foreground">Quantity:</span> {account.quantity} oz
            </div>
          );
        }
        
        if (account.pricePerUnit !== undefined) {
          fields.push(
            <div key="pricePerUnit" className="text-sm">
              <span className="text-muted-foreground">Price Per Unit:</span> {formatCurrency(account.pricePerUnit)}
            </div>
          );
        }
      }
    }
    
    return fields.length > 0 ? (
      <div className="mt-2 space-y-1">{fields}</div>
    ) : null;
  };

  // Get background gradient class based on asset type
  const getAssetGradient = () => {
    const gradients = {
      money: 'bg-gradient-money',
      savings: 'bg-gradient-savings',
      investments: 'bg-gradient-investments',
      physical: 'bg-gradient-physical'
    };
    
    return gradients[account.assetType] || '';
  };

  return (
    <div className="min-h-screen bg-finance-light-gray">
      <div className="max-w-lg mx-auto bg-white min-h-screen pb-20">
        {/* Header */}
        <header className="sticky top-0 bg-gradient-primary text-white p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => navigate(-1)} className="mr-2">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold">Account Details</h1>
            </div>
          </div>
        </header>
        
        <main className="p-4 pb-20">
          {/* Account Summary with Edit Button */}
          <div className={`p-6 rounded-xl mb-4 text-primary relative ${getAssetGradient()}`}>
            <h2 className="text-xl font-bold">{account.name}</h2>
            {account.institution && (
              <p className="text-sm opacity-80">{account.institution}</p>
            )}
            <p className="text-3xl font-bold mt-2">{formatCurrency(account.balance)}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm opacity-80">Updated {getTimeAgo(account.lastUpdated)}</p>
              <p className={`text-sm font-medium ${growth >= 0 ? 'growth-positive' : 'growth-negative'}`}>
                {growth >= 0 ? '+' : ''}{growth.toFixed(2)}%
              </p>
            </div>
            
            {/* Render additional fields */}
            {renderAdditionalFields()}
            
            {/* More prominent edit button */}
            <button 
              onClick={() => navigate('/add-account', { state: { account } })}
              className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Edit account"
            >
              <Edit className="h-5 w-5 text-primary" />
            </button>
          </div>
          
          {/* Edit/Update CTA Button */}
          <div className="mb-6">
            <button 
              onClick={() => navigate('/add-account', { state: { account } })}
              className="w-full py-3 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              <span>Update Balance or Details</span>
            </button>
          </div>
          
          {/* Growth Chart */}
          <div className="mb-6">
            <GrowthChart 
              data={historicalData} 
              timeFrame={timeFrame}
              onTimeFrameChange={setTimeFrame} 
            />
          </div>
          
          {/* Transaction History */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">Transaction History</h3>
            
            {accountTransactions.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No transactions yet</p>
            ) : (
              <ul className="space-y-3">
                {accountTransactions.map((transaction) => (
                  <li key={transaction.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{transaction.type || transaction.transactionType}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-right ${(transaction.amount || 0) >= 0 ? 'growth-positive' : 'growth-negative'}`}>
                      <p className="font-medium">
                        {(transaction.amount || 0) > 0 ? '+' : ''}
                        {formatCurrency(transaction.amount || 0)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountDetail;
