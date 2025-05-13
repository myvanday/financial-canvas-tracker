
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, VictoryArea } from 'victory-native';
import { colors } from '../../navigation/TabNavigator';

interface GrowthChartProps {
  data: Array<{
    date: Date;
    purchaseAmount: number;
    currentAmount: number;
  }>;
  timeFrame: '1M' | '3M' | '6M' | '1Y' | 'All';
  onTimeFrameChange: (timeFrame: '1M' | '3M' | '6M' | '1Y' | 'All') => void;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ 
  data, 
  timeFrame, 
  onTimeFrameChange
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Filter data based on timeframe
  const filteredData = React.useMemo(() => {
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
      case 'All':
      default:
        return data;
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  }, [data, timeFrame]);
  
  if (!filteredData.length) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }
  
  // Format data for Victory
  const initialValueData = filteredData.map(item => ({
    x: new Date(item.date),
    y: item.purchaseAmount
  }));
  
  const currentValueData = filteredData.map(item => ({
    x: new Date(item.date),
    y: item.currentAmount
  }));
  
  // Latest values
  const latestData = filteredData[filteredData.length - 1];
  const netGrowth = latestData.currentAmount - latestData.purchaseAmount;
  const growthPercentage = (netGrowth / latestData.purchaseAmount) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.chartTitle}>Growth</Text>
          <Text style={styles.netGrowth}>
            {netGrowth >= 0 ? '+' : ''}{formatCurrency(netGrowth)}
            <Text style={styles.percentageText}>
              {' '}({growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(2)}%)
            </Text>
          </Text>
        </View>
        
        <View style={styles.timeSelectorContainer}>
          {(['1M', '3M', '6M', '1Y', 'All'] as const).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.timeOption,
                timeFrame === option && styles.selectedTimeOption
              ]}
              onPress={() => onTimeFrameChange(option)}
            >
              <Text style={[
                styles.timeOptionText,
                timeFrame === option && styles.selectedTimeOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.chart}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={320}
          height={220}
          padding={{ top: 10, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryAxis
            tickFormat={(x) => {
              const date = new Date(x);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            style={{
              axis: { stroke: colors.muted },
              tickLabels: { fill: colors.muted, fontSize: 10 }
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(y) => `$${Math.round(y / 1000)}k`}
            style={{
              axis: { stroke: colors.muted },
              tickLabels: { fill: colors.muted, fontSize: 10 }
            }}
          />
          <VictoryArea
            data={initialValueData}
            style={{
              data: { fill: colors.muted, opacity: 0.3, stroke: colors.muted }
            }}
          />
          <VictoryLine
            data={initialValueData}
            style={{
              data: { stroke: colors.muted, strokeWidth: 2 }
            }}
          />
          <VictoryArea
            data={currentValueData}
            style={{
              data: { fill: colors.primary, opacity: 0.3, stroke: colors.primary }
            }}
          />
          <VictoryLine
            data={currentValueData}
            style={{
              data: { stroke: colors.primary, strokeWidth: 2 }
            }}
          />
        </VictoryChart>
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Current Value</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.muted }]} />
          <Text style={styles.legendText}>Initial Value</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  netGrowth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  percentageText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: 'normal',
  },
  timeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 8,
  },
  timeOption: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  selectedTimeOption: {
    backgroundColor: colors.primary,
  },
  timeOptionText: {
    fontSize: 12,
    color: colors.lightText,
  },
  selectedTimeOptionText: {
    color: colors.background,
    fontWeight: '500',
  },
  chart: {
    marginVertical: 10,
    height: 220,
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.text,
  },
});

export default GrowthChart;
