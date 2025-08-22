// client/src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'medium', variant = 'default', className = '', text = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}></div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            <div className="w-1 bg-blue-600 animate-pulse" style={{ height: '20px', animationDelay: '0ms' }}></div>
            <div className="w-1 bg-blue-600 animate-pulse" style={{ height: '20px', animationDelay: '150ms' }}></div>
            <div className="w-1 bg-blue-600 animate-pulse" style={{ height: '20px', animationDelay: '300ms' }}></div>
            <div className="w-1 bg-blue-600 animate-pulse" style={{ height: '20px', animationDelay: '450ms' }}></div>
          </div>
        );
      
      case 'ring':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          </div>
        );
      
      case 'gradient':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-spin`}></div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-r-blue-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col justify-center items-center space-y-3 ${className}`}>
      {renderSpinner()}
      {text && (
        <div className="text-sm text-gray-600 font-medium animate-pulse">
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;