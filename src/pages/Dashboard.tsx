
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Files, 
  FilePlus2, 
  PieChart, 
  Search, 
  ShieldAlert, 
  Users, 
  Calendar,
  Shield,
  FileText,
  ClipboardCheck,
  UserSearch
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import DataDisplay from '@/components/ui/DataDisplay';
import { toast } from 'sonner';

// Mock data for the dashboard
const MOCK_CASES = [
  { id: '1', caseNumber: 'CR-2023-0001', type: 'Theft', status: 'Open', dateReported: '2023-04-15', assignedTo: 'John Doe' },
  { id: '2', caseNumber: 'CR-2023-0002', type: 'Assault', status: 'Under Investigation', dateReported: '2023-04-17', assignedTo: 'Jane Smith' },
  { id: '3', caseNumber: 'CR-2023-0003', type: 'Vandalism', status: 'Closed', dateReported: '2023-04-10', assignedTo: 'John Doe' },
  { id: '4', caseNumber: 'CR-2023-0004', type: 'Burglary', status: 'Open', dateReported: '2023-04-22', assignedTo: 'Jane Smith' },
  { id: '5', caseNumber: 'CR-2023-0005', type: 'Fraud', status: 'Under Investigation', dateReported: '2023-04-05', assignedTo: 'Michael Johnson' },
  { id: '6', caseNumber: 'CR-2023-0006', type: 'Robbery', status: 'Open', dateReported: '2023-04-28', assignedTo: 'Sarah Williams' },
  { id: '7', caseNumber: 'CR-2023-0007', type: 'Drug Possession', status: 'Under Investigation', dateReported: '2023-04-11', assignedTo: 'Michael Johnson' },
  { id: '8', caseNumber: 'CR-2023-0008', type: 'Assault', status: 'Closed', dateReported: '2023-04-03', assignedTo: 'Sarah Williams' },
  { id: '9', caseNumber: 'CR-2023-0009', type: 'Theft', status: 'Open', dateReported: '2023-04-25', assignedTo: 'John Doe' },
  { id: '10', caseNumber: 'CR-2023-0010', type: 'Vandalism', status: 'Closed', dateReported: '2023-04-08', assignedTo: 'Jane Smith' },
];

// Helper function to generate stats based on user role
const generateStatsByRole = (role: string) => {
  const commonStats = [
    { title: 'Total Cases', value: '137', icon: Files, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { title: 'Open Cases', value: '42', icon: ShieldAlert, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  ];
  
  if (role === 'admin') {
    return [
      ...commonStats,
      { title: 'Officers', value: '15', icon: Users, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
      { title: 'Reports', value: '358', icon: BarChart3, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
    ];
  } else if (role === 'investigator') {
    return [
      ...commonStats,
      { title: 'Assigned', value: '28', icon: ClipboardCheck, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
      { title: 'Evidence Files', value: '217', icon: FileText, color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
    ];
  }
  
  // Default for officer
  return [
    ...commonStats,
    { title: 'Filed Today', value: '3', icon: FilePlus2, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
    { title: 'Pending Review', value: '12', icon: Search, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  ];
};

// Quick actions based on role
const getQuickActions = (role: string) => {
  const commonActions = [
    { title: 'Search Cases', icon: Search, action: () => toast.info('Search Cases functionality would open here') },
    { title: 'View Calendar', icon: Calendar, action: () => toast.info('Calendar view would open here') },
  ];
  
  if (role === 'admin') {
    return [
      { title: 'New User', icon: Users, action: () => toast.info('Add new user form would open here') },
      { title: 'Generate Report', icon: BarChart3, action: () => toast.info('Report generator would open here') },
      ...commonActions,
      { title: 'System Log', icon: Shield, action: () => toast.info('System logs would appear here') },
    ];
  } else if (role === 'investigator') {
    return [
      { title: 'Manage Cases', icon: ClipboardCheck, action: () => toast.info('Case management would open here') },
      { title: 'Officer Lookup', icon: UserSearch, action: () => toast.info('Officer directory would open here') },
      ...commonActions,
    ];
  }
  
  // Default for officer
  return [
    { title: 'New Report', icon: FilePlus2, action: () => toast.info('New report form would open here') },
    ...commonActions,
    { title: 'Upload Evidence', icon: FileText, action: () => toast.info('Evidence upload form would open here') },
  ];
};

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check if user is authenticated
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      setIsLoading(false);
      
      if (!isAuth) {
        navigate('/');
      }
    };
    
    verifyAuth();
  }, [checkAuth, navigate]);
  
  // Get stats based on user role
  const stats = user ? generateStatsByRole(user.role) : [];
  
  // Get quick actions based on user role
  const quickActions = user ? getQuickActions(user.role) : [];
  
  // Columns for the case data table
  const caseColumns = [
    { header: 'Case Number', accessor: 'caseNumber' as const },
    { header: 'Type', accessor: 'type' as const },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      render: (value: string) => {
        let color = '';
        switch (value) {
          case 'Open':
            color = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            break;
          case 'Under Investigation':
            color = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            break;
          case 'Closed':
            color = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            break;
          default:
            color = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {value}
          </span>
        );
      }
    },
    { header: 'Date Reported', accessor: 'dateReported' as const },
    { header: 'Assigned To', accessor: 'assignedTo' as const },
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-crime-50 dark:bg-crime-900 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-crime-800 dark:text-white">
              Welcome, {user?.name}
            </h1>
            <p className="text-crime-500 dark:text-crime-400">
              {
                user?.role === 'admin' 
                  ? 'Administrative Dashboard' 
                  : user?.role === 'investigator'
                    ? 'Investigator Dashboard'
                    : 'Officer Dashboard'
              }
            </p>
          </div>
        </header>
        
        {/* Stats Overview */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="glass-panel glass-card-hover p-6 flex items-center justify-between"
                style={{ animationDelay: `${index * 50 + 200}ms` }}
              >
                <div>
                  <p className="text-sm font-medium text-crime-500 dark:text-crime-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-crime-800 dark:text-white mt-1">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Quick Actions */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '250ms' }}>
          <h2 className="text-xl font-semibold text-crime-800 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="glass-panel glass-card-hover p-4 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 50 + 300}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-crime-700 dark:text-crime-300">{action.title}</span>
              </button>
            ))}
          </div>
        </section>
        
        {/* Recent Cases */}
        <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h2 className="text-xl font-semibold text-crime-800 dark:text-white mb-4">Recent Cases</h2>
          <DataDisplay 
            data={MOCK_CASES}
            columns={caseColumns}
            itemsPerPage={5}
            emptyMessage="No cases to display"
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
