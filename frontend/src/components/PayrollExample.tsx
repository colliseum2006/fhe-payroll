import React, { useState, useEffect } from 'react';
import { usePayroll } from '../services/payroll';
import toast from 'react-hot-toast';

export const PayrollExample: React.FC = () => {
  const payroll = usePayroll();
  const { account, isConnected } = payroll;
  const [balance, setBalance] = useState<bigint | undefined>(undefined);
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [amount, setAmount] = useState('');

  // Load balance on mount and when user changes
  useEffect(() => {
    if (isConnected && account) {
      loadBalance();
    }
  }, [isConnected, account]);

  const loadBalance = async () => {
    if (!account) return;
    try {
      const bal = await payroll.getBalance(account);
      setBalance(bal);
    } catch (error) {
      console.error('Failed to load balance:', error);
      toast.error('Failed to load balance');
    }
  };

  const handleAddEmployee = async () => {
    if (!employeeAddress || !salary) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      toast.loading('Adding employee...');
      await payroll.addEmployee(employeeAddress, parseInt(salary));
      toast.success('Employee added successfully');
      setEmployeeAddress('');
      setSalary('');
    } catch (error) {
      console.error('Failed to add employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const handlePaySalary = async () => {
    if (!employeeAddress || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      toast.loading('Processing salary payment...');
      await payroll.paySalary(employeeAddress, parseInt(amount));
      toast.success('Salary paid successfully');
      setEmployeeAddress('');
      setAmount('');
      await loadBalance(); // Refresh balance
    } catch (error) {
      console.error('Failed to pay salary:', error);
      toast.error('Failed to pay salary');
    }
  };

  const handleTransfer = async () => {
    if (!employeeAddress || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      toast.loading('Processing transfer...');
      await payroll.transfer(employeeAddress, parseInt(amount));
      toast.success('Transfer completed successfully');
      setEmployeeAddress('');
      setAmount('');
      await loadBalance(); // Refresh balance
    } catch (error) {
      console.error('Failed to transfer:', error);
      toast.error('Failed to transfer');
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Please connect your wallet to use the payroll system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payroll Dashboard</h2>
        
        {/* Balance Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Balance</h3>
          <p className="text-2xl font-bold text-blue-700">
            {balance !== undefined ? `${balance.toString()} tokens` : 'Loading...'}
          </p>
          <button
            onClick={loadBalance}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Balance
          </button>
        </div>

        {/* Add Employee Form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Employee</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Employee Address (0x...)"
              value={employeeAddress}
              onChange={(e) => setEmployeeAddress(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Salary Amount"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddEmployee}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Add Employee
          </button>
        </div>

        {/* Pay Salary Form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pay Salary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Employee Address (0x...)"
              value={employeeAddress}
              onChange={(e) => setEmployeeAddress(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handlePaySalary}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Pay Salary
          </button>
        </div>

        {/* Transfer Form */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Tokens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Recipient Address (0x...)"
              value={employeeAddress}
              onChange={(e) => setEmployeeAddress(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleTransfer}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}; 