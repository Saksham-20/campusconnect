// client/src/components/admin/ChartCard.js
import React from 'react';

const ChartCard = ({ title, children, actions, className = '' }) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;


