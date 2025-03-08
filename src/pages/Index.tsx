
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BarChart3, ClipboardCheck, Search, UserCheck, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import LoginForm from '@/components/auth/LoginForm';

const Index: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        navigate('/dashboard');
      }
    };
    
    verifyAuth();
  }, [checkAuth, navigate]);
  
  return (
    <div className="min-h-screen bg-crime-50 dark:bg-crime-900 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col lg:flex-row items-center">
          {/* Hero Section */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12 animate-fade-in">
            <div className="mb-6 inline-flex items-center py-1 px-3 text-sm font-medium rounded-full bg-primary/10 text-primary">
              <Shield className="w-4 h-4 mr-1.5" />
              Crime Record Management System
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-crime-800 dark:text-white mb-4 leading-tight">
              Modern crime recording for <span className="text-gradient">law enforcement</span>
            </h1>
            
            <p className="text-lg text-crime-600 dark:text-crime-300 mb-8 leading-relaxed">
              Transform how your agency manages crime data with our centralized digital platform. 
              Replace paper-based systems with efficient digital workflows designed for law enforcement.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: UserCheck, title: 'Role-Based Access', desc: 'Tailored interfaces for officers, investigators, and administrators' },
                { icon: Search, title: 'Advanced Search', desc: 'Quickly find cases with powerful search and filtering' },
                { icon: ClipboardCheck, title: 'Case Management', desc: 'Track cases, update progress, and assign officers' },
                { icon: BarChart3, title: 'Analytics', desc: 'Generate insights with crime statistics and trends' },
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mt-1 mr-3 p-2 rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-crime-800 dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-crime-500 dark:text-crime-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Login Form */}
          <div className="w-full lg:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="w-full max-w-md relative">
              <div className="absolute -z-10 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
              <LoginForm />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-crime-500 dark:text-crime-400 flex items-center justify-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Secure, encrypted connection
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-white dark:bg-crime-800 border-t border-crime-100 dark:border-crime-700">
        <div className="container mx-auto px-4 text-center text-sm text-crime-500 dark:text-crime-400">
          <p>© 2023 Crime Record Management System | Proof of Concept</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
