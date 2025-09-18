'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Shield, 
  BookOpen, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock,
  Target,
  Eye,
  Zap,
  Globe,
  Smartphone,
  Headphones,
  Camera,
  Mic,
  Gamepad2,
  Settings,
  ChevronRight,
  Plus,
  Star,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowUpRight,
  Filter,
  Download,
  Share,
  Bell,
  Search,
  Grid3X3,
  List,
  PieChart,
  LineChart,
  Map,
  MessageCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnalyticsCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
  href: string;
  category: 'intelligence' | 'monitoring' | 'prevention' | 'therapy';
  features: string[];
  status: 'active' | 'beta' | 'coming-soon';
  lastUpdate: string;
  insights: number;
  users?: number;
}

interface OverviewMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

interface ActivityItem {
  id: string;
  type: 'insight' | 'alert' | 'achievement' | 'session';
  title: string;
  description: string;
  timestamp: number;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export default function AnalyticsDashboardHub() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [overviewMetrics, setOverviewMetrics] = useState<OverviewMetric[]>([]);

  const analyticsCards: AnalyticsCard[] = [
    {
      id: 'emotion-patterns',
      title: 'Emotion Pattern Analysis',
      description: 'Advanced ML-powered emotion detection and predictive analytics for mental health insights',
      icon: Brain,
      gradient: 'from-purple-500 to-indigo-600',
      href: '/analytics/emotion-patterns',
      category: 'intelligence',
      features: ['Real-time emotion detection', 'Predictive analytics', 'Pattern recognition', 'Risk assessment'],
      status: 'active',
      lastUpdate: '2 minutes ago',
      insights: 24,
      users: 1250
    },
    {
      id: 'biometric-integration',
      title: 'Biometric Health Monitoring',
      description: 'Comprehensive biometric integration with smartwatches and health devices for holistic wellness tracking',
      icon: Heart,
      gradient: 'from-red-500 to-pink-600',
      href: '/analytics/biometric-integration',
      category: 'monitoring',
      features: ['Heart rate monitoring', 'Sleep analysis', 'Stress detection', 'Activity tracking'],
      status: 'active',
      lastUpdate: '5 minutes ago',
      insights: 18,
      users: 890
    },
    {
      id: 'crisis-prevention',
      title: 'Crisis Prevention System',
      description: 'AI-powered early warning system with emergency protocols and automated intervention capabilities',
      icon: Shield,
      gradient: 'from-orange-500 to-red-600',
      href: '/analytics/crisis-prevention',
      category: 'prevention',
      features: ['Risk scoring', 'Emergency alerts', 'Contact automation', 'Intervention protocols'],
      status: 'active',
      lastUpdate: '1 minute ago',
      insights: 12,
      users: 567
    },
    {
      id: 'ai-journal',
      title: 'AI Therapy Journal',
      description: 'Intelligent journaling platform with natural language processing and therapeutic insights',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-600',
      href: '/analytics/ai-journal',
      category: 'therapy',
      features: ['AI text analysis', 'Mood tracking', 'Pattern insights', 'Progress monitoring'],
      status: 'active',
      lastUpdate: '10 minutes ago',
      insights: 31,
      users: 2100
    },
    {
      id: 'vr-therapy',
      title: 'VR Therapeutic Environments',
      description: 'Immersive virtual reality spaces for exposure therapy, meditation, and guided relaxation',
      icon: Eye,
      gradient: 'from-blue-500 to-cyan-600',
      href: '/analytics/vr-therapy',
      category: 'therapy',
      features: ['3D environments', 'Guided sessions', 'Biometric feedback', 'Progress tracking'],
      status: 'beta',
      lastUpdate: 'Coming soon',
      insights: 8,
      users: 145
    },
    {
      id: 'voice-analysis',
      title: 'Voice Pattern Analysis',
      description: 'Advanced speech analysis for emotional state detection and mental health monitoring',
      icon: Mic,
      gradient: 'from-green-500 to-teal-600',
      href: '/analytics/voice-analysis',
      category: 'intelligence',
      features: ['Speech analysis', 'Emotion detection', 'Stress indicators', 'Voice biomarkers'],
      status: 'beta',
      lastUpdate: 'Coming soon',
      insights: 15,
      users: 320
    },
    {
      id: 'social-network',
      title: 'Social Support Network',
      description: 'AI-powered social connection analysis and support network optimization for better mental health',
      icon: Users,
      gradient: 'from-indigo-500 to-purple-600',
      href: '/analytics/social-network',
      category: 'monitoring',
      features: ['Relationship mapping', 'Support analysis', 'Connection insights', 'Social wellness'],
      status: 'coming-soon',
      lastUpdate: 'In development',
      insights: 6,
      users: 89
    },
    {
      id: 'gamification',
      title: 'Wellness Gamification',
      description: 'Engaging game mechanics and achievement systems to motivate mental health progress',
      icon: Gamepad2,
      gradient: 'from-yellow-500 to-orange-600',
      href: '/analytics/gamification',
      category: 'therapy',
      features: ['Achievement system', 'Progress rewards', 'Challenge tracks', 'Social competitions'],
      status: 'coming-soon',
      lastUpdate: 'Planning phase',
      insights: 4,
      users: 156
    }
  ];

