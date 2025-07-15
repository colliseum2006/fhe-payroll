import React, { useState, useEffect } from 'react';
import { UserRole, Employee, Payment } from '../../types';
import { usePayroll } from '../../services/payroll';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  Minus,
  Users,
  Calendar,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const PayrollManagement: React.FC = () => {
  const payroll = usePayroll();
  const { account, isConnected } = payroll;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'salary' | 'bonus' | 'deduction'>('salary');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
  });

  useEffect(() => {
    if (isConnected && account) {
      loadData();
    }
  }, [isConnected, account]);

  const loadData = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      // Load employees
      const totalEmployees = await payroll.getTotalEmployees();
      const employeeList: Employee[] = [];
      
      for (let i = 0; i < totalEmployees; i++) {
        try {
          const address = await payroll.getEmployeeAtIndex(i);
          const isEmployee = await payroll.isEmployee(address);
          
          if (isEmployee) {
            employeeList.push({
              address,
              salary: '0', // Encrypted salary
              isActive: true,
              lastPaymentTimestamp: Date.now(),
            });
          }
        } catch (error) {
          console.error(`Failed to load employee at index ${i}:`, error);
        }
      }
      
      setEmployees(employeeList);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedEmployee || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      let result;
      switch (paymentType) {
        case 'salary':
          result = await payroll.paySalary(selectedEmployee.address, amount);
          break;
        case 'bonus':
          if (!formData.reason) {
            toast.error('Please provide a reason for the bonus');
            return;
          }
          result = await payroll.payBonus(selectedEmployee.address, amount, formData.reason);
          break;
        case 'deduction':
          if (!formData.reason) {
            toast.error('Please provide a reason for the deduction');
            return;
          }
          result = await payroll.processDeduction(selectedEmployee.address, amount, formData.reason);
          break;
      }

      toast.success(result.message || 'Success');
      setShowPaymentModal(false);
      setSelectedEmployee(null);
      setFormData({ amount: '', reason: '' });
      loadData();
    } catch (error) {
      console.error('Failed to process payment:', error);
      toast.error('Failed to process payment');
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'salary':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'bonus':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'deduction':
        return <Minus className="w-4 h-4 text-red-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'salary':
        return 'Salary';
      case 'bonus':
        return 'Bonus';
      case 'deduction':
        return 'Deduction';
      default:
        return 'Payment';
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'salary':
        return 'bg-green-100 text-green-800';
      case 'bonus':
        return 'bg-blue-100 text-blue-800';
      case 'deduction':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Connect your wallet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Connect your wallet to access payroll management.
          </p>
        </div>
      </div>
    );
  }

  // TODO: Implement role checking from contract
  // For now, allow access to all connected users
  if (false) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access payroll management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
            <p className="mt-2 text-gray-600">
              Process salaries, bonuses, and deductions with complete privacy.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setPaymentType('salary');
                setShowPaymentModal(true);
              }}
              className="btn-success flex items-center space-x-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Pay Salary</span>
            </button>
            <button
              onClick={() => {
                setPaymentType('bonus');
                setShowPaymentModal(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Pay Bonus</span>
            </button>
            <button
              onClick={() => {
                setPaymentType('deduction');
                setShowPaymentModal(true);
              }}
              className="btn-warning flex items-center space-x-2"
            >
              <Minus className="w-4 h-4" />
              <span>Process Deduction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees by address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Employee List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Employees ({filteredEmployees.length})</h3>
          <p className="card-subtitle">Select an employee to process payments</p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSelectedEmployee(employee);
                  setShowPaymentModal(true);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Employee #{index + 1}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.address.slice(0, 6)}...{employee.address.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <span className="status-badge status-active">Active</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Payment:</span>
                    <span className="text-gray-900">
                      {new Date(employee.lastPaymentTimestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-medium">Ready for Payment</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Payments */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Payments</h3>
            <p className="card-subtitle">Latest payment transactions</p>
          </div>
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No recent payments</p>
              </div>
            ) : (
              payments.map((payment, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getPaymentTypeIcon(payment.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">
                        {getPaymentTypeLabel(payment.type)} Payment
                      </p>
                      <span className={`status-badge ${getPaymentTypeColor(payment.type)}`}>
                        {getPaymentTypeLabel(payment.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {payment.employee.slice(0, 6)}...{payment.employee.slice(-4)}
                      {payment.reason && ` - ${payment.reason}`}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-sm text-gray-500">
                      {new Date(payment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {paymentType === 'salary' && 'Pay Salary'}
                {paymentType === 'bonus' && 'Pay Bonus'}
                {paymentType === 'deduction' && 'Process Deduction'}
              </h3>
              
              <div className="space-y-4">
                {!selectedEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Employee
                    </label>
                    <select
                      onChange={(e) => {
                        const employee = employees.find(emp => emp.address === e.target.value);
                        setSelectedEmployee(employee || null);
                      }}
                      className="input-field"
                    >
                      <option value="">Choose an employee...</option>
                      {employees.map((employee, index) => (
                        <option key={index} value={employee.address}>
                          Employee #{index + 1} ({employee.address.slice(0, 6)}...{employee.address.slice(-4)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {selectedEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee
                    </label>
                    <input
                      type="text"
                      value={`${selectedEmployee.address.slice(0, 6)}...${selectedEmployee.address.slice(-4)}`}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                {(paymentType === 'bonus' || paymentType === 'deduction') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason
                    </label>
                    <input
                      type="text"
                      placeholder={paymentType === 'bonus' ? 'Performance bonus' : 'Tax deduction'}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="input-field"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedEmployee(null);
                    setFormData({ amount: '', reason: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!selectedEmployee || !formData.amount}
                  className="btn-primary disabled:opacity-50"
                >
                  {paymentType === 'salary' && 'Pay Salary'}
                  {paymentType === 'bonus' && 'Pay Bonus'}
                  {paymentType === 'deduction' && 'Process Deduction'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement; 