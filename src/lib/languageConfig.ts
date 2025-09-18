// Multilingual Support System for MindScope
// Supporting Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, Punjabi, and other languages

export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // Hindi  
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'ml' // Malayalam
  | 'kn' // Kannada
  | 'or' // Odia
  | 'as' // Assamese
  | 'ur' // Urdu
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'zh' // Chinese
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'ar' // Arabic
  | 'pt' // Portuguese
  | 'ru' // Russian;

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl?: boolean;
  emergencyNumbers: {
    suicide: string;
    crisis: string;
    emergency: string;
  };
  culturalContext: {
    familyImportance: 'high' | 'medium' | 'low';
    stigmaLevel: 'high' | 'medium' | 'low';
    religiousInfluence: 'high' | 'medium' | 'low';
    collectiveVsIndividual: 'collective' | 'individual' | 'mixed';
  };
}

export const LANGUAGE_CONFIGS: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    emergencyNumbers: {
      suicide: '988',
      crisis: '741741',
      emergency: '911'
    },
    culturalContext: {
      familyImportance: 'medium',
      stigmaLevel: 'medium',
      religiousInfluence: 'low',
      collectiveVsIndividual: 'individual'
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    emergencyNumbers: {
      suicide: '9152987821',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    emergencyNumbers: {
      suicide: '104',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    emergencyNumbers: {
      suicide: '104',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    emergencyNumbers: {
      suicide: '9831775959',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    emergencyNumbers: {
      suicide: '9152987821',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    emergencyNumbers: {
      suicide: '9152987821',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    emergencyNumbers: {
      suicide: '9152987821',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'medium',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    emergencyNumbers: {
      suicide: '104',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'medium',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    emergencyNumbers: {
      suicide: '104',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    rtl: true,
    emergencyNumbers: {
      suicide: '9152987821',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    rtl: true,
    emergencyNumbers: {
      suicide: '920033360',
      crisis: '8002474357',
      emergency: '999'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    emergencyNumbers: {
      suicide: '988',
      crisis: '741741',
      emergency: '911'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'medium',
      religiousInfluence: 'medium',
      collectiveVsIndividual: 'mixed'
    }
  },
  or: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    emergencyNumbers: {
      suicide: '104',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  as: {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    emergencyNumbers: {
      suicide: '104',
      crisis: '9820466726',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'high',
      collectiveVsIndividual: 'collective'
    }
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    emergencyNumbers: {
      suicide: '3114',
      crisis: '0800235236',
      emergency: '15'
    },
    culturalContext: {
      familyImportance: 'medium',
      stigmaLevel: 'low',
      religiousInfluence: 'low',
      collectiveVsIndividual: 'individual'
    }
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    emergencyNumbers: {
      suicide: '0800-1110111',
      crisis: '0800-1110222',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'medium',
      stigmaLevel: 'low',
      religiousInfluence: 'low',
      collectiveVsIndividual: 'individual'
    }
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    emergencyNumbers: {
      suicide: '0570-783-556',
      crisis: '0120-279-338',
      emergency: '119'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'low',
      collectiveVsIndividual: 'collective'
    }
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    emergencyNumbers: {
      suicide: '1393',
      crisis: '1588-9191',
      emergency: '119'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'low',
      collectiveVsIndividual: 'collective'
    }
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    emergencyNumbers: {
      suicide: '213-164-174',
      crisis: '808-200-204',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'medium',
      religiousInfluence: 'medium',
      collectiveVsIndividual: 'mixed'
    }
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    emergencyNumbers: {
      suicide: '8-800-2000-122',
      crisis: '8-495-989-50-50',
      emergency: '112'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'medium',
      religiousInfluence: 'medium',
      collectiveVsIndividual: 'collective'
    }
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    emergencyNumbers: {
      suicide: '400-161-9995',
      crisis: '400-161-9995',
      emergency: '120'
    },
    culturalContext: {
      familyImportance: 'high',
      stigmaLevel: 'high',
      religiousInfluence: 'low',
      collectiveVsIndividual: 'collective'
    }
  }
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';