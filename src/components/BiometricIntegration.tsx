'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Moon, 
  Zap,
  Smartphone,
  Watch,
  Bluetooth,
  Wifi,
  Battery,
  Thermometer,
  Timer,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';

interface BiometricData {
  heartRate: number;
  stressLevel: number;
  sleepQuality: number;
  activityLevel: number;
  skinTemperature: number;
  timestamp: number;
}

interface DeviceConnection {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'smartphone' | 'smart_ring';
  connected: boolean;
  battery: number;
  lastSync: number;
}

export default function BiometricIntegration() {
  const [biometricData, setBiometricData] = useState<BiometricData[]>([]);
  const [currentData, setCurrentData] = useState<BiometricData | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<DeviceConnection[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [riskScore, setRiskScore] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated device connections
  useEffect(() => {
    const mockDevices: DeviceConnection[] = [
      {
        id: 'apple_watch_1',
        name: 'Apple Watch Series 9',
        type: 'smartwatch',
        connected: true,
        battery: 87,
        lastSync: Date.now() - 5000
      },
      {
        id: 'fitness_tracker_1',
        name: 'Fitbit Sense 2',
        type: 'fitness_tracker',
        connected: false,
        battery: 65,
        lastSync: Date.now() - 3600000
      },
      {
        id: 'smartphone_1',
        name: 'iPhone 15 Pro',
        type: 'smartphone',
        connected: true,
        battery: 92,
        lastSync: Date.now() - 1000
      }
    ];
    setConnectedDevices(mockDevices);
  }, []);

  // Real-time biometric data simulation
  useEffect(() => {
    const generateRealtimeData = () => {
      // Simulate realistic biometric patterns
      const baseHeartRate = 70;
      const timeOfDay = new Date().getHours();
      
      // Heart rate varies by time of day and stress
      let heartRate = baseHeartRate;
      if (timeOfDay >= 6 && timeOfDay <= 10) heartRate += 10; // Morning
      if (timeOfDay >= 18 && timeOfDay <= 22) heartRate += 5; // Evening
      
      // Add some randomness and stress factors
      heartRate += Math.random() * 10 - 5;
      
      const stressLevel = Math.max(0, Math.min(100, 
        (heartRate - baseHeartRate) * 2 + Math.random() * 20
      ));
      
      const newData: BiometricData = {
        heartRate: Math.round(heartRate),
        stressLevel: Math.round(stressLevel),
        sleepQuality: Math.round(85 + Math.random() * 15), // Generally good sleep
        activityLevel: Math.round(Math.random() * 100),
        skinTemperature: Math.round((36.5 + Math.random() * 0.8) * 10) / 10,
        timestamp: Date.now()
      };

      setCurrentData(newData);
      setBiometricData(prev => [newData, ...prev.slice(0, 49)]); // Keep last 50 readings

      // Calculate risk score based on multiple factors
      const riskFactors = {
        heartRate: Math.abs(heartRate - baseHeartRate) / 30 * 100,
        stress: stressLevel,
        sleep: (100 - newData.sleepQuality),
        temperature: Math.abs(newData.skinTemperature - 36.7) * 50
      };

      const newRiskScore = Math.round(
        (riskFactors.heartRate * 0.3 + 
         riskFactors.stress * 0.4 + 
         riskFactors.sleep * 0.2 + 
         riskFactors.temperature * 0.1)
      );

      setRiskScore(Math.max(0, Math.min(100, newRiskScore)));
    };

    // Start real-time monitoring
    intervalRef.current = setInterval(generateRealtimeData, 3000);
    generateRealtimeData(); // Initial call

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const connectDevice = async (deviceId: string) => {
    setIsConnecting(true);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true, lastSync: Date.now() }
          : device
      )
    );
    
    setIsConnecting(false);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch': return Watch;
      case 'fitness_tracker': return Activity;
      case 'smartphone': return Smartphone;
      default: return Activity;
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'from-green-400 to-green-600';
    if (score < 60) return 'from-yellow-400 to-orange-500';
    if (score < 80) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-700';
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return 'Low';
    if (score < 60) return 'Moderate';
    if (score < 80) return 'High';
    return 'Critical';
  };

  // Prepare chart data
  const chartData = biometricData.slice(0, 20).reverse().map((data, index) => ({
    time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: data.heartRate,
    stress: data.stressLevel,
    activity: data.activityLevel
  }));

  const radialData = currentData ? [
    { name: 'Heart Rate', value: (currentData.heartRate / 120) * 100, fill: '#ef4444' },
    { name: 'Stress', value: currentData.stressLevel, fill: '#f97316' },
    { name: 'Sleep Quality', value: currentData.sleepQuality, fill: '#8b5cf6' },
    { name: 'Activity', value: currentData.activityLevel, fill: '#10b981' }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Biometric Health Integration
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Real-time monitoring of your physiological signals to provide comprehensive mental health insights
        </p>
      </motion.div>

      {/* Risk Assessment Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`bg-gradient-to-r ${getRiskColor(riskScore)} rounded-2xl shadow-xl p-8 text-white`}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Mental Health Risk Assessment</h2>
            <p className="text-lg opacity-90">Based on real-time biometric analysis</p>
          </div>
          <div className="text-right space-y-2">
            <div className="text-4xl font-bold">{riskScore}/100</div>
            <div className="text-lg font-medium">{getRiskLevel(riskScore)} Risk</div>
          </div>
        </div>
        
        {riskScore > 70 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white/20 rounded-xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Elevated Risk Detected</span>
            </div>
            <p className="mt-2 text-sm opacity-90">
              Your biometric data suggests increased stress levels. Consider taking a break and trying some breathing exercises.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentData && [
          { 
            label: 'Heart Rate', 
            value: currentData.heartRate, 
            unit: 'BPM', 
            icon: Heart, 
            color: 'from-red-400 to-red-600',
            normal: currentData.heartRate >= 60 && currentData.heartRate <= 100 
          },
          { 
            label: 'Stress Level', 
            value: currentData.stressLevel, 
            unit: '%', 
            icon: Zap, 
            color: 'from-orange-400 to-red-500',
            normal: currentData.stressLevel < 40 
          },
          { 
            label: 'Sleep Quality', 
            value: currentData.sleepQuality, 
            unit: '%', 
            icon: Moon, 
            color: 'from-purple-400 to-purple-600',
            normal: currentData.sleepQuality > 80 
          },
          { 
            label: 'Activity Level', 
            value: currentData.activityLevel, 
            unit: '%', 
            icon: Activity, 
            color: 'from-green-400 to-green-600',
            normal: currentData.activityLevel > 30 
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`bg-gradient-to-br ${metric.color} rounded-2xl shadow-xl p-6 text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="w-8 h-8" />
              {metric.normal ? (
                <CheckCircle className="w-6 h-6 text-green-200" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-200" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium opacity-90">{metric.label}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold">{metric.value}</span>
                <span className="text-lg opacity-75">{metric.unit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Real-time Trends</h3>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500">Live</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Heart Rate"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="#f97316" 
                strokeWidth={2}
                name="Stress Level"
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="activity" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Activity"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radial Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Current Status</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                background
                dataKey="value"
              >
                {radialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </RadialBar>
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Device Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bluetooth className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Connected Devices</h3>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Scan Devices</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {connectedDevices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.type);
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  device.connected 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <DeviceIcon className={`w-8 h-8 ${device.connected ? 'text-green-600' : 'text-gray-400'}`} />
                  {device.connected ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-600 font-medium">Connected</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => connectDevice(device.id)}
                      disabled={isConnecting}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isConnecting ? 'Connecting...' : 'Connect'}
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">{device.name}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Battery className="w-4 h-4" />
                      <span>{device.battery}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Timer className="w-4 h-4" />
                      <span>{new Date(device.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-8 h-8 text-green-400" />
          <h2 className="text-2xl font-bold">Privacy & Security</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-green-400">Data Protection</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>End-to-end encryption for all biometric data</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Local device processing - no cloud storage</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>HIPAA compliant data handling</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>User-controlled data retention policies</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-400">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Alerts</span>
                <button
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    alertsEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Emergency Contacts</span>
                <button className="px-3 py-1 bg-white/20 rounded-md text-xs hover:bg-white/30 transition-colors">
                  Configure
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Export</span>
                <button className="px-3 py-1 bg-white/20 rounded-md text-xs hover:bg-white/30 transition-colors">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
