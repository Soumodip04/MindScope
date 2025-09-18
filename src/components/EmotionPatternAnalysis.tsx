'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Target,
  Activity,
  Heart,
  Zap,
  Shield,
  LineChart as LineChartIcon,
  BarChart3,
  PieChart as PieChartIcon,
  Info
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface EmotionData {
  timestamp: number;
  emotion: string;
  intensity: number;
  triggers: string[];
  context: string;
  intervention: string;
  effectiveness: number;
}

interface PatternInsight {
  type: 'trigger' | 'time' | 'intervention' | 'prediction';
  insight: string;
  confidence: number;
  actionable: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export default function EmotionPatternAnalysis() {
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [patterns, setPatterns] = useState<PatternInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [predictiveInsights, setPredictiveInsights] = useState<any[]>([]);

  // Simulated emotion data - in real app, this would come from user interactions
  useEffect(() => {
    const generateMockData = () => {
      const emotions = ['anxiety', 'depression', 'joy', 'anger', 'calm', 'stress', 'excitement'];
      const triggers = ['work', 'relationships', 'health', 'finances', 'family', 'social'];
      const interventions = ['breathing', 'meditation', 'journaling', 'exercise', 'therapy_chat'];
      
      const data = Array.from({ length: 50 }, (_, i) => ({
        timestamp: Date.now() - (i * 1000 * 60 * 60 * 6), // Every 6 hours
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        intensity: Math.floor(Math.random() * 10) + 1,
        triggers: [triggers[Math.floor(Math.random() * triggers.length)]],
        context: 'User interaction context',
        intervention: interventions[Math.floor(Math.random() * interventions.length)],
        effectiveness: Math.floor(Math.random() * 10) + 1
      }));
      
      setEmotionHistory(data);
    };

    generateMockData();
  }, []);

  // Advanced Pattern Analysis Algorithm
  const analyzePatterns = useMemo(() => {
    if (emotionHistory.length < 5) return [];

    const insights: PatternInsight[] = [];

    // 1. Time-based Pattern Analysis
    const hourlyPatterns = emotionHistory.reduce((acc, data) => {
      const hour = new Date(data.timestamp).getHours();
      if (!acc[hour]) acc[hour] = [];
      acc[hour].push(data);
      return acc;
    }, {} as Record<number, EmotionData[]>);

    const stressHours = Object.entries(hourlyPatterns)
      .filter(([_, data]) => data.some(d => ['anxiety', 'stress', 'anger'].includes(d.emotion)))
      .map(([hour]) => parseInt(hour));

    if (stressHours.length > 0) {
      const avgStressHour = stressHours.reduce((a, b) => a + b, 0) / stressHours.length;
      insights.push({
        type: 'time',
        insight: `Stress levels tend to peak around ${Math.round(avgStressHour)}:00. This pattern suggests optimal times for preventive interventions.`,
        confidence: 0.85,
        actionable: `Schedule mindfulness reminders 30 minutes before ${Math.round(avgStressHour)}:00`,
        risk_level: stressHours.length > 3 ? 'medium' : 'low'
      });
    }

    // 2. Trigger Pattern Analysis
    const triggerAnalysis = emotionHistory.reduce((acc, data) => {
      data.triggers.forEach(trigger => {
        if (!acc[trigger]) acc[trigger] = { count: 0, totalIntensity: 0, emotions: [] };
        acc[trigger].count++;
        acc[trigger].totalIntensity += data.intensity;
        acc[trigger].emotions.push(data.emotion);
      });
      return acc;
    }, {} as Record<string, { count: number, totalIntensity: number, emotions: string[] }>);

    const highImpactTriggers = Object.entries(triggerAnalysis)
      .filter(([_, data]) => data.totalIntensity / data.count > 6)
      .sort((a, b) => (b[1].totalIntensity / b[1].count) - (a[1].totalIntensity / a[1].count));

    if (highImpactTriggers.length > 0) {
      const [topTrigger, data] = highImpactTriggers[0];
      insights.push({
        type: 'trigger',
        insight: `"${topTrigger}" is your highest impact trigger, averaging ${(data.totalIntensity / data.count).toFixed(1)}/10 intensity across ${data.count} incidents.`,
        confidence: 0.92,
        actionable: `Consider developing specific coping strategies for ${topTrigger}-related stress`,
        risk_level: data.totalIntensity / data.count > 8 ? 'high' : 'medium'
      });
    }

    // 3. Intervention Effectiveness Analysis
    const interventionEffectiveness = emotionHistory.reduce((acc, data) => {
      if (!acc[data.intervention]) acc[data.intervention] = { total: 0, count: 0 };
      acc[data.intervention].total += data.effectiveness;
      acc[data.intervention].count++;
      return acc;
    }, {} as Record<string, { total: number, count: number }>);

    const bestIntervention = Object.entries(interventionEffectiveness)
      .map(([intervention, data]) => ({ intervention, avg: data.total / data.count }))
      .sort((a, b) => b.avg - a.avg)[0];

    if (bestIntervention) {
      insights.push({
        type: 'intervention',
        insight: `${bestIntervention.intervention} shows highest effectiveness (${bestIntervention.avg.toFixed(1)}/10) for your emotional regulation.`,
        confidence: 0.88,
        actionable: `Prioritize ${bestIntervention.intervention} techniques during high-stress periods`,
        risk_level: 'low'
      });
    }

    // 4. Predictive Analysis
    const recentTrend = emotionHistory.slice(0, 10);
    const avgRecentIntensity = recentTrend.reduce((sum, data) => sum + data.intensity, 0) / recentTrend.length;
    const overallAvg = emotionHistory.reduce((sum, data) => sum + data.intensity, 0) / emotionHistory.length;

    if (avgRecentIntensity > overallAvg * 1.3) {
      insights.push({
        type: 'prediction',
        insight: `Recent emotional intensity is 30% above your baseline. Predictive model suggests increased intervention needs.`,
        confidence: 0.76,
        actionable: 'Consider scheduling extra self-care activities and monitoring stress levels closely',
        risk_level: avgRecentIntensity > 8 ? 'high' : 'medium'
      });
    }

    return insights;
  }, [emotionHistory]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const last7Days = emotionHistory
      .filter(data => Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(data => ({
        time: new Date(data.timestamp).toLocaleDateString(),
        intensity: data.intensity,
        emotion: data.emotion
      }));

    // Group by day and average
    const dailyData = last7Days.reduce((acc, curr) => {
      if (!acc[curr.time]) {
        acc[curr.time] = { time: curr.time, intensities: [], emotions: [] };
      }
      acc[curr.time].intensities.push(curr.intensity);
      acc[curr.time].emotions.push(curr.emotion);
      return acc;
    }, {} as Record<string, { time: string, intensities: number[], emotions: string[] }>);

    return Object.values(dailyData).map(day => ({
      time: day.time,
      intensity: day.intensities.reduce((a, b) => a + b, 0) / day.intensities.length,
      anxietyCount: day.emotions.filter(e => e === 'anxiety').length,
      joyCount: day.emotions.filter(e => e === 'joy').length,
      stressCount: day.emotions.filter(e => e === 'stress').length
    }));
  }, [emotionHistory]);

  const emotionDistribution = useMemo(() => {
    const counts = emotionHistory.reduce((acc, data) => {
      acc[data.emotion] = (acc[data.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = {
      anxiety: '#ef4444',
      depression: '#6366f1',
      joy: '#eab308',
      anger: '#dc2626',
      calm: '#10b981',
      stress: '#f97316',
      excitement: '#8b5cf6'
    };

    return Object.entries(counts).map(([emotion, count]) => ({
      name: emotion,
      value: count,
      fill: colors[emotion as keyof typeof colors] || '#6b7280'
    }));
  }, [emotionHistory]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'from-red-500 to-red-700';
      case 'high': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-blue-500';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPatterns(analyzePatterns);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    if (emotionHistory.length > 0) {
      setPatterns(analyzePatterns);
    }
  }, [emotionHistory, analyzePatterns]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Emotion Pattern Analysis
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Advanced machine learning algorithms analyze your emotional patterns to provide personalized insights and predictive interventions
        </p>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Time Frame:</label>
            <select 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <button
            onClick={triggerAnalysis}
            disabled={isAnalyzing}
            className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all ${
              isAnalyzing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Patterns...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                <span>Deep Analysis</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emotion Intensity Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <LineChart className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Emotional Intensity Trends</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" className="text-sm" />
              <YAxis domain={[0, 10]} className="text-sm" />
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
                dataKey="intensity" 
                stroke="url(#gradient)" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <PieChartIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Emotion Distribution</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={emotionDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {emotionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pattern Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-3">
          <Target className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">AI-Generated Insights</h2>
          <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            {patterns.length} Insights Found
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {patterns.map((pattern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${getRiskColor(pattern.risk_level)} p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {pattern.type === 'trigger' && <AlertTriangle className="w-6 h-6" />}
                    {pattern.type === 'time' && <Clock className="w-6 h-6" />}
                    {pattern.type === 'intervention' && <Heart className="w-6 h-6" />}
                    {pattern.type === 'prediction' && <Zap className="w-6 h-6" />}
                    <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                      {pattern.type}
                    </span>
                  </div>
                  <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                    {Math.round(pattern.confidence * 100)}% confidence
                  </div>
                </div>
                
                <p className="text-lg mb-4 leading-relaxed">{pattern.insight}</p>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Recommended Action:</span>
                  </div>
                  <p className="text-sm opacity-90">{pattern.actionable}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Real-time Monitoring Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl shadow-xl p-8 text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Real-time Emotional Monitoring</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm opacity-90">Live Monitoring Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Current State</span>
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <div className="text-3xl font-bold mb-2">Calm</div>
            <div className="text-sm opacity-75">Based on recent interactions</div>
          </div>

          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Risk Level</span>
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-2 text-green-400">Low</div>
            <div className="text-sm opacity-75">All systems nominal</div>
          </div>

          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">Next Check</span>
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold mb-2">2 hours</div>
            <div className="text-sm opacity-75">Automated wellness check</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
