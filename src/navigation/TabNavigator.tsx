
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import HistoryScreen from '../screens/HistoryScreen';
import Icon from '../components/Icon';

const Tab = createBottomTabNavigator();

// Modern, clean color scheme with shades of black, white, and gray
export const colors = {
  primary: '#333333',
  background: '#FFFFFF',
  card: '#F6F6F7',
  text: '#222222',
  border: '#DDDDDD',
  accent: '#555555',
  error: '#FF3B30',
  success: '#34C759',
  muted: '#999999',
  cardBg: '#F1F1F1',
  lightText: '#888888',
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Net Worth Tracker',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="Home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          title: 'Portfolio',
          tabBarLabel: 'Portfolio',
          tabBarIcon: ({ color, size }) => (
            <Icon name="PieChart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <Icon name="History" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
