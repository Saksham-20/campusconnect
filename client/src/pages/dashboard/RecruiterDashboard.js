// client/src/pages/dashboard/RecruiterDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  BriefcaseIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    jobs: [],
    recentApplications: [],
    upcomingEvents: [],
    stats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      shortlistedCandidates: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [jobsRes, applicationsRes, eventsRes, statsRes] = await Promise.all([
        api.get('/jobs?limit=5&organizationId=' + user.organizationId),
        api.get('/applications?limit=5'),
        api.get('/events?upcoming=true&limit=3&organizationId=' + user.organizationId),
        api.get('/jobs/stats?organizationId=' + user.organizationId)
      ]);

      setDashboardData({
        jobs: jobsRes.jobs || [],
        recentApplications: applicationsRes.applications || [],
        upcomingEvents: eventsRes.events || [],
        stats: {
          totalJobs: statsRes.stats?.jobsByStatus?.reduce((sum, stat) => sum + parseInt(stat.count), 0) || 0,
          activeJobs: statsRes.stats?.jobsByStatus?.find(s => s.status === 'active')?.count || 0,
          totalApplications: statsRes.stats?.totalApplications || 0,
          shortlistedCandidates: applicationsRes.applications?.filter(app => 
            ['shortlisted', 'interviewed'].includes(app.status)
          ).length || 0
        }
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'text-blue-600 bg-blue-100',
      screening: 'text-yellow-600 bg-yellow-100',
      shortlisted: 'text-purple-600 bg-purple-100',
      interviewed: 'text-orange-600 bg-orange-100',
      selected: 'text-green-600 bg-green-100',
      rejected: 'text-red-600 bg-red-100',
      withdrawn: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getJobStatusColor = (status) => {
    const colors = {
      draft: 'text-gray-600 bg-gray-100',
      active: 'text-green-600 bg-green-100',
      closed: 'text-red-600 bg-red-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue", change }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
              {change && (
                <dd className="text-sm text-gray-600">{change}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Manage your job postings and track applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Jobs Posted"
            value={dashboardData.stats.totalJobs}
            icon={BriefcaseIcon}
            color="blue"
          />
          <StatCard
            title="Active Jobs"
            value={dashboardData.stats.activeJobs}
            icon={ChartBarIcon}
            color="green"
          />
          <StatCard
            title="Total Applications"
            value={dashboardData.stats.totalApplications}
            icon={DocumentTextIcon}
            color="purple"
          />
          <StatCard
            title="Shortlisted Candidates"
            value={dashboardData.stats.shortlistedCandidates}
            icon={UserGroupIcon}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Job Postings</h2>
                  <Link
                    to="/jobs/new"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Post Job
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {dashboardData.jobs.length > 0 ? (
                  dashboardData.jobs.map((job) => (
                    <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {job.location} • {job.jobType.replace('_', ' ')}
                          </p>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {job.applicationCount || 0} applications
                            </span>
                            <span className="text-xs text-gray-500">
                              Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs posted yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start by posting your first job opening to attract qualified candidates.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/jobs/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Post Your First Job
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {dashboardData.jobs.length > 0 && (
                <div className="px-6 py-3 bg-gray-50">
                  <Link
                    to="/jobs"
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    View all jobs →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Applications */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {dashboardData.recentApplications.length > 0 ? (
                  dashboardData.recentApplications.slice(0, 5).map((application) => (
                    <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {application.student?.firstName} {application.student?.lastName}
                          </h4>
                          <p className="text-xs text-gray-600 mb-1">
                            Applied for: {application.job?.title}
                          </p>
                          <div className="flex items-center text-xs">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                            <span className="ml-2 text-gray-500">
                              {new Date(application.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Link
                          to={`/applications/${application.id}`}
                          className="text-blue-600 hover:text-blue-500 text-xs font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-center text-sm text-gray-500">
                    No applications yet
                  </div>
                )}
              </div>
              <div className="px-6 py-3 bg-gray-50">
                <Link
                  to="/applications"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View all applications →
                </Link>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {dashboardData.upcomingEvents.length > 0 ? (
                  dashboardData.upcomingEvents.map((event) => (
                    <div key={event.id} className="px-6 py-4 hover:bg-gray-50">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(event.startTime).toLocaleDateString()} at{' '}
                        {new Date(event.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {event.registrationCount || 0} registered
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-center text-sm text-gray-500">
                    No upcoming events
                  </div>
                )}
              </div>
              <div className="px-6 py-3 bg-gray-50">
                <Link
                  to="/events"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View all events →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  to="/jobs/new"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50"
                >
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                  Post New Job
                </Link>
                <Link
                  to="/applications"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50"
                >
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                  Review Applications
                </Link>
                <Link
                  to="/events/new"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50"
                >
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  Schedule Event
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Application Summary */}
        {dashboardData.recentApplications.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Application Pipeline</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { status: 'applied', label: 'Applied', color: 'blue' },
                  { status: 'screening', label: 'Screening', color: 'yellow' },
                  { status: 'shortlisted', label: 'Shortlisted', color: 'purple' },
                  { status: 'interviewed', label: 'Interviewed', color: 'orange' },
                  { status: 'selected', label: 'Selected', color: 'green' },
                  { status: 'rejected', label: 'Rejected', color: 'red' },
                  { status: 'withdrawn', label: 'Withdrawn', color: 'gray' }
                ].map((stage) => {
                  const count = dashboardData.recentApplications.filter(app => app.status === stage.status).length;
                  return (
                    <div key={stage.status} className="text-center">
                      <div className={`text-2xl font-bold text-${stage.color}-600`}>
                        {count}
                      </div>
                      <div className="text-sm text-gray-600">{stage.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;