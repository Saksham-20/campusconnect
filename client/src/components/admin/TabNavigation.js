// client/src/components/admin/TabNavigation.js
import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.icon && <tab.icon className="inline-block h-5 w-5 mr-2" />}
            {tab.label}
            {tab.badge && (
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;


