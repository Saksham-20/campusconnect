// ===== client/src/components/forms/ContactForm.js =====
import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const ContactForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
          <p className="text-sm text-gray-600 mt-1">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.subject ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="What is this regarding?"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={`w-full px-3 py-2 border ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical`}
              placeholder="Tell us how we can help you..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Sending...</span>
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;