
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define types
export type AssetType = "cash" | "investment" | "property" | "vehicle" | "other";

export interface Account {
  id: string;
  name: string;
  balance: number;
  assetType: AssetType;
  institution?: string;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  previousBalance: number;
  newBalance: number;
  date: Date;
  assetType: AssetType;
}

export interface HistoricalNetWorth {
  date: Date;
  amount: number;
}

interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  historicalNetWorth: HistoricalNetWorth[];
  netWorth: number;
  assetAllocation: Record<AssetType, number>;
  addAccount: (account: Omit<Account, "id" | "lastUpdated">) => void;
  updateAccount: (id: string, balance: number) => void;
  deleteAccount: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Sample data
const initialAccounts: Account[] = [
  {
    id: "1",
    name: "Chase Checking",
    balance: 5000,
    assetType: "cash",
    institution: "Chase Bank",
    lastUpdated: new Date("2023-12-15"),
  },
  {
    id: "2",
    name: "Chase Savings",
    balance: 10000,
    assetType: "cash",
    institution: "Chase Bank",
    lastUpdated: new Date("2023-12-10"),
  },
  {
    id: "3",
    name: "Vanguard 401k",
    balance: 85000,
    assetType: "investment",
    institution: "Vanguard",
    lastUpdated: new Date("2023-12-01"),
  },
  {
    id: "4",
    name: "Fidelity IRA",
    balance: 45000,
    assetType: "investment",
    institution: "Fidelity",
    lastUpdated: new Date("2023-11-28"),
  },
  {
    id: "5",
    name: "Primary Home",
    balance: 450000,
    assetType: "property",
    lastUpdated: new Date("2023-10-15"),
  },
  {
    id: "6",
    name: "Tesla Model Y",
    balance: 40000,
    assetType: "vehicle",
    lastUpdated: new Date("2023-09-01"),
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
    assetType: "cash",
  },
  {
    id: "t2",
    accountId: "2",
    accountName: "Chase Savings",
    previousBalance: 9500,
    newBalance: 10000,
    date: new Date("2023-12-10"),
    assetType: "cash",
  },
  {
    id: "t3",
    accountId: "3",
    accountName: "Vanguard 401k",
    previousBalance: 82000,
    newBalance: 85000,
    date: new Date("2023-12-01"),
    assetType: "investment",
  },
];

const initialHistoricalNetWorth: HistoricalNetWorth[] = [
  { date: new Date("2023-07-01"), amount: 600000 },
  { date: new Date("2023-08-01"), amount: 610000 },
  { date: new Date("2023-09-01"), amount: 615000 },
  { date: new Date("2023-10-01"), amount: 620000 },
  { date: new Date("2023-11-01"), amount: 630000 },
  { date: new Date("2023-12-01"), amount: 635000 },
];

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [historicalNetWorth, setHistoricalNetWorth] = useState<HistoricalNetWorth[]>(
    initialHistoricalNetWorth
  );

  // Calculate net worth
  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);

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
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update historical net worth
    const lastRecord = historicalNetWorth[historicalNetWorth.length - 1];
    setHistoricalNetWorth([
      ...historicalNetWorth,
      {
        date: new Date(),
        amount: lastRecord.amount + newAccount.balance,
      },
    ]);
  };

  // Update an account
  const updateAccount = (id: string, balance: number) => {
    const accountToUpdate = accounts.find(account => account.id === id);
    
    if (!accountToUpdate) return;

    const previousBalance = accountToUpdate.balance;
    
    setAccounts(
      accounts.map(account =>
        account.id === id
          ? { ...account, balance, lastUpdated: new Date() }
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
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update historical net worth
    const lastRecord = historicalNetWorth[historicalNetWorth.length - 1];
    setHistoricalNetWorth([
      ...historicalNetWorth,
      {
        date: new Date(),
        amount: lastRecord.amount + (balance - previousBalance),
      },
    ]);
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
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update historical net worth
    const lastRecord = historicalNetWorth[historicalNetWorth.length - 1];
    setHistoricalNetWorth([
      ...historicalNetWorth,
      {
        date: new Date(),
        amount: lastRecord.amount - accountToDelete.balance,
      },
    ]);
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        transactions,
        historicalNetWorth,
        netWorth,
        assetAllocation,
        addAccount,
        updateAccount,
        deleteAccount,
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
