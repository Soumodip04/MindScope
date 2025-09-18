'use client';

import { motion } from 'framer-motion';
import {
    Activity,
    BarChart3,
    Brain,
    Database,
    Settings,
    Shield,
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Import modals
import AIModelsModal from '@/components/modals/AIModelsModal';
import PlatformAnalyticsModal from '@/components/modals/PlatformAnalyticsModal';
import SecurityDashboardModal from '@/components/modals/SecurityDashboardModal';
import UserManagementModal from '@/components/modals/UserManagementModal';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [openModal, setOpenModal] = useState<string | null>(null);

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'blue', breakdown: 'Students: 2,340 | Counselors: 487 | Admins: 20' },
    { label: 'Platform Sessions', value: '1,234', change: '+8%', icon: Activity, color: 'green', breakdown: 'Therapy: 890 | Assessment: 344' },
    { label: 'AI Analyses', value: '45,892', change: '+24%', icon: Brain, color: 'purple', breakdown: 'Emotion: 32,156 | Risk: 13,736' },
    { label: 'System Uptime', value: '99.8%', change: '+0.2%', icon: Zap, color: 'yellow', breakdown: 'Last 30 days performance' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      green: 'bg-green-500/20 text-green-300 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
      
      {/* Header */}
      <header className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-b border-purple-500/20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MindScope Admin</h1>
                <p className="text-gray-300 text-sm">Administrator Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm">
                System Online
              </div>
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border backdrop-blur-lg ${getColorClasses(stat.color)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8" />
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-300 text-sm mb-2">{stat.label}</p>
              <p className="text-gray-400 text-xs">{stat.breakdown}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Platform Management</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">User Role Distribution</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Students:</span>
                    <span>2,340 (82%)</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Counselors:</span>
                    <span>487 (17%)</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Admins:</span>
                    <span>20 (1%)</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Counselor Verification</h4>
                <p className="text-gray-300 text-sm">12 pending license verifications</p>
                <p className="text-yellow-300 text-xs mt-1">⚠️ Requires review</p>
              </div>
              
              <button 
                onClick={() => setOpenModal('users')}
                className="w-full py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Manage User Roles
              </button>
            </div>
          </motion.div>

          {/* AI System Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">AI System Analytics</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Model Performance</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Emotion Detection:</span>
                    <span className="text-green-300">96.7%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Risk Assessment:</span>
                    <span className="text-green-300">94.2%</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Processing Volume</h4>
                <p className="text-gray-300 text-sm">45,892 analyses today</p>
                <p className="text-green-300 text-xs mt-1">↗️ 24% increase</p>
              </div>
              
              <button 
                onClick={() => setOpenModal('ai')}
                className="w-full py-2 bg-purple-500/20 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                Configure AI Models
              </button>
            </div>
          </motion.div>

          {/* Security & Compliance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">Security & Compliance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">HIPAA Compliance</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">All systems compliant</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Data Encryption</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-300 text-sm">AES-256 active</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Last Security Audit</h4>
                <p className="text-gray-300 text-sm">3 days ago</p>
                <p className="text-green-300 text-xs mt-1">✓ No vulnerabilities</p>
              </div>
              
              <button 
                onClick={() => setOpenModal('security')}
                className="w-full py-2 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                Security Dashboard
              </button>
            </div>
          </motion.div>
        </div>

        {/* Administrative Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Administrative Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setOpenModal('analytics')}
              className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center space-x-3"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Platform Analytics</span>
            </button>
            
            <button 
              onClick={() => alert('Data Management functionality - Export/Import user data, session logs, and analytics reports')}
              className="p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center space-x-3"
            >
              <Database className="w-5 h-5" />
              <span>Data Management</span>
            </button>
            
            <button 
              onClick={() => alert('System Configuration - Manage platform settings, API keys, integrations, and system parameters')}
              className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors flex items-center space-x-3"
            >
              <Settings className="w-5 h-5" />
              <span>System Configuration</span>
            </button>
            
            <button 
              onClick={() => setOpenModal('security')}
              className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-300 hover:bg-yellow-500/30 transition-colors flex items-center space-x-3"
            >
              <Shield className="w-5 h-5" />
              <span>Security Audit</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <button 
              onClick={() => setOpenModal('users')}
              className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors flex items-center space-x-3"
            >
              <Users className="w-5 h-5" />
              <span>User Administration</span>
            </button>
            
            <button 
              onClick={() => setOpenModal('ai')}
              className="p-4 bg-indigo-500/20 border border-indigo-500/50 rounded-lg text-indigo-300 hover:bg-indigo-500/30 transition-colors flex items-center space-x-3"
            >
              <Brain className="w-5 h-5" />
              <span>AI Model Training</span>
            </button>
            
            <button 
              onClick={() => alert('Performance Monitor - Real-time system performance metrics, server health, and resource usage')}
              className="p-4 bg-teal-500/20 border border-teal-500/50 rounded-lg text-teal-300 hover:bg-teal-500/30 transition-colors flex items-center space-x-3"
            >
              <Activity className="w-5 h-5" />
              <span>Performance Monitor</span>
            </button>
            
            <button 
              onClick={() => alert('Crisis Escalation - Emergency response protocols, counselor alerts, and intervention workflows')}
              className="p-4 bg-orange-500/20 border border-orange-500/50 rounded-lg text-orange-300 hover:bg-orange-500/30 transition-colors flex items-center space-x-3"
            >
              <Zap className="w-5 h-5" />
              <span>Crisis Escalation</span>
            </button>
          </div>
        </motion.div>

        {/* Modals */}
        <UserManagementModal 
          isOpen={openModal === 'users'} 
          onClose={() => setOpenModal(null)} 
        />
        <PlatformAnalyticsModal 
          isOpen={openModal === 'analytics'} 
          onClose={() => setOpenModal(null)} 
        />
        <SecurityDashboardModal 
          isOpen={openModal === 'security'} 
          onClose={() => setOpenModal(null)} 
        />
        <AIModelsModal 
          isOpen={openModal === 'ai'} 
          onClose={() => setOpenModal(null)} 
        />
      </div>
    </div>
  );
}