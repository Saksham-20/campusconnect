// client/src/pages/jobs/JobPost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const JobPost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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

  const resetForm = () => {
    setFormData({
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
    clearErrors();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || (user.role !== 'recruiter' && user.role !== 'tpo')) {
      toast.error('You are not authorized to post jobs');
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

      const response = await api.post('/jobs', cleanedData);

      toast.success('Job created....');
      resetForm();
      navigate(`/jobs/${response.job.id}`);
    } catch (error) {
      console.error('Error posting job:', error);
      
      // Handle different error response formats
      if (error.data) {
        // Check if details is an array
        if (error.data.details && Array.isArray(error.data.details) && error.data.details.length > 0) {
          // Show specific validation errors
          const errorMessages = error.data.details.map(detail => detail.message || detail).join(', ');
          toast.error(errorMessages);
        } else if (error.data.message) {
          // Use the main error message
          toast.error(error.data.message);
        } else if (error.data.error) {
          toast.error(error.data.error);
        } else {
          toast.error('Failed to post job. Please check the form and try again.');
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to post job. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'recruiter' && user.role !== 'tpo')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You are not authorized to post jobs.</p>
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
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
            <p className="text-gray-600 mt-1">Fill in the details to create a new job posting</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. Software Engineer"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="internship">Internship</option>
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
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. Mumbai, India / Remote"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 500000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.salaryMax ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. 800000"
                />
                {errors.salaryMax && (
                  <p className="mt-1 text-sm text-red-600">{errors.salaryMax}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Required (years)
                </label>
                <input
                  type="number"
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Openings
                </label>
                <input
                  type="number"
                  name="totalPositions"
                  value={formData.totalPositions}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum CGPA
                </label>
                                  <input
                    type="number"
                    name="minCGPA"
                    value={formData.minCGPA}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="10"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.minCGPA ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g. 7.0"
                  />
                  {errors.minCGPA && (
                    <p className="mt-1 text-sm text-red-600">{errors.minCGPA}</p>
                  )}
              </div>

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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                                          <p className="mt-1 text-xs text-gray-500">
                        Select a future date for the application deadline
                      </p>
                      {errors.applicationDeadline && (
                        <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</p>
                      )}
                    </div>
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
                required
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a requirement"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'requirements')}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>

            {/* Skills */}
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a skill"
                  />
                  {formData.skillsRequired.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'skillsRequired')}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('skillsRequired')}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Skill
              </button>
            </div>

            {/* Job Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Make this job active immediately
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPost;