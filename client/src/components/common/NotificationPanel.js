// client/src/components/common/NotificationPanel.js
import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const NotificationPanel = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    formatNotificationTime,
    getNotificationIcon,
    getNotificationColor
  } = useNotification();
  const [activeTab, setActiveTab] = useState('all');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('all');
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      toast.success('Notification marked as read', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error('Failed to mark notification as read', {
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
        },
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error('Failed to mark all notifications as read', {
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
        },
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'read') return notification.isRead;
    return true;
  });

  const unreadNotifications = notifications.filter(n => !n.isRead);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`} 
        onClick={handleClose} 
      />
      
      {/* Panel */}
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className={`h-full flex flex-col bg-white shadow-2xl transition-transform duration-200 ${
            isClosing ? 'translate-x-full' : 'translate-x-0'
          }`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BellIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                    <p className="text-sm text-gray-500">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="mt-4 flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'all', label: 'All', count: notifications.length, icon: EyeIcon },
                  { id: 'unread', label: 'Unread', count: unreadNotifications.length, icon: EyeSlashIcon }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{tab.label}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <LoadingSpinner variant="dots" size="large" text="Loading notifications..." />
                </div>
              ) : filteredNotifications.length > 0 ? (
                <div className="p-4 space-y-3">
                  {filteredNotifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 ${
                        !notification.isRead ? 'ring-2 ring-blue-100 bg-blue-50/50' : ''
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 p-2.5 rounded-xl ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center mt-3 space-x-3">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  {formatNotificationTime(notification.createdAt)}
                                </span>
                                {notification.type && (
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                                    {notification.type.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="ml-2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Mark as read"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BellIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    {activeTab === 'unread' 
                      ? 'You\'re all caught up! Check back later for new updates.' 
                      : 'You\'ll see notifications here when they arrive. We\'ll keep you posted on important updates.'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${unreadCount > 0 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <span>
                      {unreadCount > 0 
                        ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                        : 'All notifications read'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
