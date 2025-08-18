// ===== client/src/components/forms/JobPostForm.js =====
import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { COMMON_SKILLS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const JobPostForm = ({ onSubmit, onCancel, isLoading = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    skills: [''],
    type: 'full-time',
    location: '',
    salary: '',
    experience: '',
    openings: 1,
    minCGPA: '',
    applicationDeadline: '',
    isActive: true,
    ...initialData
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
      newErrors.location = 'Location is required';
    }

    if (!formData.openings || formData.openings < 1) {
      newErrors.openings = 'Number of openings must be at least 1';
    }

    if (formData.minCGPA && (formData.minCGPA < 0 || formData.minCGPA > 10)) {
      newErrors.minCGPA = 'CGPA must be between 0 and 10';
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = 'Application deadline is required';
    } else {
      const deadline = new Date(formData.applicationDeadline);
      const today = new Date();
      if (deadline <= today) {
        newErrors.applicationDeadline = 'Application deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        skills: formData.skills.filter(skill => skill.trim() !== '')
      };
      onSubmit(cleanedData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Edit Job Posting' : 'Post a New Job'}
            </h1>
            <p className="text-gray-600 mt-1">Fill in the details to create a new job posting</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. Software Engineer - Full Stack"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
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
                  className={`w-full px-3 py-2 border ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. Bangalore, India"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (Optional)
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. ₹6-10 LPA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Required
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 0-2 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Openings *
                </label>
                <input
                  type="number"
                  name="openings"
                  value={formData.openings}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.openings ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.openings && (
                  <p className="mt-1 text-sm text-red-600">{errors.openings}</p>
                )}
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
                  min="0"
                  max="10"
                  step="0.1"
                  className={`w-full px-3 py-2 border ${
                    errors.minCGPA ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. 7.5"
                />
                {errors.minCGPA && (
                  <p className="mt-1 text-sm text-red-600">{errors.minCGPA}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline *
                </label>
                <input
                  type="datetime-local"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.applicationDeadline ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
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
                rows={6}
                required
                className={`w-full px-3 py-2 border ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical`}
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
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
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'requirements')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Bachelor's degree in Computer Science"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'requirements')}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
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
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'skills')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. JavaScript, React, Node.js"
                    list="skills-suggestions"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'skills')}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <datalist id="skills-suggestions">
                {COMMON_SKILLS.map((skill, index) => (
                  <option key={index} value={skill} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => addArrayItem('skills')}
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
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">{initialData ? 'Updating...' : 'Posting...'}</span>
                  </>
                ) : (
                  initialData ? 'Update Job' : 'Post Job'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostForm;
