'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  Phone, 
  MessageCircle, 
  Clock, 
  Heart,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Bell,
  BellOff,
  Settings,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  Battery,
  Wifi,
  Smartphone
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface CrisisAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'emotional' | 'behavioral' | 'biometric' | 'text_analysis';
  message: string;
  timestamp: number;
  resolved: boolean;
  actionTaken: string | null;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  available: boolean;
  priority: number;
}

interface RiskFactor {
  category: string;
  level: number;
  trend: 'up' | 'down' | 'stable';
  indicators: string[];
  lastUpdate: number;
}

export default function CrisisPreventionDashboard() {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoAlert, setAutoAlert] = useState(true);
  
  // Mock data initialization
  useEffect(() => {
    // Initialize emergency contacts
    setEmergencyContacts([
      {
        id: '1',
        name: 'Sarah Johnson',
        relationship: 'Family',
        phone: '+1 (555) 123-4567',
        available: true,
        priority: 1
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        relationship: 'Therapist',
        phone: '+1 (555) 987-6543',
        available: true,
        priority: 2
      },
      {
        id: '3',
        name: 'Crisis Hotline',
        relationship: 'Emergency',
        phone: '988',
        available: true,
        priority: 3
      }
    ]);

    // Initialize risk factors
    setRiskFactors([
      {
        category: 'Sleep Patterns',
        level: 75,
        trend: 'down',
        indicators: ['Decreased sleep quality', 'Irregular sleep schedule'],
        lastUpdate: Date.now() - 1000 * 60 * 15
      },
      {
        category: 'Social Interaction',
        level: 45,
        trend: 'down',
        indicators: ['Reduced communication', 'Cancelled social plans'],
        lastUpdate: Date.now() - 1000 * 60 * 30
      },
      {
        category: 'Emotional State',
        level: 60,
        trend: 'stable',
        indicators: ['Consistent mood patterns', 'Stable emotional responses'],
        lastUpdate: Date.now() - 1000 * 60 * 5
      },
      {
        category: 'Physical Health',
        level: 30,
        trend: 'up',
        indicators: ['Improved heart rate variability', 'Regular exercise'],
        lastUpdate: Date.now() - 1000 * 60 * 10
      }
    ]);

    // Simulate real-time monitoring
    const interval = setInterval(() => {
      if (isMonitoring) {
        updateRiskAssessment();
        checkForAlerts();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const updateRiskAssessment = () => {
    // Calculate overall risk score based on factors
    const totalRisk = riskFactors.reduce((sum, factor) => sum + factor.level, 0) / riskFactors.length;
    setRiskScore(Math.round(totalRisk));

    // Update risk factors with some variation
    setRiskFactors(prev => prev.map(factor => ({
      ...factor,
      level: Math.max(0, Math.min(100, factor.level + (Math.random() - 0.5) * 10)),
      lastUpdate: Date.now()
    })));
  };

  const checkForAlerts = () => {
    if (riskScore > 70 && Math.random() > 0.8) {
      const newAlert: CrisisAlert = {
        id: Date.now().toString(),
        severity: riskScore > 85 ? 'critical' : 'high',
        type: 'emotional',
        message: `Elevated risk detected: Risk score increased to ${riskScore}%. Multiple concerning indicators identified.`,
        timestamp: Date.now(),
        resolved: false,
        actionTaken: null
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    }
  };

  const resolveAlert = (alertId: string, action: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolved: true, actionTaken: action }
        : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-red-800 text-white';
      case 'high': return 'from-orange-500 to-red-600 text-white';
      case 'medium': return 'from-yellow-500 to-orange-500 text-white';
      case 'low': return 'from-blue-500 to-blue-600 text-white';
      default: return 'from-gray-500 to-gray-600 text-white';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'from-green-500 to-green-600';
    if (score < 50) return 'from-yellow-500 to-orange-500';
    if (score < 70) return 'from-orange-500 to-red-500';
    return 'from-red-600 to-red-800';
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low Risk', color: 'text-green-600' };
    if (score < 50) return { level: 'Moderate Risk', color: 'text-yellow-600' };
    if (score < 70) return { level: 'High Risk', color: 'text-orange-600' };
    return { level: 'Critical Risk', color: 'text-red-600' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const currentRisk = getRiskLevel(riskScore);
  const criticalAlerts = alerts.filter(alert => !alert.resolved && alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => !alert.resolved && (alert.severity === 'high' || alert.severity === 'critical'));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-full">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Crisis Prevention Center
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          24/7 monitoring and early intervention system for mental health crisis prevention
        </p>
      </motion.div>

      {/* Critical Alerts Banner */}
      <AnimatePresence>
        {criticalAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">Critical Alert Active</h2>
                  <p className="opacity-90">{criticalAlerts.length} critical situation(s) detected</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="px-6 py-3 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Contact Emergency
                </button>
                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Risk Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-br ${getRiskColor(riskScore)} rounded-2xl shadow-xl p-6 text-white`}
        >
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{riskScore}</div>
              <div className="text-sm opacity-75">Risk Score</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className={`text-lg font-medium ${currentRisk.color} bg-white/20 px-3 py-1 rounded-lg`}>
              {currentRisk.level}
            </div>
            <div className="text-sm opacity-75">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </motion.div>

        {/* Active Monitoring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8" />
            {isMonitoring ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Active</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span className="text-sm font-medium">Paused</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium">Monitoring Status</div>
            <div className="text-sm opacity-75">
              {isMonitoring ? 'Real-time analysis active' : 'Monitoring paused'}
            </div>
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{emergencyContacts.filter(c => c.available).length}</div>
              <div className="text-sm opacity-75">Available</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium">Emergency Contacts</div>
            <div className="text-sm opacity-75">Ready to assist</div>
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Bell className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{highAlerts.length}</div>
              <div className="text-sm opacity-75">Active</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium">Active Alerts</div>
            <div className="text-sm opacity-75">Requiring attention</div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Factors Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Risk Factor Analysis</h3>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View Detailed Report
            </button>
          </div>

          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <motion.div
                key={factor.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-800">{factor.category}</h4>
                    {getTrendIcon(factor.trend)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {Math.floor((Date.now() - factor.lastUpdate) / 60000)}m ago
                    </span>
                    <div className={`text-lg font-bold ${factor.level > 60 ? 'text-red-600' : factor.level > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {factor.level}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      factor.level > 60 ? 'bg-red-500' : factor.level > 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${factor.level}%` }}
                  />
                </div>

                <div className="space-y-1">
                  {factor.indicators.map((indicator, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <span>{indicator}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contacts Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Phone className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Emergency Contacts</h3>
          </div>

          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  contact.available 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">{contact.name}</h4>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                  </div>
                  {contact.available ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-600 font-medium">Available</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span className="text-xs text-gray-500 font-medium">Unavailable</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{contact.phone}</span>
                  <button 
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      contact.available
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                    disabled={!contact.available}
                  >
                    Call Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            Emergency Protocol
          </button>
        </motion.div>
      </div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-800">Recent Alerts</h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoAlert(!autoAlert)}
              className={`p-2 rounded-lg transition-colors ${
                autoAlert ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {autoAlert ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View All
            </button>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.resolved 
                    ? 'bg-gray-50 border-l-gray-400' 
                    : `bg-gradient-to-r ${getSeverityColor(alert.severity)} bg-opacity-10 border-l-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'blue'}-500`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {alert.resolved ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.severity === 'critical' ? 'text-red-500' : 
                          alert.severity === 'high' ? 'text-orange-500' : 
                          alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                      )}
                      <span className={`text-sm font-medium uppercase tracking-wider ${
                        alert.severity === 'critical' ? 'text-red-600' : 
                        alert.severity === 'high' ? 'text-orange-600' : 
                        alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                        {alert.severity} - {alert.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{alert.message}</p>
                    {alert.actionTaken && (
                      <p className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                        Action taken: {alert.actionTaken}
                      </p>
                    )}
                  </div>
                  {!alert.resolved && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => resolveAlert(alert.id, 'User contacted therapist')}
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => resolveAlert(alert.id, 'Emergency services contacted')}
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors"
                      >
                        Emergency
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p>No active alerts. All systems normal.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Crisis Prevention Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-green-400">Monitoring Controls</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Monitoring</span>
                <button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isMonitoring ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isMonitoring ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-Alert System</span>
                <button
                  onClick={() => setAutoAlert(!autoAlert)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    autoAlert ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoAlert ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-400">Alert Thresholds</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Risk Score Alert</span>
                <span className="text-yellow-400">70%</span>
              </div>
              <div className="flex justify-between">
                <span>Critical Alert</span>
                <span className="text-red-400">85%</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency Auto-Call</span>
                <span className="text-red-400">95%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-400">System Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-green-400" />
                <span>Network: Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-green-400" />
                <span>Mobile App: Synced</span>
              </div>
              <div className="flex items-center space-x-2">
                <Battery className="w-4 h-4 text-green-400" />
                <span>Backup Power: Ready</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
