
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: Array<{
    date: Date;
    purchaseAmount: number;
    currentAmount: number;
  }>;
  timeFrame: '1M' | '3M' | '6M' | '1Y' | 'All';
  onTimeFrameChange?: (timeFrame: '1M' | '3M' | '6M' | '1Y' | 'All') => void;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data, timeFrame, onTimeFrameChange }) => {
  const [chartData, setChartData] = useState<Array<{
    date: string;
    'Initial Value': number;
    'Current Value': number;
  }>>([]);

  useEffect(() => {
    if (!data) return;

    // Filter data based on timeFrame
    const now = new Date();
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date);
      
      switch(timeFrame) {
        case '1M':
          return now.getTime() - itemDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        case '3M':
          return now.getTime() - itemDate.getTime() <= 90 * 24 * 60 * 60 * 1000;
        case '6M':
          return now.getTime() - itemDate.getTime() <= 180 * 24 * 60 * 60 * 1000;
        case '1Y':
          return now.getTime() - itemDate.getTime() <= 365 * 24 * 60 * 60 * 1000;
        case 'All':
        default:
          return true;
      }
    });

    // Format data for the chart
    const formattedData = filteredData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      'Initial Value': item.purchaseAmount,
      'Current Value': item.currentAmount,
    }));
    
    setChartData(formattedData);
  }, [data, timeFrame]);

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm text-primary">
            Initial Value: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-finance-positive">
            Current Value: {formatCurrency(payload[1].value)}
          </p>
          <p className="text-xs mt-1">
            Growth: {((payload[1].value - payload[0].value) / payload[0].value * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">Growth</h2>
        
        {/* Integrated Time Frame Selector */}
        <div className="time-selector-container">
          {(['1M', '3M', '6M', '1Y', 'All'] as const).map((tf) => (
            <button
              key={tf}
              className={`time-selector-button ${timeFrame === tf ? 'time-selector-active' : 'time-selector-inactive'}`}
              onClick={() => onTimeFrameChange && onTimeFrameChange(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              name="Initial Value"
              dataKey="Initial Value" 
              stroke="#01362e" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              name="Current Value"
              dataKey="Current Value" 
              stroke="#95e362" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;
