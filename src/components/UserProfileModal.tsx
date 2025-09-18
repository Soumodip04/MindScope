'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Edit,
  Save,
  Settings,
  Award,
  Calendar,
  Target,
  TrendingUp,
  Activity,
  Brain,
  Heart,
  Trophy
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, isDarkMode = false }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editMode, setEditMode] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    joinDate: 'March 2024',
    profilePicture: null,
    bio: 'Passionate about mental wellness and mindful living.',
  });

  const goals = [
    { id: 1, title: 'Daily Meditation', target: 7, current: 5, unit: 'days/week', progress: 71 },
    { id: 2, title: 'Mood Check-ins', target: 2, current: 2, unit: 'times/day', progress: 100 },
    { id: 3, title: 'Exercise Sessions', target: 4, current: 3, unit: 'times/week', progress: 75 },
    { id: 4, title: 'Sleep Quality', target: 8, current: 7.2, unit: 'hours/night', progress: 90 },
  ];

  const stats = [
    { label: 'Sessions', value: '124', icon: Activity, color: 'from-blue-500 to-purple-600' },
    { label: 'Streak', value: '12', icon: TrendingUp, color: 'from-green-500 to-blue-500' },
    { label: 'Minutes', value: '2.4k', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { label: 'Level', value: '8', icon: Trophy, color: 'from-orange-500 to-red-500' },
  ];

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Completed your first meditation session', date: '2024-03-15', type: 'milestone' },
    { id: 2, title: 'Week Warrior', description: 'Meditated for 7 consecutive days', date: '2024-03-22', type: 'streak' },
    { id: 3, title: 'Mood Master', description: 'Completed 30 mood check-ins', date: '2024-04-01', type: 'consistency' },
    { id: 4, title: 'Zen Explorer', description: 'Tried 5 different meditation styles', date: '2024-04-10', type: 'exploration' },
  ];

  const recentActivities = [
    { id: 1, activity: 'Completed Morning Meditation', time: '2 hours ago', type: 'meditation' },
    { id: 2, activity: 'Logged mood as "Peaceful"', time: '4 hours ago', type: 'mood' },
    { id: 3, activity: 'Finished Breathing Exercise', time: '1 day ago', type: 'exercise' },
    { id: 4, activity: 'Set new wellness goal', time: '2 days ago', type: 'goal' },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-gradient-to-r from-purple-50 to-blue-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {userData.name}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {userData.email}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Member since {userData.joinDate}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setEditMode(!editMode)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-white text-gray-600'}`}
          >
            <Edit className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Activities
        </h4>
        <div className="space-y-3">
          {recentActivities.slice(0, 4).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'meditation' ? 'bg-purple-500' :
                  activity.type === 'mood' ? 'bg-blue-500' :
                  activity.type === 'exercise' ? 'bg-green-500' : 'bg-orange-500'
                }`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {activity.activity}
                </p>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {activity.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Wellness Goals
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'}`}
        >
          Add Goal
        </motion.button>
      </div>

      {goals.map((goal) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {goal.title}
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {goal.current} / {goal.target} {goal.unit}
              </p>
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {goal.progress}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Achievements
      </h3>

      <div className="grid gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                achievement.type === 'milestone' ? 'from-yellow-400 to-orange-500' :
                achievement.type === 'streak' ? 'from-green-400 to-blue-500' :
                achievement.type === 'consistency' ? 'from-purple-400 to-pink-500' :
                'from-blue-400 to-purple-500'
              } flex items-center justify-center`}>
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {achievement.description}
                </p>
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Earned on {new Date(achievement.date).toLocaleDateString()}
                </p>
                {achievement.type === 'streak' && (
                  <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                  }`}>
                    🔥 Streak Achievement
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Settings
      </h3>

      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <h4 className={`font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Settings className="w-4 h-4 mr-2" />
          Privacy & Data
        </h4>
        <div className="space-y-3">
          {[
            { label: 'Data Analytics', description: 'Allow anonymous usage analytics' },
            { label: 'Mood Sharing', description: 'Share mood data with wellness coach' },
            { label: 'Progress Insights', description: 'Receive AI-powered insights' },
            { label: 'Community Features', description: 'Join community challenges' },
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {setting.label}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {setting.description}
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  defaultChecked={index < 2}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <h4 className={`font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Calendar className="w-4 h-4 mr-2" />
          Notification Preferences
        </h4>
        <div className="space-y-3">
          {[
            { label: 'Daily Reminders', description: 'Meditation and mood check-in reminders' },
            { label: 'Progress Updates', description: 'Weekly progress summaries' },
            { label: 'Achievement Alerts', description: 'When you unlock new achievements' },
            { label: 'Community Updates', description: 'Updates from your wellness community' },
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {setting.label}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {setting.description}
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  defaultChecked={index < 3}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-4xl max-h-[90vh] mx-4 rounded-2xl shadow-2xl overflow-hidden ${
              isDarkMode ? 'bg-slate-900' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  User Profile
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mt-6">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : isDarkMode
                          ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'dashboard' && renderDashboard()}
                  {activeTab === 'goals' && renderGoals()}
                  {activeTab === 'achievements' && renderAchievements()}
                  {activeTab === 'settings' && renderSettings()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal;
