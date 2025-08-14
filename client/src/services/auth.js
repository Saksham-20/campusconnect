// client/src/services/auth.js
import api from './api';

const TOKEN_KEY = 'campusconnect_tokens';

class AuthService {
  login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    this.setTokens(response.tokens);
    return response;
  };

  register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    this.setTokens(response.tokens);
    return response;
  };

  logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  };

  getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.user;
  };

  refreshTokens = async () => {
    const tokens = this.getTokens();
    if (!tokens || !tokens.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', {
      refreshToken: tokens.refreshToken
    });
    
    this.setTokens(response.tokens);
    return response.tokens;
  };

  setTokens = (tokens) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  };

  getTokens = () => {
    const tokens = localStorage.getItem(TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  };

  clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
  };

  getAccessToken = () => {
    const tokens = this.getTokens();
    return tokens ? tokens.accessToken : null;
  };
}

export default new AuthService();