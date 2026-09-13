import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy initialization of Gemini client
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI with key:", e);
    }
  }
  return genAI;
}

// -------------------------------------------------------------
// Core System Instructions for J.A.R.V.I.S 5.0
// -------------------------------------------------------------
const JARVIS_SYSTEM_PROMPT = `
You are J.A.R.V.I.S 5.0 (Just A Rather Very Intelligent System), a personal voice-first AI assistant created for Akshaya M., a BSc Artificial Intelligence & Data Science student at Shree Venkateshwara Group of Institutions (SVGI Tiruppur).

PERSONALITY & VOICE TONE:
- Polished, respectful, warm, calm, and intellectually sharp like Tony Stark's J.A.R.V.I.S, combined with a supportive academic mentor.
- Address the user respectfully (e.g., "Boss", "Miss Akshaya", or direct courteous phrasing).
- Keep the spoken response ('spokenResponse') concise, conversational, free of markdown asterisks/emojis, and under 3-4 sentences so it is pleasant to listen to via Text-To-Speech (TTS).
- Provide the full comprehensive answer in 'displayText' with neat formatting, code snippets, or bullet points if needed.

BILINGUAL (TAMIL + ENGLISH) & CODE-SWITCHING:
- You are natively bilingual in English and Tamil (தமிழ்) and Tanglish (Tamil written in Latin script).
- If the user speaks or writes in Tamil or Tanglish, understand and respond appropriately in respectful Tamil (e.g., "வணக்கம் அக்ஷயா, நான் எப்படி உதவ முடியும்?" or bilingual code-switching).
- If the user uses code-switching (mixed Tamil and English like "Enakku machine learning project idea venum"), naturally acknowledge both, answer clearly, and identify the code-switched phrase.

CAMPUS CONTEXT (SVGI Tiruppur):
- Institution: Shree Venkateshwara Group of Institutions (SVGI), Othakkuthirai, Gobichettipalayam / Tiruppur Highway, Tamil Nadu.
- Department: Artificial Intelligence & Data Science (BSc AI & DS).
- Core knowledge: Machine Learning Lab, Deep Learning, Big Data Analytics, Cloud Computing, Project Hackathons (Smart India Hackathon / SIH).
- Canteen: Open 8:00 AM to 6:00 PM, famous for filter coffee, masala dosa, and afternoon snacks.
- Library & Tech Lab: Digital Library with IEEE access (8:30 AM to 7:30 PM), AI Innovation Lab in Tech Block 3rd floor.
- Transport: College bus routes covering Tiruppur, Erode, Perundurai, Sathyamangalam, and Gobichettipalayam.

MACRO ACTIONS:
If the user asks to open research tools or conduct specific tasks, detect voice macros:
- 'open_sih': Smart India Hackathon / hackathons
- 'open_github': GitHub repositories / code
- 'open_scholar': Google Scholar / research papers
- 'open_kaggle': Kaggle datasets / ML notebooks
- 'open_campus': SVGI campus portal / academic LMS
- 'open_weather': Weather forecast
- 'open_translator': Dedicated translation tool

RESPONSE FORMAT:
Always return valid JSON matching this schema:
{
  "spokenResponse": "Short spoken version for TTS (under 40 words, no markdown)",
  "displayText": "Detailed formatted text for screen reading",
  "detectedLanguage": "en" | "ta" | "mixed",
  "codeSwitchDetected": boolean,
  "codeSwitchNotes": "Optional brief note on any Tamil/English phrase translated or explained",
  "mood": "calm" | "energized" | "analytical" | "mentor",
  "voiceMacroTrigger": null | "open_sih" | "open_github" | "open_scholar" | "open_kaggle" | "open_campus",
  "suggestedFollowUps": ["Question 1", "Question 2", "Question 3"]
}
`;

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "J.A.R.V.I.S 5.0",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Unified Chat Endpoint (Voice, Text, Image)
app.post("/api/chat", async (req, res) => {
  try {
    const {
      message = "",
      imageBase64,
      imageMimeType = "image/jpeg",
      language = "auto",
      mood = "friendly",
      campusMode = true,
      history = [],
    } = req.body;

    const ai = getGenAI();

    // Fallback if no key is configured
    if (!ai) {
      const lower = message.toLowerCase();
      let spoken = "Online and at your service, Miss Akshaya. How may I assist your AI and Data Science endeavors today?";
      let display = "### J.A.R.V.I.S 5.0 Systems Active\n\nStanding by for your command. You can speak hands-free, type instructions, upload diagrams or datasets, or toggle SVGI Campus Mode.\n\n*Note: To unlock live Gemini 3.8 Flash intelligence, ensure your GEMINI_API_KEY is configured in project secrets.*";
      let macro: string | null = null;
      let detectedLang: "en" | "ta" | "mixed" = "en";

      if (lower.includes("tamil") || lower.includes("vanakkam") || lower.includes("வணக்கம்")) {
        spoken = "வணக்கம் அக்ஷயா! ஜார்விஸ் 5.0 உங்களுக்காக தயாராக உள்ளது. என்ன உதவி வேண்டும்?";
        display = "வணக்கம் Miss Akshaya! J.A.R.V.I.S 5.0 is ready in bilingual mode (Tamil + English). நீங்கள் தமிழில் அல்லது ஆங்கிலத்தில் பேசலாம்.";
        detectedLang = "ta";
      } else if (lower.includes("campus") || lower.includes("canteen") || lower.includes("class") || lower.includes("svgi")) {
        spoken = "Campus mode active for SVGI Tiruppur. Canteen is open with fresh filter coffee, and the AI Innovation Lab is ready on Tech Block 3rd floor.";
        display = "**SVGI Tiruppur Context Activated**\n- **Current Status**: AI & Data Science labs active.\n- **Canteen**: Open 8:00 AM - 6:00 PM (Snacks & Meals available).\n- **Digital Library**: Tech Block Wing open till 7:30 PM with IEEE Xplore access.\n- **Buses**: Evening buses depart at 5:15 PM towards Tiruppur and Erode.";
      } else if (lower.includes("hackathon") || lower.includes("sih") || lower.includes("research")) {
        macro = "open_sih";
        spoken = "Activating research protocols for Smart India Hackathon and opening related technical resources.";
        display = "Initiating SIH & AI Research workspace. Launching developer portals, problem statement repositories, and dataset nodes.";
      }

      return res.json({
        spokenResponse: spoken,
        displayText: display,
        detectedLanguage: detectedLang,
        codeSwitchDetected: detectedLang === "ta" || lower.includes("tanglish"),
        codeSwitchNotes: "Operating in responsive system mode.",
        mood: mood || "calm",
        voiceMacroTrigger: macro,
        suggestedFollowUps: [
          "Give me today's morning briefing",
          "What is happening at SVGI campus today?",
          "Brainstorm ideas for Smart India Hackathon",
        ],
      });
    }

    // Prepare contents for Gemini
    const systemWithContext = `${JARVIS_SYSTEM_PROMPT}\n
CURRENT CONTEXT:
- Target language preference: ${language}
- Requested mood: ${mood}
- Campus Mode (SVGI Tiruppur): ${campusMode ? "ENABLED (Incorporate SVGI college info when relevant)" : "DISABLED"}
- Timestamp: ${new Date().toLocaleTimeString()}
`;

    const contents: any[] = [];

    // Append recent history if any
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-4)) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === "assistant" ? "model" : "user",
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    // Prepare current turn parts
    const currentParts: any[] = [];
    if (imageBase64) {
      // Clean base64 string
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      currentParts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: imageMimeType,
        },
      });
      currentParts.push({
        text: message
          ? `[Image attached by user] User query: ${message}`
          : "[Image attached by user] Please analyze this image in detail, extract key insights, diagrams, or text, and advise Akshaya on its significance.",
      });
    } else {
      currentParts.push({
        text: message || "Hello Jarvis, status report.",
      });
    }

    contents.push({
      role: "user",
      parts: currentParts,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction: systemWithContext,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const responseText = response.text || "{}";
    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        spokenResponse: responseText.slice(0, 160).replace(/[*#_`]/g, ""),
        displayText: responseText,
        detectedLanguage: "en",
        codeSwitchDetected: false,
        mood: "calm",
        voiceMacroTrigger: null,
        suggestedFollowUps: ["Tell me more", "Explain in Tamil", "Save to Idea Diary"],
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return res.status(500).json({
      error: "Failed to generate Jarvis response",
      spokenResponse: "I encountered a minor processing anomaly, Boss. Please repeat your instruction.",
      displayText: `**Processing Anomaly**: ${error?.message || "Check network connection or Gemini API credentials."}`,
      detectedLanguage: "en",
      codeSwitchDetected: false,
      mood: "calm",
      voiceMacroTrigger: null,
      suggestedFollowUps: ["Check status", "Retry query"],
    });
  }
});

// Morning Briefing Endpoint (News + Fun Fact + Schedule)
app.post("/api/morning-briefing", async (req, res) => {
  try {
    const { depth = "standard", language = "bilingual" } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        briefingTitle: "Daily Morning Protocol • J.A.R.V.I.S 5.0",
        spokenDigest:
          "Good morning, Miss Akshaya. It is 8:00 AM. In technology news, Google has introduced next-generation multimodal agent systems. Today's AI fact: Transformers were introduced in 2017 with 'Attention Is All You Need'. Your SVGI AI and Data Science lab session starts at 9:30 AM in Tech Block 3. Have a productive day!",
        headlines: [
          { title: "Generative AI Agents Advance in Real-Time Multimodal Reasoning", category: "AI & Tech", time: "1h ago" },
          { title: "India's Tech Sector Expands R&D Hubs in Tamil Nadu Corridors", category: "National", time: "2h ago" },
          { title: "Smart India Hackathon 2026 Announces New AI & Robotics Problem Statements", category: "Hackathons", time: "3h ago" },
        ],
        funFact: "Did you know? The term 'Artificial Intelligence' was first coined by John McCarthy in 1956 at the Dartmouth Conference!",
        schedule: [
          { time: "09:30 AM", title: "Machine Learning & Neural Networks Lab", location: "SVGI Tech Block Lab 3" },
          { time: "01:00 PM", title: "Lunch & Canteen Break", location: "SVGI Main Canteen" },
          { time: "02:00 PM", title: "SIH Project Review & J.A.R.V.I.S 5.0 Testing", location: "AI Innovation Hub" },
          { time: "04:30 PM", title: "Big Data Analytics Seminar", location: "Seminar Hall 2" },
        ],
        tamilGreeting: "இனிய காலை வணக்கம் அக்ஷயா! இன்றைய நாள் இனிதாக அமைய வாழ்த்துகள்.",
      });
    }

    const prompt = `
Generate an engaging, high-tech morning briefing for Akshaya M., BSc AI & Data Science student at SVGI Tiruppur.
Depth: ${depth} (e.g. quick 3-line digest or standard 30-second spoken briefing).
Language: ${language}.
Include:
1. Spoken digest (crisp, warm, Tony Stark style greeting, around 35-45 seconds spoken)
2. 3 latest tech/AI & world headlines
3. 1 fascinating computer science / AI fun fact
4. An academic schedule for the day tailored for BSc AI & DS at SVGI Tiruppur
5. A warm Tamil greeting sentence.

Return strictly JSON matching:
{
  "briefingTitle": "...",
  "spokenDigest": "...",
  "headlines": [{"title": "...", "category": "...", "time": "..."}],
  "funFact": "...",
  "schedule": [{"time": "...", "title": "...", "location": "..."}],
  "tamilGreeting": "..."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Morning Briefing Error:", error);
    return res.status(500).json({ error: "Failed to create morning briefing" });
  }
});

// Translation & Code-Switch Endpoint (Tamil <-> English)
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang = "ta" } = req.body;
    const ai = getGenAI();

    if (!ai) {
      const isEnglish = targetLang === "ta";
      return res.json({
        original: text,
        translated: isEnglish ? "வணக்கம், இது மாதிரி மொழிபெயர்ப்பு." : "Hello, this is a sample translation.",
        targetLang,
        transliteration: isEnglish ? "Vanakkam, ithu maathiri mozhipeyarpụ." : "Hello",
        codeSwitchTokens: [{ phrase: text, translation: "Translated accurately", source: targetLang === "ta" ? "English" : "Tamil" }],
        pronunciationTip: "Clear vocal cadence recommended.",
      });
    }

    const prompt = `
Translate the following input between English and Tamil (or vice-versa).
Input text: "${text}"
Target language: ${targetLang} (either 'ta' for Tamil or 'en' for English).
Also detect if the user spoke 'Tanglish' (Tamil written in English letters) or code-switched phrases.
Break down any colloquial or technical code-switched terms.

Output JSON:
{
  "original": "${text}",
  "translated": "Accurate natural translation in target language script",
  "transliteration": "Phonetic Tanglish/Latin pronunciation guide for Tamil words",
  "targetLang": "${targetLang}",
  "codeSwitchTokens": [
    {"phrase": "source phrase", "translation": "meaning", "source": "ta or en"}
  ],
  "pronunciationTip": "Short tip for clear vocal speech"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Translation Error:", error);
    return res.status(500).json({ error: "Translation failed" });
  }
});

