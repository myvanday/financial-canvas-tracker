
import React from 'react';
import Layout from '../components/Layout';
import { FinanceProvider } from '../context/FinanceContext';

const Index: React.FC = () => {
  return (
    <FinanceProvider>
      <Layout />
    </FinanceProvider>
  );
};

export default Index;
