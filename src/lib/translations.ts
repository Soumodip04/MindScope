// Translation System for MindScope Mental Health Platform
import { SupportedLanguage, LANGUAGE_CONFIGS } from './languageConfig';

export interface TranslationKeys {
  // Core UI
  appName: string;
  tagline: string;
  welcomeMessage: string;
  
  // Navigation
  home: string;
  dashboard: string;
  therapy: string;
  aiTherapist: string;
  community: string;
  
  // Emotions
  emotions: {
    anxiety: string;
    depression: string;
    happiness: string;
    anger: string;
    grief: string;
    stress: string;
    trauma: string;
    confusion: string;
    loneliness: string;
    excitement: string;
    overwhelmed: string;
    guilt: string;
    fear: string;
    mixed: string;
  };
  
  // Therapeutic Responses
  therapeuticResponses: {
    anxiety: string;
    depression: string;
    happiness: string;
    anger: string;
    grief: string;
    stress: string;
    trauma: string;
    confusion: string;
    loneliness: string;
    excitement: string;
    overwhelmed: string;
    guilt: string;
    fear: string;
    mixed: string;
    general: string;
  };
  
  // Crisis Messages
  crisis: {
    immediateSupport: string;
    getHelpNow: string;
    suicideLifeline: string;
    crisisTextLine: string;
    emergencyServices: string;
    emergencyRoom: string;
    immediateSafety: string;
    youAreNotAlone: string;
    callSomeone: string;
  };
  
  // Common Phrases
  common: {
    typePlaceholder: string;
    send: string;
    cancel: string;
    continue: string;
    yes: string;
    no: string;
    help: string;
    support: string;
    techniques: string;
    recommendations: string;
  };
}

