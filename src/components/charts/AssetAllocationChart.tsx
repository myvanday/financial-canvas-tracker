
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import { AssetType } from '../../context/FinanceContext';
import { colors } from '../../navigation/TabNavigator';

interface AssetAllocationChartProps {
  data: Record<string, number>;
  historicalData?: Record<string, number>[] | { date: Date; allocation: Record<AssetType, number> }[];
  title?: string;
  showTimeSelector?: boolean;
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ 
  data, 
  historicalData = [], 
  title, 
  showTimeSelector = false 
}) => {
  const [timeFrame, setTimeFrame] = useState<'now' | '1M' | '3M' | '6M' | 'YTD' | '1Y'>('now');
  
  // Format data for Victory chart
  const chartData = Object.entries(data).map(([key, value]) => ({
    x: key,
    y: value
  }));
  
  // Get total to calculate percentages
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  
  // Function to get colors for assets
  const getAssetColor = (assetType: string, index: number) => {
    const baseColors = [
      colors.primary,
      '#555555',
      '#777777',
      '#999999',
      '#BBBBBB',
    ];
    
    return baseColors[index % baseColors.length];
  };
  
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      {showTimeSelector && (
        <View style={styles.timeSelector}>
          {['now', '1M', '3M', '6M', 'YTD', '1Y'].map(time => (
            <Text
              key={time}
              style={[
                styles.timeOption,
                timeFrame === time && styles.selectedTimeOption
              ]}
              onPress={() => setTimeFrame(time as any)}
            >
              {time}
            </Text>
          ))}
        </View>
      )}
      
      <View style={styles.chartContainer}>
        {total > 0 ? (
          <VictoryPie
            data={chartData}
            colorScale={chartData.map((_, i) => getAssetColor(_.x, i))}
            width={280}
            height={280}
            padding={40}
            innerRadius={70}
            labelRadius={({ innerRadius }) => (innerRadius || 0) + 25}
            labels={() => null} // No labels on the chart
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No data to display</Text>
          </View>
        )}
      </View>
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a) // Sort by value descending
          .map(([assetType, value], index) => (
            <View key={assetType} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor, 
                  { backgroundColor: getAssetColor(assetType, index) }
                ]} 
              />
              <Text style={styles.legendText}>{assetType}</Text>
              <Text style={styles.legendValue}>
                {((value / total) * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  timeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    fontSize: 12,
    color: colors.text,
  },
  selectedTimeOption: {
    backgroundColor: colors.primary,
    color: colors.background,
  },
  chartContainer: {
    height: 280,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  emptyText: {
    color: colors.lightText,
    fontSize: 14,
  },
  legendContainer: {
    width: '100%',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
});

export default AssetAllocationChart;
