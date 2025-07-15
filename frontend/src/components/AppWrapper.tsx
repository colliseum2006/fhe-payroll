import React from 'react';
import { FhevmProvider } from '../contexts/FhevmContext';
import { useWallet } from '../hooks/useWallet';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { account } = useWallet();

  return (
    <FhevmProvider account={account}>
      {children}
    </FhevmProvider>
  );
};

export default AppWrapper; 