import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useFhevm } from '../contexts/FhevmContext';
import { useWallet } from '../hooks/useWallet';
import { toHexString } from '../utils/fhe';
import { getContractAddress } from '../config/contracts';

// Contract ABI - Using the compiled contract ABI with proper FHE type handling
const CONTRACT_ABI = [
  // Employee Management
  'function addEmployee(address employee, bytes32 encryptedSalary, bytes inputProof) external',
  'function removeEmployee(address employee) external',
  'function updateEmployeeSalary(address employee, bytes32 newEncryptedSalary, bytes inputProof) external',
  'function getEmployeeSalary(address employee) external view returns (bytes32)',
  'function isEmployee(address employee) external view returns (bool)',
  
  // Salary Operations
  'function paySalary(address employee, bytes32 amount, bytes inputProof) external',
  'function payBonus(address employee, bytes32 amount, string reason, bytes inputProof) external',
  'function processDeduction(address employee, bytes32 amount, string reason, bytes inputProof) external',
  
  // Token Operations
  'function balanceOf(address account) external view returns (bytes32)',
  'function transfer(address to, bytes32 amount, bytes inputProof) external returns (bool)',
  'function transferFrom(address from, address to, bytes32 amount) external returns (bool)',
  
  // Role Management
  'function grantRole(bytes32 role, address account) external',
  'function revokeRole(bytes32 role, address account) external',
  'function hasRole(bytes32 role, address account) external view returns (bool)',
  
  // Utility Functions
  'function getTotalEmployees() external view returns (uint256)',
  'function getEmployeeAtIndex(uint256 index) external view returns (address)',
  'function pause() external',
  'function unpause() external',
  
  // Events
  'event EmployeeAdded(address indexed employee, bytes32 encryptedSalary)',
  'event EmployeeRemoved(address indexed employee)',
  'event SalaryPaid(address indexed employee, bytes32 amount)',
  'event BonusPaid(address indexed employee, bytes32 amount, string reason)',
  'event DeductionProcessed(address indexed employee, bytes32 amount, string reason)',
  'event SalaryUpdated(address indexed employee, bytes32 newSalary)',
];

// Role constants
const ROLES = {
  HR_ROLE: ethers.keccak256(ethers.toUtf8Bytes('HR_ROLE')),
  PAYROLL_ROLE: ethers.keccak256(ethers.toUtf8Bytes('PAYROLL_ROLE')),
  ADMIN_ROLE: ethers.keccak256(ethers.toUtf8Bytes('ADMIN_ROLE')),
};

