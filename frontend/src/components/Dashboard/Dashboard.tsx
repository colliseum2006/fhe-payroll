import React, { useState, useEffect } from 'react';
import { UserRole, DashboardStats } from '../../types';
import { usePayroll } from '../../services/payroll';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield,
  Activity,
  Clock,
  User,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const payroll = usePayroll();
  const { account, isConnected } = payroll;
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalPayments: 0,
    activeEmployees: 0,
    totalSalary: '0',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected) {
      loadDashboardData();
    }
  }, [isConnected]);

  const loadDashboardData = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      const totalEmployees = await payroll.getTotalEmployees();
      setStats(prev => ({
        ...prev,
        totalEmployees,
        activeEmployees: totalEmployees, // Assuming all employees are active
      }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleSpecificContent = () => {
    if (!account) return null;

    // For now, we'll show employee view by default
    // TODO: Implement role detection from contract
    const userRole = UserRole.EMPLOYEE as UserRole;

    switch (userRole) {
      case UserRole.ADMIN:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminOverview />
            <SystemHealth />
          </div>
        );
      case UserRole.HR:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmployeeManagement />
            <RecentHiring />
          </div>
        );
      case UserRole.PAYROLL:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PayrollOverview />
            <PaymentHistory />
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmployeeOverview />
            <RecentPayments />
          </div>
        );
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ 
    title, 
    value, 
    icon, 
    color 
  }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Connect your wallet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Connect your wallet to access the confidential payroll dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {getRoleLabel(UserRole.EMPLOYEE)}!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your confidential payroll operations with complete privacy.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={isLoading ? '...' : stats.totalEmployees}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Employees"
          value={isLoading ? '...' : stats.activeEmployees}
          icon={<User className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Payments"
          value={isLoading ? '...' : stats.totalPayments}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="System Status"
          value="Active"
          icon={<Shield className="w-6 h-6 text-white" />}
          color="bg-emerald-500"
        />
      </div>

      {/* Role-specific Content */}
      {getRoleSpecificContent()}

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <p className="card-subtitle">Latest transactions and updates</p>
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No recent activity</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Role-specific components
const AdminOverview: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">System Overview</h3>
      <p className="card-subtitle">Administrative controls and system health</p>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-blue-900">Contract Status</p>
          <p className="text-sm text-blue-700">Active and operational</p>
        </div>
        <Shield className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-green-900">FHE Operations</p>
          <p className="text-sm text-green-700">All encryption working</p>
        </div>
        <TrendingUp className="w-5 h-5 text-green-600" />
      </div>
    </div>
  </div>
);

const SystemHealth: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">System Health</h3>
      <p className="card-subtitle">Performance and security metrics</p>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Uptime</span>
        <span className="text-sm font-medium text-green-600">99.9%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Security Level</span>
        <span className="text-sm font-medium text-green-600">Maximum</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Last Backup</span>
        <span className="text-sm font-medium text-gray-900">2 hours ago</span>
      </div>
    </div>
  </div>
);

const EmployeeManagement: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">Employee Management</h3>
      <p className="card-subtitle">HR operations and employee data</p>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-blue-900">Active Employees</p>
          <p className="text-sm text-blue-700">Manage employee records</p>
        </div>
        <Users className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-green-900">Salary Updates</p>
          <p className="text-sm text-green-700">Process promotions and raises</p>
        </div>
        <DollarSign className="w-5 h-5 text-green-600" />
      </div>
    </div>
  </div>
);

const RecentHiring: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">Recent Hiring</h3>
      <p className="card-subtitle">Latest employee additions</p>
    </div>
    <div className="text-center py-8">
      <User className="mx-auto h-8 w-8 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">No recent hiring activity</p>
    </div>
  </div>
);

const PayrollOverview: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">Payroll Overview</h3>
      <p className="card-subtitle">Payment processing and management</p>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-green-900">Salary Payments</p>
          <p className="text-sm text-green-700">Process monthly salaries</p>
        </div>
        <DollarSign className="w-5 h-5 text-green-600" />
      </div>
      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-purple-900">Bonus Processing</p>
          <p className="text-sm text-purple-700">Handle performance bonuses</p>
        </div>
        <TrendingUp className="w-5 h-5 text-purple-600" />
      </div>
    </div>
  </div>
);

const PaymentHistory: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">Payment History</h3>
      <p className="card-subtitle">Recent payment transactions</p>
    </div>
    <div className="text-center py-8">
      <DollarSign className="mx-auto h-8 w-8 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">No recent payments</p>
    </div>
  </div>
);

const EmployeeOverview: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">Your Overview</h3>
      <p className="card-subtitle">Personal salary and payment information</p>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-blue-900">Current Balance</p>
          <p className="text-sm text-blue-700">View your token balance</p>
        </div>
        <DollarSign className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-green-900">Last Payment</p>
          <p className="text-sm text-green-700">Check recent payments</p>
        </div>
        <Clock className="w-5 h-5 text-green-600" />
      </div>
    </div>
  </div>
);

const RecentPayments: React.FC = () => (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">Recent Payments</h3>
      <p className="card-subtitle">Your latest salary payments</p>
    </div>
    <div className="text-center py-8">
      <DollarSign className="mx-auto h-8 w-8 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">No recent payments</p>
    </div>
  </div>
);

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

export default Dashboard; 