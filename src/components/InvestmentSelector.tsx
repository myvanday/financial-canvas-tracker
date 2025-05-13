
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { InvestmentOption, searchInvestmentOptions, getInvestmentOptionsByType } from '../data/investmentOptions';

interface InvestmentSelectorProps {
  type: 'stock' | 'fund' | 'crypto';
  onSelect: (option: InvestmentOption) => void;
  onClose: () => void;
}

const InvestmentSelector: React.FC<InvestmentSelectorProps> = ({ type, onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<InvestmentOption[]>([]);
  
  useEffect(() => {
    // On initial load, show all options of the selected type
    setResults(getInvestmentOptionsByType(type));
  }, [type]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      // Search through all options
      setResults(searchInvestmentOptions(query));
    } else {
      // Show all options of the selected type when search is cleared
      setResults(getInvestmentOptionsByType(type));
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-gradient-primary text-white p-4 z-10">
        <div className="flex items-center">
          <button onClick={onClose} className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Select {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
        </div>
      </header>
      
      {/* Search Box */}
      <div className="p-4 bg-white sticky top-16 z-10 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder={`Search ${type}s...`}
            className="w-full py-2 pl-10 pr-4 border rounded-lg"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setResults(getInvestmentOptionsByType(type));
              }} 
              className="absolute right-3 top-3"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
      {/* Results */}
      <div className="flex-1 overflow-y-auto p-2">
        {results.length > 0 ? (
          <div className="space-y-2">
            {results.map((option) => (
              <div 
                key={option.symbol}
                onClick={() => onSelect(option)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{option.symbol}</h4>
                    <p className="text-sm text-gray-500">{option.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${option.currentPrice?.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{option.institution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <p className="text-gray-500">No {type}s found matching your search.</p>
            <p className="text-sm text-gray-400 mt-1">Try using different keywords or browse the list.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentSelector;
