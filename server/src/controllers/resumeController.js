// server/src/controllers/resumeController.js
const resumeService = require('../services/resumeService');

class ResumeController {
  async generateResume(req, res, next) {
    try {
      const result = await resumeService.generateResumeFromProfile(req.user.id);
      
      res.json({
        message: 'Resume generated successfully',
        resume: result
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadResume(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No File',
          message: 'Please select a PDF file to upload'
        });
      }

      const result = await resumeService.uploadCustomResume(req.user.id, req.file);
      
      res.json({
        message: 'Resume uploaded successfully',
        resume: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getResumeData(req, res, next) {
    try {
      const data = await resumeService.getResumeData(req.user.id);
      
      res.json({
        message: 'Resume data retrieved successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadResume(req, res, next) {
    try {
      const { fileId } = req.params;
      
      // Redirect to the files download endpoint
      res.redirect(`/api/files/${fileId}/download`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResumeController();