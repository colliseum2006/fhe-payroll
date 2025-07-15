import React, { useState, useEffect } from 'react';
import { UserRole, Employee } from '../../types';
import { usePayroll } from '../../services/payroll';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  DollarSign,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeManagement: React.FC = () => {
  const payroll = usePayroll();
  const { account, isConnected } = payroll;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    address: '',
    salary: '',
  });

  useEffect(() => {
    if (isConnected && account) {
      loadEmployees();
    }
  }, [isConnected, account]);

  const loadEmployees = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      const totalEmployees = await payroll.getTotalEmployees();
      const employeeList: Employee[] = [];
      
      for (let i = 0; i < totalEmployees; i++) {
        try {
          const address = await payroll.getEmployeeAtIndex(i);
          const isEmployee = await payroll.isEmployee(address);
          
          if (isEmployee) {
            employeeList.push({
              address,
              salary: '0', // Encrypted salary - we can't decrypt it
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
      console.error('Failed to load employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!formData.address || !formData.salary) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const salary = parseFloat(formData.salary);
      if (isNaN(salary) || salary <= 0) {
        toast.error('Please enter a valid salary amount');
        return;
      }

      await payroll.addEmployee(formData.address, salary);
      toast.success('Employee added successfully');
      setShowAddModal(false);
      setFormData({ address: '', salary: '' });
      loadEmployees();
    } catch (error) {
      console.error('Failed to add employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const handleUpdateSalary = async () => {
    if (!selectedEmployee || !formData.salary) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const salary = parseFloat(formData.salary);
      if (isNaN(salary) || salary <= 0) {
        toast.error('Please enter a valid salary amount');
        return;
      }

      await payroll.updateEmployeeSalary(selectedEmployee.address, salary);
      toast.success('Salary updated successfully');
      setShowEditModal(false);
      setSelectedEmployee(null);
      setFormData({ address: '', salary: '' });
      loadEmployees();
    } catch (error) {
      console.error('Failed to update salary:', error);
      toast.error('Failed to update salary');
    }
  };

  const handleRemoveEmployee = async (employee: Employee) => {
    if (!window.confirm(`Are you sure you want to remove ${employee.address.slice(0, 6)}...${employee.address.slice(-4)}?`)) {
      return;
    }

    try {
      await payroll.removeEmployee(employee.address);
      toast.success('Employee removed successfully');
      loadEmployees();
    } catch (error) {
      console.error('Failed to remove employee:', error);
      toast.error('Failed to remove employee');
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Connect your wallet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Connect your wallet to access employee management.
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
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access employee management.
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
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="mt-2 text-gray-600">
              Manage employee records and salary information with complete privacy.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
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
          <p className="card-subtitle">Manage employee records and salaries</p>
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Payment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Employee #{index + 1}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.address.slice(0, 6)}...{employee.address.slice(-4)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {employee.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="status-badge status-active">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(employee.lastPaymentTimestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setFormData({ address: employee.address, salary: '' });
                            setShowEditModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveEmployee(employee)}
                          className="text-error-600 hover:text-error-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Employee</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="btn-primary"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Salary</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Address
                  </label>
                  <input
                    type="text"
                    value={selectedEmployee.address}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Salary (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSalary}
                  className="btn-primary"
                >
                  Update Salary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement; 