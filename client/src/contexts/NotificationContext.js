// client/src/contexts/NotificationContext.js
import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        isLoading: false,
        error: null
      };
    case 'SET_UNREAD_COUNT':
      return {
        ...state,
        unreadCount: action.payload
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { isAuthenticated, user } = useAuth();
  const isInitialized = useRef(false);

  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      // Only fetch if user is authenticated
      if (!isAuthenticated || !user) {
        return;
      }
      
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
      
      if (page === 1) {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: response.notifications });
      } else {
        // Append to existing notifications for pagination
        dispatch({ 
          type: 'SET_NOTIFICATIONS', 
          payload: [...state.notifications, ...response.notifications] 
        });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Don't show error for unauthenticated users
      if (error.status !== 401) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  }, [isAuthenticated, user]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      // Only fetch if user is authenticated
      if (!isAuthenticated || !user) {
        return;
      }
      const response = await api.get('/notifications/unread-count');
      dispatch({ type: 'SET_UNREAD_COUNT', payload: response.unreadCount });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      // Don't show error for unauthenticated users
      if (error.status !== 401) {
        console.error('Failed to fetch unread count:', error);
      }
    }
  }, [isAuthenticated, user]);

  // Fetch notifications when user is authenticated - only once
  useEffect(() => {
    if (isAuthenticated && user && !isInitialized.current) {
      isInitialized.current = true;
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isAuthenticated, user]);

  // Set up polling for real-time notifications - only when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (isAuthenticated) {
        fetchUnreadCount();
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);



  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_update':
        return '📄';
      case 'job_alert':
        return '💼';
      case 'event_reminder':
        return '📅';
      case 'system_alert':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const value = {
    ...state,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearError,
    getNotificationIcon,
    getNotificationColor,
    formatNotificationTime
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};