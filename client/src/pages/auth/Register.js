// client/src/pages/auth/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student',
    organizationId: ''
  });
  const [organizations, setOrganizations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get('/organizations');
      setOrganizations(response.organizations || []);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate password strength for password field
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    if (formData.role !== 'admin' && !formData.organizationId) {
      newErrors.organizationId = 'Please select an organization';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const submitData = { ...formData };
      delete submitData.confirmPassword;
      
      // Don't send organizationId for admin role
      if (formData.role === 'admin') {
        delete submitData.organizationId;
      }

      const response = await register(submitData);
      
      // Check if the user needs approval or can login immediately
      if (response.tokens) {
        // User approved and logged in
        navigate('/', { replace: true });
      } else {
        // User pending approval
        setRegistrationSuccess({
          type: 'pending',
          message: response.message || 'Your account is pending approval.'
        });
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login', { 
            replace: true,
            state: { 
              message: 'Registration successful! Please wait for approval before logging in.',
              email: formData.email
            }
          });
        }, 5000);
      }
    } catch (error) {
      setErrors({
        submit: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredOrganizations = () => {
    if (formData.role === 'student' || formData.role === 'tpo') {
      return organizations.filter(org => org.type === 'university');
    } else if (formData.role === 'recruiter') {
      return organizations.filter(org => org.type === 'company');
    }
    return organizations;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-yellow-500';
    if (passwordStrength < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  // Show success message for pending approval
  if (registrationSuccess?.type === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/20">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full p-4 shadow-lg">
                  <InformationCircleIcon className="h-8 w-8" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Registration Successful!
                </h2>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    {registrationSuccess.message}
                  </p>
                  <p className="text-xs text-yellow-700 mt-2">
                    You will receive a notification once your account is approved.
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Redirecting to login page in a few seconds...
              </div>

              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Main card */}
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/20">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <span className="font-bold text-3xl">CC</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Create your account
              </h2>
              <p className="mt-3 text-gray-600">
                Join our platform and discover amazing opportunities
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Role Selection Notice */}
            {formData.role === 'recruiter' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-800 font-medium">Recruiter Registration</p>
                    <p className="text-blue-700 mt-1">
                      Your account will require approval from a Training & Placement Officer before you can access the platform.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {errors.submit && (
                <div className="rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                    <div className="text-sm text-red-700 font-medium">{errors.submit}</div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                        errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      } placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm hover:border-gray-300`}
                      placeholder="First name"
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                        errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      } placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm hover:border-gray-300`}
                      placeholder="Last name"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm hover:border-gray-300`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm hover:border-gray-300`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border-2 ${
                      errors.role ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm hover:border-gray-300`}
                  >
                    <option value="student">Student</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="tpo">Training & Placement Officer</option>
                  </select>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.role}
                    </p>
                  )}
                </div>

                {/* Organization */}
                {formData.role !== 'admin' && (
                  <div>
                    <label htmlFor="organizationId" className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization
                    </label>
                    <select
                      id="organizationId"
                      name="organizationId"
                      value={formData.organizationId}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border-2 ${
                        errors.organizationId ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      } bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm hover:border-gray-300`}
                    >
                      <option value="">Select an organization</option>
                      {getFilteredOrganizations().map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                    {errors.organizationId && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.organizationId}
                      </p>
                    )}
                  </div>
                )}

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-4 py-3 pr-12 border-2 ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      } placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm hover:border-gray-300`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength < 50 ? 'text-red-600' : passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-4 py-3 pr-12 border-2 ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      } placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm hover:border-gray-300`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {/* Password match indicator */}
                    {formData.confirmPassword && formData.password && (
                      <div className="absolute inset-y-0 right-12 flex items-center pr-2">
                        {formData.password === formData.confirmPassword ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {isLoading ? (
                    <LoadingSpinner size="small" variant="dots" color="white" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;