import { NetworkConfig } from '../types';
import { SepoliaConfig } from '@zama-fhe/relayer-sdk';

// Contract addresses
export const CONTRACT_ADDRESSES = {
  SEPOLIA: process.env.REACT_APP_CONTRACT_ADDRESS || '0xf10574209A7c856887f672fAE3Eb3d5b34ED7C9c',
  LOCALHOST: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
} as const;

// Network configurations
export const NETWORKS: Record<string, NetworkConfig> = {
  SEPOLIA: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: process.env.REACT_APP_RPC_URL || 'https://sepolia.infura.io/v3/645b161c447c49d4bbed402076e9ad0b',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  LOCALHOST: {
    name: 'Localhost',
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    blockExplorer: '',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

// FHE Configuration - Using official Zama Sepolia config
export const FHE_CONFIG = SepoliaConfig;

// Contract configuration
export const CONTRACT_CONFIG = {
  name: 'Confidential Salary Token',
  symbol: 'CST',
  decimals: 6,
  tokenURI: 'https://api.example.com/token/',
};

// Default network
export const DEFAULT_NETWORK = 'SEPOLIA';

// Environment variables
export const getRpcUrl = (): string => {
  return process.env.REACT_APP_RPC_URL || NETWORKS[DEFAULT_NETWORK].rpcUrl;
};

export const getContractAddress = (): string => {
  const network = process.env.REACT_APP_NETWORK || DEFAULT_NETWORK;
  return CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES] || CONTRACT_ADDRESSES.SEPOLIA;
}; 