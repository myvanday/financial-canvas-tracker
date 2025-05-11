
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AssetType } from '../../context/FinanceContext';

interface AssetAllocationChartProps {
  data: Record<string, number>;
  historicalData?: { date: Date; allocation: Record<AssetType, number> }[];
  title: string;
  showTimeSelector?: boolean;
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ 
  data, 
  historicalData, 
  title,
  showTimeSelector = false 
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    historicalData ? historicalData.length - 1 : 0
  );

  const COLORS: Record<string, string> = {
    money: '#B4E4A5',      // Money
    savings: '#A9D6E5',    // Savings
    investments: '#FFD59E', // Investments
    physical: '#E6B8FF',   // Physical Assets
  };

  const LABELS: Record<string, string> = {
    money: "Money",
    savings: "Savings",
    investments: "Investments",
    physical: "Physical Assets",
  };

  // Compute display data based on historical selection if available
  const displayData = showTimeSelector && historicalData && historicalData[selectedMonth]
    ? historicalData[selectedMonth].allocation
    : data;

  const formatData = () => {
    return Object.entries(displayData).map(([key, value]) => ({
      name: LABELS[key as AssetType] || key,
      value,
      id: key,
    }));
  };

  const chartData = formatData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
    });
  };

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded shadow-md border text-sm">
          <p className="font-semibold">{data.name}</p>
          <p>{formatCurrency(data.value)}</p>
          <p>{`${((data.value / totalValue) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {showTimeSelector && historicalData && (
          <select
            className="text-sm border rounded p-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {historicalData.map((data, index) => (
              <option key={index} value={index}>
                {formatDate(data.date)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.id as AssetType] || '#757575'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetAllocationChart;
