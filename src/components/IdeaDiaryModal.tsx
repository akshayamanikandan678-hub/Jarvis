import React, { useState } from "react";
import {
  BookOpen,
  X,
  Sparkles,
  Plus,
  Search,
  Tag,
  Download,
  Trash2,
  Share2,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { IdeaItem } from "../types";
import { brainstormIdea } from "../services/jarvisApi";

interface IdeaDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: IdeaItem[];
  onAddIdea: (idea: IdeaItem) => void;
  onDeleteIdea: (id: string) => void;
  onSendToChat: (text: string) => void;
}

export const IdeaDiaryModal: React.FC<IdeaDiaryModalProps> = ({
  isOpen,
  onClose,
  ideas,
  onAddIdea,
  onDeleteIdea,
  onSendToChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newConcept, setNewConcept] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMethod, setActiveMethod] = useState<"SCAMPER" | "MINDMAP">("SCAMPER");

  if (!isOpen) return null;

  // Collect all unique tags
  const allTags = Array.from(new Set(ideas.flatMap((item) => item.tags)));

  // Filter ideas
  const filteredIdeas = ideas.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.concept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConcept.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const generated = await brainstormIdea(newConcept.trim(), activeMethod);
      onAddIdea(generated);
      setNewConcept("");
    } catch (err) {
      console.error(err);
      // Local fallback idea
      const localIdea: IdeaItem = {
        id: `idea_${Date.now()}`,
        title: newConcept.trim(),
        concept: newConcept.trim(),
        summary: "User recorded spoken/written idea in J.A.R.V.I.S 5.0 Idea Diary.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tags: ["SIH Project", "Voice Memo"],
      };
      onAddIdea(localIdea);
      setNewConcept("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportMarkdown = () => {
    const md = ideas
      .map(
        (idea) => `## ${idea.title} (${idea.timestamp})\n**Concept**: ${idea.concept}\n\n${idea.summary}\n\n${
          idea.scamperNodes?.map((n) => `- **${n.key}**: ${n.description}`).join("\n") || ""
        }\n\n**Action Steps**:\n${idea.actionSteps?.map((s) => `1. ${s}`).join("\n") || "N/A"}\n\n---`
      )
      .join("\n\n");

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JARVIS_Idea_Diary_Akshaya_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-900 border border-sky-900/60 shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-950/70 border border-sky-500/40 text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-hud tracking-wide text-slate-100">
                Spoken Idea Diary & SCAMPER Hub
              </h3>
              <p className="text-xs text-slate-400">
                Auto-Logged Voice Notebook • Ideation Engine for SIH & AI Projects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              title="Export as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Diary</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create Idea / SCAMPER Form */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800">
          <form onSubmit={handleCreateIdea} className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-sky-400" /> Brainstorm New Concept:
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveMethod("SCAMPER")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    activeMethod === "SCAMPER"
                      ? "bg-sky-950 text-sky-300 border border-sky-700/50"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  SCAMPER Method
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMethod("MINDMAP")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    activeMethod === "MINDMAP"
                      ? "bg-sky-950 text-sky-300 border border-sky-700/50"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Mind Map
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newConcept}
                onChange={(e) => setNewConcept(e.target.value)}
                placeholder="e.g. AI-driven campus bus tracking with edge voice kiosk..."
                className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={isGenerating || !newConcept.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs shadow-md disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Synthesizing..." : "Analyze & Save"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logged ideas..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                selectedTag === null ? "bg-sky-950 text-sky-300 border border-sky-700/50" : "text-slate-400"
              }`}
            >
              All ({ideas.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors whitespace-nowrap ${
                  selectedTag === tag ? "bg-sky-950 text-sky-300 border border-sky-700/50" : "text-slate-400"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Idea List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredIdeas.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No ideas found matching query.</p>
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-800/60 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{idea.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Logged at {idea.timestamp}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDeleteIdea(idea.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                      title="Delete idea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{idea.summary}</p>

                {/* SCAMPER Nodes Breakdown */}
                {idea.scamperNodes && idea.scamperNodes.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-sky-400 font-bold block mb-1.5">
                      SCAMPER Ideation Breakdown
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {idea.scamperNodes.map((node, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/70 text-xs"
                        >
                          <span className="text-sky-300 font-bold font-mono block text-[11px]">
                            {node.key}:
                          </span>
                          <span className="text-slate-300 text-[11px] leading-snug">
                            {node.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Steps */}
                {idea.actionSteps && idea.actionSteps.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                      Action Steps
                    </span>
                    <div className="space-y-1">
                      {idea.actionSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags & Chat Button */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onSendToChat(`Let's discuss my idea: "${idea.title}". How can we build the prototype?`);
                      onClose();
                    }}
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                  >
                    <span>Discuss with Jarvis</span>
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
