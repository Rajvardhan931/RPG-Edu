"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  name: string;
  description: string;
  user_status: 'locked' | 'unlocked' | 'completed';
  xp_reward: number;
  xp_type: 'knowledge' | 'capability';
}

export default function NodeModal({ node, onClose }: { node: Node; onClose: () => void }) {
  const router = useRouter();

  const handleEmbark = () => {
    router.push(`/quests/${node.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="glass-panel p-8 rounded-2xl max-w-lg w-full shadow-2xl relative font-mono border-astral-blue/30 z-10">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-astral-blue/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-astral-blue/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-astral-blue/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-astral-blue/50" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className={`inline-block text-xs uppercase font-bold px-3 py-1 rounded-full border ${
            node.xp_type === 'knowledge'
              ? 'bg-astral-blue/10 text-astral-blue border-astral-blue/30'
              : 'bg-neon-gold/10 text-neon-gold border-neon-gold/30'
          }`}>
            {node.xp_type} Quest
          </div>
          <h2 className="text-3xl font-bold text-white mt-4 neon-text-blue">
            {node.name}
          </h2>
        </div>

        <p className="text-slate-300 text-center italic mb-8 leading-relaxed">
          "{node.description}"
        </p>

        <div className="flex justify-between items-center bg-black/40 p-5 rounded-xl border border-white/10 mb-8 backdrop-blur-sm">
          <div className="text-left">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Reward</p>
            <p className="text-2xl font-bold neon-text-gold">{node.xp_reward} XP</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Status</p>
            <p className={`text-sm font-bold uppercase tracking-wider ${
              node.user_status === 'completed' ? 'text-neon-gold' :
              node.user_status === 'unlocked' ? 'text-astral-blue' : 'text-slate-600'
            }`}>
              {node.user_status}
            </p>
          </div>
        </div>

        <button
          disabled={node.user_status === 'completed' || node.user_status === 'locked'}
          onClick={handleEmbark}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all relative overflow-hidden ${
            node.user_status === 'completed'
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-astral-blue/20 text-astral-blue border-2 border-astral-blue/50 hover:bg-astral-blue/40 active:scale-95'
          }`}
        >
          {node.user_status === 'completed' ? 'Mastered' : 'Embark on Quest'}
        </button>
      </div>
    </div>
  );
}
