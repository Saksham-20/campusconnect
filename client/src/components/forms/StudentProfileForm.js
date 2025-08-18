// ===== client/src/components/forms/StudentProfileForm.js =====
import React, { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { COMMON_SKILLS, COMMON_COURSES, COMMON_BRANCHES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const StudentProfileForm = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    course: '',
    branch: '',
    yearOfStudy: '',
    cgpa: '',
    tenthMarks: '',
    twelfthMarks: '',
    graduationYear: '',
    skills: [''],
    achievements: [''],
    projects: [{ title: '', description: '', technologies: '', url: '' }],
    ...initialData
  });
  const [errors, setErrors] = useState({});

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const handleInputChange = (e) => {
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

  const handleArrayInputChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addArrayItem = (field) => {
    if (field === 'projects') {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, { title: '', description: '', technologies: '', url: '' }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }));
    }
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    }

    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }

    if (!formData.yearOfStudy) {
      newErrors.yearOfStudy = 'Year of study is required';
    }

    if (formData.cgpa && (formData.cgpa < 0 || formData.cgpa > 10)) {
      newErrors.cgpa = 'CGPA must be between 0 and 10';
    }

    if (formData.tenthMarks && (formData.tenthMarks < 0 || formData.tenthMarks > 100)) {
      newErrors.tenthMarks = '10th marks must be between 0 and 100';
    }

    if (formData.twelfthMarks && (formData.twelfthMarks < 0 || formData.twelfthMarks > 100)) {
      newErrors.twelfthMarks = '12th marks must be between 0 and 100';
    }

    if (!formData.graduationYear) {
      newErrors.graduationYear = 'Expected graduation year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const cleanedData = {
        ...formData,
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        achievements: formData.achievements.filter(achievement => achievement.trim() !== ''),
        projects: formData.projects.filter(project => project.title.trim() !== '')
      };
      onSubmit(cleanedData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Student Profile</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete your academic and professional information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Academic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  list="courses-suggestions"
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.course ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. Bachelor of Technology"
                />
                <datalist id="courses-suggestions">
                  {COMMON_COURSES.map((course, index) => (
                    <option key={index} value={course} />
                  ))}
                </datalist>
                {errors.course && (
                  <p className="mt-1 text-sm text-red-600">{errors.course}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch/Specialization *
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  list="branches-suggestions"
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.branch ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. Computer Science Engineering"
                />
                <datalist id="branches-suggestions">
                  {COMMON_BRANCHES.map((branch, index) => (
                    <option key={index} value={branch} />
                  ))}
                </datalist>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-600">{errors.branch}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Study *
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.yearOfStudy ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
                {errors.yearOfStudy && (
                  <p className="mt-1 text-sm text-red-600">{errors.yearOfStudy}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Graduation Year *
                </label>
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.graduationYear ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Year</option>
                  {graduationYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current CGPA
                </label>
                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.01"
                  className={`w-full px-3 py-2 border ${
                    errors.cgpa ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. 8.5"
                />
                {errors.cgpa && (
                  <p className="mt-1 text-sm text-red-600">{errors.cgpa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  10th Grade Marks (%)
                </label>
                <input
                  type="number"
                  name="tenthMarks"
                  value={formData.tenthMarks}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className={`w-full px-3 py-2 border ${
                    errors.tenthMarks ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. 85.5"
                />
                {errors.tenthMarks && (
                  <p className="mt-1 text-sm text-red-600">{errors.tenthMarks}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  12th Grade Marks (%)
                </label>
                <input
                  type="number"
                  name="twelfthMarks"
                  value={formData.twelfthMarks}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className={`w-full px-3 py-2 border ${
                    errors.twelfthMarks ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. 90.5"
                />
                {errors.twelfthMarks && (
                  <p className="mt-1 text-sm text-red-600">{errors.twelfthMarks}</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayInputChange(index, e.target.value, 'skills')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. JavaScript, React, Python"
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

          {/* Projects */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Projects</h3>
            {formData.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Project {index + 1}</h4>
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'projects')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. E-commerce Website"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={project.url}
                      onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                      placeholder="Describe your project, its features, and your role..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies Used
                    </label>
                    <input
                      type="text"
                      value={project.technologies}
                      onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. React, Node.js, MongoDB, Express"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('projects')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Project
            </button>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Achievements & Awards</h3>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => handleArrayInputChange(index, e.target.value, 'achievements')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Winner of Inter-college Hackathon 2023"
                />
                {formData.achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'achievements')}
                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('achievements')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Achievement
            </button>
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
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileForm;