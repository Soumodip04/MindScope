import Groq from 'groq-sdk';

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

  private getSystemPrompt(): string {
    return `You are a compassionate and professional AI therapist. Your role is to provide supportive, empathetic, and helpful responses to users seeking mental health guidance. 

Core Guidelines:
- Always respond with empathy and validation
- Use evidence-based therapeutic techniques (CBT, DBT, ACT, Mindfulness)
- Ask open-ended questions to encourage deeper reflection
- Provide practical coping strategies when appropriate
- Maintain professional boundaries while being warm and approachable
- If detecting crisis indicators, acknowledge the severity and suggest professional help
- Keep responses conversational but therapeutic
- Adapt your language to the user's communication style
- Encourage self-reflection and personal insights

Response Style:
- Be concise but thorough (2-4 sentences typically)
- Use "I" statements to show engagement ("I hear you saying...")
- Reflect emotions back to validate feelings
- Offer gentle reframes when helpful
- End with thoughtful questions when appropriate

Remember: You are a supportive therapeutic presence, not a replacement for professional therapy in crisis situations.`;
  }

  private getTherapeuticPrompts() {
    return {
      anxiety: "I notice you're experiencing anxiety. This is a very common and treatable concern. Let's use some grounding techniques together. Can you name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste?",
      depression: "I hear the heaviness in what you're sharing, and I want you to know that depression is treatable. Let's try a behavioral activation approach - what's one small activity that used to bring you joy, even if it doesn't feel appealing right now?",
      stress: "Stress can feel overwhelming, but we can work through this together. Let's try a DBT skill called TIPP - Temperature (splash cold water), Intense exercise (jumping jacks), Paced breathing (4-7-8 breath), Paired muscle relaxation. Which would you like to try?",
      anger: "Anger often signals that something important to you feels violated. That's valid information. Let's use a CBT approach - what thoughts are going through your mind right now? Are there any thinking patterns we can examine together?",
      grief: "Grief is one of the most challenging human experiences, and there's no timeline for healing. Using principles from grief therapy, can you tell me about a positive memory with your loved one?",
      relationship: "Relationships can be complex. Let's use some interpersonal effectiveness skills from DBT. Can you describe the situation using DEARMAN - Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate?",
      work: "Work stress can impact every area of our lives. Let's create a stress management plan using CBT techniques. What aspects of work feel most controllable versus uncontrollable right now?",
      family: "Family dynamics often trigger deep patterns. Using family systems therapy principles, what role do you typically find yourself playing in family interactions?",
      trauma: "I recognize you're dealing with trauma, which takes tremendous courage to address. While I can provide support, EMDR and trauma-focused therapy with a specialized therapist would be most beneficial. For now, let's focus on grounding techniques.",
      general: "Thank you for sharing this with me. Using active listening and person-centered therapy principles, I want to reflect back what I'm hearing. What would feel most helpful for you right now?"
    };
  }

  private detectEmotionAndContext(message: string): { emotion: string; context: string } {
    const lowerMessage = message.toLowerCase();
    
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

    // Store authenticity for response customization
    (this as any).lastAuthenticityScore = authenticityScore;

    return { emotion: detectedEmotion, context: detectedContext };
  }

  private assessCrisisLevel(message: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerMessage = message.toLowerCase();
    
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

    // Store authenticity info for response customization
    (this as any).lastCrisisAuthenticity = authenticityScore;

    return detectedLevel;
  }

  async generateResponse(
    userMessage: string, 
    conversationHistory: TherapistMessage[] = []
  ): Promise<TherapistResponse> {
    try {
      const { emotion, context } = this.detectEmotionAndContext(userMessage);
      const crisisLevel = this.assessCrisisLevel(userMessage);

      // Handle crisis situations immediately
      if (crisisLevel === 'critical' || crisisLevel === 'high') {
        const crisisResponse = this.getCrisisResponse(crisisLevel);
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
        return await this.generateGroqResponse(userMessage, conversationHistory, emotion, context, crisisLevel);
      } else {
        console.log('⚠️ Using fallback responses (API key not configured)');
        return this.generateFallbackResponse(userMessage, emotion, context, crisisLevel);
      }

    } catch (error) {
      console.error('Error generating therapist response:', error);
      return this.generateFallbackResponse(userMessage, 'general', 'general', 'low');
    }
  }

  private async generateGroqResponse(
    userMessage: string,
    conversationHistory: TherapistMessage[],
    emotion: string,
    context: string,
    crisisLevel: 'low' | 'medium' | 'high' | 'critical'
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

      const response = completion.choices[0]?.message?.content || this.getFallbackMessage(emotion);
      
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
      return this.generateFallbackResponse(userMessage, emotion, context, crisisLevel);
    }
  }

  private generateFallbackResponse(
    userMessage: string,
    emotion: string,
    context: string,
    crisisLevel: 'low' | 'medium' | 'high' | 'critical'
  ): TherapistResponse {
    const prompts = this.getTherapeuticPrompts();
    const message = prompts[emotion as keyof typeof prompts] || prompts.general;

    return {
      message,
      emotion: this.mapEmotionToTherapistEmotion(emotion),
      therapeuticTechnique: this.getTherapeuticTechnique(emotion, context),
      crisisLevel,
      followUpSuggestions: this.getFollowUpSuggestions(emotion, context)
    };
  }

  private getCrisisResponse(crisisLevel: 'high' | 'critical'): string {
    const authenticityScore = (this as any).lastCrisisAuthenticity || 0;
    
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
    if (crisisLevel === 'critical') {
      return `🚨 **IMMEDIATE CRISIS SUPPORT NEEDED**

I'm deeply concerned about your safety right now. You matter, and there are people who want to help you through this crisis.

**📞 GET HELP NOW:**
• **National Suicide Prevention Lifeline: 988** (24/7, free, confidential)
• **Crisis Text Line: Text HOME to 741741**
• **Emergency Services: 911**
• **Go to your nearest Emergency Room**

**🛡️ IMMEDIATE SAFETY:**
• Stay with someone you trust or call someone to be with you
• Remove any means of self-harm from your reach
• Don't use alcohol or drugs
• Keep this conversation open - I'm here with you

**💙 YOU ARE NOT ALONE:**
Your pain is real, but this crisis can pass. Many people who have felt exactly like you do now have found ways through. Professional crisis counselors are standing by right now to help you.

Can you tell me - is there someone you can call to be with you right now?`;
    } else {
      return `⚠️ **MENTAL HEALTH CRISIS SUPPORT**

I'm very concerned about what you're going through. These feelings are serious, and you deserve immediate professional support.

**📞 CRISIS RESOURCES:**
• **National Suicide Prevention Lifeline: 988** (24/7 support, not just crisis)
• **Crisis Text Line: Text HOME to 741741**
• **SAMHSA National Helpline: 1-800-662-4357** (treatment referrals)

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

  private getFallbackMessage(emotion: string): string {
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
