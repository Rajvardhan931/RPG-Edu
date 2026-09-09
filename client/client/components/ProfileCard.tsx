"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface ProfileStats {
  username: string;
  class: string;
  stats: {
    knowledge: { level: number; xp: number };
    capability: { level: number; xp: number };
    total_xp: number;
  };
}

const SoulSilhouette = ({ knowledgeLvl, capabilityLvl }: { knowledgeLvl: number; capabilityLvl: number }) => {
  // Knowledge Aura Intensity
  const auraBlur = Math.min(2 + knowledgeLvl * 0.5, 15);
  const auraOpacity = Math.min(0.3 + knowledgeLvl * 0.05, 0.8);
  const auraColor = "#00D4FF";

  // Capability Circuitry Logic
  const renderCircuitry = () => {
    const circuitry = [];
    // Core Circuitry (Lvl 1+)
    if (capabilityLvl >= 1) {
      circuitry.push(<path key="core" d="M50 40 L50 60 M45 50 L55 50" stroke="#FFD700" strokeWidth="1" fill="none" />);
    }
    // Arm Circuitry (Lvl 5+)
    if (capabilityLvl >= 5) {
      circuitry.push(<path key="arms" d="M40 45 L30 55 M60 45 L70 55" stroke="#FFD700" strokeWidth="1" fill="none" />);
    }
    // Full System (Lvl 10+)
    if (capabilityLvl >= 10) {
      circuitry.push(<path key="full" d="M30 55 L30 70 L50 80 L70 70 L70 55" stroke="#FFD700" strokeWidth="1" fill="none" />);
    }
    return circuitry;
  };

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Knowledge Aura */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [auraOpacity * 0.7, auraOpacity, auraOpacity * 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-16 h-16 rounded-full"
        style={{
          backgroundColor: auraColor,
          filter: `blur(${auraBlur}px)`,
          zIndex: 0
        }}
      />

      {/* The Soul Silhouette */}
      <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Human Silhouette */}
        <path
          d="M50 20 C45 20 42 25 42 30 C42 35 45 38 50 38 C55 38 58 35 58 30 C58 25 55 20 50 20 Z M40 40 C35 40 30 45 30 55 L30 80 L40 80 L45 60 L55 60 L60 80 L70 80 L70 55 C70 45 65 40 60 40 Z"
          fill="#0A0E1A"
          stroke="#00D4FF"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* Capability Circuitry Overlay */}
        <g strokeLinecap="round" strokeLinejoin="round">
          {renderCircuitry()}
        </g>
      </svg>
    </div>
  );
};

export default function ProfileCard({ data }: { data: ProfileStats }) {
  const renderBar = (label: string, level: number, xp: number, color: string, textColor: string) => (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-lg font-bold ${textColor}`}>Lvl {level}</span>
      </div>
      <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out relative`}
          style={{ width: `${(xp % 100)}%` }}
        >
          <div className="absolute top-0 right-0 w-2 h-full bg-white/30 blur-[2px]" />
        </div>
      </div>
      <div className="text-right text-[10px] text-slate-500 mt-1 font-mono">
        {xp % 100} / 100 XP to next level
      </div>
    </div>
  );

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-2xl text-slate-100 w-full max-w-sm relative overflow-hidden group">
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-astral-blue opacity-50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-astral-blue opacity-50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-astral-blue opacity-50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-astral-blue opacity-50" />

      <div className="flex items-center gap-6 mb-8 relative z-10">
        <SoulSilhouette
          knowledgeLvl={data.stats.knowledge.level}
          capabilityLvl={data.stats.capability.level}
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white tracking-tight group-hover:text-astral-blue transition-colors">{data.username}</h2>
          <p className="neon-text-gold text-sm italic font-medium tracking-wide">{data.class}</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {renderBar('Knowledge (Knowing)', data.stats.knowledge.level, data.stats.knowledge.xp, 'bg-[#00D4FF]', 'text-astral-blue')}
        {renderBar('Capability (Doing)', data.stats.capability.level, data.stats.capability.xp, 'bg-[#FFD700]', 'text-neon-gold')}
      </div>

      <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
        <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Total Mastery</span>
        <span className="neon-text-gold font-mono font-bold text-lg">{data.stats.total_xp} XP</span>
      </div>
    </div>
  );
}
