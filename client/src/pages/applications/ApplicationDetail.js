// client/src/pages/applications/ApplicationDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapIcon,
  ChevronDownIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    console.log('ApplicationDetail: Component mounted with ID:', id);
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      console.log('ApplicationDetail: Fetching application with ID:', id);
      console.log('ApplicationDetail: Current user:', user);
      setIsLoading(true);
      const response = await api.get(`/applications/${id}`);
      console.log('ApplicationDetail: API response:', response);
      setApplication(response.application || response);
      setNewStatus(response.application?.status || response?.status || '');
    } catch (error) {
      console.error('ApplicationDetail: Failed to fetch application details:', error);
      console.error('ApplicationDetail: Error details:', {
        status: error.status,
        message: error.message,
        data: error.data
      });
      
      if (error.status === 403) {
        toast.error('Access denied. You do not have permission to view this application.');
      } else {
        toast.error('Failed to load application details');
      }
      
      // Don't navigate away immediately, let user see the error
      // navigate('/applications');
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <DocumentTextIcon className="h-5 w-5" />;
      case 'screening': return <ClockIcon className="h-5 w-5" />;
      case 'shortlisted': return <StarIcon className="h-5 w-5" />;
      case 'interviewed': return <UserIcon className="h-5 w-5" />;
      case 'selected': return <CheckCircleIcon className="h-5 w-5" />;
      case 'rejected': return <ExclamationTriangleIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      applied: 'Application Submitted',
      screening: 'Under Review',
      shortlisted: 'Shortlisted',
      interviewed: 'Interviewed',
      selected: 'Selected',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn'
    };
    return labels[status] || status;
  };

  const getTimelineIcon = (status) => {
    switch (status) {
      case 'applied': return <DocumentTextIcon className="h-5 w-5 text-white" />;
      case 'screening': return <ClockIcon className="h-5 w-5 text-white" />;
      case 'shortlisted': return <StarIcon className="h-5 w-5 text-white" />;
      case 'interviewed': return <UserIcon className="h-5 w-5 text-white" />;
      case 'selected': return <CheckCircleIcon className="h-5 w-5 text-white" />;
      case 'rejected': return <ExclamationTriangleIcon className="h-5 w-5 text-white" />;
      case 'withdrawn': return <DocumentTextIcon className="h-5 w-5 text-white" />;
      default: return <DocumentTextIcon className="h-5 w-5 text-white" />;
    }
  };

  const getTimelineColor = (status) => {
    const colors = {
      applied: 'bg-blue-500',
      screening: 'bg-yellow-500',
      shortlisted: 'bg-purple-500',
      interviewed: 'bg-orange-500',
      selected: 'bg-green-500',
      rejected: 'bg-red-500',
      withdrawn: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const generateTimeline = () => {
    if (!application) return [];

    const timeline = [];
    
    // Always add application submission
    timeline.push({
      status: 'applied',
      label: 'Application submitted',
      date: application.appliedAt,
      description: 'Your application was successfully submitted'
    });

    // Add status updates based on current status
    if (application.status !== 'applied') {
      // Add screening if status is beyond applied
      if (['screening', 'shortlisted', 'interviewed', 'selected', 'rejected'].includes(application.status)) {
        timeline.push({
          status: 'screening',
          label: 'Status updated to screening',
          date: application.screeningAt || application.updatedAt || application.appliedAt,
          description: 'Your application is now under review'
        });
      }

      // Add shortlisted if status is beyond screening
      if (['shortlisted', 'interviewed', 'selected', 'rejected'].includes(application.status)) {
        timeline.push({
          status: 'shortlisted',
          label: 'Status updated to shortlisted',
          date: application.shortlistedAt || application.updatedAt || application.appliedAt,
          description: 'Congratulations! You have been shortlisted'
        });
      }

      // Add interviewed if status is beyond shortlisted
      if (['interviewed', 'selected', 'rejected'].includes(application.status)) {
        timeline.push({
          status: 'interviewed',
          label: 'Status updated to interviewed',
          date: application.interviewedAt || application.updatedAt || application.appliedAt,
          description: 'You have completed the interview process'
        });
      }

      // Add final result
      if (['selected', 'rejected'].includes(application.status)) {
        timeline.push({
          status: application.status,
          label: `Status updated to ${application.status}`,
          date: application.resultAt || application.updatedAt || application.appliedAt,
          description: application.status === 'selected' 
            ? 'Congratulations! You have been selected for the position'
            : 'Thank you for your interest. We regret to inform you that you were not selected'
        });
      }

      // Add withdrawn if applicable
      if (application.status === 'withdrawn') {
        timeline.push({
          status: 'withdrawn',
          label: 'Application withdrawn',
          date: application.updatedAt || application.appliedAt,
          description: 'You have withdrawn your application'
        });
      }
    }

    return timeline;
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === application.status) {
      toast.error('Please select a different status');
      return;
    }

    try {
      setIsUpdatingStatus(true);
      await api.patch(`/applications/${id}/status`, {
        status: newStatus,
        feedback: feedback.trim() || undefined
      });

      toast.success('Application status updated successfully');
      setShowStatusUpdate(false);
      setFeedback('');
      
      // Refresh application data to get updated timeline
      await fetchApplicationDetails();
    } catch (error) {
      console.error('Failed to update application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const canUpdateStatus = () => {
    return user && ['recruiter', 'admin', 'tpo'].includes(user.role) && 
           application?.job?.organizationId === user.organizationId;
  };

  const StudentProfileSection = ({ student, studentProfile }) => (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Student Profile</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {student.firstName} {student.lastName}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <EnvelopeIcon className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium text-gray-900">{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center text-sm">
                  <PhoneIcon className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium text-gray-900">{student.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          {studentProfile && (
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Academic Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <AcademicCapIcon className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">Course:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {studentProfile.course} • {studentProfile.branch}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <StarIcon className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">CGPA:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {studentProfile.cgpa || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">Year:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {studentProfile.yearOfStudy} • Graduation {studentProfile.graduationYear}
                  </span>
                </div>
                {studentProfile.percentage && (
                  <div className="flex items-center text-sm">
                    <DocumentTextIcon className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-gray-600">Percentage:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {studentProfile.percentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        {studentProfile?.skills && studentProfile.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {studentProfile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resume Download */}
        {studentProfile?.resumeUrl && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">Resume</h3>
            <a
              href={studentProfile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              View Resume
            </a>
          </div>
        )}
      </div>
    </div>
  );

  const ApplicationTimelineSection = () => {
    const timeline = generateTimeline();

    return (
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Application Timeline</h2>
            {canUpdateStatus() && (
              <button
                onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Update Status
                <ChevronDownIcon className={`ml-2 h-4 w-4 transform ${showStatusUpdate ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Status Update Form for Recruiters */}
        {showStatusUpdate && canUpdateStatus() && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (Optional)
                </label>
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Add feedback or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdatingStatus ? 'Updating...' : 'Update Status'}
              </button>
              <button
                onClick={() => {
                  setShowStatusUpdate(false);
                  setNewStatus(application.status);
                  setFeedback('');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {timeline.map((item, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index < timeline.length - 1 && (
                      <div className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full ${getTimelineColor(item.status)} flex items-center justify-center ring-8 ring-white`}>
                          {getTimelineIcon(item.status)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={item.date}>
                            {new Date(item.date).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <p className="text-gray-600 mb-4">The application you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/applications')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
              <p className="text-gray-600 mt-1">View your application information</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                <span className="ml-2">{getStatusLabel(application.status)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Job Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {application.job?.title}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    <span>{application.job?.organization?.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>Location: {application.job?.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    <span>Type: {application.job?.jobType?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-end">
                <Link
                  to={`/jobs/${application.job?.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Job Details
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Student Profile Section - Only show for recruiters */}
        {user && ['recruiter', 'admin', 'tpo'].includes(user.role) && application.student && (
          <StudentProfileSection 
            student={application.student} 
            studentProfile={application.student?.studentProfile} 
          />
        )}

        {/* Application Timeline */}
        <ApplicationTimelineSection />

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Cover Letter</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <Link
                to="/applications"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Applications
              </Link>
              <div className="flex space-x-3">
                <Link
                  to={`/jobs/${application.job?.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Job Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
