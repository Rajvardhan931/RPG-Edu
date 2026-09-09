"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import LevelUpModal from '@/components/LevelUpModal';
import VortexOverlay from '@/components/VortexOverlay';
import TransmutationOverlay from '@/components/TransmutationOverlay';
import { AnimatePresence } from 'framer-motion';

interface Quest {
  title: string;
  description: string;
  requirement_type: string;
  reward_xp: number;
}

interface SubmissionResponse {
  reward: number;
}

export default function QuestPage() {
  const { nodeId } = useParams();
  const router = useRouter();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [proof, setProof] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showTransmutation, setShowTransmutation] = useState(false);
  const [rewardXp, setRewardXp] = useState(0);

  useEffect(() => {
    async function fetchQuest() {
      const response = await apiClient.get<Quest>(`/quests/delivery?node_id=${nodeId}`);
      if (response.error) {
        router.push('/map');
      } else {
        setQuest(response.data);
      }
      setLoading(false);
    }
    fetchQuest();
  }, [nodeId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const response = await apiClient.post<SubmissionResponse>('/quests/submit', {
      node_id: nodeId,
      proof: proof,
    });

    if (response.error) {
      alert(response.error);
      setSubmitting(false);
    } else {
      setRewardXp(response.data?.reward || 0);

      // Trigger Transmutation Effect
      setShowTransmutation(true);

      // Delay LevelUpModal to let the explosion finish
      setTimeout(() => {
        setShowTransmutation(false);
        setShowLevelUp(true);
        setSubmitting(false);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex items-center justify-center font-mono">
        <div className="animate-pulse neon-text-blue text-xl italic">Reading the quest scroll...</div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex items-center justify-center font-mono">
        <div className="text-center">
          <p className="text-red-400 mb-4">This quest has vanished from the realm.</p>
          <button onClick={() => router.push('/map')} className="text-neon-gold underline">Return to Map</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 p-8 font-mono relative overflow-hidden">
      <AnimatePresence>
        {submitting && <VortexOverlay />}
        {showTransmutation && <TransmutationOverlay />}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto relative z-10">
        <button
          onClick={() => router.push('/map')}
          className="text-astral-blue hover:text-white mb-8 transition-colors flex items-center gap-2 uppercase text-xs font-bold tracking-widest"
        >
          ← Back to Map
        </button>

        <div className="glass-panel p-8 rounded-2xl shadow-2xl border-2 border-astral-blue/30">
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-astral-blue/20 text-astral-blue border border-astral-blue/30">Active Quest</span>
            <h1 className="text-3xl font-bold text-white mt-4 neon-text-blue">{quest.title}</h1>
          </div>

          <div className="bg-black/40 p-6 rounded-lg border border-white/10 mb-8 italic text-slate-300 leading-relaxed">
            {quest.description}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
              <p className="text-xs text-slate-400 uppercase font-bold">Requirement</p>
              <p className="text-white font-bold uppercase tracking-wide">{quest.requirement_type}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
              <p className="text-xs text-slate-400 uppercase font-bold">Reward</p>
              <p className="neon-text-gold font-bold">{quest.reward_xp} XP</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-astral-blue mb-2 uppercase tracking-widest">Proof of Mastery</label>
              <textarea
                className="w-full bg-black/40 border-2 border-white/10 p-3 rounded-lg h-32 focus:border-astral-blue outline-none transition-all text-slate-200 placeholder:text-slate-600"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                placeholder="Paste your link or evidence here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-astral-blue/20 hover:bg-astral-blue/40 text-astral-blue font-bold py-4 rounded-lg uppercase tracking-widest transition-all border-2 border-astral-blue/50 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Transmuting...' : 'Submit Proof'}
            </button>
          </form>
        </div>
      </div>

      {showLevelUp && (
        <LevelUpModal
          xpGained={rewardXp}
          onClose={() => {
            setShowLevelUp(false);
            router.push('/dashboard');
          }}
        />
      )}
    </div>
  );
}
