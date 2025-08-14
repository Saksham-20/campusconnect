// server/src/config/multer.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Memory storage configuration
const memoryStorage = multer.memoryStorage();

// Disk storage configuration (for local development)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const createFileFilter = (allowedTypes = [], allowedExtensions = []) => {
  return (req, file, cb) => {
    // Check MIME type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return cb(new Error(`Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`), false);
      }
    }

    cb(null, true);
  };
};

// Common file type configurations
const FILE_TYPES = {
  IMAGES: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  DOCUMENTS: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    extensions: ['.pdf', '.doc', '.docx', '.txt']
  },
  RESUMES: {
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf']
  },
  SPREADSHEETS: {
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ],
    extensions: ['.xls', '.xlsx', '.csv']
  }
};

// Multer configurations for different use cases
const configs = {
  // General file upload
  general: {
    storage: process.env.STORAGE_TYPE === 'local' ? diskStorage : memoryStorage,
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
      files: 5
    },
    fileFilter: createFileFilter()
  },

  // Profile picture upload
  profilePicture: {
    storage: memoryStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1
    },
    fileFilter: createFileFilter(FILE_TYPES.IMAGES.mimeTypes, FILE_TYPES.IMAGES.extensions)
  },

  // Resume upload
  resume: {
    storage: memoryStorage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 1
    },
    fileFilter: createFileFilter(FILE_TYPES.RESUMES.mimeTypes, FILE_TYPES.RESUMES.extensions)
  },

  // Document upload
  document: {
    storage: memoryStorage,
    limits: {
      fileSize: 15 * 1024 * 1024, // 15MB
      files: 3
    },
    fileFilter: createFileFilter(FILE_TYPES.DOCUMENTS.mimeTypes, FILE_TYPES.DOCUMENTS.extensions)
  },

  // Bulk document upload
  bulkDocuments: {
    storage: memoryStorage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB total
      files: 10
    },
    fileFilter: createFileFilter(
      [...FILE_TYPES.DOCUMENTS.mimeTypes, ...FILE_TYPES.SPREADSHEETS.mimeTypes],
      [...FILE_TYPES.DOCUMENTS.extensions, ...FILE_TYPES.SPREADSHEETS.extensions]
    )
  }
};

// Create multer instances
const uploaders = {
  general: multer(configs.general),
  profilePicture: multer(configs.profilePicture),
  resume: multer(configs.resume),
  document: multer(configs.document),
  bulkDocuments: multer(configs.bulkDocuments)
};

// Error handler for multer errors
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(413).json({
          error: 'File Too Large',
          message: 'File size exceeds the maximum allowed limit'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(413).json({
          error: 'Too Many Files',
          message: 'Number of files exceeds the maximum allowed limit'
        });
      case 'LIMIT_FIELD_KEY':
        return res.status(400).json({
          error: 'Invalid Field Name',
          message: 'Field name is too long'
        });
      case 'LIMIT_FIELD_VALUE':
        return res.status(400).json({
          error: 'Invalid Field Value',
          message: 'Field value is too long'
        });
      case 'LIMIT_FIELD_COUNT':
        return res.status(400).json({
          error: 'Too Many Fields',
          message: 'Too many fields in the form'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Unexpected File',
          message: 'Unexpected file field'
        });
      default:
        return res.status(400).json({
          error: 'Upload Error',
          message: error.message
        });
    }
  }

  if (error.message.includes('Invalid file type') || error.message.includes('Invalid file extension')) {
    return res.status(400).json({
      error: 'Invalid File Type',
      message: error.message
    });
  }

  next(error);
};

// Utility functions
const getFileInfo = (file) => {
  if (!file) return null;

  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    extension: path.extname(file.originalname).toLowerCase(),
    sizeFormatted: formatFileSize(file.size)
  };
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const validateFileSize = (file, maxSize) => {
  if (!file) return true;
  return file.size <= maxSize;
};

const validateFileType = (file, allowedTypes) => {
  if (!file) return true;
  return allowedTypes.includes(file.mimetype);
};

const validateFileExtension = (file, allowedExtensions) => {
  if (!file) return true;
  const ext = path.extname(file.originalname).toLowerCase();
  return allowedExtensions.includes(ext);
};

// Middleware factory for custom upload configurations
const createUploadMiddleware = (fieldName, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024,
    allowedTypes = [],
    allowedExtensions = [],
    multiple = false,
    maxCount = 1
  } = options;

  const config = {
    storage: memoryStorage,
    limits: {
      fileSize: maxSize,
      files: multiple ? maxCount : 1
    },
    fileFilter: createFileFilter(allowedTypes, allowedExtensions)
  };

  const upload = multer(config);
  
  if (multiple) {
    return upload.array(fieldName, maxCount);
  } else {
    return upload.single(fieldName);
  }
};

module.exports = {
  uploaders,
  handleMulterError,
  getFileInfo,
  formatFileSize,
  validateFileSize,
  validateFileType,
  validateFileExtension,
  createUploadMiddleware,
  FILE_TYPES,
  configs
};