import React, { useState, useEffect } from 'react';
import { UserRole, Payment } from '../../types';
import { usePayroll } from '../../services/payroll';
import { 
  User, 
  DollarSign, 
  Shield, 
  Clock,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const payroll = usePayroll();
  const { account, isConnected } = payroll;
  const [balance, setBalance] = useState<string>('0');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    toAddress: '',
    amount: '',
  });

  useEffect(() => {
    if (isConnected && account) {
      loadProfileData();
    }
  }, [isConnected, account]);

  const loadProfileData = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      const userBalance = await payroll.getBalance(account);
      setBalance(userBalance?.toString() || '0');
    } catch (error) {
      console.error('Failed to load profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferData.toAddress || !transferData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const amount = parseFloat(transferData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      await payroll.transfer(transferData.toAddress, amount);
      toast.success('Transfer completed successfully');
      setShowTransferModal(false);
      setTransferData({ toAddress: '', amount: '' });
      loadProfileData();
    } catch (error) {
      console.error('Failed to transfer:', error);
      toast.error('Failed to complete transfer');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.HR:
        return 'HR Manager';
      case UserRole.PAYROLL:
        return 'Payroll Manager';
      default:
        return 'Employee';
    }
  };

  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.HR:
        return 'bg-blue-100 text-blue-800';
      case UserRole.PAYROLL:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Connect your wallet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Connect your wallet to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">
          Your personal information and transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Profile Information</h3>
              <p className="card-subtitle">Your account details</p>
            </div>
            
            <div className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-primary-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {getRoleLabel(UserRole.EMPLOYEE)}
                </h4>
                <span className={`status-badge ${getRoleColor(UserRole.EMPLOYEE)}`}>
                  {getRoleLabel(UserRole.EMPLOYEE)}
                </span>
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={account || ''}
                    readOnly
                    className="input-field bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(account || '')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Balance
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={isLoading ? 'Loading...' : `${balance} CST`}
                    readOnly
                    className="input-field bg-gray-50 font-mono text-sm"
                  />
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>

              {/* Connection Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Status
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Transfer Tokens</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Transaction History</h3>
              <p className="card-subtitle">Your recent payments and transfers</p>
            </div>
            
            <div className="space-y-4">
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No transactions yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your payment history will appear here once you receive payments.
                  </p>
                </div>
              ) : (
                payments.map((payment, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {payment.type === 'salary' ? (
                        <DollarSign className="w-5 h-5 text-green-600" />
                      ) : payment.type === 'bonus' ? (
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {payment.type === 'salary' && 'Salary Payment'}
                          {payment.type === 'bonus' && 'Bonus Payment'}
                          {payment.type === 'deduction' && 'Deduction'}
                        </p>
                        <span className={`status-badge ${
                          payment.type === 'salary' ? 'bg-green-100 text-green-800' :
                          payment.type === 'bonus' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {payment.reason && `${payment.reason} - `}
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-gray-900">
                        {payment.amount} CST
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Security Information */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="card-title">Security & Privacy</h3>
              <p className="card-subtitle">Your data protection information</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">FHE Encryption</p>
                  <p className="text-sm text-blue-700">
                    All your salary data is encrypted using Fully Homomorphic Encryption
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Immutable Records</p>
                  <p className="text-sm text-green-700">
                    All transactions are recorded on the blockchain for transparency
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Role-Based Access</p>
                  <p className="text-sm text-purple-700">
                    Access control ensures only authorized personnel can view your data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Tokens</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={transferData.toAddress}
                    onChange={(e) => setTransferData({ ...transferData, toAddress: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (CST)
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setTransferData({ toAddress: '', amount: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={!transferData.toAddress || !transferData.amount}
                  className="btn-primary disabled:opacity-50"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 