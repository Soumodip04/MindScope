'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Shield, UserCheck, Users, X } from 'lucide-react';
import { useState } from 'react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserManagementModal({ isOpen, onClose }: UserManagementModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const users = [
    { id: 1, name: 'Emma Rodriguez', email: 'emma.r@student.university.edu', role: 'Student', status: 'Active', lastLogin: '2 hours ago', riskLevel: 'High', verified: true },
    { id: 2, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu', role: 'Counselor', status: 'Active', lastLogin: '30 mins ago', riskLevel: 'N/A', verified: true },
    { id: 3, name: 'Michael Chen', email: 'michael.c@student.university.edu', role: 'Student', status: 'Active', lastLogin: '1 day ago', riskLevel: 'Low', verified: true },
    { id: 4, name: 'Dr. James Wilson', email: 'james.wilson@university.edu', role: 'Counselor', status: 'Pending', lastLogin: 'Never', riskLevel: 'N/A', verified: false },
    { id: 5, name: 'Lisa Park', email: 'lisa.p@student.university.edu', role: 'Student', status: 'Inactive', lastLogin: '7 days ago', riskLevel: 'Medium', verified: true },
    { id: 6, name: 'Admin User', email: 'admin@university.edu', role: 'Admin', status: 'Active', lastLogin: '5 mins ago', riskLevel: 'N/A', verified: true }
  ];

  const pendingVerifications = [
    { id: 1, name: 'Dr. James Wilson', credentials: 'PhD Psychology, Licensed Clinical Psychologist', documents: ['License.pdf', 'Diploma.pdf'], submitted: '2 days ago' },
    { id: 2, name: 'Dr. Maria Garcia', credentials: 'LCSW, MS Social Work', documents: ['License.pdf', 'Certificate.pdf'], submitted: '1 day ago' },
    { id: 3, name: 'Dr. Robert Kim', credentials: 'PhD Clinical Psychology, ABPP Board Certified', documents: ['License.pdf', 'Board_Cert.pdf'], submitted: '3 hours ago' }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Counselor': return 'bg-blue-100 text-blue-800';
      case 'Student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6" />
                  <h2 className="text-xl font-bold">User Management</h2>
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
                    { id: 'overview', label: 'User Overview' },
                    { id: 'verification', label: 'Pending Verifications' },
                    { id: 'security', label: 'Security Actions' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Total Users</p>
                            <p className="text-2xl font-bold text-blue-900">2,847</p>
                          </div>
                          <Users className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Active Students</p>
                            <p className="text-2xl font-bold text-green-900">2,340</p>
                          </div>
                          <UserCheck className="w-8 h-8 text-green-500" />
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600 font-medium">Counselors</p>
                            <p className="text-2xl font-bold text-purple-900">487</p>
                          </div>
                          <Shield className="w-8 h-8 text-purple-500" />
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-red-600 font-medium">High Risk</p>
                            <p className="text-2xl font-bold text-red-900">23</p>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                      </div>
                    </div>

                    {/* User Table */}
                    <div className="bg-white rounded-lg border">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                      <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {user.riskLevel !== 'N/A' ? (
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(user.riskLevel)}`}>
                                      {user.riskLevel}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">N/A</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {user.lastLogin}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                                  <button className="text-blue-600 hover:text-blue-900">View</button>
                                  <button className="text-green-600 hover:text-green-900">Edit</button>
                                  {user.status === 'Active' && (
                                    <button className="text-red-600 hover:text-red-900">Suspend</button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'verification' && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                        <p className="text-yellow-800 font-medium">
                          {pendingVerifications.length} counselor verifications require review
                        </p>
                      </div>
                    </div>

                    {pendingVerifications.map((verification) => (
                      <div key={verification.id} className="bg-white border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{verification.name}</h4>
                            <p className="text-gray-600 mb-3">{verification.credentials}</p>
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Submitted Documents:</p>
                              <div className="flex flex-wrap gap-2">
                                {verification.documents.map((doc, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">Submitted: {verification.submitted}</p>
                          </div>
                          <div className="flex space-x-3 ml-4">
                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2">
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                              Review Documents
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h4 className="text-lg font-medium text-red-900 mb-4">High-Risk Users</h4>
                        <div className="space-y-3">
                          {users.filter(u => u.riskLevel === 'High').map((user) => (
                            <div key={user.id} className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-red-900">{user.name}</p>
                                <p className="text-sm text-red-700">Last active: {user.lastLogin}</p>
                              </div>
                              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                Flag for Review
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="text-lg font-medium text-blue-900 mb-4">Security Actions</h4>
                        <div className="space-y-3">
                          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Generate Security Report
                          </button>
                          <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                            Force Password Resets
                          </button>
                          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Audit User Activity
                          </button>
                          <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Emergency Lockdown
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
