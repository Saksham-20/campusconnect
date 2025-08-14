// server/src/utils/helpers.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class Helpers {
  // Generate random string
  static generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate UUID
  static generateUUID() {
    return crypto.randomUUID();
  }

  // Hash data using SHA256
  static hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  }

  // Validate URL
  static isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Format date
  static formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  }

  // Format time
  static formatTime(date, options = {}) {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleTimeString('en-US', { ...defaultOptions, ...options });
  }

  // Get time ago string
  static getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }

  // Capitalize first letter
  static capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Convert to title case
  static toTitleCase(str) {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  // Clean and normalize text
  static cleanText(text) {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  // Generate slug from text
  static generateSlug(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Parse pagination parameters
  static parsePagination(query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 100); // Max 100 items per page
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  // Generate pagination response
  static generatePaginationResponse(data, totalCount, page, limit) {
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasMore,
        hasPrevious: page > 1
      }
    };
  }

  // Sanitize HTML
  static sanitizeHTML(html) {
    if (!html) return '';
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  // Remove sensitive data from user object
  static sanitizeUser(user) {
    if (!user) return null;
    
    const userObj = user.toJSON ? user.toJSON() : user;
    const { passwordHash, ...sanitizedUser } = userObj;
    return sanitizedUser;
  }

  // Calculate file size in human readable format
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate file name with timestamp
  static generateFileName(originalName, prefix = '') {
    const timestamp = Date.now();
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
    const cleanBaseName = this.generateSlug(baseName);
    
    return `${prefix}${prefix ? '_' : ''}${cleanBaseName}_${timestamp}${extension}`;
  }

  // Validate CGPA
  static isValidCGPA(cgpa) {
    return cgpa >= 0 && cgpa <= 10;
  }

  // Validate percentage
  static isValidPercentage(percentage) {
    return percentage >= 0 && percentage <= 100;
  }

  // Calculate match score for job recommendations
  static calculateJobMatchScore(userProfile, job) {
    let score = 0;
    
    if (!userProfile || !job) return score;

    // Skill matching (40% weight)
    if (userProfile.skills && job.skillsRequired) {
      const userSkills = userProfile.skills.map(skill => skill.toLowerCase());
      const jobSkills = job.skillsRequired.map(skill => skill.toLowerCase());
      const matchingSkills = userSkills.filter(skill => 
        jobSkills.some(jobSkill => jobSkill.includes(skill))
      );
      score += (matchingSkills.length / jobSkills.length) * 40;
    }

    // CGPA eligibility (30% weight)
    if (job.eligibilityCriteria?.minCGPA && userProfile.cgpa) {
      if (userProfile.cgpa >= job.eligibilityCriteria.minCGPA) {
        score += 30;
      }
    }

    // Branch eligibility (20% weight)
    if (job.eligibilityCriteria?.allowedBranches && userProfile.branch) {
      if (job.eligibilityCriteria.allowedBranches.includes(userProfile.branch)) {
        score += 20;
      }
    }

    // Experience requirement (10% weight)
    if (job.experienceRequired === 0) {
      score += 10; // Prefer entry-level for students
    }

    return Math.min(score, 100); // Cap at 100
  }

  // Generate API response format
  static generateResponse(success, message, data = null, error = null) {
    const response = {
      success,
      message,
      timestamp: new Date().toISOString()
    };

    if (data !== null) {
      response.data = data;
    }

    if (error !== null) {
      response.error = error;
    }

    return response;
  }

  // Validate JWT token
  static validateJWT(token, secret) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }

  // Generate JWT token
  static generateJWT(payload, secret, options = {}) {
    const defaultOptions = {
      expiresIn: '1h'
    };
    return jwt.sign(payload, secret, { ...defaultOptions, ...options });
  }

  // Mask sensitive data
  static maskEmail(email) {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
    return `${maskedUsername}@${domain}`;
  }

  static maskPhone(phone) {
    if (!phone) return '';
    if (phone.length <= 4) return phone;
    return phone.slice(0, 2) + '*'.repeat(phone.length - 4) + phone.slice(-2);
  }

  // Deep clone object
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Check if object is empty
  static isEmpty(obj) {
    if (obj === null || obj === undefined) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    if (typeof obj === 'string') return obj.trim().length === 0;
    return false;
  }

  // Remove null/undefined values from object
  static removeNullValues(obj) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedNested = this.removeNullValues(value);
          if (!this.isEmpty(cleanedNested)) {
            cleaned[key] = cleanedNested;
          }
        } else {
          cleaned[key] = value;
        }
      }
    }
    return cleaned;
  }

  // Convert object to query string
  static objectToQueryString(obj) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        params.append(key, value.toString());
      }
    }
    return params.toString();
  }

  // Parse query string to object
  static queryStringToObject(queryString) {
    const params = new URLSearchParams(queryString);
    const obj = {};
    for (const [key, value] of params) {
      obj[key] = value;
    }
    return obj;
  }

  // Generate random password
  static generateRandomPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  // Validate password strength
  static validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    ].filter(Boolean).length;

    const strength = score < 3 ? 'weak' : score < 4 ? 'medium' : 'strong';

    return {
      score,
      strength,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  }

  // Retry function with exponential backoff
  static async retry(fn, maxAttempts = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt === maxAttempts) break;
        
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
    
    throw lastError;
  }

  // Debounce function
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function
  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

module.exports = Helpers;
