// client/src/services/jobs.js
import api from './api';

class JobsService {
  // Get all jobs with filters
  async getJobs(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    
    return await api.get(`/jobs?${params}`);
  }

  // Get job by ID
  async getJobById(id) {
    return await api.get(`/jobs/${id}`);
  }

  // Create new job
  async createJob(jobData) {
    return await api.post('/jobs', jobData);
  }

  // Update job
  async updateJob(id, jobData) {
    return await api.put(`/jobs/${id}`, jobData);
  }

  // Delete job
  async deleteJob(id) {
    return await api.delete(`/jobs/${id}`);
  }

  // Toggle job status
  async toggleJobStatus(id, status) {
    return await api.patch(`/jobs/${id}/status`, { status });
  }

  // Get recommended jobs for current user
  async getRecommendedJobs(limit = 5) {
    return await api.get(`/jobs/recommended?limit=${limit}`);
  }

  // Get job statistics
  async getJobStats(organizationId = null) {
    const params = organizationId ? `?organizationId=${organizationId}` : '';
    return await api.get(`/jobs/stats${params}`);
  }

  // Apply to job
  async applyToJob(jobId, applicationData) {
    return await api.post('/applications', {
      jobId,
      ...applicationData
    });
  }

  // Get job applications
  async getJobApplications(jobId, filters = {}) {
    const params = new URLSearchParams({
      ...filters,
      jobId
    });
    return await api.get(`/applications/job/${jobId}?${params}`);
  }

  // Validate job data
  validateJobData(jobData) {
    const errors = {};

    if (!jobData.title?.trim()) {
      errors.title = 'Job title is required';
    }

    if (!jobData.description?.trim()) {
      errors.description = 'Job description is required';
    }

    if (!jobData.jobType) {
      errors.jobType = 'Job type is required';
    }

    if (jobData.salaryMin && jobData.salaryMax && 
        parseInt(jobData.salaryMin) > parseInt(jobData.salaryMax)) {
      errors.salaryMax = 'Maximum salary must be greater than minimum salary';
    }

    if (jobData.applicationDeadline) {
      const deadline = new Date(jobData.applicationDeadline);
      const now = new Date();
      if (deadline <= now) {
        errors.applicationDeadline = 'Application deadline must be in the future';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Format job data for display
  formatJobData(job) {
    return {
      ...job,
      formattedSalary: this.formatSalary(job.salaryMin, job.salaryMax),
      formattedJobType: this.formatJobType(job.jobType),
      formattedDeadline: job.applicationDeadline 
        ? new Date(job.applicationDeadline).toLocaleDateString()
        : null,
      daysUntilDeadline: job.applicationDeadline
        ? this.getDaysUntilDeadline(job.applicationDeadline)
        : null
    };
  }

  // Format salary range
  formatSalary(min, max) {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    return `Up to $${max.toLocaleString()}`;
  }

  // Format job type
  formatJobType(type) {
    const types = {
      'full_time': 'Full Time',
      'part_time': 'Part Time',
      'internship': 'Internship'
    };
    return types[type] || type;
  }

  // Get days until deadline
  getDaysUntilDeadline(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Check if user is eligible for job
  checkEligibility(job, userProfile) {
    if (!job.eligibilityCriteria || !userProfile) return true;

    const criteria = job.eligibilityCriteria;
    
    // Check minimum CGPA
    if (criteria.minCGPA && userProfile.cgpa < criteria.minCGPA) {
      return false;
    }

    // Check allowed branches
    if (criteria.allowedBranches && 
        !criteria.allowedBranches.includes(userProfile.branch)) {
      return false;
    }

    // Check graduation year
    if (criteria.graduationYear && 
        userProfile.graduationYear !== criteria.graduationYear) {
      return false;
    }

    return true;
  }

  // Calculate job match score
  calculateMatchScore(job, userProfile) {
    if (!userProfile) return 0;

    let score = 0;
    let maxScore = 0;

    // Skills matching (40% weight)
    if (job.skillsRequired && userProfile.skills) {
      const jobSkills = job.skillsRequired.map(skill => skill.toLowerCase());
      const userSkills = userProfile.skills.map(skill => skill.toLowerCase());
      
      const matchingSkills = userSkills.filter(skill => 
        jobSkills.some(jobSkill => jobSkill.includes(skill))
      );
      
      score += (matchingSkills.length / jobSkills.length) * 40;
      maxScore += 40;
    }

    // CGPA requirement (30% weight)
    if (job.eligibilityCriteria?.minCGPA && userProfile.cgpa) {
      if (userProfile.cgpa >= job.eligibilityCriteria.minCGPA) {
        score += 30;
      }
      maxScore += 30;
    }

    // Branch requirement (20% weight)
    if (job.eligibilityCriteria?.allowedBranches && userProfile.branch) {
      if (job.eligibilityCriteria.allowedBranches.includes(userProfile.branch)) {
        score += 20;
      }
      maxScore += 20;
    }

    // Experience requirement (10% weight)
    if (job.experienceRequired === 0) {
      score += 10; // Prefer entry-level for students
    }
    maxScore += 10;

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  }

  // Get job status color
  getJobStatusColor(status) {
    const colors = {
      draft: 'text-gray-600 bg-gray-100',
      active: 'text-green-600 bg-green-100',
      closed: 'text-red-600 bg-red-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  }

  // Get job type color
  getJobTypeColor(type) {
    const colors = {
      'full_time': 'text-green-600 bg-green-100',
      'part_time': 'text-yellow-600 bg-yellow-100',
      'internship': 'text-blue-600 bg-blue-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  }

  // Generate job filters for search
  generateFilters() {
    return {
      jobTypes: [
        { value: '', label: 'All Types' },
        { value: 'full_time', label: 'Full Time' },
        { value: 'part_time', label: 'Part Time' },
        { value: 'internship', label: 'Internship' }
      ],
      experienceLevels: [
        { value: '', label: 'Any Experience' },
        { value: '0', label: 'Entry Level (0 years)' },
        { value: '1', label: '1+ years' },
        { value: '2', label: '2+ years' },
        { value: '3', label: '3+ years' },
        { value: '5', label: '5+ years' }
      ],
      salaryRanges: [
        { value: '', label: 'Any Salary' },
        { value: '30000', label: '$30,000+' },
        { value: '50000', label: '$50,000+' },
        { value: '70000', label: '$70,000+' },
        { value: '100000', label: '$100,000+' }
      ]
    };
  }
}

export default new JobsService();