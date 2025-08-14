// client/src/pages/resume/ResumePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  DocumentTextIcon,
  CloudArrowUpIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const ResumePage = () => {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/resume/data');
      setResumeData(response.data);
    } catch (error) {
      console.error('Failed to fetch resume data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    try {
      setIsGenerating(true);
      const response = await api.post('/resume/generate');
      toast.success('Resume generated successfully!');
      
      // Refresh resume data
      await fetchResumeData();
      
      // Show download option
      if (response.resume?.downloadUrl) {
        const downloadLink = document.createElement('a');
        downloadLink.href = response.resume.downloadUrl;
        downloadLink.download = response.resume.fileName || 'resume.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (error) {
      console.error('Failed to generate resume:', error);
      toast.error('Failed to generate resume');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Resume uploaded successfully!');
      await fetchResumeData();
    } catch (error) {
      console.error('Failed to upload resume:', error);
      toast.error('Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadResume = async () => {
    try {
      if (resumeData?.profile?.resumeUrl) {
        const response = await api.get(`/files/download?path=${resumeData.profile.resumeUrl}`, {
          responseType: 'blob'
        });
        
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${user.firstName}_${user.lastName}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download resume:', error);
      toast.error('Failed to download resume');
    }
  };

  const getProfileCompletionScore = () => {
    if (!resumeData) return 0;
    
    const { personalInfo, profile, achievements } = resumeData;
    let score = 0;
    let totalFields = 0;

    // Basic info (40% weight)
    const basicFields = ['firstName', 'lastName', 'email', 'phone'];
    basicFields.forEach(field => {
      totalFields += 10;
      if (personalInfo[field]) score += 10;
    });

    // Profile info (40% weight)
    if (profile) {
      const profileFields = [
        'course', 'branch', 'yearOfStudy', 'graduationYear', 
        'cgpa', 'skills', 'bio', 'linkedinUrl'
      ];
      profileFields.forEach(field => {
        totalFields += 5;
        const value = profile[field];
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          score += 5;
        }
      });
    }

    // Achievements (20% weight)
    totalFields += 20;
    if (achievements && achievements.length > 0) {
      score += Math.min(20, achievements.length * 5);
    }

    return Math.round((score / totalFields) * 100);
  };

  const ResumePreview = () => {
    if (!resumeData) return null;

    const { personalInfo, profile, achievements } = resumeData;

    return (
      <div className="bg-white p-8 shadow-lg max-w-2xl mx-auto" style={{ minHeight: '842px' }}>
        {/* Header */}
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {profile?.course && (
            <p className="text-lg text-gray-600 mt-1">
              {profile.course} - Year {profile.yearOfStudy}
            </p>
          )}
          <div className="flex justify-center items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>{personalInfo.email}</span>
            {personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {profile?.bio && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Education */}
        {profile && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
              EDUCATION
            </h2>
            <div>
              <h3 className="font-semibold text-gray-900">{profile.course}</h3>
              {profile.branch && (
                <p className="text-sm text-gray-700">Specialization: {profile.branch}</p>
              )}
              <div className="text-sm text-gray-600 mt-1">
                {profile.cgpa && <span>CGPA: {profile.cgpa}</span>}
                {profile.percentage && profile.cgpa && <span> | </span>}
                {profile.percentage && <span>Percentage: {profile.percentage}%</span>}
                {profile.graduationYear && (
                  <span> | Expected Graduation: {profile.graduationYear}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {profile?.skills && profile.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
              TECHNICAL SKILLS
            </h2>
            <p className="text-sm text-gray-700">{profile.skills.join(', ')}</p>
          </div>
        )}

        {/* Achievements & Experience */}
        {achievements && achievements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
              ACHIEVEMENTS & EXPERIENCE
            </h2>
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className={index > 0 ? 'mt-4' : ''}>
                <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                {achievement.issuingOrganization && (
                  <p className="text-sm text-gray-600 italic">
                    {achievement.issuingOrganization}
                    {achievement.issueDate && (
                      <span> | {new Date(achievement.issueDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}</span>
                    )}
                  </p>
                )}
                {achievement.description && (
                  <p className="text-sm text-gray-700 mt-1">{achievement.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Additional Information */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
            ADDITIONAL INFORMATION
          </h2>
          <div className="text-sm text-gray-700 space-y-1">
            {profile?.githubUrl && (
              <p>GitHub: {profile.githubUrl}</p>
            )}
            {profile?.portfolioUrl && (
              <p>Portfolio: {profile.portfolioUrl}</p>
            )}
            {profile?.linkedinUrl && (
              <p>LinkedIn: {profile.linkedinUrl}</p>
            )}
            {profile?.address && (
              <p>Address: {profile.address}</p>
            )}
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

  const completionScore = getProfileCompletionScore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your professional resume
          </p>
        </div>

        {/* Profile Completion Alert */}
        {completionScore < 80 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Profile Incomplete ({completionScore}% complete)
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Complete your profile to generate a comprehensive resume. 
                    Add missing information like skills, bio, and achievements.
                  </p>
                </div>
                <div className="mt-4">
                  <a
                    href="/profile"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                  >
                    Complete Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'manage', name: 'Manage Resume', icon: DocumentTextIcon },
                { id: 'preview', name: 'Preview', icon: EyeIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'manage' && (
              <div className="space-y-6">
                {/* Current Resume Status */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Current Resume</h3>
                  
                  {resumeData?.profile?.resumeUrl ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Resume Available</p>
                          <p className="text-sm text-green-600">
                            Last updated: {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setActiveTab('preview')}
                          className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Preview
                        </button>
                        <button
                          onClick={handleDownloadResume}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No resume generated yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Generate your resume from your profile or upload a custom one.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Generate Resume */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <PlusIcon className="h-6 w-6 text-blue-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Generate Resume</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Create a professional resume using information from your profile, including 
                      personal details, education, skills, and achievements.
                    </p>
                    <button
                      onClick={handleGenerateResume}
                      disabled={isGenerating || completionScore < 50}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Generate Resume
                        </>
                      )}
                    </button>
                    {completionScore < 50 && (
                      <p className="mt-2 text-xs text-red-600">
                        Complete at least 50% of your profile to generate a resume
                      </p>
                    )}
                  </div>

                  {/* Upload Resume */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <CloudArrowUpIcon className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Upload Custom Resume</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Already have a resume? Upload your own PDF file to use for job applications.
                    </p>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                          isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <LoadingSpinner size="small" className="mr-2" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                            Choose PDF File
                          </>
                        )}
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      PDF files only, max 10MB
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Resume Tips</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
                      Keep your resume to 1-2 pages and focus on relevant experiences
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
                      Use action verbs and quantify your achievements with numbers
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
                      Tailor your skills section to match job requirements
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
                      Include links to your portfolio, GitHub, and LinkedIn profiles
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
                      Proofread carefully for grammar and spelling errors
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div>
                {resumeData ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Resume Preview</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleGenerateResume}
                          disabled={isGenerating}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Regenerate
                        </button>
                        {resumeData?.profile?.resumeUrl && (
                          <button
                            onClick={handleDownloadResume}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            Download PDF
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <ResumePreview />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No resume data available</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Generate a resume from your profile to see the preview.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab('manage')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Go to Manage
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;