
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../navigation/TabNavigator';

interface AssetAllocationChartProps {
  data: Record<string, number>;
  historicalData?: Array<Record<string, number>>;
  title: string;
  showTimeSelector?: boolean;
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ 
  data, 
  title,
  showTimeSelector 
}) => {
  // This is a simplified version for the React Native conversion
  // A complete implementation would use Victory Native or another charting library

  const getAssetColor = (index: number): string => {
    const colors = ['#333333', '#555555', '#777777', '#999999'];
    return colors[index % colors.length];
  };

  const totalValue = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.legendContainer}>
        {Object.entries(data).map(([key, value], index) => {
          const percentage = totalValue > 0 ? (value / totalValue * 100).toFixed(1) : '0';
          
          return (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.colorIndicator, { backgroundColor: getAssetColor(index) }]} />
              <Text style={styles.legendText}>
                {key} ({percentage}%)
              </Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.barContainer}>
        {Object.entries(data).map(([key, value], index) => {
          const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
          
          return (
            <View 
              key={key} 
              style={[
                styles.bar, 
                { 
                  backgroundColor: getAssetColor(index),
                  width: `${percentage}%` 
                }
              ]} 
            />
          );
        })}
      </View>
      
      <Text style={styles.placeholderText}>
        * For a complete pie chart visualization, implement with Victory Native
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: colors.text,
  },
  legendContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
  },
  barContainer: {
    height: 20,
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  bar: {
    height: '100%',
  },
  placeholderText: {
    fontSize: 12,
    color: colors.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  }
});

export default AssetAllocationChart;
