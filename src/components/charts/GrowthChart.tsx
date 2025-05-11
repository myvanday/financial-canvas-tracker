
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HistoricalNetWorth } from '../../context/FinanceContext';

interface GrowthChartProps {
  data: HistoricalNetWorth[];
  timeFrame: '1M' | '3M' | '6M' | '1Y' | 'All';
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data, timeFrame }) => {
  const getFilteredData = () => {
    const today = new Date();
    let cutoffDate = new Date();
    
    switch (timeFrame) {
      case '1M':
        cutoffDate.setMonth(today.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(today.getMonth() - 3);
        break;
      case '6M':
        cutoffDate.setMonth(today.getMonth() - 6);
        break;
      case '1Y':
        cutoffDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return data;
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };
  
  const filteredData = getFilteredData();
  
  // Format data for the chart
  const chartData = filteredData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    currentValue: item.currentAmount,
    purchasedValue: item.purchaseAmount,
    interest: item.currentAmount - item.purchaseAmount
  }));
  
  // Calculate growth percentage
  const growth = filteredData.length >= 2 
    ? ((filteredData[filteredData.length - 1].currentAmount - filteredData[0].currentAmount) / filteredData[0].currentAmount) * 100
    : 0;

  // Calculate interest (difference between purchase and current)
  const latestData = filteredData[filteredData.length - 1];
  const interestAmount = latestData ? latestData.currentAmount - latestData.purchaseAmount : 0;
  const interestPercentage = latestData ? (interestAmount / latestData.purchaseAmount) * 100 : 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Net Worth Growth</h3>
        <div className="text-right">
          <p className={`text-lg font-bold ${growth >= 0 ? 'growth-positive' : 'growth-negative'}`}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground">
            Gain: {formatCurrency(interestAmount)} ({interestPercentage.toFixed(2)}%)
          </p>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              domain={['dataMin - 10000', 'dataMax + 10000']} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10 }} 
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), '']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Line 
              name="Current Value"
              type="monotone" 
              dataKey="currentValue" 
              stroke="#95e362" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6, fill: '#95e362' }}
            />
            <Line 
              name="Purchased Value"
              type="monotone" 
              dataKey="purchasedValue" 
              stroke="#01362e" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6, fill: '#01362e' }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;
