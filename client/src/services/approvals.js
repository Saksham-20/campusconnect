import api from './api';

class ApprovalService {
  // Get pending approvals for TPO
  async getPendingApprovals() {
    try {
      const response = await api.get('/approvals/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  }

  // Approve or reject an organization
  async approveOrganization(organizationId, action, notes = '') {
    try {
      const response = await api.patch(`/approvals/organizations/${organizationId}`, {
        action,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error approving organization:', error);
      throw error;
    }
  }

  // Approve or reject a recruiter
  async approveRecruiter(userId, action, notes = '') {
    try {
      const response = await api.patch(`/approvals/recruiters/${userId}`, {
        action,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error approving recruiter:', error);
      throw error;
    }
  }

  // Bulk approve or reject organizations
  async bulkApproveOrganizations(organizationIds, action, notes = '') {
    try {
      const response = await api.patch('/approvals/organizations/bulk', {
        organizationIds,
        action,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk approving organizations:', error);
      throw error;
    }
  }

  // Get approval statistics
  async getApprovalStats() {
    try {
      const response = await api.get('/approvals/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching approval stats:', error);
      throw error;
    }
  }
}

export default new ApprovalService();
