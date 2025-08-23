// server/src/services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organization } = require('../models');
const notificationService = require('./notificationService');

class AuthService {
  async hashPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async register(userData) {
    const { email, password, role, organizationId, ...profileData } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Validate organization if provided
    if (organizationId) {
      const organization = await Organization.findByPk(organizationId);
      if (!organization) {
        throw new Error('Invalid organization');
      }

      // For one college system: validate organization type matches role
      if (role === 'student' || role === 'tpo') {
        if (organization.type !== 'university') {
          throw new Error('Students and TPO can only register with university organizations');
        }
      } else if (role === 'recruiter') {
        if (organization.type !== 'company') {
          throw new Error('Recruiters can only register with company organizations');
        }
      }
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Clean up phone number - convert empty string to null
    const cleanedProfileData = { ...profileData };
    if (cleanedProfileData.phone === '') {
      cleanedProfileData.phone = null;
    }

    // Set approval status based on role
    let approvalStatus = 'approved'; // Default for students and TPO
    
    if (role === 'recruiter') {
      // Recruiters need TPO approval
      approvalStatus = 'pending';
    } else if (role === 'admin') {
      // Admins are auto-approved
      approvalStatus = 'approved';
    }

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      role,
      organizationId,
      approvalStatus,
      ...cleanedProfileData
    });

    // If recruiter registration, notify TPOs of the same university
    if (role === 'recruiter' && organizationId) {
      await this.notifyTPOsOfNewRecruiter(user, organizationId);
    }

    // For recruiters requiring approval, return different response
    if (role === 'recruiter') {
      const { passwordHash: _, ...userWithoutPassword } = user.toJSON();
      return {
        user: userWithoutPassword,
        tokens: null, // Don't provide tokens for pending approval
        message: 'Registration successful. Your account is pending approval from the Training & Placement Officer. You will be notified once approved.'
      };
    }

    // Generate tokens for approved users
    const tokens = this.generateTokens(user.id);

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      tokens
    };
  }

  async notifyTPOsOfNewRecruiter(recruiterUser, organizationId) {
    try {
      // Find the organization to get its details
      const recruiterOrg = await Organization.findByPk(organizationId);
      if (!recruiterOrg) return;

      // Find all TPOs from university organizations to notify about new recruiter
      const tpos = await User.findAll({
        where: { 
          role: 'tpo',
          isActive: true,
          approvalStatus: 'approved'
        },
        include: [
          {
            model: Organization,
            as: 'organization',
            where: { type: 'university' }
          }
        ]
      });

      // Create notifications for all TPOs
      const notifications = tpos.map(tpo => ({
        userId: tpo.id,
        title: 'New Recruiter Registration',
        message: `A new recruiter from ${recruiterOrg.name} (${recruiterUser.firstName} ${recruiterUser.lastName}) has registered and requires approval.`,
        type: 'approval_request',
        data: {
          recruiterId: recruiterUser.id,
          recruiterName: `${recruiterUser.firstName} ${recruiterUser.lastName}`,
          recruiterEmail: recruiterUser.email,
          organizationName: recruiterOrg.name,
          organizationId: organizationId
        }
      }));

      if (notifications.length > 0) {
        await notificationService.createBulkNotifications(notifications);
      }
    } catch (error) {
      console.error('Error notifying TPOs of new recruiter:', error);
      // Don't throw error as this is not critical for registration
    }
  }

  async login(email, password) {
    // Find user with organization
    const user = await User.findOne({
      where: { email, isActive: true },
      include: [
        {
          model: Organization,
          as: 'organization'
        }
      ]
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check approval status for non-admin users
    if (user.role !== 'admin' && user.approvalStatus !== 'approved') {
      if (user.approvalStatus === 'pending') {
        throw new Error('Your account is pending approval. Please wait for approval from your Training & Placement Officer.');
      } else if (user.approvalStatus === 'rejected') {
        throw new Error('Your account has been rejected. Please contact your Training & Placement Officer for more information.');
      }
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      tokens
    };
  }

  async refreshTokens(refreshToken) {
    const decoded = await this.verifyRefreshToken(refreshToken);
    
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Check approval status
    if (user.role !== 'admin' && user.approvalStatus !== 'approved') {
      throw new Error('User account is not approved');
    }

    return this.generateTokens(user.id);
  }

  async logout(userId) {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token (in production, save this in database with expiry)
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send email (implement email service)
    // await emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(resetToken, newPassword) {
    try {
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }

      const user = await User.findByPk(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      const passwordHash = await this.hashPassword(newPassword);
      await user.update({ passwordHash });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await this.comparePassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const passwordHash = await this.hashPassword(newPassword);
    await user.update({ passwordHash });

    return { message: 'Password changed successfully' };
  }
}

module.exports = new AuthService();