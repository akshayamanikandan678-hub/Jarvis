import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Sliders,
  Radio,
  Volume2,
  GraduationCap,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  ChatMessage,
  MorningBriefingData,
  IdeaItem,
  VoiceMacro,
  UserMemory,
  PersonalityMood,
  LanguageCode,
  MessageType,
} from "./types";
import { DEFAULT_USER_MEMORY, DEFAULT_VOICE_MACROS } from "./data/campusData";
import { sendMessageToJarvis, fetchMorningBriefing } from "./services/jarvisApi";
import { speechEngine } from "./services/speechService";
import { Header } from "./components/Header";
import { ArcReactor } from "./components/ArcReactor";
import { UnifiedInput } from "./components/UnifiedInput";
import { ConversationStream } from "./components/ConversationStream";
import { MorningBriefingModal } from "./components/MorningBriefingModal";
import { CampusModeDrawer } from "./components/CampusModeDrawer";
import { TranslationWidget } from "./components/TranslationWidget";
import { IdeaDiaryModal } from "./components/IdeaDiaryModal";
import { VoiceMacroManager } from "./components/VoiceMacroManager";
import { PersonalityMemoryModal } from "./components/PersonalityMemoryModal";
import { ProjectDossierModal } from "./components/ProjectDossierModal";

