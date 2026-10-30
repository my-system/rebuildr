// Swarm Rebuild Studio v3.1 — Sequential Polygon Mesh, Wireframe & Word-by-Word Live Builder
// Every component is visibly constructed from scratch in sequential stages:
//   Stage 1: Pure SVG Polygon Mesh Triangulation (cursors click vertices & draw low-poly triangles on blank canvas)
//   Stage 2: Laser Scanline Shader Pass (sweeps full-color character/media in beneath the glowing polygon mesh)
//   Stage 3: Empty Dashed Wireframe Box -> Glassmorphism Shader Fill (cards appear empty before content is added)
//   Stage 4: Caret-Tracked Word-by-Word & Character-by-Character Live Typing (I-beam cursor types every heading & paragraph)
(() => {
  if (window.__swarmRebuild) {
    window.__swarmRebuild.toggle();
    return;
  }

  // ---------------------------------------------------------------------------
  // 1. MULTIPLAYER AI & DESIGN AGENTS PALETTE
  // ---------------------------------------------------------------------------
  const AGENTS = [
    { name: "Yusuf · Lead Dev", color: "#10b981", role: "Lead" },
    { name: "Claude AI · Copywriter", color: "#8b5cf6", role: "Text" },
    { name: "Figma UI · Vector", color: "#f43f5e", role: "Pen" },
    { name: "WebGL · Polygon", color: "#0ea5e9", role: "Mesh" },
    { name: "GSAP · Motion", color: "#f59e0b", role: "Motion" },
    { name: "S.Stat · Data", color: "#14b8a6", role: "Data" },
    { name: "Three.js · Shader", color: "#ec4899", role: "3D" },
    { name: "Audio · Lofi", color: "#6366f1", role: "Layout" },
  ];

  // ---------------------------------------------------------------------------
  // 2. WEB AUDIO SYNTHESIZER
  // ---------------------------------------------------------------------------
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.lastTick = 0;
    }
    init() {
      if (this.ctx) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      } catch (_) {}
    }
    resume() {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    }
    playVertex(idx = 0) {
      if (this.muted) return;
      const now = performance.now();
      if (now - this.lastTick < 35) return;
      this.lastTick = now;
      this.resume();
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        const freq = 420 * Math.pow(1.055, idx % 14);
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + 0.045);
        gain.gain.setValueAtTime(0.028, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.055);
      } catch (_) {}
    }
    playSnap(pitchFactor = 1) {
      if (this.muted) return;
      const now = performance.now();
      if (now - this.lastTick < 38) return;
      this.lastTick = now;
      this.resume();
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        const baseFreq = 520 * pitchFactor + (Math.random() * 60 - 30);
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, t + 0.045);
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.055);
      } catch (_) {}
    }
    playKey() {
      if (this.muted) return;
      const now = performance.now();
      if (now - this.lastTick < 26) return;
      this.lastTick = now;
      this.resume();
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(920 + Math.random() * 280, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.016);
        gain.gain.setValueAtTime(0.015, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.02);
      } catch (_) {}
    }
    playTick() {
      this.playVertex(2);
    }
    playSceneChime() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const t = this.ctx.currentTime + i * 0.055;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.026, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.3);
        });
      } catch (_) {}
    }
  }

  // ---------------------------------------------------------------------------
  // 3. SCENE & POLYGON MESH GEOMETRY
  // ---------------------------------------------------------------------------
  const SCENE_META = {
    "scene-prolog": { title: "Bab 01 · Prolog & Panggung Hyouka", navLabel: "Bab 1 · Prolog" },
    "scene-whoami": { title: "Bab 02 · Dialog Visual Novel", navLabel: "Bab 2 · Siapa Aku" },
    "scene-skills": { title: "Bab 03 · Status RPG & Keahlian", navLabel: "Bab 3 · Keahlian" },
    "scene-projects": { title: "Bab 04 · Koleksi 8 Proyek Pilihan", navLabel: "Bab 4 · Karya" },
    "scene-timeline": { title: "Bab 05 · Peta Jalur Perjalanan", navLabel: "Bab 5 · Jejak" },
    "scene-contact": { title: "Bab 06 · Surat & Dinding Ofuda", navLabel: "Bab 6 · Surat" },
    "scene-epilog": { title: "Bab 07 · Kartu Akses & Epilog", navLabel: "Bab 7 · Epilog" },
  };

  // 18-Vertex Character Portrait Silhouette Mesh (Normalized 0..1)
  const CHARACTER_POLYGON_PTS = [
    [0.50, 0.11], // 0: Hair top crown
    [0.37, 0.17], // 1: Upper left hair
    [0.63, 0.17], // 2: Upper right hair
    [0.34, 0.30], // 3: Left temple/ear
    [0.50, 0.28], // 4: Eyes center bridge
    [0.65, 0.30], // 5: Right temple/ear
    [0.44, 0.41], // 6: Chin & thinking hand
    [0.56, 0.42], // 7: Right jawline/collar
    [0.25, 0.54], // 8: Left shoulder
    [0.50, 0.57], // 9: Sternum/shirt tie line
    [0.75, 0.54], // 10: Right shoulder
    [0.19, 0.77], // 11: Left outer sleeve
    [0.42, 0.82], // 12: Left forearm & wrist watch
    [0.63, 0.82], // 13: Right folded arm
    [0.82, 0.77], // 14: Right outer elbow
    [0.22, 0.92], // 15: Desk left
    [0.49, 0.93], // 16: Coffee cup center
    [0.79, 0.92], // 17: Desk right
  ];

  const CHARACTER_TRIANGLES = [
    [0, 1, 4], [0, 4, 2], [1, 3, 4], [2, 4, 5],
    [3, 6, 4], [4, 6, 7], [4, 7, 5], [3, 8, 6],
    [6, 8, 9], [6, 9, 7], [7, 9, 10], [5, 7, 10],
    [8, 11, 12], [8, 12, 9], [9, 12, 13], [9, 13, 10],
    [10, 13, 14], [11, 15, 12], [12, 15, 16], [12, 16, 13],
    [13, 16, 17], [13, 17, 14],
  ];

  // 10-Vertex Media / Image Triangulation Mesh
  const RECT_POLYGON_PTS = [
    [0.05, 0.08], [0.50, 0.06], [0.95, 0.08],
    [0.26, 0.45], [0.74, 0.45],
    [0.05, 0.55], [0.50, 0.58], [0.95, 0.55],
    [0.05, 0.92], [0.50, 0.94], [0.95, 0.92],
  ];

  const RECT_TRIANGLES = [
    [0, 1, 3], [1, 4, 3], [1, 2, 4],
    [0, 3, 5], [3, 6, 5], [3, 4, 6], [4, 7, 6], [2, 7, 4],
    [5, 6, 8], [6, 9, 8], [6, 10, 9], [6, 7, 10],
  ];

  // ---------------------------------------------------------------------------
  // 4. CSS STYLES
  // ---------------------------------------------------------------------------
  const STYLE_CSS = `
    #swarm-studio-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483645;
      pointer-events: none;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      user-select: none;
    }

    #swarm-studio-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(to right, rgba(16, 185, 129, 0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(16, 185, 129, 0.06) 1px, transparent 1px);
      background-size: 32px 32px;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    #swarm-studio-overlay.is-building #swarm-studio-grid {
      opacity: 1;
    }

    #swarm-svg-layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483644;
    }

    /* Prevent 3D card back-face from bleeding through when 3D context is flattened during build */
    .mission-card-3d:not(.is-flipped) .card-back {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* Hidden state before an element's turn (including 3D preserve-3d children & videos) */
    .swarm-hidden,
    .swarm-hidden .card-flip-inner,
    .swarm-hidden .card-front,
    .swarm-hidden .card-back,
    .swarm-hidden video,
    .swarm-hidden img {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transition: none !important;
    }

    /* Stage 1: Empty Dashed Blueprint Wireframe Shell */
    .swarm-wireframe-shell,
    .swarm-wireframe-shell > .card-flip-inner > .card-front {
      opacity: 1 !important;
      visibility: visible !important;
      background: rgba(16, 185, 129, 0.035) !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      border: 1.5px dashed var(--swarm-shell-color, #10b981) !important;
      box-shadow: inset 0 0 24px rgba(16, 185, 129, 0.07) !important;
      transition: none !important;
    }
    .swarm-wireframe-shell > .card-flip-inner {
      opacity: 1 !important;
      visibility: visible !important;
    }

    /* Stage 2: Glassmorphism Shader Fill Transition */
    .swarm-glass-filling,
    .swarm-glass-filling > .card-flip-inner,
    .swarm-glass-filling > .card-flip-inner > .card-front {
      opacity: 1 !important;
      visibility: visible !important;
      transition: background 0.36s ease, border-color 0.36s ease, box-shadow 0.36s ease, backdrop-filter 0.36s ease !important;
    }

    /* Polygon Scanline Reveal Effect */
    .swarm-scan-reveal {
      opacity: 1 !important;
      visibility: visible !important;
      clip-path: var(--swarm-clip, inset(0 0 100% 0)) !important;
      transition: none !important;
    }

    .swarm-releasing {
      transition: opacity 0.32s ease, transform 0.32s ease, filter 0.32s ease !important;
    }

    /* Live Blinking Caret inside DOM Text Nodes */
    .swarm-live-caret {
      display: inline-block;
      width: 2.5px;
      height: 1.08em;
      vertical-align: -0.15em;
      margin-left: 1.5px;
      background: var(--caret-color, #8b5cf6);
      box-shadow: 0 0 8px var(--caret-color, #8b5cf6);
      animation: swarmCaretBlink 0.45s infinite alternate;
    }
    @keyframes swarmCaretBlink {
      0% { opacity: 1; }
      100% { opacity: 0.2; }
    }

    /* Figma Selection Frame */
    .swarm-selection-frame {
      position: fixed;
      pointer-events: none;
      border: 1.5px solid var(--agent-color, #10b981);
      background: color-mix(in srgb, var(--agent-color, #10b981) 5%, transparent);
      border-radius: 5px;
      z-index: 2147483644;
      box-sizing: border-box;
      transition: opacity 0.2s ease;
    }
    .swarm-selection-frame.is-dashed {
      border-style: dashed;
      background: repeating-linear-gradient(
        -45deg,
        color-mix(in srgb, var(--agent-color, #10b981) 7%, transparent),
        color-mix(in srgb, var(--agent-color, #10b981) 7%, transparent) 6px,
        transparent 6px,
        transparent 12px
      );
    }
    .swarm-selection-frame.is-done {
      opacity: 0;
    }

    .swarm-handle {
      position: absolute;
      width: 6.5px;
      height: 6.5px;
      background: #ffffff;
      border: 1.5px solid var(--agent-color, #10b981);
      border-radius: 1.5px;
    }
    .swarm-handle.tl { top: -4px; left: -4px; }
    .swarm-handle.tr { top: -4px; right: -4px; }
    .swarm-handle.bl { bottom: -4px; left: -4px; }
    .swarm-handle.br { bottom: -4px; right: -4px; }

    .swarm-frame-tag {
      position: absolute;
      top: -21px;
      left: -1.5px;
      background: var(--agent-color, #10b981);
      color: #ffffff;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.02em;
      padding: 2px 6px;
      border-radius: 4px 4px 4px 0;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    .swarm-frame-dim {
      position: absolute;
      bottom: -19px;
      right: -1.5px;
      background: rgba(15, 23, 42, 0.9);
      color: #e2e8f0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 600;
      padding: 1px 5px;
      border-radius: 3px;
      border: 1px solid rgba(255,255,255,0.15);
      white-space: nowrap;
    }

    /* Multiplayer Agent Cursor */
    .swarm-agent-cursor {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2147483646;
      pointer-events: none;
      will-change: transform;
    }
    .swarm-agent-cursor svg {
      display: block;
      width: 20px;
      height: 20px;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.32));
      transition: transform 0.12s ease;
    }
    .swarm-agent-cursor.is-clicking svg {
      transform: scale(0.82) rotate(-8deg);
    }
    .swarm-agent-pill {
      position: absolute;
      left: 14px;
      top: 14px;
      background: var(--agent-color, #10b981);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 999px;
      border-top-left-radius: 3px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.22);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .swarm-agent-pill .swarm-tool-badge {
      background: rgba(0, 0, 0, 0.26);
      padding: 1px 4px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px;
      letter-spacing: 0.03em;
    }

    /* Bottom Studio Control HUD */
    #swarm-studio-hud {
      position: fixed;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(16, 185, 129, 0.24);
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    #swarm-studio-hud.is-hidden {
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translateX(-50%) translateY(20px) !important;
    }
    .swarm-hud-avatars {
      display: flex;
      align-items: center;
      padding-left: 4px;
    }
    .swarm-hud-avatar {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9.5px;
      font-weight: 800;
      color: #fff;
      margin-left: -5px;
      border: 1.5px solid #0f172a;
    }
    .swarm-hud-status {
      font-weight: 600;
      color: #e2e8f0;
      white-space: nowrap;
      min-width: 200px;
    }
    .swarm-hud-status strong {
      color: #34d399;
      font-weight: 700;
    }
    .swarm-hud-progress {
      width: 72px;
      height: 5px;
      background: rgba(255, 255, 255, 0.14);
      border-radius: 999px;
      overflow: hidden;
    }
    .swarm-hud-progress-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #10b981, #38bdf8);
      border-radius: 999px;
      transition: width 0.25s ease;
    }
    .swarm-hud-btn {
      appearance: none;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(255, 255, 255, 0.07);
      color: #f1f5f9;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.18s ease;
      white-space: nowrap;
    }
    .swarm-hud-btn:hover {
      background: rgba(255, 255, 255, 0.16);
      border-color: rgba(255, 255, 255, 0.28);
    }
    .swarm-hud-btn.is-active {
      background: rgba(16, 185, 129, 0.22);
      border-color: #10b981;
      color: #6ee7b7;
    }
    .swarm-hud-btn.close-btn {
      padding: 4px 8px;
      color: #94a3b8;
    }
    .swarm-hud-btn.close-btn:hover {
      color: #f87171;
      border-color: rgba(248, 113, 113, 0.4);
    }
    .swarm-hud-btn.is-recording {
      background: rgba(239, 68, 68, 0.25) !important;
      border-color: #ef4444 !important;
      color: #fca5a5 !important;
      animation: swarmRecPulse 1s infinite alternate;
    }
    @keyframes swarmRecPulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.45); }
      100% { box-shadow: 0 0 12px 3px rgba(239, 68, 68, 0.65); }
    }

    /* Feature 1: Ghost Self-Building Mode (Hide Cursors & Agent Name Pills) */
    #swarm-studio-overlay.is-ghost-mode #swarm-cursors-layer,
    #swarm-studio-overlay.is-ghost-mode .swarm-frame-tag {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transition: opacity 0.25s ease;
    }

    /* Feature 2: Visual Blueprint Theme Presets (Figma / Architect CAD / Cyberpunk Neon) */
    #swarm-studio-overlay[data-theme="architect"] #swarm-studio-grid {
      background-color: rgba(12, 34, 68, 0.14);
      background-image:
        linear-gradient(to right, rgba(56, 189, 248, 0.22) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(56, 189, 248, 0.22) 1px, transparent 1px),
        linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px);
      background-size: 96px 96px, 96px 96px, 16px 16px, 16px 16px;
    }
    #swarm-studio-overlay[data-theme="architect"] .swarm-selection-frame {
      border-color: #38bdf8 !important;
      background: rgba(56, 189, 248, 0.08) !important;
    }

    #swarm-studio-overlay[data-theme="cyberpunk"] #swarm-studio-grid {
      background-color: rgba(10, 10, 26, 0.2);
      background-image:
        linear-gradient(to right, rgba(236, 72, 153, 0.16) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(6, 182, 212, 0.16) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    #swarm-studio-overlay[data-theme="cyberpunk"] .swarm-selection-frame {
      box-shadow: 0 0 14px rgba(236, 72, 153, 0.35), inset 0 0 10px rgba(6, 182, 212, 0.2) !important;
    }

    /* Feature 3: Mini Floating Live Code & AI Prompt Streamer */
    #swarm-mini-terminal {
      position: fixed;
      bottom: 70px;
      left: 20px;
      width: 356px;
      z-index: 2147483646;
      pointer-events: none;
      background: rgba(10, 15, 29, 0.86);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 12px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(16, 185, 129, 0.2);
      font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
      font-size: 10.5px;
      color: #e2e8f0;
      overflow: hidden;
      transition: opacity 0.28s ease, transform 0.28s ease;
    }
    #swarm-mini-terminal.is-hidden {
      opacity: 0 !important;
      transform: translateY(14px) scale(0.96) !important;
      pointer-events: none !important;
    }
    .swarm-term-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 11px;
      background: rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .swarm-term-dots {
      display: flex;
      gap: 5px;
    }
    .swarm-term-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .swarm-term-title {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.02em;
    }
    .swarm-term-live {
      font-size: 9px;
      font-weight: 700;
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      padding: 1px 6px;
      border-radius: 999px;
    }
    .swarm-term-body {
      padding: 8px 11px 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 115px;
      overflow: hidden;
    }
    .swarm-term-line {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
      color: #cbd5e1;
      opacity: 0.88;
    }
    .swarm-term-line .t-badge {
      display: inline-block;
      padding: 0 4px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: 700;
      color: #fff;
      margin-right: 5px;
    }
    .swarm-term-line .t-code {
      color: #38bdf8;
    }
    .swarm-term-active {
      margin-top: 2px;
      padding-top: 5px;
      border-top: 1px dashed rgba(255, 255, 255, 0.1);
      color: #6ee7b7;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Feature 5: Interactive Click-to-Rebuild Section Picker */
    #swarm-picker-highlight {
      position: fixed;
      pointer-events: none;
      z-index: 2147483646;
      border: 2px solid #10b981;
      background: rgba(16, 185, 129, 0.12);
      border-radius: 8px;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2), 0 12px 30px rgba(0, 0, 0, 0.3);
      transition: all 0.08s ease-out;
      display: none;
    }
    #swarm-picker-highlight.is-active {
      display: block;
    }
    #swarm-picker-tag {
      position: absolute;
      top: -26px;
      left: 0;
      background: #10b981;
      color: #06281e;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 6px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
  `;

  function getCursorSvg(mode, color) {
    if (mode === "pen") {
      return `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 3L10.5 20.5L13.5 13.5L20.5 10.5L3 3Z" fill="${color}" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
          <circle cx="6.5" cy="6.5" r="2" fill="#ffffff"/>
        </svg>
      `;
    }
    if (mode === "ibeam") {
      return `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 4H15M12 4V20M9 20H15" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M9 4H15M12 4V20M9 20H15" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      `;
    }
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4.5 3.5L19.5 11.2L12.2 13.4L9.2 20.5L4.5 3.5Z"
              fill="${color}" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `;
  }

  // ---------------------------------------------------------------------------
  // 5. MAIN SWARM STUDIO v3.5 CONTROLLER
  // ---------------------------------------------------------------------------
  class SwarmStudio {
    constructor() {
      this.sound = new SoundEngine();
      this.running = false;
      this.aborted = false;
      this.paused = false;
      this.ghostMode = false;
      this.terminalVisible = true;
      this.theme = "figma";
      this.pickerActive = false;
      this.hoveredPickEl = null;
      this.mediaRecorder = null;
      this.mediaStream = null;
      this.recordedChunks = [];
      this.autoTour = true;
      this.speed = 1;
      this.hudHidden = false;
      this.activeArtifacts = new Set();
      this.modifiedElements = new Set();
      this.savedTextNodes = new Map();
      this.savedPlaceholders = new Map();
      this.splitTextRecords = [];
      this.sceneUnitsMap = new Map();
      this.cursors = [];
      this.rafId = null;
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onPickerMove = this.onPickerMove.bind(this);
      this.onPickerClick = this.onPickerClick.bind(this);
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.aborted = false;
      this.paused = false;

      this.preparePortfolioStage();
      this.mountOverlay();
      window.addEventListener("keydown", this.onKeyDown, true);

      this.lastFrameTime = performance.now();
      const tick = (now) => {
        if (!this.running) return;
        const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000);
        this.lastFrameTime = now;
        if (!this.paused) {
          this.updateCursors(dt, now);
        }
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);

      if (window.__swarmStartInPickerMode) {
        delete window.__swarmStartInPickerMode;
        this.enableSectionPicker();
      } else {
        this.runShowcaseFlow();
      }
    }

    preparePortfolioStage() {
      const gate = document.getElementById("gate-overlay");
      if (gate && !gate.classList.contains("is-hidden")) {
        gate.classList.add("is-open", "is-hidden");
        gate.style.display = "none";
      }
      document.body.classList.remove("gate-locked");
      if (!document.body.dataset.scene) {
        document.body.dataset.scene = "scene-prolog";
      }
    }

    mountOverlay() {
      this.styleEl = document.createElement("style");
      this.styleEl.id = "swarm-studio-styles";
      this.styleEl.textContent = STYLE_CSS;
      document.head.appendChild(this.styleEl);

      this.overlay = document.createElement("div");
      this.overlay.id = "swarm-studio-overlay";
      this.overlay.className = "is-building";
      this.overlay.dataset.theme = this.theme;

      const grid = document.createElement("div");
      grid.id = "swarm-studio-grid";
      this.overlay.appendChild(grid);

      this.svgLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svgLayer.setAttribute("id", "swarm-svg-layer");
      this.overlay.appendChild(this.svgLayer);

      this.framesLayer = document.createElement("div");
      this.framesLayer.id = "swarm-frames-layer";
      this.overlay.appendChild(this.framesLayer);

      this.cursorsLayer = document.createElement("div");
      this.cursorsLayer.id = "swarm-cursors-layer";
      this.overlay.appendChild(this.cursorsLayer);

      // Section Picker Highlight Frame
      this.pickerBox = document.createElement("div");
      this.pickerBox.id = "swarm-picker-highlight";
      this.pickerBox.innerHTML = `<div id="swarm-picker-tag">🎯 Klik elemen ini untuk merakit ulang (Esc: Batal)</div>`;
      this.overlay.appendChild(this.pickerBox);

      // Mini Floating Live Code & AI Prompt Terminal
      this.terminalEl = document.createElement("div");
      this.terminalEl.id = "swarm-mini-terminal";
      this.terminalEl.innerHTML = `
        <div class="swarm-term-head">
          <div class="swarm-term-dots">
            <span style="background:#ef4444"></span>
            <span style="background:#f59e0b"></span>
            <span style="background:#10b981"></span>
          </div>
          <span class="swarm-term-title">rebuildr-ai · live-dom-stream</span>
          <span class="swarm-term-live" id="swarm-term-mode-pill">8 AGENTS</span>
        </div>
        <div class="swarm-term-body">
          <div id="swarm-term-lines"></div>
          <div class="swarm-term-active" id="swarm-term-cmd">&gt; Initializing live DOM deconstruction...</div>
        </div>
      `;
      this.overlay.appendChild(this.terminalEl);
      this.termLinesEl = this.terminalEl.querySelector("#swarm-term-lines");
      this.termCmdEl = this.terminalEl.querySelector("#swarm-term-cmd");
      this.termModePill = this.terminalEl.querySelector("#swarm-term-mode-pill");

      document.body.appendChild(this.overlay);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      this.cursors = AGENTS.map((agent, idx) => {
        const el = document.createElement("div");
        el.className = "swarm-agent-cursor";
        el.style.setProperty("--agent-color", agent.color);
        el.innerHTML = `
          <div class="swarm-cursor-icon">${getCursorSvg("pointer", agent.color)}</div>
          <div class="swarm-agent-pill">
            <span class="swarm-tool-badge">${agent.role}</span>
            <span class="swarm-agent-name">${agent.name}</span>
          </div>
        `;
        this.cursorsLayer.appendChild(el);

        const angle = (idx / AGENTS.length) * Math.PI * 2;
        const startX = vw / 2 + Math.cos(angle) * (vw * 0.45);
        const startY = vh / 2 + Math.sin(angle) * (vh * 0.42);
        return {
          idx,
          agent,
          el,
          iconEl: el.querySelector(".swarm-cursor-icon"),
          badgeEl: el.querySelector(".swarm-tool-badge"),
          nameEl: el.querySelector(".swarm-agent-name"),
          mode: "pointer",
          x: startX,
          y: startY,
          tx: vw * (0.2 + (idx % 4) * 0.18),
          ty: vh * (0.25 + Math.floor(idx / 4) * 0.35),
          vx: 0,
          vy: 0,
          busy: false,
          seed: idx * 7.3,
        };
      });

      this.hud = document.createElement("div");
      this.hud.id = "swarm-studio-hud";
      const avatarsHtml = AGENTS.slice(0, 5)
        .map(
          (a) =>
            `<div class="swarm-hud-avatar" style="background:${a.color}" title="${a.name}">${a.name[0]}</div>`
        )
        .join("");

      this.hud.innerHTML = `
        <div class="swarm-hud-avatars">${avatarsHtml}</div>
        <div class="swarm-hud-status" id="swarm-hud-status"><strong>Rebuildr v3.5</strong> · Merakit Poligon & Teks...</div>
        <div class="swarm-hud-progress"><div class="swarm-hud-progress-bar" id="swarm-hud-bar"></div></div>
        <button class="swarm-hud-btn" id="swarm-btn-pause" title="Jeda / Lanjutkan animasi (Tekan Spasi)">⏸️</button>
        <button class="swarm-hud-btn" id="swarm-btn-ghost" title="Sembunyikan/Tampilkan Kursor - Mode Website Merakit Sendiri (Tekan C)">👻 Ghost (C)</button>
        <button class="swarm-hud-btn is-active" id="swarm-btn-term" title="Tampilkan/Sembunyikan Mini Terminal Kode Live (Tekan T)">💻 Kode (T)</button>
        <button class="swarm-hud-btn" id="swarm-btn-theme" title="Ganti Tema Blueprint: Figma / Architect / Cyberpunk (Tekan B)">🎨 Figma</button>
        <button class="swarm-hud-btn" id="swarm-btn-pick" title="Klik bagian tertentu di halaman untuk dirakit ulang (Tekan S)">🎯 Pilih (S)</button>
        <button class="swarm-hud-btn" id="swarm-btn-record" title="Rekam layar otomatis ke file video WebM 60FPS (Tekan V)">🔴 Video (V)</button>
        <button class="swarm-hud-btn" id="swarm-btn-speed" title="Kecepatan animasi (Tekan 1, 2, atau 3)">${this.speed}×</button>
        <button class="swarm-hud-btn" id="swarm-btn-mute" title="Suara efek ketikan & poligon (Tekan M)">🔊</button>
        <button class="swarm-hud-btn" id="swarm-btn-hide" title="Sembunyikan panel bawah untuk rekam layar bersih (Tekan H)">👁️ (H)</button>
        <button class="swarm-hud-btn" id="swarm-btn-replay" title="Ulangi dari awal (Tekan R)">↻</button>
        <button class="swarm-hud-btn close-btn" id="swarm-btn-close" title="Keluar (Esc)">✕</button>
      `;
      document.body.appendChild(this.hud);

      this.statusEl = this.hud.querySelector("#swarm-hud-status");
      this.barEl = this.hud.querySelector("#swarm-hud-bar");

      this.hud.querySelector("#swarm-btn-pause").addEventListener("click", () => {
        this.togglePause();
      });
      this.hud.querySelector("#swarm-btn-ghost").addEventListener("click", () => {
        this.toggleGhostMode();
      });
      this.hud.querySelector("#swarm-btn-term").addEventListener("click", () => {
        this.toggleTerminal();
      });
      this.hud.querySelector("#swarm-btn-theme").addEventListener("click", () => {
        this.cycleTheme();
      });
      this.hud.querySelector("#swarm-btn-pick").addEventListener("click", () => {
        if (this.pickerActive) this.disableSectionPicker();
        else this.enableSectionPicker();
      });
      this.hud.querySelector("#swarm-btn-record").addEventListener("click", () => {
        this.toggleVideoRecording();
      });
      this.hud.querySelector("#swarm-btn-speed").addEventListener("click", (e) => {
        const speeds = [1, 1.5, 2, 3];
        const nextIdx = (speeds.indexOf(this.speed) + 1) % speeds.length;
        this.speed = speeds[nextIdx];
        e.currentTarget.textContent = `${this.speed}×`;
      });
      this.hud.querySelector("#swarm-btn-mute").addEventListener("click", (e) => {
        this.sound.muted = !this.sound.muted;
        e.currentTarget.textContent = this.sound.muted ? "🔇" : "🔊";
      });
      this.hud.querySelector("#swarm-btn-hide").addEventListener("click", () => {
        this.toggleHudVisibility();
      });
      this.hud.querySelector("#swarm-btn-replay").addEventListener("click", () => {
        this.restartFromProlog();
      });
      this.hud.querySelector("#swarm-btn-close").addEventListener("click", () => {
        this.stop();
      });
    }

    setCursorMode(cursor, mode, badgeText, statusText) {
      if (cursor.mode !== mode) {
        cursor.mode = mode;
        cursor.iconEl.innerHTML = getCursorSvg(mode, cursor.agent.color);
      }
      if (badgeText) cursor.badgeEl.textContent = badgeText;
      if (statusText) cursor.nameEl.textContent = statusText;
    }

    toggleHudVisibility() {
      this.hudHidden = !this.hudHidden;
      if (this.hud) this.hud.classList.toggle("is-hidden", this.hudHidden);
    }

    toggleGhostMode() {
      this.ghostMode = !this.ghostMode;
      if (this.overlay) {
        this.overlay.classList.toggle("is-ghost-mode", this.ghostMode);
      }
      const btn = this.hud?.querySelector("#swarm-btn-ghost");
      if (btn) {
        btn.classList.toggle("is-active", this.ghostMode);
        btn.textContent = this.ghostMode ? "👻 Ghost: ON" : "👻 Ghost (C)";
      }
      if (this.termModePill) {
        this.termModePill.textContent = this.ghostMode ? "GHOST AUTO" : "8 AGENTS";
      }
      this.logTerminal(
        AGENTS[0],
        "MODE",
        this.ghostMode
          ? "cursorLayer.hide() -> Autonomous Self-Assembly Mode ON"
          : "cursorLayer.show() -> 8 Multiplayer AI Cursors ON"
      );
    }

    togglePause() {
      this.paused = !this.paused;
      const btn = this.hud?.querySelector("#swarm-btn-pause");
      if (btn) {
        btn.classList.toggle("is-active", this.paused);
        btn.textContent = this.paused ? "▶️" : "⏸️";
      }
      this.logTerminal(
        AGENTS[0],
        this.paused ? "PAUSE" : "RESUME",
        this.paused ? "Timeline paused (Press Space to resume)" : "Timeline resumed"
      );
    }

    toggleTerminal() {
      this.terminalVisible = !this.terminalVisible;
      if (this.terminalEl) {
        this.terminalEl.classList.toggle("is-hidden", !this.terminalVisible);
      }
      const btn = this.hud?.querySelector("#swarm-btn-term");
      if (btn) {
        btn.classList.toggle("is-active", this.terminalVisible);
      }
    }

    logTerminal(agent, badge, codeText) {
      if (!this.termLinesEl || !this.termCmdEl) return;
      const color = (agent && agent.color) || "#10b981";
      const line = document.createElement("div");
      line.className = "swarm-term-line";
      const safeCode = String(codeText || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      line.innerHTML = `<span class="t-badge" style="background:${color}">${badge}</span><span class="t-code">${safeCode}</span>`;
      this.termLinesEl.appendChild(line);
      while (this.termLinesEl.children.length > 4) {
        this.termLinesEl.firstChild.remove();
      }
      this.termCmdEl.textContent = `> ${agent ? agent.name : "Agent"}: ${codeText}`;
    }

    cycleTheme() {
      const themes = [
        { id: "figma", label: "🎨 Figma" },
        { id: "architect", label: "📐 Blueprint" },
        { id: "cyberpunk", label: "⚡ Cyber" },
      ];
      const curIdx = themes.findIndex((t) => t.id === this.theme);
      const next = themes[(curIdx + 1) % themes.length];
      this.theme = next.id;
      if (this.overlay) {
        this.overlay.dataset.theme = this.theme;
      }
      const btn = this.hud?.querySelector("#swarm-btn-theme");
      if (btn) {
        btn.textContent = next.label;
        btn.classList.toggle("is-active", this.theme !== "figma");
      }
      this.logTerminal(AGENTS[2], "THEME", `stage.setBlueprintTheme("${this.theme}")`);
    }

    enableSectionPicker() {
      if (this.pickerActive) return;
      this.pickerActive = true;
      this.paused = true;
      const btn = this.hud?.querySelector("#swarm-btn-pick");
      if (btn) btn.classList.add("is-active");
      this.updateHudStatus(
        `<strong>🎯 Mode Pilih Bagian</strong> · Klik kartu atau seksi mana pun untuk dirakit ulang!`,
        100
      );
      this.logTerminal(AGENTS[0], "PICK", "Hover & click any DOM container to rebuild it from scratch");
      window.addEventListener("mousemove", this.onPickerMove, true);
      window.addEventListener("click", this.onPickerClick, true);
    }

    disableSectionPicker() {
      if (!this.pickerActive) return;
      this.pickerActive = false;
      this.hoveredPickEl = null;
      if (this.pickerBox) this.pickerBox.classList.remove("is-active");
      const btn = this.hud?.querySelector("#swarm-btn-pick");
      if (btn) btn.classList.remove("is-active");
      window.removeEventListener("mousemove", this.onPickerMove, true);
      window.removeEventListener("click", this.onPickerClick, true);
    }

    onPickerMove(e) {
      if (!this.pickerActive) return;
      const target = e.target;
      if (!target || this.isIgnoredSubtree(target)) {
        if (this.pickerBox) this.pickerBox.classList.remove("is-active");
        return;
      }
      const pickSel =
        ".mission-card-3d, .skill-card, .rpg-status-card, .vn-card, .vn-dialog-bubble, .timeline-node, .contact-letter-card, .ofuda-wall-panel, .epilog-box, #vibe-pass-card, .story-scene, section, article, form, header, [class*='card'], [class*='box'], [class*='panel']";
      const cand = target.closest(pickSel) || target;
      if (cand && cand !== document.body && cand !== document.documentElement) {
        this.hoveredPickEl = cand;
        const r = cand.getBoundingClientRect();
        this.pickerBox.classList.add("is-active");
        this.pickerBox.style.left = `${r.left.toFixed(1)}px`;
        this.pickerBox.style.top = `${r.top.toFixed(1)}px`;
        this.pickerBox.style.width = `${r.width.toFixed(1)}px`;
        this.pickerBox.style.height = `${r.height.toFixed(1)}px`;
        const tag = this.pickerBox.querySelector("#swarm-picker-tag");
        if (tag) {
          const name = cand.id
            ? `#${cand.id}`
            : cand.className && typeof cand.className === "string"
            ? `.${cand.className.trim().split(/\s+/)[0]}`
            : cand.tagName.toLowerCase();
          tag.textContent = `🎯 Rakit Ulang: ${name} (${Math.round(r.width)}×${Math.round(r.height)})`;
        }
      }
    }

    async onPickerClick(e) {
      if (!this.pickerActive) return;
      if (this.hud && this.hud.contains(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      const targetEl = this.hoveredPickEl || e.target;
      this.disableSectionPicker();
      if (targetEl && targetEl !== document.body) {
        await this.rebuildSpecificElement(targetEl);
      }
    }

    async rebuildSpecificElement(targetEl) {
      this.aborted = true;
      this.paused = false;
      await new Promise((r) => setTimeout(r, 80));
      this.restoreAllModifiedElements();
      this.clearActiveArtifacts();

      this.aborted = false;
      this.overlay.classList.add("is-building");

      if (targetEl.matches && targetEl.matches(".story-scene[id]")) {
        const scenes = this.getOrderedScenes();
        const idx = Math.max(0, scenes.indexOf(targetEl));
        await this.buildSceneGranular(targetEl, idx === 0, idx, Math.max(1, scenes.length));
      } else {
        this.prepareScopeForScratchBuild(targetEl);
        const mediaEls = Array.from(targetEl.querySelectorAll("img, video, canvas, svg")).filter(
          (m) => m.getBoundingClientRect().width >= 28
        );
        const subCards = Array.from(
          targetEl.querySelectorAll(".skill-card, .mission-card-3d, .timeline-node")
        );
        const containers = subCards.length > 0 ? subCards : [targetEl];
        containers.forEach((c) => this.hideElementForBuild(c));
        mediaEls.forEach((m) => this.hideElementForBuild(m));

        this.updateHudStatus(`<strong>🎯 Rakit Bagian</strong> · Merakit Komponen Terpilih...`, 50);
        await this.ensureElementsInView(targetEl, 110, 0.22);
        await this.buildWaveWithAllCursors({
          sceneEl: targetEl,
          containers,
          mediaEls: mediaEls.slice(0, 4),
          scopes: [targetEl],
          label: "Picked Component",
        });
        this.releaseSceneElements(targetEl);
      }

      if (this.running && !this.aborted) {
        this.sound.playSceneChime();
        this.overlay.classList.remove("is-building");
        this.updateHudStatus(`<strong>✓ Selesai</strong> · Bagian Terpilih Terbangun`, 100);
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
          setTimeout(() => this.stopVideoRecordingAndSave(), 600);
        }
      }
    }

    async toggleVideoRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        this.stopVideoRecordingAndSave();
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            frameRate: { ideal: 60, max: 60 },
            displaySurface: "browser",
          },
          audio: true,
          preferCurrentTab: true,
        });
        this.mediaStream = stream;
        this.recordedChunks = [];
        const mimeTypes = [
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ];
        const mimeType = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || "";
        this.mediaRecorder = new MediaRecorder(stream, {
          ...(mimeType ? { mimeType } : {}),
          videoBitsPerSecond: 12000000,
        });
        this.mediaRecorder.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) {
            this.recordedChunks.push(ev.data);
          }
        };
        this.mediaRecorder.onstop = () => {
          this.saveRecordedBlob();
        };
        stream.getVideoTracks()[0].addEventListener("ended", () => {
          if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
            this.mediaRecorder.stop();
          }
        });

        this.mediaRecorder.start(200);
        const btn = this.hud?.querySelector("#swarm-btn-record");
        if (btn) {
          btn.classList.add("is-recording");
          btn.textContent = "⏹ Stop (V)";
        }
        this.logTerminal(AGENTS[0], "REC", "Recording 60FPS WebM stream -> Auto-saving on finish");
        // Hide bottom HUD bar for a clean video and restart from Prolog
        if (!this.hudHidden) {
          this.toggleHudVisibility();
        }
        await this.restartFromProlog();
      } catch (err) {
        this.logTerminal(AGENTS[0], "REC", "Screen capture cancelled or unavailable");
      }
    }

    stopVideoRecordingAndSave() {
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        this.mediaRecorder.stop();
      }
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((t) => t.stop());
        this.mediaStream = null;
      }
      const btn = this.hud?.querySelector("#swarm-btn-record");
      if (btn) {
        btn.classList.remove("is-recording");
        btn.textContent = "🔴 Video (V)";
      }
      if (this.hudHidden && this.hud) {
        this.toggleHudVisibility();
      }
    }

    saveRecordedBlob() {
      if (!this.recordedChunks || this.recordedChunks.length === 0) return;
      const blob = new Blob(this.recordedChunks, { type: "video/webm" });
      this.recordedChunks = [];
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `rebuildr-showcase-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 2000);
      this.logTerminal(AGENTS[0], "SAVED", "Video exported to Downloads!");
    }

    onKeyDown(e) {
      if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        if (e.key === "Escape") {
          e.preventDefault();
          this.stop();
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (this.pickerActive) {
          this.disableSectionPicker();
          this.paused = false;
        } else {
          this.stop();
        }
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        this.togglePause();
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        this.toggleGhostMode();
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        this.toggleTerminal();
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        this.cycleTheme();
      } else if (e.key === "s" || e.key === "S") {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        if (this.pickerActive) this.disableSectionPicker();
        else this.enableSectionPicker();
      } else if (e.key === "v" || e.key === "V") {
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        this.toggleVideoRecording();
      } else if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        this.toggleHudVisibility();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        this.restartFromProlog();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        this.sound.muted = !this.sound.muted;
        const btn = this.hud?.querySelector("#swarm-btn-mute");
        if (btn) btn.textContent = this.sound.muted ? "🔇" : "🔊";
      } else if (["1", "2", "3"].includes(e.key)) {
        e.preventDefault();
        this.speed = Number(e.key);
        const btn = this.hud?.querySelector("#swarm-btn-speed");
        if (btn) btn.textContent = `${this.speed}×`;
      }
    }

    updateCursors(dt, now) {
      const stiffness = 18;
      const damping = 0.75;
      for (const c of this.cursors) {
        let targetX = c.tx;
        let targetY = c.ty;
        if (!c.busy) {
          targetX += Math.sin(now * 0.0022 + c.seed) * 16;
          targetY += Math.cos(now * 0.0018 + c.seed) * 12;
        }
        const ax = (targetX - c.x) * stiffness;
        const ay = (targetY - c.y) * stiffness;
        c.vx = (c.vx + ax * dt) * damping;
        c.vy = (c.vy + ay * dt) * damping;
        c.x += c.vx * dt * 13;
        c.y += c.vy * dt * 13;

        const tilt = c.mode === "ibeam" ? 0 : Math.max(-14, Math.min(14, c.vx * 0.07));
        c.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg)`;
      }
    }

    async sleep(ms) {
      const scaled = Math.max(6, ms / this.speed);
      let elapsed = 0;
      const step = 16;
      while (elapsed < scaled && this.running && !this.aborted) {
        if (!this.paused) {
          elapsed += step;
        }
        await new Promise((r) => setTimeout(r, Math.min(step, Math.max(4, scaled - elapsed + 4))));
      }
    }

    updateHudStatus(stageLabel, pct) {
      if (this.statusEl) {
        this.statusEl.innerHTML = stageLabel;
      }
      if (this.barEl && typeof pct === "number") {
        this.barEl.style.width = `${Math.min(100, Math.max(4, pct))}%`;
      }
    }

    // -------------------------------------------------------------------------
    // 6. GRANULAR PRIMITIVES
    // -------------------------------------------------------------------------
    hideElementForBuild(el) {
      if (!el) return;
      el.classList.remove("swarm-wireframe-shell", "swarm-glass-filling", "swarm-scan-reveal", "swarm-releasing");
      el.classList.add("swarm-hidden");
      this.modifiedElements.add(el);
    }

    releaseElementToNative(el) {
      if (!el) return;
      el.classList.remove("swarm-hidden", "swarm-wireframe-shell", "swarm-glass-filling", "swarm-scan-reveal");
      el.style.removeProperty("--swarm-clip");
      el.style.removeProperty("--swarm-shell-color");
      el.classList.add("swarm-releasing");
      setTimeout(() => {
        el.classList.remove("swarm-releasing");
      }, 360);
    }

    // PRIMITIVE A: Draw Low-Poly Triangulated Mesh on Blank Canvas -> Scanline Shader Reveal
    async buildPolygonMeshElement(el, cursorsToUse, label = "Polygon Mesh · 2.5D", isCharacter = false) {
      if (!this.running || this.aborted || !el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 16 || rect.height < 16) {
        this.releaseElementToNative(el);
        return;
      }

      // Ensure element is hidden while its polygon wireframe is being sketched!
      this.hideElementForBuild(el);

      const normPts = isCharacter ? CHARACTER_POLYGON_PTS : RECT_POLYGON_PTS;
      const tris = isCharacter ? CHARACTER_TRIANGLES : RECT_TRIANGLES;

      const pts = normPts.map(([nx, ny]) => [
        rect.left + rect.width * nx,
        rect.top + rect.height * ny,
      ]);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      this.svgLayer.appendChild(g);
      this.activeArtifacts.add(g);

      const pool = cursorsToUse && cursorsToUse.length > 0 ? cursorsToUse : [this.cursors[0]];
      pool.forEach((c) => {
        c.busy = true;
      });
      const primaryCursor = pool[0];
      const secondaryCursor = pool[1] || pool[0];

      const color1 = primaryCursor.agent.color;
      const color2 = secondaryCursor.agent.color;

      pool.forEach((c, idx) => {
        this.setCursorMode(
          c,
          "pen",
          idx === 0 ? "PEN" : "MESH",
          `${c.agent.name} · ${idx === 0 ? label : "Poligon"}`
        );
      });

      const frame = this.createSelectionFrame(rect, color1, label, true);
      this.logTerminal(
        primaryCursor.agent,
        "MESH",
        `<svg mesh="${label}" vertices="${pts.length}" triangles="${tris.length}" />`
      );

      // Step 1: Click vertices one-by-one & triangulate low-poly wireframe mesh on blank stage
      const drawnVertices = [];
      const vertexStepMs = isCharacter ? 68 : 46;

      for (let i = 0; i < pts.length; i++) {
        if (!this.running || this.aborted) break;
        const [px, py] = pts[i];
        const activeC = pool[i % pool.length];
        activeC.tx = px;
        activeC.ty = py;
        // Also move other cursors in the pool toward upcoming vertices so all cursors in the pool are visibly active!
        for (let k = 1; k < pool.length; k++) {
          const nextPt = pts[(i + k) % pts.length];
          const otherC = pool[(i + k) % pool.length];
          if (otherC !== activeC && nextPt) {
            otherC.tx = nextPt[0];
            otherC.ty = nextPt[1];
          }
        }

        await this.sleep(vertexStepMs);
        if (!this.running || this.aborted) break;

        activeC.el.classList.add("is-clicking");
        this.sound.playVertex(i);

        // Draw connecting construction line from previous vertex
        if (i > 0) {
          const [prevX, prevY] = pts[i - 1];
          const edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
          edge.setAttribute("x1", prevX.toFixed(1));
          edge.setAttribute("y1", prevY.toFixed(1));
          edge.setAttribute("x2", px.toFixed(1));
          edge.setAttribute("y2", py.toFixed(1));
          edge.setAttribute("stroke", color2);
          edge.setAttribute("stroke-width", "1.4");
          edge.setAttribute("stroke-dasharray", "4 3");
          edge.setAttribute("opacity", "0.75");
          g.appendChild(edge);
        }

        // Draw vertex anchor handle (`□`) + coordinate label on key vertices
        const vNode = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        vNode.setAttribute("x", (px - 4).toFixed(1));
        vNode.setAttribute("y", (py - 4).toFixed(1));
        vNode.setAttribute("width", "8");
        vNode.setAttribute("height", "8");
        vNode.setAttribute("rx", "1.5");
        vNode.setAttribute("fill", "#ffffff");
        vNode.setAttribute("stroke", activeC.agent.color);
        vNode.setAttribute("stroke-width", "2");
        g.appendChild(vNode);

        if (isCharacter && i % 3 === 0) {
          const vTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
          vTxt.setAttribute("x", (px + 8).toFixed(1));
          vTxt.setAttribute("y", (py + 3).toFixed(1));
          vTxt.setAttribute("fill", activeC.agent.color);
          vTxt.setAttribute("font-size", "9.5");
          vTxt.setAttribute("font-family", "JetBrains Mono, monospace");
          vTxt.setAttribute("font-weight", "700");
          vTxt.textContent = `v${i}(${Math.round(px)},${Math.round(py)})`;
          g.appendChild(vTxt);
        }

        drawnVertices.push(i);

        // Draw completed low-poly triangles
        for (const [a, b, c] of tris) {
          if (
            drawnVertices.includes(a) &&
            drawnVertices.includes(b) &&
            drawnVertices.includes(c) &&
            (a === i || b === i || c === i)
          ) {
            const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            const pStr = `${pts[a][0].toFixed(1)},${pts[a][1].toFixed(1)} ${pts[b][0].toFixed(1)},${pts[b][1].toFixed(1)} ${pts[c][0].toFixed(1)},${pts[c][1].toFixed(1)}`;
            poly.setAttribute("points", pStr);
            poly.setAttribute("fill", (a + b + c) % 2 === 0 ? `${color1}24` : `${color2}22`);
            poly.setAttribute("stroke", (a + b) % 2 === 0 ? color1 : color2);
            poly.setAttribute("stroke-width", "1.4");
            g.insertBefore(poly, g.firstChild);
          }
        }

        setTimeout(() => activeC.el.classList.remove("is-clicking"), 55);
      }

      // Brief pause so viewer admires the completed low-poly wireframe mesh before shader sweep
      await this.sleep(isCharacter ? 280 : 120);

      // Step 2: Laser Scanline Shader Pass (Reveals real artwork top-to-bottom beneath polygon mesh!)
      if (this.running && !this.aborted) {
        this.setCursorMode(primaryCursor, "pointer", "SHADER", `${primaryCursor.agent.name} · Render Shader`);
        this.revealAncestorsForTyping(el, document.body);
        el.style.setProperty("--swarm-clip", "inset(0 0 100% 0)");
        el.classList.remove("swarm-hidden");
        el.classList.add("swarm-scan-reveal");

        const scanLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        scanLine.setAttribute("x1", rect.left.toFixed(1));
        scanLine.setAttribute("x2", rect.right.toFixed(1));
        scanLine.setAttribute("stroke", "#10b981");
        scanLine.setAttribute("stroke-width", "3");
        g.appendChild(scanLine);

        const sweepDuration = (isCharacter ? 920 : 420) / this.speed;
        const t0 = performance.now();
        await new Promise((resolve) => {
          const step = (now) => {
            if (!this.running || this.aborted) return resolve();
            const p = Math.min(1, (now - t0) / sweepDuration);
            const ease = 1 - Math.pow(1 - p, 2.2);
            const bottomInset = ((1 - ease) * 100).toFixed(1);
            el.style.setProperty("--swarm-clip", `inset(0 0 ${bottomInset}% 0)`);

            const scanY = rect.top + rect.height * ease;
            scanLine.setAttribute("y1", scanY.toFixed(1));
            scanLine.setAttribute("y2", scanY.toFixed(1));
            g.style.opacity = (1 - ease * 0.65).toFixed(2);

            pool.forEach((c, idx) => {
              const ratio = pool.length === 1 ? 0.5 : 0.2 + (idx / (pool.length - 1)) * 0.6;
              c.tx = rect.left + rect.width * ratio;
              c.ty = scanY;
            });

            if (p < 1) requestAnimationFrame(step);
            else resolve();
          };
          requestAnimationFrame(step);
        });

        this.sound.playSnap(1.2);
      }

      this.releaseElementToNative(el);
      this.removeArtifact(g);
      this.finishSelectionFrame(frame);

      pool.forEach((c) => {
        this.setCursorMode(c, "pointer", c.agent.role, c.agent.name);
        c.busy = false;
      });
    }

    // PRIMITIVE B: Drag Empty Dashed Blueprint Shell -> Apply Glassmorphism Fill
    async buildWireframeShell(el, cursor, label = "Wireframe · Container") {
      if (!this.running || this.aborted || !el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) {
        this.releaseElementToNative(el);
        return;
      }

      cursor.busy = true;
      this.setCursorMode(cursor, "pointer", "FRAME", `${cursor.agent.name} · ${label}`);

      cursor.tx = Math.max(20, rect.left + 8);
      cursor.ty = Math.max(20, rect.top + 8);
      await this.sleep(150);
      if (!this.running || this.aborted) {
        cursor.busy = false;
        return;
      }

      const frame = this.createSelectionFrame(rect, cursor.agent.color, label, true);
      const dimEl = frame.querySelector(".swarm-frame-dim");
      cursor.el.classList.add("is-clicking");
      this.sound.playSnap(0.92);
      this.logTerminal(
        cursor.agent,
        "WIRE",
        `layout.box("<${el.tagName.toLowerCase()}>", "${Math.round(rect.width)}×${Math.round(rect.height)}px")`
      );

      const dragMs = 280 / this.speed;
      const t0 = performance.now();
      await new Promise((resolve) => {
        const step = (now) => {
          if (!this.running || this.aborted) return resolve();
          const p = Math.min(1, (now - t0) / dragMs);
          const ease = 1 - Math.pow(1 - p, 3);
          const curW = Math.max(20, rect.width * (0.12 + 0.88 * ease));
          const curH = Math.max(16, rect.height * (0.12 + 0.88 * ease));
          frame.style.width = `${curW.toFixed(1)}px`;
          frame.style.height = `${curH.toFixed(1)}px`;
          if (dimEl) dimEl.textContent = `${Math.round(curW)} × ${Math.round(curH)}`;

          cursor.tx = Math.min(window.innerWidth - 24, rect.left + curW);
          cursor.ty = Math.min(window.innerHeight - 24, rect.top + curH);
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

      cursor.el.classList.remove("is-clicking");

      // Show empty dashed wireframe box in the real DOM first
      el.style.setProperty("--swarm-shell-color", cursor.agent.color);
      el.classList.remove("swarm-hidden");
      el.classList.add("swarm-wireframe-shell");
      await this.sleep(150);

      // Click to inject Glassmorphism Shader Fill
      this.setCursorMode(cursor, "pointer", "GLASS", `${cursor.agent.name} · Glass Fill`);
      cursor.tx = rect.left + rect.width * 0.5;
      cursor.ty = rect.top + Math.min(28, rect.height * 0.3);
      await this.sleep(100);
      cursor.el.classList.add("is-clicking");
      this.sound.playSnap(1.15);

      el.classList.remove("swarm-wireframe-shell");
      el.classList.add("swarm-glass-filling");
      frame.classList.remove("is-dashed");
      await this.sleep(120);

      cursor.el.classList.remove("is-clicking");
      this.releaseElementToNative(el);
      this.finishSelectionFrame(frame);
      this.setCursorMode(cursor, "pointer", cursor.agent.role, cursor.agent.name);
      cursor.busy = false;
    }

    // Helper: Active Corner/Layout Assist so unassigned cursors during structural phase actively align the box
    async assistContainerFrame(el, cursor, cornerIdx = 0) {
      if (!this.running || this.aborted || !el || !cursor) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;

      cursor.busy = true;
      const roles = ["ALIGN", "LAYOUT", "ANCHOR", "GRID"];
      const badge = roles[cornerIdx % roles.length];
      this.setCursorMode(cursor, "pointer", badge, `${cursor.agent.name} · ${badge} Lock`);

      const corners = [
        [rect.right - 6, rect.top + 6],
        [rect.left + 6, rect.bottom - 6],
        [rect.right - 6, rect.bottom - 6],
        [rect.left + rect.width * 0.5, rect.top + 6],
        [rect.left + rect.width * 0.5, rect.bottom - 6],
      ];

      for (let step = 0; step < 3; step++) {
        if (!this.running || this.aborted) break;
        const [cx, cy] = corners[(cornerIdx + step) % corners.length];
        cursor.tx = Math.max(16, Math.min(window.innerWidth - 20, cx));
        cursor.ty = Math.max(16, Math.min(window.innerHeight - 20, cy));
        await this.sleep(135);
        if (!this.running || this.aborted) break;
        cursor.el.classList.add("is-clicking");
        this.sound.playSnap(1.0 + step * 0.08);
        await this.sleep(45);
        cursor.el.classList.remove("is-clicking");
      }

      this.setCursorMode(cursor, "pointer", cursor.agent.role, cursor.agent.name);
      cursor.busy = false;
    }

    // -------------------------------------------------------------------------
    // 6B. COMPLETE ALL-TEXT EXTRACTION & MULTI-CURSOR WORK-STEALING ENGINE
    //     Guarantees 100% of text is typed manually & all 8 cursors work nonstop
    // -------------------------------------------------------------------------
    splitTextIntoChunks(str, maxLen = 56) {
      const result = [];
      let rem = str;
      while (rem.length > maxLen) {
        let cut = -1;
        // Prefer splitting after punctuation or spaces near maxLen
        const searchEnd = Math.min(rem.length, maxLen + 14);
        const searchStart = Math.max(18, maxLen - 18);
        for (let i = searchEnd; i >= searchStart; i--) {
          const ch = rem[i - 1];
          if (ch === "." || ch === "," || ch === ";" || ch === "!" || ch === "?" || ch === "•") {
            cut = i;
            break;
          }
        }
        if (cut === -1) {
          for (let i = searchEnd; i >= searchStart; i--) {
            if (/\s/.test(rem[i - 1])) {
              cut = i;
              break;
            }
          }
        }
        if (cut === -1) cut = maxLen;
        result.push(rem.slice(0, cut));
        rem = rem.slice(cut);
      }
      if (rem.length > 0) result.push(rem);
      return result;
    }

    isIgnoredSubtree(node) {
      if (!node) return true;
      const el = node.nodeType === 1 ? node : node.parentElement;
      if (!el) return true;
      if (el.closest("script, style, svg, .card-back, #swarm-studio-overlay, #swarm-studio-hud, .eye-calibration-overlay, .eye-debug-boxes, .character-zzz-floating, #rpg-radar-panel, #rpg-project-bridge, .lofi-radio-drawer, .mobile-nav-drawer, #hidden-secret-trigger")) {
        return true;
      }
      return false;
    }

    // Pre-process an entire scene or container so 100% of text nodes start empty ("")
    prepareScopeForScratchBuild(rootEl) {
      if (!rootEl) return [];
      if (this.sceneUnitsMap.has(rootEl)) {
        const existing = this.sceneUnitsMap.get(rootEl);
        if (existing && existing.length > 0) return existing;
      }

      // Special case for Bab 2 (Who Am I): ensure native typewriter text & choices are ready before capture
      if (rootEl.id === "scene-whoami") {
        const dlg = document.getElementById("whoami-dialog-text");
        if (dlg && (!dlg.textContent || dlg.textContent.trim().length < 40)) {
          dlg.textContent =
            "Aku Yusuf, lulusan Statistika (S.Stat) yang merangkai analisis data, estetika WebGL 3D, dan kecerdasan AI menjadi pengalaman web interaktif.";
        }
        const choices = document.getElementById("whoami-choices");
        if (choices) choices.classList.add("visible");
      }

      // 1. Walk 100% of visible text nodes inside rootEl and group into cohesive left-to-right TextUnits
      const UNIT_SEL =
        "h1, h2, h3, h4, p, label, a, button:not(.skill-card), strong, .scene-watermark, .chapter-badge, .vn-speaker-tag, .vn-expr-pill, .vn-guide-hint, .vn-step-badge, .vn-next-prompt, .rpg-badge, .rpg-tab-btn, .rpg-meta-row, .rpg-comment-box, .skill-category-title, .skill-category-sub, .skill-name, .skill-level-badge, .skill-desc, .persona-switch-label, .spectator-name, .spectator-status-pill, .mission-badge-code, .mission-badge-cat, .video-indicator-badge, .creative-duration-pill, .tag-pill, .timeline-station-code, .timeline-year, .timeline-badge-pill, .timeline-org, .timeline-station-sub, .loot-title, .metro-dot, .thought-text, .hanko-title, .ofuda-note, .epilog-ach-chip, .pass-airline, .pass-serial, .station-code, .station-city, .pass-info-cell, .pass-hint, .barcode-text, .pass-stamp-seal, .mood-pill-label, .lofi-live-badge, .lofi-channel-name";

      const PILL_BOX_SEL =
        "a, button:not(.skill-card), input, textarea, .chapter-badge, .vn-speaker-tag, .vn-expr-pill, .vn-step-badge, .rpg-badge, .rpg-tab-btn, .rpg-meta-row, .rpg-comment-box, .skill-level-badge, .mission-badge-code, .mission-badge-cat, .video-indicator-badge, .creative-duration-pill, .tag-pill, .timeline-station-code, .timeline-year, .timeline-badge-pill, .timeline-loot-box, .metro-dot, .social-pill, .hanko-chip, .ofuda-note, .epilog-ach-chip, .pass-info-cell, .pass-stamp-seal, .mood-pill-label, .lofi-radio-pill";

      const unitMap = new Map();
      const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (this.isIgnoredSubtree(n)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      let n;
      while ((n = walker.nextNode())) {
        const orig = n.nodeValue;
        if (!this.savedTextNodes.has(n)) {
          this.savedTextNodes.set(n, orig);
        }
        const cand = n.parentElement ? n.parentElement.closest(UNIT_SEL) : null;
        const unitEl =
          cand && rootEl.contains(cand) && cand !== rootEl
            ? cand
            : n.parentElement || rootEl;

        if (!unitMap.has(unitEl)) {
          const isPill = unitEl.matches && unitEl.matches(PILL_BOX_SEL);
          if (isPill) {
            this.hideElementForBuild(unitEl);
          }
          unitMap.set(unitEl, {
            el: unitEl,
            entries: [],
            placeholderText: null,
            isPill,
            typed: false,
            summary: orig.trim().slice(0, 22),
          });
        }
        unitMap.get(unitEl).entries.push({ node: n, fullText: orig });
        // Immediately empty the text node so NO text ever appears automatically!
        n.nodeValue = "";
      }

      // 3. Also capture <input> and <textarea> placeholders so even form placeholders are typed manually!
      rootEl.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((inp) => {
        if (this.isIgnoredSubtree(inp)) return;
        const ph = inp.getAttribute("placeholder");
        if (ph && ph.trim().length > 0) {
          if (!this.savedPlaceholders.has(inp)) {
            this.savedPlaceholders.set(inp, ph);
          }
          inp.setAttribute("placeholder", "");
          this.hideElementForBuild(inp);
          unitMap.set(inp, {
            el: inp,
            entries: [],
            placeholderText: ph,
            isPill: true,
            typed: false,
            summary: ph.trim().slice(0, 22),
          });
        }
      });

      const units = Array.from(unitMap.values());
      this.sceneUnitsMap.set(rootEl, units);
      return units;
    }

    revealAncestorsForTyping(el, stopAt) {
      let cur = el;
      while (cur && cur !== stopAt && cur !== document.body) {
        if (cur.classList && cur.classList.contains("swarm-hidden") && !cur.classList.contains("card-back")) {
          cur.classList.remove("swarm-hidden");
        }
        cur = cur.parentElement;
      }
    }

    async typeUnitLive(unit, cursor, sceneEl) {
      if (!this.running || this.aborted || !unit || unit.typed) return;
      unit.typed = true;

      const el = unit.el;
      this.revealAncestorsForTyping(el, sceneEl);

      cursor.busy = true;
      const shortDesc = unit.summary || "Teks";

      // If this unit is a boxed sub-component (button, pill, badge, input, quote box, ofuda card, etc.),
      // first reveal it as a dashed wireframe blueprint shell while typing its text, then snap to native style after!
      let pillFrame = null;
      if (unit.isPill && el && el.classList) {
        el.style.setProperty("--swarm-shell-color", cursor.agent.color);
        el.classList.remove("swarm-hidden");
        el.classList.add("swarm-wireframe-shell");
        const pr = el.getBoundingClientRect();
        if (pr.width >= 20 && pr.height >= 14) {
          pillFrame = this.createSelectionFrame(
            pr,
            cursor.agent.color,
            `${cursor.agent.name} · UI Box`,
            true
          );
          cursor.tx = pr.left + Math.min(18, pr.width * 0.25);
          cursor.ty = pr.top + pr.height * 0.5;
          this.sound.playTick();
          await this.sleep(75);
        }
      } else {
        this.releaseElementToNative(el);
      }

      this.setCursorMode(cursor, "ibeam", "TYPE", `${cursor.agent.name} · "${shortDesc}"`);
      this.logTerminal(
        cursor.agent,
        unit.isPill ? "UI·BOX" : "TYPE",
        `dom.type("${shortDesc.replace(/"/g, "'")}")`
      );

      // Case A: Form <input> / <textarea> placeholder typing
      if (unit.placeholderText) {
        const r = el.getBoundingClientRect();
        const ph = unit.placeholderText;
        let curStr = "";
        for (let i = 0; i < ph.length; i++) {
          if (!this.running || this.aborted) break;
          curStr = ph.slice(0, i + 1);
          el.setAttribute("placeholder", curStr);
          if (r.width > 0) {
            cursor.tx = r.left + Math.min(r.width - 12, 14 + i * 6.2);
            cursor.ty = r.top + Math.min(22, r.height * 0.5);
          }
          this.sound.playKey();
          await this.sleep(34);
        }
        el.setAttribute("placeholder", ph);
        this.savedPlaceholders.delete(el);
        if (pillFrame) this.finishSelectionFrame(pillFrame);
        this.releaseElementToNative(el);
        this.sound.playSnap(1.12);
        this.setCursorMode(cursor, "pointer", cursor.agent.role, cursor.agent.name);
        cursor.busy = false;
        return;
      }

      // Case B: DOM TextNodes with live inline blinking caret
      const caret = document.createElement("span");
      caret.className = "swarm-live-caret";
      caret.style.setProperty("--caret-color", cursor.agent.color);
      this.activeArtifacts.add(caret);

      for (const item of unit.entries) {
        if (!this.running || this.aborted) break;
        let { node, fullText } = item;
        // If host page scripts replaced el.textContent after pre-hide, re-bind a fresh text node inside el
        if (!node.parentNode && el) {
          el.textContent = "";
          node = document.createTextNode("");
          el.appendChild(node);
          item.node = node;
        }
        if (node.parentNode) {
          node.parentNode.insertBefore(caret, node.nextSibling);
        }

        // Character-by-character for headings, titles, badges & buttons (<= 48 chars);
        // single word-by-word for longer descriptions so every word is visibly typed!
        const isCharMode = fullText.length <= 48;
        const tokens = isCharMode ? fullText.split("") : fullText.split(/(\s+)/);

        let currentStr = "";
        for (let i = 0; i < tokens.length; i++) {
          if (!this.running || this.aborted) break;
          currentStr += tokens[i];
          node.nodeValue = currentStr;

          if (pillFrame && el) {
            const prNow = el.getBoundingClientRect();
            if (prNow.width > 0 && prNow.height > 0) {
              pillFrame.style.left = `${prNow.left.toFixed(1)}px`;
              pillFrame.style.top = `${prNow.top.toFixed(1)}px`;
              pillFrame.style.width = `${prNow.width.toFixed(1)}px`;
              pillFrame.style.height = `${prNow.height.toFixed(1)}px`;
              const dimEl = pillFrame.querySelector(".swarm-frame-dim");
              if (dimEl) {
                dimEl.textContent = `${Math.round(prNow.width)} × ${Math.round(prNow.height)}`;
              }
            }
          }

          const cr = caret.getBoundingClientRect();
          if (cr.width > 0 || cr.height > 0) {
            cursor.tx = cr.left + 2;
            cursor.ty = cr.top + cr.height * 0.5;
          } else {
            const er = el.getBoundingClientRect();
            if (er.width > 0) {
              cursor.tx = er.left + er.width * 0.5;
              cursor.ty = er.top + er.height * 0.5;
            }
          }

          if (tokens[i].trim().length > 0) {
            this.sound.playKey();
            const delayMs = isCharMode ? 38 : 58;
            await this.sleep(delayMs);
          }
        }
      }

      caret.remove();
      this.activeArtifacts.delete(caret);

      for (const item of unit.entries) {
        item.node.nodeValue = item.fullText;
        this.savedTextNodes.delete(item.node);
      }

      if (pillFrame) {
        this.finishSelectionFrame(pillFrame);
      }
      if (unit.isPill) {
        this.sound.playSnap(1.15);
        this.releaseElementToNative(el);
      }

      this.setCursorMode(cursor, "pointer", cursor.agent.role, cursor.agent.name);
      cursor.busy = false;
    }

    async dragSkillBarWithCursor(bar, cursor) {
      if (!this.running || this.aborted || !bar) return;
      const targetPct = parseFloat(bar.dataset.fill || "88");
      const track = bar.parentElement;
      if (!track) {
        bar.style.width = `${targetPct}%`;
        return;
      }
      const tr = track.getBoundingClientRect();
      cursor.busy = true;
      this.setCursorMode(cursor, "pointer", "DATA", `${cursor.agent.name} · Bar ${targetPct}%`);
      const dur = 240 / this.speed;
      const t0 = performance.now();
      await new Promise((resolve) => {
        const step = (now) => {
          if (!this.running || this.aborted) return resolve();
          const p = Math.min(1, (now - t0) / dur);
          const curPct = targetPct * p;
          bar.style.transition = "none";
          bar.style.width = `${curPct.toFixed(1)}%`;
          cursor.tx = tr.left + (tr.width * curPct) / 100;
          cursor.ty = tr.top + tr.height / 2;
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
      this.sound.playSnap(1.25);
      this.setCursorMode(cursor, "pointer", cursor.agent.role, cursor.agent.name);
      cursor.busy = false;
    }

    // Execute a synchronized wave where ALL 8 CURSORS work in parallel:
    // 1. Structural Wireframes + Polygon Media + Corner Alignment (All 8 Cursors)
    // 2. Shared Work-Stealing Queue of all TextUnits & Progress Bars (All 8 Cursors)
    async buildWaveWithAllCursors({
      sceneEl,
      containers = [],
      mediaEls = [],
      scopes = [],
      label = "Component",
    }) {
      if (!this.running || this.aborted) return;

      const validContainers = containers.filter(Boolean);
      const validMedia = mediaEls.filter((m) => m && m.getBoundingClientRect().width > 18);
      const validScopes = (scopes.length > 0 ? scopes : validContainers).filter(Boolean);

      // Hide media & progress bars inside scopes before revealing container shells
      for (const sc of validScopes) {
        sc.querySelectorAll(".skill-bar-fill").forEach((b) => {
          b.style.width = "0%";
        });
      }
      validMedia.forEach((m) => this.hideElementForBuild(m));

      const c = this.cursors;

      // PHASE 1A: All 8 cursors collaborate on Outer Container Wireframes + Corner Locks first!
      if (validContainers.length > 0) {
        const contPromises = [];
        let cursorIdx = 0;

        for (let i = 0; i < validContainers.length; i++) {
          const cont = validContainers[i];
          const assignedC = c[cursorIdx % c.length];
          cursorIdx++;
          contPromises.push(this.buildWireframeShell(cont, assignedC, `${label} #${i + 1}`));
        }

        while (cursorIdx < c.length) {
          const assistC = c[cursorIdx];
          const targetEl = validContainers[cursorIdx % validContainers.length];
          contPromises.push(this.assistContainerFrame(targetEl, assistC, cursorIdx));
          cursorIdx++;
        }

        await Promise.all(contPromises);
      }

      if (!this.running || this.aborted) return;

      // PHASE 1B: Now that parent containers are visible wireframe shells, triangulate & scanline-render Polygon Media inside them!
      if (validMedia.length > 0) {
        const medPromises = [];
        let cursorIdx = 0;
        const perMed = Math.max(1, Math.min(3, Math.floor(c.length / validMedia.length)));

        for (let i = 0; i < validMedia.length; i++) {
          const med = validMedia[i];
          const group = [];
          for (let g = 0; g < perMed && cursorIdx < c.length; g++) {
            group.push(c[cursorIdx % c.length]);
            cursorIdx++;
          }
          if (group.length === 0) {
            group.push(c[i % c.length]);
          }
          medPromises.push(this.buildPolygonMeshElement(med, group, "Polygon · Media", false));
        }

        while (cursorIdx < c.length) {
          const assistC = c[cursorIdx];
          const targetEl = validMedia[cursorIdx % validMedia.length];
          medPromises.push(this.assistContainerFrame(targetEl, assistC, cursorIdx));
          cursorIdx++;
        }

        await Promise.all(medPromises);
      }

      if (!this.running || this.aborted) return;

      // PHASE 2: Collect all untyped TextUnits & Skill Bars within `validScopes` and interleave across scopes
      // so the 8 cursors spread evenly across all cards/elements in the wave simultaneously!
      const allSceneUnits = this.sceneUnitsMap.get(sceneEl) || [];
      const buckets = validScopes.map((sc) =>
        allSceneUnits.filter((u) => !u.typed && (sc === u.el || sc.contains(u.el)))
      );
      const waveUnits = [];
      const seenUnits = new Set();
      let added = true;
      let depth = 0;
      while (added) {
        added = false;
        for (const b of buckets) {
          if (depth < b.length) {
            const cand = b[depth];
            if (!seenUnits.has(cand)) {
              seenUnits.add(cand);
              waveUnits.push(cand);
            }
            added = true;
          }
        }
        depth++;
      }

      const waveBars = [];
      for (const sc of validScopes) {
        sc.querySelectorAll(".skill-bar-fill").forEach((b) => waveBars.push(b));
      }

      if (waveUnits.length === 0 && waveBars.length === 0) return;

      let activeTypers = 0;
      const assistTargets = validScopes.filter((s) => s.getBoundingClientRect().width > 20);

      const workers = c.map(async (cursor, wIdx) => {
        while (this.running && !this.aborted) {
          if (waveUnits.length > 0) {
            const unit = waveUnits.shift();
            activeTypers++;
            try {
              await this.typeUnitLive(unit, cursor, sceneEl);
            } finally {
              activeTypers--;
            }
          } else if (waveBars.length > 0) {
            const bar = waveBars.shift();
            activeTypers++;
            try {
              await this.dragSkillBarWithCursor(bar, cursor);
            } finally {
              activeTypers--;
            }
          } else if (activeTypers > 0 && assistTargets.length > 0) {
            // While 1-2 other cursors finish the last words of this wave, actively align/inspect the cards!
            const target = assistTargets[wIdx % assistTargets.length];
            const r = target.getBoundingClientRect();
            cursor.busy = true;
            this.setCursorMode(cursor, "pointer", "INSPECT", `${cursor.agent.name} · Polish UI`);
            const pts = [
              [r.right - 10, r.top + 10],
              [r.left + 10, r.bottom - 10],
              [r.right - 10, r.bottom - 10],
              [r.left + r.width * 0.5, r.top + 8],
            ];
            const [px, py] = pts[Math.floor(performance.now() / 160 + wIdx) % pts.length];
            cursor.tx = Math.max(16, Math.min(window.innerWidth - 20, px));
            cursor.ty = Math.max(16, Math.min(window.innerHeight - 20, py));
            await this.sleep(95);
            cursor.busy = false;
          } else {
            break;
          }
        }
      });

      await Promise.all(workers);
    }

    createSelectionFrame(rect, color, tagText, dashed = false) {
      const frame = document.createElement("div");
      frame.className = `swarm-selection-frame ${dashed ? "is-dashed" : ""}`;
      frame.style.setProperty("--agent-color", color);
      frame.style.left = `${rect.left.toFixed(1)}px`;
      frame.style.top = `${rect.top.toFixed(1)}px`;
      frame.style.width = `${rect.width.toFixed(1)}px`;
      frame.style.height = `${rect.height.toFixed(1)}px`;

      ["tl", "tr", "bl", "br"].forEach((pos) => {
        const h = document.createElement("div");
        h.className = `swarm-handle ${pos}`;
        frame.appendChild(h);
      });

      const tag = document.createElement("div");
      tag.className = "swarm-frame-tag";
      tag.textContent = tagText;
      frame.appendChild(tag);

      const dim = document.createElement("div");
      dim.className = "swarm-frame-dim";
      dim.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
      frame.appendChild(dim);

      this.framesLayer.appendChild(frame);
      this.activeArtifacts.add(frame);
      return frame;
    }

    finishSelectionFrame(frame) {
      if (!frame) return;
      frame.classList.add("is-done");
      setTimeout(() => {
        this.removeArtifact(frame);
      }, 220);
    }

    removeArtifact(node) {
      if (!node) return;
      node.remove();
      this.activeArtifacts.delete(node);
    }

    // -------------------------------------------------------------------------
    // 7. SCENE-BY-SCENE GRANULAR ORCHESTRATION
    // -------------------------------------------------------------------------
    getOrderedScenes() {
      return Array.from(document.querySelectorAll(".story-scene[id]"));
    }

    getCurrentSceneIndex(scenes) {
      const activeId = document.body.dataset.scene;
      const idx = scenes.findIndex((s) => s.id === activeId);
      return idx >= 0 ? idx : 0;
    }

    getScroller() {
      const custom = document.getElementById("story-scroll-container");
      if (custom) return custom;
      return document.scrollingElement || document.documentElement || document.body;
    }

    async restartFromProlog() {
      this.aborted = true;
      await new Promise((r) => setTimeout(r, 90));
      this.restoreAllModifiedElements();
      this.clearActiveArtifacts();

      const scroller = this.getScroller();
      if (scroller) {
        scroller.scrollTo({ top: 0, behavior: "auto" });
      }
      window.scrollTo({ top: 0, behavior: "auto" });
      if (document.querySelector(".story-scene")) {
        document.body.dataset.scene = "scene-prolog";
      }
      await new Promise((r) => setTimeout(r, 120));

      this.aborted = false;
      this.runShowcaseFlow(0);
    }

    async runShowcaseFlow(forcedStartIndex = null) {
      const scenes = this.getOrderedScenes();
      if (scenes.length === 0) {
        await this.runUniversalWebsiteFlow();
        return;
      }

      const startIdx =
        forcedStartIndex !== null ? forcedStartIndex : this.getCurrentSceneIndex(scenes);

      // Pre-hide all upcoming scenes upfront so the next section never peeks in already-built at the bottom of the viewport!
      for (let j = startIdx + 1; j < scenes.length; j++) {
        this.preHideScene(scenes[j], false);
      }

      for (let i = startIdx; i < scenes.length; i++) {
        if (!this.running || this.aborted) return;
        const scene = scenes[i];
        const isFirstRun = i === startIdx;

        if (!isFirstRun) {
          await this.transitionToScene(scene, i, scenes.length);
          if (!this.running || this.aborted) return;
        }

        await this.buildSceneGranular(scene, isFirstRun, i, scenes.length);
        if (!this.running || this.aborted) return;

        this.sound.playSceneChime();

        if (!this.autoTour) break;

        this.overlay.classList.remove("is-building");
        await this.sleep(1400);
        this.overlay.classList.add("is-building");
      }

      if (this.running && !this.aborted) {
        this.restoreAllModifiedElements();
        this.clearActiveArtifacts();
        this.cursors.forEach((c) => {
          c.busy = false;
          this.setCursorMode(c, "pointer", c.agent.role, c.agent.name);
        });
        this.overlay.classList.remove("is-building");
        this.updateHudStatus(`<strong>✓ Selesai</strong> · Semua Bab Terbangun`, 100);
        this.logTerminal(AGENTS[0], "DONE", "All scenes reconstructed (100%)");
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
          setTimeout(() => this.stopVideoRecordingAndSave(), 800);
        }
      }
    }

    // -------------------------------------------------------------------------
    // 7B. UNIVERSAL WEBSITE REBUILD ENGINE (Works on ANY Website!)
    //     Scans DOM into top-to-bottom viewport rows, auto-scrolls, draws
    //     polygons on media, wireframes on cards, and types 100% of text!
    // -------------------------------------------------------------------------
    async runUniversalWebsiteFlow() {
      const scroller = this.getScroller();
      const getScrollY = () => (scroller === document.body || scroller === document.documentElement ? window.scrollY : scroller.scrollTop);

      // Scroll to top first so coordinates are measured cleanly
      window.scrollTo({ top: 0, behavior: "auto" });
      if (scroller) scroller.scrollTop = 0;
      await this.sleep(80);

      // 1. Empty 100% of text nodes & input placeholders across document.body
      const allUnits = this.prepareScopeForScratchBuild(document.body);

      // 2. Discover visible media (images, videos, canvases) and visual card/container boxes
      const scrollY0 = getScrollY();
      const mediaCandidates = Array.from(
        document.body.querySelectorAll("img, video, canvas, picture, figure svg")
      ).filter((el) => {
        if (this.isIgnoredSubtree(el)) return false;
        const r = el.getBoundingClientRect();
        return r.width >= 44 && r.height >= 36 && r.width <= window.innerWidth * 1.05;
      });

      const containerCandidates = Array.from(
        document.body.querySelectorAll(
          "header, nav, article, form, blockquote, .card, [class*='card'], [class*='box'], [class*='panel'], [class*='feature'], [class*='item'], [class*='bento'], section > div > div"
        )
      ).filter((el) => {
        if (this.isIgnoredSubtree(el)) return false;
        const r = el.getBoundingClientRect();
        return r.width >= 90 && r.height >= 42 && r.height <= window.innerHeight * 0.92;
      });

      // Keep only leaf-most visual containers so we don't double-frame outer & inner wrappers
      const leafContainers = containerCandidates.filter(
        (c) => !containerCandidates.some((other) => other !== c && c.contains(other))
      );

      // Hide all discovered media & containers upfront
      mediaCandidates.forEach((m) => this.hideElementForBuild(m));
      leafContainers.forEach((c) => this.hideElementForBuild(c));

      // 3. Partition the entire page into horizontal Y-bands (~340px tall) from top to bottom
      const bandHeight = 340;
      const bandMap = new Map();
      const ensureBand = (y) => {
        const idx = Math.max(0, Math.floor(y / bandHeight));
        if (!bandMap.has(idx)) {
          bandMap.set(idx, { idx, containers: [], mediaEls: [], scopes: [], anchorEls: [] });
        }
        return bandMap.get(idx);
      };

      for (const c of leafContainers) {
        const y = c.getBoundingClientRect().top + scrollY0;
        const b = ensureBand(y);
        b.containers.push(c);
        b.scopes.push(c);
        b.anchorEls.push(c);
      }
      for (const m of mediaCandidates) {
        const y = m.getBoundingClientRect().top + scrollY0;
        const b = ensureBand(y);
        b.mediaEls.push(m);
        b.anchorEls.push(m);
      }
      for (const u of allUnits) {
        const y = u.el.getBoundingClientRect().top + scrollY0;
        const b = ensureBand(y);
        b.scopes.push(u.el);
        b.anchorEls.push(u.el);
      }

      const bands = Array.from(bandMap.values())
        .filter((b) => b.anchorEls.length > 0)
        .sort((a, b) => a.idx - b.idx);

      for (let i = 0; i < bands.length; i++) {
        if (!this.running || this.aborted) break;
        const band = bands[i];
        const pct = ((i + 0.5) / Math.max(1, bands.length)) * 100;
        this.updateHudStatus(
          `<strong>Bagian ${i + 1}/${bands.length}</strong> · 8 Kursor Merakit Poligon, Wireframe & Teks...`,
          pct
        );

        await this.ensureElementsInView(band.anchorEls.slice(0, 6), 112, 0.2);
        await this.buildWaveWithAllCursors({
          sceneEl: document.body,
          containers: band.containers.slice(0, 6),
          mediaEls: band.mediaEls.slice(0, 4),
          scopes: band.scopes,
          label: `Section ${i + 1}`,
        });
        await this.sleep(160);
      }

      this.releaseSceneElements(document.body);
      if (this.running && !this.aborted) {
        this.sound.playSceneChime();
        this.overlay.classList.remove("is-building");
        this.updateHudStatus(`<strong>✓ Selesai</strong> · Seluruh Halaman Terbangun`, 100);
        this.logTerminal(AGENTS[0], "DONE", "Full webpage reconstructed (100%)");
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
          setTimeout(() => this.stopVideoRecordingAndSave(), 800);
        }
      }
    }

    async animateScrollTo(targetTop, duration = 520) {
      const scroller = this.getScroller();
      if (!scroller) return;
      const isWin = scroller === document.body || scroller === document.documentElement;
      const startTop = isWin ? window.scrollY : scroller.scrollTop;
      const maxScroll = Math.max(
        0,
        (isWin ? document.documentElement.scrollHeight : scroller.scrollHeight) - window.innerHeight
      );
      const clampedTarget = Math.max(0, Math.min(maxScroll, targetTop));
      const dist = clampedTarget - startTop;
      if (Math.abs(dist) < 8) return;

      const prevBehavior = scroller.style.scrollBehavior;
      scroller.style.scrollBehavior = "auto";
      const dur = Math.max(260, Math.min(720, duration / Math.sqrt(this.speed)));
      const t0 = performance.now();

      await new Promise((resolve) => {
        const step = (now) => {
          if (!this.running || this.aborted) return resolve();
          const p = Math.min(1, (now - t0) / dur);
          const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          const nextY = startTop + dist * ease;
          if (isWin) window.scrollTo(0, nextY);
          else scroller.scrollTop = nextY;
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

      scroller.style.scrollBehavior = prevBehavior;
      await this.sleep(70);
    }

    async ensureElementsInView(els, paddingBottom = 108, targetTopRatio = 0.2) {
      if (!this.running || this.aborted) return;
      const list = (Array.isArray(els) ? els : [els]).filter(Boolean);
      if (list.length === 0) return;

      const scroller = this.getScroller();
      if (!scroller) return;
      const isWin = scroller === document.body || scroller === document.documentElement;
      const curScrollTop = isWin ? window.scrollY : scroller.scrollTop;

      let minTop = Infinity;
      let maxBottom = -Infinity;
      for (const el of list) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.top < minTop) minTop = r.top;
        if (r.bottom > maxBottom) maxBottom = r.bottom;
      }
      if (!isFinite(minTop) || !isFinite(maxBottom)) return;

      const vh = window.innerHeight;
      const isProjectCard = list.some((el) => el.classList && el.classList.contains("mission-card-3d"));
      const topSafe = isProjectCard ? 164 : 84; // Clear sticky #spectator-bubble in #scene-projects
      const bottomSafe = vh - paddingBottom; // Above #swarm-studio-hud

      let deltaY = 0;
      if (maxBottom > bottomSafe) {
        const groupHeight = maxBottom - minTop;
        if (groupHeight <= bottomSafe - topSafe) {
          const desiredTop = Math.max(
            topSafe + 12,
            Math.min(vh * targetTopRatio, bottomSafe - groupHeight - 14)
          );
          deltaY = minTop - desiredTop;
        } else {
          deltaY = minTop - (topSafe + 14);
        }
      } else if (minTop < topSafe) {
        deltaY = minTop - (topSafe + 18);
      }

      if (Math.abs(deltaY) < 16) return;
      await this.animateScrollTo(curScrollTop + deltaY, 480);
    }

    async transitionToScene(sceneEl, sceneIdx, totalScenes) {
      const meta = SCENE_META[sceneEl.id] || {
        title: `Bab 0${sceneIdx + 1}`,
        navLabel: sceneEl.id,
      };

      const navLink = document.querySelector(`.nav-links a[data-scene="${sceneEl.id}"]`);
      const leadCursor = this.cursors[0];
      if (navLink && leadCursor) {
        const nr = navLink.getBoundingClientRect();
        leadCursor.busy = true;
        this.setCursorMode(leadCursor, "pointer", "NAV", `${leadCursor.agent.name} · Klik ${meta.navLabel}`);
        leadCursor.tx = nr.left + nr.width / 2;
        leadCursor.ty = nr.top + nr.height / 2;
        await this.sleep(320);
        leadCursor.el.classList.add("is-clicking");
        this.sound.playSnap(1.2);
        await this.sleep(120);
        leadCursor.el.classList.remove("is-clicking");
        leadCursor.busy = false;
      }

      const charStage = document.getElementById("character-stage");
      if (charStage) {
        this.releaseElementToNative(charStage);
      }

      document.body.dataset.scene = sceneEl.id;
      document
        .querySelectorAll(".story-scene")
        .forEach((s) => s.classList.toggle("is-active-scene", s === sceneEl));
      document
        .querySelectorAll(".nav-links a")
        .forEach((a) => a.classList.toggle("active", a.dataset.scene === sceneEl.id));
      document
        .querySelectorAll(".scene-dots .dot")
        .forEach((d) => d.classList.toggle("active", d.dataset.scene === sceneEl.id));

      this.preHideScene(sceneEl, false);
      await this.animateScrollTo(sceneEl.offsetTop, 640);
      await this.sleep(100);
    }

    preHideScene(sceneEl, includeGlobalChrome) {
      if (includeGlobalChrome && sceneEl.id === "scene-prolog") {
        ["#character-stage", "#top-nav", ".scene-dots", ".bottom-dock"].forEach((sel) => {
          document.querySelectorAll(sel).forEach((el) => this.hideElementForBuild(el));
        });
        const topNav = document.getElementById("top-nav");
        const dock = document.querySelector(".bottom-dock");
        if (topNav) this.prepareScopeForScratchBuild(topNav);
        if (dock) this.prepareScopeForScratchBuild(dock);
      }

      // 1. Empty 100% of text nodes & input placeholders across the entire scene upfront!
      this.prepareScopeForScratchBuild(sceneEl);

      // 2. Hide all containers, cards, watermarks, badges, buttons, and media in the scene
      sceneEl
        .querySelectorAll(
          ".scene-watermark, .chapter-badge, h1, h2, .hero-role-subtitle, #projects-section-subtitle, #prolog-vn-bubble, .btn-hero, #prolog-emoji-widget, .scroll-indicator, #whoami-vn-box, .rpg-status-card, .skill-group-head, .skill-card, #section-persona-switch, #projects-filter-bar, #spectator-bubble, .mission-card-3d, .timeline-head-split, #metro-track-bar, .timeline-node, #timeline-hyouka-thought, .contact-letter-card, .social-links-list, .social-pill, .ofuda-wall-panel, .epilog-box, #vibe-pass-card, .epilog-achievements-preview, .epilog-actions"
        )
        .forEach((el) => this.hideElementForBuild(el));
    }

    async buildSceneGranular(sceneEl, includeGlobalChrome, sceneIdx, totalScenes) {
      const id = sceneEl.id;
      const meta = SCENE_META[id] || { title: id, navLabel: id };
      const basePct = (sceneIdx / totalScenes) * 100;
      const stepPct = (1 / totalScenes) * 100;

      this.preHideScene(sceneEl, includeGlobalChrome);
      const c = this.cursors;

      // Ensure we start at the top of the current section before building downwards
      if (includeGlobalChrome) {
        await this.animateScrollTo(sceneEl.offsetTop, 360);
      }

      // 1. GLOBAL CHROME & CHARACTER POLYGON MESH (On Prolog Scene — All 8 Cursors Working Simultaneously!)
      if (includeGlobalChrome && id === "scene-prolog") {
        const charStage = document.getElementById("character-stage");
        const topNav = document.getElementById("top-nav");
        const dots = document.querySelector(".scene-dots");
        const dock = document.querySelector(".bottom-dock");

        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Poligon Hyouka & Navigasi...`,
          basePct + stepPct * 0.15
        );

        const navUnits = [
          ...(this.sceneUnitsMap.get(topNav) || []),
          ...(this.sceneUnitsMap.get(dock) || []),
        ];

        // Cursors 2, 3, 5, 6 draw the 18-vertex character polygon while Cursors 0, 1, 4, 7 build & type Top Nav + Bottom Dock!
        const charPromise = this.buildPolygonMeshElement(
          charStage,
          [c[2], c[3], c[5], c[6]],
          "Character · 18-Vertex Polygon",
          true
        );

        const navPromise = (async () => {
          await Promise.all([
            this.buildWireframeShell(topNav, c[0], "Top Navigation · Glass"),
            dock ? this.buildWireframeShell(dock, c[7], "Mood Dock") : Promise.resolve(),
            this.assistContainerFrame(topNav, c[1], 0),
            this.assistContainerFrame(topNav, c[4], 1),
          ]);
          const navWorkers = [c[0], c[1], c[4], c[7]].map(async (worker) => {
            while (this.running && !this.aborted && navUnits.length > 0) {
              const u = navUnits.shift();
              await this.typeUnitLive(u, worker, document.body);
            }
          });
          await Promise.all(navWorkers);
        })();

        await Promise.all([charPromise, navPromise]);
        if (dots) this.releaseElementToNative(dots);
        if (dock) this.releaseElementToNative(dock);
      }

      if (!this.running || this.aborted) return;

      // 2. CHAPTER-SPECIFIC MULTI-CURSOR PARALLEL WAVES (With Auto-Scroll Camera Panning)
      if (id === "scene-prolog") {
        const badge = sceneEl.querySelector(".chapter-badge");
        const heroTitle = document.getElementById("hero-pencil-text");
        const heroSub = sceneEl.querySelector(".hero-role-subtitle");
        const vnBubble = document.getElementById("prolog-vn-bubble");
        const deskCup = document.getElementById("interactive-desk-cup");
        const actionsWrap = document.getElementById("prolog-actions");
        const btns = Array.from(sceneEl.querySelectorAll("#prolog-actions .btn-hero"));
        const emojiWidget = document.getElementById("prolog-emoji-widget");
        const scrollInd = sceneEl.querySelector(".scroll-indicator");

        // Wave 1: Chapter Badge + Main Hero Heading + Role Subtitle
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Mengetik Judul Utama & Subjudul Peran...`,
          basePct + stepPct * 0.38
        );
        await this.ensureElementsInView([badge, heroTitle, heroSub], 110, 0.18);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [badge],
          scopes: [badge, heroTitle, heroSub],
          label: "Hero Header",
        });

        // Wave 2: Visual Novel Bubble + Interactive Desk Cup Polygon
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Kotak Visual Novel & Cangkir Kopi...`,
          basePct + stepPct * 0.65
        );
        await this.ensureElementsInView([vnBubble, deskCup], 110, 0.24);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [vnBubble],
          mediaEls: [deskCup],
          scopes: [vnBubble],
          label: "Visual Novel Bubble",
        });

        // Wave 3: Hero CTA Buttons + Emoji Reaction Bar + Scroll Indicator
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Tombol CTA & Bar Reaksi...`,
          basePct + stepPct * 0.88
        );
        await this.ensureElementsInView([...btns, emojiWidget], 110, 0.35);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [...btns, emojiWidget],
          scopes: [actionsWrap, emojiWidget, scrollInd],
          label: "Prolog CTA & Emoji",
        });

      } else if (id === "scene-whoami") {
        const watermark = sceneEl.querySelector(".scene-watermark");
        const vnBox = document.getElementById("whoami-vn-box");
        const choices = Array.from(sceneEl.querySelectorAll(".btn-choice"));

        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit & Mengetik Kisah Visual Novel...`,
          basePct + stepPct * 0.55
        );
        await this.ensureElementsInView(vnBox, 110, 0.22);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [vnBox, ...choices],
          scopes: [watermark, vnBox],
          label: "Visual Novel Box",
        });

      } else if (id === "scene-skills") {
        const watermark = sceneEl.querySelector(".scene-watermark");
        const rpgCard = sceneEl.querySelector(".rpg-status-card");
        const rpgAvatar = sceneEl.querySelector(".rpg-avatar-row img");
        const rpgComment = sceneEl.querySelector(".rpg-comment-box");
        const skillCards = Array.from(sceneEl.querySelectorAll(".skill-card"));
        const heads = Array.from(sceneEl.querySelectorAll(".skill-group-head"));

        // Wave 1: Watermark + Left RPG Status Card (Avatar Polygon + Tabs + Meta Rows + Quote Box + Vibe Console CTA)
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Kartu Karakter RPG & Radar...`,
          basePct + stepPct * 0.2
        );
        await this.ensureElementsInView(rpgCard, 112, 0.16);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [rpgCard, rpgComment].filter(Boolean),
          mediaEls: [rpgAvatar],
          scopes: [watermark, rpgCard],
          label: "RPG Status Card",
        });

        // Subsequent Waves: Skill Cards Row-by-Row (2 cards per row) so every card's wireframe, typing & bar drag is crystal clear!
        for (let i = 0; i < skillCards.length; i += 2) {
          if (!this.running || this.aborted) break;
          const pct = basePct + stepPct * (0.28 + 0.68 * (i / Math.max(1, skillCards.length)));
          this.updateHudStatus(
            `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Kartu Keahlian (${Math.min(skillCards.length, i + 2)}/${skillCards.length})...`,
            pct
          );
          const batch = skillCards.slice(i, i + 2);
          const batchHeads = heads.filter((h) => {
            const parentGroup = h.closest(".skill-group-block");
            return parentGroup && batch.some((sc) => parentGroup.contains(sc));
          });
          await this.ensureElementsInView([...batchHeads, ...batch], 112, 0.22);
          await this.buildWaveWithAllCursors({
            sceneEl,
            containers: [...batchHeads, ...batch],
            scopes: [...batchHeads, ...batch],
            label: "Skill Card",
          });
          await this.sleep(140);
        }

      } else if (id === "scene-projects") {
        const watermark = sceneEl.querySelector(".scene-watermark");
        const headerWrap = sceneEl.querySelector(".projects-header-wrapper");
        const badge = document.getElementById("projects-chapter-badge");
        const persona = document.getElementById("section-persona-switch");
        const filter = document.getElementById("projects-filter-bar");
        const spectator = document.getElementById("spectator-bubble");
        const spectatorAvatar = spectator?.querySelector(".spectator-avatar");
        const cards = Array.from(sceneEl.querySelectorAll(".mission-card-3d"));

        // Wave 1: Header + Persona Switcher + Filter Pills + Hyouka Spectator Bubble (All 8 Cursors Working Together!)
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Mengetik Header, Filter & Panduan Misi...`,
          basePct + stepPct * 0.22
        );
        await this.ensureElementsInView([headerWrap, spectator], 112, 0.16);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [badge, persona, filter, spectator],
          mediaEls: [spectatorAvatar],
          scopes: [watermark, headerWrap, filter, spectator],
          label: "Projects Header",
        });

        // Waves 2..4: Build ALL 8 Project Cards Row-by-Row (3 per row), Auto-Scrolling Camera & Using All 8 Cursors!
        for (let i = 0; i < cards.length; i += 3) {
          if (!this.running || this.aborted) break;
          const pct = basePct + stepPct * (0.35 + 0.6 * (i / Math.max(1, cards.length)));
          this.updateHudStatus(
            `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Poligon & Teks Proyek (${Math.min(cards.length, i + 3)}/${cards.length})...`,
            pct
          );
          const batch = cards.slice(i, i + 3);
          const batchFronts = batch.map((card) => card.querySelector(".card-front") || card);
          const batchThumbs = batch
            .map((card) => card.querySelector(".mission-thumb-wrap, .creative-thumb-wrap"))
            .filter(Boolean);

          // Smoothly scroll down so this row of 3D cards sits squarely below sticky #spectator-bubble!
          await this.ensureElementsInView(batch, 112, 0.18);
          await this.buildWaveWithAllCursors({
            sceneEl,
            containers: batch,
            mediaEls: batchThumbs,
            scopes: batchFronts,
            label: "3D Project Card",
          });
          await this.sleep(240);
        }

      } else if (id === "scene-timeline") {
        const watermark = sceneEl.querySelector(".scene-watermark");
        const head = sceneEl.querySelector(".timeline-head-split");
        const track = document.getElementById("metro-track-bar");
        const nodes = Array.from(sceneEl.querySelectorAll(".timeline-node"));
        const thought = document.getElementById("timeline-hyouka-thought");

        // Wave 1: Header + Metro Track + Stations 01 & 02 (All 8 Cursors Working Together!)
        const firstNodes = nodes.slice(0, 2);
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Rel Metro & Stasiun 01–02...`,
          basePct + stepPct * 0.35
        );
        await this.ensureElementsInView([head, track, ...firstNodes], 112, 0.16);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [head, track, ...firstNodes],
          scopes: [watermark, head, track, ...firstNodes],
          label: "Metro Station",
        });

        // Wave 2: Auto-Scroll Down to Stations 03 & 04 + Hyouka Thought Banner!
        const secondNodes = nodes.slice(2);
        if (secondNodes.length > 0 || thought) {
          this.updateHudStatus(
            `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Stasiun 03–04 & Kesimpulan...`,
            basePct + stepPct * 0.78
          );
          await this.ensureElementsInView([...secondNodes, thought], 112, 0.22);
          await this.buildWaveWithAllCursors({
            sceneEl,
            containers: [...secondNodes, thought],
            scopes: [...secondNodes, thought],
            label: "Metro Station",
          });
        }

      } else if (id === "scene-contact") {
        const watermark = sceneEl.querySelector(".scene-watermark");
        const letter = sceneEl.querySelector(".contact-letter-card");
        const socialList = sceneEl.querySelector(".social-links-list");
        const ofuda = sceneEl.querySelector(".ofuda-wall-panel");

        // Wave 1: Japanese Letter Card (Form Inputs, Placeholders & Hanko Stamp CTA)
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Kartu Surat & Stempel Hanko...`,
          basePct + stepPct * 0.35
        );
        await this.ensureElementsInView(letter, 110, 0.16);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [letter],
          scopes: [watermark, letter],
          label: "Contact Letter Card",
        });

        // Wave 2: Social Links Pills + Ofuda Talisman Wall
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Tautan Sosial & Dinding Ofuda...`,
          basePct + stepPct * 0.78
        );
        await this.ensureElementsInView([socialList, ofuda], 110, 0.22);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [socialList, ofuda],
          scopes: [socialList, ofuda],
          label: "Social & Ofuda Wall",
        });

      } else if (id === "scene-epilog") {
        const box = sceneEl.querySelector(".epilog-box");
        const passCard = document.getElementById("vibe-pass-card");
        const achievePrev = document.getElementById("epilog-achievements-preview");
        const epilogActions = sceneEl.querySelector(".epilog-actions");

        // Wave 1: Epilog Box Shell + Heading + Achievements Preview Badges
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Epilog & Lencana Pencapaian...`,
          basePct + stepPct * 0.38
        );
        await this.ensureElementsInView([box, achievePrev], 110, 0.16);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [box, achievePrev],
          scopes: [
            box?.querySelector(".chapter-badge"),
            box?.querySelector("h2"),
            box?.querySelector(".epilog-text"),
            achievePrev,
          ],
          label: "Epilog & Achievements",
        });

        // Wave 2: Shinkansen Vibe Boarding Pass + Epilog Action Buttons
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Tiket Paspor Shinkansen & Tombol Akhir...`,
          basePct + stepPct * 0.8
        );
        await this.ensureElementsInView([passCard, epilogActions], 110, 0.24);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [passCard, epilogActions],
          scopes: [passCard, epilogActions],
          label: "Shinkansen Boarding Pass",
        });
      }

      // Ensure any remaining untyped TextUnits in this scene are typed before finishing
      const remainingUnits = (this.sceneUnitsMap.get(sceneEl) || []).filter((u) => !u.typed);
      if (remainingUnits.length > 0 && this.running && !this.aborted) {
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [],
          scopes: [sceneEl],
          label: "Scene Polish",
        });
      }

      this.releaseSceneElements(sceneEl);
    }

    releaseSceneElements(sceneEl) {
      if (!sceneEl) return;
      // Restore any text nodes or placeholders in this scene that might not have been restored yet
      const units = this.sceneUnitsMap.get(sceneEl) || [];
      for (const u of units) {
        u.typed = true;
        if (u.placeholderText && u.el) {
          u.el.setAttribute("placeholder", u.placeholderText);
          this.savedPlaceholders.delete(u.el);
        }
        for (const item of u.entries || []) {
          item.node.nodeValue = item.fullText;
          this.savedTextNodes.delete(item.node);
        }
        if (u.el) this.releaseElementToNative(u.el);
      }
      sceneEl.querySelectorAll(".skill-bar-fill").forEach((bar) => {
        if (bar.dataset.fill) bar.style.width = `${bar.dataset.fill}%`;
      });
      sceneEl
        .querySelectorAll(".swarm-hidden, .swarm-wireframe-shell, .swarm-glass-filling, .swarm-scan-reveal")
        .forEach((el) => {
          this.releaseElementToNative(el);
        });
      this.cursors.forEach((c) => {
        c.busy = false;
        this.setCursorMode(c, "pointer", c.agent.role, c.agent.name);
      });
    }

    clearActiveArtifacts() {
      for (const a of this.activeArtifacts) {
        a.remove();
      }
      this.activeArtifacts.clear();
    }

    restoreAllModifiedElements() {
      for (const [node, origText] of this.savedTextNodes.entries()) {
        node.nodeValue = origText;
      }
      this.savedTextNodes.clear();

      for (const [inp, ph] of this.savedPlaceholders.entries()) {
        inp.setAttribute("placeholder", ph);
      }
      this.savedPlaceholders.clear();

      for (const rec of this.splitTextRecords) {
        try {
          if (rec.spans && rec.spans.length > 0 && rec.parent) {
            const firstSpan = rec.spans[0];
            const txtNode = document.createTextNode(rec.origText);
            if (firstSpan.parentNode === rec.parent) {
              rec.parent.insertBefore(txtNode, firstSpan);
            }
            for (const sp of rec.spans) {
              sp.remove();
            }
          }
        } catch (_) {}
      }
      this.splitTextRecords = [];
      this.sceneUnitsMap.clear();

      for (const el of this.modifiedElements) {
        el.classList.remove(
          "swarm-hidden",
          "swarm-wireframe-shell",
          "swarm-glass-filling",
          "swarm-scan-reveal",
          "swarm-releasing"
        );
        el.style.removeProperty("--swarm-clip");
        el.style.removeProperty("--swarm-shell-color");
        if (el.classList.contains("skill-card")) {
          const bar = el.querySelector(".skill-bar-fill");
          if (bar && bar.dataset.fill) bar.style.width = `${bar.dataset.fill}%`;
        }
      }
      this.modifiedElements.clear();
    }

    stop() {
      this.running = false;
      this.aborted = true;
      this.disableSectionPicker();
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        this.stopVideoRecordingAndSave();
      }
      if (this.rafId) cancelAnimationFrame(this.rafId);
      window.removeEventListener("keydown", this.onKeyDown, true);

      this.clearActiveArtifacts();
      this.restoreAllModifiedElements();

      if (this.overlay) this.overlay.remove();
      if (this.hud) this.hud.remove();
      if (this.styleEl) this.styleEl.remove();

      delete window.__swarmRebuild;
    }

    toggle() {
      if (this.running) this.stop();
      else this.start();
    }
  }

  const studio = new SwarmStudio();
  window.__swarmRebuild = studio;
  studio.start();
})();
