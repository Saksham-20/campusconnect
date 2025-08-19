// client/src/pages/dashboard/RecruiterDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  BriefcaseIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    jobs: [],
    recentApplications: [],
    upcomingEvents: [],
    topCandidates: [],
    stats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      shortlistedCandidates: 0,
      totalViews: 0,
      conversionRate: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      // Check if user has organizationId
      if (!user?.organizationId) {
        const errorMsg = 'Organization not found. Please contact administrator.';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const [jobsRes, applicationsRes, eventsRes, statsRes, candidatesRes] = await Promise.allSettled([
        api.get(`/jobs?limit=10&organizationId=${user.organizationId}`),
        api.get(`/applications?limit=10&organizationId=${user.organizationId}`),
        api.get(`/events?upcoming=true&limit=5&organizationId=${user.organizationId}`),
        api.get(`/jobs/stats?organizationId=${user.organizationId}`),
        api.get(`/users/top-candidates?limit=5&organizationId=${user.organizationId}`)
      ]);

      // Handle successful responses
      const jobs = jobsRes.status === 'fulfilled' ? (jobsRes.value.jobs || []) : [];
      const applications = applicationsRes.status === 'fulfilled' ? (applicationsRes.value.applications || []) : [];
      const events = eventsRes.status === 'fulfilled' ? (eventsRes.value.events || []) : [];
      const stats = statsRes.status === 'fulfilled' ? (statsRes.value.stats || {}) : {};
      const candidates = candidatesRes.status === 'fulfilled' ? (candidatesRes.value.candidates || []) : [];

      // Calculate derived stats
      const totalViews = jobs.reduce((sum, job) => sum + (parseInt(job.viewCount) || 0), 0);
      const conversionRate = totalViews > 0 ? Math.round((applications.length / totalViews) * 100) : 0;

      setDashboardData({
        jobs,
        recentApplications: applications,
        upcomingEvents: events,
        topCandidates: candidates,
        stats: {
          totalJobs: stats.jobsByStatus?.reduce((sum, stat) => sum + (parseInt(stat.count) || 0), 0) || 0,
          activeJobs: stats.jobsByStatus?.find(s => s.status === 'active')?.count || 0,
          totalApplications: stats.totalApplications || applications.length,
          shortlistedCandidates: applications.filter(app => 
            ['shortlisted', 'interviewed'].includes(app.status)
          ).length,
          totalViews,
          conversionRate
        }
      });

      // Log any failed requests for debugging
      [jobsRes, applicationsRes, eventsRes, statsRes, candidatesRes].forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Failed to fetch data for index ${index}:`, result.reason);
        }
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.organizationId]);

  const getErrorMessage = (error) => {
    if (error?.status === 401) {
      return 'Authentication failed. Please login again.';
    } else if (error?.status === 403) {
      return 'Access denied. Insufficient permissions.';
    } else if (error?.message?.includes('invalid input syntax')) {
      return 'Data format error. Please contact support.';
    } else if (error?.message?.includes('Network Error')) {
      return 'Network error. Please check your connection.';
    } else {
      return 'Failed to load dashboard data. Please try again.';
    }
  };

  useEffect(() => {
    if (user?.organizationId) {
      fetchDashboardData();
    }
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData(true);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <DocumentTextIcon className="h-4 w-4" />;
      case 'screening': return <ClockIcon className="h-4 w-4" />;
      case 'shortlisted': return <StarIcon className="h-4 w-4" />;
      case 'interviewed': return <UserGroupIcon className="h-4 w-4" />;
      case 'selected': return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle, trend }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
              {subtitle && (
                <dd className="text-sm text-gray-600">{subtitle}</dd>
              )}
              {trend && (
                <dd className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last month
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const StudentCard = ({ student, application }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {student.firstName} {student.lastName}
              </h4>
              <p className="text-sm text-gray-600">{student.email}</p>
            </div>
          </div>
          
          {student.studentProfile && (
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                <span>{student.studentProfile.course || 'N/A'} • {student.studentProfile.branch || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <StarIcon className="h-4 w-4 mr-2" />
                <span>CGPA: {student.studentProfile.cgpa || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Year: {student.studentProfile.yearOfStudy || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                <span>Graduation: {student.studentProfile.graduationYear || 'N/A'}</span>
              </div>
            </div>
          )}

          {student.studentProfile?.skills && student.studentProfile.skills.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {student.studentProfile.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {skill}
                  </span>
                ))}
                {student.studentProfile.skills.length > 5 && (
                  <span className="text-xs text-gray-500">+{student.studentProfile.skills.length - 5} more</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {application && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                <span className="ml-1">{application.status}</span>
              </span>
            )}
            <div className="flex space-x-2">
              {student.studentProfile?.resumeUrl && (
                <a
                  href={student.studentProfile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  View Resume
                </a>
              )}
              <Link
                to={`/users/${student.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View Profile
              </Link>
            </div>
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
            <h1 className="mt-2 text-xl font-semibold text-gray-900">Something went wrong</h1>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
                              <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Try Again
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'Recruiter'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your job postings, track applications, and find the best candidates
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <Link
                to="/jobs/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
              <Link
                to="/events/new"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule Event
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Jobs Posted"
            value={dashboardData.stats.totalJobs}
            icon={BriefcaseIcon}
            color="blue"
            subtitle="All time"
          />
          <StatCard
            title="Active Jobs"
            value={dashboardData.stats.activeJobs}
            icon={ChartBarIcon}
            color="green"
            subtitle="Currently accepting applications"
          />
          <StatCard
            title="Total Applications"
            value={dashboardData.stats.totalApplications}
            icon={DocumentTextIcon}
            color="purple"
            subtitle="Across all jobs"
          />
          <StatCard
            title="Shortlisted Candidates"
            value={dashboardData.stats.shortlistedCandidates}
            icon={UserGroupIcon}
            color="orange"
            subtitle="Ready for next round"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
          <StatCard
            title="Total Job Views"
            value={dashboardData.stats.totalViews.toLocaleString()}
            icon={EyeIcon}
            color="indigo"
            subtitle="Job post visibility"
          />
          <StatCard
            title="Application Rate"
            value={`${dashboardData.stats.conversionRate}%`}
            icon={ChartBarIcon}
            color="teal"
            subtitle="Views to applications"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'jobs', name: 'Job Postings', icon: BriefcaseIcon },
              { id: 'applications', name: 'Applications', icon: DocumentTextIcon },
              { id: 'candidates', name: 'Top Candidates', icon: UserGroupIcon },
              { id: 'events', name: 'Events', icon: CalendarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
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
                    dashboardData.jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {job.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              <span>{job.location} • {job.jobType?.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {job.applicationCount || 0} applications
                              </span>
                              <span className="text-xs text-gray-500">
                                {job.viewCount || 0} views
                              </span>
                              <span className="text-xs text-gray-500">
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/jobs/${job.id}`}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
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
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
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
                      <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
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
                                {getStatusIcon(application.status)}
                                <span className="ml-1">{application.status}</span>
                              </span>
                              <span className="ml-2 text-gray-500">
                                {new Date(application.appliedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/applications/${application.id}`}
                            className="text-blue-600 hover:text-blue-500 text-xs font-medium transition-colors"
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
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
                  >
                    View all applications →
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
                    className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                    Post New Job
                  </Link>
                  <Link
                    to="/applications"
                    className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                    Review Applications
                  </Link>
                  <Link
                    to="/events/new"
                    className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    Schedule Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">All Job Postings</h2>
                <Link
                  to="/jobs/new"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Post New Job
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.jobs.length > 0 ? (
                dashboardData.jobs.map((job) => (
                  <div key={job.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          <span>{job.organization?.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{job.location} • {job.jobType?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {job.applicationCount || 0} applications
                          </span>
                          <span className="text-xs text-gray-500">
                            {job.viewCount || 0} views
                          </span>
                          <span className="text-xs text-gray-500">
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
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
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Applications</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.recentApplications.length > 0 ? (
                dashboardData.recentApplications.map((application) => (
                  <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {application.student?.firstName} {application.student?.lastName}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                          Applied for: {application.job?.title}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          <span>{application.job?.organization?.name}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1">{application.status}</span>
                          </span>
                          <span className="ml-2 text-gray-500">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/applications/${application.id}`}
                          className="text-blue-600 hover:text-blue-500 text-xs font-medium transition-colors"
                        >
                          View Details
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
                    Applications will appear here once candidates start applying to your jobs.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Top Candidates</h2>
            </div>
            <div className="p-6">
              {dashboardData.topCandidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.topCandidates.map((candidate) => (
                    <StudentCard 
                      key={candidate.id} 
                      student={candidate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Top candidates will appear here based on their profiles and applications.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
                <Link
                  to="/events/new"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Schedule Event
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.upcomingEvents.length > 0 ? (
                dashboardData.upcomingEvents.map((event) => (
                  <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(event.startTime).toLocaleDateString()} at{' '}
                          {new Date(event.startTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        {event.location && (
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center text-xs text-gray-500">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          <span>{event.registrationCount || 0} registered</span>
                          {event.maxParticipants && (
                            <span className="ml-2">• Max: {event.maxParticipants}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/events/${event.id}`}
                          className="text-blue-600 hover:text-blue-500 text-xs font-medium transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Schedule events to engage with potential candidates and promote your organization.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/events/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Schedule Your First Event
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Application Pipeline */}
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