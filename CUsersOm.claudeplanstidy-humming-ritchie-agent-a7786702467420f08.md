# Implementation Plan: Cosmic Archive / Arcanepunk Theme Transformation

## Overview
Transform SkillQuest from a basic dark-mode UI to a "Cosmic Archive" aesthetic combining ancient mysticism and futuristic holograms.

**Target Palette:**
- Deep Navy: `#0A0E1A` (Base Background)
- Neon Gold: `#FFD700` (Primary Accents, Rewards)
- Astral Blue: `#00D4FF` (Knowledge, Holograms)
- Emerald/Void: `#10B981` $\rightarrow$ `#00FF9F` (Capability)

---

## 1. Global Theme & Design System

### Tailwind Configuration
- **Modify/Create `tailwind.config.js`**:
  - Extend `colors` to include `cosmic`:
    - `bg`: `#0A0E1A`
    - `gold`: `#FFD700`
    - `astral`: `#00D4FF`
    - `neon-emerald`: `#00FF9F`
- **Create `client/app/globals.css`**:
  - Implement `.glass-panel`: `backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);`
  - Implement `.neon-glow`: `box-shadow: 0 0 15px var(--tw-shadow-color);`
  - Add a global scanline overlay for the holographic feel:
    ```css
    .scanlines {
      background: linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 4px, 3px 100%;
      pointer-events: none;
    }
    ```

---

## 2. The Soul Mirror (Dashboard/Profile)

**File:** `client/components/ProfileCard.tsx`

### Implementation Logic
- **Silhouette Component**: Create a new `SoulSilhouette.tsx` SVG component.
  - **Base**: A minimalist humanoid silhouette path.
  - **Knowledge Aura**: An SVG `<filter>` with `feGaussianBlur` and `feComposite`.
    - *Scaling*: Increase `stdDeviation` and `opacity` based on `knowledge.level`.
    - *Color*: Astral Blue (`#00D4FF`).
  - **Capability Armor**: A set of conditionally rendered SVG paths (circuitry lines).
    - *Scaling*: Render more complex paths (e.g., `Level 1-5: Chest`, `Level 6-10: Arms`, etc.) based on `capability.level`.
    - *Color*: Neon Gold/Emerald.

### Framer Motion Integration
- Use `animate` on the aura's opacity to create a "breathing" effect.
- Use `initial={{ scale: 0 }} animate={{ scale: 1 }}` for the armor pieces as they appear.

---

## 3. The Celestial Map (Skill Tree)

**File:** `client/components/SkillTree.tsx`

### Coordinate System & Layout
- **Shift to SVG Canvas**: Replace the `flex-col` layout with a large SVG.
- **Node Positioning**: Define a coordinate map for nodes.
  ```ts
  const NODE_COORDINATES: Record<string, {x: number, y: number}> = {
    'root': { x: 500, y: 800 },
    'node_1': { x: 400, y: 600 },
    'node_2': { x: 600, y: 600 },
    // ...
  };
  ```
- **Ley Lines (Connections)**:
  - Use `<path d="M x1 y1 Q cx cy x2 y2" />` for curved connections.
  - **Animation**: Use `stroke-dasharray` and `stroke-dashoffset` to create moving energy pulses.
  - *Logic*: Only animate paths leading to `unlocked` or `completed` nodes.

### Node Design
- **Glowing Orbs**: Replace buttons with SVG `<circle>` elements.
- **Radial Gradient**: Use `<radialGradient>` for a 3D orb effect.
- **Framer Motion**: Use `whileHover={{ scale: 1.2, filter: 'brightness(1.2)' }}`.

---

## 4. The Quest Forge (Submission)

**File:** `client/app/quests/[nodeId]/page.tsx`

### Submission Flow Animations
1. **Vortex Effect (`VortexOverlay.tsx`)**:
   - On `handleSubmit`, trigger a full-screen overlay.
   - Generate 50-100 small particles (divs) at random screen positions.
   - Use `framer-motion` to animate them towards the center: `animate={{ x: 0, y: 0, scale: 0, rotate: 360 }}`.
   - Use a `staggerChildren` transition for a "sucking" feel.

2. **Transmutation Effect**:
   - After particles converge, trigger a `motion.div` that expands rapidly: `animate={{ scale: [0, 1.5, 1], opacity: [1, 1, 0] }}` with a bright gold color.
   - Simultaneously trigger the `LevelUpModal`.

---

## 5. The Holographic Grimoire (Dashboard Layout)

**File:** `client/app/dashboard/page.tsx`

### Layout Overhaul
- **Glassmorphism**: Apply `.glass-panel` to the main content areas.
- **Interface Elements**: 
  - Add decorative "HUD" corners (L-shaped borders).
  - Add a "System Status" ticker at the bottom with fake holographic data.
- **Seamless Transitions**: 
  - Use `layoutId` from `framer-motion` when transitioning between the Dashboard and the Skill Map to make the UI feel like a single evolving interface.
  - Implement `AnimatePresence` for page exits/entries with a "glitch" effect:
    ```ts
    const glitchVariants = {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 10 }
    };
    ```

---

## Implementation Sequence

1. **Phase 1: Foundations**
   - Create `tailwind.config.js` and `globals.css`.
   - Update `layout.tsx` for base background and scanlines.
2. **Phase 2: The Soul Mirror**
   - Implement `SoulSilhouette.tsx` $\rightarrow$ integrate into `ProfileCard.tsx`.
3. **Phase 3: The Celestial Map**
   - Refactor `SkillTree.tsx` to SVG coordinate system $\rightarrow$ add animated ley lines.
4. **Phase 4: The Quest Forge**
   - Create `VortexOverlay.tsx` $\rightarrow$ integrate into `QuestPage.tsx` submission logic.
5. **Phase 5: Grimoire Polish**
   - Apply Glassmorphism and HUD elements to `Dashboard`.
   - Add page transition animations.
