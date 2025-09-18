'use client';

import { motion } from 'framer-motion';
import { BookOpen, Shield, Users, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Role</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Select your role to access the appropriate features and dashboard tailored to your needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl border-2 border-gray-600 bg-gray-800/50 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 flex flex-col justify-between min-h-[520px]"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">Student</h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">Access personalized mental wellness tools, emotion analysis, AI therapy sessions, and track your mental health journey.</p>
              
              <div className="text-left space-y-3 mb-8">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">Emotion Detection & Analysis</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">Personalized AI Therapy</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">Wellness Dashboard</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">Progress Tracking</span>
                </div>
              </div>
            </div>
            
            <Link href="/auth/signup?role=student">
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl text-base hover:from-blue-600 hover:to-cyan-600 transition-all">
                Continue as Student
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl border-2 border-gray-600 bg-gray-800/50 hover:border-green-400 hover:bg-green-500/10 transition-all duration-300 flex flex-col justify-between min-h-[520px]"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">Counselor</h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">Professional mental health support tools for licensed counselors to manage student cases and interventions.</p>
              
              <div className="text-left space-y-3 mb-8">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">Student Case Management</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">Appointment Scheduling</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">Crisis Alert System</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">Secure Messaging</span>
                </div>
              </div>
            </div>
            
            <Link href="/auth/counselor/signup">
              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl text-base hover:from-green-600 hover:to-emerald-600 transition-all">
                Continue as Counselor
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 rounded-2xl border-2 border-gray-600 bg-gray-800/50 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 flex flex-col justify-between min-h-[520px]"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">Administrator</h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">Manage the platform, monitor user wellness data, configure AI models, and oversee the mental health ecosystem.</p>
              
              <div className="text-left space-y-3 mb-8">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">User Management Dashboard</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">AI Model Configuration</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">Analytics & Reports</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-sm">System Monitoring</span>
                </div>
              </div>
            </div>
            
            <Link href="/auth/admin/signup">
              <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl text-base hover:from-purple-600 hover:to-pink-600 transition-all">
                Continue as Admin
              </button>
            </Link>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
