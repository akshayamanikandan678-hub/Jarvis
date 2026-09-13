import React, { useState } from "react";
import {
  Sparkles,
  X,
  FileText,
  Award,
  Cpu,
  Layers,
  CheckCircle2,
  Play,
  Terminal,
  Languages,
  GraduationCap,
  Volume2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface ProjectDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunDemoQuery: (query: string) => void;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({
  isOpen,
  onClose,
  onRunDemoQuery,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "specs" | "pitch">("overview");

  if (!isOpen) return null;

  const demoScenarios = [
    {
      title: "Bilingual Tamil Code-Switching",
      query: "வணக்கம் ஜார்விஸ், today's AI lab project submission பத்தி சொல்லுங்க",
      desc: "Tests bilingual mixed Tanglish + Tamil neural token parsing.",
    },
    {
      title: "SVGI Campus Timetable & Bus Inquiry",
      query: "What is my next class in BSc AI & Data Science and when does the Tiruppur bus leave?",
      desc: "Triggers local campus database retrieval for SVGI Tiruppur.",
    },
    {
      title: "Morning Spoken Briefing (30s)",
      query: "Jarvis, give me my morning briefing with tech news and daily fact",
      desc: "Generates spoken summary + display cards with academic schedule.",
    },
    {
      title: "SCAMPER Idea Brainstorming",
      query: "Brainstorm an SIH 2026 project for autonomous college campus navigation using SCAMPER",
      desc: "Executes structured innovation methodology and logs to Idea Diary.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl p-5 sm:p-7 text-slate-100 flex flex-col gap-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-hud tracking-wide text-slate-100">
                  J.A.R.V.I.S 5.0 Project Dossier & Viva Presentation
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono">
                  SIH 2026 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Prepared by: <span className="text-cyan-300 font-semibold">Akshaya M.</span> • BSc Artificial Intelligence & Data Science • Shree Venkateshwara Group of Institutions (SVGI Tiruppur)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {[
            { id: "overview", label: "Executive Summary", icon: FileText },
            { id: "architecture", label: "System Architecture", icon: Layers },
            { id: "specs", label: "Feature Matrix (2.1 - 2.10)", icon: Cpu },
            { id: "pitch", label: "Viva Demo & Scenarios", icon: Zap },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 shadow-sm"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        {activeTab === "overview" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Project Vision & Problem Statement
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Conventional conversational AI assistants are predominantly text-centric, English-biased, and lack contextual understanding of local academic ecosystems. <strong>J.A.R.V.I.S 5.0</strong> is a voice-first, multimodal AI assistant designed for students and researchers in tier-2/3 higher education institutions. It bridges the regional linguistic barrier through real-time <strong>Tamil ↔ English code-switching</strong>, continuous wake-word activation, hands-free browser macro chaining, and contextual telemetry for Shree Venkateshwara Group of Institutions (SVGI Tiruppur).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  1. Regional NLP Innovation
                </span>
                <h4 className="text-xs font-bold text-slate-200 mb-1">Tamil Code-Switch Detection</h4>
                <p className="text-slate-400 leading-normal">
                  Identifies when the speaker blends Tamil and English (Tanglish), translating and annotating phrases without breaking conversation context.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  2. Campus Telemetry
                </span>
                <h4 className="text-xs font-bold text-slate-200 mb-1">SVGI Contextual Grounding</h4>
                <p className="text-slate-400 leading-normal">
                  Instant retrieval for BSc AI & DS class timetables, AI Innovation Lab schedules, canteen status, and evening college bus departures.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  3. Multimodal & Speech Pipeline
                </span>
                <h4 className="text-xs font-bold text-slate-200 mb-1">Unified Multi-Input</h4>
                <p className="text-slate-400 leading-normal">
                  Merges voice commands with image analysis (diagrams, whiteboards, notes) and ambient noise decibel detection into a single pipeline.
                </p>
              </div>
            </div>

            {/* Student & College Credentials */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  Academic Project Credentials
                </span>
                <div className="text-xs font-bold text-slate-200 mt-0.5">
                  Akshaya M. — BSc Artificial Intelligence & Data Science
                </div>
                <div className="text-xs text-slate-400">
                  Shree Venkateshwara Group of Institutions, Gobichettipalayam / Tiruppur, Tamil Nadu
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
                Smart India Hackathon (SIH 2026) Candidate
              </div>
            </div>
          </div>
        )}

        {activeTab === "architecture" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2">
                <Layers className="w-4 h-4" /> End-to-End System Block Flow
              </h3>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-cyan-300 border border-slate-800 overflow-x-auto whitespace-pre">
{`[Audio Input Stream] ---> [Ambient Noise Analyzer (dB Threshold: 65dB)]
         │
         ├──> [Web Speech Recognition API] ---> [Wake-Word Detector ("Hey Jarvis" / "ஜார்விஸ்")]
         │                                               │
[Multimodal Image Upload]                                │
         │                                               ▼
         └─────────────> [Unified Multimodal Pipeline] ──┴──> [SVGI Context Injector]
                                  │                                    │
                                  ▼                                    ▼
                     [Gemini Multimodal Neural Model] <────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
[Vocal Output Generator]                       [Visual HUD Interface]
  • Dual-channel speech synthesis                • Holographic Arc Reactor (Web Audio API)
  • Dynamic speech rate (0.8x - 1.4x)             • Bilingual Code-Switch Pill Annotations
  • Bilingual Tamil/English TTS voice             • Chained Browser Macro Dispatcher`}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Input Engine</span>
                <h4 className="text-xs font-bold text-slate-200">Continuous Speech & Noise Guard</h4>
                <p className="text-slate-400 leading-normal">
                  Real-time microphone decibel telemetry continuously measures environment noise. If decibels exceed 65 dB, the system displays an ambient noise warning and suggests typing or closer mic positioning.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Output Engine</span>
                <h4 className="text-xs font-bold text-slate-200">Arc Reactor & Audio Visualizer</h4>
                <p className="text-slate-400 leading-normal">
                  A high-contrast HUD reactor inspired by Iron Man's Stark architecture that animates with real-time radial audio frequencies during speech listening and synthesis.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="space-y-3 text-xs">
            <h3 className="text-sm font-bold text-cyan-400 font-mono">
              Complete Feature Implementation Matrix (Project Specification Sections)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { sec: "Section 2.1", title: "Daily Morning Briefing", desc: "Spoken morning brief with tech headlines, daily CS fact, and time-aware 3-line digest." },
                { sec: "Section 2.2", title: "Bilingual Tamil ↔ English", desc: "Translates Tamil script and Tanglish; tags code-switched phrases with visual pills." },
                { sec: "Section 2.3", title: "Mood & Tone Engine", desc: "Selectable personas: Warm & Friendly, Analytical HUD, Academic Mentor, Stark Concise." },
                { sec: "Section 2.4", title: "SVGI Campus Mode", desc: "BSc AI & DS timetable, AI lab hours, college canteen menu, and bus departure times." },
                { sec: "Section 2.5", title: "Idea Diary & SCAMPER", desc: "Voice auto-logging of brainstormed ideas; structured SCAMPER innovation generator." },
                { sec: "Section 2.6", title: "Voice-Macro Chaining", desc: "Open multi-tab research workspaces simultaneously via voice triggers." },
                { sec: "Section 2.7", title: "Relationship Memory", desc: "Remembers user name, college, department, past topics, and research interests." },
                { sec: "Section 2.8", title: "Ambient Noise Detection", desc: "Microphone decibel monitoring that alerts when ambient sound interferes." },
                { sec: "Section 2.9", title: "Continuous Wake-Word", desc: "Listens for 'Hey Jarvis' or 'Jarvis' without requiring repeated clicks." },
                { sec: "Section 3.0", title: "Unified Multimodal Input", desc: "Single input combining voice, text, and image attachment queries smoothly." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">{item.sec}</span>
                      <h4 className="font-bold text-slate-200">{item.title}</h4>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "pitch" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2">
                <Play className="w-4 h-4" /> Live Viva Demonstration Scenarios
              </h3>
              <p className="text-slate-400">
                Click any scenario below to immediately execute it in the main J.A.R.V.I.S 5.0 conversational interface to show examiners the real-time AI response and voice output:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoScenarios.map((demo, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-100">{demo.title}</h4>
                      <span className="text-[10px] font-mono text-cyan-400">Test {idx + 1}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">{demo.desc}</p>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                      "{demo.query}"
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onRunDemoQuery(demo.query);
                    }}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-600/50 text-cyan-200 font-semibold text-xs transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Run Demo in J.A.R.V.I.S</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
