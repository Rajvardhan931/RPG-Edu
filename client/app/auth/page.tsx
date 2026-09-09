"use client";
import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthResponse {
  token: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    const response = await apiClient.post<AuthResponse>(endpoint, formData);

    if (response.error) {
      setError(response.error);
    } else {
      localStorage.setItem('sq_token', response.data?.token || '');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl shadow-2xl relative z-10">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-astral-blue/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-astral-blue/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-astral-blue/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-astral-blue/50" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold neon-text-blue uppercase tracking-widest mb-2">
            {isLogin ? 'Enter the Realm' : 'Create Your Legend'}
          </h1>
          <p className="text-slate-400 italic text-sm">
            {isLogin ? 'Verify your credentials to continue your journey' : 'Embark on your first quest by creating a profile'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-astral-blue uppercase tracking-widest mb-1">Character Name</label>
              <input
                type="text"
                className="w-full bg-black/40 border-2 border-white/10 p-3 rounded-lg focus:border-astral-blue outline-none transition-all text-slate-200 placeholder:text-slate-600"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your name..."
                required
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-astral-blue uppercase tracking-widest mb-1">Email Address</label>
            <input
              type="email"
              className="w-full bg-black/40 border-2 border-white/10 p-3 rounded-lg focus:border-astral-blue outline-none transition-all text-slate-200 placeholder:text-slate-600"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-astral-blue uppercase tracking-widest mb-1">Secret Password</label>
            <input
              type="password"
              className="w-full bg-black/40 border-2 border-white/10 p-3 rounded-lg focus:border-astral-blue outline-none transition-all text-slate-200 placeholder:text-slate-600"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm italic text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-astral-blue/20 hover:bg-astral-blue/40 text-astral-blue font-bold py-4 rounded-lg border-2 border-astral-blue/50 uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-astral-blue/10"
          >
            {isLogin ? 'Verify Identity' : 'Begin Journey'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-astral-blue hover:text-white text-sm underline underline-offset-4 transition-colors font-medium"
          >
            {isLogin ? "I am a new Adventurer" : "I already have a Pass"}
          </button>
        </div>
      </div>
    </div>
  );
}
