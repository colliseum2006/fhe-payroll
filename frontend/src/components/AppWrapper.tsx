import React from 'react';
import { FhevmProvider } from '../contexts/FhevmContext';
import { useWallet } from '../hooks/useWallet';
import WalletConnection from './WalletConnection';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { account, isConnected, isCorrectNetwork } = useWallet();

  // Show wallet connection screen if no wallet is connected or wrong network
  if (!isConnected || !account || !isCorrectNetwork) {
    return <WalletConnection />;
  }

  // Show main app with FHEVM provider when wallet is connected and on correct network
  return (
    <FhevmProvider account={account}>
      {children}
    </FhevmProvider>
  );
};

export default AppWrapper; 