// client/src/pages/jobs/JobEdit.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const JobEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    skillsRequired: [''],
    jobType: 'full_time',
    location: '',
    salaryMin: '',
    salaryMax: '',
    experienceRequired: 0,
    totalPositions: 1,
    applicationDeadline: '',
    minCGPA: '',
    isActive: true
  });

  const jobTypeOptions = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'internship', label: 'Internship' }
  ];

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setIsLoadingJob(true);
      const response = await api.get(`/jobs/${id}`);
      const job = response.job || response;
      
      // Check if user can edit this job
      if (job.organizationId !== user.organizationId) {
        toast.error('You are not authorized to edit this job');
        navigate('/jobs');
        return;
      }

      // Convert requirements from string to array
      const requirements = job.requirements ? job.requirements.split('\n').filter(req => req.trim()) : [''];
      if (requirements.length === 0) requirements.push('');

      setFormData({
        title: job.title || '',
        description: job.description || '',
        requirements: requirements,
        skillsRequired: job.skillsRequired || [''],
        jobType: job.jobType || 'full_time',
        location: job.location || '',
        salaryMin: job.salaryMin ? job.salaryMin.toString() : '',
        salaryMax: job.salaryMax ? job.salaryMax.toString() : '',
        experienceRequired: job.experienceRequired || 0,
        totalPositions: job.totalPositions || 1,
        applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
        minCGPA: job.eligibilityCriteria?.minCGPA ? job.eligibilityCriteria.minCGPA.toString() : '',
        isActive: job.status === 'active'
      });
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setIsLoadingJob(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleArrayInputChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Job location is required';
    }
    
    if (formData.salaryMin && formData.salaryMax && 
        parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      newErrors.salaryMax = 'Maximum salary must be greater than or equal to minimum salary';
    }
    
    if (formData.minCGPA && (parseFloat(formData.minCGPA) < 0 || parseFloat(formData.minCGPA) > 10)) {
      newErrors.minCGPA = 'CGPA must be between 0 and 10';
    }
    
    if (formData.applicationDeadline && new Date(formData.applicationDeadline) <= new Date()) {
      newErrors.applicationDeadline = 'Application deadline must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || (user.role !== 'recruiter' && user.role !== 'tpo')) {
      toast.error('You are not authorized to edit jobs');
      return;
    }

    clearErrors();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Filter out empty requirements and skills, and convert to proper format
      const cleanedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        jobType: formData.jobType,
        location: formData.location.trim(),
        requirements: formData.requirements.filter(req => req.trim() !== '').join('\n'),
        skillsRequired: formData.skillsRequired.filter(skill => skill.trim() !== ''),
        status: formData.isActive ? 'active' : 'draft'
      };

      // Add eligibility criteria if minCGPA is provided
      if (formData.minCGPA && formData.minCGPA.trim()) {
        cleanedData.eligibilityCriteria = {
          minCGPA: parseFloat(formData.minCGPA)
        };
      }

      // Only add optional fields if they have values
      if (formData.salaryMin && formData.salaryMin.trim()) {
        cleanedData.salaryMin = parseInt(formData.salaryMin);
      }

      if (formData.salaryMax && formData.salaryMax.trim()) {
        cleanedData.salaryMax = parseInt(formData.salaryMax);
      }

      if (formData.experienceRequired !== undefined && formData.experienceRequired !== '') {
        cleanedData.experienceRequired = parseInt(formData.experienceRequired);
      }

      if (formData.totalPositions && formData.totalPositions > 0) {
        cleanedData.totalPositions = parseInt(formData.totalPositions);
      }

      if (formData.applicationDeadline) {
        cleanedData.applicationDeadline = formData.applicationDeadline;
      }

      await api.put(`/jobs/${id}`, cleanedData);

      toast.success('Job updated successfully!');
      navigate(`/jobs/${id}`);
    } catch (error) {
      console.error('Error updating job:', error);
      if (error.data && error.data.details) {
        // Show specific validation errors
        const errorMessages = error.data.details.map(detail => detail.message).join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        toast.error(error.message || 'Failed to update job');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user || (user.role !== 'recruiter' && user.role !== 'tpo')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You are not authorized to edit jobs.</p>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-600 mt-1">Update your job posting</p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Software Engineer"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Job Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {jobTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., New York, NY"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary (Optional)
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="50000"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary (Optional)
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.salaryMax ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="80000"
                  min="0"
                />
                {errors.salaryMax && <p className="mt-1 text-sm text-red-600">{errors.salaryMax}</p>}
              </div>
            </div>

            {/* Experience and Positions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Required (years)
                </label>
                <input
                  type="number"
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Positions
                </label>
                <input
                  type="number"
                  name="totalPositions"
                  value={formData.totalPositions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="100"
                />
              </div>
            </div>

            {/* Application Deadline and Min CGPA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.applicationDeadline && <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum CGPA (Optional)
                </label>
                <input
                  type="number"
                  name="minCGPA"
                  value={formData.minCGPA}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="10"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.minCGPA ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="7.5"
                />
                {errors.minCGPA && <p className="mt-1 text-sm text-red-600">{errors.minCGPA}</p>}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'requirements')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a requirement..."
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'requirements')}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Requirement
              </button>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              {formData.skillsRequired.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'skillsRequired')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a skill..."
                  />
                  {formData.skillsRequired.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'skillsRequired')}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('skillsRequired')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Skill
              </button>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Make this job active immediately
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobEdit;
