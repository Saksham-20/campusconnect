// server/src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    // Extract more details about which constraint failed
    const constraintName = err.parent?.constraint || err.fields?.join(', ') || 'unknown';
    const field = err.errors?.[0]?.path || constraintName;
    
    console.error('Unique constraint error details:', {
      constraint: constraintName,
      fields: err.fields,
      message: err.parent?.message,
      errors: err.errors
    });
    
    // Format details as array to match client expectations
    const details = err.errors?.map(error => ({
      field: error.path || field,
      message: error.message || `A record with this ${field} already exists`
    })) || [{
      field: field,
      message: `A record with this ${field} already exists`
    }];
    
    return res.status(409).json({
      error: 'Duplicate Entry',
      message: `A record with this ${field} already exists`,
      details: details
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'The provided token is invalid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'The provided token has expired'
    });
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File Too Large',
      message: 'The uploaded file exceeds the size limit'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
