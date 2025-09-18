'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  MessageSquare, 
  Plus, 
  Edit, 
  Save, 
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { useState } from 'react';

interface CaseNote {
  id: string;
  date: string;
  type: 'assessment' | 'session' | 'crisis' | 'follow-up';
  content: string;
  counselor: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface StudentCase {
  id: string;
  studentName: string;
  studentEmail: string;
  enrollmentDate: string;
  lastContact: string;
  status: 'active' | 'inactive' | 'at-risk' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
  primaryConcerns: string[];
  assignedCounselor: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes: CaseNote[];
  treatmentPlan: {
    goals: string[];
    interventions: string[];
    timeline: string;
  };
}

interface CaseManagementProps {
  caseData?: StudentCase;
  onClose?: () => void;
}

export default function CaseManagement({ caseData, onClose }: CaseManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState({
    type: 'session' as const,
    content: '',
    riskLevel: 'low' as const
  });

  // Mock data if no case data provided
  const mockCase: StudentCase = {
    id: '1',
    studentName: 'Alex Johnson',
    studentEmail: 'alex.j@university.edu',
    enrollmentDate: '2025-08-15',
    lastContact: '2025-09-16',
    status: 'at-risk',
    riskLevel: 'high',
    primaryConcerns: ['Depression', 'Academic Stress', 'Social Anxiety'],
    assignedCounselor: 'Dr. Sarah Miller',
    emergencyContact: {
      name: 'Jennifer Johnson',
      relationship: 'Mother',
      phone: '(555) 123-4567'
    },
    notes: [
      {
        id: '1',
        date: '2025-09-16',
        type: 'session',
        content: 'Student reported increased anxiety about upcoming exams. Discussed coping strategies and relaxation techniques.',
        counselor: 'Dr. Sarah Miller',
        riskLevel: 'medium'
      },
      {
        id: '2',
        date: '2025-09-14',
        type: 'crisis',
        content: 'Student reached out via crisis hotline. Immediate intervention provided. Emergency contact notified.',
        counselor: 'Dr. Sarah Miller',
        riskLevel: 'high'
      }
    ],
    treatmentPlan: {
      goals: [
        'Reduce anxiety symptoms',
        'Improve academic performance',
        'Develop healthy coping mechanisms'
      ],
      interventions: [
        'Weekly counseling sessions',
        'Cognitive behavioral therapy techniques',
        'Mindfulness and relaxation training'
      ],
      timeline: '12 weeks'
    }
  };

  const studentCase = caseData || mockCase;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'at-risk': return 'bg-red-100 text-red-800';
      case 'stable': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddNote = () => {
    // In a real app, this would make an API call
    console.log('Adding note:', newNote);
    setNewNote({ type: 'session', content: '', riskLevel: 'low' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{studentCase.studentName}</h1>
                <p className="text-gray-600">{studentCase.studentEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(studentCase.status)}`}>
                  {studentCase.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Risk Level</p>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getRiskColor(studentCase.riskLevel)}`}>
                  {studentCase.riskLevel}
                </span>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'notes', label: 'Case Notes', icon: FileText },
                { id: 'treatment', label: 'Treatment Plan', icon: TrendingUp },
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'contacts', label: 'Contacts', icon: MessageSquare }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Case Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Enrollment Date</p>
                      <p className="font-medium">{studentCase.enrollmentDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Contact</p>
                      <p className="font-medium">{studentCase.lastContact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assigned Counselor</p>
                      <p className="font-medium">{studentCase.assignedCounselor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Case Status</p>
                      <p className="font-medium capitalize">{studentCase.status}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Concerns</h3>
                  <div className="flex flex-wrap gap-2">
                    {studentCase.primaryConcerns.map((concern, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{studentCase.emergencyContact.name}</p>
                    <p className="text-sm text-gray-600">{studentCase.emergencyContact.relationship}</p>
                    <p className="text-sm text-gray-600">{studentCase.emergencyContact.phone}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                      Schedule Appointment
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                      Send Message
                    </button>
                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                      Crisis Intervention
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Case Notes Tab */}
          {activeTab === 'notes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Case Notes</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </button>
                </div>

                {/* Add New Note Form */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <select
                      value={newNote.type}
                      onChange={(e) => setNewNote({ ...newNote, type: e.target.value as any })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="session">Session Note</option>
                      <option value="assessment">Assessment</option>
                      <option value="crisis">Crisis Intervention</option>
                      <option value="follow-up">Follow-up</option>
                    </select>
                    <select
                      value={newNote.riskLevel}
                      onChange={(e) => setNewNote({ ...newNote, riskLevel: e.target.value as any })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                    <button
                      onClick={handleAddNote}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Save Note
                    </button>
                  </div>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Enter case note..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Existing Notes */}
                <div className="space-y-4">
                  {studentCase.notes.map((note) => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            note.type === 'crisis' ? 'bg-red-100 text-red-800' :
                            note.type === 'assessment' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {note.type}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(note.riskLevel)}`}>
                            {note.riskLevel} risk
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {note.date} • {note.counselor}
                        </div>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Treatment Plan Tab */}
          {activeTab === 'treatment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Treatment Plan</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
                >
                  {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Save Changes' : 'Edit Plan'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Treatment Goals</h4>
                  <ul className="space-y-2">
                    {studentCase.treatmentPlan.goals.map((goal, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Interventions</h4>
                  <ul className="space-y-2">
                    {studentCase.treatmentPlan.interventions.map((intervention, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Treatment Timeline</h4>
                <p className="text-gray-700">{studentCase.treatmentPlan.timeline}</p>
              </div>
            </motion.div>
          )}

          {/* Other tabs would be implemented similarly */}
        </div>
      </div>
    </div>
  );
}