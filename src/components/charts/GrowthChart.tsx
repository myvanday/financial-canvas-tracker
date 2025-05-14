import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryArea } from 'victory-native';
import { colors } from '../../navigation/TabNavigator';

interface GrowthChartProps {
  data: {
    date: Date;
    purchaseAmount: number;
    currentAmount: number;
  }[];
  timeFrame?: '1M' | '3M' | '6M' | '1Y' | 'All';
  onTimeFrameChange?: (timeFrame: '1M' | '3M' | '6M' | '1Y' | 'All') => void;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ 
  data, 
  timeFrame = '6M', 
  onTimeFrameChange 
}) => {
  // Filter data based on timeframe
  const getFilteredData = () => {
    if (data.length === 0) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch(timeFrame) {
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        // All time - use all data
        return data;
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };
  
  const filteredData = getFilteredData();
  
  // Calculate percentage growth
  const calculateGrowth = () => {
    if (filteredData.length === 0) return 0;
    
    const firstValue = filteredData[0].purchaseAmount;
    const lastValue = filteredData[filteredData.length - 1].currentAmount;
    
    if (firstValue === 0) return 0;
    return ((lastValue - firstValue) / firstValue) * 100;
  };
  
  const growth = calculateGrowth();
  
  // Format dates for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Growth</Text>
          <Text style={[
            styles.growthText, 
            growth >= 0 ? styles.positiveGrowth : styles.negativeGrowth
          ]}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(2)}%
          </Text>
        </View>
        
        <View style={styles.timeFrameSelector}>
          {['1M', '3M', '6M', '1Y', 'All'].map((tf) => (
            <TouchableOpacity
              key={tf}
              style={[
                styles.timeFrameOption,
                timeFrame === tf && styles.selectedTimeFrame
              ]}
              onPress={() => onTimeFrameChange && onTimeFrameChange(tf as any)}
            >
              <Text style={[
                styles.timeFrameText,
                timeFrame === tf && styles.selectedTimeFrameText
              ]}>
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {filteredData.length > 0 ? (
        <View style={styles.chartContainer}>
          <VictoryChart
            height={220}
            width={320}
            padding={{ top: 10, bottom: 30, left: 40, right: 20 }}
          >
            {/* Purchase amount line */}
            <VictoryLine
              style={{
                data: { stroke: colors.lightText, strokeWidth: 1, strokeDasharray: "4,4" },
              }}
              data={filteredData.map(d => ({
                x: new Date(d.date),
                y: d.purchaseAmount
              }))}
            />
            
            {/* Current amount area */}
            <VictoryArea
              style={{
                data: { 
                  fill: `${colors.primary}20`, 
                  stroke: colors.primary,
                  strokeWidth: 2 
                }
              }}
              data={filteredData.map(d => ({
                x: new Date(d.date),
                y: d.currentAmount
              }))}
            />
            
            <VictoryAxis
              tickFormat={(date) => formatDate(date)}
              style={{
                axis: { stroke: colors.border },
                tickLabels: { fontSize: 10, fill: colors.lightText, padding: 5 }
              }}
            />
            
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `$${Math.round(t / 1000)}k`}
              style={{
                axis: { stroke: colors.border },
                tickLabels: { fontSize: 10, fill: colors.lightText, padding: 5 }
              }}
            />
          </VictoryChart>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data available for selected time frame</Text>
        </View>
      )}
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Current Value</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.lightText }]} />
          <Text style={styles.legendText}>Initial Value</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '500',
  },
  positiveGrowth: {
    color: colors.success,
  },
  negativeGrowth: {
    color: colors.error,
  },
  timeFrameSelector: {
    flexDirection: 'row',
  },
  timeFrameOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
    borderRadius: 4,
  },
  selectedTimeFrame: {
    backgroundColor: colors.primary,
  },
  timeFrameText: {
    fontSize: 12,
    color: colors.text,
  },
  selectedTimeFrameText: {
    color: colors.background,
  },
  chartContainer: {
    height: 220,
    alignItems: 'center',
  },
  emptyState: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.lightText,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.lightText,
  },
});

export default GrowthChart;
