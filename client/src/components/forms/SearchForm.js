// ===== client/src/components/forms/SearchForm.js =====
import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchForm = ({ onSearch, onFilterChange, filters = {}, showFilters = false, onToggleFilters }) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [localFilters, setLocalFilters] = useState({
    jobType: filters.jobType || '',
    location: filters.location || '',
    minSalary: filters.minSalary || '',
    maxSalary: filters.maxSalary || '',
    experience: filters.experience || '',
    skills: filters.skills || '',
    ...filters
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ ...localFilters, search: searchQuery });
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      jobType: '',
      location: '',
      minSalary: '',
      maxSalary: '',
      experience: '',
      skills: ''
    };
    setLocalFilters(clearedFilters);
    setSearchQuery('');
    onFilterChange && onFilterChange({ ...clearedFilters, search: '' });
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '') || searchQuery !== '';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search jobs by title, company, or keywords..."
              />
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleFilters}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              showFilters ? 'bg-gray-100' : ''
            }`}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Active
              </span>
            )}
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                value={localFilters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={localFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g. Bangalore, Mumbai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                value={localFilters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Any Experience</option>
                <option value="0">Entry Level (0 years)</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Salary (LPA)
              </label>
              <input
                type="number"
                value={localFilters.minSalary}
                onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g. 6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Salary (LPA)
              </label>
              <input
                type="number"
                value={localFilters.maxSalary}
                onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g. 15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                value={localFilters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g. React, Python, AWS"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
            <span className="text-sm text-gray-500">
              {hasActiveFilters ? 'Filters applied' : 'No filters applied'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;