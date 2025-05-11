import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define types
export type AssetType = "money" | "savings" | "investments" | "physical";
export type AssetSubType = 
  | "cash" | "bank" | "digital" // money subtypes
  | "fixed" | "accumulating" | "other_savings" // savings subtypes
  | "stocks" | "bonds" | "funds" | "crypto" | "other_investments" // investments subtypes
  | "property" | "vehicle" | "metal" | "other_physical"; // physical subtypes

export interface Account {
  id: string;
  name: string;
  initialBalance: number; // Amount initially invested/purchased
  balance: number; // Current value
  assetType: AssetType;
  assetSubType: AssetSubType;
  institution?: string;
  lastUpdated: Date;
  currency?: string;
  // For savings
  duration?: number;
  interestRate?: number;
  // For investments
  quantity?: number;
  itemName?: string;
  pricePerUnit?: number;
  // For physical assets
  rentalIncome?: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  previousBalance: number;
  newBalance: number;
  date: Date;
  assetType: AssetType;
  transactionType: "buy" | "sell" | "update"; // New transaction type
  type?: string;
  amount?: number;
}

export interface HistoricalNetWorth {
  date: Date;
  purchaseAmount: number; // Amount invested/purchased
  currentAmount: number; // Current value
}

interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  historicalNetWorth: HistoricalNetWorth[];
  netWorth: number;
  totalInvested: number; // Total amount invested/purchased
  assetAllocation: Record<AssetType, number>;
  assetAllocations: { date: Date; allocation: Record<AssetType, number> }[]; // Historical allocations
  addAccount: (account: Omit<Account, "id" | "lastUpdated">) => void;
  updateAccount: (id: string, balance: number, transactionType: "buy" | "sell" | "update", amount?: number) => void;
  deleteAccount: (id: string) => void;
  getAssetSubtypeLabel: (subtype: AssetSubType) => string;
  getAssetTypeLabel: (type: AssetType) => string;
}

// Maps to convert asset types to human-readable labels
const assetTypeLabels: Record<AssetType, string> = {
  money: "Money",
  savings: "Savings",
  investments: "Investments",
  physical: "Physical Assets"
};

const assetSubTypeLabels: Record<AssetSubType, string> = {
  // Money subtypes
  cash: "Cash",
  bank: "Bank Account",
  digital: "Digital Wallet",
  
  // Savings subtypes
  fixed: "Fixed Duration",
  accumulating: "Accumulating",
  other_savings: "Other Savings",
  
  // Investment subtypes
  stocks: "Stocks",
  bonds: "Bonds",
  funds: "Funds",
  crypto: "Crypto",
  other_investments: "Other Investments",
  
  // Physical asset subtypes
  property: "Property",
  vehicle: "Vehicle",
  metal: "Precious Metal",
  other_physical: "Other Physical Assets"
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Sample data
const initialAccounts: Account[] = [
  {
    id: "1",
    name: "Chase Checking",
    initialBalance: 5000,
    balance: 5000,
    assetType: "money",
    assetSubType: "bank",
    institution: "Chase Bank",
    lastUpdated: new Date("2023-12-15"),
  },
  {
    id: "2",
    name: "Cash Reserve",
    initialBalance: 10000,
    balance: 10000,
    assetType: "money",
    assetSubType: "cash",
    lastUpdated: new Date("2023-12-10"),
  },
  {
    id: "3",
    name: "Vanguard 401k",
    initialBalance: 80000,
    balance: 85000,
    assetType: "investments",
    assetSubType: "funds",
    institution: "Vanguard",
    lastUpdated: new Date("2023-12-01"),
  },
  {
    id: "4",
    name: "Fidelity IRA",
    initialBalance: 42000,
    balance: 45000,
    assetType: "investments",
    assetSubType: "stocks",
    institution: "Fidelity",
    lastUpdated: new Date("2023-11-28"),
  },
  {
    id: "5",
    name: "Primary Home",
    initialBalance: 425000,
    balance: 450000,
    assetType: "physical",
    assetSubType: "property",
    lastUpdated: new Date("2023-10-15"),
  },
  {
    id: "6",
    name: "Tesla Model Y",
    initialBalance: 45000,
    balance: 40000,
    assetType: "physical",
    assetSubType: "vehicle",
    lastUpdated: new Date("2023-09-01"),
  },
  {
    id: "7",
    name: "CD - 2 Year",
    initialBalance: 25000,
    balance: 26500,
    assetType: "savings",
    assetSubType: "fixed",
    institution: "Bank of America",
    lastUpdated: new Date("2023-11-15"),
  },
];

const initialTransactions: Transaction[] = [
  {
    id: "t1",
    accountId: "1",
    accountName: "Chase Checking",
    previousBalance: 4500,
    newBalance: 5000,
    date: new Date("2023-12-15"),
    assetType: "money",
    transactionType: "update",
  },
  {
    id: "t2",
    accountId: "3",
    accountName: "Vanguard 401k",
    previousBalance: 82000,
    newBalance: 85000,
    date: new Date("2023-12-01"),
    assetType: "investments",
    transactionType: "update",
  },
];

// Create sample historical net worth data
const generateHistoricalData = () => {
  const data: HistoricalNetWorth[] = [];
  const today = new Date();
  let purchaseBase = 600000;
  let currentBase = 610000;
  
  // Generate 6 months of data
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setMonth(today.getMonth() - i);
    
    const randomGrowth = Math.random() * 0.05; // Random growth between 0-5%
    purchaseBase = purchaseBase + (Math.random() < 0.7 ? 5000 : 0); // Sometimes add new purchases
    currentBase = purchaseBase * (1 + randomGrowth);
    
    data.push({
      date: date,
      purchaseAmount: Math.round(purchaseBase),
      currentAmount: Math.round(currentBase)
    });
  }
  
  return data;
};

