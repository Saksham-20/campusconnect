// ===== client/src/components/forms/JobApplicationForm.js =====
import React, { useState } from 'react';
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const JobApplicationForm = ({ job, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeFile: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          resumeFile: 'Please upload a PDF or Word document'
        }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          resumeFile: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resumeFile: file
      }));
      setErrors(prev => ({
        ...prev,
        resumeFile: ''
      }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      resumeFile: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    }
    
    if (!formData.resumeFile) {
      newErrors.resumeFile = 'Resume is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Apply for {job.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{job.organization?.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Cover Letter */}
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter *
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            rows={8}
            value={formData.coverLetter}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.coverLetter ? 'border-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical`}
            placeholder="Tell us why you're interested in this position and what makes you a great fit..."
          />
          {errors.coverLetter && (
            <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Tip: Highlight your relevant skills and experiences that match the job requirements.
          </p>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume *
          </label>
          
          {!formData.resumeFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload your resume
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PDF, DOC, or DOCX up to 5MB
                    </span>
                  </label>
                  <input
                    id="resume-upload"
                    name="resume-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => document.getElementById('resume-upload').click()}
                  >
                    Select file
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PaperClipIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{formData.resumeFile.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          
          {errors.resumeFile && (
            <p className="mt-1 text-sm text-red-600">{errors.resumeFile}</p>
          )}
        </div>

        {/* Job Requirements Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Job Requirements</h3>
          <div className="space-y-2">
            {job.requirements && job.requirements.length > 0 ? (
              <ul className="text-sm text-gray-600 space-y-1">
                {job.requirements.slice(0, 3).map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {req}
                  </li>
                ))}
                {job.requirements.length > 3 && (
                  <li className="text-gray-500 italic">
                    ...and {job.requirements.length - 3} more requirements
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No specific requirements listed</p>
            )}
          </div>
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
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;