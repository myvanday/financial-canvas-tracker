
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
    amount: item.amount,
  }));
  
  // Calculate growth percentage
  const growth = filteredData.length >= 2 
    ? ((filteredData[filteredData.length - 1].amount - filteredData[0].amount) / filteredData[0].amount) * 100
    : 0;
  
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
          <p className={`text-lg font-bold ${growth >= 0 ? 'text-finance-green' : 'text-finance-red'}`}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(2)}%
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
              formatter={(value) => [formatCurrency(value as number), 'Net Worth']}
              contentStyle={{ borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#1A73E8" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6, fill: '#1A73E8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;