// Idea Diary & Brainstorming Endpoint (SCAMPER & Mind Map)
app.post("/api/brainstorm", async (req, res) => {
  try {
    const { concept = "", method = "SCAMPER" } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        title: concept || "Voice AI & Edge Computing",
        summary: "Autonomous on-device edge AI assistant architecture combining offline wake-word and low-latency cloud fallback.",
        scamperNodes: [
          { key: "Substitute", description: "Replace heavy cloud TTS with lightweight on-device Web Speech synthesis for sub-200ms latency." },
          { key: "Combine", description: "Merge vision camera feeds with live Tamil audio transcription for real-time lecture translation." },
          { key: "Adapt", description: "Adapt automotive HUD principles to college student project dashboards." },
          { key: "Modify", description: "Amplify real-time code-switch detection to highlight Tanglish idioms." },
          { key: "Put to Another Use", description: "Deploy Jarvis 5.0 as an automated kiosk guide for SVGI college campus visitors." },
          { key: "Eliminate", description: "Eliminate manual search steps by voice-macro chaining research portals." },
          { key: "Reverse", description: "Reverse interaction: instead of waiting, Jarvis proactively alerts based on class schedules." },
        ],
        tags: ["AI Assistant", "SVGI Project", "Tamil NLP", "SCAMPER"],
        actionSteps: [
          "Prototype Web Speech continuous listener",
          "Index SVGI department syllabus into context vector store",
          "Prepare live demo presentation for SIH panel",
        ],
      });
    }

    const prompt = `
Apply the ${method} ideation methodology to help Akshaya M. (BSc AI & Data Science) brainstorm and expand this concept:
"${concept}"

Generate high-value, inventive engineering and practical ideas suitable for college project presentation or Smart India Hackathon.
Return JSON:
{
  "title": "Creative project title",
  "summary": "2-sentence executive pitch",
  "scamperNodes": [
    {"key": "Substitute", "description": "..."},
    {"key": "Combine", "description": "..."},
    {"key": "Adapt", "description": "..."},
    {"key": "Modify", "description": "..."},
    {"key": "Put to Another Use", "description": "..."},
    {"key": "Eliminate", "description": "..."},
    {"key": "Reverse", "description": "..."}
  ],
  "tags": ["tag1", "tag2", "tag3"],
  "actionSteps": ["step 1", "step 2", "step 3"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Brainstorm Error:", error);
    return res.status(500).json({ error: "Brainstorming failed" });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`J.A.R.V.I.S 5.0 server listening on http://localhost:${PORT}`);
  });
}

startServer();
