
import React, { useState } from 'react';
import { Home, PieChart, History, Plus } from 'lucide-react';
import { useFinance, AssetType, Account } from '../context/FinanceContext';
import HomeTab from './HomeTab';
import PortfolioTab from './PortfolioTab';
import HistoryTab from './HistoryTab';
import AddAccountModal from './AddAccountModal';

type TabType = 'home' | 'portfolio' | 'history';

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | null>(null);

  const handleAssetClick = (assetType: AssetType) => {
    setSelectedAssetType(assetType);
    setActiveTab('portfolio');
  };

  const handleAccountClick = (account: Account) => {
    setEditingAccount(account);
    setShowAddModal(true);
  };

  const handleAddAccount = () => {
    setEditingAccount(undefined);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAccount(undefined);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onAssetClick={handleAssetClick} />;
      case 'portfolio':
        return <PortfolioTab onAccountClick={handleAccountClick} />;
      case 'history':
        return <HistoryTab />;
      default:
        return <HomeTab onAssetClick={handleAssetClick} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-finance-light-gray">
      {/* Main Content */}
      <div className="max-w-lg mx-auto bg-white min-h-screen pb-20">
        {/* Header */}
        <header className="sticky top-0 bg-gradient-primary text-white p-4 z-10">
          <h1 className="text-2xl font-bold text-center">Net Worth Tracker</h1>
        </header>
        
        {/* Tab Content */}
        <main className="pb-16">
          {renderActiveTab()}
        </main>
        
        {/* Add Button */}
        <button 
          className="floating-button z-20"
          onClick={handleAddAccount}
          aria-label="Add or update account"
        >
          <Plus className="h-6 w-6" />
        </button>
        
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
          <div className="max-w-lg mx-auto flex items-center">
            <button 
              className={`flex flex-1 flex-col items-center py-3 border-t-2 ${
                activeTab === 'home' ? 'tab-active' : 'tab-inactive'
              }`}
              onClick={() => setActiveTab('home')}
            >
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Home</span>
            </button>
            <button 
              className={`flex flex-1 flex-col items-center py-3 border-t-2 ${
                activeTab === 'portfolio' ? 'tab-active' : 'tab-inactive'
              }`}
              onClick={() => setActiveTab('portfolio')}
            >
              <PieChart className="h-5 w-5 mb-1" />
              <span className="text-xs">Portfolio</span>
            </button>
            <button 
              className={`flex flex-1 flex-col items-center py-3 border-t-2 ${
                activeTab === 'history' ? 'tab-active' : 'tab-inactive'
              }`}
              onClick={() => setActiveTab('history')}
            >
              <History className="h-5 w-5 mb-1" />
              <span className="text-xs">History</span>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Add/Edit Account Modal */}
      <AddAccountModal 
        isOpen={showAddModal} 
        onClose={handleCloseModal}
        existingAccount={editingAccount}
      />
    </div>
  );
};

export default Layout;
