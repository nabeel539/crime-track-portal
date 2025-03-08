
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = ({ 
  size = 'md', 
  variant = 'default',
  withText = true 
}) => {
  const sizes = {
    sm: {
      icon: 'w-5 h-5',
      text: 'text-lg'
    },
    md: {
      icon: 'w-6 h-6',
      text: 'text-xl'
    },
    lg: {
      icon: 'w-8 h-8',
      text: 'text-2xl'
    }
  };
  
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className={`
        ${variant === 'default' 
          ? 'bg-primary text-primary-foreground p-2 rounded-lg shadow-sm' 
          : 'text-primary'}
        transition-all duration-300 transform group-hover:scale-105
      `}>
        <ShieldCheck className={sizes[size].icon} />
      </div>
      
      {withText && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizes[size].text} leading-none text-crime-800 dark:text-white`}>
            CRMS
          </span>
          <span className="text-xs text-crime-500 dark:text-crime-400 leading-tight">
            Crime Record Management
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
