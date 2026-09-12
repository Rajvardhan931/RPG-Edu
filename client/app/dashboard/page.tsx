"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import ProfileCard from '@/components/ProfileCard';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '@/lib/sound-manager';

interface UserStats {
  username: string;
  class: string;
  stats: {
    knowledge: { level: number; xp: number };
    capability: { level: number; xp: number };
    total_xp: number;
  };
}

interface QuestLogEntry {
  id: string;
  name: string;
  status: 'completed' | 'in-progress';
  xp_reward: number;
  xp_type: 'knowledge' | 'capability';
}

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [questLog, setQuestLog] = useState<QuestLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboardData() {
      // Fetch stats
      const statsResponse = await apiClient.get<UserStats>('/user/stats');
      if (statsResponse.error) {
        if (statsResponse.status === 401) {
          router.push('/auth');
        }
      } else {
        setStats(statsResponse.data);
      }

      // Fetch simplified quest log (mocking a list of user's recent skills)
      const skillsResponse = await apiClient.get<any>('/skills/tree');
      if (!skillsResponse.error && skillsResponse.data) {
        const treeData = Array.isArray(skillsResponse.data)
          ? skillsResponse.data
          : (skillsResponse.data as any).tree || [];

        const log = treeData
          .filter((node: any) => node.user_status !== 'locked')
          .map((node: any) => ({
            id: node.id,
            name: node.name,
            status: (node.user_status === 'completed' ? 'completed' : 'in-progress') as 'completed' | 'in-progress',
            xp_reward: node.xp_reward,
            xp_type: node.xp_type
          }))
          .slice(-5); // Last 5 activities
        setQuestLog(log);
      }

      setLoading(false);
    }
    fetchDashboardData();
  }, [router]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if the clicked element is an image, or inside a rounded-full div (our avatars)
      if (target.tagName === 'IMG' || target.closest('.rounded-full')) {
        soundManager.playSound('CONTEXT_MENU');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex items-center justify-center font-mono">
        <div className="animate-pulse neon-text-blue text-xl italic">Consulting the archives...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex items-center justify-center font-mono">
        <div className="text-center">
          <p className="text-red-400 mb-4">Your identity could not be verified.</p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-astral-blue px-4 py-2 rounded text-white font-bold uppercase tracking-widest"
          >
            Return to Gateway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 p-8 font-mono relative overflow-hidden">
      {/* System Status Ticker */}
      <div className="absolute top-0 left-0 w-full h-6 bg-astral-blue/10 border-b border-astral-blue/20 flex items-center px-4 overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="text-[10px] text-astral-blue/60 uppercase font-bold tracking-[0.2em]"
        >
          System Status: Optimal // Syncing with Cosmic Archive... // Neural Pathing Active // Knowledge-to-Capability Ratio: {((stats.stats.knowledge.level / (stats.stats.capability.level || 1)) * 100).toFixed(2)}% // Welcome, {stats.username} //
        </motion.div>
      </div>

      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 mt-4">
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-full p-[1px] bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_10px_#00D4FF] ring-1 ring-cyan-400/50 overflow-hidden">
            <img
              src="https://wallpapercat.com/w/full/6/9/f/319983-3840x2160-desktop-4k-iron-man-background.jpg"
              alt="Logo"
              className="w-full h-full object-cover bg-slate-900"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold neon-text-blue uppercase tracking-tighter">The Cosmic Archive</h1>
            <p className="text-slate-500 italic text-sm tracking-wide">Digital Grimoire of Universal Mastery</p>
          </div>
          <div className="absolute -left-4 top-0 w-1 h-full bg-astral-blue" />
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('sq_token');
            router.push('/auth');
          }}
          className="text-slate-500 hover:text-white text-xs uppercase font-bold tracking-widest transition-colors underline decoration-astral-blue/30"
        >
          Sever Connection (Logout)
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProfileCard
            data={stats}
            onAvatarClick={() => {
              soundManager.playSound('SYNC_EXPAND');
              setIsAvatarExpanded(true);
            }}
          />
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* SOUND DEBUG PANEL (Temporary) */}
          <div className="glass-panel p-4 rounded-2xl border-red-500/30 bg-red-500/5">
            <h3 className="text-xs font-bold text-red-400 uppercase mb-3 tracking-widest">Audio Diagnostic Center</h3>
            <div className="flex flex-wrap gap-2">
              {(['SYNC_EXPAND', 'LEVEL_UP', 'UI_CLICK', 'ERROR', 'CONTEXT_MENU'] as const).map(sound => (
                <button
                  key={sound}
                  onClick={() => soundManager.playSound(sound)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded border border-slate-600 transition-colors"
                >
                  Test {sound}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">

            <div className="absolute top-0 right-0 p-2">
              <div className="w-2 h-2 bg-astral-blue rounded-full animate-ping" />
            </div>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest neon-text-blue">Current Objective</h2>
            <div className="bg-black/40 p-6 rounded-lg border-l-4 border-astral-blue italic text-slate-300 leading-relaxed">
              {stats.stats.total_xp === 0
                ? "Your journey has just begun. Initiate neural sync by exploring the Celestial Map to find your first quest."
                : "Your path is unfolding. Continue the transmutation of knowledge into capability."}
            </div>
            <button
              className="mt-6 bg-astral-blue/20 hover:bg-astral-blue/40 text-astral-blue font-bold py-3 px-8 rounded-lg uppercase tracking-widest transition-all border border-astral-blue/50 hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] active:scale-95"
              onClick={() => {
                soundManager.playSound('UI_CLICK');
                router.push('/map');
              }}
            >
              Open Celestial Map
            </button>
          </div>

          {/* Interactive Quest Log */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest neon-text-blue flex items-center gap-3">
              <span className="w-2 h-2 bg-astral-blue rounded-full animate-pulse" />
              Recent Archive Syncs
            </h2>
            <div className="space-y-3">
              {questLog.length === 0 ? (
                <p className="text-slate-500 italic text-sm">No recent neural syncs found. Begin your first quest.</p>
              ) : (
                questLog.map((entry, i) => (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-astral-blue/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${entry.status === 'completed' ? 'bg-neon-gold' : 'bg-astral-blue animate-pulse'}`} />
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] uppercase font-bold ${entry.xp_type === 'knowledge' ? 'text-astral-blue' : 'text-neon-gold'}`}>
                        {entry.xp_type}
                      </span>
                      <span className="text-xs font-mono text-slate-400">+{entry.xp_reward} XP</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-xl border-astral-blue/20">
              <h3 className="neon-text-blue font-bold text-sm uppercase mb-2 tracking-widest">Knowledge Track</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Expand your theoretical understanding to unlock deeper mysteries within the archive.</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border-neon-gold/20">
              <h3 className="neon-text-gold font-bold text-sm uppercase mb-2 tracking-widest">Capability Track</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Apply your knowledge through projects to prove your mastery and evolve your form.</p>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isAvatarExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60 cursor-pointer"
            onClick={() => setIsAvatarExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="relative group"
            >
              {/* Huge Arc Reactor Glow */}
              <div className="absolute -inset-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-50 animate-glow" />

              {/* Large Avatar */}
              <div className="relative w-64 h-64 rounded-full p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_50px_#00D4FF] ring-4 ring-cyan-400/50 overflow-hidden">
                <img
                  src="https://wallpapercat.com/w/full/6/9/f/319983-3840x2160-desktop-4k-iron-man-background.jpg"
                  alt="Iron Man 2D Avatar"
                  className="w-full h-full object-cover bg-slate-900"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <p className="text-astral-blue text-xl font-bold uppercase tracking-[0.3em] neon-text-blue">
                  Identity Verified
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
