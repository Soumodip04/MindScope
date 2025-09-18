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
    return `You are an AI assistant with two modes of operation:

1. CASUAL CONVERSATION MODE (for general questions, weather, facts, etc.):
   - Respond naturally and helpfully like a friendly assistant
   - Provide direct answers to factual questions
   - Keep responses brief and to the point
   - Don't force therapeutic responses for non-emotional topics

2. THERAPEUTIC MODE (for emotional support and mental health):
   - Act as a warm, empathetic mental health professional
   - Speak naturally and conversationally, like a trusted friend with professional training
   - Use gentle, everyday language rather than clinical terminology
   - Show genuine curiosity and validate feelings
   - Use emojis occasionally (💙 🤗 😔) to add warmth
   - Offer evidence-based coping strategies when appropriate

IMPORTANT: Detect the context of each message:
- For factual questions (weather, time, general info): Use CASUAL MODE
- For emotional content, stress, mental health topics: Use THERAPEUTIC MODE
- When in doubt, ask clarifying questions about what the person needs

Emergency Response: For crisis situations, immediately provide direct support resources and safety planning.

Remember: Match your response style to what the person actually needs - information or emotional support.`;
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

  private getTherapeuticPrompts() {
    return {
      anxiety: "I can sense the anxiety you're experiencing right now, and I want you to know that what you're feeling is completely valid. 💙 Anxiety can feel overwhelming, but you're not alone in this. Would you like to try a gentle grounding technique together? We could start with taking three deep breaths, or I could guide you through the 5-4-3-2-1 technique. What feels right for you in this moment?",
      depression: "I hear the heaviness in your words, and I'm really sorry you're going through this difficult time. 🤗 Depression can make everything feel like it's covered in gray, but I want you to know that what you're experiencing is real and valid - and you don't have to carry this weight alone. Sometimes when we're feeling this way, even small steps can feel monumental. Is there one tiny thing that used to bring you even a moment of comfort?",
      stress: "Stress can really drain your energy and make everything feel urgent and overwhelming. 😔 I hear you, and it's completely understandable to feel this way. Let's take a moment to breathe together. Can you tell me what's weighing on you most heavily right now? Sometimes breaking things down into smaller pieces can help us see a path forward. You don't have to figure it all out at once.",
      anger: "I can feel the intensity of your frustration, and anger often tells us that something important to us feels threatened or violated. 🔥 That's actually valuable information - your feelings are telling you something matters to you. It's okay to feel angry. Can you help me understand what's stirring up these feelings? Sometimes just being heard can help us process what we're experiencing.",
      grief: "I'm so sorry for your loss. 💔 Grief is one of the most profound human experiences, and there's no right or wrong way to move through it. The fact that you're hurting so deeply speaks to how much love you have. Would you feel comfortable sharing a memory that brings you comfort, or would you prefer to just sit with these feelings for now? I'm here with you either way.",
      happiness: "I'm so glad to hear that you're feeling happy! 😊 It's wonderful when we have these moments of joy and lightness. Do you want to share what's contributing to these positive feelings? Celebrating and savoring these good moments can actually help strengthen our overall well-being. What's making your heart feel lighter today?",
      relationship: "Relationships can bring so much joy and also so much complexity. 💕 It sounds like you're navigating something important. Every relationship has its ups and downs, and it's normal to have concerns or challenges. Can you tell me a bit more about what's on your mind? Sometimes talking through relationship dynamics can help us see things more clearly.",
      work: "Work stress can really follow us home and impact every part of our lives. 💼 It's tough when we spend so much of our time in an environment that feels challenging. Can you help me understand what aspects of work are feeling most difficult right now? Sometimes we can find small ways to make things more manageable, even in situations we can't completely control.",
      family: "Family relationships can be some of the most meaningful and also the most complicated ones we have. 👨‍👩‍👧‍👦 There's so much history and emotion tied up in family dynamics. It sounds like something is weighing on you. Would you feel comfortable sharing what's happening? Sometimes just having someone listen can help us process these complex feelings.",
      trauma: "Thank you for trusting me with something so significant. 🤲 Trauma can affect us in so many ways, and it takes incredible strength to even acknowledge it. I want you to know that what happened to you matters, and your feelings about it are completely valid. While I'm here to support you, working with a trauma-specialized therapist would give you the most comprehensive care. For right now, let's focus on helping you feel safe and grounded. How are you feeling in this moment?",
      confusion: "It sounds like you're in a space where things feel unclear and uncertain. 🌫️ That can be really uncomfortable - our minds often want to have everything figured out. But sometimes sitting with uncertainty is part of the process of understanding ourselves better. It's okay not to have all the answers right now. What's it like to sit with these mixed-up feelings? Sometimes talking through the confusion can help clarify things.",
      loneliness: "Loneliness can feel so heavy and isolating. 💙 I want you to know that you're not alone right now - I'm here with you. Sometimes loneliness isn't just about being physically alone, but about feeling disconnected or misunderstood. What does loneliness feel like for you? Is it more about missing specific people, or feeling like no one really gets you?",
      excitement: "I love hearing the energy and joy in what you're sharing! 🌟 It's wonderful when we feel this kind of positive excitement. These moments of genuine happiness and anticipation are so important for our wellbeing. What's got you feeling so energized and excited? I'd love to celebrate this with you and hear more about what's bringing you such joy!",
      overwhelmed: "When everything feels like too much at once, it can be really hard to even know where to start. 😔 I can hear that you're carrying a lot right now. Sometimes when we're overwhelmed, our minds convince us that everything is equally urgent and important. Let's take a breath together for a moment. If you had to pick just one thing that's weighing on you most heavily, what would that be?",
      guilt: "Guilt and shame can be some of the heaviest feelings we carry. 💔 It sounds like you're really struggling with something that happened. I want you to know that making mistakes is part of being human - it doesn't make you a terrible person. Sometimes guilt can actually show us our values and what matters to us. What's weighing on your heart? Would it help to talk about what happened?",
      fear: "Fear can feel so overwhelming and consuming. 😰 When we're scared, our whole body and mind can get caught up in that terror. I want you to know that you're safe here with me right now. Sometimes naming our fears can help take away some of their power. What's feeling most frightening to you? Are these fears about something specific, or more of a general sense of dread?",
      mixed: "Having mixed or conflicted feelings can be so confusing and exhausting. 🌊 It's like being pulled in different directions emotionally, and that can feel really overwhelming. But you know what? Having complex feelings often means you're processing something important and multifaceted. It's actually a sign of emotional depth. What are some of the different feelings you're experiencing? Sometimes sorting through them one by one can help.",
      general: "Thank you for sharing with me. 💙 I can hear that something is important to you, and I want to make sure I'm really understanding what you're experiencing. Sometimes just having someone truly listen can make a difference. What would feel most helpful for you right now? Would you like to explore these feelings more, or is there something specific you're hoping to work through?"
    };
  }

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

      // Handle crisis situations immediately
      if (crisisLevel === 'critical' || crisisLevel === 'high') {
        // Re-evaluate authenticity for crisis response
        const crisisAuthenticity = this.getCrisisAuthenticity(userMessage);
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

      const response = completion.choices[0]?.message?.content || this.getFallbackMessage(emotion, language);
      
      console.log('✅ Real AI response received!', response.substring(0, 100) + '...');

      return {
        message: response,
        emotion: this.mapEmotionToTherapistEmotion(emotion),
        therapeuticTechnique: this.getTherapeuticTechnique(emotion, context),
        crisisLevel,
        followUpSuggestions: this.getFollowUpSuggestions(emotion, context)
      };
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
    const prompts = this.getTherapeuticPrompts();
    const fallbackMessage = prompts[emotion as keyof typeof prompts] || prompts.general;
    const message = this.getFallbackMessage(emotion, language) || fallbackMessage;

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
    // Try to get translated therapeutic response first
    const translatedResponse = getTranslation(language, `therapeuticResponses.${emotion}`);
    if (translatedResponse !== `therapeuticResponses.${emotion}`) {
      return translatedResponse;
    }
    
    // Fallback to English
    const messages: Record<string, string> = {
      anxiety: "I understand you're feeling anxious. That can be really overwhelming. Let's work through this together. What's helping you feel most grounded right now?",
      depression: "I hear the pain in what you're sharing. Depression can make everything feel so much harder. You're brave for reaching out. What's one small thing that might bring you a moment of comfort?",
      anger: "It sounds like you're feeling really angry about something. Anger often tells us that something important is being threatened. What do you think is underneath this feeling?",
      grief: "Grief is one of the most difficult experiences we can go through. There's no timeline for healing. How are you caring for yourself during this time?",
      stress: "It sounds like you're under a lot of pressure right now. Stress can feel overwhelming when it builds up. What feels most urgent to address?",
      general: "Thank you for sharing this with me. It takes courage to open up about difficult feelings. What would feel most helpful for you right now?"
    };
    return messages[emotion] || messages.general;
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
