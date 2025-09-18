'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, AlertCircle, Brain, CheckCircle, Pause, Play, RefreshCw, Settings, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';

interface AIModelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIModelsModal({ isOpen, onClose }: AIModelsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const aiModels = [
    {
      id: 1,
      name: 'Emotion Detection Model',
      version: 'v2.3.1',
      accuracy: 96.7,
      status: 'active',
      lastTrained: '2 days ago',
      predictions: 32156,
      confidence: 94.2,
      description: 'Advanced neural network for real-time emotion recognition from text and facial expressions'
    },
    {
      id: 2,
      name: 'Crisis Risk Assessment',
      version: 'v1.8.4',
      accuracy: 94.2,
      status: 'active',
      lastTrained: '1 week ago',
      predictions: 13736,
      confidence: 91.8,
      description: 'Multi-modal AI system for identifying potential crisis situations and suicide risk factors'
    },
    {
      id: 3,
      name: 'Therapy Recommendation Engine',
      version: 'v3.1.0',
      accuracy: 89.5,
      status: 'training',
      lastTrained: '3 hours ago',
      predictions: 8924,
      confidence: 87.3,
      description: 'Personalized treatment and intervention recommendation system based on user history and preferences'
    },
    {
      id: 4,
      name: 'Natural Language Processing',
      version: 'v2.7.2',
      accuracy: 92.1,
      status: 'active',
      lastTrained: '5 days ago',
      predictions: 45892,
      confidence: 89.6,
      description: 'Advanced NLP model for understanding context, sentiment, and intent in therapeutic conversations'
    },
    {
      id: 5,
      name: 'Behavioral Pattern Analysis',
      version: 'v1.4.6',
      accuracy: 88.9,
      status: 'maintenance',
      lastTrained: '2 weeks ago',
      predictions: 7234,
      confidence: 85.7,
      description: 'Machine learning system for identifying behavioral patterns and anomalies in user activity'
    }
  ];

  const performanceMetrics = {
    totalPredictions: 108942,
    avgResponseTime: 187,
    accuracy: 93.2,
    uptime: 99.7,
    trainingJobs: 12,
    activeModels: 4
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'training': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'training': return RefreshCw;
      case 'maintenance': return Settings;
      case 'inactive': return AlertCircle;
      default: return AlertCircle;
    }
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
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6" />
                  <h2 className="text-xl font-bold">AI Models Configuration</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Performance Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{performanceMetrics.totalPredictions.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Predictions Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{performanceMetrics.avgResponseTime}ms</p>
                    <p className="text-xs text-gray-600">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{performanceMetrics.accuracy}%</p>
                    <p className="text-xs text-gray-600">Overall Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{performanceMetrics.uptime}%</p>
                    <p className="text-xs text-gray-600">System Uptime</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{performanceMetrics.trainingJobs}</p>
                    <p className="text-xs text-gray-600">Training Jobs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{performanceMetrics.activeModels}</p>
                    <p className="text-xs text-gray-600">Active Models</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Model Overview' },
                    { id: 'training', label: 'Training & Deployment' },
                    { id: 'monitoring', label: 'Performance Monitoring' },
                    { id: 'configuration', label: 'Model Configuration' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[65vh]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {aiModels.map((model) => {
                        const StatusIcon = getStatusIcon(model.status);
                        return (
                          <div key={model.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <Brain className="w-5 h-5 text-purple-500" />
                                  <h4 className="text-lg font-semibold text-gray-900">{model.name}</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                                <div className="flex items-center space-x-2 mb-3">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(model.status)}`}>
                                    <StatusIcon className="w-3 h-3 inline mr-1" />
                                    {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                                  </span>
                                  <span className="text-xs text-gray-500">Version {model.version}</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500">Accuracy</p>
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${model.accuracy}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-bold text-green-600">{model.accuracy}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Confidence</p>
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${model.confidence}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-bold text-blue-600">{model.confidence}%</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                              <span>Predictions: {model.predictions.toLocaleString()}</span>
                              <span>Last trained: {model.lastTrained}</span>
                            </div>

                            <div className="flex space-x-2">
                              {model.status === 'active' ? (
                                <button className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 flex items-center justify-center space-x-1">
                                  <Pause className="w-4 h-4" />
                                  <span>Pause</span>
                                </button>
                              ) : (
                                <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center justify-center space-x-1">
                                  <Play className="w-4 h-4" />
                                  <span>Activate</span>
                                </button>
                              )}
                              <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center space-x-1">
                                <Settings className="w-4 h-4" />
                                <span>Configure</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'training' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-blue-900 mb-4">Active Training Jobs</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                            <div>
                              <p className="font-medium text-gray-900">Therapy Recommendation Engine v3.1.1</p>
                              <p className="text-sm text-gray-600">Training with new dataset (12,000 samples)</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-600">73% Complete</p>
                            <p className="text-xs text-gray-500">~2 hours remaining</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <Activity className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="font-medium text-gray-900">Emotion Detection Model v2.3.2</p>
                              <p className="text-sm text-gray-600">Fine-tuning with multilingual data</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">Queue (Position 1)</p>
                            <p className="text-xs text-gray-500">Starts in ~2 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Training History</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-gray-700">Crisis Risk Assessment v1.8.4</span>
                            <span className="text-xs text-green-600">✓ Completed</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-gray-700">NLP Model v2.7.2</span>
                            <span className="text-xs text-green-600">✓ Completed</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-gray-700">Behavioral Analysis v1.4.6</span>
                            <span className="text-xs text-red-600">✗ Failed</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2">
                            <Brain className="w-4 h-4" />
                            <span>Start New Training Job</span>
                          </button>
                          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                            <RefreshCw className="w-4 h-4" />
                            <span>Retrain Existing Model</span>
                          </button>
                          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                            <Play className="w-4 h-4" />
                            <span>Deploy Model</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'monitoring' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Average Accuracy</p>
                            <p className="text-2xl font-bold text-green-900">93.2%</p>
                            <div className="flex items-center mt-1">
                              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-sm text-green-600">+2.1%</span>
                            </div>
                          </div>
                          <Activity className="w-8 h-8 text-green-500" />
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Response Time</p>
                            <p className="text-2xl font-bold text-blue-900">187ms</p>
                            <div className="flex items-center mt-1">
                              <TrendingUp className="w-4 h-4 text-red-600 mr-1" />
                              <span className="text-sm text-red-600">+12ms</span>
                            </div>
                          </div>
                          <Brain className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">Model Uptime</p>
                            <p className="text-2xl font-bold text-purple-900">99.7%</p>
                            <div className="flex items-center mt-1">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-sm text-green-600">Excellent</span>
                            </div>
                          </div>
                          <CheckCircle className="w-8 h-8 text-purple-500" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Real-time Performance</h4>
                      <div className="space-y-4">
                        {aiModels.filter(m => m.status === 'active').map((model) => (
                          <div key={model.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="font-medium text-gray-900">{model.name}</span>
                            </div>
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="text-center">
                                <p className="text-gray-500">Requests/min</p>
                                <p className="font-bold text-gray-900">{Math.floor(model.predictions / 1440)}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-500">Accuracy</p>
                                <p className="font-bold text-green-600">{model.accuracy}%</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-500">Latency</p>
                                <p className="font-bold text-blue-600">~200ms</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'configuration' && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                        <p className="text-yellow-800 font-medium">
                          Changes to model configuration require administrator approval and may affect system performance.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Global Settings</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confidence Threshold
                            </label>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              defaultValue="85" 
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>Current: 85%</span>
                              <span>100%</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Max Response Time
                            </label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg">
                              <option>500ms</option>
                              <option>1000ms</option>
                              <option>2000ms</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Auto-scaling</span>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Model Priorities</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Crisis Risk Assessment</span>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Critical</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Emotion Detection</span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">High</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">NLP Processing</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Medium</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Behavioral Analysis</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Low</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  AI models operational • Last sync: {new Date().toLocaleTimeString()}
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Apply Changes
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
