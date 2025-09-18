'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Brain, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

interface ThoughtRecordExerciseProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: ThoughtRecordResult) => void;
}

interface ThoughtRecordResult {
  situation: string;
  negativeThought: string;
  initialIntensity: number;
  evidenceFor: string[];
  evidenceAgainst: string[];
  balancedThought: string;
  finalIntensity: number;
}

export default function ThoughtRecordExercise({ isOpen, onClose, onComplete }: ThoughtRecordExerciseProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ThoughtRecordResult>>({
    evidenceFor: [],
    evidenceAgainst: []
  });

  const steps = [
    {
      title: "Identify the Situation",
      description: "What happened? Describe the specific situation that triggered your negative thoughts.",
      field: "situation" as keyof ThoughtRecordResult
    },
    {
      title: "Capture the Negative Thought",
      description: "What went through your mind? Write down the exact negative thought you had.",
      field: "negativeThought" as keyof ThoughtRecordResult
    },
    {
      title: "Rate Initial Intensity",
      description: "How strongly do you believe this thought right now? (1-10 scale)",
      field: "initialIntensity" as keyof ThoughtRecordResult
    },
    {
      title: "Evidence FOR the Thought",
      description: "What evidence supports this negative thought? List facts, not feelings.",
      field: "evidenceFor" as keyof ThoughtRecordResult
    },
    {
      title: "Evidence AGAINST the Thought",
      description: "What evidence contradicts this thought? Look for alternative perspectives.",
      field: "evidenceAgainst" as keyof ThoughtRecordResult
    },
    {
      title: "Create a Balanced Thought",
      description: "Based on the evidence, what's a more balanced, realistic way to think about this?",
      field: "balancedThought" as keyof ThoughtRecordResult
    },
    {
      title: "Rate Final Intensity",
      description: "How strongly do you believe the original negative thought now? (1-10 scale)",
      field: "finalIntensity" as keyof ThoughtRecordResult
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      // Complete the exercise
      onComplete(formData as ThoughtRecordResult);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: keyof ThoughtRecordResult, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEvidence = (type: 'evidenceFor' | 'evidenceAgainst', evidence: string) => {
    if (evidence.trim()) {
      const currentList = formData[type] as string[] || [];
      updateFormData(type, [...currentList, evidence.trim()]);
    }
  };

  const removeEvidence = (type: 'evidenceFor' | 'evidenceAgainst', index: number) => {
    const currentList = formData[type] as string[] || [];
    updateFormData(type, currentList.filter((_, i) => i !== index));
  };

  const currentStep = steps[step - 1];
  const isValid = () => {
    switch (currentStep.field) {
      case 'situation':
      case 'negativeThought':
      case 'balancedThought':
        return formData[currentStep.field] && (formData[currentStep.field] as string).trim().length > 0;
      case 'initialIntensity':
      case 'finalIntensity':
        const value = formData[currentStep.field] as number;
        return value !== undefined && value >= 1 && value <= 10;
      case 'evidenceFor':
      case 'evidenceAgainst':
        return (formData[currentStep.field] as string[] || []).length > 0;
      default:
        return true;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">CBT Thought Record</h2>
                    <p className="text-blue-100">Step {step} of {steps.length}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-300"
                style={{ width: `${(step / steps.length) * 100}%` }}
              />
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {currentStep.title}
                </h3>
                <p className="text-gray-600">
                  {currentStep.description}
                </p>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                {(currentStep.field === 'situation' || 
                  currentStep.field === 'negativeThought' || 
                  currentStep.field === 'balancedThought') && (
                  <textarea
                    value={formData[currentStep.field] as string || ''}
                    onChange={(e) => updateFormData(currentStep.field, e.target.value)}
                    placeholder={`Enter your ${currentStep.field}...`}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                )}

                {(currentStep.field === 'initialIntensity' || currentStep.field === 'finalIntensity') && (
                  <div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData[currentStep.field] as number || 5}
                      onChange={(e) => updateFormData(currentStep.field, parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>1 - Not at all</span>
                      <span className="font-semibold text-lg">
                        {formData[currentStep.field] || 5}
                      </span>
                      <span>10 - Completely</span>
                    </div>
                  </div>
                )}

                {(currentStep.field === 'evidenceFor' || currentStep.field === 'evidenceAgainst') && (
                  <div>
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        placeholder="Add evidence..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && (currentStep.field === 'evidenceFor' || currentStep.field === 'evidenceAgainst')) {
                            addEvidence(currentStep.field, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add evidence..."]') as HTMLInputElement;
                          if (input?.value && (currentStep.field === 'evidenceFor' || currentStep.field === 'evidenceAgainst')) {
                            addEvidence(currentStep.field, input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {(formData[currentStep.field] as string[] || []).map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-800">{item}</span>
                          <button
                            onClick={() => (currentStep.field === 'evidenceFor' || currentStep.field === 'evidenceAgainst') && removeEvidence(currentStep.field, index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 flex justify-between">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={!isValid()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
              >
                {step === steps.length ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete Exercise</span>
                  </>
                ) : (
                  <span>Next Step</span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}