// client/src/contexts/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/auth.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  tokens: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false
      };
    case 'REGISTER_PENDING':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Only check auth status if we don't already have a user
    if (!state.user && !state.isAuthenticated) {
      checkAuthStatus();
    }
  }, []); // Remove dependencies to prevent infinite loops

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const tokens = authService.getTokens();
      console.log('Tokens from localStorage:', tokens);
      
      if (tokens && tokens.accessToken) {
        const user = await authService.getCurrentUser();
        console.log('User from API:', user);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, tokens }
        });
      } else {
        console.log('No valid tokens found');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear any corrupted tokens
      authService.clearTokens();
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(email, password);
      
      console.log('Login response:', response);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response
      });
      
      toast.success('Login successful!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.register(userData);
      
      // Check if tokens are provided (user is approved) or pending approval
      if (response.tokens) {
        // User is approved and can login immediately
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response
        });
        toast.success('Registration successful!');
      } else {
        // User is pending approval (likely a recruiter)
        dispatch({ type: 'REGISTER_PENDING' });
        
        if (response.message) {
          toast.success(response.message, {
            duration: 6000, // Longer duration for important message
            style: {
              background: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #F59E0B'
            }
          });
        } else {
          toast.success('Registration successful! Your account is pending approval.');
        }
      }
      
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still log out locally even if server call fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};