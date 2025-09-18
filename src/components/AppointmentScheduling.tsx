'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  Phone, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

interface Appointment {
  id: string;
  studentName: string;
  studentEmail: string;
  date: string;
  time: string;
  duration: number;
  type: 'individual' | 'group' | 'crisis' | 'assessment';
  mode: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  location?: string;
  notes?: string;
  counselor: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface AppointmentSchedulingProps {
  counselorId?: string;
  onClose?: () => void;
}

export default function AppointmentScheduling({ counselorId, onClose }: AppointmentSchedulingProps) {
  const [currentView, setCurrentView] = useState<'calendar' | 'list' | 'create'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    studentName: '',
    studentEmail: '',
    date: '',
    time: '',
    duration: 60,
    type: 'individual' as const,
    mode: 'in-person' as const,
    location: '',
    notes: '',
    priority: 'medium' as const
  });

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: '1',
      studentName: 'Alex Johnson',
      studentEmail: 'alex.j@university.edu',
      date: '2025-09-20',
      time: '14:00',
      duration: 60,
      type: 'individual',
      mode: 'video',
      status: 'scheduled',
      notes: 'Follow-up session for anxiety management',
      counselor: 'Dr. Sarah Miller',
      priority: 'high'
    },
    {
      id: '2',
      studentName: 'Sarah Chen',
      studentEmail: 'sarah.c@university.edu',
      date: '2025-09-20',
      time: '15:30',
      duration: 45,
      type: 'individual',
      mode: 'in-person',
      status: 'confirmed',
      location: 'Room 204',
      counselor: 'Dr. Sarah Miller',
      priority: 'medium'
    },
    {
      id: '3',
      studentName: 'Group Session A',
      studentEmail: '',
      date: '2025-09-21',
      time: '16:00',
      duration: 90,
      type: 'group',
      mode: 'in-person',
      status: 'scheduled',
      location: 'Conference Room B',
      notes: 'Anxiety support group',
      counselor: 'Dr. Sarah Miller',
      priority: 'medium'
    },
    {
      id: '4',
      studentName: 'Michael Brown',
      studentEmail: 'michael.b@university.edu',
      date: '2025-09-19',
      time: '10:00',
      duration: 60,
      type: 'assessment',
      mode: 'in-person',
      status: 'completed',
      location: 'Room 201',
      counselor: 'Dr. Sarah Miller',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return User;
      case 'group': return User; // You might want a different icon for groups
      case 'crisis': return AlertTriangle;
      case 'assessment': return CheckCircle;
      default: return User;
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'video': return Video;
      case 'phone': return Phone;
      case 'in-person': return MapPin;
      default: return MapPin;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAppointment = () => {
    // In a real app, this would make an API call
    console.log('Creating appointment:', newAppointment);
    setShowCreateForm(false);
    setNewAppointment({
      studentName: '',
      studentEmail: '',
      date: '',
      time: '',
      duration: 60,
      type: 'individual',
      mode: 'in-person',
      location: '',
      notes: '',
      priority: 'medium'
    });
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Changing appointment ${appointmentId} status to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Scheduling</h1>
              <p className="text-gray-600">Manage your counseling sessions and appointments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setCurrentView('list')}
                  className={`px-4 py-2 text-sm font-medium ${
                    currentView === 'list' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-4 py-2 text-sm font-medium ${
                    currentView === 'calendar' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Calendar View
                </button>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Create Appointment Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Schedule New Appointment</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                  <input
                    type="text"
                    value={newAppointment.studentName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, studentName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Email</label>
                  <input
                    type="email"
                    value={newAppointment.studentEmail}
                    onChange={(e) => setNewAppointment({ ...newAppointment, studentEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="student@university.edu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <select
                    value={newAppointment.duration}
                    onChange={(e) => setNewAppointment({ ...newAppointment, duration: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="individual">Individual Session</option>
                    <option value="group">Group Session</option>
                    <option value="assessment">Assessment</option>
                    <option value="crisis">Crisis Intervention</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                  <select
                    value={newAppointment.mode}
                    onChange={(e) => setNewAppointment({ ...newAppointment, mode: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newAppointment.priority}
                    onChange={(e) => setNewAppointment({ ...newAppointment, priority: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {newAppointment.mode === 'in-person' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Room number or location"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Additional notes for the appointment..."
                />
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAppointment}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Schedule Appointment
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Appointments List */}
        {currentView === 'list' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => {
                  const TypeIcon = getTypeIcon(appointment.type);
                  const ModeIcon = getModeIcon(appointment.mode);
                  
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <TypeIcon className="w-6 h-6 text-green-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{appointment.studentName}</h3>
                            <p className="text-sm text-gray-600">{appointment.studentEmail}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                {appointment.date}
                              </span>
                              <span className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                {appointment.time} ({appointment.duration}min)
                              </span>
                              <span className="flex items-center text-sm text-gray-500">
                                <ModeIcon className="w-4 h-4 mr-1" />
                                {appointment.mode}
                              </span>
                            </div>
                            {appointment.location && (
                              <p className="text-sm text-gray-500 mt-1">Location: {appointment.location}</p>
                            )}
                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(appointment.priority)}`}>
                            {appointment.priority}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="Mark as confirmed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded" title="Cancel">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Calendar View Placeholder */}
        {currentView === 'calendar' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600 mb-4">Full calendar integration would be implemented here</p>
              <p className="text-sm text-gray-500">This would show a monthly/weekly calendar with appointment slots</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}