
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AssetType } from '../../context/FinanceContext';

interface AssetAllocationChartProps {
  data: Record<string, number>;
  title: string;
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data, title }) => {
  const COLORS: Record<string, string> = {
    cash: '#34A853',       // Green
    investment: '#1A73E8', // Blue
    property: '#673AB7',   // Purple
    vehicle: '#FF9800',    // Orange
    other: '#757575',      // Gray
  };

  const LABELS: Record<string, string> = {
    cash: 'Cash',
    investment: 'Investments',
    property: 'Properties',
    vehicle: 'Vehicles',
    other: 'Other Assets',
  };

  const formatData = () => {
    return Object.entries(data).map(([key, value]) => ({
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
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
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
