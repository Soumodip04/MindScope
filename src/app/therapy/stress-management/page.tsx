'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Heart, Shield, Target, Wind, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function StressManagementPage() {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stressLevel, setStressLevel] = useState(5);

  const stressTechniques = [
    {
      id: 'breathing',
      title: '4-7-8 Breathing',
      description: 'Calm your nervous system with controlled breathing',
      icon: Wind,
      color: 'from-blue-400 to-cyan-500',
      duration: '5 minutes',
      steps: [
        'Sit comfortably with your back straight',
        'Place your tongue against the ridge behind your upper teeth',
        'Exhale completely through your mouth',
        'Close your mouth and inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat for 4 cycles'
      ]
    },
    {
      id: 'progressive-muscle',
      title: 'Progressive Muscle Relaxation',
      description: 'Release physical tension throughout your body',
      icon: Target,
      color: 'from-green-400 to-teal-500',
      duration: '15 minutes',
      steps: [
        'Find a quiet, comfortable place to lie down',
        'Start with your toes - tense for 5 seconds, then release',
        'Move to your calves - tense and release',
        'Continue with thighs, abdomen, arms, and face',
        'Notice the contrast between tension and relaxation',
        'End with a full-body tension and release',
        'Rest in the feeling of complete relaxation'
      ]
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      description: 'Connect with the present moment using your senses',
      icon: Shield,
      color: 'from-purple-400 to-indigo-500',
      duration: '3 minutes',
      steps: [
        'Look around and name 5 things you can see',
        'Touch and name 4 things you can feel',
        'Listen and name 3 things you can hear',
        'Identify 2 things you can smell',
        'Notice 1 thing you can taste',
        'Take a deep breath and notice how you feel now',
        'Repeat if needed'
      ]
    },
    {
      id: 'cognitive-reframe',
      title: 'Cognitive Reframing',
      description: 'Challenge and change stressful thought patterns',
      icon: Brain,
      color: 'from-yellow-400 to-orange-500',
      duration: '10 minutes',
      steps: [
        'Identify the stressful thought',
        'Ask: "Is this thought helpful or harmful?"',
        'Look for evidence for and against the thought',
        'Consider alternative perspectives',
        'Ask: "What would I tell a friend in this situation?"',
        'Create a more balanced, realistic thought',
        'Practice the new thought regularly'
      ]
    }
  ];

  const stressSymptoms = [
    { category: 'Physical', symptoms: ['Headaches', 'Muscle tension', 'Fatigue', 'Sleep problems'] },
    { category: 'Emotional', symptoms: ['Anxiety', 'Irritability', 'Depression', 'Overwhelm'] },
    { category: 'Behavioral', symptoms: ['Procrastination', 'Social withdrawal', 'Substance use', 'Aggression'] },
    { category: 'Cognitive', symptoms: ['Racing thoughts', 'Forgetfulness', 'Poor concentration', 'Negative thinking'] }
  ];

  const currentTechnique = stressTechniques.find(t => t.id === selectedTechnique);

  const nextStep = () => {
    if (currentTechnique && currentStep < currentTechnique.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetTechnique = () => {
    setSelectedTechnique(null);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-100">
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
          <h1 className="text-2xl font-bold text-gray-800">Stress Management</h1>
          <p className="text-gray-600">Evidence-based stress relief techniques</p>
        </div>

        <div className="w-32"></div>
      </motion.header>

      <div className="max-w-6xl mx-auto p-6">
        {!selectedTechnique ? (
          <div>
            {/* Stress Level Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30 mb-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">How stressed are you feeling right now?</h2>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <span className="text-green-600 font-medium">Low</span>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <button
                        key={level}
                        onClick={() => setStressLevel(level)}
                        className={`w-8 h-8 rounded-full transition-all duration-300 ${
                          level <= stressLevel
                            ? level <= 3 ? 'bg-green-500' : level <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                            : 'bg-gray-200'
                        }`}
                      >
                        <span className="text-white text-sm font-bold">{level}</span>
                      </button>
                    ))}
                  </div>
                  <span className="text-red-600 font-medium">High</span>
                </div>
                <p className="text-gray-600">
                  Your stress level: <span className="font-bold">{stressLevel}/10</span>
                  {stressLevel <= 3 && " - You&apos;re managing well!"}
                  {stressLevel > 3 && stressLevel <= 6 && " - Some stress is normal"}
                  {stressLevel > 6 && " - Let&apos;s work on reducing this stress"}
                </p>
              </div>
            </motion.div>

            {/* Stress Symptoms Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Recognizing Stress Symptoms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stressSymptoms.map((category, index) => (
                  <div key={category.category} className="bg-white/50 rounded-2xl p-6 border border-white/30">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      {category.category === 'Physical' && <Heart className="w-5 h-5 mr-2 text-red-500" />}
                      {category.category === 'Emotional' && <Brain className="w-5 h-5 mr-2 text-blue-500" />}
                      {category.category === 'Behavioral' && <Target className="w-5 h-5 mr-2 text-green-500" />}
                      {category.category === 'Cognitive' && <Zap className="w-5 h-5 mr-2 text-purple-500" />}
                      {category.category}
                    </h3>
                    <ul className="space-y-2">
                      {category.symptoms.map((symptom, i) => (
                        <li key={i} className="text-gray-600 text-sm flex items-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Technique Selection */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Choose a Stress Relief Technique</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stressTechniques.map((technique, index) => (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedTechnique(technique.id)}
                  >
                    <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${technique.color} flex items-center justify-center`}>
                      <technique.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{technique.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{technique.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        {technique.duration}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-500">Start Now</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2">{technique.steps.length} steps</div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-gradient-to-r from-green-400 to-teal-500 h-1 rounded-full w-0"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Technique */
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/30"
            >
              <div className="text-center mb-8">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${currentTechnique?.color} flex items-center justify-center`}>
                  {currentTechnique?.icon && <currentTechnique.icon className="w-10 h-10 text-white" />}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentTechnique?.title}</h2>
                <p className="text-gray-600 mb-4">{currentTechnique?.description}</p>
                <div className="text-sm text-gray-500">
                  Step {currentStep + 1} of {currentTechnique?.steps.length} • {currentTechnique?.duration}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`bg-gradient-to-r ${currentTechnique?.color} h-2 rounded-full`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep + 1) / (currentTechnique?.steps.length || 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Current Step */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center mb-8"
              >
                <div className="text-2xl font-bold text-gray-800 mb-4">
                  {currentTechnique?.steps[currentStep]}
                </div>
                
                {/* Special instructions for breathing technique */}
                {selectedTechnique === 'breathing' && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="text-lg font-semibold text-blue-800 mb-2">Breathing Guide</div>
                    <div className="text-blue-700">
                      {currentStep === 3 && "Breathe in slowly through your nose..."}
                      {currentStep === 4 && "Hold your breath gently..."}
                      {currentStep === 5 && "Exhale slowly through your mouth..."}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={previousStep}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white/80 text-gray-700 hover:bg-white shadow-lg'
                  }`}
                >
                  Previous
                </button>

                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {currentStep + 1} / {currentTechnique?.steps.length}
                  </div>
                </div>

                {currentStep < (currentTechnique?.steps.length || 0) - 1 ? (
                  <button
                    onClick={nextStep}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r ${currentTechnique?.color} text-white hover:shadow-lg`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={resetTechnique}
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-green-500 text-white hover:bg-green-600"
                  >
                    Complete
                  </button>
                )}
              </div>

              {/* Completion Message */}
              {currentStep === (currentTechnique?.steps.length || 0) - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200 text-center"
                >
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Great Work! 🌟</h3>
                  <p className="text-green-700">
                    You&apos;ve completed the {currentTechnique?.title} technique. Take a moment to notice 
                    how you feel now compared to when you started. Regular practice will help you 
                    manage stress more effectively.
                  </p>
                </motion.div>
              )}

              {/* Quick Exit */}
              <div className="mt-6 text-center">
                <button
                  onClick={resetTechnique}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  ← Back to Techniques
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}