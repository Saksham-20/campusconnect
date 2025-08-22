// client/src/pages/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import statisticsService from '../../services/statistics';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: {},
    organizations: {},
    jobs: {},
    applications: {},
    placements: {},
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await statisticsService.getAdminStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-100',
      closed: 'text-red-600 bg-red-100',
      draft: 'text-yellow-600 bg-yellow-100',
      pending: 'text-blue-600 bg-blue-100',
      approved: 'text-green-600 bg-green-100',
      rejected: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: CheckCircleIcon,
      closed: XCircleIcon,
      draft: ExclamationTriangleIcon,
      pending: ClockIcon,
      approved: CheckCircleIcon,
      rejected: XCircleIcon
    };
    return icons[status] || ClockIcon;
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
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System overview and comprehensive analytics
          </p>
        </div>

        {/* Main Stats Grid */}
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
                    <dd className="text-2xl font-bold text-gray-900">{stats.users.total || 0}</dd>
                    <dd className="text-sm text-gray-500">
                      +{stats.users.recentRegistrations || 0} this month
                    </dd>
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
                    <dd className="text-2xl font-bold text-gray-900">{stats.organizations.total || 0}</dd>
                    <dd className="text-sm text-gray-500">
                      Universities & Companies
                    </dd>
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
                    <dd className="text-2xl font-bold text-gray-900">{stats.jobs.total || 0}</dd>
                    <dd className="text-sm text-gray-500">
                      +{stats.jobs.recentPostings || 0} this week
                    </dd>
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
                    <dd className="text-2xl font-bold text-gray-900">{stats.applications.total || 0}</dd>
                    <dd className="text-sm text-gray-500">
                      Total submissions
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Statistics */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <UsersIcon className="h-5 w-5 text-blue-600 mr-2" />
                User Distribution
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.users.byRole?.map((roleStat) => (
                  <div key={roleStat.role} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {roleStat.role}
                    </span>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-900 mr-3">
                        {roleStat.count}
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(roleStat.count / stats.users.total) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Statistics */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <BriefcaseIcon className="h-5 w-5 text-purple-600 mr-2" />
                Job Status Distribution
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.jobs.byStatus?.map((jobStat) => {
                  const IconComponent = getStatusIcon(jobStat.status);
                  return (
                    <div key={jobStat.status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent className={`h-4 w-4 mr-2 ${getStatusColor(jobStat.status).split(' ')[0]}`} />
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {jobStat.status}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900 mr-3">
                          {jobStat.count}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(jobStat.count / stats.jobs.total) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
              Recent Activity (Last 7 Days)
            </h2>
          </div>
          <div className="p-6">
            {stats.recentActivity?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.student?.firstName} {activity.student?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Applied to {activity.job?.title} at {activity.job?.organization?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Applications and activities will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Management Links */}
        <div className="bg-white shadow rounded-lg mt-8">
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