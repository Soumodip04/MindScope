'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Pause, Play, RotateCcw, Sun, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MindfulnessPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(600); // 10 minutes default
  const [isMuted, setIsMuted] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const meditationSessions = [
    {
      id: 'breathing',
      title: 'Mindful Breathing',
      description: 'Focus on your breath with guided breathing exercises',
      duration: 10,
      color: 'from-blue-400 to-cyan-500',
      instructions: [
        'Find a comfortable position',
        'Close your eyes gently',
        'Focus on your natural breath',
        'Notice the sensation of breathing',
        'When your mind wanders, gently return to your breath'
      ]
    },
    {
      id: 'body-scan',
      title: 'Body Scan Meditation',
      description: 'Progressive relaxation from head to toe',
      duration: 15,
      color: 'from-green-400 to-teal-500',
      instructions: [
        'Lie down comfortably',
        'Start at the top of your head',
        'Slowly scan down through your body',
        'Notice any tension or sensations',
        'Breathe into areas of tension'
      ]
    },
    {
      id: 'loving-kindness',
      title: 'Loving Kindness',
      description: 'Cultivate compassion for yourself and others',
      duration: 12,
      color: 'from-pink-400 to-rose-500',
      instructions: [
        'Start with self-compassion',
        'Send loving thoughts to yourself',
        'Extend kindness to loved ones',
        'Include neutral people',
        'Embrace all beings with compassion'
      ]
    },
    {
      id: 'stress-relief',
      title: 'Stress Relief',
      description: 'Release tension and find inner calm',
      duration: 8,
      color: 'from-purple-400 to-indigo-500',
      instructions: [
        'Acknowledge your stress without judgment',
        'Breathe deeply into your belly',
        'Visualize stress leaving your body',
        'Replace tension with calmness',
        'Set intention for peaceful moments'
      ]
    }
  ];

  const breathingPattern = {
    inhale: 4,
    hold: 4,
    exhale: 6
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && selectedSession === 'breathing') {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Breathing pattern cycle (14 seconds total)
          const cycleTime = newTime % 14;
          
          if (cycleTime < breathingPattern.inhale) {
            setBreathPhase('inhale');
          } else if (cycleTime < breathingPattern.inhale + breathingPattern.hold) {
            setBreathPhase('hold');
          } else {
            setBreathPhase('exhale');
          }
          
          if (newTime >= duration * 60) {
            setIsPlaying(false);
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, selectedSession, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = (sessionId: string) => {
    const session = meditationSessions.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(sessionId);
      setDuration(session.duration);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const getBreathingCircleScale = () => {
    if (breathPhase === 'inhale') return 1.3;
    if (breathPhase === 'hold') return 1.3;
    return 1;
  };

  const getBreathingInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-50 flex items-center justify-between p-6 backdrop-blur-xl bg-white/30 border-b border-white/20"
      >
        <Link href="/therapy" className="flex items-center space-x-3 group">
          <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </div>
          <span className="text-gray-700 font-medium">Back to Therapy</span>
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Mindfulness & Meditation</h1>
          <p className="text-gray-600">Find your inner peace</p>
        </div>

        <div className="w-32"></div>
      </motion.header>

      <div className="max-w-6xl mx-auto p-6">
        {!selectedSession ? (
          /* Session Selection */
          <div>
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center"
              >
                <Sun className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Practice</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Select a mindfulness session that resonates with your current needs. Each practice is designed 
                to help you cultivate awareness, reduce stress, and find inner peace.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {meditationSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => startSession(session.id)}
                >
                  <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${session.color} flex items-center justify-center`}>
                    <Sun className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{session.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{session.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {session.duration} minutes
                    </span>
                    <div className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Start Session</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">What you&apos;ll practice:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {session.instructions.slice(0, 3).map((instruction, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Active Session */
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/30"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {meditationSessions.find(s => s.id === selectedSession)?.title}
              </h2>
              <p className="text-gray-600 mb-8">
                {meditationSessions.find(s => s.id === selectedSession)?.description}
              </p>

              {/* Breathing Circle for breathing meditation */}
              {selectedSession === 'breathing' && (
                <div className="mb-8">
                  <motion.div
                    animate={{ scale: getBreathingCircleScale() }}
                    transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 4 : 6, ease: "easeInOut" }}
                    className="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center shadow-2xl"
                  >
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold mb-2">{getBreathingInstruction()}</div>
                      {breathPhase === 'inhale' && <div className="text-sm opacity-80">4 seconds</div>}
                      {breathPhase === 'hold' && <div className="text-sm opacity-80">4 seconds</div>}
                      {breathPhase === 'exhale' && <div className="text-sm opacity-80">6 seconds</div>}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Generic meditation circle for other sessions */}
              {selectedSession !== 'breathing' && (
                <div className="mb-8">
                  <motion.div
                    animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
                    className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-r ${meditationSessions.find(s => s.id === selectedSession)?.color} flex items-center justify-center shadow-2xl`}
                  >
                    <Sun className="w-16 h-16 text-white" />
                  </motion.div>
                </div>
              )}

              {/* Timer */}
              <div className="mb-8">
                <div className="text-5xl font-bold text-gray-800 mb-2">
                  {formatTime(duration * 60 - currentTime)}
                </div>
                <div className="text-gray-600">
                  {formatTime(currentTime)} / {formatTime(duration * 60)}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentTime / (duration * 60)) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={resetSession}
                  className="p-4 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <RotateCcw className="w-6 h-6 text-gray-700" />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-4 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-gray-700" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-8 p-6 bg-white/40 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Guide</h3>
                <div className="space-y-2">
                  {meditationSessions.find(s => s.id === selectedSession)?.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-center space-x-3 text-gray-600">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* End Session */}
              <button
                onClick={() => {
                  setSelectedSession(null);
                  setIsPlaying(false);
                  setCurrentTime(0);
                }}
                className="mt-6 px-6 py-3 bg-white/80 hover:bg-white text-gray-700 rounded-xl font-medium transition-all duration-300"
              >
                End Session
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}