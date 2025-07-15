import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import toast from 'react-hot-toast';
import { FhevmProvider } from './FhevmContext';

interface Web3ContextType {
  user: User | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshUser: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connect = async () => {
    setIsLoading(true);
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      
      // Create initial user object
      const connectedUser: User = {
        address,
        role: UserRole.EMPLOYEE, // Will be updated below
        isConnected: true,
      };
      
      setUser(connectedUser);
      
      // Determine user role (this will be done by individual components using the payroll service)
      toast.success(`Connected as ${connectedUser.address}`);
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setUser(null);
    toast.success('Disconnected from wallet');
  };

  const refreshUser = async () => {
    if (user?.address) {
      // User role will be determined by components using the payroll service
      // This is a simplified version - components will handle role checking
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            const address = accounts[0];
            const connectedUser: User = {
              address,
              role: UserRole.EMPLOYEE,
              isConnected: true,
            };
            setUser(connectedUser);
          }
        } catch (error) {
          console.error('Failed to check connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnect();
        } else if (user && accounts[0] !== user.address) {
          // User switched accounts
          connect();
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [user]);

  const value: Web3ContextType = {
    user,
    isConnected: !!user?.isConnected,
    isLoading,
    connect,
    disconnect,
    refreshUser,
  };

  return (
    <Web3Context.Provider value={value}>
      <FhevmProvider account={user?.address}>
        {children}
      </FhevmProvider>
    </Web3Context.Provider>
  );
}; 