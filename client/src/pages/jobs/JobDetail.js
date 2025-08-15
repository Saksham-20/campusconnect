// client/src/pages/jobs/JobDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch(`/api/jobs/${id}`);
      if (response.ok) {
        const jobData = await response.json();
        setJob(jobData);
        // Check if user has already applied
        if (user?.role === 'student') {
          checkApplicationStatus(jobData.id);
        }
      } else {
        toast.error('Job not found');
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async (jobId) => {
    try {
      const response = await fetch(`/api/applications/check/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setHasApplied(data.hasApplied);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: id,
          coverLetter: '' // You can add a cover letter modal here
        })
      });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setHasApplied(true);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job?.title || 'Software Engineer'}
              </h1>
              <div className="flex items-center text-lg text-gray-600 mb-4">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                {job?.company?.name || 'Tech Company'}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {job?.location || 'Remote'}
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  {job?.type || 'Full-time'}
                </div>
                <div className="flex items-center">
                  <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                  {job?.salary || 'Competitive'}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Apply by: {job?.applicationDeadline || 'TBD'}
                </div>
              </div>
            </div>
            {user?.role === 'student' && (
              <div className="ml-6">
                {hasApplied ? (
                  <button
                    disabled
                    className="bg-green-100 text-green-800 px-6 py-3 rounded-md font-medium"
                  >
                    Applied ✓
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                {job?.description || (
                  <div>
                    <p>We are looking for a talented Software Engineer to join our team...</p>
                    <h3>Responsibilities:</h3>
                    <ul>
                      <li>Develop and maintain web applications</li>
                      <li>Collaborate with cross-functional teams</li>
                      <li>Write clean, maintainable code</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <div className="space-y-2">
                {job?.requirements?.map((req, index) => (
                  <div key={index} className="flex items-start">
                    <span className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{req}</span>
                  </div>
                )) || (
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Bachelor's degree in Computer Science or related field</span>
                    </div>
                    <div className="flex items-start">
                      <span className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">2+ years of experience with React and Node.js</span>
                    </div>
                    <div className="flex items-start">
                      <span className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Strong problem-solving skills</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                )) || (
                  <>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">React</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Node.js</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">JavaScript</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">MongoDB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
              <div className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="text-sm text-gray-900">{job?.company?.name || 'Tech Company'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Industry</dt>
                  <dd className="text-sm text-gray-900">{job?.company?.industry || 'Technology'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Size</dt>
                  <dd className="text-sm text-gray-900">{job?.company?.size || '100-500 employees'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="text-sm text-blue-600 hover:text-blue-500">
                    <a href={job?.company?.website || '#'} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </dd>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Posted</dt>
                  <dd className="text-sm text-gray-900">{job?.createdAt || 'Today'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Experience</dt>
                  <dd className="text-sm text-gray-900">{job?.experience || '2-4 years'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Openings</dt>
                  <dd className="text-sm text-gray-900">{job?.openings || '2'} positions</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">CGPA Required</dt>
                  <dd className="text-sm text-gray-900">{job?.minCGPA || '7.0'} and above</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;