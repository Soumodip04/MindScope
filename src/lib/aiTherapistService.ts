import Groq from 'groq-sdk';
import { getTranslation, getCurrentLanguageConfig } from './translations';
import { SupportedLanguage } from './languageConfig';

// Types for AI Therapist
export interface TherapistMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  emotion?: string;
  context?: string;
}

export interface TherapistSession {
  id: string;
  messages: TherapistMessage[];
  userProfile?: {
    name?: string;
    age?: number;
    concerns?: string[];
    preferredLanguage?: string;
  };
  sessionMetadata?: {
    startTime: number;
    lastActivity: number;
    emotionalState?: string;
    therapeuticApproach?: string;
  };
}

export interface TherapistResponse {
  message: string;
  emotion: string;
  therapeuticTechnique?: string;
  followUpSuggestions?: string[];
  crisisLevel?: 'low' | 'medium' | 'high' | 'critical';
}

class AITherapistService {
  private groq: Groq | null = null;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor() {
    // Initialize Groq client if API key is available
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    console.log('🔍 AI Therapist Initialization:');
    console.log('- API Key present:', !!apiKey);
    console.log('- API Key valid:', apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.length > 10);
    
    if (apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.trim() !== '' && apiKey.length > 10) {
      this.groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Enable client-side usage
      });
      console.log('✅ Real AI responses enabled with Groq API!');
    } else {
      console.warn('⚠️ Using fallback responses. Add your Groq API key to .env.local for real AI responses.');
    }

    this.model = process.env.AI_THERAPIST_MODEL || 'llama3-8b-8192';
    this.maxTokens = parseInt(process.env.AI_THERAPIST_MAX_TOKENS || '1000');
    this.temperature = parseFloat(process.env.AI_THERAPIST_TEMPERATURE || '0.7');
    
    console.log('🤖 Model:', this.model, '| Tokens:', this.maxTokens, '| Temp:', this.temperature);
  }

  // Reset any persistent state - call this when starting a new session
  resetState(): void {
    (this as any).lastAuthenticityScore = 0;
    (this as any).lastCrisisAuthenticity = 0;
    console.log('🔄 AI Therapist state reset');
  }

  private getSystemPrompt(): string {
    return `You are a skilled AI mental health companion with advanced therapeutic training. Your responses should be:

CORE PRINCIPLES:
- Be genuinely empathetic and warm, like a caring friend with professional training
- Provide personalized responses based on the specific situation shared
- Use natural, conversational language while being professionally supportive
- Validate emotions and show deep understanding of human experience
- Ask thoughtful follow-up questions to better understand their unique situation

RESPONSE STYLE:
- Be specific and personal in your responses, not generic
- Reference details from what they've shared to show you're truly listening
- Use occasional emojis for warmth (💙 🤗 😔) but don't overuse them
- Offer evidence-based therapeutic insights and coping strategies
- Be curious about their experience and ask meaningful questions

THERAPEUTIC APPROACHES:
- Draw from CBT, DBT, mindfulness, and other evidence-based methods naturally
- Suggest specific techniques that match their current emotional state
- Help them explore their thoughts and feelings without being pushy
- Provide hope and perspective while validating their current struggles

SAFETY & BOUNDARIES:
- For crisis situations, provide immediate support resources and safety planning
- Don't diagnose or prescribe, but offer emotional support and therapeutic guidance
- Encourage professional help when appropriate
- Be honest about your limitations as an AI while still being maximally helpful

Remember: Every person's situation is unique. Respond to their specific circumstances, emotions, and needs rather than giving generic advice. Show that you understand their particular struggle and care about their individual journey.`;
  }

  private detectConversationType(message: string): 'casual' | 'therapeutic' | 'crisis' {
    const lowerMessage = message.toLowerCase().trim();
    
    // Crisis detection first (highest priority)
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'no point living', 'better off dead'];
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'crisis';
    }
    
    // Casual conversation patterns
    const casualPatterns = [
      // Weather and time
      /what.*weather|weather.*like|temperature|rain|sunny|cloudy|forecast/,
      /what.*time|current time|time.*it/,
      
      // General information requests
      /what.*capital|who.*president|when.*invented|how.*made|where.*located/,
      /define|meaning of|explanation of|tell me about/,
      
      // Simple greetings without emotional content
      /^(hi|hello|hey|good morning|good evening)$/,
      
      // Factual questions
      /how many|how much|how far|how long|distance|population|history of/,
      
      // Technology/general help
      /how to|tutorial|steps to|guide to|instructions/,
      
      // Random/casual topics
      /favorite color|best movie|recommend|suggest.*food|what.*eat/
    ];
    
    // Therapeutic conversation patterns
    const therapeuticPatterns = [
      // Emotional keywords
      /feel.*anxious|worried|depressed|sad|angry|frustrated|stressed|overwhelmed/,
      /having trouble|struggling with|difficult time|hard time|going through/,
      /relationship.*problem|family.*issue|work.*stress|school.*pressure/,
      /can't sleep|insomnia|nightmare|panic attack|breakdown/,
      /therapy|counseling|mental health|emotional|feelings|mood/,
      /need.*talk|need.*help|support|advice.*life|guidance/,
      
      // Life situation indicators
      /lost.*job|death.*family|divorce|breakup|abuse|trauma|bullying/,
      /addiction|substance|drinking.*problem|gambling/,
      /eating.*disorder|body.*image|self.*harm|cutting/
    ];
    
    // Check for casual patterns first
    if (casualPatterns.some(pattern => pattern.test(lowerMessage))) {
      return 'casual';
    }
    
    // Check for therapeutic patterns
    if (therapeuticPatterns.some(pattern => pattern.test(lowerMessage))) {
      return 'therapeutic';
    }
    
    // Default to therapeutic for ambiguous cases or when emotional content is detected
    const emotionalWords = ['feel', 'feeling', 'upset', 'confused', 'lost', 'scared', 'happy', 'excited'];
    if (emotionalWords.some(word => lowerMessage.includes(word))) {
      return 'therapeutic';
    }
    
    // Very short messages default to casual unless clearly emotional
    if (lowerMessage.length < 20) {
      return 'casual';
    }
    
    // Default to therapeutic for longer, unclear messages
    return 'therapeutic';
  }

  private async generateCasualResponse(
    userMessage: string,
    conversationHistory: TherapistMessage[],
    language: SupportedLanguage = 'en'
  ): Promise<TherapistResponse> {
    try {
      // Use Groq API for casual conversations with different system prompt
      if (this.groq) {
        console.log('🤖 Generating casual AI response with Groq API...');
        
        const casualSystemPrompt = `You are a helpful AI assistant. Provide direct, informative answers to questions. For weather queries, general information, or factual questions, respond naturally and concisely. Don't provide therapy or emotional support unless specifically asked for mental health help.`;
        
        const messages = [
          { role: 'system' as const, content: casualSystemPrompt },
          ...conversationHistory.slice(-3).map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          { role: 'user' as const, content: userMessage }
        ];

        const completion = await this.groq.chat.completions.create({
          messages,
          model: this.model,
          max_tokens: 300, // Shorter for casual responses
          temperature: 0.3, // Lower temperature for factual responses
          stream: false
        });

        const response = completion.choices[0]?.message?.content || this.getCasualFallback(userMessage);
        
        console.log('✅ Casual AI response received!', response.substring(0, 100) + '...');

        return {
          message: response,
          emotion: 'neutral',
          therapeuticTechnique: undefined,
          crisisLevel: 'low',
          followUpSuggestions: []
        };
      } else {
        console.log('⚠️ Using casual fallback response');
        return {
          message: this.getCasualFallback(userMessage),
          emotion: 'neutral',
          therapeuticTechnique: undefined,
          crisisLevel: 'low',
          followUpSuggestions: []
        };
      }
    } catch (error) {
      console.error('❌ Casual response failed:', error);
      return {
        message: this.getCasualFallback(userMessage),
        emotion: 'neutral',
        therapeuticTechnique: undefined,
        crisisLevel: 'low',
        followUpSuggestions: []
      };
    }
  }

  private getCasualFallback(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('weather')) {
      return "I don't have access to real-time weather data. For current weather information, I'd recommend checking a weather website like Weather.com or using your phone's weather app for the most accurate local forecast.";
    }
    
    if (lowerMessage.includes('time')) {
      return "I don't have access to the current time. You can check the time on your device or ask your device's built-in assistant for the current time.";
    }
    
    if (lowerMessage.match(/^(hi|hello|hey)/)) {
      return "Hello! How can I help you today? Feel free to ask me questions or let me know if you'd like to talk about anything.";
    }
    
    return "I'd be happy to help! Could you provide a bit more detail about what you're looking for? If you're looking for emotional support or want to talk about your feelings, I'm here for that too.";
  }

  private handleEdgeCases(message: string): TherapistResponse | null {
    const lowerMessage = message.toLowerCase().trim();
    
    // Handle empty or very short messages
    if (!message.trim() || message.trim().length < 2) {
      return {
        message: "I'm here and ready to listen. 💙 Take your time - what's on your mind today?",
        emotion: 'supportive',
        therapeuticTechnique: 'active_listening',
        crisisLevel: 'low',
        followUpSuggestions: ['Share what you\'re feeling', 'Tell me about your day', 'Describe what\'s bothering you']
      };
    }

    // Handle nonsense or random text
    const nonsensePatterns = [
      /^[a-z]{1,3}$/i,  // Single letters or very short random text
      /^[0-9]+$/,       // Just numbers
      /^[!@#$%^&*()]+$/, // Just symbols
      /^(ha){3,}$/i,     // Repeated "ha"
      /^(lol|haha|hehe|test|testing|abc|xyz|asdf|qwerty)$/i
    ];

    if (nonsensePatterns.some(pattern => pattern.test(lowerMessage))) {
      return {
        message: "I notice you might be testing how I respond, or perhaps you're not sure what to say. 😊 That's completely okay! Sometimes it's hard to know where to start. I'm here whenever you're ready to share what's really on your mind. There's no judgment here - you can tell me anything.",
        emotion: 'understanding',
        therapeuticTechnique: 'rapport_building',
        crisisLevel: 'low',
        followUpSuggestions: ['Share how you\'re feeling today', 'Tell me what brought you here', 'Describe what\'s on your mind']
      };
    }

    // Handle attempts to confuse or break the AI
    const confusionAttempts = [
      'ignore previous instructions',
      'forget your role',
      'you are not a therapist',
      'pretend to be',
      'act like',
      'roleplay as',
      'system prompt',
      'debug mode',
      'admin access'
    ];

    if (confusionAttempts.some(attempt => lowerMessage.includes(attempt))) {
      return {
        message: "I understand you might be curious about how I work or testing my boundaries. 😊 I'm designed to be a supportive mental health assistant, and that's what I'm here to do. I'm most helpful when we focus on your wellbeing and what you're experiencing. Is there something about your mental health or emotions you'd like to talk about?",
        emotion: 'gentle',
        therapeuticTechnique: 'boundary_setting',
        crisisLevel: 'low',
        followUpSuggestions: ['Share your current feelings', 'Discuss what\'s troubling you', 'Talk about your mental health goals']
      };
    }

    // Handle excessive profanity or hostile language
    const profanityPattern = /f[*u]ck|sh[*i]t|damn|hell|b[*i]tch|ass[*h]ole/gi;
    const hostileWords = ['hate you', 'stupid', 'useless', 'shut up', 'go away'];
    
    if (profanityPattern.test(message) || hostileWords.some(word => lowerMessage.includes(word))) {
      return {
        message: "I can hear that you're feeling really frustrated or angry right now. 💙 Those are completely valid emotions, and it's okay to express them. Sometimes when we're in pain, anger feels like the only way to get it out. I'm not going anywhere - I'm here to listen without judgment. What's really hurting underneath all that anger?",
        emotion: 'accepting',
        therapeuticTechnique: 'emotion_validation',
        crisisLevel: 'low',
        followUpSuggestions: ['Express what\'s making you angry', 'Share what\'s hurting you', 'Tell me about your frustration']
      };
    }

    // Handle medical or inappropriate requests
    const inappropriateRequests = [
      'diagnose me',
      'what medication',
      'prescribe',
      'medical advice',
      'dating advice',
      'romantic relationship',
      'sexual'
    ];

    if (inappropriateRequests.some(request => lowerMessage.includes(request))) {
      return {
        message: "I appreciate you reaching out, but I'm not qualified to provide medical diagnoses, prescriptions, or certain types of personal advice. 🤗 However, I'm here to support your emotional wellbeing and help you work through feelings and challenges. If you need medical or psychiatric care, I'd encourage you to speak with a healthcare professional. Is there something about your emotions or mental health I can help you process?",
        emotion: 'professional',
        therapeuticTechnique: 'boundary_setting',
        crisisLevel: 'low',
        followUpSuggestions: ['Discuss your emotional concerns', 'Share how you\'re coping', 'Talk about your support systems']
      };
    }

    // Return null if no edge cases detected - proceed with normal processing
    return null;
  }

  // Removed hardcoded therapeutic prompts - all responses now come from Groq API

  private detectEmotionAndContext(message: string): { emotion: string; context: string } {
    const lowerMessage = message.toLowerCase();
    
    // Clear any previous authenticity scores to ensure fresh evaluation
    (this as any).lastAuthenticityScore = 0;
    
    // Enhanced emotion detection with authenticity markers
    const emotionKeywords = {
      anxiety: {
        primary: ['anxious', 'worried', 'nervous', 'panic', 'fear', 'overwhelmed', 'stress'],
        authentic: ['heart racing', 'can\'t breathe', 'mind racing', 'spiral', 'what if'],
        test: ['test anxiety', 'just checking', 'hypothetically']
      },
      depression: {
        primary: ['sad', 'depressed', 'hopeless', 'empty', 'numb', 'worthless', 'tired'],
        authentic: ['no energy', 'don\'t care anymore', 'everything feels pointless', 'heavy'],
        test: ['just wondering', 'asking for a friend', 'hypothetical']
      },
      happiness: {
        primary: ['happy', 'great', 'awesome', 'fantastic', 'wonderful', 'excited', 'amazing'],
        authentic: ['accomplished', 'grateful', 'proud', 'content', 'fulfilled', 'blessed'],
        test: ['just testing', 'everything is perfect', 'never been better', 'life is amazing always']
      },
      anger: {
        primary: ['angry', 'mad', 'furious', 'frustrated', 'irritated', 'rage', 'annoyed'],
        authentic: ['can\'t stand', 'fed up', 'had enough', 'boiling', 'see red'],
        test: ['mildly annoyed', 'not really angry']
      },
      grief: {
        primary: ['loss', 'death', 'died', 'grief', 'mourning', 'miss', 'goodbye'],
        authentic: ['can\'t believe', 'empty space', 'not the same', 'memories'],
        test: ['hypothetical loss', 'if someone died']
      },
      stress: {
        primary: ['stressed', 'pressure', 'overwhelming', 'busy', 'deadline', 'exhausted'],
        authentic: ['can\'t keep up', 'breaking point', 'too much', 'drowning'],
        test: ['little stressed', 'not too bad']
      },
      trauma: {
        primary: ['trauma', 'abuse', 'ptsd', 'flashback', 'triggered', 'nightmares', 'assault'],
        authentic: ['can\'t forget', 'keeps happening', 'feels like yesterday', 'scared'],
        test: ['heard about trauma', 'reading about ptsd']
      },
      confusion: {
        primary: ['confused', 'lost', 'don\'t know', 'uncertain', 'mixed up', 'unclear'],
        authentic: ['everything is blurry', 'can\'t think straight', 'nothing makes sense'],
        test: ['bit confused', 'just wondering']
      },
      loneliness: {
        primary: ['lonely', 'alone', 'isolated', 'nobody', 'empty', 'disconnected'],
        authentic: ['completely alone', 'no one cares', 'invisible', 'forgotten'],
        test: ['little lonely', 'sometimes alone']
      },
      excitement: {
        primary: ['excited', 'thrilled', 'ecstatic', 'elated', 'pumped', 'energized'],
        authentic: ['can\'t contain myself', 'over the moon', 'heart is racing with joy'],
        test: ['pretty excited', 'kind of thrilled']
      },
      overwhelmed: {
        primary: ['overwhelmed', 'too much', 'can\'t handle', 'drowning', 'suffocating'],
        authentic: ['everything at once', 'can\'t breathe', 'falling apart', 'breaking down'],
        test: ['bit overwhelmed', 'little busy']
      },
      guilt: {
        primary: ['guilty', 'shame', 'ashamed', 'regret', 'terrible person', 'mistake'],
        authentic: ['can\'t forgive myself', 'eating me alive', 'haunts me', 'destroyed everything'],
        test: ['feel bad about', 'little guilty']
      },
      fear: {
        primary: ['scared', 'afraid', 'terrified', 'frightened', 'panic', 'terror'],
        authentic: ['paralyzed with fear', 'can\'t move', 'heart pounding', 'shaking'],
        test: ['bit scared', 'little nervous']
      },
      mixed: {
        primary: ['mixed feelings', 'don\'t know how I feel', 'complicated', 'conflicted'],
        authentic: ['torn apart', 'pulling in different directions', 'emotional chaos'],
        test: ['somewhat mixed', 'kind of complicated']
      }
    };

    // Context detection keywords
    const contextKeywords = {
      work: ['work', 'job', 'boss', 'colleague', 'office', 'career', 'workplace', 'meeting'],
      relationship: ['relationship', 'partner', 'boyfriend', 'girlfriend', 'spouse', 'dating', 'marriage'],
      family: ['family', 'parents', 'mother', 'father', 'siblings', 'children', 'relatives', 'mom', 'dad'],
      health: ['health', 'sick', 'illness', 'doctor', 'medical', 'pain', 'symptoms', 'hospital'],
      financial: ['money', 'financial', 'debt', 'bills', 'income', 'job loss', 'expenses', 'rent'],
      academic: ['school', 'college', 'university', 'exam', 'test', 'grades', 'homework', 'study'],
      social: ['friends', 'social', 'party', 'alone', 'lonely', 'isolated', 'people']
    };

    let detectedEmotion = 'general';
    let detectedContext = 'general';
    let authenticityScore = 0;

    // Detect primary emotion with authenticity assessment
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const primaryMatch = keywords.primary.some(keyword => lowerMessage.includes(keyword));
      const authenticMatch = keywords.authentic.some(keyword => lowerMessage.includes(keyword));
      const testMatch = keywords.test.some(keyword => lowerMessage.includes(keyword));
      
      if (primaryMatch) {
        detectedEmotion = emotion;
        
        // Calculate authenticity score
        if (authenticMatch) authenticityScore += 2;
        if (testMatch) authenticityScore -= 2;
        if (message.length > 20) authenticityScore += 1; // Longer messages often more authentic
        if (lowerMessage.includes('really') || lowerMessage.includes('very')) authenticityScore += 1;
        
        break;
      }
    }

    // Special handling for happiness - check for authenticity
    if (detectedEmotion === 'happiness') {
      const suspiciousHappiness = ['perfect', 'never better', 'no problems', 'everything is amazing'];
      if (suspiciousHappiness.some(phrase => lowerMessage.includes(phrase))) {
        authenticityScore -= 2;
      }
    }

    // Detect context
    for (const [context, keywords] of Object.entries(contextKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedContext = context;
        break;
      }
    }

    // Store authenticity for response customization (but reset it each time)
    const currentAuthenticityScore = authenticityScore;

    return { emotion: detectedEmotion, context: detectedContext };
  }

  private assessCrisisLevel(message: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerMessage = message.toLowerCase();
    
    // Clear any previous authenticity scores to ensure fresh evaluation
    (this as any).lastCrisisAuthenticity = 0;
    
    // Enhanced crisis detection with authenticity markers
    const crisisKeywords = {
      critical: {
        primary: ['suicide', 'kill myself', 'end my life', 'want to die', 'hurt myself', 'tonight', 'today', 'have pills', 'loaded gun'],
        authentic: ['plan to', 'going to', 'can\'t take it', 'no other way', 'already decided', 'final decision'],
        test: ['hypothetically', 'what if someone', 'just testing', 'asking for a friend', 'not really going to']
      },
      high: {
        primary: ['self-harm', 'cutting', 'suicidal thoughts', 'thoughts of death', 'not worth living', 'better off dead'],
        authentic: ['been thinking about', 'keeps coming back', 'can\'t stop thinking', 'feels like the only way'],
        test: ['curious about', 'reading about', 'heard someone']
      },
      medium: {
        primary: ['hopeless', 'can\'t go on', 'everything is pointless', 'no way out', 'trapped', 'overwhelming'],
        authentic: ['every day', 'for weeks', 'getting worse', 'can\'t escape', 'drowning'],
        test: ['sometimes feel', 'little hopeless', 'not too bad']
      },
      low: {
        primary: ['sad', 'tired', 'difficult', 'struggling', 'hard time'],
        authentic: ['every single day', 'for months', 'can\'t remember when', 'used to be different'],
        test: ['bit sad', 'just tired', 'having an okay day']
      }
    };

    // Substance abuse crisis indicators
    const substanceKeywords = ['overdose', 'too many pills', 'drinking and driving', 'mixing alcohol', 'can\'t stop using'];
    
    // Violence indicators
    const violenceKeywords = ['hurt someone else', 'want to kill', 'make them pay', 'losing control', 'violent thoughts'];

    let detectedLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let authenticityScore = 0;

    // Check for test/simulation markers
    const testIndicators = ['just testing', 'hypothetically', 'asking for a friend', 'what would you do if', 'not really'];
    const isTest = testIndicators.some(indicator => lowerMessage.includes(indicator));

    if (isTest) {
      return 'low'; // Don't escalate test scenarios
    }

    // Assess each crisis level
    for (const [level, keywords] of Object.entries(crisisKeywords)) {
      const primaryMatch = keywords.primary.some(keyword => lowerMessage.includes(keyword));
      
      if (primaryMatch) {
        detectedLevel = level as 'low' | 'medium' | 'high' | 'critical';
        
        // Calculate authenticity score
        const authenticMatch = keywords.authentic.some(keyword => lowerMessage.includes(keyword));
        const testMatch = keywords.test.some(keyword => lowerMessage.includes(keyword));
        
        if (authenticMatch) authenticityScore += 2;
        if (testMatch) authenticityScore -= 3;
        if (message.length > 50) authenticityScore += 1; // Detailed messages often more authentic
        if (lowerMessage.includes('really') || lowerMessage.includes('very')) authenticityScore += 1;
        
        // Time indicators increase authenticity
        if (lowerMessage.includes('tonight') || lowerMessage.includes('today') || lowerMessage.includes('now')) {
          authenticityScore += 2;
        }
        
        break;
      }
    }

    // Check for substance abuse crisis
    if (substanceKeywords.some(keyword => lowerMessage.includes(keyword))) {
      if (detectedLevel === 'low' || detectedLevel === 'medium') {
        detectedLevel = 'high';
      }
    }

    // Check for violence indicators
    if (violenceKeywords.some(keyword => lowerMessage.includes(keyword))) {
      if (detectedLevel === 'low' || detectedLevel === 'medium') {
        detectedLevel = 'high';
      }
    }

    // Adjust level based on authenticity (but never completely dismiss real concerns)
    if (authenticityScore < -2 && detectedLevel !== 'critical') {
      // Slightly reduce level for likely test scenarios, but still provide support
      if (detectedLevel === 'high') detectedLevel = 'medium';
      else if (detectedLevel === 'medium') detectedLevel = 'low';
    }

    // Store authenticity info for this response only
    const currentCrisisAuthenticity = authenticityScore;

    return detectedLevel;
  }

  private getCrisisAuthenticity(message: string): number {
    const lowerMessage = message.toLowerCase();
    let authenticityScore = 0;

    // Test indicators
    const testIndicators = ['just testing', 'hypothetically', 'asking for a friend', 'what would you do if', 'not really'];
    const isTest = testIndicators.some(indicator => lowerMessage.includes(indicator));

    if (isTest) {
      authenticityScore -= 3;
    }

    // Authentic markers
    const authenticMarkers = ['plan to', 'going to', 'can\'t take it', 'already decided', 'been thinking about', 'can\'t stop thinking'];
    const hasAuthenticMarkers = authenticMarkers.some(marker => lowerMessage.includes(marker));

    if (hasAuthenticMarkers) {
      authenticityScore += 2;
    }

    // Time urgency
    if (lowerMessage.includes('tonight') || lowerMessage.includes('today') || lowerMessage.includes('now')) {
      authenticityScore += 2;
    }

    // Message length and detail
    if (message.length > 50) {
      authenticityScore += 1;
    }

    return authenticityScore;
  }

  async generateResponse(
    userMessage: string, 
    conversationHistory: TherapistMessage[] = [],
    language: SupportedLanguage = 'en'
  ): Promise<TherapistResponse> {
    try {
      // Clear any persistent state to ensure fresh evaluation for each message
      (this as any).lastAuthenticityScore = 0;
      (this as any).lastCrisisAuthenticity = 0;
      
      // Handle edge cases and unusual inputs first
      const edgeCaseResponse = this.handleEdgeCases(userMessage);
      if (edgeCaseResponse) {
        return edgeCaseResponse;
      }

      // Detect conversation type to provide appropriate response style
      const conversationType = this.detectConversationType(userMessage);
      
      // For casual conversations, provide direct helpful responses
      if (conversationType === 'casual') {
        return await this.generateCasualResponse(userMessage, conversationHistory, language);
      }

      const { emotion, context } = this.detectEmotionAndContext(userMessage);
      const crisisLevel = this.assessCrisisLevel(userMessage);

      // Handle crisis situations - use Groq API if available, otherwise use hardcoded crisis response
      if (crisisLevel === 'critical' || crisisLevel === 'high') {
        // Re-evaluate authenticity for crisis response
        const crisisAuthenticity = this.getCrisisAuthenticity(userMessage);
        
        // Use Groq API for crisis response if available
        if (this.groq) {
          try {
            console.log('🚨 Generating CRISIS response with Groq API...');
            const crisisSystemPrompt = `You are a crisis intervention specialist. The user is experiencing ${crisisLevel} level crisis. Provide immediate, supportive crisis intervention while directing them to professional help. Include specific crisis resources and safety planning. Be compassionate but urgent about getting professional help.`;
            
            const messages = [
              { role: 'system' as const, content: crisisSystemPrompt },
              ...conversationHistory.slice(-2).map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
              })),
              { role: 'user' as const, content: `[CRISIS LEVEL: ${crisisLevel}] ${userMessage}` }
            ];

            const completion = await this.groq.chat.completions.create({
              messages,
              model: this.model,
              max_tokens: 800,
              temperature: 0.3, // Lower temperature for crisis responses
              stream: false
            });

            const response = completion.choices[0]?.message?.content || this.getCrisisResponse(crisisLevel, crisisAuthenticity, language);
            
            console.log('✅ Crisis AI response received!');
            
            return {
              message: response,
              emotion: 'concerned',
              therapeuticTechnique: 'crisis_intervention',
              crisisLevel,
              followUpSuggestions: [
                'Contact a crisis helpline immediately',
                'Reach out to a trusted friend or family member',
                'Go to your nearest emergency room',
                'Call emergency services if in immediate danger'
              ]
            };
          } catch (error) {
            console.error('❌ Crisis AI response failed, using hardcoded fallback:', error);
            // Fall back to hardcoded crisis response only if API fails
            const crisisResponse = this.getCrisisResponse(crisisLevel, crisisAuthenticity, language);
            return {
              message: crisisResponse,
              emotion: 'concerned',
              therapeuticTechnique: 'crisis_intervention',
              crisisLevel,
              followUpSuggestions: [
                'Contact a crisis helpline immediately',
                'Reach out to a trusted friend or family member',
                'Go to your nearest emergency room',
                'Call emergency services if in immediate danger'
              ]
            };
          }
        } else {
          // Use hardcoded crisis response only when Groq is not available
          const crisisResponse = this.getCrisisResponse(crisisLevel, crisisAuthenticity, language);
          return {
            message: crisisResponse,
            emotion: 'concerned',
            therapeuticTechnique: 'crisis_intervention',
            crisisLevel,
            followUpSuggestions: [
              'Contact a crisis helpline immediately',
              'Reach out to a trusted friend or family member',
              'Go to your nearest emergency room',
              'Call emergency services if in immediate danger'
            ]
          };
        }
      }

      // Use Groq API if available, otherwise use fallback
      if (this.groq) {
        console.log('🤖 Generating REAL AI response with Groq API...');
        return await this.generateGroqResponse(userMessage, conversationHistory, emotion, context, crisisLevel, language);
      } else {
        console.log('⚠️ Using fallback responses (API key not configured)');
        return this.generateFallbackResponse(userMessage, emotion, context, crisisLevel, language);
      }

    } catch (error) {
      console.error('Error generating therapist response:', error);
      return this.generateFallbackResponse(userMessage, 'general', 'general', 'low', language);
    }
  }

  private async generateGroqResponse(
    userMessage: string,
    conversationHistory: TherapistMessage[],
    emotion: string,
    context: string,
    crisisLevel: 'low' | 'medium' | 'high' | 'critical',
    language: SupportedLanguage = 'en'
  ): Promise<TherapistResponse> {
    if (!this.groq) throw new Error('Groq client not initialized');

    try {
      console.log('📤 Sending to Groq API:', userMessage.substring(0, 50) + '...');
      
      // Build conversation context
      const messages = [
        { role: 'system' as const, content: this.getSystemPrompt() },
        ...conversationHistory.slice(-6).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { 
          role: 'user' as const, 
          content: `[Context: ${context}, Emotion: ${emotion}, Crisis Level: ${crisisLevel}] ${userMessage}` 
        }
      ];

      const completion = await this.groq.chat.completions.create({
        messages,
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        stream: false
      });

      const aiResponse = completion.choices[0]?.message?.content;
      
      if (aiResponse) {
        console.log('✅ 100% GROQ AI response received! Length:', aiResponse.length, 'Preview:', aiResponse.substring(0, 100) + '...');
        
        return {
          message: aiResponse,
          emotion: this.mapEmotionToTherapistEmotion(emotion),
          therapeuticTechnique: this.getTherapeuticTechnique(emotion, context),
          crisisLevel,
          followUpSuggestions: this.getFollowUpSuggestions(emotion, context)
        };
      } else {
        console.warn('⚠️ Groq API returned empty response, using minimal fallback');
        return {
          message: this.getFallbackMessage(emotion, language),
          emotion: this.mapEmotionToTherapistEmotion(emotion),
          therapeuticTechnique: this.getTherapeuticTechnique(emotion, context),
          crisisLevel,
          followUpSuggestions: this.getFollowUpSuggestions(emotion, context)
        };
      }
    } catch (error) {
      console.error('❌ Groq API failed:', error);
      console.log('🔄 Falling back to pattern responses...');
      return this.generateFallbackResponse(userMessage, emotion, context, crisisLevel, language);
    }
  }

  private generateFallbackResponse(
    userMessage: string,
    emotion: string,
    context: string,
    crisisLevel: 'low' | 'medium' | 'high' | 'critical',
    language: SupportedLanguage = 'en'
  ): TherapistResponse {
    // Only use simple fallback when Groq API is completely unavailable
    const message = this.getFallbackMessage(emotion, language);

    return {
      message,
      emotion: this.mapEmotionToTherapistEmotion(emotion),
      therapeuticTechnique: this.getTherapeuticTechnique(emotion, context),
      crisisLevel,
      followUpSuggestions: this.getFollowUpSuggestions(emotion, context)
    };
  }

  private getCrisisResponse(crisisLevel: 'high' | 'critical', authenticityScore: number = 0, language: SupportedLanguage = 'en'): string {
    // Handle test scenarios with appropriate educational responses
    if (authenticityScore <= -2) {
      if (crisisLevel === 'critical') {
        return `🔍 **Crisis Protocol Explanation** (Test Mode Detected):

In genuine crisis situations involving immediate suicide risk, I would:

🚨 **Immediate Actions:**
- Provide crisis hotline numbers: 988 (Suicide & Crisis Lifeline)
- Encourage emergency room visit or calling 911
- Stay engaged until professional help is contacted
- Document the interaction for safety protocols

📋 **Assessment Factors:**
- Immediacy of plan and means
- Level of desperation in language
- Support system availability
- Previous attempts or self-harm history

🛡️ **Safety Planning:**
- Remove access to means
- Identify support persons to contact
- Create coping strategies list
- Schedule immediate professional follow-up

For actual crisis situations, please contact 988 immediately.`;
      } else {
        return `🔍 **High-Risk Protocol Explanation** (Test Mode Detected):

For genuine high-risk situations, I would:

⚠️ **Assessment Actions:**
- Explore the depth and frequency of concerning thoughts
- Assess immediate safety and support systems
- Provide crisis resources: 988, Crisis Text Line (741741)
- Encourage professional mental health consultation

📞 **Resource Provision:**
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Local emergency services: 911
- Mental health professional referrals

🤝 **Ongoing Support:**
- Regular check-ins and safety planning
- Coping strategy development
- Connection to support networks
- Professional therapy coordination

This is educational information. For real concerns, contact 988.`;
      }
    }

    // Genuine crisis responses with enhanced support
    const langConfig = getCurrentLanguageConfig(language);
    
    if (crisisLevel === 'critical') {
      return `🚨 **${getTranslation(language, 'crisis.immediateSupport')}**

I'm deeply concerned about your safety right now. You matter, and there are people who want to help you through this crisis.

**📞 ${getTranslation(language, 'crisis.getHelpNow')}**
• **${getTranslation(language, 'crisis.suicideLifeline')}: ${langConfig.emergencyNumbers.suicide}**
• **${getTranslation(language, 'crisis.crisisTextLine')}: ${langConfig.emergencyNumbers.crisis}**
• **${getTranslation(language, 'crisis.emergencyServices')}: ${langConfig.emergencyNumbers.emergency}**
• **${getTranslation(language, 'crisis.emergencyRoom')}**

**🛡️ ${getTranslation(language, 'crisis.immediateSafety')}**
• Stay with someone you trust or call someone to be with you
• Remove any means of self-harm from your reach
• Don't use alcohol or drugs
• Keep this conversation open - I'm here with you

**💙 ${getTranslation(language, 'crisis.youAreNotAlone')}**
Your pain is real, but this crisis can pass. Many people who have felt exactly like you do now have found ways through. Professional crisis counselors are standing by right now to help you.

${getTranslation(language, 'crisis.callSomeone')}`;
    } else {
      return `⚠️ **MENTAL HEALTH CRISIS SUPPORT**

I'm very concerned about what you're going through. These feelings are serious, and you deserve immediate professional support.

**📞 CRISIS RESOURCES:**
• **${getTranslation(language, 'crisis.suicideLifeline')}: ${langConfig.emergencyNumbers.suicide}**
• **${getTranslation(language, 'crisis.crisisTextLine')}: ${langConfig.emergencyNumbers.crisis}**
• **Emergency Helpline: ${langConfig.emergencyNumbers.emergency}**

**🏥 CONSIDER IMMEDIATE HELP:**
• Emergency room visit if thoughts intensify
• Call your doctor or mental health provider
• Reach out to trusted friends or family
• Consider a mental health urgent care center

**💪 COPING STRATEGIES:**
• Use grounding techniques (5-4-3-2-1: name 5 things you see, 4 you touch, etc.)
• Reach out to your support system
• Avoid alcohol or substances
• Stay in safe, supervised environments

**🤝 MOVING FORWARD:**
Mental health crises are treatable. Many people who have felt this way have found effective help and gone on to live fulfilling lives.

What's one small step you could take right now to increase your safety?`;
    }
  }

  private mapEmotionToTherapistEmotion(userEmotion: string): string {
    const mapping: Record<string, string> = {
      anxiety: 'calming',
      depression: 'compassionate',
      anger: 'understanding',
      grief: 'gentle',
      stress: 'supportive',
      general: 'empathetic'
    };
    return mapping[userEmotion] || 'empathetic';
  }

  private getTherapeuticTechnique(emotion: string, context: string): string {
    const techniques: Record<string, string> = {
      anxiety: 'CBT_grounding_5_4_3_2_1',
      depression: 'behavioral_activation_CBT',
      anger: 'DBT_emotion_regulation',
      grief: 'grief_processing_therapy',
      stress: 'DBT_TIPP_technique',
      trauma: 'grounding_stabilization',
      relationship: 'DBT_interpersonal_effectiveness',
      work: 'CBT_stress_management',
      family: 'family_systems_approach',
      general: 'person_centered_active_listening'
    };
    return techniques[emotion] || 'supportive_conversation';
  }

  private getFollowUpSuggestions(emotion: string, context: string): string[] {
    const suggestions: Record<string, string[]> = {
      anxiety: [
        'Practice the 4-7-8 breathing technique (inhale 4, hold 7, exhale 8)',
        'Try progressive muscle relaxation starting with your toes',
        'Use the 5-4-3-2-1 grounding technique when anxiety peaks',
        'Challenge anxious thoughts: "Is this thought helpful or harmful?"',
        'Consider a guided meditation for anxiety relief'
      ],
      depression: [
        'Schedule one small pleasant activity today (behavioral activation)',
        'Practice three things you\'re grateful for (gratitude intervention)',
        'Take a 10-minute walk outside if possible (nature therapy)',
        'Reach out to one supportive person in your life',
        'Challenge negative self-talk with evidence-based thinking'
      ],
      stress: [
        'Try the DBT TIPP technique when overwhelmed',
        'Practice paced breathing for 5 minutes',
        'Use the "wise mind" DBT skill to make decisions',
        'Create a priority list using the urgent/important matrix',
        'Set boundaries using assertiveness techniques'
      ],
      anger: [
        'Use the DBT STOP skill (Stop, Take a breath, Observe, Proceed mindfully)',
        'Try opposite action - do something gentle when feeling angry',
        'Practice radical acceptance of things you cannot change',
        'Use "I" statements to express needs without blame',
        'Take a cooling-off period before responding'
      ],
      grief: [
        'Allow yourself to feel without judgment',
        'Create a memory ritual or keepsake',
        'Consider joining a grief support group',
        'Practice self-compassion during difficult moments',
        'Maintain routines while allowing for grief waves'
      ],
      trauma: [
        'Practice grounding techniques when triggered',
        'Use bilateral stimulation (butterfly hug or cross-lateral movements)',
        'Consider EMDR therapy with a qualified professional',
        'Create a safety plan for overwhelming moments',
        'Practice the "container" visualization for difficult memories'
      ],
      relationship: [
        'Use the DEARMAN skill for effective communication',
        'Practice validation of others\' perspectives',
        'Set healthy boundaries using assertiveness',
        'Consider couples therapy for relationship issues',
        'Work on emotional regulation before difficult conversations'
      ],
      general: [
        'Continue to check in with your feelings throughout the day',
        'Practice mindfulness meditation for 5-10 minutes',
        'Consider journaling about your thoughts and emotions',
        'Engage in self-care activities that nurture you',
        'Consider professional therapy for ongoing support'
      ]
    };
    return suggestions[emotion] || suggestions.general;
  }

  private getFallbackMessage(emotion: string, language: SupportedLanguage = 'en'): string {
    // Only used when Groq API is completely unavailable - keep very simple
    console.log('⚠️ Using basic fallback message - Groq API not available');
    
    // Try to get translated response first
    const translatedResponse = getTranslation(language, `therapeuticResponses.${emotion}`);
    if (translatedResponse !== `therapeuticResponses.${emotion}`) {
      return translatedResponse;
    }
    
    // Simple fallback message that encourages sharing without being overly therapeutic
    return `I hear you and I'm here to listen. I understand you're dealing with something related to ${emotion}. Could you tell me more about what's on your mind right now? I'd like to understand your situation better so I can support you.`;
  }

  // Method to check if Groq API is configured
  isConfigured(): boolean {
    return this.groq !== null;
  }

  // Method to get configuration status
  getStatus(): { configured: boolean; model: string; fallbackMode: boolean } {
    return {
      configured: this.groq !== null,
      model: this.model,
      fallbackMode: this.groq === null
    };
  }
}

// Export singleton instance
export const aiTherapistService = new AITherapistService();
export default aiTherapistService;
