
import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  Home, 
  FileText, 
  BarChart3, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X, 
  Shield,
  User,
  Settings,
  Bell
} from 'lucide-react';
import Logo from '@/components/layout/Logo';
import CaseManagement from './CaseManagement';
import CrimeReportForm from '@/components/crime/CrimeReportForm';
import CaseDetail from './CaseDetail';
import Analytics from './Analytics';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // Check if the user is authenticated
  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        navigate('/');
      }
      setInitialized(true);
    };
    
    init();
  }, [checkAuth, navigate]);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Role-based navigation
  const isOfficer = user?.role === 'officer';
  const isInvestigator = user?.role === 'investigator';
  const isAdmin = user?.role === 'admin';
  
  // Navigation items based on role
  const navItems = [
    { name: 'Overview', icon: Home, path: '/dashboard', roles: ['officer', 'investigator', 'admin'] },
    { name: 'Cases', icon: FileText, path: '/dashboard/cases', roles: ['officer', 'investigator', 'admin'] },
    { name: 'Report Crime', icon: Shield, path: '/dashboard/report-crime', roles: ['officer', 'admin'] },
    { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics', roles: ['investigator', 'admin'] },
  ].filter(item => item.roles.includes(user?.role || ''));
  
  // Function to determine if a nav item is active
  const isActive = (path) => {
    const currentPath = window.location.pathname;
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };
  
  // Dashboard overview content - quick stats and shortcuts
  const DashboardOverview = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-crime-800 dark:text-white mb-6">Welcome, {user?.name}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
            <h2 className="text-lg font-semibold text-crime-800 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isOfficer && (
                <button 
                  onClick={() => navigate('/dashboard/report-crime')}
                  className="p-4 rounded-lg border border-crime-100 dark:border-crime-700 hover:bg-crime-50 dark:hover:bg-crime-700/50 transition-colors duration-150 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-crime-800 dark:text-white mb-1">Report New Crime</h3>
                      <p className="text-sm text-crime-500 dark:text-crime-400">File a new crime report</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-crime-400" />
                </button>
              )}
              
              <button 
                onClick={() => navigate('/dashboard/cases')}
                className="p-4 rounded-lg border border-crime-100 dark:border-crime-700 hover:bg-crime-50 dark:hover:bg-crime-700/50 transition-colors duration-150 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-crime-800 dark:text-white mb-1">Manage Cases</h3>
                    <p className="text-sm text-crime-500 dark:text-crime-400">View and update crime cases</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-crime-400" />
              </button>
              
              {(isInvestigator || isAdmin) && (
                <button 
                  onClick={() => navigate('/dashboard/analytics')}
                  className="p-4 rounded-lg border border-crime-100 dark:border-crime-700 hover:bg-crime-50 dark:hover:bg-crime-700/50 transition-colors duration-150 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-crime-800 dark:text-white mb-1">View Analytics</h3>
                      <p className="text-sm text-crime-500 dark:text-crime-400">Crime statistics and insights</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-crime-400" />
                </button>
              )}
              
              <button 
                onClick={() => {
                  toast.info('This feature will be available in a future update');
                }}
                className="p-4 rounded-lg border border-crime-100 dark:border-crime-700 hover:bg-crime-50 dark:hover:bg-crime-700/50 transition-colors duration-150 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-crime-800 dark:text-white mb-1">My Profile</h3>
                    <p className="text-sm text-crime-500 dark:text-crime-400">Update personal information</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-crime-400" />
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
            <h2 className="text-lg font-semibold text-crime-800 dark:text-white mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mr-3 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">System Online</h3>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80">All services are running normally</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-crime-500 dark:text-crime-400">Database Status</span>
                  <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                </div>
                <div className="w-full h-2 bg-crime-100 dark:bg-crime-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-crime-500 dark:text-crime-400">User Session</span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">Active</span>
                </div>
                <div className="w-full h-2 bg-crime-100 dark:bg-crime-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="pt-4 mt-4 border-t border-crime-100 dark:border-crime-700">
                <h3 className="font-medium text-crime-800 dark:text-white mb-3">Your Account</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 text-xl font-semibold">
                    {user?.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-crime-800 dark:text-white">{user?.name}</div>
                    <div className="text-sm text-crime-500 dark:text-crime-400 flex items-center">
                      <span className="capitalize mr-2">{user?.role}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-crime-800 dark:text-white">System Updates</h2>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start p-3 rounded-lg hover:bg-crime-50 dark:hover:bg-crime-700/30 transition-colors duration-150">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-crime-800 dark:text-white mb-1">System Update Complete</div>
                <p className="text-sm text-crime-500 dark:text-crime-400 mb-1">The system has been updated to version 1.2 with new features.</p>
                <div className="text-xs text-crime-400 dark:text-crime-500">2 hours ago</div>
              </div>
            </div>
            
            <div className="flex items-start p-3 rounded-lg hover:bg-crime-50 dark:hover:bg-crime-700/30 transition-colors duration-150">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3 mt-0.5">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-crime-800 dark:text-white mb-1">Maintenance Scheduled</div>
                <p className="text-sm text-crime-500 dark:text-crime-400 mb-1">Scheduled maintenance on Sunday, 10 PM - 2 AM. The system may be temporarily unavailable.</p>
                <div className="text-xs text-crime-400 dark:text-crime-500">1 day ago</div>
              </div>
            </div>
            
            <div className="flex items-start p-3 rounded-lg hover:bg-crime-50 dark:hover:bg-crime-700/30 transition-colors duration-150">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mr-3 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-crime-800 dark:text-white mb-1">New Feature: Evidence Management</div>
                <p className="text-sm text-crime-500 dark:text-crime-400 mb-1">Secure evidence upload and management coming in the next update.</p>
                <div className="text-xs text-crime-400 dark:text-crime-500">3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (!initialized) {
    return (
      <div className="min-h-screen bg-crime-50 dark:bg-crime-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // The useEffect will redirect to login
  }

  return (
    <div className="flex h-screen bg-crime-50 dark:bg-crime-900">
      {/* Sidebar for desktop */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
        bg-white dark:bg-crime-800 border-r border-crime-100 dark:border-crime-700 shadow-sm
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-crime-100 dark:border-crime-700 flex items-center justify-between">
            <Logo size="md" />
            <button 
              className="lg:hidden p-2 rounded-lg text-crime-500 hover:bg-crime-100 dark:hover:bg-crime-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 text-lg font-semibold">
                {user?.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-crime-800 dark:text-white">{user?.name}</div>
                <div className="text-sm text-crime-500 dark:text-crime-400 capitalize">{user?.role}</div>
              </div>
            </div>
          </div>
          
          <nav className="mt-4 flex-grow">
            <div className="px-3 mb-2 text-xs font-semibold text-crime-400 dark:text-crime-500 uppercase tracking-wider">
              Main
            </div>
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button 
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full px-3 py-2 flex items-center rounded-lg text-sm font-medium transition-colors duration-150
                      ${isActive(item.path) 
                        ? 'bg-primary text-white' 
                        : 'text-crime-600 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 px-3 mb-2 text-xs font-semibold text-crime-400 dark:text-crime-500 uppercase tracking-wider">
              Account
            </div>
            <ul className="space-y-1 px-2">
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full px-3 py-2 flex items-center rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-crime-100 dark:border-crime-700 text-xs text-crime-400 dark:text-crime-500">
            CRMS v1.0.0 - Phase 2
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white dark:bg-crime-800 border-b border-crime-100 dark:border-crime-700 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="lg:hidden p-2 rounded-lg text-crime-500 hover:bg-crime-100 dark:hover:bg-crime-700 mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-crime-800 dark:text-white">
                Crime Record Management System
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 rounded-full text-crime-500 hover:bg-crime-100 dark:hover:bg-crime-700 relative"
                onClick={() => toast.info('Notifications feature coming soon')}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
              
              <button 
                className="p-2 rounded-full text-crime-500 hover:bg-crime-100 dark:hover:bg-crime-700"
                onClick={() => toast.info('Settings feature coming soon')}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/cases" element={<CaseManagement />} />
            <Route path="/report-crime" element={<CrimeReportForm />} />
            <Route path="/case/:caseId" element={<CaseDetail />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-crime-800/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
