'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Award, Calendar, Heart, Moon, Smile, Target, TrendingUp, X, Zap } from 'lucide-react';
import { useState } from 'react';

interface WellnessTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WellnessTrackingModal({ isOpen, onClose }: WellnessTrackingModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyMood, setDailyMood] = useState(4);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(2);
  
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
  const stressLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
  
  const weeklyData = [
    { day: 'Mon', mood: 3, energy: 4, sleep: 7, stress: 2 },
    { day: 'Tue', mood: 4, energy: 3, sleep: 6, stress: 3 },
    { day: 'Wed', mood: 2, energy: 2, sleep: 5, stress: 4 },
    { day: 'Thu', mood: 3, energy: 3, sleep: 7, stress: 2 },
    { day: 'Fri', mood: 4, energy: 4, sleep: 8, stress: 1 },
    { day: 'Sat', mood: 5, energy: 5, sleep: 9, stress: 1 },
    { day: 'Sun', mood: 4, energy: 4, sleep: 8, stress: 2 }
  ];

  const goals = [
    { id: 1, title: 'Sleep 8+ hours daily', progress: 75, target: 30, completed: 22 },
    { id: 2, title: 'Daily meditation', progress: 60, target: 30, completed: 18 },
    { id: 3, title: 'Exercise 3x per week', progress: 85, target: 12, completed: 10 },
    { id: 4, title: 'Journal daily thoughts', progress: 40, target: 30, completed: 12 }
  ];

  const insights = [
    {
      type: 'positive',
      icon: TrendingUp,
      title: 'Mood Improvement',
      description: 'Your mood has improved by 15% this week compared to last week'
    },
    {
      type: 'warning',
      icon: Moon,
      title: 'Sleep Pattern',
      description: 'You had 3 days with less than 7 hours of sleep this week'
    },
    {
      type: 'achievement',
      icon: Award,
      title: 'Stress Management',
      description: 'Great job! Your stress levels are consistently low'
    }
  ];

  const getMoodColor = (mood: number) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
    return colors[mood - 1] || colors[2];
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Wellness Tracking</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex h-[600px]">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Today's Check-in */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Today&apos;s Check-in</h3>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Mood */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <Smile className="w-6 h-6 text-yellow-500" />
                          <h4 className="text-lg font-medium text-gray-900">Mood</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">How are you feeling today?</span>
                            <span className="font-medium text-gray-900">{moodLabels[dailyMood - 1]}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={dailyMood}
                            onChange={(e) => setDailyMood(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Very Low</span>
                            <span>Excellent</span>
                          </div>
                        </div>
                      </div>

                      {/* Energy */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <Zap className="w-6 h-6 text-orange-500" />
                          <h4 className="text-lg font-medium text-gray-900">Energy Level</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Energy level today</span>
                            <span className="font-medium text-gray-900">{energyLevel}/5</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={energyLevel}
                            onChange={(e) => setEnergyLevel(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Very Low</span>
                            <span>Very High</span>
                          </div>
                        </div>
                      </div>

                      {/* Sleep */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <Moon className="w-6 h-6 text-indigo-500" />
                          <h4 className="text-lg font-medium text-gray-900">Sleep</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Hours of sleep</span>
                            <span className="font-medium text-gray-900">{sleepHours} hours</span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="12"
                            value={sleepHours}
                            onChange={(e) => setSleepHours(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>3 hrs</span>
                            <span>12 hrs</span>
                          </div>
                        </div>
                      </div>

                      {/* Stress */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <Activity className="w-6 h-6 text-red-500" />
                          <h4 className="text-lg font-medium text-gray-900">Stress Level</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Stress level today</span>
                            <span className="font-medium text-gray-900">{stressLabels[stressLevel - 1]}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={stressLevel}
                            onChange={(e) => setStressLevel(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Very Low</span>
                            <span>Very High</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Overview */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Overview</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-7 gap-4">
                        {weeklyData.map((day, index) => (
                          <div key={index} className="text-center">
                            <div className="text-sm font-medium text-gray-600 mb-2">{day.day}</div>
                            <div className="space-y-2">
                              <div className={`w-full h-3 rounded-full ${getMoodColor(day.mood)}`} title={`Mood: ${day.mood}/5`}></div>
                              <div className={`w-full h-3 rounded-full bg-orange-${day.energy * 100}`} title={`Energy: ${day.energy}/5`}></div>
                              <div className="text-xs text-gray-500">{day.sleep}h</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-6 mt-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>Mood</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span>Energy</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>Sleep Hours</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => alert('Daily wellness data saved successfully! Keep up the great work tracking your mental health.')}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Save Today&apos;s Check-in
                    </button>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
                  {/* Goals */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Wellness Goals</h4>
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="bg-white rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium text-gray-900">{goal.title}</h5>
                            <Target className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>{goal.completed}/{goal.target}</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                                style={{ width: `${goal.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Insights</h4>
                    <div className="space-y-4">
                      {insights.map((insight, index) => {
                        const Icon = insight.icon;
                        return (
                          <div key={index} className="bg-white rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <Icon className={`w-5 h-5 mt-1 ${
                                insight.type === 'positive' ? 'text-green-500' :
                                insight.type === 'warning' ? 'text-yellow-500' :
                                'text-blue-500'
                              }`} />
                              <div>
                                <h5 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h5>
                                <p className="text-xs text-gray-600">{insight.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
