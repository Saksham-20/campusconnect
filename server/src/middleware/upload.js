// server/src/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  };

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  if (allowedTypes[mimeType] && allowedTypes[mimeType].includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed types: ${Object.keys(allowedTypes).join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  },
  fileFilter: fileFilter
});

// Specific upload configurations
const uploadSingle = (fieldName, allowedTypes = []) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    
    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            error: 'File Too Large',
            message: 'File size exceeds the maximum limit'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(413).json({
            error: 'Too Many Files',
            message: 'Too many files uploaded'
          });
        }
        return res.status(400).json({
          error: 'Upload Error',
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          error: 'File Error',
          message: err.message
        });
      }

      // Additional type checking if specified
      if (allowedTypes.length > 0 && req.file) {
        if (!allowedTypes.includes(req.file.mimetype)) {
          return res.status(400).json({
            error: 'Invalid File Type',
            message: `Only ${allowedTypes.join(', ')} files are allowed`
          });
        }
      }

      next();
    });
  };
};

const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    
    multipleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            error: 'File Too Large',
            message: 'One or more files exceed the maximum size limit'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(413).json({
            error: 'Too Many Files',
            message: `Maximum ${maxCount} files allowed`
          });
        }
        return res.status(400).json({
          error: 'Upload Error',
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          error: 'File Error',
          message: err.message
        });
      }

      next();
    });
  };
};

// Specific upload types
const uploadResume = uploadSingle('resume', ['application/pdf']);
const uploadProfilePicture = uploadSingle('profilePicture', ['image/jpeg', 'image/png']);
const uploadDocument = uploadSingle('document');
const uploadMultipleDocuments = uploadMultiple('documents', 3);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadResume,
  uploadProfilePicture,
  uploadDocument,
  uploadMultipleDocuments
};