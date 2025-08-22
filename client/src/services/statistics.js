import api from './api';

class StatisticsService {
  // Get admin dashboard statistics
  async getAdminStats() {
    try {
      const response = await api.get('/statistics/admin');
      return response;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  // Get TPO dashboard statistics
  async getTPOStats() {
    try {
      const response = await api.get('/statistics/tpo');
      return response;
    } catch (error) {
      console.error('Error fetching TPO stats:', error);
      throw error;
    }
  }

  // Get dashboard overview based on user role
  async getDashboardOverview() {
    try {
      const response = await api.get('/statistics/dashboard');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  // Get job statistics
  async getJobStats(organizationId = null) {
    try {
      const params = organizationId ? `?organizationId=${organizationId}` : '';
      const response = await api.get(`/jobs/stats${params}`);
      return response;
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  }

  // Get application statistics
  async getApplicationStats(jobId = null, organizationId = null) {
    try {
      const params = new URLSearchParams();
      if (jobId) params.append('jobId', jobId);
      if (organizationId) params.append('organizationId', organizationId);
      
      const response = await api.get(`/applications/stats?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      throw error;
    }
  }
}

const statisticsService = new StatisticsService();
export default statisticsService;
