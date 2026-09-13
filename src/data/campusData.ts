import { VoiceMacro, UserMemory } from "../types";

export const DEFAULT_USER_MEMORY: UserMemory = {
  name: "Akshaya M.",
  college: "Shree Venkateshwara Group of Institutions (SVGI)",
  department: "BSc Artificial Intelligence & Data Science",
  interests: ["Smart India Hackathon (SIH)", "Speech AI", "Tamil NLP", "Multimodal Vision", "Autonomous Systems"],
  notes: [
    "Presenting J.A.R.V.I.S 5.0 prototype for final AI & Data Science evaluation",
    "Prefers bilingual Tamil + English code-switching for everyday queries",
    "Uses voice-macro chaining for fast multi-tab research",
  ],
};

export const SVGI_CAMPUS_INFO = {
  name: "Shree Venkateshwara Group of Institutions (SVGI)",
  location: "Othakkuthirai, K.Mettupalayam, Gobichettipalayam - Tiruppur Highway, Tamil Nadu",
  classesToday: [
    { time: "09:00 AM - 10:00 AM", subject: "Deep Learning Architectures & PyTorch", room: "Tech Block - Room 304", faculty: "Dr. S. Ramesh" },
    { time: "10:15 AM - 11:15 AM", subject: "Natural Language Processing & Tamil NLP", room: "AI Lab 2", faculty: "Prof. K. Priya" },
    { time: "11:30 AM - 01:00 PM", subject: "Machine Learning Practical & Model Tuning", room: "Tech Block - Cloud Lab", faculty: "Dr. M. Karthik" },
    { time: "02:00 PM - 03:30 PM", subject: "SIH 2026 Project Work & Mentorship", room: "Innovation & Incubation Hub", faculty: "Project Coordinator" },
    { time: "03:45 PM - 04:45 PM", subject: "Big Data Analytics & Spark", room: "Tech Block - Room 304", faculty: "Prof. N. Suresh" },
  ],
  canteen: {
    status: "Open (08:00 AM - 06:00 PM)",
    specialToday: "Authentic Filter Coffee, Ghee Roast, Medu Vada, Mini Meals, Lemon Tea",
    currentRush: "Moderate (Fast moving)",
  },
  studySpots: [
    { name: "Digital Central Library (Wing A)", quiet: "Silent zone", facilities: "IEEE Xplore, High-speed Wi-Fi, AC", hours: "8:30 AM - 7:30 PM" },
    { name: "AI Innovation & Incubation Hub", quiet: "Collaborative", facilities: "Dual monitors, GPU workstation, Whiteboards", hours: "8:00 AM - 8:00 PM" },
    { name: "Green Campus Lawn (Tech Block)", quiet: "Ambient outdoor", facilities: "Campus 5G Wi-Fi, Fresh breeze", hours: "Open all day" },
  ],
  buses: [
    { route: "Route 12 - Tiruppur Central", departure: "05:15 PM", stops: "Avinashi, New Bus Stand, Old Bus Stand, Pushpa Theatre" },
    { route: "Route 04 - Erode Junction", departure: "05:15 PM", stops: "Perundurai, Thindal, GH, Railway Station" },
    { route: "Route 08 - Gobichettipalayam Town", departure: "05:20 PM", stops: "Bus Stand, Court, Kalingarayan Canal" },
    { route: "Route 15 - Sathyamangalam", departure: "05:15 PM", stops: "Bhavanisagar Cross, Sathy Bus Stand" },
  ],
};

export const DEFAULT_VOICE_MACROS: VoiceMacro[] = [
  {
    id: "sih_research",
    command: "Research SIH",
    description: "Launches Smart India Hackathon portal, Kaggle AI benchmarks, and GitHub repositories in unified tabs.",
    category: "research",
    urls: [
      { name: "Smart India Hackathon", url: "https://www.sih.gov.in" },
      { name: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" },
      { name: "GitHub Trending AI", url: "https://github.com/trending" },
      { name: "Google Scholar", url: "https://scholar.google.com" },
    ],
  },
  {
    id: "coding_mode",
    command: "Coding Mode",
    description: "Sets up developer workspace: LeetCode problems, React documentation, and MDN Web Docs.",
    category: "coding",
    urls: [
      { name: "LeetCode Problem Set", url: "https://leetcode.com/problemset" },
      { name: "React Documentation", url: "https://react.dev" },
      { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
    ],
  },
  {
    id: "campus_hub",
    command: "Campus Portal",
    description: "Direct access to SVGI Academic ERP, Student Attendance, and Anna University Syllabus.",
    category: "campus",
    urls: [
      { name: "SVGI Official Portal", url: "https://svgi.edu.in" },
      { name: "IEEE Xplore Digital Library", url: "https://ieeexplore.ieee.org" },
      { name: "NPTEL AI & DS Courses", url: "https://nptel.ac.in" },
    ],
  },
];
