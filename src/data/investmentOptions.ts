
// Investment options data

export interface InvestmentOption {
  symbol: string;
  name: string;
  type: 'stock' | 'fund' | 'crypto';
  institution?: string; 
  currentPrice?: number;
}

// Sample investment options
export const investmentOptions: InvestmentOption[] = [
  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', institution: 'NASDAQ', currentPrice: 187.32 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', institution: 'NASDAQ', currentPrice: 402.56 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', institution: 'NASDAQ', currentPrice: 155.37 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', institution: 'NASDAQ', currentPrice: 179.62 },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'stock', institution: 'NASDAQ', currentPrice: 474.03 },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', institution: 'NASDAQ', currentPrice: 177.29 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', institution: 'NASDAQ', currentPrice: 950.02 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'stock', institution: 'NYSE', currentPrice: 198.73 },
  { symbol: 'V', name: 'Visa Inc.', type: 'stock', institution: 'NYSE', currentPrice: 279.08 },
  { symbol: 'WMT', name: 'Walmart Inc.', type: 'stock', institution: 'NYSE', currentPrice: 68.78 },
  
  // Funds
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'fund', institution: 'NYSE Arca', currentPrice: 523.74 },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'fund', institution: 'NYSE Arca', currentPrice: 481.65 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'fund', institution: 'NASDAQ', currentPrice: 444.04 },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'fund', institution: 'NYSE Arca', currentPrice: 253.19 },
  { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', type: 'fund', institution: 'NASDAQ', currentPrice: 60.12 },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', type: 'fund', institution: 'NASDAQ', currentPrice: 72.33 },
  { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', type: 'fund', institution: 'NYSE Arca', currentPrice: 97.98 },
  { symbol: 'VIG', name: 'Vanguard Dividend Appreciation ETF', type: 'fund', institution: 'NYSE', currentPrice: 183.62 },
  { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', type: 'fund', institution: 'NASDAQ', currentPrice: 60.12 },
  { symbol: 'ARKK', name: 'ARK Innovation ETF', type: 'fund', institution: 'NYSE Arca', currentPrice: 48.87 },
  
  // Cryptocurrencies
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', institution: 'Decentralized', currentPrice: 67354.21 },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', institution: 'Decentralized', currentPrice: 3475.83 },
  { symbol: 'BNB', name: 'Binance Coin', type: 'crypto', institution: 'Binance', currentPrice: 608.42 },
  { symbol: 'XRP', name: 'XRP', type: 'crypto', institution: 'Ripple', currentPrice: 0.49 },
  { symbol: 'SOL', name: 'Solana', type: 'crypto', institution: 'Solana Foundation', currentPrice: 146.83 },
  { symbol: 'ADA', name: 'Cardano', type: 'crypto', institution: 'Cardano Foundation', currentPrice: 0.45 },
  { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', institution: 'Decentralized', currentPrice: 0.13 },
  { symbol: 'DOT', name: 'Polkadot', type: 'crypto', institution: 'Web3 Foundation', currentPrice: 6.25 },
  { symbol: 'AVAX', name: 'Avalanche', type: 'crypto', institution: 'Ava Labs', currentPrice: 33.57 },
  { symbol: 'LINK', name: 'Chainlink', type: 'crypto', institution: 'Chainlink Labs', currentPrice: 15.82 }
];

// Function to get investment options filtered by type
export const getInvestmentOptionsByType = (type: 'stock' | 'fund' | 'crypto') => {
  return investmentOptions.filter(option => option.type === type);
};

// Function to search for investment options
export const searchInvestmentOptions = (query: string) => {
  if (!query || query.trim() === '') return [];
  
  const lowerQuery = query.toLowerCase();
  return investmentOptions.filter(
    option => 
      option.symbol.toLowerCase().includes(lowerQuery) || 
      option.name.toLowerCase().includes(lowerQuery)
  );
};

// Function to get an investment option by symbol
export const getInvestmentOptionBySymbol = (symbol: string) => {
  return investmentOptions.find(option => option.symbol === symbol);
};
