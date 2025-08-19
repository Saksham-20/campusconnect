// client/src/pages/applications/Applications.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  DocumentTextIcon,
  EyeIcon,
  FunnelIcon,
  ChevronDownIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    jobId: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchApplications();
    if (user.role !== 'student') {
      fetchJobs();
    }
  }, [filters]);

  const fetchApplications = async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await api.get(`/applications?${params}`);
      setApplications(response.applications || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs?limit=100');
      setJobs(response.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus
      });
      
      // Update the application in the list
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      );
      
      toast.success('Application status updated successfully');
    } catch (error) {
      console.error('Failed to update application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedApplications.length === 0) {
      toast.error('Please select applications to update');
      return;
    }

    try {
      await api.patch('/applications/bulk/update', {
        applicationIds: selectedApplications,
        status: newStatus
      });

      // Update applications in the list
      setApplications(prev =>
        prev.map(app =>
          selectedApplications.includes(app.id)
            ? { ...app, status: newStatus }
            : app
        )
      );

      setSelectedApplications([]);
      toast.success(`${selectedApplications.length} applications updated successfully`);
    } catch (error) {
      console.error('Failed to bulk update applications:', error);
      toast.error('Failed to update applications');
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await api.patch(`/applications/${applicationId}/withdraw`);
      
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: 'withdrawn' }
            : app
        )
      );
      
      toast.success('Application withdrawn successfully');
    } catch (error) {
      console.error('Failed to withdraw application:', error);
      toast.error('Failed to withdraw application');
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

  const getStatusOptions = () => {
    if (user.role === 'student') {
      return [
        { value: '', label: 'All Statuses' },
        { value: 'applied', label: 'Applied' },
        { value: 'screening', label: 'Under Review' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'interviewed', label: 'Interviewed' },
        { value: 'selected', label: 'Selected' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'withdrawn', label: 'Withdrawn' }
      ];
    } else {
      return [
        { value: '', label: 'All Statuses' },
        { value: 'applied', label: 'New Applications' },
        { value: 'screening', label: 'Under Review' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'interviewed', label: 'Interviewed' },
        { value: 'selected', label: 'Selected' },
        { value: 'rejected', label: 'Rejected' }
      ];
    }
  };

  const ApplicationCard = ({ application }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {user.role !== 'student' && (
            <input
              type="checkbox"
              checked={selectedApplications.includes(application.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedApplications(prev => [...prev, application.id]);
                } else {
                  setSelectedApplications(prev => prev.filter(id => id !== application.id));
                }
              }}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {user.role === 'student' ? (
                <>
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {application.job?.title}
                  </h3>
                </>
              ) : (
                <>
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {application.student?.firstName} {application.student?.lastName}
                  </h3>
                </>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              {user.role === 'student' ? (
                <>
                  <p className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    {application.job?.organization?.name}
                  </p>
                  <p>Location: {application.job?.location || 'Not specified'}</p>
                  <p>Type: {application.job?.jobType?.replace('_', ' ') || 'Not specified'}</p>
                </>
                              ) : (
                  <>
                    <p>Applied for: <span className="font-medium">{application.job?.title}</span></p>
                    <p>Email: {application.student?.email}</p>
                    {application.student?.studentProfile && (
                      <>
                        <p>Course: {application.student.studentProfile.course} • {application.student.studentProfile.branch}</p>
                        <p>CGPA: {application.student.studentProfile.cgpa || 'Not provided'} • Year: {application.student.studentProfile.yearOfStudy}</p>
                        {application.student.studentProfile.skills && application.student.studentProfile.skills.length > 0 && (
                          <p>Skills: {application.student.studentProfile.skills.slice(0, 3).join(', ')}</p>
                        )}
                      </>
                    )}
                  </>
                )}
              
              <div className="flex items-center text-xs text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Applied {new Date(application.appliedAt).toLocaleDateString()}
                {application.shortlistedAt && (
                  <span className="ml-4">
                    Shortlisted {new Date(application.shortlistedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {application.coverLetter && (
              <div className="mt-3">
                <p className="text-sm text-gray-700 line-clamp-2">
                  <span className="font-medium">Cover Letter:</span> {application.coverLetter}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                {application.status.replace('_', ' ').toUpperCase()}
              </span>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/applications/${application.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View Details
                </Link>

                {user.role !== 'student' && (
                  <div className="relative">
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                      className="text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}

                {user.role === 'student' && ['applied', 'screening'].includes(application.status) && (
                  <button
                    onClick={() => handleWithdrawApplication(application.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === 'student' ? 'My Applications' : 'Applications Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'student' 
              ? 'Track the status of your job applications'
              : 'Review and manage candidate applications'
            }
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
                <ChevronDownIcon className={`ml-2 h-4 w-4 transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {user.role !== 'student' && selectedApplications.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedApplications.length} selected
                  </span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkStatusUpdate(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Bulk Actions</option>
                    <option value="screening">Move to Screening</option>
                    <option value="shortlisted">Shortlist</option>
                    <option value="interviewed">Mark as Interviewed</option>
                    <option value="selected">Select</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {pagination.totalItems || 0} applications found
            </div>
          </div>

          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {user.role !== 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Position
                    </label>
                    <select
                      value={filters.jobId}
                      onChange={(e) => setFilters(prev => ({ ...prev, jobId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Positions</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ status: '', jobId: '' })}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : applications.length > 0 ? (
          <>
            <div className="space-y-4 mb-8">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchApplications(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === pagination.totalPages || 
                      Math.abs(page - pagination.currentPage) <= 2
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => fetchApplications(page)}
                          className={`px-3 py-2 border rounded-md ${
                            page === pagination.currentPage
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  
                  <button
                    onClick={() => fetchApplications(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {user.role === 'student' 
                ? "You haven't applied to any jobs yet. Start browsing available positions."
                : "No applications match your current filters."
              }
            </p>
            {user.role === 'student' && (
              <div className="mt-6">
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;