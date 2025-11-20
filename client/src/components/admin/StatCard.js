// client/src/components/admin/StatCard.js
import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${colorClasses[color]}`}>
            {Icon && <Icon className="h-6 w-6" />}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl font-bold text-gray-900">{value || 0}</dd>
              {subtitle && (
                <dd className="text-sm text-gray-500">{subtitle}</dd>
              )}
              {trend && trendValue && (
                <dd className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trend === 'up' ? '↑' : '↓'} {trendValue}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;


