import React, { useState } from "react";
import {
  SunMedium,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Calendar,
  Clock,
  Compass,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { MorningBriefingData } from "../types";

interface MorningBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: MorningBriefingData | null;
  isLoading: boolean;
  onRefresh: (depth: "short" | "standard") => void;
  onPlayAudio: (text: string) => void;
  onStopAudio: () => void;
  isPlaying: boolean;
  onSelectTopic: (topic: string) => void;
}

export const MorningBriefingModal: React.FC<MorningBriefingModalProps> = ({
  isOpen,
  onClose,
  briefing,
  isLoading,
  onRefresh,
  onPlayAudio,
  onStopAudio,
  isPlaying,
  onSelectTopic,
}) => {
  const [depth, setDepth] = useState<"short" | "standard">("standard");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-800/60 shadow-2xl p-5 sm:p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400">
              <SunMedium className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-hud tracking-wide text-slate-100">
                Daily Morning Protocol
              </h2>
              <p className="text-xs text-slate-400">
                30-Second Spoken Briefing • News, Daily AI Fact & SVGI Schedule
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

        {/* Depth Selector & Refresh */}
        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setDepth("standard");
                onRefresh("standard");
              }}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                depth === "standard"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Standard 30s Digest
            </button>
            <button
              onClick={() => {
                setDepth("short");
                onRefresh("short");
              }}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                depth === "short"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Quick 3-Line (Busy Mode)
            </button>
          </div>

          <button
            onClick={() => onRefresh(depth)}
            disabled={isLoading}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Regenerate Briefing</span>
          </button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="py-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono">Synthesizing current affairs & campus agenda...</p>
          </div>
        )}

        {/* Briefing Content */}
        {!isLoading && briefing && (
          <div className="mt-4 space-y-4">
            {/* Spoken Voice Player Box */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 shadow-inner">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Jarvis Vocal Script
                </span>
                <button
                  onClick={() => {
                    if (isPlaying) onStopAudio();
                    else onPlayAudio(briefing.spokenDigest);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isPlaying
                      ? "bg-rose-950 border border-rose-600 text-rose-300 animate-pulse"
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md"
                  }`}
                >
                  {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlaying ? "Stop Speaking" : "Play Spoken Briefing"}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "{briefing.spokenDigest}"
              </p>
              {briefing.tamilGreeting && (
                <p className="mt-2 text-xs text-amber-300/90 font-medium">
                  {briefing.tamilGreeting}
                </p>
              )}
            </div>

            {/* Headlines Grid */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> Today's Core Headlines
              </h4>
              <div className="space-y-2">
                {briefing.headlines?.map((h, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onSelectTopic(`Jarvis, tell me more about: ${h.title}`);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-700/60 flex items-center justify-between gap-2 cursor-pointer transition-all hover:bg-slate-800/80 group"
                  >
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                        {h.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-cyan-400 font-mono">{h.category}</span>
                        <span>•</span>
                        <span>{h.time}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Tech Fact of the Day */}
            {briefing.funFact && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-amber-400 block mb-1">
                  💡 AI / CS Fact of the Day
                </span>
                <p className="text-xs leading-relaxed">{briefing.funFact}</p>
              </div>
            )}

            {/* Day Schedule for SVGI Tiruppur */}
            {briefing.schedule && briefing.schedule.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Today's Campus Schedule (BSc AI & DS)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {briefing.schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-cyan-300">{item.time}</span>
                          <span>•</span>
                          <span className="truncate">{item.location}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
