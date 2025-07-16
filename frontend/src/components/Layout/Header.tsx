import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../../types';
import { useWallet } from '../../hooks/useWallet';
import { 
  Wallet, 
  User, 
  LogOut, 
  Shield, 
  Users, 
  DollarSign,
  Menu,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { account, isConnected, isLoading, connect, disconnect } = useWallet();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Shield },
    { name: 'Employees', href: '/employees', icon: Users, roles: [UserRole.HR, UserRole.ADMIN] },
    { name: 'Payroll', href: '/payroll', icon: DollarSign, roles: [UserRole.PAYROLL, UserRole.ADMIN] },
    { name: 'Profile', href: '/profile', icon: User },
  ].filter(item => !item.roles || item.roles.includes(UserRole.EMPLOYEE));

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case UserRole.HR:
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case UserRole.PAYROLL:
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.HR:
        return 'HR Manager';
      case UserRole.PAYROLL:
        return 'Payroll Manager';
      default:
        return 'Employee';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Confidential Payroll</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu and Connect Button */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {isConnected && account ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                  <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getRoleColor(UserRole.EMPLOYEE))}>
                    {getRoleLabel(UserRole.EMPLOYEE)}
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="hidden md:flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors',
                      location.pathname === item.href
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Theme Toggle */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile User Info */}
            {isConnected && account ? (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                    <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getRoleColor(UserRole.EMPLOYEE))}>
                      {getRoleLabel(UserRole.EMPLOYEE)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleDisconnect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    handleConnect();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 