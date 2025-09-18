'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Edit3, 
  Save, 
  Plus, 
  Calendar, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Heart,
  Brain,
  Lightbulb,
  Target,
  ChevronRight,
  Filter,
  Search,
  Download,
  Share,
  Lock,
  Unlock,
  Star,
  Tag,
  BarChart3,
  PieChart,
  Activity,
  Smile,
  Frown,
  Meh,
  Angry,
  Zap,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: number; // 1-10 scale
  emotions: string[];
  tags: string[];
  timestamp: number;
  wordCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  insights: AIInsight[];
  isPrivate: boolean;
  aiAnalysis: {
    keyThemes: string[];
    emotionalPatterns: string[];
    copingMechanisms: string[];
    triggerWords: string[];
    recommendedActions: string[];
    riskIndicators: string[];
  };
}

interface AIInsight {
  type: 'pattern' | 'recommendation' | 'concern' | 'progress';
  message: string;
  confidence: number;
  actionable: boolean;
}

interface WritingPattern {
  category: string;
  trend: 'improving' | 'declining' | 'stable';
  score: number;
  description: string;
  suggestions: string[];
}

export default function AITherapyJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: 5,
    emotions: [],
    tags: [],
    isPrivate: false
  });
  const [isWriting, setIsWriting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [writingPatterns, setWritingPatterns] = useState<WritingPattern[]>([]);
  const [showInsights, setShowInsights] = useState(true);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const emotions = [
    { name: 'Happy', icon: Smile, color: 'text-green-500' },
    { name: 'Sad', icon: Frown, color: 'text-blue-500' },
    { name: 'Neutral', icon: Meh, color: 'text-gray-500' },
    { name: 'Angry', icon: Angry, color: 'text-red-500' },
    { name: 'Excited', icon: Zap, color: 'text-yellow-500' },
  ];

  const commonTags = [
    'anxiety', 'depression', 'stress', 'work', 'relationships', 
    'family', 'health', 'sleep', 'exercise', 'meditation',
    'therapy', 'breakthrough', 'challenge', 'gratitude', 'goals'
  ];

  useEffect(() => {
    // Initialize with sample data
    const sampleEntries: JournalEntry[] = [
      {
        id: '1',
        title: 'First Therapy Session',
        content: 'Today I had my first therapy session. It was nerve-wracking at first, but Dr. Smith made me feel comfortable. We talked about my anxiety around social situations and she gave me some breathing exercises to try. I feel hopeful that this journey will help me grow.',
        mood: 7,
        emotions: ['nervous', 'hopeful'],
        tags: ['therapy', 'anxiety', 'breakthrough'],
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
        wordCount: 156,
        sentiment: 'positive',
        isPrivate: false,
        insights: [
          {
            type: 'progress',
            message: 'Shows openness to therapy and willingness to try new coping strategies',
            confidence: 0.85,
            actionable: true
          }
        ],
        aiAnalysis: {
          keyThemes: ['therapy initiation', 'anxiety management', 'hope'],
          emotionalPatterns: ['initial nervousness followed by comfort'],
          copingMechanisms: ['breathing exercises'],
          triggerWords: ['nerve-wracking', 'anxiety'],
          recommendedActions: ['Continue practicing breathing exercises', 'Prepare topics for next session'],
          riskIndicators: []
        }
      },
      {
        id: '2',
        title: 'Difficult Day at Work',
        content: 'Work was overwhelming today. My manager criticized my presentation in front of the whole team. I felt embarrassed and started doubting myself. The breathing exercises helped a little, but I still feel anxious about tomorrow. Maybe I should talk to Dr. Smith about workplace stress.',
        mood: 3,
        emotions: ['embarrassed', 'anxious', 'overwhelmed'],
        tags: ['work', 'stress', 'anxiety'],
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        wordCount: 112,
        sentiment: 'negative',
        isPrivate: true,
        insights: [
          {
            type: 'concern',
            message: 'Workplace stress appears to be a significant trigger',
            confidence: 0.92,
            actionable: true
          }
        ],
        aiAnalysis: {
          keyThemes: ['workplace stress', 'public criticism', 'self-doubt'],
          emotionalPatterns: ['embarrassment leading to anxiety'],
          copingMechanisms: ['breathing exercises (partially effective)'],
          triggerWords: ['criticized', 'embarrassed', 'doubting'],
          recommendedActions: ['Discuss workplace strategies with therapist', 'Practice self-compassion'],
          riskIndicators: ['persistent self-doubt']
        }
      }
    ];

    setEntries(sampleEntries);

    // Initialize writing patterns
    setWritingPatterns([
      {
        category: 'Emotional Awareness',
        trend: 'improving',
        score: 75,
        description: 'Increasingly identifying and naming emotions',
        suggestions: ['Continue exploring emotion words', 'Notice physical sensations with emotions']
      },
      {
        category: 'Coping Strategies',
        trend: 'stable',
        score: 60,
        description: 'Consistently mentioning learned techniques',
        suggestions: ['Experiment with new coping methods', 'Track effectiveness of current strategies']
      },
      {
        category: 'Self-Reflection',
        trend: 'improving',
        score: 80,
        description: 'Deepening insights and self-understanding',
        suggestions: ['Explore underlying beliefs', 'Connect patterns across entries']
      },
      {
        category: 'Goal Setting',
        trend: 'declining',
        score: 40,
        description: 'Fewer actionable goals mentioned recently',
        suggestions: ['Set specific, measurable goals', 'Review and update goals regularly']
      }
    ]);
  }, []);

  const analyzeEntry = async (content: string): Promise<AIInsight[]> => {
    setAiAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights: AIInsight[] = [];
    
    // Sentiment analysis
    const positiveWords = ['happy', 'grateful', 'progress', 'better', 'hopeful', 'success'];
    const negativeWords = ['sad', 'anxious', 'worried', 'difficult', 'struggle', 'overwhelmed'];
    const concernWords = ['suicide', 'hopeless', 'worthless', 'harm', 'end it all'];
    
    const words = content.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length;
    const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length;
    const concernCount = words.filter(word => concernWords.some(cw => word.includes(cw))).length;
    
    if (concernCount > 0) {
      insights.push({
        type: 'concern',
        message: 'Entry contains language that may indicate crisis risk. Consider reaching out for immediate support.',
        confidence: 0.95,
        actionable: true
      });
    }
    
    if (positiveCount > negativeCount) {
      insights.push({
        type: 'progress',
        message: 'Positive emotional language suggests good coping and resilience.',
        confidence: 0.75,
        actionable: false
      });
    } else if (negativeCount > positiveCount * 2) {
      insights.push({
        type: 'concern',
        message: 'Predominant negative emotional language. Consider discussing coping strategies.',
        confidence: 0.80,
        actionable: true
      });
    }
    
    // Pattern analysis
    if (content.toLowerCase().includes('therapy') || content.toLowerCase().includes('therapist')) {
      insights.push({
        type: 'pattern',
        message: 'Consistent engagement with therapy mentioned. This shows commitment to healing.',
        confidence: 0.70,
        actionable: false
      });
    }
    
    if (words.length > 100) {
      insights.push({
        type: 'recommendation',
        message: 'Detailed reflection shows good self-awareness. Consider exploring specific themes deeper.',
        confidence: 0.65,
        actionable: true
      });
    }
    
    setAiAnalyzing(false);
    return insights;
  };

  const saveEntry = async () => {
    if (!currentEntry.content || !currentEntry.title) return;
    
    const insights = await analyzeEntry(currentEntry.content);
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title!,
      content: currentEntry.content,
      mood: currentEntry.mood || 5,
      emotions: currentEntry.emotions || [],
      tags: currentEntry.tags || [],
      timestamp: Date.now(),
      wordCount: currentEntry.content.split(/\s+/).length,
      sentiment: determineSentiment(currentEntry.content),
      insights,
      isPrivate: currentEntry.isPrivate || false,
      aiAnalysis: generateAIAnalysis(currentEntry.content)
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry({
      title: '',
      content: '',
      mood: 5,
      emotions: [],
      tags: [],
      isPrivate: false
    });
    setIsWriting(false);
  };

  const determineSentiment = (content: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['happy', 'grateful', 'progress', 'better', 'hopeful', 'success', 'good', 'great'];
    const negativeWords = ['sad', 'anxious', 'worried', 'difficult', 'struggle', 'overwhelmed', 'bad', 'terrible'];
    
    const words = content.toLowerCase().split(/\s+/);
    const positiveScore = words.filter(word => positiveWords.some(pw => word.includes(pw))).length;
    const negativeScore = words.filter(word => negativeWords.some(nw => word.includes(nw))).length;
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  };

  const generateAIAnalysis = (content: string) => {
    // This would be replaced with actual AI analysis
    return {
      keyThemes: ['self-reflection', 'emotional processing'],
      emotionalPatterns: ['varied emotional expression'],
      copingMechanisms: ['journaling', 'self-awareness'],
      triggerWords: content.toLowerCase().split(/\s+/).filter(word => 
        ['stress', 'anxiety', 'worry', 'difficult'].includes(word)
      ),
      recommendedActions: ['Continue regular journaling', 'Explore identified themes in therapy'],
      riskIndicators: []
    };
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'from-red-500 to-red-600';
    if (mood <= 5) return 'from-yellow-500 to-orange-500';
    if (mood <= 7) return 'from-blue-500 to-blue-600';
    return 'from-green-500 to-green-600';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😕';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMood = filterMood === null || entry.mood === filterMood;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => entry.tags.includes(tag));
    
    return matchesSearch && matchesMood && matchesTags;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Therapy Journal
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Intelligent journaling with AI-powered insights for deeper self-understanding and therapeutic growth
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Edit3 className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{entries.length}</div>
              <div className="text-sm opacity-75">Total Entries</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {entries.length > 0 ? Math.round(entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length) : 0}
              </div>
              <div className="text-sm opacity-75">Avg Mood</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {writingPatterns.filter(p => p.trend === 'improving').length}
              </div>
              <div className="text-sm opacity-75">Improving Areas</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {entries.reduce((sum, entry) => sum + entry.insights.length, 0)}
              </div>
              <div className="text-sm opacity-75">AI Insights</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Writing Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* New Entry */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">New Journal Entry</h3>
              <button
                onClick={() => setIsWriting(!isWriting)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {isWriting ? 'Cancel' : 'Start Writing'}
              </button>
            </div>

            <AnimatePresence>
              {isWriting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Entry title..."
                    value={currentEntry.title || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />

                  <textarea
                    ref={textareaRef}
                    placeholder="Share your thoughts, feelings, and experiences..."
                    value={currentEntry.content || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full h-64 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />

                  {/* Mood Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Mood (1-10)</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={currentEntry.mood || 5}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                        className="flex-1"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getMoodEmoji(currentEntry.mood || 5)}</span>
                        <span className="text-lg font-medium">{currentEntry.mood || 5}</span>
                      </div>
                    </div>
                  </div>

                  {/* Emotions */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Emotions</label>
                    <div className="flex flex-wrap gap-2">
                      {emotions.map((emotion) => {
                        const Icon = emotion.icon;
                        const isSelected = currentEntry.emotions?.includes(emotion.name.toLowerCase());
                        return (
                          <button
                            key={emotion.name}
                            onClick={() => {
                              const emotions = currentEntry.emotions || [];
                              const updated = isSelected
                                ? emotions.filter(e => e !== emotion.name.toLowerCase())
                                : [...emotions, emotion.name.toLowerCase()];
                              setCurrentEntry(prev => ({ ...prev, emotions: updated }));
                            }}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                              isSelected
                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${emotion.color}`} />
                            <span className="text-sm">{emotion.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {commonTags.map((tag) => {
                        const isSelected = currentEntry.tags?.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => {
                              const tags = currentEntry.tags || [];
                              const updated = isSelected
                                ? tags.filter(t => t !== tag)
                                : [...tags, tag];
                              setCurrentEntry(prev => ({ ...prev, tags: updated }));
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                              isSelected
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Privacy Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {currentEntry.isPrivate ? (
                        <Lock className="w-5 h-5 text-red-500" />
                      ) : (
                        <Unlock className="w-5 h-5 text-green-500" />
                      )}
                      <span className="text-sm text-gray-700">
                        {currentEntry.isPrivate ? 'Private Entry' : 'Shareable Entry'}
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentEntry(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    >
                      Toggle Privacy
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-4">
                    <div className="text-sm text-gray-500">
                      {currentEntry.content ? `${currentEntry.content.split(/\s+/).length} words` : '0 words'}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsWriting(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEntry}
                        disabled={!currentEntry.title || !currentEntry.content || aiAnalyzing}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {aiAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Entry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterMood || ''}
                onChange={(e) => setFilterMood(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Moods</option>
                {[1,2,3,4,5,6,7,8,9,10].map(mood => (
                  <option key={mood} value={mood}>Mood {mood} {getMoodEmoji(mood)}</option>
                ))}
              </select>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredEntries.length} of {entries.length} entries
                </span>
              </div>
            </div>
          </div>

          {/* Entries List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{entry.title}</h3>
                        {entry.isPrivate && (
                          <Lock className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                        <span>{entry.wordCount} words</span>
                        <div className="flex items-center space-x-1">
                          <span>Mood:</span>
                          <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                          <span>{entry.mood}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      entry.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                      entry.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.sentiment}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{entry.content}</p>

                  {/* Tags */}
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Emotions */}
                  {entry.emotions.length > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <div className="flex flex-wrap gap-1">
                        {entry.emotions.map((emotion) => (
                          <span
                            key={emotion}
                            className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs capitalize"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Insights */}
                  {entry.insights.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">AI Insights</span>
                      </div>
                      {entry.insights.map((insight, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border-l-4 ${
                            insight.type === 'concern' ? 'bg-red-50 border-l-red-500' :
                            insight.type === 'progress' ? 'bg-green-50 border-l-green-500' :
                            insight.type === 'recommendation' ? 'bg-blue-50 border-l-blue-500' :
                            'bg-purple-50 border-l-purple-500'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm text-gray-700 flex-1">{insight.message}</p>
                            <div className="ml-3 text-xs text-gray-500">
                              {Math.round(insight.confidence * 100)}% confidence
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredEntries.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No entries found matching your filters.</p>
                <p className="text-sm">Start writing to begin your therapeutic journey!</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {/* Writing Patterns */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Writing Patterns</h3>
            </div>

            <div className="space-y-4">
              {writingPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{pattern.category}</h4>
                    <div className="flex items-center space-x-1">
                      {pattern.trend === 'improving' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : pattern.trend === 'declining' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <Activity className="w-4 h-4 text-gray-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        pattern.trend === 'improving' ? 'text-green-600' :
                        pattern.trend === 'declining' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {pattern.score}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        pattern.score > 70 ? 'bg-green-500' : 
                        pattern.score > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pattern.score}%` }}
                    />
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                  
                  <div className="space-y-1">
                    {pattern.suggestions.slice(0, 2).map((suggestion, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-gray-500">
                        <Lightbulb className="w-3 h-3 text-yellow-500" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Journal</span>
              </button>
              
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>View Analytics</span>
              </button>
              
              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>Share with Therapist</span>
              </button>
            </div>
          </div>

          {/* Insights Toggle */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6" />
                <h3 className="text-lg font-bold">AI Insights</h3>
              </div>
              <button
                onClick={() => setShowInsights(!showInsights)}
                className={`p-2 rounded-lg transition-colors ${
                  showInsights ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                {showInsights ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-sm text-gray-300">
              {showInsights 
                ? 'AI analysis is enabled for all entries'
                : 'AI analysis is disabled'
              }
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
