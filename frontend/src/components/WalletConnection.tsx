import React from 'react';
import { Wallet, Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const WalletConnection: React.FC = () => {
  const { connect, isLoading, isConnected, isCorrectNetwork, switchToSepolia } = useWallet();

  const handleConnect = async () => {
    await connect();
  };

  const handleSwitchNetwork = async () => {
    await switchToSepolia();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Confidential Payroll
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Privacy-first payroll system using Fully Homomorphic Encryption
          </p>

          {/* Network Status */}
          {isConnected && (
            <div className="mb-6">
              {isCorrectNetwork ? (
                <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Connected to Sepolia Testnet</span>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Wrong Network</span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                    Please switch to Sepolia testnet to use this application
                  </p>
                  <button
                    onClick={handleSwitchNetwork}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Switch to Sepolia
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700 dark:text-gray-300">Encrypted salary data</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700 dark:text-gray-300">Zero-knowledge proofs</span>
              </div>
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700 dark:text-gray-300">Web3 wallet integration</span>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          {!isConnected && (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Wallet className="w-5 h-5" />
              <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}

          {/* Instructions */}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>Make sure you have MetaMask or another Web3 wallet installed</p>
            <p className="mt-1">Connect to Sepolia testnet to use the application</p>
          </div>

          {/* Network Info */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Network:</strong> Sepolia Testnet (Chain ID: 11155111)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection; 