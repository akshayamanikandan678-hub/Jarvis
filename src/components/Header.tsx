import React from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Radio,
  GraduationCap,
  SunMedium,
  Languages,
  BookOpen,
  Layers,
  Terminal,
  Mic,
  MicOff,
  AlertTriangle,
  Award,
} from "lucide-react";
import { LanguageCode } from "../types";

interface HeaderProps {
  isListening: boolean;
  isWakeWordActive: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleWakeWord: () => void;
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  onOpenBriefing: () => void;
  onOpenCampus: () => void;
  onOpenTranslate: () => void;
  onOpenIdeaDiary: () => void;
  onOpenMacros: () => void;
  onOpenDossier: () => void;
  noiseDb: number;
  isNoiseLoud: boolean;
  ideaCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isListening,
  isWakeWordActive,
  isSpeaking,
  isMuted,
  onToggleMute,
  onToggleWakeWord,
  currentLanguage,
  onChangeLanguage,
  onOpenBriefing,
  onOpenCampus,
  onOpenTranslate,
  onOpenIdeaDiary,
  onOpenMacros,
  onOpenDossier,
  noiseDb,
  isNoiseLoud,
  ideaCount,
}) => {
  return (
    <header id="jarvis-hud-header" className="border-b border-cyan-950/60 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Student / College Attribution */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Sparkles className="w-5 h-5 animate-pulse text-cyan-400" />
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-wider font-hud text-slate-100 flex items-center gap-1.5">
                  J.A.R.V.I.S <span className="text-cyan-400 text-sm font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">v5.0</span>
                </h1>
                <span className="text-xs text-slate-400 hidden sm:inline-block border-l border-slate-800 pl-2">
                  Voice-First Bilingual Assistant
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="text-cyan-300/90 font-medium">Akshaya M.</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">BSc AI & Data Science</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">SVGI Tiruppur</span>
              </p>
            </div>
          </div>

          {/* Quick HUD Telemetry on Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="header-mobile-mute-toggle"
              onClick={onToggleMute}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isMuted
                  ? "bg-rose-950/50 border-rose-800/60 text-rose-300"
                  : "bg-slate-900 border-slate-800 text-slate-300"
              }`}
              title={isMuted ? "Unmute TTS" : "Mute TTS"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Modules Nav (Matching 2.1 to 2.6 in PDF) */}
        <div className="flex items-center flex-wrap gap-1.5 md:gap-2 w-full md:w-auto justify-start md:justify-end">
          {/* Daily Morning Briefing (2.1) */}
          <button
            id="header-btn-briefing"
            onClick={onOpenBriefing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-200 transition-all shadow-sm"
          >
            <SunMedium className="w-3.5 h-3.5 text-amber-400" />
            <span>Morning Briefing</span>
          </button>

          {/* SVGI Campus Mode (2.4) */}
          <button
            id="header-btn-campus"
            onClick={onOpenCampus}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/50 hover:border-cyan-400 text-xs font-medium text-cyan-200 transition-all shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Mode</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Translation Tamil <-> English (2.2) */}
          <button
            id="header-btn-translate"
            onClick={onOpenTranslate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-200 transition-all"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
            <span>Translate தமிழ்</span>
          </button>

          {/* Idea Diary (2.5) */}
          <button
            id="header-btn-idea-diary"
            onClick={onOpenIdeaDiary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-200 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Idea Diary</span>
            {ideaCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-950 text-sky-300 font-mono border border-sky-700/50">
                {ideaCount}
              </span>
            )}
          </button>

          {/* Voice Macros (2.6) */}
          <button
            id="header-btn-macros"
            onClick={onOpenMacros}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-200 transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Macros</span>
          </button>

          {/* Project Dossier & SIH Presentation */}
          <button
            id="header-btn-dossier"
            onClick={onOpenDossier}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/50 hover:border-amber-400 text-xs font-medium text-amber-200 transition-all shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Viva Dossier</span>
          </button>

          {/* Telemetry & Wake-word toggle */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
            {/* Ambient Noise pill */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono border ${
                isNoiseLoud
                  ? "bg-amber-950/60 border-amber-600/60 text-amber-300"
                  : "bg-slate-900/80 border-slate-800 text-slate-400"
              }`}
              title={isNoiseLoud ? "High ambient noise detected: typing recommended" : "Ambient sound level"}
            >
              {isNoiseLoud && <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />}
              <span>{noiseDb} dB</span>
            </div>

            {/* Wake-word Switch */}
            <button
              id="header-btn-wakeword-toggle"
              onClick={onToggleWakeWord}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
                isWakeWordActive
                  ? "bg-cyan-950/80 border-cyan-500/50 text-cyan-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Continuous Wake-Word Listener ('Hey Jarvis')"
            >
              <Radio className={`w-3 h-3 ${isWakeWordActive ? "text-cyan-400 animate-pulse" : "text-slate-500"}`} />
              <span>Wake-Word</span>
            </button>

            {/* TTS Mute */}
            <button
              id="header-btn-tts-mute"
              onClick={onToggleMute}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                isMuted
                  ? "bg-rose-950/50 border-rose-800/60 text-rose-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title={isMuted ? "Unmute Spoken TTS" : "Mute Spoken TTS"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
