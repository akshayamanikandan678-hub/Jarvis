import React, { useEffect, useState } from "react";
import { Mic, MicOff, Volume2, Sparkles, Radio } from "lucide-react";

interface ArcReactorProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  isWakeWordActive: boolean;
  onToggleListening: () => void;
  interimTranscript: string;
  detectedCodeSwitch?: boolean;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  isWakeWordActive,
  onToggleListening,
  interimTranscript,
  detectedCodeSwitch,
}) => {
  // Simulated dynamic audio frequencies for the visualizer ring
  const [frequencies, setFrequencies] = useState<number[]>([30, 45, 60, 40, 75, 50, 65, 80, 55, 35, 70, 90, 40, 60, 30, 50]);

  useEffect(() => {
    if (isListening || isSpeaking) {
      const interval = setInterval(() => {
        setFrequencies((prev) =>
          prev.map(() => Math.floor(Math.random() * (isSpeaking ? 75 : 85) + 20))
        );
      }, 90);
      return () => clearInterval(interval);
    } else {
      setFrequencies([25, 20, 30, 25, 20, 35, 25, 30, 20, 25, 30, 25, 20, 25, 30, 20]);
    }
  }, [isListening, isSpeaking]);

  // Determine state label and color tone
  let stateLabel = "CORE STANDBY";
  let stateColor = "text-cyan-400";
  let glowColor = "rgba(6, 182, 212, 0.25)";

  if (isProcessing) {
    stateLabel = "NEURAL PROCESSING";
    stateColor = "text-amber-400";
    glowColor = "rgba(245, 158, 11, 0.35)";
  } else if (isSpeaking) {
    stateLabel = "VOCAL SYNTHESIS";
    stateColor = "text-emerald-400";
    glowColor = "rgba(16, 185, 129, 0.35)";
  } else if (isListening) {
    stateLabel = "LISTENING LIVE";
    stateColor = "text-sky-300";
    glowColor = "rgba(56, 189, 248, 0.45)";
  }

  return (
    <div id="arc-reactor-container" className="flex flex-col items-center justify-center py-4 relative select-none">
      {/* Outer Holographic Glow */}
      <div
        className="relative flex items-center justify-center w-52 h-52 sm:w-60 sm:h-60 rounded-full transition-all duration-700"
        style={{
          boxShadow: `0 0 60px ${glowColor}, inset 0 0 35px ${glowColor}`,
        }}
      >
        {/* Outermost Segmented Ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-1000 ${
            isProcessing
              ? "border-amber-500/60 animate-spin"
              : isListening
              ? "border-cyan-400/80 animate-[spin_8s_linear_infinite]"
              : isSpeaking
              ? "border-emerald-400/70 animate-[spin_12s_linear_infinite]"
              : "border-cyan-900/60"
          }`}
        />

        {/* Circular Audio Frequency Bars */}
        <div className="absolute inset-2 flex items-center justify-center pointer-events-none">
          {frequencies.map((height, i) => {
            const angle = (i / frequencies.length) * 360;
            return (
              <div
                key={i}
                className="absolute origin-bottom transition-all duration-100 rounded-full"
                style={{
                  transform: `rotate(${angle}deg) translateY(-85px)`,
                  width: "3px",
                  height: `${height * 0.24}px`,
                  backgroundColor: isProcessing
                    ? "rgba(245, 158, 11, 0.8)"
                    : isListening
                    ? "rgba(56, 189, 248, 0.9)"
                    : isSpeaking
                    ? "rgba(16, 185, 129, 0.85)"
                    : "rgba(6, 182, 212, 0.3)",
                }}
              />
            );
          })}
        </div>

        {/* Secondary Inner Ring with Angular Ticks */}
        <div
          className={`absolute inset-7 rounded-full border border-cyan-500/30 flex items-center justify-center transition-all ${
            isListening ? "border-cyan-400/60 scale-105" : ""
          }`}
        >
          {/* Third Concentric Ring */}
          <div className="absolute inset-4 rounded-full border border-cyan-800/40" />

          {/* Central Reactor Orb Button */}
          <button
            id="arc-reactor-main-button"
            onClick={onToggleListening}
            className={`group relative z-10 flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full cursor-pointer transition-all duration-300 ${
              isProcessing
                ? "bg-amber-950/80 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                : isListening
                ? "bg-cyan-950/90 border-2 border-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.6)] scale-105"
                : isSpeaking
                ? "bg-emerald-950/80 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                : "bg-slate-950/90 border-2 border-cyan-700/60 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]"
            }`}
            title={isListening ? "Click to Pause Listening" : "Click to Speak / Activate Jarvis"}
          >
            {/* Core Icon */}
            {isProcessing ? (
              <Sparkles className="w-9 h-9 text-amber-300 animate-spin" />
            ) : isSpeaking ? (
              <Volume2 className="w-9 h-9 text-emerald-300 animate-pulse" />
            ) : isListening ? (
              <Mic className="w-9 h-9 text-cyan-200 animate-bounce" />
            ) : (
              <Mic className="w-8 h-8 text-cyan-400/80 group-hover:text-cyan-200 group-hover:scale-110 transition-transform" />
            )}

            {/* Micro HUD status underneath icon */}
            <span className="text-[10px] tracking-widest font-hud font-bold mt-1 text-slate-300 uppercase">
              {isListening ? "LISTENING" : isProcessing ? "THINKING" : isSpeaking ? "SPEAKING" : "PUSH TO TALK"}
            </span>
          </button>
        </div>
      </div>

      {/* Status Bar & Wake-word Indicator */}
      <div className="mt-3 flex flex-col items-center gap-1.5 text-center max-w-md px-4">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold tracking-widest uppercase ${stateColor}`}>
            {stateLabel}
          </span>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
            <Radio className={`w-3 h-3 ${isWakeWordActive ? "text-cyan-400 animate-pulse" : "text-slate-600"}`} />
            <span>Wake-Word: {isWakeWordActive ? "ACTIVE ('Hey Jarvis')" : "PAUSED"}</span>
          </div>
        </div>

        {/* Interim Speech Transcription Live Stream */}
        {interimTranscript && (
          <div className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 text-xs font-mono animate-fade-in shadow-inner">
            <span className="text-cyan-400/70 mr-1.5 text-[10px] uppercase font-bold tracking-wider">Hearing:</span>
            <span>"{interimTranscript}"</span>
          </div>
        )}

        {detectedCodeSwitch && (
          <div className="text-[11px] text-amber-300/90 font-mono flex items-center gap-1">
            <span>⚡ Bilingual Code-Switch Detected (Tamil ↔ English)</span>
          </div>
        )}
      </div>
    </div>
  );
};
