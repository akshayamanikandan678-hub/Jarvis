import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Sparkles,
  AlertTriangle,
  CornerDownLeft,
  Volume2,
} from "lucide-react";
import { MessageType } from "../types";

interface UnifiedInputProps {
  onSendMessage: (payload: {
    message: string;
    type: MessageType;
    imageBase64?: string;
    imageMimeType?: string;
  }) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isProcessing: boolean;
  isNoiseLoud: boolean;
  noiseDb: number;
}

export const UnifiedInput: React.FC<UnifiedInputProps> = ({
  onSendMessage,
  isListening,
  onToggleListening,
  isProcessing,
  isNoiseLoud,
  noiseDb,
}) => {
  const [textInput, setTextInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    dataUrl: string;
    mimeType: string;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPEG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage({
        dataUrl: event.target?.result as string,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isProcessing) return;

    const trimmed = textInput.trim();
    if (!trimmed && !selectedImage) return;

    let type: MessageType = "text";
    if (selectedImage && trimmed) {
      type = "image"; // Multimodal combined
    } else if (selectedImage) {
      type = "image";
    }

    onSendMessage({
      message: trimmed,
      type: type,
      imageBase64: selectedImage?.dataUrl,
      imageMimeType: selectedImage?.mimeType,
    });

    setTextInput("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Quick voice prompts
  const samplePrompts = [
    "Jarvis, give me today's morning briefing",
    "வணக்கம் ஜார்விஸ், இன்றைய வகுப்பு நேரம் என்ன?",
    "Check SVGI canteen & library status",
    "Brainstorm SIH AI project using SCAMPER",
    "Translate: I will submit the dataset report tomorrow to Tamil",
  ];

  return (
    <div id="unified-input-container" className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Noise Environment Suggestion Banner (Section 2.8 Innovative Twist) */}
      {isNoiseLoud && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-600/40 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>High ambient noise detected ({noiseDb} dB). Typing mode recommended for optimal precision.</span>
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono hidden sm:inline">Auto-Detect Active</span>
        </div>
      )}

      {/* Selected Image Preview Tag */}
      {selectedImage && (
        <div className="mb-2 p-2 rounded-xl bg-slate-900/90 border border-cyan-800/50 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={selectedImage.dataUrl}
              alt="Preview"
              className="w-12 h-12 object-cover rounded-lg border border-cyan-500/30"
            />
            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate">{selectedImage.name}</p>
              <p className="text-[11px] text-cyan-400">Combined Image + Voice/Text Query Ready</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Unified Input Box (Supports Type, Voice, Image) */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative rounded-2xl bg-slate-900/90 border border-cyan-900/60 focus-within:border-cyan-500/60 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all"
      >
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-2 p-2 sm:p-2.5">
          {/* Text Area */}
          <div className="w-full flex-1 relative">
            <textarea
              id="unified-input-textarea"
              ref={textareaRef}
              rows={1}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedImage
                  ? "Ask Jarvis about this image, diagram, or dataset (or speak into mic)..."
                  : isListening
                  ? "Listening to your voice... (or type here directly)"
                  : "Type instruction, speak into mic, or paste image... (Tamil or English)"
              }
              className="w-full bg-transparent resize-none outline-none text-slate-100 placeholder:text-slate-500 text-sm px-2.5 py-1.5 max-h-32 min-h-[38px]"
            />
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1">
              {/* Image Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="image-file-input"
              />
              <button
                type="button"
                id="btn-upload-image"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-xl transition-colors ${
                  selectedImage
                    ? "bg-cyan-950 text-cyan-400 border border-cyan-700/50"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title="Upload image / diagram for Vision Analysis (2.10)"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Voice Push-to-Talk / Toggle */}
              <button
                type="button"
                id="btn-input-mic-toggle"
                onClick={onToggleListening}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse"
                    : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                }`}
                title={isListening ? "Stop Voice Listening" : "Start Voice Input"}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Send Submit Button */}
            <button
              type="submit"
              id="btn-submit-unified-message"
              disabled={isProcessing || (!textInput.trim() && !selectedImage)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs transition-all shadow-md"
            >
              <span>{isProcessing ? "Processing" : "Send"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Quick Prompt Chips */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-mono text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Prompts:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => {
              setTextInput(prompt);
              textareaRef.current?.focus();
            }}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-800 transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
