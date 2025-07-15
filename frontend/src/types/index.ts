export interface Employee {
  address: string;
  salary: string; // Encrypted salary
  isActive: boolean;
  lastPaymentTimestamp: number;
  balance?: string; // Encrypted balance
}

export interface Payment {
  employee: string;
  amount: string; // Encrypted amount
  type: 'salary' | 'bonus' | 'deduction';
  reason?: string;
  timestamp: number;
  transactionHash?: string;
}

export interface User {
  address: string;
  role: UserRole;
  isConnected: boolean;
}

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  HR = 'HR',
  PAYROLL = 'PAYROLL',
  ADMIN = 'ADMIN',
}

export interface ContractConfig {
  address: string;
  network: string;
  rpcUrl: string;
}

export interface FHEConfig {
  relayerUrl: string;
  chainId: number;
}

export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalPayments: number;
  activeEmployees: number;
  totalSalary: string; // Encrypted total
}

export interface FormData {
  employeeAddress: string;
  salary: string;
  amount: string;
  reason: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Contract ABI types
export interface ContractABI {
  [key: string]: any;
}

// Network configuration
export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Role constants
export const ROLES = {
  HR_ROLE: '0xfd70517941c75212b0f9013e45c47a37d6d983c5304288c7af285f2ea40cbba7',
  PAYROLL_ROLE: '0x7f9673717d875a205cbe95d736eb2269b7dc4fbf2b34e5f3ec698f5deec49d1d',
  ADMIN_ROLE: '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775',
} as const;

// Contract events
export interface ContractEvent {
  name: string;
  args: any[];
  blockNumber: number;
  transactionHash: string;
  timestamp: number;
} 