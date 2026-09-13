// Speech Recognition & Synthesis Service for J.A.R.V.I.S 5.0

// Type declarations for webkit speech recognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export interface SpeechListenerOptions {
  language?: string;
  continuous?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onWakeWord?: (wakeWord: string, followUpText: string) => void;
  onError?: (error: any) => void;
  onStateChange?: (isListening: boolean) => void;
}

export class JarvisSpeechEngine {
  private recognition: any = null;
  private isListening = false;
  private wakeWords = ["hey jarvis", "jarvis", "hello jarvis", "ok jarvis", "ஜார்விஸ்"];
  private activeLanguage = "en-IN"; // English (India) works great with mixed English and Tamil accents
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private noiseCheckInterval: any = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === "undefined") return;
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      try {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.activeLanguage;
      } catch (e) {
        console.warn("SpeechRecognition initialization failed:", e);
      }
    }
  }

  public isSupported(): boolean {
    return Boolean(typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition));
  }

  public setLanguage(langCode: "en" | "ta" | "auto") {
    if (langCode === "ta") {
      this.activeLanguage = "ta-IN";
    } else {
      this.activeLanguage = "en-IN"; // Handles Indian English and code-switching well
    }
    if (this.recognition) {
      this.recognition.lang = this.activeLanguage;
    }
  }

  public startListening(options: SpeechListenerOptions) {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      options.onError?.("Speech Recognition not supported in this browser. Please use Chrome/Edge or type directly.");
      return;
    }

    if (this.isListening) {
      return;
    }

    try {
      this.recognition.lang = options.language || this.activeLanguage;
      this.recognition.continuous = options.continuous !== false;

      this.recognition.onstart = () => {
        this.isListening = true;
        options.onStateChange?.(true);
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptChunk;
          } else {
            interimTranscript += transcriptChunk;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();

        // Check for wake word
        const lower = currentText.toLowerCase();
        for (const wakeWord of this.wakeWords) {
          if (lower.includes(wakeWord)) {
            const index = lower.indexOf(wakeWord);
            const remainder = currentText.substring(index + wakeWord.length).replace(/^[,\s]+/, "");
            options.onWakeWord?.(wakeWord, remainder);
            break;
          }
        }

        if (finalTranscript) {
          options.onResult?.(finalTranscript, true);
        } else if (interimTranscript) {
          options.onResult?.(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        // Ignore expected 'no-speech' or 'aborted'
        if (event.error !== "no-speech" && event.error !== "aborted") {
          console.warn("Speech recognition event:", event.error);
          options.onError?.(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        options.onStateChange?.(false);
        // Auto-restart if continuous mode requested and not manually stopped
        if (options.continuous && this.isListening) {
          try {
            this.recognition.start();
          } catch {}
        }
      };

      this.recognition.start();
    } catch (e: any) {
      console.warn("Start listening exception:", e);
      this.isListening = false;
      options.onStateChange?.(false);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // Text to Speech
  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): SpeechSynthesisUtterance | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return null;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // Clean text: strip markdown syntax, URLs, brackets
    const clean = text
      .replace(/[*#_`>]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    if (!clean) return null;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = options?.rate || 1.05; // Slightly brisk, polished AI delivery
    utterance.pitch = options?.pitch || 0.95; // Slightly lower, authoritative resonant tone

    // Try to pick suitable English or Tamil voice
    const voices = window.speechSynthesis.getVoices();
    const isTamilText = /[\u0B80-\u0BFF]/.test(clean);

    if (isTamilText) {
      const tamilVoice = voices.find((v) => v.lang.startsWith("ta") || v.name.toLowerCase().includes("tamil"));
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
    } else {
      // Find a crisp English voice (preferably British or Indian English for Jarvis feel)
      const idealVoice =
        voices.find((v) => (v.name.includes("Google") || v.name.includes("Natural")) && (v.lang === "en-GB" || v.lang === "en-IN")) ||
        voices.find((v) => v.lang.startsWith("en-GB") || v.lang.startsWith("en-IN") || v.lang.startsWith("en-US"));
      if (idealVoice) {
        utterance.voice = idealVoice;
      }
    }

    utterance.onstart = () => options?.onStart?.();
    utterance.onend = () => options?.onEnd?.();
    utterance.onerror = (e) => options?.onError?.(e);

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  public stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Ambient Noise Level Meter (Section 2.8: detect loud environment & suggest typing)
  public async monitorAmbientNoise(onNoiseLevel: (decibels: number, isLoud: boolean) => void): Promise<() => void> {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return () => {};
    }

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.micStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.noiseCheckInterval = setInterval(() => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength; // 0 to 255
        const decibelsEstimate = Math.round((average / 255) * 100);
        const isLoud = decibelsEstimate > 68; // Loud threshold
        onNoiseLevel(decibelsEstimate, isLoud);
      }, 500);

      return () => {
        this.stopNoiseMonitoring();
      };
    } catch (e) {
      console.warn("Ambient noise monitoring unavailable:", e);
      return () => {};
    }
  }

  public stopNoiseMonitoring() {
    if (this.noiseCheckInterval) {
      clearInterval(this.noiseCheckInterval);
      this.noiseCheckInterval = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }
}

export const speechEngine = new JarvisSpeechEngine();
