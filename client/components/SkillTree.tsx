"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NodeModal from './NodeModal';

interface Node {
  id: string;
  name: string;
  description: string;
  user_status: 'locked' | 'unlocked' | 'completed';
  xp_reward: number;
  xp_type: 'knowledge' | 'capability';
  prerequisite_id: string | null;
}

const NODE_RADIUS = 40;
const VERTICAL_SPACING = 150;
const HORIZONTAL_SPACING = 120;

export default function SkillTree({ nodes }: { nodes: Node[] }) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Calculate positions for a constellation-like layout
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const levels: Record<string, number> = {};

    // 1. Determine levels (depth in tree)
    const calculateLevel = (nodeId: string): number => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node || !node.prerequisite_id) return 0;
      if (levels[node.prerequisite_id] !== undefined) return levels[node.prerequisite_id] + 1;
      return calculateLevel(node.prerequisite_id) + 1;
    };

    nodes.forEach(node => {
      levels[node.id] = calculateLevel(node.id);
    });

    // 2. Position nodes based on level and siblings
    const levelCounts: Record<number, number> = {};
    nodes.forEach(node => {
      const lvl = levels[node.id];
      const count = levelCounts[lvl] || 0;

      // Center horizontally, spread out by siblings
      const totalSiblings = nodes.filter(n => levels[n.id] === lvl).length;
      const offsetX = (count - (totalSiblings - 1) / 2) * HORIZONTAL_SPACING;

      positions[node.id] = {
        x: 800 + offsetX,
        y: 600 - (lvl * VERTICAL_SPACING)
      };

      levelCounts[lvl] = count + 1;
    });

    return positions;
  }, [nodes]);

  return (
    <div className="relative w-full h-[800px] bg-transparent overflow-hidden font-mono cursor-grab active:cursor-grabbing">
      <svg
        viewBox="0 0 1600 800"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <radialGradient id="grad-completed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </radialGradient>

          <radialGradient id="grad-unlocked" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#005F73" />
          </radialGradient>

          <radialGradient id="grad-locked" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#1A202C" />
          </radialGradient>
        </defs>

        {/* Render Ley Lines first so they are behind nodes */}
        {nodes.map((node) => {
          if (!node.prerequisite_id) return null;
          const start = nodePositions[node.prerequisite_id];
          const end = nodePositions[node.id];
          if (!start || !end) return null;

          const isCompleted = node.user_status === 'completed';

          return (
            <motion.path
              key={`line-${node.id}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
              stroke={isCompleted ? "#FFD700" : "#1E293B"}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              className="drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]"
            >
              {/* Energy Pulse Animation */}
              {isCompleted && (
                <motion.circle
                  r="3"
                  fill="#FFF"
                  initial={{ offset: 0 }}
                  animate={{ offset: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none"
                />
              )}
            </motion.path>
          );
        })}

        {/* Render Nodes */}
        {nodes.map((node) => {
          const pos = nodePositions[node.id];
          if (!pos) return null;

          const isCompleted = node.user_status === 'completed';
          const isUnlocked = node.user_status === 'unlocked';
          const fillId = isCompleted ? 'grad-completed' : isUnlocked ? 'grad-unlocked' : 'grad-locked';
          const strokeColor = isCompleted ? '#FFD700' : isUnlocked ? '#00D4FF' : '#334155';

          return (
            <g
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="cursor-pointer group"
            >
              <g filter="url(#glow)">
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2, filter: 'brightness(1.2)' }}
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_RADIUS}
                  fill={`url(#${fillId})`}
                  stroke={strokeColor}
                  strokeWidth="3"
                  className="transition-all duration-300"
                />
              </g>

              {/* Node Label */}
              <foreignObject
                x={pos.x - 50}
                y={pos.y + NODE_RADIUS + 10}
                width="100"
                height="40"
                className="pointer-events-none text-center"
              >
                <div className={`text-[10px] font-bold uppercase tracking-tighter ${
                  isCompleted ? 'text-neon-gold' : isUnlocked ? 'text-astral-blue' : 'text-slate-600'
                }`}>
                  {node.name}
                </div>
              </foreignObject>

              {/* XP Type Badge */}
              <circle
                cx={pos.x + NODE_RADIUS - 10}
                cy={pos.y - NODE_RADIUS + 10}
                r="8"
                fill={node.xp_type === 'knowledge' ? '#00D4FF' : '#FFD700'}
                className="opacity-80"
              />
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {selectedNode && (
          <NodeModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
