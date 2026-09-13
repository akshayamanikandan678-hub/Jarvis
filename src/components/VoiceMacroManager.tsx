import React, { useState } from "react";
import {
  Terminal,
  X,
  ExternalLink,
  Plus,
  Play,
  Check,
  Zap,
  Globe,
  Trash2,
} from "lucide-react";
import { VoiceMacro } from "../types";

interface VoiceMacroManagerProps {
  isOpen: boolean;
  onClose: () => void;
  macros: VoiceMacro[];
  onExecuteMacro: (macro: VoiceMacro) => void;
  onAddMacro: (macro: VoiceMacro) => void;
  onDeleteMacro: (id: string) => void;
}

export const VoiceMacroManager: React.FC<VoiceMacroManagerProps> = ({
  isOpen,
  onClose,
  macros,
  onExecuteMacro,
  onAddMacro,
  onDeleteMacro,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCommand, setNewCommand] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<"research" | "coding" | "campus" | "tools">("research");
  const [urlList, setUrlList] = useState<Array<{ name: string; url: string }>>([
    { name: "", url: "" },
  ]);
  const [activeExecutedMacro, setActiveExecutedMacro] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddUrlField = () => {
    setUrlList([...urlList, { name: "", url: "" }]);
  };

  const handleUpdateUrl = (index: number, field: "name" | "url", val: string) => {
    const updated = [...urlList];
    updated[index][field] = val;
    setUrlList(updated);
  };

  const handleSaveMacro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommand.trim()) return;

    const validUrls = urlList.filter((u) => u.name.trim() && u.url.trim());
    const newMacro: VoiceMacro = {
      id: `macro_${Date.now()}`,
      command: newCommand.trim(),
      description: newDescription.trim() || `Opens chained tabs for ${newCommand}`,
      category: newCategory,
      urls: validUrls.length > 0 ? validUrls : [{ name: "Target Site", url: "https://google.com" }],
    };

    onAddMacro(newMacro);
    setShowAddForm(false);
    setNewCommand("");
    setNewDescription("");
    setUrlList([{ name: "", url: "" }]);
  };

  const executeMacroWithFeedback = (macro: VoiceMacro) => {
    setActiveExecutedMacro(macro.id);
    onExecuteMacro(macro);
    setTimeout(() => setActiveExecutedMacro(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-emerald-900/60 shadow-2xl p-5 sm:p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-hud tracking-wide text-slate-100">
                Voice-Macro Chaining Engine (Browser Control)
              </h3>
              <p className="text-xs text-slate-400">
                Section 2.6 • Execute chained multi-tab workspace commands with one voice trigger
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

        {/* Action Bar */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Say aloud: <span className="text-emerald-400">"Jarvis, execute [macro name]"</span>
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? "Cancel" : "New Voice Macro"}</span>
          </button>
        </div>

        {/* Add Macro Form */}
        {showAddForm && (
          <form onSubmit={handleSaveMacro} className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-emerald-800/60 space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold font-mono uppercase text-emerald-400">
              Configure New Chained Voice Macro
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Voice Trigger Command</label>
                <input
                  type="text"
                  required
                  value={newCommand}
                  onChange={(e) => setNewCommand(e.target.value)}
                  placeholder="e.g. Research SIH or AI Lab Mode"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="research">Research / Hackathon</option>
                  <option value="coding">Coding / Development</option>
                  <option value="campus">SVGI Campus</option>
                  <option value="tools">Productivity Tools</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What this chain does..."
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Chained URLs */}
            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 block">Chained URLs to Open Together</label>
              {urlList.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tab Name (e.g. Kaggle)"
                    value={item.name}
                    onChange={(e) => handleUpdateUrl(idx, "name", e.target.value)}
                    className="w-1/3 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-200"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={item.url}
                    onChange={(e) => handleUpdateUrl(idx, "url", e.target.value)}
                    className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-200"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddUrlField}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
              >
                + Add Another Tab to Chain
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              Save Voice Macro
            </button>
          </form>
        )}

        {/* Existing Macros List */}
        <div className="mt-4 space-y-3">
          {macros.map((macro) => {
            const isExecuted = activeExecutedMacro === macro.id;

            return (
              <div
                key={macro.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-700/50 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h4 className="text-sm font-bold text-slate-100 font-mono">
                        "{macro.command}"
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 uppercase font-mono">
                        {macro.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{macro.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => executeMacroWithFeedback(macro)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isExecuted
                          ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                          : "bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300"
                      }`}
                    >
                      {isExecuted ? <Check className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isExecuted ? "Tabs Opened!" : "Launch Chain"}</span>
                    </button>

                    {/* Delete button if not default */}
                    {macros.length > 2 && (
                      <button
                        onClick={() => onDeleteMacro(macro.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                        title="Delete Macro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Chained Tabs Visual Preview */}
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                    Chained Links ({macro.urls.length} Tabs):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {macro.urls.map((tab, idx) => (
                      <a
                        key={idx}
                        href={tab.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-300 transition-colors group"
                      >
                        <Globe className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                        <span>{tab.name}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
