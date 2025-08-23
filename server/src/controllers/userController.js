// server/src/controllers/userController.js
const { User, Organization, StudentProfile, RecruiterProfile } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const notificationService = require('../services/notificationService');

class UserController {
  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Organization,
            as: 'organization',
            attributes: ['id', 'name', 'type', 'logoUrl']
          },
          {
            model: StudentProfile,
            as: 'studentProfile'
          },
          {
            model: RecruiterProfile,
            as: 'recruiterProfile'
          }
        ],
        attributes: { exclude: ['passwordHash'] }
      });

      if (!user) {
        return res.status(404).json({
          error: 'User Not Found',
          message: 'User profile not found'
        });
      }

      res.json({ user });
    } catch (error) {
      console.error('Error in getProfile:', error);
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updates = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User Not Found',
          message: 'User not found'
        });
      }

      // Remove fields that shouldn't be updated directly
      const { passwordHash, role, organizationId, approvalStatus, ...allowedUpdates } = updates;

      await user.update(allowedUpdates);

      // Fetch updated user with associations
      const updatedUser = await User.findByPk(userId, {
        include: [
          {
            model: Organization,
            as: 'organization',
            attributes: ['id', 'name', 'type', 'logoUrl']
          },
          {
            model: StudentProfile,
            as: 'studentProfile'
          },
          {
            model: RecruiterProfile,
            as: 'recruiterProfile'
          }
        ],
        attributes: { exclude: ['passwordHash'] }
      });

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      next(error);
    }
  }

  // Admin: Get all users with filtering and pagination
  async getAllUsers(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'Only admins can access this resource'
        });
      }

      const { 
        page = 1, 
        limit = 20, 
        role, 
        organizationId, 
        approvalStatus, 
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      // Apply filters
      if (role) where.role = role;
      if (organizationId) where.organizationId = organizationId;
      if (approvalStatus) where.approvalStatus = approvalStatus;
      
      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await User.findAndCountAll({
        where,
        include: [
          {
            model: Organization,
            as: 'organization',
            attributes: ['id', 'name', 'type', 'logoUrl']
          },
          {
            model: StudentProfile,
            as: 'studentProfile',
            attributes: ['course', 'branch', 'yearOfStudy', 'cgpa']
          },
          {
            model: RecruiterProfile,
            as: 'recruiterProfile',
            attributes: ['designation', 'department', 'experience']
          }
        ],
        attributes: { exclude: ['passwordHash'] },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        message: 'Users retrieved successfully',
        users: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers: count,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      next(error);
    }
  }

  // Admin: Get user by ID with full details
  async getUserById(req, res, next) {
    try {
      // Check if user is admin or accessing own profile
      if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.userId)) {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'You can only access your own profile'
        });
      }

      const userId = req.params.userId;
      
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Organization,
            as: 'organization'
          },
          {
            model: StudentProfile,
            as: 'studentProfile'
          },
          {
            model: RecruiterProfile,
            as: 'recruiterProfile'
          }
        ],
        attributes: { exclude: ['passwordHash'] }
      });

      if (!user) {
        return res.status(404).json({
          error: 'User Not Found',
          message: 'User not found'
        });
      }

      res.json({
        message: 'User retrieved successfully',
        user
      });
    } catch (error) {
      console.error('Error in getUserById:', error);
      next(error);
    }
  }

  // Admin: Update user (including role, status, etc.)
  async updateUser(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'Only admins can perform this action'
        });
      }

      const userId = req.params.userId;
      const updates = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User Not Found',
          message: 'User not found'
        });
      }

      // Don't allow admins to change their own role or status to prevent lockout
      if (user.id === req.user.id && (updates.role || updates.approvalStatus || updates.isActive === false)) {
        return res.status(400).json({
          error: 'Invalid Operation',
          message: 'You cannot change your own role, approval status, or deactivate your account'
        });
      }

      // Handle password updates
      if (updates.password) {
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        updates.passwordHash = await bcrypt.hash(updates.password, saltRounds);
        delete updates.password;
      }

      // Track status changes for notifications
      const oldApprovalStatus = user.approvalStatus;
      const newApprovalStatus = updates.approvalStatus;

      await user.update(updates);

      // Send notification if approval status changed
      if (newApprovalStatus && newApprovalStatus !== oldApprovalStatus) {
        try {
          const notificationTitle = newApprovalStatus === 'approved' ? 
            'Account Approved!' : 
            newApprovalStatus === 'rejected' ? 'Account Status Update' : 'Account Status Changed';
          
          const notificationMessage = newApprovalStatus === 'approved' ? 
            `Your account has been approved by an administrator. You can now access the platform.` :
            newApprovalStatus === 'rejected' ? 
            `Your account has been reviewed and requires additional information. Please contact support.` :
            `Your account status has been updated to ${newApprovalStatus}.`;

          await notificationService.createNotification(
            user.id,
            notificationTitle,
            notificationMessage,
            'admin_update',
            {
              approvalStatus: newApprovalStatus,
              updatedBy: req.user.id
            },
            newApprovalStatus === 'approved' ? 'high' : 'medium'
          );
        } catch (notificationError) {
          console.error('Error creating admin update notification:', notificationError);
        }
      }

      // Fetch updated user with associations
      const updatedUser = await User.findByPk(userId, {
        include: [
          {
            model: Organization,
            as: 'organization',
            attributes: ['id', 'name', 'type', 'logoUrl']
          },
          {
            model: StudentProfile,
            as: 'studentProfile'
          },
          {
            model: RecruiterProfile,
            as: 'recruiterProfile'
          }
        ],
        attributes: { exclude: ['passwordHash'] }
      });

      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error in updateUser:', error);
      next(error);
    }
  }

  // Admin: Delete user (soft delete by deactivating)
  async deleteUser(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'Only admins can perform this action'
        });
      }

      const userId = req.params.userId;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User Not Found',
          message: 'User not found'
        });
      }

      // Prevent admins from deleting themselves
      if (user.id === req.user.id) {
        return res.status(400).json({
          error: 'Invalid Operation',
          message: 'You cannot delete your own account'
        });
      }

      // Soft delete by deactivating
      await user.update({ isActive: false });

      res.json({
        message: 'User deactivated successfully'
      });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      next(error);
    }
  }

  // Admin: Get user statistics
  async getUserStats(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'Only admins can access this resource'
        });
      }

      const [roleStats, statusStats, organizationStats] = await Promise.all([
        // Users by role
        User.findAll({
          attributes: [
            'role',
            [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
          ],
          group: ['role'],
          raw: true
        }),

        // Users by approval status
        User.findAll({
          attributes: [
            'approvalStatus',
            [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
          ],
          group: ['approvalStatus'],
          raw: true
        }),

        // Users by organization type
        User.findAll({
          include: [
            {
              model: Organization,
              as: 'organization',
              attributes: []
            }
          ],
          attributes: [
            [User.sequelize.col('organization.type'), 'organizationType'],
            [User.sequelize.fn('COUNT', User.sequelize.col('User.id')), 'count']
          ],
          group: ['organization.type'],
          raw: true
        })
      ]);

      res.json({
        message: 'User statistics retrieved successfully',
        stats: {
          byRole: roleStats,
          byApprovalStatus: statusStats,
          byOrganizationType: organizationStats
        }
      });
    } catch (error) {
      console.error('Error in getUserStats:', error);
      next(error);
    }
  }
}

module.exports = new UserController();