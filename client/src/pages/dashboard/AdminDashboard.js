// client/src/pages/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizations: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // Fetch admin statistics
      const [usersRes, orgsRes, jobsRes, appsRes] = await Promise.all([
        api.get('/users?limit=1'),
        api.get('/organizations?limit=1'),
        api.get('/jobs?limit=1'),
        api.get('/applications?limit=1')
      ]);

      setStats({
        totalUsers: usersRes.pagination?.totalItems || 0,
        totalOrganizations: orgsRes.pagination?.totalItems || 0,
        totalJobs: jobsRes.pagination?.totalItems || 0,
        totalApplications: appsRes.pagination?.totalItems || 0
      });
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            System overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Organizations</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalOrganizations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BriefcaseIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalJobs}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalApplications}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Links */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">System Management</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/admin/users"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Manage Users</h3>
                    <p className="text-sm text-gray-600">View and manage all users</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/organizations"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Organizations</h3>
                    <p className="text-sm text-gray-600">Manage universities and companies</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/jobs"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <BriefcaseIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Job Postings</h3>
                    <p className="text-sm text-gray-600">Monitor all job postings</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;