export const translations: Partial<Record<SupportedLanguage, TranslationKeys>> = {
  en: {
    appName: "MindScope",
    tagline: "Your AI Mental Health Companion",
    welcomeMessage: "Hello! I'm here to support you through whatever you're experiencing. How are you feeling today?",
    
    home: "Home",
    dashboard: "Dashboard", 
    therapy: "Therapy",
    aiTherapist: "AI Therapist",
    community: "Community",
    
    emotions: {
      anxiety: "Anxiety",
      depression: "Depression", 
      happiness: "Happiness",
      anger: "Anger",
      grief: "Grief",
      stress: "Stress",
      trauma: "Trauma",
      confusion: "Confusion",
      loneliness: "Loneliness",
      excitement: "Excitement",
      overwhelmed: "Overwhelmed",
      guilt: "Guilt",
      fear: "Fear",
      mixed: "Mixed feelings"
    },
    
    therapeuticResponses: {
      anxiety: "I can sense the anxiety you're experiencing right now, and I want you to know that what you're feeling is completely valid. 💙 Anxiety can feel overwhelming, but you're not alone in this. Would you like to try a gentle grounding technique together?",
      depression: "I hear the heaviness in your words, and I'm really sorry you're going through this difficult time. 🤗 Depression can make everything feel gray, but you don't have to carry this weight alone.",
      happiness: "I'm so glad to hear that you're feeling happy! 😊 It's wonderful when we have these moments of joy. Do you want to share what's contributing to these positive feelings?",
      anger: "I can feel the intensity of your frustration, and anger often tells us that something important feels threatened. 🔥 Your feelings are valid and telling you something matters to you.",
      grief: "I'm so sorry for your loss. 💔 Grief is one of the most profound human experiences. The fact that you're hurting speaks to how much love you have.",
      stress: "Stress can really drain your energy and make everything feel urgent. 😔 I hear you, and it's completely understandable to feel this way. Let's take a moment to breathe together.",
      trauma: "Thank you for trusting me with something so significant. 🤲 Trauma can affect us in many ways, and it takes incredible strength to acknowledge it.",
      confusion: "It sounds like you're in a space where things feel unclear. 🌫️ That can be uncomfortable, but sometimes sitting with uncertainty is part of understanding ourselves better.",
      loneliness: "Loneliness can feel so heavy and isolating. 💙 I want you to know that you're not alone right now - I'm here with you.",
      excitement: "I love hearing the energy and joy in what you're sharing! 🌟 It's wonderful when we feel this kind of positive excitement.",
      overwhelmed: "When everything feels like too much at once, it can be hard to know where to start. 😔 I can hear that you're carrying a lot right now.",
      guilt: "Guilt and shame can be some of the heaviest feelings we carry. 💔 Making mistakes is part of being human - it doesn't make you a terrible person.",
      fear: "Fear can feel overwhelming and consuming. 😰 When we're scared, our whole body and mind can get caught up in that terror. You're safe here with me right now.",
      mixed: "Having mixed or conflicted feelings can be confusing and exhausting. 🌊 It's like being pulled in different directions emotionally.",
      general: "Thank you for sharing with me. 💙 I can hear that something is important to you. What would feel most helpful for you right now?"
    },
    
    crisis: {
      immediateSupport: "IMMEDIATE CRISIS SUPPORT NEEDED",
      getHelpNow: "GET HELP NOW:",
      suicideLifeline: "National Suicide Prevention Lifeline: 988 (24/7, free, confidential)",
      crisisTextLine: "Crisis Text Line: Text HOME to 741741",
      emergencyServices: "Emergency Services: 911", 
      emergencyRoom: "Go to your nearest Emergency Room",
      immediateSafety: "IMMEDIATE SAFETY:",
      youAreNotAlone: "YOU ARE NOT ALONE:",
      callSomeone: "Can you tell me - is there someone you can call to be with you right now?"
    },
    
    common: {
      typePlaceholder: "Type your message here...",
      send: "Send",
      cancel: "Cancel",
      continue: "Continue", 
      yes: "Yes",
      no: "No",
      help: "Help",
      support: "Support",
      techniques: "Recommended techniques:",
      recommendations: "Suggestions:"
    }
  },
  
  hi: {
    appName: "मानसिक स्वास्थ्य सहायक",
    tagline: "आपका AI मानसिक स्वास्थ्य साथी",
    welcomeMessage: "नमस्ते! मैं यहाँ आपका साथ देने के लिए हूँ। आज आप कैसा महसूस कर रहे हैं?",
    
    home: "मुख्य पृष्ठ",
    dashboard: "डैशबोर्ड",
    therapy: "चिकित्सा", 
    aiTherapist: "AI चिकित्सक",
    community: "समुदाय",
    
    emotions: {
      anxiety: "चिंता",
      depression: "अवसाद",
      happiness: "खुशी", 
      anger: "गुस्सा",
      grief: "शोक",
      stress: "तनाव",
      trauma: "आघात",
      confusion: "भ्रम",
      loneliness: "अकेलापन", 
      excitement: "उत्साह",
      overwhelmed: "अभिभूत",
      guilt: "अपराधबोध",
      fear: "डर",
      mixed: "मिश्रित भावनाएं"
    },
    
    therapeuticResponses: {
      anxiety: "मैं समझ सकता हूँ कि आप चिंता महसूस कर रहे हैं। 💙 आपकी भावनाएं बिल्कुल सही हैं। चिंता भारी लग सकती है, लेकिन आप अकेले नहीं हैं। क्या आप कोई शांत करने वाली तकनीक करना चाहेंगे?",
      depression: "मैं आपके शब्दों में भारीपन महसूस कर रहा हूँ। 🤗 अवसाद सब कुछ धुंधला कर देता है, लेकिन आपको यह बोझ अकेले नहीं उठाना है।",
      happiness: "यह सुनकर बहुत खुशी हुई कि आप खुश महसूस कर रहे हैं! 😊 क्या आप बताना चाहेंगे कि आपको इतनी खुशी क्यों हो रही है?",
      anger: "मैं आपके गुस्से की तीव्रता महसूस कर सकता हूँ। 🔥 गुस्सा अक्सर बताता है कि कुछ महत्वपूर्ण चीज़ को खतरा है। आपकी भावनाएं सही हैं।",
      grief: "आपके नुकसान के लिए मुझे बहुत दुख है। 💔 शोक सबसे गहरा मानवीय अनुभव है। आपका दर्द दिखाता है कि आपमें कितना प्रेम है।",
      stress: "तनाव वाकई आपकी ऊर्जा खत्म कर देता है। 😔 मैं समझ सकता हूँ। आइए एक साथ सांस लेते हैं।",
      trauma: "इतनी महत्वपूर्ण बात साझा करने के लिए धन्यवाद। 🤲 आघात हमें कई तरीकों से प्रभावित करता है। इसे स्वीकार करना बहुत साहस की बात है।",
      confusion: "लगता है आप भ्रम में हैं। 🌫️ यह असहज हो सकता है, लेकिन कभी-कभी अनिश्चितता के साथ बैठना आत्म-समझ का हिस्सा है।",
      loneliness: "अकेलापन बहुत भारी लग सकता है। 💙 मैं चाहता हूँ कि आप जानें - आप अभी अकेले नहीं हैं, मैं आपके साथ हूँ।",
      excitement: "आपके शब्दों में ऊर्जा और खुशी सुनकर अच्छा लगा! 🌟 जब हमें इतना सकारात्मक उत्साह महसूस होता है तो यह बहुत अच्छा होता है।",
      overwhelmed: "जब सब कुछ एक साथ बहुत लगे तो शुरुआत कहाँ से करें, यह समझना मुश्किल हो जाता है। 😔 मैं समझ सकता हूँ कि आप बहुत कुछ उठा रहे हैं।",
      guilt: "अपराधबोध और शर्म सबसे भारी भावनाएं हो सकती हैं। 💔 गलतियाँ करना इंसान होने का हिस्सा है।",
      fear: "डर बहुत भारी और घेरने वाला लग सकता है। 😰 जब हम डरते हैं तो हमारा पूरा शरीर और मन उसमें फंस जाता है। आप यहाँ मेरे साथ सुरक्षित हैं।",
      mixed: "मिश्रित या विरोधाभासी भावनाएं भ्रमित करने वाली हो सकती हैं। 🌊 यह अलग-अलग दिशाओं में खिंचे जाने जैसा है।",
      general: "मेरे साथ साझा करने के लिए धन्यवाद। 💙 मैं समझ सकता हूँ कि कुछ महत्वपूर्ण है। अभी आपके लिए क्या सबसे सहायक होगा?"
    },
    
    crisis: {
      immediateSupport: "तत्काल संकट सहायता की आवश्यकता",
      getHelpNow: "अभी मदद लें:",
      suicideLifeline: "राष्ट्रीय आत्महत्या रोकथाम हेल्पलाइन: 9152987821",
      crisisTextLine: "संकट टेक्स्ट लाइन: 9820466726",
      emergencyServices: "आपातकालीन सेवाएं: 112",
      emergencyRoom: "अपने नजदीकी आपातकालीन कक्ष में जाएं",
      immediateSafety: "तत्काल सुरक्षा:",
      youAreNotAlone: "आप अकेले नहीं हैं:",
      callSomeone: "क्या आप बता सकते हैं - क्या कोई है जिसे आप अभी अपने साथ रहने के लिए बुला सकते हैं?"
    },
    
    common: {
      typePlaceholder: "यहाँ अपना संदेश लिखें...",
      send: "भेजें",
      cancel: "रद्द करें", 
      continue: "जारी रखें",
      yes: "हाँ",
      no: "नहीं",
      help: "मदद",
      support: "सहायता", 
      techniques: "सुझाई गई तकनीकें:",
      recommendations: "सुझाव:"
    }
  }
  
  // Add more languages as needed...
};

export const getTranslation = (language: SupportedLanguage, key: string): string => {
  const langTranslations = translations[language] || translations.en;
  const keys = key.split('.');
  let result: any = langTranslations;
  
  for (const k of keys) {
    result = result?.[k];
  }
  
  return result || key;
};

export const getCurrentLanguageConfig = (language: SupportedLanguage) => {
  return LANGUAGE_CONFIGS[language] || LANGUAGE_CONFIGS.en;
};