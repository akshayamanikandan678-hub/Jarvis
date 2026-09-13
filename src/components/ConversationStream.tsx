import React from "react";
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  BookmarkPlus,
  ExternalLink,
  Bot,
  User,
  Zap,
  Languages,
} from "lucide-react";
import { ChatMessage, VoiceMacro } from "../types";

interface ConversationStreamProps {
  messages: ChatMessage[];
  onPlaySpeech: (text: string, msgId: string) => void;
  onStopSpeech: () => void;
  currentlyPlayingId: string | null;
  onFollowUpClick: (prompt: string) => void;
  onSaveToIdeaDiary: (text: string, title?: string) => void;
  onTriggerMacro: (macroId: string) => void;
  voiceMacros: VoiceMacro[];
}

export const ConversationStream: React.FC<ConversationStreamProps> = ({
  messages,
  onPlaySpeech,
  onStopSpeech,
  currentlyPlayingId,
  onFollowUpClick,
  onSaveToIdeaDiary,
  onTriggerMacro,
  voiceMacros,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="conversation-stream" className="w-full max-w-4xl mx-auto space-y-4 px-4 py-3">
      {messages.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">J.A.R.V.I.S 5.0 Core Ready</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Say <span className="text-cyan-400 font-mono">"Hey Jarvis"</span> or click the Arc Reactor to begin.
            Ask in English, Tamil, or mixed Tanglish.
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isPlayingThis = currentlyPlayingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {/* Jarvis Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-sm transition-all ${
                  isUser
                    ? "bg-cyan-950/80 border border-cyan-600/40 text-cyan-50 rounded-tr-sm"
                    : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm shadow-lg"
                }`}
              >
                {/* Header row: time & input mode */}
                <div className="flex items-center justify-between gap-3 mb-1.5 text-[11px] font-mono text-slate-400">
                  <span className="font-semibold text-xs text-slate-300">
                    {isUser ? "Akshaya M." : "J.A.R.V.I.S"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {msg.type === "voice" && <span className="text-cyan-400">⚡ Voice</span>}
                    {msg.type === "image" && <span className="text-sky-400">📷 Vision</span>}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Attached Image if any */}
                {msg.imageBase64 && (
                  <div className="mb-2.5 overflow-hidden rounded-xl border border-slate-800">
                    <img
                      src={msg.imageBase64}
                      alt="Query visual"
                      className="max-h-60 w-auto rounded-lg object-contain bg-slate-950"
                    />
                  </div>
                )}

                {/* Spoken Digest Audio Bar for Jarvis Messages */}
                {!isUser && msg.spokenResponse && (
                  <div className="mb-3 p-2.5 rounded-xl bg-slate-950/80 border border-cyan-900/40 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <button
                        onClick={() => {
                          if (isPlayingThis) {
                            onStopSpeech();
                          } else {
                            onPlaySpeech(msg.spokenResponse || msg.text, msg.id);
                          }
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isPlayingThis
                            ? "bg-rose-950 border border-rose-700/60 text-rose-300 animate-pulse"
                            : "bg-cyan-950 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900"
                        }`}
                        title={isPlayingThis ? "Stop Voice TTS" : "Replay Jarvis Voice"}
                      >
                        {isPlayingThis ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400/80 block">
                          Spoken Voice Output
                        </span>
                        <p className="text-xs text-slate-300 italic truncate">"{msg.spokenResponse}"</p>
                      </div>
                    </div>

                    {/* Bilingual Indicator */}
                    {msg.detectedLanguage === "ta" && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700/40 text-indigo-300 shrink-0">
                        தமிழ்
                      </span>
                    )}
                  </div>
                )}

                {/* Main Content Body */}
                <div className="whitespace-pre-wrap leading-relaxed text-slate-100 font-sans text-sm">
                  {msg.displayText || msg.text}
                </div>

                {/* Code-Switch Detection Badge (Section 2.2 Innovative Twist) */}
                {msg.codeSwitchDetected && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-amber-300 font-mono">
                    <Languages className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tamil ↔ English Code-Switching detected</span>
                    {msg.codeSwitchNotes && (
                      <span className="text-[11px] text-slate-400">({msg.codeSwitchNotes})</span>
                    )}
                  </div>
                )}

                {/* Voice Macro Trigger Action if detected (Section 2.6) */}
                {msg.voiceMacroTrigger && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-emerald-200">
                        Macro Triggered: {msg.voiceMacroTrigger.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => onTriggerMacro(msg.voiceMacroTrigger!)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-colors"
                    >
                      <span>Launch Macro Tabs</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Action Footer for Jarvis Messages */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(msg.displayText || msg.text, msg.id)}
                        className="hover:text-slate-200 flex items-center gap-1 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[11px]">{copiedId === msg.id ? "Copied" : "Copy"}</span>
                      </button>

                      {/* Bookmark to Idea Diary */}
                      <button
                        onClick={() => onSaveToIdeaDiary(msg.displayText || msg.text, "Response Insight")}
                        className="hover:text-cyan-300 flex items-center gap-1 transition-colors ml-2"
                        title="Save into Idea Diary (2.5)"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px]">Save to Diary</span>
                      </button>
                    </div>

                    {msg.mood && (
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        Mood: {msg.mood}
                      </span>
                    )}
                  </div>
                )}

                {/* Suggested Follow-up Prompts */}
                {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onFollowUpClick(item)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-700/60 transition-colors"
                      >
                        ↪ {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
