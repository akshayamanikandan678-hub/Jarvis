import React, { useState } from "react";
import {
  Languages,
  X,
  Volume2,
  VolumeX,
  ArrowRightLeft,
  Sparkles,
  Mic,
  MicOff,
  Copy,
  Check,
} from "lucide-react";
import { translateTamilEnglish } from "../services/jarvisApi";
import { TranslationData } from "../types";

interface TranslationWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

export const TranslationWidget: React.FC<TranslationWidgetProps> = ({
  isOpen,
  onClose,
  onSpeak,
  isSpeaking,
  onStopSpeech,
}) => {
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState<"ta" | "en">("ta");
  const [result, setResult] = useState<TranslationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const data = await translateTamilEnglish(inputText.trim(), targetLang);
      setResult(data);
      // Auto-speak translated result if available
      if (data.translated) {
        onSpeak(data.translated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const nextLang = targetLang === "ta" ? "en" : "ta";
    setTargetLang(nextLang);
    if (result) {
      setInputText(result.translated);
      setResult(null);
    }
  };

  const handleCopy = () => {
    if (!result?.translated) return;
    navigator.clipboard.writeText(result.translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-indigo-900/60 shadow-2xl p-5 sm:p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-400">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-hud tracking-wide text-slate-100">
                Bilingual Speech Translator (Tamil ↔ English)
              </h3>
              <p className="text-xs text-slate-400">
                Real-Time Code-Switch Detection & Tanglish Parsing
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

        {/* Direction Selector */}
        <div className="mt-4 flex items-center justify-between bg-slate-950/70 p-2 rounded-xl border border-slate-800">
          <span className="text-xs font-mono text-cyan-300 font-semibold px-2">
            {targetLang === "ta" ? "English / Tanglish" : "தமிழ் (Tamil)"}
          </span>
          <button
            type="button"
            onClick={handleSwap}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Swap translation direction"
          >
            <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
          </button>
          <span className="text-xs font-mono text-indigo-300 font-semibold px-2">
            {targetLang === "ta" ? "தமிழ் (Tamil)" : "English"}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleTranslate} className="mt-3 space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                targetLang === "ta"
                  ? "Enter English text or Tanglish (e.g. 'Enakku indha project explanation thevai')..."
                  : "தமிழில் எழுதவும் (அல்லது பேசவும்)..."
              }
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setInputText("I need to submit my AI project proposal before 4 PM today.");
                  setTargetLang("ta");
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-indigo-300"
              >
                Sample 1 (College)
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputText("மின்னஞ்சல் மூலம் தரவுத் தொகுப்பை அனுப்பியுள்ளேன்.");
                  setTargetLang("en");
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-indigo-300"
              >
                Sample 2 (Tamil)
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? "Translating..." : "Translate & Speak"}</span>
            </button>
          </div>
        </form>

        {/* Result Area */}
        {result && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-indigo-900/60 space-y-3 animate-fade-in">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block mb-1">
                  Target Translation ({result.targetLang === "ta" ? "தமிழ்" : "English"})
                </span>
                <p className="text-base font-medium text-slate-100 leading-relaxed">
                  {result.translated}
                </p>
                {result.transliteration && (
                  <p className="text-xs text-amber-300/80 font-mono mt-1">
                    Phonetic: {result.transliteration}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (isSpeaking) onStopSpeech();
                    else onSpeak(result.translated);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isSpeaking
                      ? "bg-rose-950 text-rose-300 border border-rose-700"
                      : "bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-800"
                  }`}
                  title="Speak translation"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Copy translation"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Code Switch Breakdown */}
            {result.codeSwitchTokens && result.codeSwitchTokens.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Code-Switch Breakdown (Unclear Phrases Detected):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.codeSwitchTokens.map((tok, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                    >
                      <span className="text-amber-300 font-bold">{tok.phrase}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-indigo-300">{tok.translation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.pronunciationTip && (
              <p className="text-[11px] text-slate-400 italic">
                Tip: {result.pronunciationTip}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
