
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCrimeStore } from '@/store/crimeStore';
import {
  UserCircle2,
  LayoutDashboard,
  FileText,
  BarChart3,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Users,
  Activity,
  Calendar,
  Clock,
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
} from 'lucide-react';
import CaseManagement from './CaseManagement';
import CaseDetail from './CaseDetail';
import Analytics from './Analytics';
import Logo from '@/components/layout/Logo';
import CrimeReportForm from '@/components/crime/CrimeReportForm';

// Main Dashboard Layout Component
const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-crime-50 dark:bg-crime-900">
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 bg-white dark:bg-crime-800 border-r border-crime-100 dark:border-crime-700 shadow-sm`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-crime-100 dark:border-crime-700">
            <Logo />
            <button 
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-crime-500 hover:bg-crime-100 dark:text-crime-400 dark:hover:bg-crime-700 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-y-auto px-3 py-4 flex-grow">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard" 
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-crime-900 hover:bg-crime-100 group dark:text-white dark:hover:bg-crime-700"
                >
                  <LayoutDashboard className="w-5 h-5 mr-2.5 text-crime-500 dark:text-crime-400" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard/cases" 
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-crime-900 hover:bg-crime-100 group dark:text-white dark:hover:bg-crime-700"
                >
                  <FileText className="w-5 h-5 mr-2.5 text-crime-500 dark:text-crime-400" />
                  Case Management
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard/analytics" 
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-crime-900 hover:bg-crime-100 group dark:text-white dark:hover:bg-crime-700"
                >
                  <BarChart3 className="w-5 h-5 mr-2.5 text-crime-500 dark:text-crime-400" />
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="px-3 py-3 border-t border-crime-100 dark:border-crime-700">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-2.5">
                <UserCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-crime-900 dark:text-crime-100">
                  {user?.name || 'User Name'}
                </div>
                <div className="text-xs text-crime-500 dark:text-crime-400 capitalize">
                  {user?.role || 'Role'}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 mt-3 text-sm font-medium rounded-lg text-crime-600 hover:bg-crime-100 hover:text-crime-900 dark:text-crime-300 dark:hover:bg-crime-700 dark:hover:text-white"
            >
              <LogOut className="w-5 h-5 mr-2.5" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-crime-800/50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white dark:bg-crime-800 border-b border-crime-100 dark:border-crime-700 shadow-sm">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="p-1.5 mr-2 rounded-lg text-crime-500 hover:bg-crime-100 dark:text-crime-400 dark:hover:bg-crime-700 md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-crime-900 dark:text-white">
                CRMS Dashboard
              </h1>
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <main className="p-4">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="cases" element={<CaseManagement />} />
            <Route path="cases/:caseId" element={<CaseDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="report-crime" element={<CrimeReportForm />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const { user } = useAuthStore();
  const { crimeReports } = useCrimeStore();
  const navigate = useNavigate();
  
  // Filter reports by status
  const openCases = crimeReports.filter(report => report.status === 'open');
  const investigatingCases = crimeReports.filter(report => report.status === 'investigating');
  const closedCases = crimeReports.filter(report => report.status === 'closed');
  
  // Get recent cases
  const recentCases = [...crimeReports].sort((a, b) => {
    return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
  }).slice(0, 5);
  
  // Determine user role for UI
  const isOfficer = user?.role === 'officer';
  const isInvestigator = user?.role === 'investigator';
  const isAdmin = user?.role === 'admin';
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-crime-800 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="text-crime-500 dark:text-crime-400">
            Here's what's happening with your cases today.
          </p>
        </div>
        
        {isOfficer && (
          <button 
            onClick={() => navigate('/dashboard/report-crime')}
            className="btn-primary mt-4 sm:mt-0"
          >
            Report New Crime
          </button>
        )}
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-crime-500 dark:text-crime-400 text-sm">Total Cases</p>
              <h3 className="text-2xl font-bold text-crime-800 dark:text-white mt-1">
                {crimeReports.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Activity className="w-4 h-4 mr-1 text-crime-500 dark:text-crime-400" />
            <span className="text-crime-500 dark:text-crime-400">Overall activity</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-crime-500 dark:text-crime-400 text-sm">Open Cases</p>
              <h3 className="text-2xl font-bold text-crime-800 dark:text-white mt-1">
                {openCases.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1 text-crime-500 dark:text-crime-400" />
            <span className="text-crime-500 dark:text-crime-400">Waiting for assignment</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-crime-500 dark:text-crime-400 text-sm">Investigating</p>
              <h3 className="text-2xl font-bold text-crime-800 dark:text-white mt-1">
                {investigatingCases.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <BriefcaseBusiness className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Users className="w-4 h-4 mr-1 text-crime-500 dark:text-crime-400" />
            <span className="text-crime-500 dark:text-crime-400">Active investigations</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-crime-500 dark:text-crime-400 text-sm">Closed Cases</p>
              <h3 className="text-2xl font-bold text-crime-800 dark:text-white mt-1">
                {closedCases.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-1 text-crime-500 dark:text-crime-400" />
            <span className="text-crime-500 dark:text-crime-400">Completed</span>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700">
        <div className="px-6 py-4 border-b border-crime-100 dark:border-crime-700">
          <h2 className="text-lg font-semibold text-crime-800 dark:text-white">Recent Cases</h2>
        </div>
        <div className="divide-y divide-crime-100 dark:divide-crime-700">
          {recentCases.map(report => (
            <div key={report.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-crime-800 dark:text-white">
                    {report.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <div className={`
                      w-2 h-2 rounded-full mr-2
                      ${report.status === 'open' ? 'bg-yellow-500' : ''}
                      ${report.status === 'investigating' ? 'bg-blue-500' : ''}
                      ${report.status === 'closed' ? 'bg-green-500' : ''}
                    `}></div>
                    <span className="text-xs text-crime-500 dark:text-crime-400 capitalize">{report.status}</span>
                    <span className="mx-2 text-crime-300 dark:text-crime-600">•</span>
                    <span className="text-xs text-crime-500 dark:text-crime-400">{formatDate(report.reportedAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/dashboard/cases/${report.id}`)}
                  className="btn-outline btn-sm flex items-center"
                >
                  View
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
          
          {recentCases.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-crime-500 dark:text-crime-400">No cases to display</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-crime-100 dark:border-crime-700">
          <button
            onClick={() => navigate('/dashboard/cases')}
            className="text-primary hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center"
          >
            View all cases
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      
      {/* Role-specific content can be added here */}
    </div>
  );
};

export default Dashboard;