export default function App() {
  // -------------------------------------------------------------
  // Application State
  // -------------------------------------------------------------
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "msg_init_1",
        sender: "jarvis",
        type: "voice",
        text: "Systems initialized. Good day, Miss Akshaya. J.A.R.V.I.S 5.0 is online with SVGI Tiruppur campus context and bilingual (Tamil + English) neural pipelines ready. Say 'Hey Jarvis' or select a module to begin.",
        spokenResponse:
          "Good day, Miss Akshaya. J.A.R.V.I.S 5.0 is online and at your service.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        detectedLanguage: "en",
        mood: "friendly",
        suggestedFollowUps: [
          "Jarvis, give me today's morning briefing",
          "வணக்கம் ஜார்விஸ், இன்றைய வகுப்பு நேரம் என்ன?",
          "Research SIH 2026 problem statements",
        ],
      },
    ];
  });

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWakeWordActive, setIsWakeWordActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("auto");
  const [currentMood, setCurrentMood] = useState<PersonalityMood>("friendly");
  const [campusMode, setCampusMode] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.05);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  // Noise & Audio Telemetry
  const [noiseDb, setNoiseDb] = useState(38);
  const [isNoiseLoud, setIsNoiseLoud] = useState(false);

  // Persistent user state
  const [userMemory, setUserMemory] = useState<UserMemory>(() => {
    const saved = localStorage.getItem("jarvis_memory");
    return saved ? JSON.parse(saved) : DEFAULT_USER_MEMORY;
  });

  const [ideas, setIdeas] = useState<IdeaItem[]>(() => {
    const saved = localStorage.getItem("jarvis_ideas");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "idea_1",
            title: "Voice-First Multilingual Edge Assistant (SIH 2026)",
            concept: "Autonomous voice AI running bilingual Tamil-English code-switching for tier-2/3 college campuses.",
            summary: "Combines Web Speech API with low-latency LLM intelligence and campus contextual dispatch.",
            timestamp: "09:30 AM",
            tags: ["SIH Project", "AI Assistant", "Tamil NLP"],
            scamperNodes: [
              { key: "Combine", description: "Merge local campus schedule telemetry with real-time news briefs." },
              { key: "Adapt", description: "Adapt automotive HUD voice controls for student research tasks." },
            ],
            actionSteps: [
              "Conduct live test at SVGI AI & Data Science lab",
              "Benchmark Tamil code-switch accuracy",
            ],
          },
        ];
  });

  const [macros, setMacros] = useState<VoiceMacro[]>(() => {
    const saved = localStorage.getItem("jarvis_macros");
    return saved ? JSON.parse(saved) : DEFAULT_VOICE_MACROS;
  });

  const [morningBriefing, setMorningBriefing] = useState<MorningBriefingData | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  // Modals
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isCampusOpen, setIsCampusOpen] = useState(false);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isIdeaDiaryOpen, setIsIdeaDiaryOpen] = useState(false);
  const [isMacrosOpen, setIsMacrosOpen] = useState(false);
  const [isPersonalityOpen, setIsPersonalityOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("jarvis_memory", JSON.stringify(userMemory));
  }, [userMemory]);

  useEffect(() => {
    localStorage.setItem("jarvis_ideas", JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem("jarvis_macros", JSON.stringify(macros));
  }, [macros]);

  // Ambient Noise Monitor setup (2.8 in PDF)
  useEffect(() => {
    let stopMonitoring = () => {};
    speechEngine
      .monitorAmbientNoise((db, isLoud) => {
        setNoiseDb(db);
        setIsNoiseLoud(isLoud);
      })
      .then((cleanup) => {
        stopMonitoring = cleanup;
      })
      .catch(() => {});

    return () => {
      stopMonitoring();
    };
  }, []);

  // -------------------------------------------------------------
  // Speech Handling & Wake-Word Detection (2.9 in PDF)
  // -------------------------------------------------------------
  const startSpeechListener = () => {
    if (!speechEngine.isSupported()) {
      alert("Web Speech API is not fully supported in this browser. Please use Google Chrome or type your messages.");
      return;
    }

    speechEngine.startListening({
      language: currentLanguage === "ta" ? "ta-IN" : "en-IN",
      continuous: true,
      onStateChange: (listening) => {
        setIsListening(listening);
      },
      onWakeWord: (_word, remainder) => {
        // If user followed wake word with command
        if (remainder && remainder.trim().length > 2) {
          handleUnifiedMessage({
            message: remainder.trim(),
            type: "voice",
          });
          setInterimTranscript("");
        } else {
          // Speak wake acknowledgement
          playTTS("Yes Boss, standing by.");
        }
      },
      onResult: (transcript, isFinal) => {
        setInterimTranscript(transcript);
        if (isFinal) {
          const trimmed = transcript.trim();
          if (trimmed.length > 2) {
            handleUnifiedMessage({
              message: trimmed,
              type: "voice",
            });
          }
          setInterimTranscript("");
        }
      },
      onError: (err) => {
        console.warn("Speech error:", err);
      },
    });
  };

  const stopSpeechListener = () => {
    speechEngine.stopListening();
    setIsListening(false);
    setInterimTranscript("");
  };

  const toggleListening = () => {
    if (isListening) {
      stopSpeechListener();
    } else {
      startSpeechListener();
    }
  };

  // Text-To-Speech Playback
  const playTTS = (text: string, msgId?: string) => {
    if (isMuted) return;
    speechEngine.stopSpeaking();
    setIsSpeaking(true);
    if (msgId) setCurrentlyPlayingId(msgId);

    speechEngine.speak(text, {
      rate: speechRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentlyPlayingId(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setCurrentlyPlayingId(null);
      },
    });
  };

  const stopTTS = () => {
    speechEngine.stopSpeaking();
    setIsSpeaking(false);
    setCurrentlyPlayingId(null);
  };

  // -------------------------------------------------------------
  // Unified Input Pipeline (Section 3 in PDF)
  // -------------------------------------------------------------
  const handleUnifiedMessage = async (payload: {
    message: string;
    type: MessageType;
    imageBase64?: string;
    imageMimeType?: string;
  }) => {
    const userMsgId = `user_${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: "user",
      type: payload.type,
      text: payload.message || "(Analyzed image attachment)",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      imageBase64: payload.imageBase64,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Check for voice macro execution in input
    const lower = payload.message.toLowerCase();
    const matchedMacro = macros.find((m) =>
      lower.includes(m.command.toLowerCase()) ||
      lower.includes(`open ${m.command.toLowerCase()}`) ||
      lower.includes(`execute ${m.command.toLowerCase()}`)
    );

    if (matchedMacro) {
      executeMacro(matchedMacro);
    }

    try {
      const response = await sendMessageToJarvis({
        message: payload.message,
        type: payload.type,
        imageBase64: payload.imageBase64,
        imageMimeType: payload.imageMimeType,
        language: currentLanguage,
        mood: currentMood,
        campusMode: campusMode,
        history: messages.slice(-4).map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          text: m.text,
        })),
      });

      const jarvisMsgId = `jarvis_${Date.now()}`;
      const jarvisMessage: ChatMessage = {
        id: jarvisMsgId,
        sender: "jarvis",
        type: "text",
        text: response.displayText || response.spokenResponse,
        spokenResponse: response.spokenResponse,
        displayText: response.displayText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        detectedLanguage: response.detectedLanguage,
        codeSwitchDetected: response.codeSwitchDetected,
        codeSwitchNotes: response.codeSwitchNotes,
        mood: response.mood || currentMood,
        voiceMacroTrigger: response.voiceMacroTrigger,
        suggestedFollowUps: response.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, jarvisMessage]);

      // If auto-speak enabled, vocalize response
      if (autoSpeak && response.spokenResponse) {
        playTTS(response.spokenResponse, jarvisMsgId);
      }

      // Auto-save to Idea Diary if user query contained brainstorming intent (2.5)
      if (
        lower.includes("brainstorm") ||
        lower.includes("scamper") ||
        lower.includes("project idea") ||
        lower.includes("hackathon idea")
      ) {
        saveToIdeaDiary(response.displayText, payload.message.slice(0, 40));
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: "jarvis",
        type: "text",
        text: "I encountered a processing anomaly. Standing by for instructions.",
        spokenResponse: "I encountered a momentary connection hiccup, Boss.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Morning Briefing Loader
  const loadMorningBriefing = async (depth: "short" | "standard" = "standard") => {
    setIsBriefingLoading(true);
    try {
      const data = await fetchMorningBriefing(depth);
      setMorningBriefing(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  const handleOpenBriefingModal = () => {
    setIsBriefingOpen(true);
    if (!morningBriefing) {
      loadMorningBriefing("standard");
    }
  };

  // Macro Execution (Section 2.6)
  const executeMacro = (macro: VoiceMacro) => {
    // Open tabs safely
    macro.urls.forEach((tab) => {
      try {
        window.open(tab.url, "_blank", "noopener,noreferrer");
      } catch (e) {
        console.warn("Pop-up blocked for tab:", tab.url);
      }
    });

    const notifMsg: ChatMessage = {
      id: `macro_notif_${Date.now()}`,
      sender: "jarvis",
      type: "text",
      text: `⚡ Executing Voice-Macro: **"${macro.command}"**\nOpened ${macro.urls.length} task-specific tabs: ${macro.urls.map((u) => u.name).join(", ")}.`,
      spokenResponse: `Executing ${macro.command}. Launching research tabs now.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      voiceMacroTrigger: macro.id,
    };
    setMessages((prev) => [...prev, notifMsg]);
    if (autoSpeak) {
      playTTS(`Executing ${macro.command}. Launching research tabs now.`);
    }
  };

  const saveToIdeaDiary = (text: string, titleHint?: string) => {
    const newIdea: IdeaItem = {
      id: `idea_${Date.now()}`,
      title: titleHint || "Voice Brainstorm Insight",
      concept: text.slice(0, 100) + "...",
      summary: text.slice(0, 250) + "...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      tags: ["Voice Auto-Log", "SIH Project", "AI & DS"],
    };
    setIdeas((prev) => [newIdea, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Background Cyber Grid Lines */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />

      {/* Top HUD Header */}
      <Header
        isListening={isListening}
        isWakeWordActive={isWakeWordActive}
        isSpeaking={isSpeaking}
        isMuted={isMuted}
        onToggleMute={() => {
          if (!isMuted) stopTTS();
          setIsMuted(!isMuted);
        }}
        onToggleWakeWord={() => setIsWakeWordActive(!isWakeWordActive)}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        onOpenBriefing={handleOpenBriefingModal}
        onOpenCampus={() => setIsCampusOpen(true)}
        onOpenTranslate={() => setIsTranslateOpen(true)}
        onOpenIdeaDiary={() => setIsIdeaDiaryOpen(true)}
        onOpenMacros={() => setIsMacrosOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        noiseDb={noiseDb}
        isNoiseLoud={isNoiseLoud}
        ideaCount={ideas.length}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-between max-w-5xl w-full mx-auto relative z-10">
        {/* Holographic Arc Reactor Stage (Central Core) */}
        <section className="w-full pt-4 pb-2 flex flex-col items-center">
          <ArcReactor
            isListening={isListening}
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
            isWakeWordActive={isWakeWordActive}
            onToggleListening={toggleListening}
            interimTranscript={interimTranscript}
            detectedCodeSwitch={messages[messages.length - 1]?.codeSwitchDetected}
          />

          {/* Settings & Personality quick pill */}
          <div className="flex items-center gap-2 mt-1 text-xs">
            <button
              onClick={() => setIsPersonalityOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span>Calibrate Mood & Memory ({currentMood})</span>
            </button>

            <button
              onClick={() => setCampusMode(!campusMode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-colors ${
                campusMode
                  ? "bg-cyan-950/60 border-cyan-800/60 text-cyan-300"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              <GraduationCap className="w-3 h-3 text-cyan-400" />
              <span>SVGI Campus: {campusMode ? "ON" : "OFF"}</span>
            </button>
          </div>
        </section>

        {/* Conversation Stream Feed */}
        <section className="w-full flex-1 overflow-y-auto min-h-[220px]">
          <ConversationStream
            messages={messages}
            onPlaySpeech={playTTS}
            onStopSpeech={stopTTS}
            currentlyPlayingId={currentlyPlayingId}
            onFollowUpClick={(prompt) =>
              handleUnifiedMessage({
                message: prompt,
                type: "text",
              })
            }
            onSaveToIdeaDiary={(text, title) => saveToIdeaDiary(text, title)}
            onTriggerMacro={(macroId) => {
              const m = macros.find((item) => item.id === macroId);
              if (m) executeMacro(m);
            }}
            voiceMacros={macros}
          />
        </section>

        {/* Unified Multimodal Input Box */}
        <section className="w-full sticky bottom-0 z-30 pt-2 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
          <UnifiedInput
            onSendMessage={handleUnifiedMessage}
            isListening={isListening}
            onToggleListening={toggleListening}
            isProcessing={isProcessing}
            isNoiseLoud={isNoiseLoud}
            noiseDb={noiseDb}
          />
        </section>
      </main>

      {/* Feature Modals matching PDF Sections 2.1 to 2.10 */}
      <MorningBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        briefing={morningBriefing}
        isLoading={isBriefingLoading}
        onRefresh={loadMorningBriefing}
        onPlayAudio={playTTS}
        onStopAudio={stopTTS}
        isPlaying={isSpeaking}
        onSelectTopic={(topic) =>
          handleUnifiedMessage({
            message: topic,
            type: "text",
          })
        }
      />

      <CampusModeDrawer
        isOpen={isCampusOpen}
        onClose={() => setIsCampusOpen(false)}
        onAskJarvis={(query) =>
          handleUnifiedMessage({
            message: query,
            type: "text",
          })
        }
      />

      <TranslationWidget
        isOpen={isTranslateOpen}
        onClose={() => setIsTranslateOpen(false)}
        onSpeak={playTTS}
        isSpeaking={isSpeaking}
        onStopSpeech={stopTTS}
      />

      <IdeaDiaryModal
        isOpen={isIdeaDiaryOpen}
        onClose={() => setIsIdeaDiaryOpen(false)}
        ideas={ideas}
        onAddIdea={(newIdea) => setIdeas((prev) => [newIdea, ...prev])}
        onDeleteIdea={(id) => setIdeas((prev) => prev.filter((i) => i.id !== id))}
        onSendToChat={(text) =>
          handleUnifiedMessage({
            message: text,
            type: "text",
          })
        }
      />

      <VoiceMacroManager
        isOpen={isMacrosOpen}
        onClose={() => setIsMacrosOpen(false)}
        macros={macros}
        onExecuteMacro={executeMacro}
        onAddMacro={(macro) => setMacros((prev) => [...prev, macro])}
        onDeleteMacro={(id) => setMacros((prev) => prev.filter((m) => m.id !== id))}
      />

      <PersonalityMemoryModal
        isOpen={isPersonalityOpen}
        onClose={() => setIsPersonalityOpen(false)}
        memory={userMemory}
        onUpdateMemory={setUserMemory}
        currentMood={currentMood}
        onChangeMood={setCurrentMood}
        speechRate={speechRate}
        onChangeSpeechRate={setSpeechRate}
        autoSpeak={autoSpeak}
        onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
      />

      <ProjectDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onRunDemoQuery={(query) =>
          handleUnifiedMessage({
            message: query,
            type: "text",
          })
        }
      />
    </div>
  );
}
