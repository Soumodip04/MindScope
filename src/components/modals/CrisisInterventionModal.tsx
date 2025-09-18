'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, Phone, Shield, X } from 'lucide-react';
import { useState } from 'react';

interface CrisisInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: {
    name: string;
    alert: string;
    severity: string;
    time: string;
  };
}

export default function CrisisInterventionModal({ isOpen, onClose, student }: CrisisInterventionModalProps) {
  const [interventionStep, setInterventionStep] = useState(1);
  const [interventionNotes, setInterventionNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const crisisProtocol = [
    {
      step: 1,
      title: 'Initial Assessment',
      description: 'Assess immediate danger and gather essential information',
      actions: [
        'Contact student immediately',
        'Assess suicide/self-harm risk',
        'Evaluate immediate safety',
        'Document risk level'
      ]
    },
    {
      step: 2,
      title: 'Intervention Planning',
      description: 'Develop immediate intervention strategy',
      actions: [
        'Create safety plan',
        'Identify support network',
        'Plan follow-up sessions',
        'Consider referrals'
      ]
    },
    {
      step: 3,
      title: 'Implementation',
      description: 'Execute intervention and ensure safety',
      actions: [
        'Implement safety measures',
        'Coordinate with support team',
        'Schedule immediate follow-up',
        'Document all actions'
      ]
    },
    {
      step: 4,
      title: 'Follow-up',
      description: 'Monitor progress and adjust plan',
      actions: [
        'Check-in within 24 hours',
        'Evaluate intervention effectiveness',
        'Adjust treatment plan',
        'Continue monitoring'
      ]
    }
  ];

  const quickActions = [
    { id: 'call', label: 'Emergency Call', icon: Phone, color: 'bg-red-500', description: 'Immediate phone contact' },
    { id: 'message', label: 'Urgent Message', icon: MessageSquare, color: 'bg-orange-500', description: 'Send priority message' },
    { id: 'session', label: 'Emergency Session', icon: Clock, color: 'bg-blue-500', description: 'Schedule urgent session' },
    { id: 'support', label: 'Alert Support Team', icon: Shield, color: 'bg-purple-500', description: 'Notify crisis team' }
  ];

  const riskAssessmentQuestions = [
    'Are you having thoughts of hurting yourself?',
    'Do you have a specific plan?',
    'Have you attempted suicide before?',
    'Do you have access to means of self-harm?',
    'Are you using drugs or alcohol?',
    'Do you have support from family or friends?'
  ];

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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Crisis Intervention Protocol</h2>
                    {student && (
                      <p className="text-red-100 text-sm">
                        {student.name} • {student.severity.toUpperCase()} Priority
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Alert Summary */}
              {student && (
                <div className="bg-red-50 border-b border-red-200 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">Active Crisis Alert</h3>
                      <p className="text-red-700 mt-1">{student.alert}</p>
                      <p className="text-red-600 text-sm mt-1">Detected: {student.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-700 font-medium text-sm">ACTIVE CRISIS</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[65vh]">
                {/* Quick Actions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Immediate Actions</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => setSelectedAction(action.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedAction === action.id
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{action.label}</h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Protocol Steps */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Crisis Intervention Protocol</h3>
                  <div className="space-y-4">
                    {crisisProtocol.map((protocol) => (
                      <div 
                        key={protocol.step} 
                        className={`border rounded-lg p-6 ${
                          interventionStep >= protocol.step 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            interventionStep > protocol.step
                              ? 'bg-green-500 text-white'
                              : interventionStep === protocol.step
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {interventionStep > protocol.step ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              protocol.step
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Step {protocol.step}: {protocol.title}
                            </h4>
                            <p className="text-gray-600 mb-3">{protocol.description}</p>
                            <ul className="space-y-1">
                              {protocol.actions.map((action, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-700">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                  {action}
                                </li>
                              ))}
                            </ul>
                            {interventionStep === protocol.step && (
                              <button
                                onClick={() => setInterventionStep(protocol.step + 1)}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                Complete Step {protocol.step}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Checklist</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="space-y-3">
                      {riskAssessmentQuestions.map((question, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <input 
                            type="checkbox" 
                            className="mt-1 h-4 w-4 text-red-600 rounded border-gray-300"
                          />
                          <label className="text-sm text-gray-700">{question}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Intervention Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Intervention Notes</h3>
                  <textarea
                    value={interventionNotes}
                    onChange={(e) => setInterventionNotes(e.target.value)}
                    placeholder="Document intervention actions, student response, safety planning, and next steps..."
                    rows={6}
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Crisis Protocol Step {interventionStep}/4 • All actions logged automatically
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => alert('Emergency services contacted and incident reported to crisis response team')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Emergency Services
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Save & Continue
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
