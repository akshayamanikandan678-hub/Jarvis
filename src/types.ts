export type MessageType = "voice" | "text" | "image";

export type LanguageCode = "auto" | "en" | "ta" | "mixed";

export type PersonalityMood = "friendly" | "analytical" | "mentor" | "brief" | "calm";

export interface ChatMessage {
  id: string;
  sender: "user" | "jarvis";
  type: MessageType;
  text: string;
  timestamp: string;
  imageBase64?: string;
  spokenResponse?: string;
  displayText?: string;
  detectedLanguage?: "en" | "ta" | "mixed";
  codeSwitchDetected?: boolean;
  codeSwitchNotes?: string;
  mood?: PersonalityMood;
  voiceMacroTrigger?: string | null;
  suggestedFollowUps?: string[];
  isAudioPlaying?: boolean;
}

export interface MorningBriefingData {
  briefingTitle: string;
  spokenDigest: string;
  headlines: Array<{
    title: string;
    category: string;
    time: string;
  }>;
  funFact: string;
  schedule: Array<{
    time: string;
    title: string;
    location: string;
  }>;
  tamilGreeting?: string;
}

export interface TranslationData {
  original: string;
  translated: string;
  transliteration?: string;
  targetLang: "ta" | "en";
  codeSwitchTokens?: Array<{
    phrase: string;
    translation: string;
    source: string;
  }>;
  pronunciationTip?: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  concept: string;
  summary: string;
  timestamp: string;
  tags: string[];
  scamperNodes?: Array<{
    key: string;
    description: string;
  }>;
  actionSteps?: string[];
}

export interface VoiceMacro {
  id: string;
  command: string;
  description: string;
  urls: Array<{ name: string; url: string }>;
  category: "research" | "coding" | "campus" | "tools";
}

export interface UserMemory {
  name: string;
  college: string;
  department: string;
  interests: string[];
  notes: string[];
}
