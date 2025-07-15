import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import AppWrapper from './components/AppWrapper';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import EmployeeManagement from './components/Employees/EmployeeManagement';
import PayrollManagement from './components/Payroll/PayrollManagement';
import Profile from './components/Profile/Profile';
import { PayrollExample } from './components/PayrollExample';
import './index.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppWrapper>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeManagement />} />
                <Route path="/payroll" element={<PayrollManagement />} />
                <Route path="/payroll-example" element={<PayrollExample />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AppWrapper>
    </ThemeProvider>
  );
};

export default App; 