// client/src/pages/dashboard/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    applications: [],
    recommendedJobs: [],
    upcomingEvents: [],
    stats: {
      totalApplications: 0,
      activeApplications: 0,
      interviewsScheduled: 0,
      offers: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [applicationsRes, jobsRes, eventsRes, statsRes] = await Promise.all([
        api.get('/applications?limit=5'),
        api.get('/jobs/recommended?limit=4'),
        api.get('/events?upcoming=true&limit=3'),
        api.get('/applications/stats')
      ]);

      setDashboardData({
        applications: applicationsRes.applications || [],
        recommendedJobs: jobsRes.jobs || [],
        upcomingEvents: eventsRes.events || [],
        stats: {
          totalApplications: statsRes.stats?.byStatus?.reduce((sum, stat) => sum + parseInt(stat.count), 0) || 0,
          activeApplications: statsRes.stats?.byStatus?.filter(s => 
            ['applied', 'screening', 'shortlisted', 'interviewed'].includes(s.status)
          ).reduce((sum, stat) => sum + parseInt(stat.count), 0) || 0,
          interviewsScheduled: statsRes.stats?.byStatus?.find(s => s.status === 'interviewed')?.count || 0,
          offers: statsRes.stats?.byStatus?.find(s => s.status === 'selected')?.count || 0
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

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
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
            Here's what's happening with your job search
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Applications"
            value={dashboardData.stats.totalApplications}
            icon={DocumentTextIcon}
            color="blue"
          />
          <StatCard
            title="Active Applications"
            value={dashboardData.stats.activeApplications}
            icon={BriefcaseIcon}
            color="green"
          />
          <StatCard
            title="Interviews Scheduled"
            value={dashboardData.stats.interviewsScheduled}
            icon={CalendarIcon}
            color="orange"
          />
          <StatCard
            title="Offers Received"
            value={dashboardData.stats.offers}
            icon={ChartBarIcon}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
                  <Link
                    to="/applications"
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {dashboardData.applications.length > 0 ? (
                  dashboardData.applications.map((application) => (
                    <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {application.job?.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.job?.organization?.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {application.status.replace('_', ' ')}
                          </span>
                          <Link
                            to={`/applications/${application.id}`}
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
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start by browsing available jobs and applying to ones that interest you.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/jobs"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Browse Jobs
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recommended Jobs */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recommended Jobs</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {dashboardData.recommendedJobs.length > 0 ? (
                  dashboardData.recommendedJobs.map((job) => (
                    <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {job.organization?.name}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{job.location}</span>
                            {job.matchScore && (
                              <span className="ml-2 text-green-600 font-medium">
                                {Math.round(job.matchScore)}% match
                              </span>
                            )}
                          </div>
                        </div>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-blue-600 hover:text-blue-500 text-xs font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-center text-sm text-gray-500">
                    Complete your profile to get personalized job recommendations
                  </div>
                )}
              </div>
              <div className="px-6 py-3 bg-gray-50">
                <Link
                  to="/jobs"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View all jobs →
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
                      <p className="text-xs text-gray-600 mb-1">
                        {event.organization?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.startTime).toLocaleDateString()} at{' '}
                        {new Date(event.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
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
                  to="/resume"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50"
                >
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                  Update Resume
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50"
                >
                  <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  Complete Profile
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50"
                >
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Prompt */}
        {(!user?.studentProfile?.cgpa || !user?.studentProfile?.skills?.length) && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Complete your profile
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Add your academic details and skills to get better job recommendations
                    and increase your chances of being discovered by recruiters.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Complete Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;