// client/src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'medium', variant = 'default', className = '', text = '', color = 'primary' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white'
  };

  const getColorClass = () => colorClasses[color] || colorClasses.primary;

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={`w-2 h-2 ${getColorClass().replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-2 h-2 ${getColorClass().replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-2 h-2 ${getColorClass().replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} ${getColorClass().replace('text-', 'bg-')} rounded-full animate-pulse shadow-lg`}></div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            <div className={`w-1 ${getColorClass().replace('text-', 'bg-')} rounded-full animate-pulse`} style={{ height: '16px', animationDelay: '0ms' }}></div>
            <div className={`w-1 ${getColorClass().replace('text-', 'bg-')} rounded-full animate-pulse`} style={{ height: '20px', animationDelay: '150ms' }}></div>
            <div className={`w-1 ${getColorClass().replace('text-', 'bg-')} rounded-full animate-pulse`} style={{ height: '24px', animationDelay: '300ms' }}></div>
            <div className={`w-1 ${getColorClass().replace('text-', 'bg-')} rounded-full animate-pulse`} style={{ height: '20px', animationDelay: '450ms' }}></div>
            <div className={`w-1 ${getColorClass().replace('text-', 'bg-')} rounded-full animate-pulse`} style={{ height: '16px', animationDelay: '600ms' }}></div>
          </div>
        );
      
      case 'ring':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 opacity-25"></div>
            <div className={`absolute inset-0 rounded-full border-4 border-transparent ${getColorClass().replace('text-', 'border-t-')} animate-spin`}></div>
          </div>
        );
      
      case 'gradient':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-spin shadow-lg`} style={{ 
            background: color === 'primary' ? 'linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6)' : undefined,
            backgroundSize: '200% 200%',
            animation: 'spin 1s linear infinite, gradient-shift 3s ease-in-out infinite'
          }}></div>
        );

      case 'ripple':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className={`absolute inset-0 rounded-full border-2 ${getColorClass().replace('text-', 'border-')} opacity-75 animate-ping`}></div>
            <div className={`absolute inset-2 rounded-full border-2 ${getColorClass().replace('text-', 'border-')} opacity-50 animate-ping`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`absolute inset-4 rounded-full ${getColorClass().replace('text-', 'bg-')} opacity-75`}></div>
          </div>
        );

      case 'orbit':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className={`absolute inset-0 rounded-full border-2 border-gray-200 opacity-25`}></div>
            <div className={`absolute w-2 h-2 ${getColorClass().replace('text-', 'bg-')} rounded-full animate-spin`} 
                 style={{ 
                   top: '2px', 
                   left: '50%', 
                   marginLeft: '-4px',
                   transformOrigin: `4px ${parseInt(sizeClasses[size].split(' ')[0].replace('h-', '')) * 4 / 2 - 4}px`
                 }}>
            </div>
          </div>
        );

      case 'elastic':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 ${getColorClass().replace('text-', 'bg-')} rounded-full`}
                style={{
                  animation: `elastic 1.4s ease-in-out infinite both`,
                  animationDelay: `${i * 0.16}s`
                }}
              ></div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full border-3 border-gray-200 opacity-25"></div>
            <div className={`absolute inset-0 rounded-full border-3 border-transparent ${getColorClass().replace('text-', 'border-t-')} animate-spin`}></div>
            <div className={`absolute inset-0 rounded-full border-3 border-transparent ${getColorClass().replace('text-', 'border-r-')} animate-spin opacity-75`} 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col justify-center items-center space-y-3 ${className}`}>
      <div className="relative">
        {renderSpinner()}
      </div>
      {text && (
        <div className={`text-sm ${getColorClass()} font-medium animate-pulse`}>
          {text}
        </div>
      )}
      
      {/* Add custom keyframes styles */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes elastic {
          0%, 40%, 100% { 
            transform: scaleY(0.4);
            opacity: 0.5;
          }
          20% { 
            transform: scaleY(1.0);
            opacity: 1;
          }
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;