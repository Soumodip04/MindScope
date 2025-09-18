'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, AlertTriangle, BarChart3, Brain, Clock, TrendingDown, TrendingUp, Users, X } from 'lucide-react';
import { useState } from 'react';

interface PlatformAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlatformAnalyticsModal({ isOpen, onClose }: PlatformAnalyticsModalProps) {
  const [activeTimeframe, setActiveTimeframe] = useState('7d');
  
  const timeframes = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' }
  ];

  const analytics = {
    overview: {
      totalSessions: { current: 45892, change: 24, trend: 'up' },
      activeUsers: { current: 2847, change: 12, trend: 'up' },
      avgSessionTime: { current: '18m 42s', change: -3, trend: 'down' },
      crisisInterventions: { current: 23, change: 8, trend: 'up' }
    },
    userEngagement: [
      { name: 'Therapy Sessions', value: 15420, percentage: 34, color: 'bg-blue-500' },
      { name: 'Wellness Tracking', value: 12680, percentage: 28, color: 'bg-green-500' },
      { name: 'AI Conversations', value: 8940, percentage: 19, color: 'bg-purple-500' },
      { name: 'Community Support', value: 5210, percentage: 11, color: 'bg-yellow-500' },
      { name: 'Crisis Support', value: 3642, percentage: 8, color: 'bg-red-500' }
    ],
    peakUsage: [
      { hour: '9 AM', sessions: 340 },
      { hour: '12 PM', sessions: 520 },
      { hour: '3 PM', sessions: 680 },
      { hour: '6 PM', sessions: 890 },
      { hour: '9 PM', sessions: 750 },
      { hour: '12 AM', sessions: 210 }
    ],
    outcomes: {
      improved: 78,
      stable: 18,
      concerning: 4
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Platform Analytics</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Timeframe Selector */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex space-x-2">
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe.id}
                      onClick={() => setActiveTimeframe(timeframe.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTimeframe === timeframe.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {timeframe.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Sessions</p>
                        <p className="text-2xl font-bold text-blue-900">{analytics.overview.totalSessions.current.toLocaleString()}</p>
                        <div className="flex items-center mt-1">
                          {(() => {
                            const TrendIcon = getTrendIcon(analytics.overview.totalSessions.trend);
                            return (
                              <>
                                <TrendIcon className={`w-4 h-4 mr-1 ${getTrendColor(analytics.overview.totalSessions.trend)}`} />
                                <span className={`text-sm font-medium ${getTrendColor(analytics.overview.totalSessions.trend)}`}>
                                  {analytics.overview.totalSessions.change}%
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <Activity className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Active Users</p>
                        <p className="text-2xl font-bold text-green-900">{analytics.overview.activeUsers.current.toLocaleString()}</p>
                        <div className="flex items-center mt-1">
                          {(() => {
                            const TrendIcon = getTrendIcon(analytics.overview.activeUsers.trend);
                            return (
                              <>
                                <TrendIcon className={`w-4 h-4 mr-1 ${getTrendColor(analytics.overview.activeUsers.trend)}`} />
                                <span className={`text-sm font-medium ${getTrendColor(analytics.overview.activeUsers.trend)}`}>
                                  {analytics.overview.activeUsers.change}%
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <Users className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Avg Session Time</p>
                        <p className="text-2xl font-bold text-purple-900">{analytics.overview.avgSessionTime.current}</p>
                        <div className="flex items-center mt-1">
                          {(() => {
                            const TrendIcon = getTrendIcon(analytics.overview.avgSessionTime.trend);
                            return (
                              <>
                                <TrendIcon className={`w-4 h-4 mr-1 ${getTrendColor(analytics.overview.avgSessionTime.trend)}`} />
                                <span className={`text-sm font-medium ${getTrendColor(analytics.overview.avgSessionTime.trend)}`}>
                                  {Math.abs(analytics.overview.avgSessionTime.change)}%
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <Clock className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">Crisis Interventions</p>
                        <p className="text-2xl font-bold text-red-900">{analytics.overview.crisisInterventions.current}</p>
                        <div className="flex items-center mt-1">
                          {(() => {
                            const TrendIcon = getTrendIcon(analytics.overview.crisisInterventions.trend);
                            return (
                              <>
                                <TrendIcon className={`w-4 h-4 mr-1 ${getTrendColor(analytics.overview.crisisInterventions.trend)}`} />
                                <span className={`text-sm font-medium ${getTrendColor(analytics.overview.crisisInterventions.trend)}`}>
                                  {analytics.overview.crisisInterventions.change}%
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* User Engagement */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
                    <div className="space-y-4">
                      {analytics.userEngagement.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.color}`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">{item.percentage}%</span>
                            <span className="text-sm font-medium text-gray-900 w-16 text-right">
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Peak Usage Times */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Usage Times</h3>
                    <div className="space-y-3">
                      {analytics.peakUsage.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{item.hour}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-blue-500"
                                style={{ width: `${(item.sessions / 890) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900 w-12 text-right">
                              {item.sessions}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mental Health Outcomes */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Mental Health Outcomes</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Improved</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">{analytics.outcomes.improved}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Stable</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{analytics.outcomes.stable}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Concerning</span>
                        </div>
                        <span className="text-2xl font-bold text-red-600">{analytics.outcomes.concerning}%</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>78%</strong> of users show measurable improvement in mental health metrics after 30 days of platform usage.
                      </p>
                    </div>
                  </div>

                  {/* AI Performance Metrics */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Emotion Detection Accuracy</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '96.7%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-green-600">96.7%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Risk Assessment Accuracy</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '94.2%' }}></div>
                          </div>
                          <span className="text-sm font-bold text-green-600">94.2%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Response Time</span>
                        <span className="text-sm font-bold text-blue-600">&lt; 200ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Daily Analyses</span>
                        <span className="text-sm font-bold text-purple-600">45,892</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Brain className="w-5 h-5 text-blue-600 mr-2" />
                        <p className="text-sm text-blue-800">
                          AI models are performing at 95%+ accuracy with continuous learning improvements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleString()}
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Export Report
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
