import { MorningBriefingData, TranslationData, IdeaItem, PersonalityMood, LanguageCode } from "../types";

export interface SendMessagePayload {
  message: string;
  type: "voice" | "text" | "image";
  imageBase64?: string;
  imageMimeType?: string;
  language?: LanguageCode;
  mood?: PersonalityMood;
  campusMode?: boolean;
  history?: Array<{ role: "user" | "assistant"; text: string }>;
}

export interface JarvisResponse {
  spokenResponse: string;
  displayText: string;
  detectedLanguage?: "en" | "ta" | "mixed";
  codeSwitchDetected?: boolean;
  codeSwitchNotes?: string;
  mood?: PersonalityMood;
  voiceMacroTrigger?: string | null;
  suggestedFollowUps?: string[];
  error?: string;
}

export async function sendMessageToJarvis(payload: SendMessagePayload): Promise<JarvisResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function fetchMorningBriefing(depth: "short" | "standard" = "standard", language: "en" | "ta" | "bilingual" = "bilingual"): Promise<MorningBriefingData> {
  const response = await fetch("/api/morning-briefing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ depth, language }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch morning briefing`);
  }

  return response.json();
}

export async function translateTamilEnglish(text: string, targetLang: "ta" | "en" = "ta"): Promise<TranslationData> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLang }),
  });

  if (!response.ok) {
    throw new Error(`Translation failed`);
  }

  return response.json();
}

export async function brainstormIdea(concept: string, method: "SCAMPER" | "MINDMAP" = "SCAMPER"): Promise<IdeaItem> {
  const response = await fetch("/api/brainstorm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concept, method }),
  });

  if (!response.ok) {
    throw new Error(`Ideation failed`);
  }

  const data = await response.json();
  return {
    id: `idea_${Date.now()}`,
    title: data.title || concept,
    concept: concept,
    summary: data.summary || "",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    tags: data.tags || ["Brainstorm", "AI"],
    scamperNodes: data.scamperNodes || [],
    actionSteps: data.actionSteps || [],
  };
}