  useEffect(() => {
    // Initialize overview metrics
    setOverviewMetrics([
      {
        label: 'Total Active Users',
        value: '5,517',
        change: '+12.5%',
        trend: 'up',
        icon: Users,
        color: 'text-blue-600'
      },
      {
        label: 'AI Insights Generated',
        value: '118',
        change: '+8.2%',
        trend: 'up',
        icon: Brain,
        color: 'text-purple-600'
      },
      {
        label: 'Crisis Interventions',
        value: '23',
        change: '-15.3%',
        trend: 'down',
        icon: Shield,
        color: 'text-green-600'
      },
      {
        label: 'Wellness Score',
        value: '7.8/10',
        change: '+0.3',
        trend: 'up',
        icon: Heart,
        color: 'text-red-600'
      }
    ]);

    // Initialize recent activity
    setRecentActivity([
      {
        id: '1',
        type: 'insight',
        title: 'New Pattern Detected',
        description: 'Emotional pattern analysis identified improving mood trends',
        timestamp: Date.now() - 1000 * 60 * 5,
        priority: 'medium',
        category: 'Emotion Analysis'
      },
      {
        id: '2',
        type: 'alert',
        title: 'Risk Assessment',
        description: 'Elevated stress levels detected in biometric monitoring',
        timestamp: Date.now() - 1000 * 60 * 15,
        priority: 'high',
        category: 'Biometric Monitoring'
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Milestone Reached',
        description: '30 consecutive days of journaling completed',
        timestamp: Date.now() - 1000 * 60 * 45,
        priority: 'low',
        category: 'AI Journal'
      },
      {
        id: '4',
        type: 'session',
        title: 'Therapy Session',
        description: 'Virtual reality relaxation session completed successfully',
        timestamp: Date.now() - 1000 * 60 * 120,
        priority: 'medium',
        category: 'VR Therapy'
      }
    ]);
  }, []);

  const categories = [
    { id: 'all', label: 'All Features', icon: Grid3X3 },
    { id: 'intelligence', label: 'AI Intelligence', icon: Brain },
    { id: 'monitoring', label: 'Health Monitoring', icon: Activity },
    { id: 'prevention', label: 'Crisis Prevention', icon: Shield },
    { id: 'therapy', label: 'Digital Therapy', icon: Heart }
  ];

  const filteredCards = analyticsCards.filter(card => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'coming-soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'beta': return 'Beta';
      case 'coming-soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'insight': return Brain;
      case 'alert': return AlertTriangle;
      case 'achievement': return Award;
      case 'session': return CheckCircle;
      default: return Info;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced Analytics Hub
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive mental health analytics powered by AI, biometric monitoring, and therapeutic intelligence
        </p>
      </motion.div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {overviewMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    metric.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-800">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search analytics features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Export */}
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Analytics Cards */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            <AnimatePresence>
              {filteredCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={card.href}>
                      <div className={`bg-gradient-to-br ${card.gradient} rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all cursor-pointer group ${
                        viewMode === 'list' ? 'flex items-center space-x-6' : ''
                      }`}>
                        <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                          <div className="flex items-center justify-between">
                            <Icon className={`${viewMode === 'list' ? 'w-12 h-12' : 'w-8 h-8'}`} />
                            {viewMode === 'grid' && (
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                                  {getStatusLabel(card.status)}
                                </span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`font-bold ${viewMode === 'list' ? 'text-xl' : 'text-lg'}`}>
                              {card.title}
                            </h3>
                            {viewMode === 'list' && (
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                                  {getStatusLabel(card.status)}
                                </span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            )}
                          </div>
                          
                          <p className={`text-white/90 mb-4 ${viewMode === 'list' ? 'text-base' : 'text-sm'}`}>
                            {card.description}
                          </p>

                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {card.features.slice(0, viewMode === 'list' ? 4 : 3).map((feature) => (
                                <span
                                  key={feature}
                                  className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium"
                                >
                                  {feature}
                                </span>
                              ))}
                              {card.features.length > (viewMode === 'list' ? 4 : 3) && (
                                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium">
                                  +{card.features.length - (viewMode === 'list' ? 4 : 3)} more
                                </span>
                              )}
                            </div>

                            <div className={`flex items-center justify-between text-sm ${
                              viewMode === 'list' ? 'flex-row space-x-6' : 'flex-col space-y-2'
                            }`}>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Brain className="w-4 h-4" />
                                  <span>{card.insights} insights</span>
                                </div>
                                {card.users && (
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>{card.users.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-white/75">
                                Updated: {card.lastUpdate}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filteredCards.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-xl border border-gray-100"
            >
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No features found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter</p>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              </div>
              <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600 mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-gray-800 truncate">
                          {activity.title}
                        </h4>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-blue-600 font-medium">{activity.category}</span>
                        <span className="text-xs text-gray-500">
                          {Math.floor((Date.now() - activity.timestamp) / 60000)}m ago
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button className="w-full mt-4 px-4 py-2 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors text-sm font-medium">
              View All Activity
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Analysis</span>
              </button>
              
              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
              
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configure Alerts</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-6 h-6" />
              <h3 className="text-xl font-bold">System Status</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Processing</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-green-400">Operational</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Monitoring</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-green-400">Active</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Sync</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-sm text-yellow-400">Syncing</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Emergency Systems</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-green-400">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