export function usePayroll() {
  const { instance, decrypt } = useFhevm();
  const { account, isConnected, isLoading, connect, disconnect } = useWallet();
  const contractAddress = getContractAddress();

  // Create ethers provider and signer
  const getProvider = () => {
    if (!window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  };

  const getSigner = async () => {
    const provider = getProvider();
    if (!provider || !account) return null;
    return await provider.getSigner();
  };

  const getContract = async () => {
    const signer = await getSigner();
    if (!signer) return null;
    return new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
  };

  // Request signature for EIP712
  const requestSignature = async (eip712: any) => {
    if (!account || !window.ethereum) return '';
    const signature = await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [account, JSON.stringify(eip712)],
    });
    return signature as string;
  };

  // Add employee with encrypted salary
  const addEmployee = useCallback(
    async (employeeAddress: string, salary: number) => {
      if (!instance || !account) return;
      
      const contract = await getContract();
      if (!contract) return;
      
      // Create encrypted input
      const input = instance.createEncryptedInput(contractAddress, account);
      const { handles, inputProof } = await input
        .add16(salary) // Encrypt the salary value
        .encrypt();

      // Submit to contract
      const tx = await contract.addEmployee(
        employeeAddress, 
        toHexString(handles[0], true), 
        toHexString(inputProof, true)
      );
      
      const receipt = await tx.wait();
      return receipt;
    },
    [account, instance, contractAddress],
  );

  // Remove employee
  const removeEmployee = useCallback(
    async (employeeAddress: string) => {
      const contract = await getContract();
      if (!contract) return;
      
      const tx = await contract.removeEmployee(employeeAddress);
      const receipt = await tx.wait();
      return receipt;
    },
    [account],
  );

  // Update employee salary
  const updateEmployeeSalary = useCallback(
    async (employeeAddress: string, newSalary: number) => {
      if (!instance || !account) return;
      
      const contract = await getContract();
      if (!contract) return;
      
      // Create encrypted input
      const input = instance.createEncryptedInput(contractAddress, account);
      const { handles, inputProof } = await input
        .add16(newSalary) // Encrypt the new salary value
        .encrypt();

      // Submit to contract
      const tx = await contract.updateEmployeeSalary(
        employeeAddress, 
        toHexString(handles[0], true), 
        toHexString(inputProof, true)
      );
      
      const receipt = await tx.wait();
      return receipt;
    },
    [account, instance, contractAddress],
  );

  // Pay salary
  const paySalary = useCallback(
    async (employeeAddress: string, amount: number) => {
      if (!instance || !account) return;
      
      const contract = await getContract();
      if (!contract) return;
      
      // Create encrypted input
      const input = instance.createEncryptedInput(contractAddress, account);
      const { handles, inputProof } = await input
        .add16(amount) // Encrypt the amount
        .encrypt();

      // Submit to contract
      const tx = await contract.paySalary(
        employeeAddress, 
        toHexString(handles[0], true), 
        toHexString(inputProof, true)
      );
      
      const receipt = await tx.wait();
      return receipt;
    },
    [account, instance, contractAddress],
  );

  // Pay bonus
  const payBonus = useCallback(
    async (employeeAddress: string, amount: number, reason: string) => {
      if (!instance || !account) return;
      
      const contract = await getContract();
      if (!contract) return;
      
      // Create encrypted input
      const input = instance.createEncryptedInput(contractAddress, account);
      const { handles, inputProof } = await input
        .add16(amount) // Encrypt the amount
        .encrypt();

      // Submit to contract
      const tx = await contract.payBonus(
        employeeAddress, 
        toHexString(handles[0], true), 
        reason, 
        toHexString(inputProof, true)
      );
      
      const receipt = await tx.wait();
      return receipt;
    },
    [account, instance, contractAddress],
  );

  // Process deduction
  const processDeduction = useCallback(
    async (employeeAddress: string, amount: number, reason: string) => {
      if (!instance || !account) return;
      
      const contract = await getContract();
      if (!contract) return;
      
      // Create encrypted input
      const input = instance.createEncryptedInput(contractAddress, account);
      const { handles, inputProof } = await input
        .add16(amount) // Encrypt the amount
        .encrypt();

      // Submit to contract
      const tx = await contract.processDeduction(
        employeeAddress, 
        toHexString(handles[0], true), 
        reason, 
        toHexString(inputProof, true)
      );
      
      const receipt = await tx.wait();
      return receipt;
    },
    [account, instance, contractAddress],
  );

  // Transfer tokens
  const transfer = useCallback(
    async (toAddress: string, amount: number) => {
      if (!instance || !account) return;
      
      const contract = await getContract();
      if (!contract) return;
      
      // Create encrypted input
      const input = instance.createEncryptedInput(contractAddress, account);
      const { handles, inputProof } = await input
        .add16(amount) // Encrypt the amount
        .encrypt();

      // Submit to contract
      const tx = await contract.transfer(
        toAddress, 
        toHexString(handles[0], true), 
        toHexString(inputProof, true)
      );
      
      const receipt = await tx.wait();
      return receipt;
    },
    [account, instance, contractAddress],
  );

  // Get encrypted balance
  const getBalance = useCallback(async (address: string) => {
    const provider = getProvider();
    if (!provider) return;
    
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    const data = await contract.balanceOf(address);
    
    // Decrypt the result
    const decryption = await decrypt(data, requestSignature);
    return decryption;
  }, [account, decrypt, contractAddress]);

  // Get encrypted employee salary
  const getEmployeeSalary = useCallback(async (employeeAddress: string) => {
    const provider = getProvider();
    if (!provider) return;
    
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    const data = await contract.getEmployeeSalary(employeeAddress);
    
    // Decrypt the result
    const decryption = await decrypt(data, requestSignature);
    return decryption;
  }, [account, decrypt, contractAddress]);

  // Check if address is employee
  const isEmployee = useCallback(async (address: string) => {
    const provider = getProvider();
    if (!provider) return false;
    
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    const data = await contract.isEmployee(address);
    
    return data as boolean;
  }, [account, contractAddress]);

  // Get total employees count
  const getTotalEmployees = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return 0;
    
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    const data = await contract.getTotalEmployees();
    
    return Number(data);
  }, [account, contractAddress]);

  // Get employee at index
  const getEmployeeAtIndex = useCallback(async (index: number) => {
    const provider = getProvider();
    if (!provider) return '';
    
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    const data = await contract.getEmployeeAtIndex(index);
    
    return data as string;
  }, [account, contractAddress]);

  return {
    // Wallet properties
    account,
    isConnected,
    isLoading,
    connect,
    disconnect,
    // Contract methods
    addEmployee,
    removeEmployee,
    updateEmployeeSalary,
    paySalary,
    payBonus,
    processDeduction,
    transfer,
    getBalance,
    getEmployeeSalary,
    isEmployee,
    getTotalEmployees,
    getEmployeeAtIndex,
  };
} 