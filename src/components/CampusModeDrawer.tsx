import React, { useState } from "react";
import {
  GraduationCap,
  X,
  Coffee,
  BookOpen,
  Bus,
  Clock,
  MapPin,
  Sparkles,
  Send,
  CloudSun,
} from "lucide-react";
import { SVGI_CAMPUS_INFO } from "../data/campusData";

interface CampusModeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAskJarvis: (query: string) => void;
}

export const CampusModeDrawer: React.FC<CampusModeDrawerProps> = ({
  isOpen,
  onClose,
  onAskJarvis,
}) => {
  const [activeTab, setActiveTab] = useState<"classes" | "canteen" | "study" | "buses">("classes");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg h-full bg-slate-900 border-l border-cyan-800/60 shadow-2xl flex flex-col text-slate-100 animate-slide-in">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-hud font-bold text-base text-slate-100">SVGI Campus Mode</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/50 font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Shree Venkateshwara Group of Institutions • Tiruppur
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

        {/* Quick Weather / Location Bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Othakkuthirai, Gobichettipalayam</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>31°C • Clear Sky</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-4 pt-2 gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab("classes")}
            className={`pb-2 px-2.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "classes"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today's Classes</span>
          </button>

          <button
            onClick={() => setActiveTab("canteen")}
            className={`pb-2 px-2.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "canteen"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Canteen</span>
          </button>

          <button
            onClick={() => setActiveTab("study")}
            className={`pb-2 px-2.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "study"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Spots</span>
          </button>

          <button
            onClick={() => setActiveTab("buses")}
            className={`pb-2 px-2.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "buses"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>College Buses</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Classes Tab */}
          {activeTab === "classes" && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between">
                <span className="text-xs text-cyan-200 font-medium">BSc AI & Data Science (Current Sem)</span>
                <span className="text-[10px] font-mono text-cyan-400">Tech Block Wing</span>
              </div>
              {SVGI_CAMPUS_INFO.classesToday.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                    <span>{item.time}</span>
                    <span className="text-slate-500">{item.room}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{item.subject}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Faculty: {item.faculty}</p>
                </div>
              ))}
            </div>
          )}

          {/* Canteen Tab */}
          {activeTab === "canteen" && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Coffee className="w-4 h-4" /> Main Campus Canteen
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 font-mono">
                    {SVGI_CAMPUS_INFO.canteen.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-200">
                  <strong className="text-amber-300">Special Today:</strong> {SVGI_CAMPUS_INFO.canteen.specialToday}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Rush status: {SVGI_CAMPUS_INFO.canteen.currentRush}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-200 mb-2">Popular Refreshments</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-200 font-medium">Filter Coffee</span>
                    <span className="text-cyan-400 block font-mono text-[11px]">₹15 • Fresh Brew</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-200 font-medium">Ghee Podi Roast</span>
                    <span className="text-cyan-400 block font-mono text-[11px]">₹45 • Hot</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-200 font-medium">South Indian Meals</span>
                    <span className="text-cyan-400 block font-mono text-[11px]">₹60 • Lunch</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-200 font-medium">Tea / Samosa</span>
                    <span className="text-cyan-400 block font-mono text-[11px]">₹12 / ₹15</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Study Spots Tab */}
          {activeTab === "study" && (
            <div className="space-y-2.5">
              {SVGI_CAMPUS_INFO.studySpots.map((spot, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-100">{spot.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/40">
                      {spot.quiet}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{spot.facilities}</p>
                  <p className="text-[11px] text-slate-500 font-mono">Hours: {spot.hours}</p>
                </div>
              ))}
            </div>
          )}

          {/* Buses Tab */}
          {activeTab === "buses" && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
                Evening buses board at 05:05 PM behind the Admin Block.
              </div>
              {SVGI_CAMPUS_INFO.buses.map((bus, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">{bus.route}</span>
                    <span className="text-cyan-400">Dep: {bus.departure}</span>
                  </div>
                  <p className="text-xs text-slate-400">Stops: {bus.stops}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Voice/Text Ask Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <p className="text-[11px] font-mono text-slate-400 mb-2">Quick Prompt to Jarvis:</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                onAskJarvis("Jarvis, what is my next class today at SVGI?");
                onClose();
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
            >
              "What is my next class?"
            </button>
            <button
              onClick={() => {
                onAskJarvis("Jarvis, is the SVGI canteen open and what is for lunch?");
                onClose();
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
            >
              "Canteen lunch menu"
            </button>
            <button
              onClick={() => {
                onAskJarvis("Jarvis, what time does the Tiruppur bus leave SVGI?");
                onClose();
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
            >
              "Tiruppur bus timing"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
