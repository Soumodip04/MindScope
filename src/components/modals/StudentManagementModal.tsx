'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Clock, FileText, Heart, TrendingUp, User, X } from 'lucide-react';
import { useState } from 'react';

interface StudentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentManagementModal({ isOpen, onClose }: StudentManagementModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const students = [
    {
      id: 1,
      name: 'Sarah Martinez',
      email: 'sarah.m@student.university.edu',
      status: 'Stable',
      riskLevel: 'low',
      lastSession: '2 days ago',
      nextAppointment: 'Tomorrow 10:00 AM',
      progress: 85,
      sessionsCompleted: 12,
      totalSessions: 15,
      currentGoals: ['Anxiety management', 'Sleep improvement'],
      recentMood: 'Improving',
      medicationCompliance: 95,
      emergencyContact: 'Maria Martinez (Mother) - 555-0123'
    },
    {
      id: 2,
      name: 'David Chen',
      email: 'david.c@student.university.edu',
      status: 'Needs Follow-up',
      riskLevel: 'medium',
      lastSession: '1 day ago',
      nextAppointment: 'Friday 2:00 PM',
      progress: 60,
      sessionsCompleted: 8,
      totalSessions: 12,
      currentGoals: ['Depression management', 'Academic stress'],
      recentMood: 'Fluctuating',
      medicationCompliance: 80,
      emergencyContact: 'Li Chen (Father) - 555-0456'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.r@student.university.edu',
      status: 'Crisis Alert',
      riskLevel: 'high',
      lastSession: '3 hours ago',
      nextAppointment: 'Today 4:00 PM (Emergency)',
      progress: 40,
      sessionsCompleted: 5,
      totalSessions: 10,
      currentGoals: ['Crisis stabilization', 'Safety planning'],
      recentMood: 'Critical concern',
      medicationCompliance: 60,
      emergencyContact: 'Carlos Rodriguez (Father) - 555-0789'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
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
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Student Management</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Student Overview' },
                    { id: 'details', label: 'Detailed View' },
                    { id: 'progress', label: 'Progress Tracking' },
                    { id: 'notes', label: 'Session Notes' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-green-500 text-green-600'
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
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Total Students</p>
                            <p className="text-2xl font-bold text-blue-900">{students.length}</p>
                          </div>
                          <User className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Stable</p>
                            <p className="text-2xl font-bold text-green-900">
                              {students.filter(s => s.status === 'Stable').length}
                            </p>
                          </div>
                          <Heart className="w-8 h-8 text-green-500" />
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-yellow-600 font-medium">Need Follow-up</p>
                            <p className="text-2xl font-bold text-yellow-900">
                              {students.filter(s => s.status === 'Needs Follow-up').length}
                            </p>
                          </div>
                          <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-red-600 font-medium">Crisis Alerts</p>
                            <p className="text-2xl font-bold text-red-900">
                              {students.filter(s => s.status === 'Crisis Alert').length}
                            </p>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                      </div>
                    </div>

                    {/* Student List */}
                    <div className="space-y-4">
                      {students.map((student) => (
                        <div key={student.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">{student.name}</h4>
                                  <p className="text-sm text-gray-600">{student.email}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRiskColor(student.riskLevel)}`}>
                                  {student.riskLevel.toUpperCase()} RISK
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Treatment Progress</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(student.progress)}`}
                                        style={{ width: `${student.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{student.progress}%</span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {student.sessionsCompleted}/{student.totalSessions} sessions
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Current Status</p>
                                  <p className="text-sm font-medium text-gray-900 mt-1">{student.status}</p>
                                  <p className="text-xs text-gray-600">Recent mood: {student.recentMood}</p>
                                </div>

                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Next Appointment</p>
                                  <p className="text-sm font-medium text-gray-900 mt-1">{student.nextAppointment}</p>
                                  <p className="text-xs text-gray-600">Last seen: {student.lastSession}</p>
                                </div>
                              </div>

                              <div className="mb-3">
                                <p className="text-xs text-gray-500 font-medium mb-1">Current Goals</p>
                                <div className="flex flex-wrap gap-2">
                                  {student.currentGoals.map((goal, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                      {goal}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="ml-6 flex flex-col space-y-2">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                              >
                                View Details
                              </button>
                              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                Schedule Session
                              </button>
                              <button className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm">
                                Send Message
                              </button>
                              {student.riskLevel === 'high' && (
                                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                                  Crisis Protocol
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'details' && selectedStudent && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {selectedStudent.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                            <p className="text-gray-600">{selectedStudent.email}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRiskColor(selectedStudent.riskLevel)}`}>
                                {selectedStudent.riskLevel.toUpperCase()} RISK
                              </span>
                              <span className="text-sm text-gray-600">•</span>
                              <span className="text-sm text-gray-600">{selectedStudent.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Treatment Information</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Sessions Completed:</span>
                              <span className="font-medium">{selectedStudent.sessionsCompleted}/{selectedStudent.totalSessions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Treatment Progress:</span>
                              <span className="font-medium">{selectedStudent.progress}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Session:</span>
                              <span className="font-medium">{selectedStudent.lastSession}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Next Appointment:</span>
                              <span className="font-medium">{selectedStudent.nextAppointment}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Medication Compliance:</span>
                              <span className="font-medium">{selectedStudent.medicationCompliance}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="text-gray-600">Email:</span>
                              <p className="font-medium">{selectedStudent.email}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Emergency Contact:</span>
                              <p className="font-medium">{selectedStudent.emergencyContact}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Recent Mood:</span>
                              <p className="font-medium">{selectedStudent.recentMood}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Current Treatment Goals</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedStudent.currentGoals.map((goal: string, index: number) => (
                            <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'progress' && (
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Tracking</h3>
                      <p className="text-gray-600">
                        Detailed progress charts and analytics would be displayed here,<br />
                        showing mood trends, session outcomes, and treatment effectiveness.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Session Notes</h3>
                      <p className="text-gray-600">
                        Detailed session notes, treatment plans, and clinical observations<br />
                        would be displayed here with proper privacy controls.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {students.length} students under care • Last updated: {new Date().toLocaleTimeString()}
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Export Student Data
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
