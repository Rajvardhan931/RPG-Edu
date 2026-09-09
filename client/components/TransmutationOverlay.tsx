"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function TransmutationOverlay() {
  return (
    <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Main Explosion */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-32 h-32 bg-neon-gold rounded-full blur-3xl"
      />

      {/* Shockwave Ring */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 10, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute w-64 h-64 border-4 border-neon-gold rounded-full"
      />

      {/* Gold Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 1000,
            y: (Math.random() - 0.5) * 1000,
            scale: 0,
            opacity: 0
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute w-2 h-2 bg-neon-gold rounded-full"
        />
      ))}
    </div>
  );
}
