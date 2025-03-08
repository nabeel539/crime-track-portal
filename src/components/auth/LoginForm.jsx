import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the login function
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sample credentials for demo purposes
  const sampleCredentials = [
    { role: 'Officer', email: 'officer@crms.com', password: 'password123' },
    { role: 'Investigator', email: 'investigator@crms.com', password: 'password123' },
    { role: 'Admin', email: 'admin@crms.com', password: 'password123' },
  ];
  
  const fillCredentials = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="w-full max-w-md mx-auto glass-panel p-8 animate-scale-in">
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-crime-800 dark:text-white mb-1">Welcome Back</h2>
        <p className="text-crime-500 dark:text-crime-400">Log in to your CRMS account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-crime-700 dark:text-crime-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-crime-700 dark:text-crime-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="input-field pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-crime-500 hover:text-crime-700 dark:text-crime-400 dark:hover:text-crime-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <div>
          <button 
            type="submit" 
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Login <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-8 pt-6 border-t border-crime-100 dark:border-crime-700/30">
        <p className="text-sm text-crime-500 dark:text-crime-400 mb-3 text-center">
          Sample accounts for testing:
        </p>
        <div className="grid gap-2">
          {sampleCredentials.map((cred, index) => (
            <div 
              key={index}
              className="text-xs p-2 bg-crime-50 dark:bg-crime-800/50 rounded-lg border border-crime-100 dark:border-crime-700/30"
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium text-crime-700 dark:text-crime-300">{cred.role}</span>
                <button
                  onClick={() => fillCredentials(cred.email, cred.password)}
                  className="text-primary text-xs hover:underline"
                >
                  Use
                </button>
              </div>
              <div className="text-crime-500 dark:text-crime-400 truncate">{cred.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
