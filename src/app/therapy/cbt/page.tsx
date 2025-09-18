'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Brain, CheckCircle, Lightbulb, Target, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CBTPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [thoughts, setThoughts] = useState('');
  const [feelings, setFeelings] = useState('');
  const [behaviors, setBehaviors] = useState('');
  const [challenges, setChallenges] = useState('');

  const cbtSteps = [
    {
      title: 'Identify Your Thoughts',
      description: 'What thoughts are going through your mind right now?',
      icon: Brain,
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Recognize Your Feelings',
      description: 'What emotions are you experiencing?',
      icon: Target,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Notice Your Behaviors',
      description: 'How are you acting or reacting to these thoughts and feelings?',
      icon: Users,
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Challenge Negative Patterns',
      description: 'Let\'s work together to reframe these thoughts',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const thoughtChallenges = [
    "Is this thought based on facts or feelings?",
    "What evidence supports or contradicts this thought?", 
    "What would you tell a friend having this thought?",
    "What's the worst that could realistically happen?",
    "How will this matter in 5 years?",
    "What's a more balanced way to think about this?"
  ];

  const handleNext = () => {
    if (currentStep < cbtSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
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
          <h1 className="text-2xl font-bold text-gray-800">Cognitive Behavioral Therapy</h1>
          <p className="text-gray-600">Interactive CBT Session</p>
        </div>

        <div className="w-32"></div>
      </motion.header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {cbtSteps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / cbtSteps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / cbtSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Current Step */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${cbtSteps[currentStep].color} flex items-center justify-center`}
            >
              {(() => {
                const IconComponent = cbtSteps[currentStep].icon;
                return <IconComponent className="w-8 h-8 text-white" />;
              })()}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {cbtSteps[currentStep].title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {cbtSteps[currentStep].description}
            </p>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your current thoughts:
                </label>
                <textarea
                  value={thoughts}
                  onChange={(e) => setThoughts(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="What's going through your mind right now? Write down your thoughts without judgment..."
                />
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your feelings:
                </label>
                <textarea
                  value={feelings}
                  onChange={(e) => setFeelings(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="How are you feeling emotionally? Anxious, sad, angry, confused...?"
                />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Anxious', 'Sad', 'Angry', 'Confused', 'Overwhelmed', 'Frustrated', 'Hopeless', 'Worried'].map((emotion) => (
                    <button
                      key={emotion}
                      onClick={() => setFeelings(prev => prev ? `${prev}, ${emotion}` : emotion)}
                      className="p-2 text-sm bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your behaviors:
                </label>
                <textarea
                  value={behaviors}
                  onChange={(e) => setBehaviors(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="How are you acting or reacting? Are you avoiding something, isolating, or engaging in unhelpful behaviors?"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Let&apos;s Challenge These Thoughts</h3>
                  <div className="grid gap-4">
                    {thoughtChallenges.map((challenge, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                      >
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 font-medium">{challenge}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write your reframed, more balanced thoughts:
                  </label>
                  <textarea
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Based on the questions above, how can you think about this situation more objectively and helpfully?"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white/80 text-gray-700 hover:bg-white shadow-lg hover:shadow-xl'
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === cbtSteps.length - 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === cbtSteps.length - 1
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {currentStep === cbtSteps.length - 1 ? 'Complete Session' : 'Next'}
            </button>
          </div>

          {/* Session Summary */}
          {currentStep === cbtSteps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200"
            >
              <h3 className="text-lg font-semibold text-green-800 mb-3">Session Complete! 🎉</h3>
              <p className="text-green-700">
                Great work! You&apos;ve successfully completed a CBT session. Remember to practice these reframed thoughts 
                in your daily life. Consider writing them down or setting reminders to reinforce positive thinking patterns.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}