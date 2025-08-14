// server/src/routes/files.js
const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const fileController = require('../controllers/fileController');

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  }
});

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 */
router.post('/upload', 
  authenticateToken, 
  upload.single('file'),
  fileController.uploadFile
);

/**
 * @swagger
 * /api/files/{id}/download:
 *   get:
 *     summary: Download file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/download', authenticateToken, fileController.downloadFile);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateToken, fileController.deleteFile);

/**
 * @swagger
 * /api/files/my-files:
 *   get:
 *     summary: Get user files
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-files', authenticateToken, fileController.getUserFiles);

module.exports = router;