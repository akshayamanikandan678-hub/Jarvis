import React, { useState } from "react";
import {
  Brain,
  X,
  Sliders,
  Sparkles,
  UserCheck,
  Plus,
  Trash2,
  Check,
  Volume2,
} from "lucide-react";
import { PersonalityMood, UserMemory } from "../types";

interface PersonalityMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: UserMemory;
  onUpdateMemory: (updated: UserMemory) => void;
  currentMood: PersonalityMood;
  onChangeMood: (mood: PersonalityMood) => void;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export const PersonalityMemoryModal: React.FC<PersonalityMemoryModalProps> = ({
  isOpen,
  onClose,
  memory,
  onUpdateMemory,
  currentMood,
  onChangeMood,
  speechRate,
  onChangeSpeechRate,
  autoSpeak,
  onToggleAutoSpeak,
}) => {
  const [newNote, setNewNote] = useState("");
  const [newInterest, setNewInterest] = useState("");

  if (!isOpen) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onUpdateMemory({
      ...memory,
      notes: [...memory.notes, newNote.trim()],
    });
    setNewNote("");
  };

  const handleDeleteNote = (index: number) => {
    onUpdateMemory({
      ...memory,
      notes: memory.notes.filter((_, i) => i !== index),
    });
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    onUpdateMemory({
      ...memory,
      interests: [...memory.interests, newInterest.trim()],
    });
    setNewInterest("");
  };

  const handleDeleteInterest = (index: number) => {
    onUpdateMemory({
      ...memory,
      interests: memory.interests.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-800/60 shadow-2xl p-5 sm:p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-hud tracking-wide text-slate-100">
                Personality & Relationship Memory Engine
              </h3>
              <p className="text-xs text-slate-400">
                Section 2.3 & 2.7 • Mood Calibration, Memory Context & TTS Tuning
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

        {/* Section 1: Mood & Tone Engine */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 2.3 Mood Engine Calibration
            </span>
            <span className="text-[11px] text-slate-400">Current: {currentMood.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: "friendly", label: "Warm & Friendly", desc: "Supportive companion" },
              { id: "analytical", label: "Analytical HUD", desc: "Precise & technical" },
              { id: "mentor", label: "Academic Mentor", desc: "Guides AI & DS studies" },
              { id: "brief", label: "Stark Concise", desc: "Short, punchy answers" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => onChangeMood(m.id as PersonalityMood)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentMood === m.id
                    ? "bg-cyan-950 border-cyan-500 text-cyan-200 shadow-sm"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="font-semibold">{m.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Relationship Memory (2.7) */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> 2.7 Relationship Memory (Jarvis Context)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">User Name</span>
              <span className="text-slate-200 font-semibold">{memory.name}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Department</span>
              <span className="text-slate-200 font-semibold">{memory.department}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 sm:col-span-2">
              <span className="text-slate-500 block text-[10px]">College</span>
              <span className="text-slate-200 font-semibold">{memory.college}</span>
            </div>
          </div>

          {/* Interests Tags */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">Project Interests:</span>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {memory.interests.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-300 flex items-center gap-1"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleDeleteInterest(i)}
                    className="hover:text-rose-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddInterest} className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add new research interest (e.g. Computer Vision)..."
                className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Add
              </button>
            </form>
          </div>

          {/* Relationship Notes */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">Learned Details & Past Topics:</span>
            <div className="space-y-1.5 mb-2">
              {memory.notes.map((note, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-300"
                >
                  <span>• {note}</span>
                  <button
                    onClick={() => handleDeleteNote(i)}
                    className="text-slate-500 hover:text-rose-400 p-1 shrink-0"
                    title="Delete memory item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Teach Jarvis a new detail to remember..."
                className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Remember
              </button>
            </form>
          </div>
        </div>

        {/* Section 3: Speech Synthesis Tuning */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" /> Vocal Synthesis Engine Tuning
          </span>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between text-slate-400 mb-1 font-mono">
                <span>Vocal Delivery Speed:</span>
                <span>{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.05"
                value={speechRate}
                onChange={(e) => onChangeSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="w-full sm:w-1/2 flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-300">Auto-speak incoming responses</span>
              <button
                onClick={onToggleAutoSpeak}
                className={`px-2.5 py-1 rounded-md font-mono text-xs font-semibold transition-colors ${
                  autoSpeak
                    ? "bg-cyan-950 border border-cyan-500 text-cyan-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {autoSpeak ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
