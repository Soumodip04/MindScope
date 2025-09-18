'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, Database, Eye, Key, Lock, Server, Shield, X } from 'lucide-react';
import { useState } from 'react';

interface SecurityDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecurityDashboardModal({ isOpen, onClose }: SecurityDashboardModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const securityStatus = {
    overall: 'excellent',
    lastAudit: '3 days ago',
    vulnerabilities: 0,
    threats: 2,
    compliance: 100
  };

  const auditLogs = [
    { id: 1, timestamp: '2024-01-15 14:23:45', event: 'User login from new device', user: 'emma.rodriguez@student.edu', risk: 'low', action: 'Email verification sent' },
    { id: 2, timestamp: '2024-01-15 13:45:12', event: 'Failed login attempt (3x)', user: 'suspicious.user@domain.com', risk: 'high', action: 'IP blocked automatically' },
    { id: 3, timestamp: '2024-01-15 12:30:22', event: 'Bulk data access', user: 'dr.johnson@university.edu', risk: 'medium', action: 'Access granted with logging' },
    { id: 4, timestamp: '2024-01-15 11:15:08', event: 'Password change', user: 'michael.chen@student.edu', risk: 'low', action: 'Confirmation email sent' },
    { id: 5, timestamp: '2024-01-15 10:45:33', event: 'Admin privilege escalation', user: 'admin@university.edu', risk: 'medium', action: '2FA verification required' }
  ];

  const complianceMetrics = [
    { standard: 'HIPAA', status: 'compliant', score: 100, lastCheck: '2 days ago' },
    { standard: 'FERPA', status: 'compliant', score: 100, lastCheck: '5 days ago' },
    { standard: 'SOC 2', status: 'compliant', score: 98, lastCheck: '1 week ago' },
    { standard: 'GDPR', status: 'compliant', score: 99, lastCheck: '3 days ago' },
    { standard: 'ISO 27001', status: 'compliant', score: 96, lastCheck: '1 week ago' }
  ];

  const threatDetection = [
    { type: 'Brute Force Attack', severity: 'high', count: 5, status: 'blocked', lastDetected: '2 hours ago' },
    { type: 'Suspicious Login Pattern', severity: 'medium', count: 12, status: 'monitoring', lastDetected: '4 hours ago' },
    { type: 'Data Exfiltration Attempt', severity: 'critical', count: 1, status: 'blocked', lastDetected: '6 hours ago' },
    { type: 'Malformed API Requests', severity: 'low', count: 23, status: 'filtered', lastDetected: '1 hour ago' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'blocked': return 'text-red-600';
      case 'monitoring': return 'text-yellow-600';
      case 'filtered': return 'text-blue-600';
      default: return 'text-gray-600';
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
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Security Dashboard</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Security Status Banner */}
              <div className="bg-green-50 border-b border-green-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Security Status: Excellent</h3>
                      <p className="text-sm text-green-700">All systems secure • Last audit: {securityStatus.lastAudit} • 0 vulnerabilities detected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{securityStatus.compliance}%</p>
                    <p className="text-sm text-green-700">Compliance Score</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Security Overview' },
                    { id: 'compliance', label: 'Compliance Status' },
                    { id: 'threats', label: 'Threat Detection' },
                    { id: 'audit', label: 'Audit Logs' }
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
                    {/* Security Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Data Encryption</p>
                            <p className="text-lg font-bold text-green-900">AES-256</p>
                            <p className="text-xs text-green-700">Active & Verified</p>
                          </div>
                          <Lock className="w-8 h-8 text-green-500" />
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Access Control</p>
                            <p className="text-lg font-bold text-blue-900">Multi-Factor</p>
                            <p className="text-xs text-blue-700">100% Coverage</p>
                          </div>
                          <Key className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">Network Security</p>
                            <p className="text-lg font-bold text-purple-900">WAF + DDoS</p>
                            <p className="text-xs text-purple-700">Protection Active</p>
                          </div>
                          <Shield className="w-8 h-8 text-purple-500" />
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-600">System Uptime</p>
                            <p className="text-lg font-bold text-orange-900">99.98%</p>
                            <p className="text-xs text-orange-700">Last 30 Days</p>
                          </div>
                          <Server className="w-8 h-8 text-orange-500" />
                        </div>
                      </div>
                    </div>

                    {/* Security Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Eye className="w-5 h-5 mr-2 text-blue-500" />
                          Monitoring & Detection
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Real-time Threat Detection</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Behavioral Analysis</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Anomaly Detection</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Log Analysis</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Database className="w-5 h-5 mr-2 text-purple-500" />
                          Data Protection
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">End-to-End Encryption</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Data Anonymization</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Backup Encryption</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Access Logging</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'compliance' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {complianceMetrics.map((metric) => (
                        <div key={metric.standard} className="bg-white border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{metric.standard}</h4>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          </div>
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">Compliance Score</span>
                              <span className="text-sm font-bold text-green-600">{metric.score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${metric.score}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Last checked: {metric.lastCheck}</p>
                          <div className="mt-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)} bg-green-100`}>
                              ✓ Compliant
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'threats' && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                        <p className="text-yellow-800 font-medium">
                          {threatDetection.length} threat types detected in the last 24 hours - All automatically mitigated
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {threatDetection.map((threat, index) => (
                        <div key={index} className="bg-white border rounded-lg p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{threat.type}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(threat.severity)}`}>
                                  {threat.severity.toUpperCase()}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-600">Incidents:</span>
                                  <span className="ml-2 font-bold text-gray-900">{threat.count}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Status:</span>
                                  <span className={`ml-2 font-bold ${getStatusColor(threat.status)}`}>
                                    {threat.status.charAt(0).toUpperCase() + threat.status.slice(1)}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Last Detected:</span>
                                  <span className="ml-2 text-gray-900">{threat.lastDetected}</span>
                                </div>
                              </div>
                            </div>
                            <button className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="space-y-6">
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Security Events</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Taken</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {auditLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {log.timestamp}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Activity className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-900">{log.event}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {log.user}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(log.risk)}`}>
                                    {log.risk.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {log.action}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Security monitoring active • Real-time updates enabled
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Download Security Report
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
