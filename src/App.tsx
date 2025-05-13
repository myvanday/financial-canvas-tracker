
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { FinanceProvider } from './context/FinanceContext';
import TabNavigator from './navigation/TabNavigator';
import AccountDetailScreen from './screens/AccountDetailScreen';
import AddAccountScreen from './screens/AddAccountScreen';

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" />
    <FinanceProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="AddAccount" component={AddAccountScreen} />
        <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
      </Stack.Navigator>
    </FinanceProvider>
  </NavigationContainer>
);

export default App;
