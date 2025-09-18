'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  Calendar,
  Clock,
  FileText,
  Heart,
  LogOut,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  TrendingUp,
  Users
} from 'lucide-react';
import { useState } from 'react';

// Import modals
import CrisisInterventionModal from '@/components/modals/CrisisInterventionModal';
import StudentManagementModal from '@/components/modals/StudentManagementModal';

export default function CounselorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedCrisisStudent, setSelectedCrisisStudent] = useState<any>(null);

  // Mock data for demonstration
  const mockData = {
    stats: {
      totalStudents: 24,
      activeAppointments: 8,
      crisisAlerts: 2,
      weeklyTrend: '+12%'
    },
    recentStudents: [
      { id: 1, name: 'Sarah M.', status: 'Stable', lastSession: '2 days ago', riskLevel: 'low' },
      { id: 2, name: 'John D.', status: 'Needs Follow-up', lastSession: '1 day ago', riskLevel: 'medium' },
      { id: 3, name: 'Emma R.', status: 'Crisis Alert', lastSession: '3 hours ago', riskLevel: 'high' },
      { id: 4, name: 'Michael S.', status: 'Improving', lastSession: '4 days ago', riskLevel: 'low' }
    ],
    upcomingAppointments: [
      { id: 1, student: 'Sarah M.', time: '10:00 AM', type: 'Follow-up Session', duration: '50 min' },
      { id: 2, student: 'Alex T.', time: '2:00 PM', type: 'Initial Assessment', duration: '60 min' },
      { id: 3, student: 'Lisa K.', time: '4:00 PM', type: 'Crisis Intervention', duration: '45 min' }
    ],
    crisisAlerts: [
      { id: 1, student: 'Emma R.', alert: 'Severe anxiety episode detected', time: '3 hours ago', severity: 'high' },
      { id: 2, student: 'David L.', alert: 'Depression indicators elevated', time: '6 hours ago', severity: 'medium' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'crisis', label: 'Crisis Alerts', icon: AlertTriangle },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'plans', label: 'Treatment Plans', icon: FileText }
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Counselor Portal</h1>
                <p className="text-sm text-gray-500">Dr. Sarah Johnson, PhD</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <Settings className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <LogOut className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.stats.activeAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crisis Alerts</p>
                <p className="text-2xl font-bold text-red-600">{mockData.stats.crisisAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Trend</p>
                <p className="text-2xl font-bold text-green-600">{mockData.stats.weeklyTrend}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Crisis Alerts */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg shadow"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Recent Crisis Alerts</h3>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mockData.crisisAlerts.map((alert) => (
                      <div key={alert.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                              alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                            }`} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{alert.student}</p>
                              <p className="text-sm text-gray-600">{alert.alert}</p>
                              <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                            </div>
                          </div>
                      <button 
                        onClick={() => {
                          setSelectedCrisisStudent({
                            name: alert.student,
                            alert: alert.alert,
                            severity: alert.severity,
                            time: alert.time
                          });
                          setOpenModal('crisis');
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700"
                      >
                        Respond
                      </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Students */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg shadow"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Recent Student Activity</h3>
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search students..."
                          className="border border-gray-300 rounded px-3 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mockData.recentStudents.map((student) => (
                      <div key={student.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.status}</p>
                            <p className="text-xs text-gray-500">Last session: {student.lastSession}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(student.riskLevel)}`}>
                              {student.riskLevel.toUpperCase()}
                            </span>
                            <button 
                              onClick={() => setOpenModal('students')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === 'students' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Student Case Management</h3>
                    <button 
                      onClick={() => setOpenModal('students')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Student</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">Student management interface would go here...</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'appointments' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Appointment Scheduling</h3>
                    <button 
                      onClick={() => alert('Appointment scheduling system - Book new sessions, manage calendar, and coordinate with students')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Schedule Appointment</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">Appointment management interface would go here...</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Appointments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Today&apos;s Appointments</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {mockData.upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{appointment.student}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{appointment.time} • {appointment.duration}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert('Join virtual therapy session with ' + appointment.student)}
                        className="text-green-600 hover:text-green-700 text-xs font-medium"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button 
                  onClick={() => {
                    setSelectedCrisisStudent({
                      name: 'Emergency Patient',
                      alert: 'Manual emergency session requested',
                      severity: 'high',
                      time: 'Now'
                    });
                    setOpenModal('crisis');
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <PlusCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Schedule Emergency Session</span>
                </button>
                <button 
                  onClick={() => alert('Treatment Plan Creator - Design personalized therapy plans with goals, interventions, and progress tracking')}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Create Treatment Plan</span>
                </button>
                <button 
                  onClick={() => alert('Secure Messaging System - Send HIPAA-compliant messages to students and colleagues')}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">Send Secure Message</span>
                </button>
                <button 
                  onClick={() => alert('Report Generator - Create progress reports, session summaries, and treatment outcomes')}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium">Generate Report</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        <CrisisInterventionModal
          isOpen={openModal === 'crisis'}
          onClose={() => setOpenModal(null)}
          student={selectedCrisisStudent}
        />
        <StudentManagementModal
          isOpen={openModal === 'students'}
          onClose={() => setOpenModal(null)}
        />
      </div>
    </div>
  );
}