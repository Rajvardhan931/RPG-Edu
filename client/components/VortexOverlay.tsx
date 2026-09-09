"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VortexOverlay() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate particles randomly around the screen
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, // Percentage from center
      y: Math.random() * 100 - 50,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 1 + 0.5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Central Vortex Core */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 bg-white rounded-full blur-xl"
        />

        {/* Particles sucking into center */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: `${p.x}vw`,
              y: `${p.y}vh`,
              opacity: 0,
              scale: 1
            }}
            animate={{
              x: '0vw',
              y: '0vh',
              opacity: [0, 1, 0],
              scale: 0
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeIn",
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-astral-blue rounded-full"
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </div>
    </div>
  );
}
