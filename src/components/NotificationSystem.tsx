'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Bell 
} from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  timestamp?: Date;
  actions?: Array<{
    label: string;
    action: () => void;
    style: 'primary' | 'secondary';
  }>;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? 5000,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove non-persistent notifications
    if (!notification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = () => {
    setNotifications([]);
  };

  const success = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration });
  };

  const error = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration });
  };

  const warning = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration });
  };

  const info = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration });
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
  isDarkMode?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onRemove, 
  isDarkMode = false 
}) => {
  const [progress, setProgress] = useState(100);

  // Progress bar animation for non-persistent notifications
  useEffect(() => {
    if (!notification.persistent && notification.duration) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (notification.duration! / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [notification.persistent, notification.duration]);

  const getNotificationConfig = () => {
    switch (notification.type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: isDarkMode ? 'bg-slate-800/90' : 'bg-white/90',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          textColor: isDarkMode ? 'text-white' : 'text-gray-900',
          colors: 'from-green-500 to-emerald-600'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: isDarkMode ? 'bg-slate-800/90' : 'bg-white/90',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          textColor: isDarkMode ? 'text-white' : 'text-gray-900',
          colors: 'from-red-500 to-rose-600'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: isDarkMode ? 'bg-slate-800/90' : 'bg-white/90',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          textColor: isDarkMode ? 'text-white' : 'text-gray-900',
          colors: 'from-yellow-500 to-orange-600'
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: isDarkMode ? 'bg-slate-800/90' : 'bg-white/90',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          textColor: isDarkMode ? 'text-white' : 'text-gray-900',
          colors: 'from-blue-500 to-cyan-600'
        };
    }
  };

  const config = getNotificationConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative overflow-hidden backdrop-blur-md rounded-xl p-4 border shadow-lg ${config.bgColor} max-w-sm`}
    >
      {/* Progress bar */}
      {!notification.persistent && notification.duration && (
        <div className="absolute top-0 left-0 right-0 h-1">
          <motion.div
            className={`h-full bg-gradient-to-r ${config.colors}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-r ${config.colors} rounded-xl flex items-center justify-center`}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`text-sm font-semibold ${config.textColor}`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {notification.message}
              </p>
              {notification.timestamp && (
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(notification.id)}
              className={`ml-2 p-1 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-slate-700' : ''}`}
            >
              <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </motion.button>
          </div>

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex space-x-2 mt-3">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    action.style === 'primary'
                      ? `bg-gradient-to-r ${config.colors} text-white hover:opacity-90`
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface NotificationContainerProps {
  isDarkMode?: boolean;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  isDarkMode = false 
}) => {
  const { notifications, removeNotification, clearAll } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {/* Clear All Button */}
      {notifications.length > 1 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={clearAll}
          className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Clear All ({notifications.length})
        </motion.button>
      )}

      {/* Notifications */}
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
            isDarkMode={isDarkMode}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Helper hook for common notification patterns
export const useNotificationHelpers = () => {
  const notifications = useNotifications();

  const notifyAsync = useCallback(async (
    asyncFn: () => Promise<any>,
    {
      loading = 'Processing...',
      success = 'Operation completed successfully',
      error = 'An error occurred',
    } = {}
  ) => {
    notifications.info('Processing', loading);
    
    try {
      const result = await asyncFn();
      notifications.success('Success', success);
      return result;
    } catch (err) {
      notifications.error('Error', error);
      throw err;
    }
  }, [notifications]);

  const notifyValidation = useCallback((errors: string[]) => {
    if (errors.length > 0) {
      notifications.warning(
        'Validation Error',
        errors.join(', ')
      );
      return false;
    }
    return true;
  }, [notifications]);

  return {
    ...notifications,
    notifyAsync,
    notifyValidation,
  };
};

export default NotificationProvider;
