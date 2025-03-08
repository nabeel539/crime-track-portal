
import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  // Check system preference for dark mode
  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModePreference.matches);
    
    const handleChange = (e) => setIsDark(e.matches);
    darkModePreference.addEventListener('change', handleChange);
    
    return () => darkModePreference.removeEventListener('change', handleChange);
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Close mobile menu when clicking a link
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };
  
  return (
    <nav className="w-full backdrop-blur-lg bg-white/70 dark:bg-crime-900/70 border-b border-crime-100 dark:border-crime-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo size="md" />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-crime-600 hover:text-primary dark:text-crime-300 dark:hover:text-white font-medium transition-colors duration-300"
            onClick={handleNavClick}
          >
            Home
          </Link>
          
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className="text-crime-600 hover:text-primary dark:text-crime-300 dark:hover:text-white font-medium transition-colors duration-300"
              onClick={handleNavClick}
            >
              Dashboard
            </Link>
          )}
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-crime-100 dark:hover:bg-crime-800 transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-crime-600 dark:text-crime-300" />
            ) : (
              <Moon className="w-5 h-5 text-crime-600" />
            )}
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-crime-800 dark:text-white">
                  {user?.name}
                </span>
                <span className="text-xs text-crime-500 dark:text-crime-400 capitalize">
                  {user?.role}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn-outline flex items-center gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/" 
              className="btn-primary"
              onClick={handleNavClick}
            >
              Login
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-crime-100 dark:hover:bg-crime-800 transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-crime-600 dark:text-crime-300" />
            ) : (
              <Moon className="w-5 h-5 text-crime-600" />
            )}
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-crime-100 dark:hover:bg-crime-800 transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-crime-600 dark:text-crime-300" />
            ) : (
              <Menu className="w-6 h-6 text-crime-600 dark:text-crime-300" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-crime-900 border-t border-crime-100 dark:border-crime-800 animate-slide-in-down">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="px-4 py-2 hover:bg-crime-100 dark:hover:bg-crime-800 rounded-lg transition-colors duration-300"
              onClick={handleNavClick}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 hover:bg-crime-100 dark:hover:bg-crime-800 rounded-lg transition-colors duration-300"
                onClick={handleNavClick}
              >
                Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="border-t border-crime-100 dark:border-crime-800 pt-4 mt-4">
                <div className="px-4 mb-3">
                  <div className="text-sm font-medium text-crime-800 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-crime-500 dark:text-crime-400 capitalize">
                    {user?.role}
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/" 
                className="btn-primary mx-4 text-center"
                onClick={handleNavClick}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
