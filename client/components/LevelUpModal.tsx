"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface LevelUpProps {
  xpGained: number;
  onClose: () => void;
}

export default function LevelUpModal({ xpGained, onClose }: LevelUpProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Immersive Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />

      {/* Level Up Card */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="glass-panel p-12 rounded-3xl max-w-md w-full text-center shadow-[0_0_60px_rgba(255,215,0,0.3)] font-mono relative z-10 border-neon-gold/50"
      >
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-neon-gold rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-neon-gold rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-neon-gold rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-neon-gold rounded-br-lg" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-7xl mb-6 block"
        >
          ✨
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-black text-white uppercase tracking-tighter mb-2 neon-text-gold"
        >
          Level Up!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-astral-blue text-xl italic mb-10 tracking-wide"
        >
          Your mastery of the realm expands.
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-black/60 p-8 rounded-2xl border-2 border-neon-gold/50 mb-10 relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-neon-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-slate-400 uppercase text-xs font-bold mb-2 tracking-widest">Essence Gained</p>
          <p className="text-6xl font-black text-white neon-text-gold">{xpGained}</p>
          <p className="text-xs text-slate-500 mt-2 uppercase font-bold tracking-tighter">Experience Points</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onClose}
          className="w-full bg-neon-gold/20 hover:bg-neon-gold/40 text-neon-gold font-bold py-4 rounded-xl uppercase tracking-widest transition-all border-2 border-neon-gold/50 active:scale-95 relative overflow-hidden group"
        >
          <span className="relative z-10">Continue Journey</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </motion.button>
      </motion.div>
    </div>
  );
}