const initialHistoricalNetWorth: HistoricalNetWorth[] = generateHistoricalData();

// Generate historical asset allocations
const generateHistoricalAllocations = () => {
  const allocations = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setMonth(today.getMonth() - i);
    
    // Generate slightly different allocations each month
    allocations.push({
      date,
      allocation: {
        money: 15000 + Math.round(Math.random() * 2000),
        savings: 26000 + Math.round(Math.random() * 2000),
        investments: 130000 + Math.round(Math.random() * 10000),
        physical: 490000 + Math.round(Math.random() * 5000)
      }
    });
  }
  
  return allocations;
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [historicalNetWorth, setHistoricalNetWorth] = useState<HistoricalNetWorth[]>(
    initialHistoricalNetWorth
  );
  const [assetAllocations, setAssetAllocations] = useState(generateHistoricalAllocations());

  // Calculate net worth (current value)
  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate total invested/purchased amount
  const totalInvested = accounts.reduce((sum, account) => sum + account.initialBalance, 0);

  // Calculate asset allocation
  const assetAllocation: Record<AssetType, number> = accounts.reduce(
    (allocation, account) => {
      allocation[account.assetType] = 
        (allocation[account.assetType] || 0) + account.balance;
      return allocation;
    },
    {} as Record<AssetType, number>
  );

  // Add a new account
  const addAccount = (account: Omit<Account, "id" | "lastUpdated">) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };

    setAccounts([...accounts, newAccount]);
    
    // Add transaction
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      accountId: newAccount.id,
      accountName: newAccount.name,
      previousBalance: 0,
      newBalance: newAccount.balance,
      date: new Date(),
      assetType: newAccount.assetType,
      transactionType: "buy", // New account is a purchase
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update historical net worth
    updateHistoricalNetWorth(newAccount.initialBalance, newAccount.balance);
    
    // Update asset allocations
    updateAssetAllocations();
  };

  // Update an account
  const updateAccount = (
    id: string, 
    balance: number, 
    transactionType: "buy" | "sell" | "update", 
    amount?: number
  ) => {
    const accountToUpdate = accounts.find(account => account.id === id);
    
    if (!accountToUpdate) return;

    const previousBalance = accountToUpdate.balance;
    let newInitialBalance = accountToUpdate.initialBalance;
    
    // Update initial balance based on transaction type
    if (transactionType === "buy" && amount) {
      newInitialBalance += amount;
    } else if (transactionType === "sell" && amount) {
      const ratio = amount / previousBalance;
      newInitialBalance -= accountToUpdate.initialBalance * ratio;
    }
    
    setAccounts(
      accounts.map(account =>
        account.id === id
          ? { 
              ...account, 
              balance, 
              initialBalance: newInitialBalance,
              lastUpdated: new Date() 
            }
          : account
      )
    );
    
    // Add transaction
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      accountId: id,
      accountName: accountToUpdate.name,
      previousBalance,
      newBalance: balance,
      date: new Date(),
      assetType: accountToUpdate.assetType,
      transactionType,
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update historical net worth
    const investedDifference = newInitialBalance - accountToUpdate.initialBalance;
    updateHistoricalNetWorth(investedDifference, balance - previousBalance);
    
    // Update asset allocations
    updateAssetAllocations();
  };

  // Delete an account
  const deleteAccount = (id: string) => {
    const accountToDelete = accounts.find(account => account.id === id);
    
    if (!accountToDelete) return;

    setAccounts(accounts.filter(account => account.id !== id));
    
    // Add transaction
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      accountId: id,
      accountName: accountToDelete.name,
      previousBalance: accountToDelete.balance,
      newBalance: 0,
      date: new Date(),
      assetType: accountToDelete.assetType,
      transactionType: "sell", // Deleting is selling
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update historical net worth
    updateHistoricalNetWorth(-accountToDelete.initialBalance, -accountToDelete.balance);
    
    // Update asset allocations
    updateAssetAllocations();
  };

  // Update historical net worth when account changes
  const updateHistoricalNetWorth = (investedChange: number, currentChange: number) => {
    const lastRecord = historicalNetWorth[historicalNetWorth.length - 1];
    const today = new Date();
    
    // Check if the last record is from today
    const isToday = 
      lastRecord.date.getDate() === today.getDate() &&
      lastRecord.date.getMonth() === today.getMonth() &&
      lastRecord.date.getFullYear() === today.getFullYear();
      
    if (isToday) {
      // Update today's record
      const updatedHistory = [...historicalNetWorth];
      updatedHistory[updatedHistory.length - 1] = {
        date: today,
        purchaseAmount: lastRecord.purchaseAmount + investedChange,
        currentAmount: lastRecord.currentAmount + currentChange,
      };
      setHistoricalNetWorth(updatedHistory);
    } else {
      // Add new record for today
      setHistoricalNetWorth([
        ...historicalNetWorth,
        {
          date: today,
          purchaseAmount: lastRecord.purchaseAmount + investedChange,
          currentAmount: lastRecord.currentAmount + currentChange,
        },
      ]);
    }
  };

  // Update asset allocations
  const updateAssetAllocations = () => {
    const today = new Date();
    const newAllocation = accounts.reduce(
      (allocation, account) => {
        allocation[account.assetType] = 
          (allocation[account.assetType] || 0) + account.balance;
        return allocation;
      },
      {} as Record<AssetType, number>
    );
    
    // Check if we have an allocation for today
    const todayAllocationIndex = assetAllocations.findIndex(alloc => 
      alloc.date.getDate() === today.getDate() &&
      alloc.date.getMonth() === today.getMonth() &&
      alloc.date.getFullYear() === today.getFullYear()
    );
    
    if (todayAllocationIndex >= 0) {
      // Update today's allocation
      const updatedAllocations = [...assetAllocations];
      updatedAllocations[todayAllocationIndex] = {
        date: today,
        allocation: newAllocation
      };
      setAssetAllocations(updatedAllocations);
    } else {
      // Add new allocation for today
      setAssetAllocations([
        ...assetAllocations,
        {
          date: today,
          allocation: newAllocation
        }
      ]);
    }
  };

  // Get asset subtype label
  const getAssetSubtypeLabel = (subtype: AssetSubType): string => {
    return assetSubTypeLabels[subtype] || subtype;
  };
  
  // Get asset type label
  const getAssetTypeLabel = (type: AssetType): string => {
    return assetTypeLabels[type] || type;
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        transactions,
        historicalNetWorth,
        netWorth,
        totalInvested,
        assetAllocation,
        assetAllocations,
        addAccount,
        updateAccount,
        deleteAccount,
        getAssetSubtypeLabel,
        getAssetTypeLabel,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
