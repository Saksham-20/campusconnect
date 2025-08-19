// client/src/pages/events/EventForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'campus_drive',
    location: '',
    startTime: '',
    endTime: '',
    maxParticipants: '',
    virtualLink: '',
    contactEmail: '',
    contactPhone: '',
    status: 'draft'
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const event = response.event;
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        eventType: event.eventType || 'campus_drive',
        location: event.location || '',
        startTime: event.startTime ? event.startTime.split('T')[0] + 'T' + event.startTime.split('T')[1] : '',
        endTime: event.endTime ? event.endTime.split('T')[0] + 'T' + event.endTime.split('T')[1] : '',
        maxParticipants: event.maxParticipants || '',
        virtualLink: event.virtualLink || '',
        contactEmail: event.contactEmail || '',
        contactPhone: event.contactPhone || '',
        status: event.status || 'draft'
      });
    } catch (error) {
      console.error('Failed to fetch event:', error);
      toast.error('Failed to load event details');
      navigate('/events');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || (user.role !== 'recruiter' && user.role !== 'tpo')) {
      toast.error('You are not authorized to create events');
      return;
    }

    // Frontend validation
    if (!formData.title.trim()) {
      toast.error('Event title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Event description is required');
      return;
    }

    if (!formData.startTime) {
      toast.error('Start time is required');
      return;
    }

    if (!formData.endTime) {
      toast.error('End time is required');
      return;
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      
      // Clean and format the data
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventType: formData.eventType,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        status: formData.status,
        organizationId: user.organizationId,
        createdBy: user.id
      };

      // Only add optional fields if they have values
      if (formData.location && formData.location.trim()) {
        eventData.location = formData.location.trim();
      }

      if (formData.maxParticipants && formData.maxParticipants > 0) {
        eventData.maxParticipants = parseInt(formData.maxParticipants);
      }

      if (formData.virtualLink && formData.virtualLink.trim()) {
        eventData.virtualLink = formData.virtualLink.trim();
      }

      let response;
      if (isEditing) {
        response = await api.put(`/events/${id}`, eventData);
        toast.success('Event updated successfully!');
      } else {
        response = await api.post('/events', eventData);
        toast.success('Event created successfully!');
      }
      
      navigate(`/events/${response.event.id}`);
    } catch (error) {
      console.error('Error saving event:', error);
      if (error.data && error.data.details) {
        // Show specific validation errors
        const errorMessages = error.data.details.map(detail => detail.message).join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        toast.error(error.message || 'Failed to save event');
      }
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    { value: 'campus_drive', label: 'Campus Drive' },
    { value: 'info_session', label: 'Information Session' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'job_fair', label: 'Job Fair' },
    { value: 'other', label: 'Other' }
  ];

  if (!user || (user.role !== 'recruiter' && user.role !== 'tpo')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You are not authorized to create events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Update event details' : 'Fill in the details below to create a new event'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event title"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="No limit if empty"
                />
              </div>
            </div>

            {/* Online Event Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Virtual Meeting Link
                </label>
                <input
                  type="url"
                  name="virtualLink"
                  value={formData.virtualLink}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://meet.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if this is an in-person event
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the event, agenda, and what participants can expect..."
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
