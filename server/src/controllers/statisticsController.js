const { User, Job, Application, Organization, StudentProfile, RecruiterProfile, Event, EventRegistration, Achievement } = require('../models');
const { Op } = require('sequelize');

class StatisticsController {
  // Get comprehensive admin statistics
  async getAdminStats(req, res, next) {
    try {
      // Simple count queries without complex GROUP BY
      const totalUsers = await User.count();
      const totalOrganizations = await Organization.count();
      const totalJobs = await Job.count();
      const totalApplications = await Application.count();
      
      // Get user counts by role using simple queries
      const adminUsers = await User.count({ where: { role: 'admin' } });
      const tpoUsers = await User.count({ where: { role: 'tpo' } });
      const studentUsers = await User.count({ where: { role: 'student' } });
      const recruiterUsers = await User.count({ where: { role: 'recruiter' } });

      // Get job counts by status
      const activeJobs = await Job.count({ where: { status: 'active' } });
      const closedJobs = await Job.count({ where: { status: 'closed' } });
      const draftJobs = await Job.count({ where: { status: 'draft' } });

      // Get application counts by status
      const appliedApplications = await Application.count({ where: { status: 'applied' } });
      const screeningApplications = await Application.count({ where: { status: 'screening' } });
      const shortlistedApplications = await Application.count({ where: { status: 'shortlisted' } });
      const interviewedApplications = await Application.count({ where: { status: 'interviewed' } });
      const selectedApplications = await Application.count({ where: { status: 'selected' } });
      const rejectedApplications = await Application.count({ where: { status: 'rejected' } });
      const withdrawnApplications = await Application.count({ where: { status: 'withdrawn' } });

      // Get placement counts
      const placedStudents = await StudentProfile.count({ where: { placementStatus: 'placed' } });
      const unplacedStudents = await StudentProfile.count({ where: { placementStatus: 'unplaced' } });
      const deferredStudents = await StudentProfile.count({ where: { placementStatus: 'deferred' } });

      // Recent activity (last 7 days)
      const recentActivity = await Application.findAll({
        include: [
          {
            model: Job,
            as: 'job',
            attributes: ['title'],
            include: [{ model: Organization, as: 'organization', attributes: ['name'] }]
          },
          {
            model: User,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ],
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        limit: 10,
        order: [['createdAt', 'DESC']]
      });

      // Recent registrations (last 30 days)
      const recentRegistrations = await User.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      });

      // Recent job postings (last 7 days)
      const recentPostings = await Job.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      });

      res.json({
        message: 'Admin statistics retrieved successfully',
        stats: {
          users: {
            total: totalUsers,
            byRole: [
              { role: 'admin', count: adminUsers },
              { role: 'tpo', count: tpoUsers },
              { role: 'student', count: studentUsers },
              { role: 'recruiter', count: recruiterUsers }
            ],
            recentRegistrations
          },
          organizations: {
            total: totalOrganizations,
            byType: await Organization.findAll({
              attributes: ['type'],
              raw: true
            }).then(orgs => {
              const typeCounts = {};
              orgs.forEach(org => {
                typeCounts[org.type] = (typeCounts[org.type] || 0) + 1;
              });
              return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
            })
          },
          jobs: {
            total: totalJobs,
            byStatus: [
              { status: 'active', count: activeJobs },
              { status: 'closed', count: closedJobs },
              { status: 'draft', count: draftJobs }
            ],
            recentPostings
          },
          applications: {
            total: totalApplications,
            byStatus: [
              { status: 'applied', count: appliedApplications },
              { status: 'screening', count: screeningApplications },
              { status: 'shortlisted', count: shortlistedApplications },
              { status: 'interviewed', count: interviewedApplications },
              { status: 'selected', count: selectedApplications },
              { status: 'rejected', count: rejectedApplications },
              { status: 'withdrawn', count: withdrawnApplications }
            ]
          },
          placements: {
            byStatus: [
              { placementStatus: 'placed', count: placedStudents },
              { placementStatus: 'unplaced', count: unplacedStudents },
              { placementStatus: 'deferred', count: deferredStudents }
            ],
            totalPlaced: placedStudents
          },
          recentActivity
        }
      });
    } catch (error) {
      console.error('Error in getAdminStats:', error);
      next(error);
    }
  }

  // Get comprehensive TPO statistics
  async getTPOStats(req, res, next) {
    try {
      const { organizationId } = req.user;
      
      if (!organizationId) {
        return res.status(400).json({
          error: 'Organization Not Found',
          message: 'User is not associated with any organization'
        });
      }

      // Get students count for this organization
      const totalStudents = await StudentProfile.count({
        include: [
          {
            model: User,
            as: 'user',
            where: { organizationId },
            attributes: []
          }
        ]
      });

      // Get placement statistics for this organization
      const placedStudents = await StudentProfile.count({
        include: [
          {
            model: User,
            as: 'user',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { placementStatus: 'placed' }
      });

      const unplacedStudents = await StudentProfile.count({
        include: [
          {
            model: User,
            as: 'user',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { placementStatus: 'unplaced' }
      });

      const deferredStudents = await StudentProfile.count({
        include: [
          {
            model: User,
            as: 'user',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { placementStatus: 'deferred' }
      });

      // Get course statistics for this organization
      const courseStats = await StudentProfile.findAll({
        include: [
          {
            model: User,
            as: 'user',
            where: { organizationId },
            attributes: []
          }
        ],
        attributes: ['course'],
        raw: true
      }).then(profiles => {
        const courseCounts = {};
        profiles.forEach(profile => {
          if (profile.course) {
            courseCounts[profile.course] = (courseCounts[profile.course] || 0) + 1;
          }
        });
        return Object.entries(courseCounts).map(([course, count]) => ({ course, count }));
      });

      // Job statistics for the organization
      const totalJobs = await Job.count({ where: { organizationId } });
      const activeJobs = await Job.count({ where: { organizationId, status: 'active' } });
      const closedJobs = await Job.count({ where: { organizationId, status: 'closed' } });
      const draftJobs = await Job.count({ where: { organizationId, status: 'draft' } });

      // Application statistics for this organization
      const totalApplications = await Application.count({
        include: [
          {
            model: Job,
            as: 'job',
            where: { organizationId },
            attributes: []
          }
        ]
      });

      const appliedApplications = await Application.count({
        include: [
          {
            model: Job,
            as: 'job',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { status: 'applied' }
      });

      const screeningApplications = await Application.count({
        include: [
          {
            model: Job,
            as: 'job',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { status: 'screening' }
      });

      const shortlistedApplications = await Application.count({
        include: [
          {
            model: Job,
            as: 'job',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { status: 'shortlisted' }
      });

      const interviewedApplications = await Application.count({
        include: [
          {
            model: Job,
            as: 'job',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { status: 'interviewed' }
      });

      const selectedApplications = await Application.count({
        include: [
          {
            model: Job,
            as: 'job',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { status: 'selected' }
      });

      const rejectedApplications = await Application.count({
        include: [
          {
            model: Job,
            as: 'job',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { status: 'rejected' }
      });

      const withdrawnApplications = await Application.count({
        include: [
          {
            model: Job,
            as: 'job',
            where: { organizationId },
            attributes: []
          }
        ],
        where: { status: 'withdrawn' }
      });

      // Event statistics
      const totalEvents = await Event.count({ where: { organizationId } });

      // Get recent activity
      const recentActivity = await Application.findAll({
        include: [
          {
            model: Job,
            as: 'job',
            where: { organizationId },
            attributes: ['title'],
            include: [{ model: Organization, as: 'organization', attributes: ['name'] }]
          },
          {
            model: User,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ],
        limit: 10,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        message: 'TPO statistics retrieved successfully',
        stats: {
          students: {
            total: totalStudents,
            byPlacementStatus: [
              { placementStatus: 'placed', count: placedStudents },
              { placementStatus: 'unplaced', count: unplacedStudents },
              { placementStatus: 'deferred', count: deferredStudents }
            ],
            byCourse: courseStats,
            placed: placedStudents,
            placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0
          },
          jobs: {
            total: totalJobs,
            byStatus: [
              { status: 'active', count: activeJobs },
              { status: 'closed', count: closedJobs },
              { status: 'draft', count: draftJobs }
            ],
            active: activeJobs
          },
          applications: {
            total: totalApplications,
            byStatus: [
              { status: 'applied', count: appliedApplications },
              { status: 'screening', count: screeningApplications },
              { status: 'shortlisted', count: shortlistedApplications },
              { status: 'interviewed', count: interviewedApplications },
              { status: 'selected', count: selectedApplications },
              { status: 'rejected', count: rejectedApplications },
              { status: 'withdrawn', count: withdrawnApplications }
            ],
            byCompany: [] // Simplified for now
          },
          events: {
            total: totalEvents
          },
          recentActivity
        }
      });
    } catch (error) {
      console.error('Error in getTPOStats:', error);
      next(error);
    }
  }

  // Get dashboard overview statistics
  async getDashboardOverview(req, res, next) {
    try {
      const { role, organizationId } = req.user;
      
      if (role === 'admin') {
        return await this.getAdminStats(req, res, next);
      } else if (role === 'tpo') {
        return await this.getTPOStats(req, res, next);
      } else {
        return res.status(403).json({
          error: 'Access Forbidden',
          message: 'This endpoint is only available for admin and TPO users'
        });
      }
    } catch (error) {
      console.error('Error in getDashboardOverview:', error);
      next(error);
    }
  }
}

module.exports = new StatisticsController();
