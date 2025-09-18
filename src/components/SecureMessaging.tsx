'use client';

import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Search, 
  Filter, 
  MoreVertical,
  Shield,
  Lock,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Video,
  Star,
  Archive
} from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'counselor' | 'student' | 'admin';
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  encrypted: boolean;
  attachments?: {
    id: string;
    name: string;
    size: string;
    type: string;
  }[];
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'student' | 'counselor' | 'admin';
  lastMessage: Message;
  unreadCount: number;
  isOnline: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  archived: boolean;
}

interface SecureMessagingProps {
  currentUserId?: string;
  currentUserRole?: 'counselor' | 'student' | 'admin';
  onClose?: () => void;
}

export default function SecureMessaging({ 
  currentUserId = 'counselor1', 
  currentUserRole = 'counselor',
  onClose 
}: SecureMessagingProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showArchived, setShowArchived] = useState(false);

  // Mock data
  const conversations: Conversation[] = [
    {
      id: '1',
      participantId: 'student1',
      participantName: 'Alex Johnson',
      participantRole: 'student',
      lastMessage: {
        id: 'm1',
        senderId: 'student1',
        senderName: 'Alex Johnson',
        senderRole: 'student',
        recipientId: 'counselor1',
        recipientName: 'Dr. Sarah Miller',
        content: 'Thank you for the session today. I feel much better about the upcoming exams.',
        timestamp: '2025-09-18 16:30',
        read: false,
        priority: 'medium',
        encrypted: true
      },
      unreadCount: 2,
      isOnline: true,
      priority: 'high',
      archived: false
    },
    {
      id: '2',
      participantId: 'student2',
      participantName: 'Sarah Chen',
      participantRole: 'student',
      lastMessage: {
        id: 'm2',
        senderId: 'counselor1',
        senderName: 'Dr. Sarah Miller',
        senderRole: 'counselor',
        recipientId: 'student2',
        recipientName: 'Sarah Chen',
        content: 'How are you feeling about the mindfulness exercises we discussed?',
        timestamp: '2025-09-18 14:15',
        read: true,
        priority: 'low',
        encrypted: true
      },
      unreadCount: 0,
      isOnline: false,
      priority: 'medium',
      archived: false
    },
    {
      id: '3',
      participantId: 'student3',
      participantName: 'Michael Brown',
      participantRole: 'student',
      lastMessage: {
        id: 'm3',
        senderId: 'student3',
        senderName: 'Michael Brown',
        senderRole: 'student',
        recipientId: 'counselor1',
        recipientName: 'Dr. Sarah Miller',
        content: 'I need to talk to someone urgently. Can we schedule an emergency session?',
        timestamp: '2025-09-18 09:45',
        read: false,
        priority: 'urgent',
        encrypted: true
      },
      unreadCount: 1,
      isOnline: true,
      priority: 'urgent',
      archived: false
    }
  ];

  const messages: { [conversationId: string]: Message[] } = {
    '1': [
      {
        id: 'm1a',
        senderId: 'counselor1',
        senderName: 'Dr. Sarah Miller',
        senderRole: 'counselor',
        recipientId: 'student1',
        recipientName: 'Alex Johnson',
        content: 'Hello Alex, how did your practice with the breathing exercises go?',
        timestamp: '2025-09-18 15:00',
        read: true,
        priority: 'medium',
        encrypted: true
      },
      {
        id: 'm1b',
        senderId: 'student1',
        senderName: 'Alex Johnson',
        senderRole: 'student',
        recipientId: 'counselor1',
        recipientName: 'Dr. Sarah Miller',
        content: 'They really helped! I used them before my presentation yesterday and felt much calmer.',
        timestamp: '2025-09-18 15:30',
        read: true,
        priority: 'medium',
        encrypted: true
      },
      {
        id: 'm1c',
        senderId: 'student1',
        senderName: 'Alex Johnson',
        senderRole: 'student',
        recipientId: 'counselor1',
        recipientName: 'Dr. Sarah Miller',
        content: 'Thank you for the session today. I feel much better about the upcoming exams.',
        timestamp: '2025-09-18 16:30',
        read: false,
        priority: 'medium',
        encrypted: true
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || conv.priority === filterPriority;
    const matchesArchived = showArchived ? conv.archived : !conv.archived;
    return matchesSearch && matchesPriority && matchesArchived;
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    // In a real app, this would make an API call
    console.log('Sending message:', {
      conversationId: selectedConversation,
      content: messageInput,
      priority: 'medium'
    });
    
    setMessageInput('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Secure Messages</h2>
            <div className="flex items-center space-x-2">
              <div title="HIPAA Compliant">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div title="End-to-End Encrypted">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-3 py-1 text-sm rounded ${
                showArchived ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {showArchived ? 'Active' : 'Archived'}
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.participantName}
                    </p>
                    <div className="flex items-center space-x-1">
                      <span className={`px-1 py-0.5 text-xs rounded ${getPriorityColor(conversation.priority)}`}>
                        {conversation.priority}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {conversation.lastMessage.encrypted && (
                        <Lock className="w-3 h-3 text-green-500" />
                      )}
                      {conversation.lastMessage.read && conversation.lastMessage.senderId === currentUserId && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    {selectedConv.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedConv.participantName}</h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {selectedConv.participantRole} • {selectedConv.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Star className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === currentUserId
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${
                        message.senderId === currentUserId ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                      <div className="flex items-center space-x-1">
                        {message.encrypted && (
                          <Lock className={`w-3 h-3 ${
                            message.senderId === currentUserId ? 'text-green-100' : 'text-green-500'
                          }`} />
                        )}
                        {message.priority === 'urgent' && (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a secure message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Shield className="w-3 h-3 mr-1 text-green-500" />
                    HIPAA Compliant
                  </span>
                  <span className="flex items-center">
                    <Lock className="w-3 h-3 mr-1 text-green-500" />
                    End-to-End Encrypted
                  </span>
                </div>
                <span>Press Enter to send</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}