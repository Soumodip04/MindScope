'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Brain, Heart, MessageCircle, Send, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AITherapySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AITherapySessionModal({ isOpen, onClose }: AITherapySessionModalProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI mental health companion. I'm here to provide support and listen to whatever is on your mind. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionMood, setSessionMood] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiResponses = [
    "I understand that must be challenging for you. Can you tell me more about what specifically is making you feel this way?",
    "Thank you for sharing that with me. Your feelings are completely valid. What kind of support do you feel would be most helpful right now?",
    "It sounds like you're going through a difficult time. Remember that it's okay to not be okay sometimes. What usually helps you cope when you're feeling like this?",
    "I appreciate your openness in sharing this. You're taking an important step by talking about your feelings. Have you noticed any patterns in when these feelings tend to come up?",
    "That's a very insightful observation. It shows a lot of self-awareness. What do you think might be some small steps you could take to address this?",
    "I can hear the strength in your words, even when you're struggling. What are some things in your life that bring you comfort or joy?",
    "Thank you for trusting me with this. It takes courage to open up about these feelings. How would you like to work through this together?"
  ];

  const quickResponses = [
    "I'm feeling anxious",
    "I'm having trouble sleeping",
    "I feel overwhelmed",
    "I need someone to talk to",
    "I'm feeling better today"
  ];

  const moodOptions = [
    { emoji: '😢', label: 'Very sad', value: 1 },
    { emoji: '😞', label: 'Sad', value: 2 },
    { emoji: '😐', label: 'Neutral', value: 3 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😊', label: 'Great', value: 5 }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage.trim();
    if (!messageText) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const newAIMessage = {
        id: messages.length + 2,
        type: 'ai' as const,
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Therapy Session</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-purple-100 text-sm">AI Companion Online</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex h-[600px]">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' 
                              ? 'bg-blue-500' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className={`rounded-2xl px-4 py-3 ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white rounded-tr-sm'
                              : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Responses */}
                  <div className="px-6 py-2 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {quickResponses.map((response, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(response)}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                        >
                          {response}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message here..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isTyping}
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || isTyping}
                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="w-80 border-l border-gray-200 bg-gray-50">
                  <div className="p-6 space-y-6">
                    {/* Mood Check */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling?</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {moodOptions.map((mood) => (
                          <button
                            key={mood.value}
                            onClick={() => setSessionMood(mood.value)}
                            className={`p-3 rounded-lg text-center transition-all ${
                              sessionMood === mood.value
                                ? 'bg-purple-100 border-2 border-purple-500'
                                : 'bg-white border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="text-2xl mb-1">{mood.emoji}</div>
                            <div className="text-xs text-gray-600">{mood.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Session Info */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Session Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{Math.floor(messages.length / 2)} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Messages:</span>
                          <span className="font-medium">{messages.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Privacy:</span>
                          <span className="font-medium text-green-600">Secure</span>
                        </div>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Helpful Resources</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Breathing Exercise</span>
                        </button>
                        <button className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Mindfulness Guide</span>
                        </button>
                        <button className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Crisis Hotline</span>
                        </button>
                      </div>
                    </div>

                    {/* End Session */}
                    <button
                      onClick={() => {
                        alert('Session summary saved. Thank you for talking with me today. Remember, you can always come back whenever you need support.');
                        onClose();
                      }}
                      className="w-full py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      End Session
                    </button>
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
