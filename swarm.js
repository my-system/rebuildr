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
  // 2. WEB AUDIO SYNTHESIZER (v2.0 — Rich Procedural SFX + Direct Recording Bus)
  // ---------------------------------------------------------------------------
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.sfxGain = null;
      this.bgmGain = null;
      this.audioBalance = "balanced"; // "balanced", "bgm", "sfx"
      this.recordDest = null;
      this.noiseBuffer = null;
      this.muted = false;
      this.lastTick = 0;
      this.lastLock = 0;
    }
    init() {
      if (this.ctx) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
          this.ctx = new AC();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.value = 1.0;
          this.masterGain.connect(this.ctx.destination);

          this.sfxGain = this.ctx.createGain();
          this.sfxGain.connect(this.masterGain);

          this.setAudioBalance(this.audioBalance);

          if (typeof this.ctx.createMediaStreamDestination === "function") {
            this.recordDest = this.ctx.createMediaStreamDestination();
            this.masterGain.connect(this.recordDest);
          }
        }
      } catch (_) {}
    }
    setAudioBalance(mode = "balanced") {
      this.audioBalance = mode;
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      if (this.sfxGain) {
        if (mode === "bgm") {
          this.sfxGain.gain.setValueAtTime(0.35, t);
        } else if (mode === "sfx") {
          this.sfxGain.gain.setValueAtTime(1.0, t);
        } else {
          this.sfxGain.gain.setValueAtTime(0.85, t);
        }
      }
      if (this.bgmGain) {
        if (mode === "bgm") {
          this.bgmGain.gain.setValueAtTime(0.32, t);
        } else if (mode === "sfx") {
          this.bgmGain.gain.setValueAtTime(0.04, t);
        } else {
          this.bgmGain.gain.setValueAtTime(0.18, t);
        }
      }
    }
    out() {
      return this.sfxGain || this.masterGain || (this.ctx ? this.ctx.destination : null);
    }
    getRecordingAudioTracks() {
      this.init();
      this.resume();
      if (this.recordDest && this.recordDest.stream) {
        return this.recordDest.stream.getAudioTracks();
      }
      return [];
    }
    getNoiseBuffer() {
      if (this.noiseBuffer || !this.ctx) return this.noiseBuffer;
      try {
        const sr = this.ctx.sampleRate || 44100;
        const len = Math.floor(sr * 0.65);
        const buf = this.ctx.createBuffer(1, len, sr);
        const data = buf.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < len; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99765 * b0 + white * 0.099046;
          b1 = 0.96300 * b1 + white * 0.296516;
          b2 = 0.57000 * b2 + white * 1.052691;
          data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.18;
        }
        this.noiseBuffer = buf;
      } catch (_) {}
      return this.noiseBuffer;
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
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        const freq = 420 * Math.pow(1.055, idx % 14);
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + 0.045);
        gain.gain.setValueAtTime(0.032, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.052);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.058);
      } catch (_) {}
    }
    playSnap(pitchFactor = 1) {
      if (this.muted) return;
      const now = performance.now();
      if (now - this.lastTick < 38) return;
      this.lastTick = now;
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        const baseFreq = 520 * pitchFactor + (Math.random() * 60 - 30);
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, t + 0.045);
        gain.gain.setValueAtTime(0.034, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.055);
      } catch (_) {}
    }
    playLockSnap(pitchFactor = 1) {
      if (this.muted) return;
      const now = performance.now();
      if (now - this.lastLock < 55) return;
      this.lastLock = now;
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        // 1. Tactile low-end mechanical thud
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = "sine";
        sub.frequency.setValueAtTime(145 * pitchFactor, t);
        sub.frequency.exponentialRampToValueAtTime(48, t + 0.065);
        subGain.gain.setValueAtTime(0.055, t);
        subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        sub.connect(subGain);
        subGain.connect(dest);
        sub.start(t);
        sub.stop(t + 0.075);

        // 2. Crisp metallic lock click
        const click = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        click.type = "triangle";
        click.frequency.setValueAtTime(1750 * pitchFactor, t);
        click.frequency.exponentialRampToValueAtTime(640, t + 0.028);
        clickGain.gain.setValueAtTime(0.026, t);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);
        click.connect(clickGain);
        clickGain.connect(dest);
        click.start(t);
        click.stop(t + 0.036);
      } catch (_) {}
    }
    playWhoosh(intensity = 1) {
      if (this.muted) return;
      this.resume();
      const dest = this.out();
      const buf = this.getNoiseBuffer();
      if (!this.ctx || !dest || !buf) return;
      try {
        const t = this.ctx.currentTime;
        const dur = Math.min(0.55, 0.32 * Math.max(0.7, intensity));
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.Q.setValueAtTime(2.2, t);
        filter.frequency.setValueAtTime(200, t);
        filter.frequency.exponentialRampToValueAtTime(1150 * Math.min(1.4, intensity), t + dur * 0.45);
        filter.frequency.exponentialRampToValueAtTime(180, t + dur);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.048 * Math.min(1.3, intensity), t + dur * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        src.start(t);
        src.stop(t + dur + 0.02);
      } catch (_) {}
    }
    playLaserSweep(durationMs = 440) {
      if (this.muted) return;
      this.duckBgm(0.3, 700);
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        const dur = Math.max(0.18, Math.min(0.95, durationMs / 1000));
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc1.type = "sawtooth";
        osc2.type = "triangle";
        osc1.frequency.setValueAtTime(260, t);
        osc1.frequency.exponentialRampToValueAtTime(780, t + dur);
        osc2.frequency.setValueAtTime(524, t);
        osc2.frequency.exponentialRampToValueAtTime(1568, t + dur);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.exponentialRampToValueAtTime(2400, t + dur * 0.7);
        filter.frequency.exponentialRampToValueAtTime(450, t + dur);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.022, t + dur * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + dur + 0.02);
        osc2.stop(t + dur + 0.02);
      } catch (_) {}
    }
    playCounterTick(progress = 0.5) {
      if (this.muted) return;
      const now = performance.now();
      if (now - this.lastTick < 32) return;
      this.lastTick = now;
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        const freq = 660 + Math.max(0, Math.min(1, progress)) * 540;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.018);
        gain.gain.setValueAtTime(0.024, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.025);
      } catch (_) {}
    }
    playKey() {
      if (this.muted) return;
      const now = performance.now();
      if (now - this.lastTick < 26) return;
      this.lastTick = now;
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(920 + Math.random() * 280, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.016);
        gain.gain.setValueAtTime(0.016, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);
        osc.connect(gain);
        gain.connect(dest);
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
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const t = this.ctx.currentTime + i * 0.055;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.028, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.3);
        });
      } catch (_) {}
    }
    playFinaleChord() {
      if (this.muted) return;
      this.duckBgm(0.2, 1200);
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
        notes.forEach((freq, i) => {
          const t = this.ctx.currentTime + i * 0.048;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = i % 2 === 0 ? "sine" : "triangle";
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.026, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.68);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.72);
        });
      } catch (_) {}
    }

    playPop(pitch = 1.0) {
      if (this.muted) return;
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        const f0 = 440 * pitch;
        const f1 = 880 * pitch;
        osc.frequency.setValueAtTime(f0, t);
        osc.frequency.exponentialRampToValueAtTime(f1, t + 0.045);
        gain.gain.setValueAtTime(0.045, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.06);
      } catch (_) {}
    }

    playToggle(state = true) {
      if (this.muted) return;
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        const startFreq = state ? 520 : 740;
        const endFreq = state ? 860 : 420;
        osc.frequency.setValueAtTime(startFreq, t);
        osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.04);
        gain.gain.setValueAtTime(0.038, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.05);
      } catch (_) {}
    }

    playSliderTick(normVal = 0.5) {
      if (this.muted) return;
      const now = performance.now();
      if (now - this.lastTick < 35) return;
      this.lastTick = now;
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        const freq = 380 + Math.max(0, Math.min(1, normVal)) * 620;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.025, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.032);
      } catch (_) {}
    }

    playDing(pitch = 1.0) {
      if (this.muted) return;
      this.resume();
      const dest = this.out();
      if (!this.ctx || !dest) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77 * pitch, t);
        gain.gain.setValueAtTime(0.042, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.5);
      } catch (_) {}
    }

    playProceduralVocalBlips(text, durationMs = 1200) {
      // Dinonaktifkan: Menghilangkan efek suara orang/vokal berbicara
      return;
    }

    duckBgm(factor = 0.25, recoveryMs = 600) {
      if (!this.bgmPlaying || !this.bgmGain || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        this.bgmGain.gain.cancelScheduledValues(now);
        this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
        this.bgmGain.gain.linearRampToValueAtTime(0.18 * factor, now + 0.04);
        this.bgmGain.gain.linearRampToValueAtTime(0.18, now + (recoveryMs / 1000));
      } catch (_) {}
    }

    /* Procedural WebAudio Background Music Generator (Lo-Fi & Synthwave) */
    startBgm(mode = "lofi") {
      if (this.muted || this.bgmPlaying || mode === "none" || mode === "sfx-only") return;
      this.init();
      this.resume();
      if (!this.ctx) return;
      this.bgmPlaying = true;
      this.bgmMode = mode;
      this.bgmGain = this.ctx.createGain();
      this.setAudioBalance(this.audioBalance);
      this.bgmGain.connect(this.masterGain);

      const chords = mode === "synthwave"
        ? [
            [110.0, 164.81, 220.0, 261.63], // Am
            [87.31, 130.81, 174.61, 220.0],  // F
            [130.81, 196.0, 246.94, 293.66], // C
            [98.0, 146.83, 196.0, 246.94]   // G
          ]
        : [
            [146.83, 220.0, 261.63, 329.63], // Dm9
            [98.0, 196.0, 246.94, 329.63],   // G13
            [130.81, 196.0, 246.94, 293.66], // Cmaj9
            [110.0, 164.81, 220.0, 261.63]   // Am7
          ];

      let chordIdx = 0;
      const playStep = () => {
        if (!this.bgmPlaying || !this.ctx) return;
        const curChord = chords[chordIdx % chords.length];
        chordIdx++;
        const now = this.ctx.currentTime;
        const dur = mode === "synthwave" ? 1.6 : 2.2;

        curChord.forEach((f, fi) => {
          try {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = mode === "synthwave" ? (fi === 0 ? "sawtooth" : "triangle") : "triangle";
            osc.frequency.setValueAtTime(f, now);

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(mode === "synthwave" ? 1200 : 750, now);
            filter.frequency.exponentialRampToValueAtTime(mode === "synthwave" ? 500 : 380, now + dur);

            g.gain.setValueAtTime(0.0001, now);
            g.gain.linearRampToValueAtTime(fi === 0 ? 0.05 : 0.028, now + 0.1);
            g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

            osc.connect(filter);
            filter.connect(g);
            g.connect(this.bgmGain);

            osc.start(now);
            osc.stop(now + dur);
          } catch (_) {}
        });
      };

      this.bgmTimer = setInterval(playStep, mode === "synthwave" ? 1650 : 2250);
      playStep();
    }

    stopBgm() {
      this.bgmPlaying = false;
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
      if (this.bgmGain && this.ctx) {
        try {
          this.bgmGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
          setTimeout(() => {
            try { this.bgmGain.disconnect(); } catch (_) {}
          }, 600);
        } catch (_) {}
      }
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
    html, body, #story-scroll-container {
      overflow-anchor: none !important;
    }

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
      transform: translateY(12px) scale(0.96) !important;
      filter: blur(6px) !important;
      transition: none !important;
    }

    /* Stage 1: Empty Dashed Blueprint Wireframe Shell (Smooth Motion Design Spring Entrance) */
    .swarm-wireframe-shell,
    .swarm-wireframe-shell > .card-flip-inner > .card-front {
      opacity: 1 !important;
      visibility: visible !important;
      background: rgba(16, 185, 129, 0.045) !important;
      backdrop-filter: blur(4px) !important;
      -webkit-backdrop-filter: blur(4px) !important;
      border: 1.5px dashed var(--swarm-shell-color, #10b981) !important;
      box-shadow:
        inset 0 0 26px color-mix(in srgb, var(--swarm-shell-color, #10b981) 12%, transparent),
        0 10px 28px -8px color-mix(in srgb, var(--swarm-shell-color, #10b981) 20%, transparent) !important;
      transform: translateY(0) scale(1) !important;
      filter: blur(0px) !important;
      animation: swarmMotionWireIn 0.44s cubic-bezier(0.22, 1, 0.36, 1) both !important;
      transition:
        width 0.18s cubic-bezier(0.22, 1, 0.36, 1),
        height 0.18s cubic-bezier(0.22, 1, 0.36, 1),
        background 0.38s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.38s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.38s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.38s cubic-bezier(0.22, 1, 0.36, 1) !important;
    }
    .swarm-wireframe-shell > .card-flip-inner {
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
      filter: none !important;
    }

    @keyframes swarmMotionWireIn {
      0% {
        opacity: 0;
        transform: translateY(14px) scale(0.945);
        filter: blur(6px);
      }
      65% {
        opacity: 1;
        transform: translateY(-1.5px) scale(1.008);
        filter: blur(0px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0px);
      }
    }

    /* Stage 2: Glassmorphism Shader Fill Transition */
    .swarm-glass-filling,
    .swarm-glass-filling > .card-flip-inner,
    .swarm-glass-filling > .card-flip-inner > .card-front {
      opacity: 1 !important;
      visibility: visible !important;
      transform: translateY(0) scale(1) !important;
      filter: blur(0px) !important;
      transition:
        background 0.46s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.46s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.46s cubic-bezier(0.22, 1, 0.36, 1),
        backdrop-filter 0.46s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.46s cubic-bezier(0.22, 1, 0.36, 1) !important;
    }

    /* Polygon Scanline Reveal Effect (Smooth De-blur & Scale Settle) */
    .swarm-scan-reveal {
      opacity: 1 !important;
      visibility: visible !important;
      clip-path: var(--swarm-clip, inset(0 0 100% 0)) !important;
      transform: scale(var(--swarm-scan-scale, 1)) !important;
      filter: blur(var(--swarm-scan-blur, 0px)) !important;
      transition: none !important;
    }

    /* Final Materialize Spring Settle (Motion Design Pop & Shimmer) */
    .swarm-releasing {
      animation: swarmMotionMaterialize 0.52s cubic-bezier(0.22, 1, 0.36, 1) both !important;
      transition:
        opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        filter 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        background 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;
    }

    @keyframes swarmMotionMaterialize {
      0% {
        transform: translateY(3px) scale(0.978);
        filter: brightness(1.07);
      }
      55% {
        transform: translateY(-1.5px) scale(1.01);
        filter: brightness(1.02);
      }
      100% {
        transform: translateY(0) scale(1);
        filter: brightness(1);
      }
    }

    /* SVG Polygon Mesh Motion Design Keyframes */
    .swarm-svg-edge {
      stroke-dasharray: 280;
      stroke-dashoffset: 280;
      animation: swarmDrawSvgEdge 0.36s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes swarmDrawSvgEdge {
      to { stroke-dashoffset: 0; }
    }
    .swarm-svg-poly {
      transform-box: fill-box;
      transform-origin: center;
      animation: swarmBloomSvgPoly 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes swarmBloomSvgPoly {
      0% { opacity: 0; transform: scale(0.84); }
      65% { opacity: 1; transform: scale(1.02); }
      100% { opacity: 0.92; transform: scale(1); }
    }
    .swarm-svg-vertex {
      transform-box: fill-box;
      transform-origin: center;
      animation: swarmPopSvgVertex 0.34s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    @keyframes swarmPopSvgVertex {
      0% { opacity: 0; transform: scale(0.2); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* Live Blinking Caret inside DOM Text Nodes */
    .swarm-live-caret {
      display: inline-block;
      width: 2.5px;
      height: 1.08em;
      vertical-align: -0.15em;
      margin-left: 1.5px;
      background: var(--caret-color, #8b5cf6);
      box-shadow: 0 0 10px var(--caret-color, #8b5cf6);
      border-radius: 2px;
      animation: swarmCaretBlink 0.45s infinite alternate;
    }
    @keyframes swarmCaretBlink {
      0% { opacity: 1; transform: scaleY(1); }
      100% { opacity: 0.25; transform: scaleY(0.88); }
    }

    /* Figma Selection Frame (Silky-Smooth Motion Interpolation) */
    .swarm-selection-frame {
      position: fixed;
      pointer-events: none;
      border: 1.5px solid var(--agent-color, #10b981);
      background: color-mix(in srgb, var(--agent-color, #10b981) 5%, transparent);
      border-radius: 6px;
      z-index: 2147483644;
      box-sizing: border-box;
      animation: swarmFrameEnter 0.26s cubic-bezier(0.22, 1, 0.36, 1) both;
      transition:
        left 0.14s cubic-bezier(0.22, 1, 0.36, 1),
        top 0.14s cubic-bezier(0.22, 1, 0.36, 1),
        width 0.14s cubic-bezier(0.22, 1, 0.36, 1),
        height 0.14s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    }
    @keyframes swarmFrameEnter {
      0% { opacity: 0; transform: scale(0.93); }
      100% { opacity: 1; transform: scale(1); }
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
      opacity: 0 !important;
      transform: scale(1.035) !important;
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

    /* Bottom Studio Control HUD (Modular & Categorized) */
    #swarm-studio-hud {
      position: fixed;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(16, 185, 129, 0.24);
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      transition: opacity 0.3s ease, transform 0.3s ease;
      max-width: 96vw;
    }
    #swarm-studio-hud.is-hidden {
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translateX(-50%) translateY(20px) !important;
    }
    /* Clean Cinematic Showcase Mode: Hide editor toggles, debug buttons & mini terminal so preview/video stays 100% clean */
    body[data-fullscreen-render="true"] .swarm-hud-modes,
    body[data-fullscreen-render="true"] .swarm-hud-toggles,
    body[data-fullscreen-render="true"] .swarm-hud-actions,
    body[data-fullscreen-render="true"] .swarm-hud-divider,
    body[data-fullscreen-render="true"] #swarm-mini-terminal,
    body[data-fullscreen-render="true"] #swarm-tour-sound-btn,
    body[data-fullscreen-render="true"] #swarm-tour-takeover-btn,
    body[data-fullscreen-render="true"] #swarm-tour-resume-btn {
      display: none !important;
    }
    body[data-fullscreen-render="true"] #swarm-studio-hud {
      padding: 4px 14px !important;
      background: rgba(11, 15, 25, 0.88) !important;
      bottom: 12px !important;
      max-width: 440px !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    /* Auto-Dismiss GDPR, Cookie Notices, Live Chat Bubbles & Intrusive Backdrop Overlays */
    [class*="cookie-banner" i],
    [class*="cookie-notice" i],
    [class*="cookie-consent" i],
    [id*="cookie-consent" i],
    [id*="cookie-banner" i],
    [id*="onetrust-banner" i],
    .onetrust-pc-dark-filter,
    #onetrust-consent-sdk,
    .cc-banner,
    .cc-window,
    .ch2-dialog,
    [aria-label*="cookie consent" i],
    [aria-label*="cookie banner" i],
    .modal-backdrop,
    .dialog-backdrop,
    [class*="overlay-backdrop" i],
    #intercom-container,
    .intercom-lightweight-app,
    .crisp-client,
    #hubspot-messages-iframe-container,
    #drift-widget,
    #livechat-compact-container,
    #livechat-full,
    #tidio-chat,
    [id*="tawk" i],
    [class*="tawk" i],
    [id*="chat-widget" i],
    [class*="chat-widget" i] {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }

    /* Clean Top Corner Watermark Branding */
    #swarm-branding-watermark {
      position: fixed;
      top: 14px;
      right: 18px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      background: rgba(10, 15, 29, 0.76);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      color: #e2e8f0;
      letter-spacing: 0.5px;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    #swarm-branding-watermark .bm-icon {
      color: #10b981;
      font-size: 11px;
    }
    #swarm-branding-watermark .bm-tag {
      color: #38bdf8;
      font-size: 8.5px;
      background: rgba(56, 189, 248, 0.15);
      padding: 1px 5px;
      border-radius: 4px;
      margin-left: 3px;
    }
    #swarm-branding-watermark.is-hidden {
      display: none !important;
    }

    .tour-caption-keyword {
      color: #34d399 !important;
      font-weight: 800 !important;
      text-shadow: 0 0 10px rgba(52, 211, 153, 0.5) !important;
    }
    .swarm-hud-group {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .swarm-hud-divider {
      width: 1px;
      height: 18px;
      background: rgba(255, 255, 255, 0.16);
      margin: 0 3px;
      flex-shrink: 0;
    }
    .swarm-hud-avatars {
      display: flex;
      align-items: center;
      padding-left: 2px;
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
      min-width: 130px;
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .swarm-hud-status strong {
      color: #34d399;
      font-weight: 700;
    }
    .swarm-hud-progress {
      width: 64px;
      height: 5px;
      background: rgba(255, 255, 255, 0.14);
      border-radius: 999px;
      overflow: hidden;
      flex-shrink: 0;
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

    /* Pre-Flight Launchpad Modal */
    #swarm-launchpad-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: rgba(3, 7, 18, 0.72);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      pointer-events: auto;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.28s ease, visibility 0.28s ease;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #f8fafc;
    }
    #swarm-launchpad-backdrop.is-open {
      opacity: 1;
      visibility: visible;
    }
    #swarm-launchpad-modal {
      width: 100%;
      max-width: 660px;
      max-height: 90vh;
      overflow-y: auto;
      background: radial-gradient(120% 90% at 30% 10%, rgba(15, 23, 42, 0.96), rgba(7, 11, 20, 0.98));
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 22px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(16, 185, 129, 0.35);
      padding: 24px 28px;
      transform: scale(0.95) translateY(12px);
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
    }
    #swarm-launchpad-backdrop.is-open #swarm-launchpad-modal {
      transform: scale(1) translateY(0);
    }
    #swarm-launchpad-backdrop[data-theme="architect"] #swarm-launchpad-modal {
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(56, 189, 248, 0.45);
    }
    #swarm-launchpad-backdrop[data-theme="cyberpunk"] #swarm-launchpad-modal {
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(244, 63, 94, 0.45), 0 0 30px rgba(34, 211, 238, 0.25);
    }
    .lp-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 14px;
    }
    .lp-brand {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .lp-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(16, 185, 129, 0.16);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      font: 800 10px/1 'JetBrains Mono', Consolas, monospace;
      letter-spacing: 0.14em;
      width: fit-content;
    }
    .lp-title {
      margin: 4px 0 2px;
      font-size: 20px;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .lp-sub {
      margin: 0;
      font-size: 12.5px;
      color: #94a3b8;
    }
    .lp-btn-close {
      appearance: none;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 15px;
      transition: all 0.18s ease;
      flex-shrink: 0;
    }
    .lp-btn-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      color: #f87171;
    }
    .lp-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .lp-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 14px;
      padding: 12px 16px;
      transition: border-color 0.18s ease;
    }
    .lp-card:hover {
      border-color: rgba(255, 255, 255, 0.16);
    }
    .lp-card-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .lp-card-head strong {
      font-size: 13.5px;
      font-weight: 700;
      color: #f1f5f9;
      display: block;
    }
    .lp-card-head small {
      font-size: 11.5px;
      color: #94a3b8;
      display: block;
    }
    .lp-card-icon {
      font-size: 18px;
      line-height: 1;
    }
    .lp-card-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
    }
    .lp-card-row .lp-card-head {
      margin-bottom: 0;
    }
    .lp-seg-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .lp-seg-group.lp-seg-3 {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .lp-seg-btn {
      appearance: none;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 10px 12px;
      cursor: pointer;
      text-align: left;
      color: #cbd5e1;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .lp-seg-btn:hover {
      background: rgba(255, 255, 255, 0.09);
      border-color: rgba(255, 255, 255, 0.22);
    }
    .lp-seg-btn.active {
      background: rgba(16, 185, 129, 0.16);
      border-color: #10b981;
      color: #f8fafc;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.2);
    }
    .lp-seg-title {
      font-size: 13px;
      font-weight: 700;
    }
    .lp-seg-desc {
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.3;
    }
    .lp-seg-btn.active .lp-seg-desc {
      color: #a7f3d0;
    }
    .lp-switch {
      position: relative;
      display: inline-block;
      width: 46px;
      height: 26px;
      flex-shrink: 0;
      cursor: pointer;
    }
    .lp-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .lp-slider {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.16);
      border-radius: 999px;
      transition: all 0.25s ease;
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .lp-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: transform 0.25s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }
    .lp-switch input:checked + .lp-slider {
      background: #10b981;
      border-color: #10b981;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
    }
    .lp-switch input:checked + .lp-slider:before {
      transform: translateX(20px);
    }
    .lp-toggles-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .lp-toggle-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 7px 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .lp-toggle-item:hover {
      background: rgba(255, 255, 255, 0.06);
    }
    .lp-toggle-item input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #10b981;
      cursor: pointer;
      flex-shrink: 0;
    }
    .lp-toggle-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .lp-toggle-name {
      font-size: 12.5px;
      font-weight: 700;
      color: #e2e8f0;
    }
    .lp-toggle-hint {
      font-size: 11px;
      color: #94a3b8;
    }
    .lp-row-flex {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .lp-sub-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 160px;
    }
    .lp-sub-label {
      font-size: 11.5px;
      color: #94a3b8;
      font-weight: 600;
    }
    .lp-pill-group {
      display: flex;
      gap: 6px;
    }
    .lp-pill {
      appearance: none;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 11.5px;
      font-weight: 600;
      color: #cbd5e1;
      cursor: pointer;
      transition: all 0.18s ease;
      flex: 1;
      text-align: center;
    }
    .lp-pill:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }
    .lp-pill.active {
      background: rgba(16, 185, 129, 0.22);
      border-color: #10b981;
      color: #6ee7b7;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.25);
    }
    .lp-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      gap: 12px;
      flex-wrap: wrap;
    }
    .lp-footer-tips {
      font-size: 11.5px;
      color: #94a3b8;
    }
    .lp-footer-tips strong {
      color: #f1f5f9;
    }
    .lp-footer-btns {
      display: flex;
      gap: 10px;
      margin-left: auto;
    }
    .lp-btn-secondary {
      appearance: none;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #cbd5e1;
      border-radius: 10px;
      padding: 9px 15px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .lp-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }
    .lp-btn-primary {
      appearance: none;
      background: linear-gradient(135deg, #10b981, #059669);
      border: 1px solid #34d399;
      color: #ffffff;
      border-radius: 10px;
      padding: 9px 20px;
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 0.02em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      box-shadow: 0 4px 18px rgba(16, 185, 129, 0.35);
      transition: all 0.2s ease;
    }
    .lp-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(16, 185, 129, 0.5);
      filter: brightness(1.08);
    }
    .lp-btn-primary:active {
      transform: translateY(0);
    }
    .lp-play-icon {
      font-size: 13px;
    }
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

    /* Feature 3: Mini Floating Live Code & AI Prompt Streamer - Permanently Hidden for Clean Presentation */
    #swarm-mini-terminal {
      display: none !important;
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
      transition: top 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  bottom 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  left 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  right 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  opacity 0.28s ease,
                  transform 0.28s ease;
    }
    #swarm-mini-terminal.dock-top-right {
      bottom: auto !important;
      top: 84px !important;
      left: auto !important;
      right: 20px !important;
    }
    #spectator-bubble.is-unstick-for-build,
    .spectator-card.is-unstick-for-build {
      position: relative !important;
      top: auto !important;
      z-index: 10 !important;
      margin-bottom: 24px !important;
    }
    .bottom-dock.is-building-dock {
      bottom: 84px !important;
      z-index: 2147483647 !important;
      transition: bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    /* Feature 7D: Cinematic Depth of Field & Spotlight Rack Focus (1:1 Native, No Zoom Distortion) */
    .swarm-focus-target {
      position: relative !important;
      z-index: 120 !important;
      filter: none !important;
      opacity: 1 !important;
      transform: translateZ(0) !important;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45),
                  0 0 25px var(--agent-color, rgba(16, 185, 129, 0.4)),
                  0 0 0 1px var(--agent-color, rgba(16, 185, 129, 0.4)) !important;
      transition: box-shadow 0.35s ease,
                  filter 0.35s ease,
                  opacity 0.35s ease !important;
    }
    .swarm-dof-soften {
      filter: blur(1.5px) opacity(0.8) !important;
      transform: translateZ(0) !important;
      pointer-events: none !important;
      transition: filter 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    /* Feature 7E: 9:16 Vertical Video Frame (Instagram Reels / TikTok / Shorts), 1:1 Square & 4:5 Portrait */
    :root {
      color-scheme: dark !important;
    }
    body.swarm-reels-stage,
    body.swarm-square-stage,
    body.swarm-portrait-stage,
    body[data-rebuildr-mobile="true"],
    body[data-format="9:16"],
    body[data-format="4:5"],
    body[data-format="1:1"] {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      overflow-x: hidden !important;
      -webkit-overflow-scrolling: touch !important;
    }
    body.swarm-reels-stage::-webkit-scrollbar,
    body.swarm-square-stage::-webkit-scrollbar,
    body.swarm-portrait-stage::-webkit-scrollbar,
    body.swarm-reels-stage *::-webkit-scrollbar,
    body.swarm-square-stage *::-webkit-scrollbar,
    body.swarm-portrait-stage *::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }

    /* iOS-Style Floating Glass Scroll Indicator */
    #swarm-mobile-scroll-indicator {
      position: fixed;
      top: 16px;
      right: 5px;
      bottom: 16px;
      width: 3px;
      pointer-events: none;
      z-index: 10005;
      opacity: 0;
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #swarm-mobile-scroll-indicator.is-scrolling {
      opacity: 1;
    }
    #swarm-mobile-scroll-thumb {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 38px;
      background: rgba(255, 255, 255, 0.48);
      backdrop-filter: blur(4px);
      border-radius: 9999px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
      transform: translateY(0);
      will-change: transform;
    }

    body.swarm-reels-stage {
      padding-top: 36px !important;
      box-sizing: border-box !important;
      background: #060913 !important;
    }
    body.swarm-square-stage,
    body.swarm-portrait-stage {
      background: #060913 !important;
    }
    body.swarm-reels-stage #story-scroll-container,
    body.swarm-reels-stage main,
    body.swarm-reels-stage .story-scene,
    body.swarm-reels-stage > div:not(#swarm-studio-overlay):not(#swarm-launchpad-backdrop):not(.character-stage),
    body.swarm-square-stage #story-scroll-container,
    body.swarm-square-stage main,
    body.swarm-square-stage .story-scene,
    body.swarm-square-stage > div:not(#swarm-studio-overlay):not(#swarm-launchpad-backdrop):not(.character-stage),
    body.swarm-portrait-stage #story-scroll-container,
    body.swarm-portrait-stage main,
    body.swarm-portrait-stage .story-scene,
    body.swarm-portrait-stage > div:not(#swarm-studio-overlay):not(#swarm-launchpad-backdrop):not(.character-stage) {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      border-left: none !important;
      border-right: none !important;
      box-shadow: none !important;
      overflow-x: hidden !important;
    }
    body.swarm-reels-stage .projects-grid,
    body.swarm-reels-stage .skills-grid,
    body.swarm-reels-stage [class*='grid'],
    body.swarm-square-stage .projects-grid,
    body.swarm-square-stage .skills-grid,
    body.swarm-square-stage [class*='grid'],
    body.swarm-portrait-stage .projects-grid,
    body.swarm-portrait-stage .skills-grid,
    body.swarm-portrait-stage [class*='grid'] {
      grid-template-columns: 1fr !important;
    }
    body.swarm-reels-stage #swarm-bottom-hud,
    body.swarm-square-stage #swarm-bottom-hud,
    body.swarm-portrait-stage #swarm-bottom-hud {
      max-width: 96% !important;
      width: 96% !important;
      font-size: 11px !important;
    }
    body.swarm-reels-stage #swarm-mini-terminal,
    body.swarm-square-stage #swarm-mini-terminal,
    body.swarm-portrait-stage #swarm-mini-terminal {
      width: 340px !important;
      max-width: 90vw !important;
    }

    /* Only simulate a centered mobile column on ultra-wide desktop monitors outside iframe */
    @media (min-width: 1280px) and (orientation: landscape) {
      body.swarm-reels-stage:not([data-fullscreen-render="true"]) #story-scroll-container,
      body.swarm-reels-stage:not([data-fullscreen-render="true"]) main,
      body.swarm-reels-stage:not([data-fullscreen-render="true"]) .story-scene,
      body.swarm-reels-stage:not([data-fullscreen-render="true"]) > div:not(#swarm-studio-overlay):not(#swarm-launchpad-backdrop):not(.character-stage) {
        max-width: 440px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        border-left: 1px solid rgba(255, 255, 255, 0.14) !important;
        border-right: 1px solid rgba(255, 255, 255, 0.14) !important;
        box-shadow: 0 0 100px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(16, 185, 129, 0.25) !important;
      }
    }

    /* Feature 7F: Kinetic Rolling Number Counter Animation */
    .swarm-counter-rolling {
      display: inline-block;
      font-variant-numeric: tabular-nums;
      transition: transform 0.1s ease;
      color: var(--agent-color, #10b981) !important;
      text-shadow: 0 0 12px var(--agent-color, rgba(16, 185, 129, 0.5));
    }
    #swarm-mini-terminal.is-hidden {
      opacity: 0 !important;
      transform: translateY(14px) scale(0.96) !important;
      pointer-events: none !important;
    }
    #swarm-mini-terminal.is-forced-visible {
      display: block !important;
      opacity: 1 !important;
      pointer-events: auto !important;
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

    /* Feature 6: Motion Design Mode (G) — Shot Transitions & Kinetic Title Cards (no visible scrolling) */
    #swarm-motion-stage {
      position: absolute;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
      overflow: hidden;
      --mx-bg: #070b14;
      --mx-bg2: #0f1b2d;
      --mx-accent: #10b981;
      --mx-accent2: #38bdf8;
      --mx-ink: #f8fafc;
    }
    #swarm-studio-overlay[data-theme="architect"] #swarm-motion-stage {
      --mx-bg: #08213d;
      --mx-bg2: #0d3b66;
      --mx-accent: #7dd3fc;
      --mx-accent2: #e0f2fe;
    }
    #swarm-studio-overlay[data-theme="cyberpunk"] #swarm-motion-stage {
      --mx-bg: #0b0414;
      --mx-bg2: #1d0b33;
      --mx-accent: #f0abfc;
      --mx-accent2: #22d3ee;
    }
    .swarm-mx-layer {
      position: absolute;
      inset: 0;
      will-change: transform, clip-path, opacity;
    }
    .swarm-mx-panel {
      background: var(--mx-bg);
    }
    .swarm-mx-accent {
      background: var(--mx-accent);
    }
    .swarm-mx-accent2 {
      background: var(--mx-accent2);
    }
    .swarm-mx-slice {
      position: absolute;
      will-change: transform;
    }
    .swarm-mx-iris {
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 300vmax var(--mx-bg), inset 0 0 0 3px var(--mx-accent);
    }
    .swarm-mx-card {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 9vw;
      color: var(--mx-ink);
      background: radial-gradient(120% 90% at 30% 40%, var(--mx-bg2), var(--mx-bg));
    }
    .swarm-mx-card-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
      background-size: 48px 48px;
    }
    .swarm-mx-corner {
      position: absolute;
      top: 28px;
      font: 700 10px/1 'JetBrains Mono', Consolas, monospace;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(248, 250, 252, 0.45);
    }
    .swarm-mx-num {
      position: relative;
      font-size: clamp(64px, 13vw, 190px);
      font-weight: 900;
      line-height: 0.85;
      letter-spacing: -0.04em;
      color: transparent;
      -webkit-text-stroke: 2px var(--mx-accent);
    }
    .swarm-mx-kicker {
      position: relative;
      margin: 20px 0 12px;
      font: 700 12px/1 'JetBrains Mono', Consolas, monospace;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: var(--mx-accent);
    }
    .swarm-mx-title {
      position: relative;
      max-width: 18ch;
      font-size: clamp(28px, 4.8vw, 70px);
      font-weight: 800;
      line-height: 1.06;
      letter-spacing: -0.02em;
    }
    .swarm-mx-title .w {
      display: inline-block;
      overflow: hidden;
      vertical-align: bottom;
      padding-bottom: 0.06em;
      margin-right: 0.24em;
    }
    .swarm-mx-title .w > span {
      display: inline-block;
    }
    .swarm-mx-rule {
      position: relative;
      height: 3px;
      width: min(420px, 40vw);
      margin-top: 22px;
      transform-origin: left center;
      background: linear-gradient(90deg, var(--mx-accent), var(--mx-accent2));
    }
    .swarm-mx-sub {
      position: relative;
      margin-top: 14px;
      font: 600 13px/1.4 'JetBrains Mono', Consolas, monospace;
      color: rgba(248, 250, 252, 0.62);
    }
    .swarm-mx-shot-tag {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 10px 24px;
      border: 1px solid var(--mx-accent);
      border-radius: 999px;
      background: rgba(7, 11, 20, 0.86);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55), 0 0 20px rgba(16, 185, 129, 0.25);
      font: 800 12px/1 'JetBrains Mono', Consolas, monospace;
      letter-spacing: 0.24em;
      color: var(--mx-accent);
      white-space: nowrap;
      text-transform: uppercase;
    }

    /* Feature 8: AI Page Curator & Smart Layout Re-arranger */
    .swarm-curated-omit {
      display: none !important;
    }
    .swarm-curated-grid-reflow {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important;
      gap: 20px !important;
      align-items: stretch !important;
    }
    body.swarm-reels-stage .swarm-curated-grid-reflow {
      grid-template-columns: 1fr !important;
      gap: 14px !important;
    }
    body.swarm-curated-layout section,
    body.swarm-curated-layout .story-scene {
      padding-top: clamp(28px, 4.5vh, 56px) !important;
      padding-bottom: clamp(28px, 4.5vh, 56px) !important;
    }
    #swarm-curator-badge {
      position: fixed;
      top: 66px;
      left: 50%;
      transform: translateX(-50%) translateY(-14px);
      z-index: 2147483647;
      pointer-events: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 999px;
      background: rgba(8, 14, 28, 0.9);
      border: 1px solid rgba(16, 185, 129, 0.5);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), 0 0 24px rgba(16, 185, 129, 0.22);
      font: 700 11.5px/1.2 'JetBrains Mono', Consolas, monospace;
      color: #ecfdf5;
      opacity: 0;
      transition: opacity 0.32s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #swarm-curator-badge.is-visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    #swarm-curator-badge .cb-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }

    /* Feature 9: Before vs After Blueprint Hook Stage */
    body.swarm-before-blueprint-stage *:not(#swarm-studio-overlay):not(#swarm-studio-overlay *):not(#swarm-before-after-banner):not(#swarm-before-after-banner *) {
      background-image: none !important;
      box-shadow: none !important;
    }
    body.swarm-before-blueprint-stage img,
    body.swarm-before-blueprint-stage video,
    body.swarm-before-blueprint-stage canvas,
    body.swarm-before-blueprint-stage svg:not(#swarm-svg-layer) {
      filter: grayscale(1) contrast(0.3) opacity(0.22) !important;
      outline: 1.5px dashed rgba(56, 189, 248, 0.7) !important;
      outline-offset: -2px !important;
    }
    body.swarm-before-blueprint-stage h1,
    body.swarm-before-blueprint-stage h2,
    body.swarm-before-blueprint-stage h3,
    body.swarm-before-blueprint-stage p,
    body.swarm-before-blueprint-stage a,
    body.swarm-before-blueprint-stage button,
    body.swarm-before-blueprint-stage .card,
    body.swarm-before-blueprint-stage [class*='card'],
    body.swarm-before-blueprint-stage [class*='bento'],
    body.swarm-before-blueprint-stage .skill-card,
    body.swarm-before-blueprint-stage .mission-card-3d {
      outline: 1.5px dashed rgba(16, 185, 129, 0.62) !important;
      background: rgba(15, 23, 42, 0.28) !important;
      color: rgba(148, 163, 184, 0.55) !important;
      border-color: rgba(16, 185, 129, 0.45) !important;
    }
    #swarm-before-after-banner {
      position: fixed;
      top: 22px;
      left: 50%;
      transform: translateX(-50%) scale(0.92);
      z-index: 2147483647;
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 22px;
      border-radius: 999px;
      background: rgba(7, 11, 20, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1.5px solid #38bdf8;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 28px rgba(56, 189, 248, 0.35);
      font: 800 12.5px/1 'JetBrains Mono', Consolas, monospace;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #f8fafc;
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #swarm-before-after-banner.is-visible {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
    #swarm-before-after-banner.is-after {
      border-color: #10b981;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 32px rgba(16, 185, 129, 0.45);
    }
    #swarm-before-after-banner .ba-tag {
      padding: 4px 9px;
      border-radius: 6px;
      background: #38bdf8;
      color: #04131f;
      font-weight: 900;
      font-size: 11px;
    }
    #swarm-before-after-banner.is-after .ba-tag {
      background: #10b981;
      color: #032217;
    }

    /* -------------------------------------------------------------------------
       FEATURE TOUR MODE STYLES (v3.7 — Luminous Focus Ring & Dynamic Island Pill)
       ------------------------------------------------------------------------- */
    #swarm-tour-spotlight {
      position: fixed;
      pointer-events: none;
      z-index: 2147483646;
      border-radius: 14px;
      border: 2.5px solid var(--brand-color, #10b981);
      /* Luminous Ambient Vignette: Soft 28% vignette keeping UI context alive */
      box-shadow:
        0 0 0 9999px rgba(3, 7, 18, 0.28),
        0 0 28px rgba(var(--brand-rgb, 16, 185, 129), 0.65),
        0 0 70px rgba(var(--brand-rgb, 16, 185, 129), 0.2),
        inset 0 0 16px rgba(var(--brand-rgb, 16, 185, 129), 0.15);
      transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      transform: scale(0.96);
    }
    #swarm-tour-spotlight.is-active {
      opacity: 1;
      transform: scale(1);
    }
    .swarm-tour-target-elevated {
      position: relative !important;
      z-index: 2147483640 !important;
      transform: scale(1.032) translateZ(0) !important;
      transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease !important;
      box-shadow: 0 16px 44px rgba(0, 0, 0, 0.45), 0 0 32px rgba(var(--brand-rgb, 16, 185, 129), 0.4) !important;
    }
    .swarm-tour-bg-dimmed {
      filter: blur(2px) brightness(0.92) !important;
      opacity: 0.85 !important;
      transition: filter 0.45s ease, opacity 0.45s ease !important;
      pointer-events: none !important;
    }
    #swarm-tour-badge {
      position: absolute;
      top: -30px;
      left: 8px;
      background: var(--brand-color, #10b981);
      color: #041a12;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      white-space: nowrap;
    }
    #swarm-tour-caption {
      position: fixed;
      left: 50%;
      z-index: 2147483647;
      background: linear-gradient(135deg, rgba(11, 18, 33, 0.94) 0%, rgba(20, 32, 54, 0.92) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-left: 4px solid var(--brand-color, #10b981);
      box-shadow: 0 24px 50px rgba(0, 0, 0, 0.55), 0 0 30px rgba(var(--brand-rgb, 16, 185, 129), 0.28);
      border-radius: 9999px;
      padding: 9px 24px 9px 12px;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
      max-width: min(92vw, 560px);
      width: auto;
      display: inline-flex;
      align-items: center;
      gap: 14px;
      opacity: 0;
      pointer-events: none;
      transition: all 0.42s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #swarm-tour-caption.is-bottom-docked {
      bottom: 74px;
      top: auto;
      transform: translateX(-50%) translateY(20px);
    }
    #swarm-tour-caption.is-top-docked {
      top: 56px;
      bottom: auto;
      transform: translateX(-50%) translateY(-20px);
    }
    #swarm-tour-caption.is-visible.is-bottom-docked,
    #swarm-tour-caption.is-visible.is-top-docked,
    #swarm-tour-caption.is-visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .tour-caption-act {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--brand-color, #10b981);
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .tour-caption-act::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--brand-color, #10b981);
      box-shadow: 0 0 8px var(--brand-color, #10b981);
      display: inline-block;
    }

    /* Segmented Stories Progress Bar */
    #swarm-tour-story-bar {
      position: fixed;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: min(92vw, 560px);
      display: flex;
      gap: 6px;
      z-index: 2147483646;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    #swarm-tour-story-bar.is-visible {
      opacity: 1;
    }
    .tour-story-segment {
      flex: 1;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 999px;
      overflow: hidden;
      backdrop-filter: blur(4px);
    }
    .tour-story-fill {
      height: 100%;
      width: 0%;
      background: var(--brand-color, #10b981);
      box-shadow: 0 0 8px var(--brand-color, #10b981);
      transition: width 0.12s linear;
    }

    /* Interactive Takeover & Resume Tour Buttons */
    #swarm-tour-sound-btn {
      position: fixed;
      top: 14px;
      right: 148px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #e2e8f0;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      transition: all 0.25s ease;
      opacity: 0;
      pointer-events: none;
    }
    #swarm-tour-sound-btn.is-visible {
      opacity: 1;
      pointer-events: auto;
    }
    #swarm-tour-sound-btn:hover {
      background: rgba(var(--brand-rgb, 16, 185, 129), 0.25);
      border-color: var(--brand-color, #10b981);
      transform: scale(1.08);
    }
    #swarm-tour-takeover-btn {
      position: fixed;
      top: 14px;
      right: 20px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 14px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #e2e8f0;
      font-size: 11.5px;
      font-weight: 700;
      font-family: 'Plus Jakarta Sans', sans-serif;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      transition: all 0.25s ease;
      opacity: 0;
      pointer-events: none;
    }
    #swarm-tour-takeover-btn.is-visible {
      opacity: 1;
      pointer-events: auto;
    }
    #swarm-tour-takeover-btn:hover {
      background: rgba(var(--brand-rgb, 16, 185, 129), 0.25);
      border-color: var(--brand-color, #10b981);
      color: #fff;
      transform: translateY(-1px);
    }
    #swarm-tour-resume-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      display: none;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 999px;
      background: var(--brand-color, #10b981);
      color: #032217;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(var(--brand-rgb, 16, 185, 129), 0.4);
      border: none;
      animation: pulseTourResume 2s infinite ease-in-out;
    }
    #swarm-tour-resume-btn.is-visible {
      display: inline-flex;
    }
    @keyframes pulseTourResume {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Clean Video Mode & Headless Recording Clean Filter */
    body.swarm-tour-clean-mode #swarm-tour-story-bar,
    body.swarm-tour-clean-mode #swarm-tour-caption,
    body.swarm-tour-clean-mode #swarm-tour-badge,
    body.swarm-tour-clean-mode #swarm-tour-sound-btn,
    body.swarm-tour-clean-mode #swarm-tour-takeover-btn,
    body.swarm-tour-clean-mode #swarm-tour-resume-btn,
    body[data-fullscreen-render="true"] #swarm-tour-sound-btn,
    body[data-fullscreen-render="true"] #swarm-tour-takeover-btn,
    body[data-fullscreen-render="true"] #swarm-tour-resume-btn {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    /* Morphing Cursor States & Click-Squish */
    .swarm-agent-cursor.mode-pointer .swarm-agent-icon svg {
      transform: scale(1.08);
    }
    .swarm-agent-cursor.is-squished {
      transform: translate(-50%, -50%) scale(0.82) rotate(-6deg) !important;
      transition: transform 0.08s ease-in !important;
    }
    .tour-underline-highlight {
      position: relative;
    }
    .tour-underline-highlight::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -3px;
      width: 100%;
      height: 3px;
      background: var(--brand-color, #10b981);
      border-radius: 2px;
      box-shadow: 0 0 10px var(--brand-color, #10b981);
      animation: tourUnderlineDraw 0.45s ease-out forwards;
    }
    @keyframes tourUnderlineDraw {
      from { width: 0%; }
      to { width: 100%; }
    }
    .tour-caption-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.25);
    }
    .tour-caption-body {
      flex: 1;
      min-width: 0;
    }
    .tour-caption-title {
      font-size: 13.5px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tour-caption-sub {
      font-size: 11.5px;
      color: #94a3b8;
      line-height: 1.35;
      font-weight: 500;
    }
    .swarm-click-ripple {
      position: fixed;
      pointer-events: none;
      z-index: 2147483647;
      border-radius: 50%;
      border: 2px solid #f43f5e;
      background: rgba(244, 63, 94, 0.25);
      transform: translate(-50%, -50%) scale(0);
      animation: swarmClickPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes swarmClickPop {
      0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(2.8); opacity: 0; }
    }
    #swarm-tour-chapter-card {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.92);
      z-index: 2147483647;
      background: rgba(11, 15, 25, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 32px 80px rgba(0, 0, 0, 0.85), 0 0 40px rgba(16, 185, 129, 0.35);
      border-radius: 20px;
      padding: 24px 28px;
      color: #f8fafc;
      width: 440px;
      max-width: 92vw;
      text-align: left;
      opacity: 0;
      pointer-events: none;
      transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }
    #swarm-tour-chapter-card.is-visible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    .chapter-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .chapter-badge {
      font-size: 11px;
      font-weight: 800;
      background: #10b981;
      color: #032217;
      padding: 3px 8px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
    }
    .chapter-title {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
    }
    .chapter-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .chapter-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.035);
      font-size: 12.5px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .chapter-item .ch-time {
      font-family: 'JetBrains Mono', monospace;
      color: #38bdf8;
      font-size: 11.5px;
    }
    .chapter-item .ch-name {
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 300px;
    }
    .chapter-footer {
      margin-top: 18px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11.5px;
      color: #94a3b8;
    }

    /* Search Live Dropdown Reveal */
    #swarm-tour-search-dropdown {
      position: absolute;
      z-index: 2147483647;
      background: rgba(11, 15, 25, 0.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(16, 185, 129, 0.4);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(16, 185, 129, 0.25);
      border-radius: 10px;
      padding: 6px;
      width: 320px;
      max-width: 90vw;
      font-family: 'Plus Jakarta Sans', sans-serif;
      opacity: 0;
      transform: translateY(-8px);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    #swarm-tour-search-dropdown.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .tour-dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      color: #e2e8f0;
      transition: background 0.2s;
    }
    .tour-dropdown-item.is-selected {
      background: rgba(16, 185, 129, 0.2);
      color: #fff;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }
    .tour-dropdown-item-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #10b981;
      font-weight: 700;
      background: rgba(16, 185, 129, 0.15);
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Floating Toast Notification */
    #swarm-tour-toast {
      position: fixed;
      top: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      z-index: 2147483647;
      background: rgba(16, 185, 129, 0.95);
      color: #032217;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 13px;
      padding: 10px 22px;
      border-radius: 30px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(16, 185, 129, 0.5);
      opacity: 0;
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #swarm-tour-toast.is-visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* Solo Hero Cursor Enhancements */
    .swarm-agent-cursor.is-solo-hero {
      filter: drop-shadow(0 4px 14px rgba(var(--brand-rgb, 16, 185, 129), 0.6)) !important;
      z-index: 2147483647 !important;
    }
    .swarm-agent-cursor.is-solo-hero .swarm-agent-pill {
      background: rgba(11, 15, 25, 0.92) !important;
      border: 1px solid rgba(var(--brand-rgb, 16, 185, 129), 0.45) !important;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 0 12px rgba(var(--brand-rgb, 16, 185, 129), 0.25) !important;
    }

    /* 1:1 Native Camera (Zoom transform disabled for edge clarity & crisp rendering) */
    body.swarm-camera-zoomed {
      transform: none !important;
    }
    .swarm-dof-bokeh {
      filter: blur(2.5px) opacity(0.65) !important;
      transition: filter 0.4s ease, opacity 0.4s ease !important;
    }

    /* Tour Section Picker Toolbar (Mode Pilih Sendiri) */
    #swarm-tour-picker-bar {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      z-index: 2147483647;
      background: rgba(11, 15, 25, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(16, 185, 129, 0.5);
      border-radius: 40px;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 24px rgba(16, 185, 129, 0.3);
      color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      opacity: 0;
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #swarm-tour-picker-bar.is-visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
      pointer-events: auto;
    }
    .tour-picker-info {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 700;
    }
    .tour-picker-count {
      background: #10b981;
      color: #032217;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .btn-tour-launch {
      background: #10b981;
      color: #032217;
      border: none;
      padding: 8px 18px;
      border-radius: 20px;
      font-weight: 800;
      font-size: 12.5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-tour-launch:hover {
      transform: scale(1.05);
      box-shadow: 0 0 16px #10b981;
    }
    .btn-tour-cancel {
      background: rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 8px 14px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-tour-cancel:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.15);
    }

    /* Numbered Badges for Manual Feature Sequence */
    .tour-picked-badge {
      position: absolute;
      z-index: 2147483647;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #10b981;
      color: #032217;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), 0 0 16px #10b981;
      border: 2px solid #fff;
      animation: tourBadgePop 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes tourBadgePop {
      0% { transform: scale(0.2); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    /* Accordion Expand Highlight */
    .tour-accordion-highlight {
      background: rgba(16, 185, 129, 0.08) !important;
      border-radius: 8px;
      transition: background 0.3s;
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
      this.terminalVisible = false;
      this.theme = "figma";
      this.pickerActive = false;
      this.hoveredPickEl = null;
      this.mediaRecorder = null;
      this.mediaStream = null;
      this.recordedChunks = [];
      this.autoTour = true;
      this.speed = 1;
      // Motion Design Mode (G): replaces visible scrolling with shot cuts, transitions & title cards
      this.motionMode = !!window.__rebuildrMotionMode;
      this.motionPendingTitle = null;
      this.motionNextTransition = null;
      this.motionNextShotLabel = null;
      this.lastMotionTransition = null;
      this.motionShotCounter = 0;
      this.motionSceneShotIdx = 1;
      this.restartToken = 0;
      this.hudHidden = false;
      this.tourFeatureCount = 5;
      this.tourNiche = "auto";
      this.tourLanguage = "id";
      this.tourOverlay = "full";
      this.activeArtifacts = new Set();
      this.modifiedElements = new Set();
      this.savedTextNodes = new Map();
      this.savedPlaceholders = new Map();
      this.splitTextRecords = [];
      this.sceneUnitsMap = new Map();
      this.lockedMinHeights = new Map();
      this.cursors = [];
      this.rafId = null;
      this.launchpadOpen = false;
      this.launchpadBackdrop = null;
      this.autoRecordOnLaunch = false;
      this.launchScope = "full";
      this.showcasePreset = "feature-tour";
      this.videoFormat = "16:9";
      this.cameraZoom = false;
      this.dofEnabled = false;
      this.counterRoll = true;
      this.currentFocusTargets = new Set();
      this.currentDofSiblings = new Set();
      this.curatedHiddenEls = new Set();
      this.curatedGridEls = new Set();
      this.dimmedTourSections = new Set();
      this.currentTourTarget = null;
      this.recordedMimeType = "video/webm";
      this.loadPreferences();
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onPickerMove = this.onPickerMove.bind(this);
      this.onPickerClick = this.onPickerClick.bind(this);
      this.onScrollUpdate = this.onScrollUpdate.bind(this);
    }

    onScrollUpdate() {
      if (!this.mobileScrollIndicator || !this.mobileScrollThumb) return;
      const isMobile = window.innerWidth <= 640 || this.videoFormat === "9:16" || this.videoFormat === "4:5" || document.body.classList.contains("swarm-reels-stage");
      if (!isMobile) {
        this.mobileScrollIndicator.classList.remove("is-scrolling");
        return;
      }
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollPct = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const indicatorH = this.mobileScrollIndicator.clientHeight || (window.innerHeight - 32);
      const thumbH = 38;
      const thumbY = scrollPct * (indicatorH - thumbH);
      this.mobileScrollThumb.style.transform = `translateY(${thumbY}px)`;
      this.mobileScrollIndicator.classList.add("is-scrolling");

      clearTimeout(this.mobileScrollTimeout);
      this.mobileScrollTimeout = setTimeout(() => {
        if (this.mobileScrollIndicator) {
          this.mobileScrollIndicator.classList.remove("is-scrolling");
        }
      }, 550);
    }

    loadPreferences() {
      try {
        const raw = localStorage.getItem("__rebuildr_prefs");
        if (raw) {
          const p = JSON.parse(raw);
          if (typeof p.motionMode === "boolean") this.motionMode = p.motionMode;
          if (typeof p.autoRecord === "boolean") this.autoRecordOnLaunch = p.autoRecord;
          if (typeof p.ghostMode === "boolean") this.ghostMode = p.ghostMode;
          this.terminalVisible = false;
          if (typeof p.soundMuted === "boolean") this.sound.muted = p.soundMuted;
          if (p.theme && ["figma", "architect", "cyberpunk"].includes(p.theme)) this.theme = p.theme;
          if (p.speed && [1, 1.5, 2, 3].includes(p.speed)) this.speed = p.speed;
          if (p.videoFormat && ["16:9", "9:16"].includes(p.videoFormat)) {
            this.videoFormat = p.videoFormat;
            this.setVideoFormat(this.videoFormat);
          }
          if (typeof p.cameraZoom === "boolean") this.cameraZoom = p.cameraZoom;
          if (typeof p.dofEnabled === "boolean") this.dofEnabled = p.dofEnabled;
          if (typeof p.counterRoll === "boolean") this.counterRoll = p.counterRoll;
          if (p.launchScope && ["full", "curated", "pick"].includes(p.launchScope)) {
            this.launchScope = p.launchScope;
          }
          if (p.showcasePreset && ["standard", "before-after", "teaser-30s", "feature-tour"].includes(p.showcasePreset)) {
            this.showcasePreset = p.showcasePreset;
          }
        }
      } catch (_) {}
    }

    savePreferences() {
      try {
        const p = {
          motionMode: this.motionMode,
          videoFormat: this.videoFormat,
          cameraZoom: this.cameraZoom,
          dofEnabled: this.dofEnabled,
          counterRoll: this.counterRoll,
          launchScope: this.launchScope,
          showcasePreset: this.showcasePreset,
          autoRecord: this.autoRecordOnLaunch,
          ghostMode: this.ghostMode,
          terminalVisible: this.terminalVisible,
          soundMuted: this.sound.muted,
          theme: this.theme,
          speed: this.speed,
        };
        localStorage.setItem("__rebuildr_prefs", JSON.stringify(p));
      } catch (_) {}
    }

    setVideoFormat(fmt) {
      this.videoFormat = ["9:16", "1:1", "4:5"].includes(fmt) ? fmt : "16:9";
      if (document.body) {
        document.body.classList.toggle("swarm-reels-stage", this.videoFormat === "9:16");
        document.body.classList.toggle("swarm-square-stage", this.videoFormat === "1:1");
        document.body.classList.toggle("swarm-portrait-stage", this.videoFormat === "4:5");
      }
      this.syncLaunchpadUi();
      this.syncHudUi();
    }

    start() {
      if (this.running && !this.launchpadOpen) return;

      this.preparePortfolioStage();
      this.mountOverlay();
      this.syncHudUi();
      this.syncOverlayGhostState();
      window.addEventListener("keydown", this.onKeyDown, true);

      // Context menu direct trigger: start straight in Section Picker mode
      if (window.__swarmStartInPickerMode) {
        delete window.__swarmStartInPickerMode;
        this.running = true;
        this.startCursorLoop();
        this.enableSectionPicker();
        return;
      }

      // Web App / Auto-Launch mode: configure parameters and launch immediately if requested
      if (window.__rebuildrAutoLaunch) {
        const cfg = window.__rebuildrAutoLaunch;
        if (cfg.videoFormat && ["16:9", "9:16", "1:1", "4:5"].includes(cfg.videoFormat)) this.setVideoFormat(cfg.videoFormat);
        if (cfg.showcasePreset && ["standard", "before-after", "teaser-30s", "feature-tour"].includes(cfg.showcasePreset)) this.showcasePreset = cfg.showcasePreset;
        if (cfg.launchScope && ["full", "curated", "pick"].includes(cfg.launchScope)) this.launchScope = cfg.launchScope;
        if (typeof cfg.motionMode === "boolean") {
          this.motionMode = cfg.motionMode;
          window.__rebuildrMotionMode = this.motionMode;
        }
        if (cfg.theme && ["figma", "architect", "cyberpunk"].includes(cfg.theme)) this.theme = cfg.theme;
        if (cfg.speed && [1, 1.5, 2, 2.5, 3].includes(Number(cfg.speed))) this.speed = Number(cfg.speed);
        if (typeof cfg.cameraZoom === "boolean") this.cameraZoom = cfg.cameraZoom;
        if (typeof cfg.dofEnabled === "boolean") this.dofEnabled = cfg.dofEnabled;
        if (typeof cfg.autoRecord === "boolean") this.autoRecordOnLaunch = cfg.autoRecord;
        if (typeof cfg.soundMuted === "boolean") this.sound.muted = cfg.soundMuted;
        if (cfg.bgm) this.bgmMode = cfg.bgm;
        if (cfg.customHookText) this.customHookText = cfg.customHookText;
        if (cfg.targetDuration) this.targetDuration = cfg.targetDuration;
        if (cfg.deviceMockup) this.deviceMockup = cfg.deviceMockup;
        if (cfg.tourFeatureCount) this.tourFeatureCount = cfg.tourFeatureCount;
        if (cfg.tourNiche) this.tourNiche = cfg.tourNiche;
        if (cfg.tourLanguage) this.tourLanguage = cfg.tourLanguage;
        if (cfg.tourOverlay) {
          this.tourOverlay = cfg.tourOverlay;
          document.body.classList.toggle("swarm-tour-clean-mode", this.tourOverlay === "clean");
        }
        if (typeof cfg.ghostMode === "boolean") {
          this.ghostMode = cfg.ghostMode;
          this.syncOverlayGhostState();
        }
        if (typeof cfg.terminalVisible === "boolean") {
          this.terminalVisible = cfg.terminalVisible;
          if (this.terminalEl) this.terminalEl.style.display = this.terminalVisible ? "block" : "none";
        }
        if (cfg.watermark) {
          this.watermark = cfg.watermark;
          if (this.watermarkEl) this.watermarkEl.classList.toggle("is-hidden", this.watermark === "none");
        }
        if (cfg.audioBalance) {
          this.audioBalance = cfg.audioBalance;
          this.sound.setAudioBalance(this.audioBalance);
        }
        this.syncLaunchpadUi();
        this.syncHudUi();

        if (cfg.autoStart) {
          this.launchRebuild();
          return;
        } else {
          // Mode Standby (Siap Diputar): website tampil tenang & utuh tanpa kursor bergerak
          this.paused = true;
          this.running = false;
          if (this.hud) {
            this.updateHudStatus("<strong>⏸ Standby</strong> · Siap diputar kapan saja", 0);
          }
          return;
        }
      }

      // Pre-Flight Launchpad: Show the control center before deconstruction begins!
      this.showLaunchpadModal();
    }

    startCursorLoop() {
      if (this.rafId) return;
      this.lastFrameTime = performance.now();
      const tick = (now) => {
        if (!this.running && !this.pickerActive) return;
        const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000);
        this.lastFrameTime = now;
        if (!this.paused) {
          this.updateCursors(dt, now);
        }
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }

    mountLaunchpad() {
      if (this.launchpadBackdrop && this.launchpadBackdrop.isConnected) return;
      const b = document.createElement("div");
      b.id = "swarm-launchpad-backdrop";
      b.dataset.theme = this.theme;
      b.innerHTML = `
        <div id="swarm-launchpad-modal" role="dialog" aria-modal="true" aria-labelledby="lp-title-text">
          <div class="lp-header">
            <div class="lp-brand">
              <span class="lp-badge">⚡ REBUILDR STUDIO v3.6 · AI DIRECTOR</span>
              <h2 class="lp-title" id="lp-title-text">Pusat Kontrol Perakitan & Showcase</h2>
              <p class="lp-sub">Pilih preset konten viral, kurasi tata letak AI, efek suara sinkron, dan perekaman 60FPS.</p>
            </div>
            <button class="lp-btn-close" id="lp-close-btn" title="Tutup Studio (Esc)">✕</button>
          </div>

          <div class="lp-grid">
            <!-- 0. Format Konten Showcase (Before/After, Teaser 30s, Standard) -->
            <div class="lp-card">
              <div class="lp-card-head">
                <span class="lp-card-icon">🔥</span>
                <div>
                  <strong>Format Konten Showcase (Preset Hook Video)</strong>
                  <small>Pilih gaya pembuka & struktur cerita untuk konten TikTok / Reels / YouTube</small>
                </div>
              </div>
              <div class="lp-seg-group lp-seg-3" id="lp-preset-seg">
                <button type="button" class="lp-seg-btn${this.showcasePreset === "feature-tour" ? " active" : ""}" data-preset="feature-tour">
                  <span class="lp-seg-title">🎯 Feature Tour</span>
                  <span class="lp-seg-desc">Demo fitur interaktif: Spotlight, simulasi aksi & bab</span>
                </button>
                <button type="button" class="lp-seg-btn${this.showcasePreset === "before-after" ? " active" : ""}" data-preset="before-after">
                  <span class="lp-seg-title">🔀 Before vs After</span>
                  <span class="lp-seg-desc">Tampilkan kerangka Blueprint mentah → Rakit dengan 8 AI</span>
                </button>
                <button type="button" class="lp-seg-btn${this.showcasePreset === "teaser-30s" ? " active" : ""}" data-preset="teaser-30s">
                  <span class="lp-seg-title">🔥 30s Viral Teaser</span>
                  <span class="lp-seg-desc">Hook sinematik + Kurasi AI + Layout rapi otomatis</span>
                </button>
                <button type="button" class="lp-seg-btn${this.showcasePreset === "standard" ? " active" : ""}" data-preset="standard">
                  <span class="lp-seg-title">⚡ Standard Live</span>
                  <span class="lp-seg-desc">Rakit langsung komponen demi komponen dari awal</span>
                </button>
              </div>
            </div>

            <!-- 1. Rasio Aspek & Kanvas Video -->
            <div class="lp-card">
              <div class="lp-card-head">
                <span class="lp-card-icon">📐</span>
                <div>
                  <strong>Format Kanvas Video (Rasio Layar)</strong>
                  <small>Pilih rasio kanvas untuk platform tujuan</small>
                </div>
              </div>
              <div class="lp-seg-group" id="lp-format-seg">
                <button type="button" class="lp-seg-btn${this.videoFormat !== "9:16" ? " active" : ""}" data-format="16:9">
                  <span class="lp-seg-title">🖥️ 16:9 Landscape (Desktop / YT)</span>
                  <span class="lp-seg-desc">Layar penuh horizontal sinematik untuk presentasi layar laptop</span>
                </button>
                <button type="button" class="lp-seg-btn${this.videoFormat === "9:16" ? " active" : ""}" data-format="9:16">
                  <span class="lp-seg-title">📱 9:16 Portrait (Reels / TikTok)</span>
                  <span class="lp-seg-desc">Kanvas mobile 440px di tengah, tata letak kartu otomatis 1 kolom</span>
                </button>
              </div>
            </div>

            <!-- 2. Mode Kamera Video -->
            <div class="lp-card">
              <div class="lp-card-head">
                <span class="lp-card-icon">🎬</span>
                <div>
                  <strong>Mode Video & Pergerakan Kamera</strong>
                  <small>Pilih gaya visual pergerakan kamera</small>
                </div>
              </div>
              <div class="lp-seg-group" id="lp-mode-seg">
                <button type="button" class="lp-seg-btn${this.motionMode ? " active" : ""}" data-mode="motion">
                  <span class="lp-seg-title">🎬 Motion Design Mode (G)</span>
                  <span class="lp-seg-desc">Per-section scene, kinetic title card, transisi cerdas adaptif tanpa scroll kasar</span>
                </button>
                <button type="button" class="lp-seg-btn${!this.motionMode ? " active" : ""}" data-mode="scroll">
                  <span class="lp-seg-title">📜 Smooth Scroll Mode</span>
                  <span class="lp-seg-desc">Kamera auto-scroll alami & kontinu mengikuti alur kursor dari atas ke bawah</span>
                </button>
              </div>
            </div>

            <!-- 3. Rekam Video Otomatis -->
            <div class="lp-card lp-card-row">
              <div class="lp-card-head">
                <span class="lp-card-icon">🔴</span>
                <div>
                  <strong>Rekam Video 60FPS + Audio Synth Otomatis (V)</strong>
                  <small>Langsung rekam layar + jalur audio SFX internal ke MP4/WebM dan auto-download saat selesai</small>
                </div>
              </div>
              <label class="lp-switch" title="Aktifkan untuk langsung rekam video + audio SFX saat klik Mulai">
                <input type="checkbox" id="lp-record-check"${this.autoRecordOnLaunch ? " checked" : ""}>
                <span class="lp-slider"></span>
              </label>
            </div>

            <!-- 4. Lingkup Perakitan (Scope) -->
            <div class="lp-card">
              <div class="lp-card-head">
                <span class="lp-card-icon">🎯</span>
                <div>
                  <strong>Lingkup Perakitan & AI Layout Re-arranger (*Scope*)</strong>
                  <small>Rakit seluruh halaman, kurasi & rapikan layout via AI, atau pilih manual</small>
                </div>
              </div>
              <div class="lp-seg-group lp-seg-3" id="lp-scope-seg">
                <button type="button" class="lp-seg-btn${this.launchScope === "full" ? " active" : ""}" data-scope="full">
                  <span class="lp-seg-title">🌐 Seluruh Halaman</span>
                  <span class="lp-seg-desc">Rakit semua alur dari hero hingga footer</span>
                </button>
                <button type="button" class="lp-seg-btn${this.launchScope === "curated" ? " active" : ""}" data-scope="curated">
                  <span class="lp-seg-title">✨ Kurasi AI & Susun Ulang</span>
                  <span class="lp-seg-desc">Filter noise, ambil kartu terbaik & rapatkan grid otomatis</span>
                </button>
                <button type="button" class="lp-seg-btn${this.launchScope === "pick" ? " active" : ""}" data-scope="pick">
                  <span class="lp-seg-title">🎯 Pilih Manual (S)</span>
                  <span class="lp-seg-desc">Klik kartu tertentu untuk demo 5–10 dtk</span>
                </button>
              </div>
            </div>

            <!-- 5. Fitur & Efek Visual Sinematik (Toggles) -->
            <div class="lp-card">
              <div class="lp-card-head">
                <span class="lp-card-icon">✨</span>
                <div>
                  <strong>Efek Visual & Kamera Sinematik</strong>
                  <small>Aktifkan / nonaktifkan fitur live motion design</small>
                </div>
              </div>
              <div class="lp-toggles-list">
                <label class="lp-toggle-item">
                  <input type="checkbox" id="lp-zoom-check"${this.cameraZoom ? " checked" : ""}>
                  <div class="lp-toggle-info">
                    <span class="lp-toggle-name">🎥 Dynamic Camera Zoom & Focus</span>
                    <span class="lp-toggle-hint">Zoom-in halus (scale 1.035x) & elevasi 3D ke elemen yang sedang dirakit</span>
                  </div>
                </label>
                <label class="lp-toggle-item">
                  <input type="checkbox" id="lp-dof-check"${this.dofEnabled ? " checked" : ""}>
                  <div class="lp-toggle-info">
                    <span class="lp-toggle-name">🔍 Depth of Field (DoF Bokeh)</span>
                    <span class="lp-toggle-hint">Efek blur lensa halus (1.8px) hanya pada kartu pasif di latar belakang</span>
                  </div>
                </label>
                <label class="lp-toggle-item">
                  <input type="checkbox" id="lp-counter-check"${this.counterRoll ? " checked" : ""}>
                  <div class="lp-toggle-info">
                    <span class="lp-toggle-name">🔢 Kinetic Number Counter Roll</span>
                    <span class="lp-toggle-hint">Angka statistik & metrik meluncur dinamis ala presentasi Apple / Framer</span>
                  </div>
                </label>
                <label class="lp-toggle-item">
                  <input type="checkbox" id="lp-ghost-check"${this.ghostMode ? " checked" : ""}>
                  <div class="lp-toggle-info">
                    <span class="lp-toggle-name">👻 Mode Ghost Self-Building (C)</span>
                    <span class="lp-toggle-hint">Website merakit dirinya sendiri secara magis tanpa kursor avatar multiplayer</span>
                  </div>
                </label>
                <label class="lp-toggle-item">
                  <input type="checkbox" id="lp-term-check"${this.terminalVisible ? " checked" : ""}>
                  <div class="lp-toggle-info">
                    <span class="lp-toggle-name">💻 Mini Terminal Live Code (T)</span>
                    <span class="lp-toggle-hint">Jendela stream kode VS Code & prompt AI di pojok kiri atas</span>
                  </div>
                </label>
                <label class="lp-toggle-item">
                  <input type="checkbox" id="lp-sound-check"${!this.sound.muted ? " checked" : ""}>
                  <div class="lp-toggle-info">
                    <span class="lp-toggle-name">🔊 Rich Sound Design & SFX (M)</span>
                    <span class="lp-toggle-hint">Suara whoosh kamera, laser scanline, mechanical snap lock & counter tick</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- 6. Tema Blueprint & Kecepatan -->
            <div class="lp-card">
              <div class="lp-card-head">
                <span class="lp-card-icon">🎨</span>
                <div>
                  <strong>Tema Blueprint & Kecepatan</strong>
                  <small>Gaya visual kisi blueprint & tempo animasi</small>
                </div>
              </div>
              <div class="lp-row-flex">
                <div class="lp-sub-group">
                  <span class="lp-sub-label">Tema Blueprint (B):</span>
                  <div class="lp-pill-group" id="lp-theme-pills">
                    <button type="button" class="lp-pill${this.theme === "figma" ? " active" : ""}" data-theme="figma">🎨 Figma</button>
                    <button type="button" class="lp-pill${this.theme === "architect" ? " active" : ""}" data-theme="architect">📐 Architect</button>
                    <button type="button" class="lp-pill${this.theme === "cyberpunk" ? " active" : ""}" data-theme="cyberpunk">⚡ Neon</button>
                  </div>
                </div>
                <div class="lp-sub-group">
                  <span class="lp-sub-label">Kecepatan (1 / 2 / 3):</span>
                  <div class="lp-pill-group" id="lp-speed-pills">
                    <button type="button" class="lp-pill${this.speed === 1 ? " active" : ""}" data-speed="1">1×</button>
                    <button type="button" class="lp-pill${this.speed === 1.5 ? " active" : ""}" data-speed="1.5">1.5×</button>
                    <button type="button" class="lp-pill${this.speed === 2 ? " active" : ""}" data-speed="2">2×</button>
                    <button type="button" class="lp-pill${this.speed === 3 ? " active" : ""}" data-speed="3">3×</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="lp-footer">
            <div class="lp-footer-tips">
              <span>💡 Shortcut: Tekan <strong>Spasi</strong> atau <strong>Enter</strong> untuk langsung mulai</span>
            </div>
            <div class="lp-footer-btns">
              <button type="button" class="lp-btn-secondary" id="lp-cancel-btn">Tutup (Esc)</button>
              <button type="button" class="lp-btn-primary" id="lp-start-btn">
                <span class="lp-play-icon">▶</span>
                <span>MULAI RAKIT SEKARANG</span>
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(b);
      this.launchpadBackdrop = b;
      this.bindLaunchpadEvents();
    }

    bindLaunchpadEvents() {
      if (!this.launchpadBackdrop) return;
      const b = this.launchpadBackdrop;

      b.querySelector("#lp-close-btn")?.addEventListener("click", () => this.onLaunchpadClose());
      b.querySelector("#lp-cancel-btn")?.addEventListener("click", () => this.onLaunchpadClose());
      b.querySelector("#lp-start-btn")?.addEventListener("click", () => this.launchRebuild());

      b.querySelectorAll("#lp-preset-seg .lp-seg-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.showcasePreset = btn.dataset.preset || "standard";
          if (this.showcasePreset === "teaser-30s") {
            this.launchScope = "curated";
            if (this.speed < 1.5) this.speed = 1.5;
          }
          this.syncLaunchpadUi();
          this.syncHudUi();
          this.savePreferences();
        });
      });

      b.querySelectorAll("#lp-format-seg .lp-seg-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.setVideoFormat(btn.dataset.format);
          this.savePreferences();
        });
      });

      b.querySelectorAll("#lp-mode-seg .lp-seg-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.motionMode = btn.dataset.mode === "motion";
          window.__rebuildrMotionMode = this.motionMode;
          this.syncLaunchpadUi();
          this.syncHudUi();
          this.savePreferences();
        });
      });

      b.querySelectorAll("#lp-scope-seg .lp-seg-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.launchScope = btn.dataset.scope || "full";
          this.syncLaunchpadUi();
          this.savePreferences();
        });
      });

      const recCheck = b.querySelector("#lp-record-check");
      if (recCheck) {
        recCheck.addEventListener("change", (e) => {
          this.autoRecordOnLaunch = e.target.checked;
          this.savePreferences();
        });
      }

      const zoomCheck = b.querySelector("#lp-zoom-check");
      if (zoomCheck) {
        zoomCheck.addEventListener("change", (e) => {
          this.cameraZoom = e.target.checked;
          this.savePreferences();
        });
      }

      const dofCheck = b.querySelector("#lp-dof-check");
      if (dofCheck) {
        dofCheck.addEventListener("change", (e) => {
          this.dofEnabled = e.target.checked;
          if (!this.dofEnabled) this.clearFocusAndDof();
          this.savePreferences();
        });
      }

      const counterCheck = b.querySelector("#lp-counter-check");
      if (counterCheck) {
        counterCheck.addEventListener("change", (e) => {
          this.counterRoll = e.target.checked;
          this.savePreferences();
        });
      }

      const ghostCheck = b.querySelector("#lp-ghost-check");
      if (ghostCheck) {
        ghostCheck.addEventListener("change", (e) => {
          this.ghostMode = e.target.checked;
          this.syncOverlayGhostState();
          this.syncHudUi();
          this.savePreferences();
        });
      }

      const termCheck = b.querySelector("#lp-term-check");
      if (termCheck) {
        termCheck.addEventListener("change", (e) => {
          this.terminalVisible = e.target.checked;
          if (this.terminalEl) {
            this.terminalEl.classList.toggle("is-hidden", !this.terminalVisible);
          }
          this.syncHudUi();
          this.savePreferences();
        });
      }

      const soundCheck = b.querySelector("#lp-sound-check");
      if (soundCheck) {
        soundCheck.addEventListener("change", (e) => {
          this.sound.muted = !e.target.checked;
          this.syncHudUi();
          this.savePreferences();
        });
      }

      b.querySelectorAll("#lp-theme-pills .lp-pill").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.theme = btn.dataset.theme;
          if (this.overlay) this.overlay.dataset.theme = this.theme;
          if (this.launchpadBackdrop) this.launchpadBackdrop.dataset.theme = this.theme;
          this.syncLaunchpadUi();
          this.syncHudUi();
          this.savePreferences();
        });
      });

      b.querySelectorAll("#lp-speed-pills .lp-pill").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.speed = Number(btn.dataset.speed);
          this.syncLaunchpadUi();
          this.syncHudUi();
          this.savePreferences();
        });
      });
    }

    showLaunchpadModal() {
      this.mountLaunchpad();
      this.syncLaunchpadUi();
      this.launchpadOpen = true;
      requestAnimationFrame(() => {
        if (this.launchpadBackdrop) {
          this.launchpadBackdrop.classList.add("is-open");
        }
      });
      this.updateHudStatus(
        `<strong>⚙ Pusat Kontrol</strong> · Sesuaikan opsi, lalu klik Mulai atau tekan Spasi`,
        0
      );
      const playBtn = this.hud?.querySelector("#swarm-btn-pause");
      if (playBtn) playBtn.textContent = "▶";
    }

    hideLaunchpadModal() {
      this.launchpadOpen = false;
      if (this.launchpadBackdrop) {
        this.launchpadBackdrop.classList.remove("is-open");
      }
    }

    onLaunchpadClose() {
      this.hideLaunchpadModal();
      if (!this.running) {
        this.stop();
      }
    }

    syncLaunchpadUi() {
      if (!this.launchpadBackdrop) return;
      const b = this.launchpadBackdrop;

      b.querySelectorAll("#lp-preset-seg .lp-seg-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.preset === this.showcasePreset);
      });

      b.querySelectorAll("#lp-format-seg .lp-seg-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.format === this.videoFormat);
      });

      b.querySelectorAll("#lp-mode-seg .lp-seg-btn").forEach((btn) => {
        btn.classList.toggle("active", (btn.dataset.mode === "motion") === this.motionMode);
      });

      b.querySelectorAll("#lp-scope-seg .lp-seg-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.scope === this.launchScope);
      });

      const recCheck = b.querySelector("#lp-record-check");
      if (recCheck) recCheck.checked = !!this.autoRecordOnLaunch;

      const zoomCheck = b.querySelector("#lp-zoom-check");
      if (zoomCheck) zoomCheck.checked = !!this.cameraZoom;

      const dofCheck = b.querySelector("#lp-dof-check");
      if (dofCheck) dofCheck.checked = !!this.dofEnabled;

      const counterCheck = b.querySelector("#lp-counter-check");
      if (counterCheck) counterCheck.checked = !!this.counterRoll;

      const ghostCheck = b.querySelector("#lp-ghost-check");
      if (ghostCheck) ghostCheck.checked = !!this.ghostMode;

      const termCheck = b.querySelector("#lp-term-check");
      if (termCheck) termCheck.checked = !!this.terminalVisible;

      const soundCheck = b.querySelector("#lp-sound-check");
      if (soundCheck) soundCheck.checked = !this.sound.muted;

      b.querySelectorAll("#lp-theme-pills .lp-pill").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.theme === this.theme);
      });

      b.querySelectorAll("#lp-speed-pills .lp-pill").forEach((btn) => {
        btn.classList.toggle("active", Number(btn.dataset.speed) === this.speed);
      });
    }

    syncOverlayGhostState() {
      if (this.overlay) {
        this.overlay.classList.toggle("is-ghost-mode", this.ghostMode);
      }
    }

    async launchRebuild() {
      this.hideLaunchpadModal();
      this.savePreferences();

      this.sound.resume();

      this.running = true;
      this.aborted = false;
      this.paused = false;

      const playBtn = this.hud?.querySelector("#swarm-btn-pause");
      if (playBtn) playBtn.textContent = "⏸️";

      this.startCursorLoop();

      // Start procedural WebAudio BGM if requested
      if (this.bgmMode && this.bgmMode !== "none" && this.bgmMode !== "sfx-only") {
        this.sound.startBgm(this.bgmMode);
      }

      // Inject 3D device mockup styling elements if enabled
      if (this.deviceMockup === "mockup-phone") {
        if (!document.getElementById("swarm-mockup-island")) {
          const island = document.createElement("div");
          island.id = "swarm-mockup-island";
          island.style.cssText = "position:fixed; top:12px; left:50%; transform:translateX(-50%); width:128px; height:34px; background:#000; border-radius:20px; z-index:999999; display:flex; align-items:center; justify-content:space-between; padding:0 12px; box-shadow:0 4px 14px rgba(0,0,0,0.5); pointer-events:none; border:1px solid rgba(255,255,255,0.1);";
          island.innerHTML = `<span style="width:10px; height:10px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span><span style="font-family:-apple-system,BlinkMacSystemFont,monospace; font-size:10px; font-weight:700; color:#e2e8f0; letter-spacing:0.5px;">PRO DISPLAY</span>`;
          document.body.appendChild(island);
          this.activeArtifacts.add(island);
        }
      } else if (this.deviceMockup === "mockup-laptop") {
        if (!document.getElementById("swarm-mockup-laptop-bar")) {
          const bar = document.createElement("div");
          bar.id = "swarm-mockup-laptop-bar";
          bar.style.cssText = "position:fixed; top:0; left:0; right:0; height:24px; background:rgba(15,23,42,0.95); backdrop-filter:blur(8px); z-index:999999; display:flex; align-items:center; justify-content:space-between; padding:0 14px; border-bottom:1px solid rgba(255,255,255,0.08); font-family:-apple-system,BlinkMacSystemFont,sans-serif; font-size:11px; color:#cbd5e1;";
          bar.innerHTML = `<div style="display:flex; align-items:center; gap:6px;"><span style="width:9px; height:9px; border-radius:50%; background:#ef4444;"></span><span style="width:9px; height:9px; border-radius:50%; background:#f59e0b;"></span><span style="width:9px; height:9px; border-radius:50%; background:#10b981;"></span></div><div style="font-weight:600; opacity:0.8;">MacBook Pro · Rebuildr Studio</div><div></div>`;
          document.body.appendChild(bar);
          this.activeArtifacts.add(bar);
        }
      }

      // Start procedural WebAudio synth stream recording for cloud renderer
      if (this.sound && this.sound.recordDest && !this.sound.muted) {
        try {
          const aStream = this.sound.recordDest.stream;
          if (aStream && aStream.getAudioTracks().length > 0) {
            this.audioChunks = [];
            this.audioRecorder = new MediaRecorder(aStream);
            this.audioRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) this.audioChunks.push(e.data);
            };
            this.audioRecorder.start(200);
          }
        } catch (_) {}
      }

      if (this.autoRecordOnLaunch) {
        await this.toggleVideoRecording();
        return;
      }

      if (this.launchScope === "pick") {
        this.enableSectionPicker();
      } else {
        await this.runShowcaseFlow();
      }
    }

    preparePortfolioStage() {
      if (!document.body) return;
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
      if (!document.body) return;
      this.styleEl = document.createElement("style");
      this.styleEl.id = "swarm-studio-styles";
      this.styleEl.textContent = STYLE_CSS;
      (document.head || document.documentElement).appendChild(this.styleEl);

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
      if (!this.terminalVisible) {
        this.terminalEl.classList.add("is-hidden");
        this.terminalEl.style.display = "none";
      }
      this.termLinesEl = this.terminalEl.querySelector("#swarm-term-lines");
      this.termCmdEl = this.terminalEl.querySelector("#swarm-term-cmd");
      this.termModePill = this.terminalEl.querySelector("#swarm-term-mode-pill");

      // Feature Tour Spotlight & Overlay Elements
      this.tourSpotlightEl = document.createElement("div");
      this.tourSpotlightEl.id = "swarm-tour-spotlight";
      this.tourSpotlightBadge = document.createElement("div");
      this.tourSpotlightBadge.id = "swarm-tour-badge";
      this.tourSpotlightEl.appendChild(this.tourSpotlightBadge);
      this.overlay.appendChild(this.tourSpotlightEl);

      this.tourCaptionEl = document.createElement("div");
      this.tourCaptionEl.id = "swarm-tour-caption";
      this.tourCaptionEl.innerHTML = `
        <div class="tour-caption-icon" id="tour-caption-icon">⚡</div>
        <div class="tour-caption-body">
          <div class="tour-caption-title" id="tour-caption-title">Fitur Website</div>
          <div class="tour-caption-sub" id="tour-caption-sub">Keterangan interaksi fitur</div>
        </div>
      `;
      this.overlay.appendChild(this.tourCaptionEl);

      this.tourChapterCard = document.createElement("div");
      this.tourChapterCard.id = "swarm-tour-chapter-card";
      this.overlay.appendChild(this.tourChapterCard);

      // Branding Watermark Pill
      this.watermarkEl = document.createElement("div");
      this.watermarkEl.id = "swarm-branding-watermark";
      this.watermarkEl.innerHTML = `
        <span class="bm-icon">⚡</span>
        <span class="bm-text">REBUILDR <span class="bm-tag">AI 60FPS</span></span>
      `;
      if (this.watermark === "none") {
        this.watermarkEl.classList.add("is-hidden");
      }
      this.overlay.appendChild(this.watermarkEl);

      document.body.appendChild(this.overlay);
      this.ensureTourElements();
      window.addEventListener("scroll", this.onScrollUpdate, { passive: true });
      this.dismissAnnoyancesAndBanners();

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
        <!-- Grup 1: Status & Playback -->
        <div class="swarm-hud-group swarm-hud-playback">
          <div class="swarm-hud-avatars">${avatarsHtml}</div>
          <div class="swarm-hud-status" id="swarm-hud-status"><strong>Rebuildr v3.5</strong> · Siap Merakit Halaman</div>
          <div class="swarm-hud-progress"><div class="swarm-hud-progress-bar" id="swarm-hud-bar"></div></div>
          <button class="swarm-hud-btn" id="swarm-btn-pause" title="Mulai / Jeda / Lanjutkan (Tekan Spasi)">▶</button>
        </div>

        <div class="swarm-hud-divider"></div>

        <!-- Grup 2: Mode Kamera & Lingkup -->
        <div class="swarm-hud-group swarm-hud-modes">
          <button class="swarm-hud-btn${this.motionMode ? " is-active" : ""}" id="swarm-btn-motion" title="Mode Kamera: Motion Design ↔ Scroll (Tekan G)">${this.motionMode ? "🎬 Motion (G)" : "📜 Scroll (G)"}</button>
          <button class="swarm-hud-btn" id="swarm-btn-pick" title="Pilih komponen tertentu untuk dirakit (Tekan S)">🎯 Pilih (S)</button>
        </div>

        <div class="swarm-hud-divider"></div>

        <!-- Grup 3: Toggles Efek Visual -->
        <div class="swarm-hud-group swarm-hud-toggles">
          <button class="swarm-hud-btn${this.ghostMode ? " is-active" : ""}" id="swarm-btn-ghost" title="Mode Ghost: Website merakit sendiri tanpa kursor (Tekan C)">${this.ghostMode ? "👻 Ghost: ON" : "👻 Ghost (C)"}</button>
          <button class="swarm-hud-btn${this.terminalVisible ? " is-active" : ""}" id="swarm-btn-term" title="Tampilkan/Sembunyikan Mini Terminal Live (Tekan T)">💻 Kode (T)</button>
          <button class="swarm-hud-btn" id="swarm-btn-theme" title="Ganti Tema Blueprint (Tekan B)">${this.theme === "architect" ? "📐 CAD" : this.theme === "cyberpunk" ? "⚡ Neon" : "🎨 Figma"}</button>
          <button class="swarm-hud-btn" id="swarm-btn-mute" title="Efek Suara Synth (Tekan M)">${this.sound.muted ? "🔇" : "🔊"}</button>
        </div>

        <div class="swarm-hud-divider"></div>

        <!-- Grup 4: Aksi & Pengaturan -->
        <div class="swarm-hud-group swarm-hud-actions">
          <button class="swarm-hud-btn" id="swarm-btn-record" title="Mulai / Berhenti Rekam Layar 60FPS (Tekan V)">🔴 Video (V)</button>
          <button class="swarm-hud-btn" id="swarm-btn-speed" title="Ubah Kecepatan Animasi (Tekan 1, 2, atau 3)">${this.speed}×</button>
          <button class="swarm-hud-btn" id="swarm-btn-settings" title="Buka Pusat Kontrol / Pengaturan Launchpad">⚙ Opsi</button>
          <button class="swarm-hud-btn" id="swarm-btn-hide" title="Sembunyikan Panel Bawah (Tekan H)">👁️</button>
          <button class="swarm-hud-btn" id="swarm-btn-replay" title="Ulangi dari awal (Tekan R)">↻</button>
          <button class="swarm-hud-btn close-btn" id="swarm-btn-close" title="Keluar (Esc)">✕</button>
        </div>
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
      this.hud.querySelector("#swarm-btn-motion").addEventListener("click", () => {
        this.toggleMotionMode();
      });
      this.hud.querySelector("#swarm-btn-speed").addEventListener("click", (e) => {
        const speeds = [1, 1.5, 2, 3];
        const nextIdx = (speeds.indexOf(this.speed) + 1) % speeds.length;
        this.speed = speeds[nextIdx];
        e.currentTarget.textContent = `${this.speed}×`;
        this.syncLaunchpadUi();
        this.savePreferences();
      });
      this.hud.querySelector("#swarm-btn-mute").addEventListener("click", (e) => {
        this.sound.muted = !this.sound.muted;
        e.currentTarget.textContent = this.sound.muted ? "🔇" : "🔊";
        this.syncLaunchpadUi();
        this.savePreferences();
      });
      this.hud.querySelector("#swarm-btn-settings")?.addEventListener("click", () => {
        if (!this.paused && this.running) {
          this.togglePause();
        }
        this.showLaunchpadModal();
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
      this.syncOverlayGhostState();
      this.syncHudUi();
      this.syncLaunchpadUi();
      this.savePreferences();
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
      if (!this.running) {
        this.launchRebuild();
        return;
      }
      this.paused = !this.paused;
      if (this.motionStage) {
        try {
          this.motionStage.getAnimations({ subtree: true }).forEach((a) => {
            if (this.paused && a.playState === "running") a.pause();
            else if (!this.paused && a.playState === "paused") a.play();
          });
        } catch (_) {}
      }
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
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "REBUILDR_PAUSE_STATE", paused: this.paused }, "*");
        }
      } catch (_) {}
    }

    toggleTerminal() {
      this.terminalVisible = !this.terminalVisible;
      if (this.terminalEl) {
        this.terminalEl.classList.toggle("is-forced-visible", this.terminalVisible);
        this.terminalEl.classList.toggle("is-hidden", !this.terminalVisible);
      }
      this.syncHudUi();
      this.syncLaunchpadUi();
      this.savePreferences();
    }

    toggleMotionMode() {
      this.motionMode = !this.motionMode;
      window.__rebuildrMotionMode = this.motionMode;
      this.syncHudUi();
      this.syncLaunchpadUi();
      this.savePreferences();
      this.logTerminal(
        AGENTS[4],
        "MODE",
        this.motionMode
          ? "camera.mode = 'motion' -> Per-section shots, transitions & title cards"
          : "camera.mode = 'scroll' -> Smooth auto-scroll camera"
      );
      if (this.running && !this.pickerActive && (!this.mediaRecorder || this.mediaRecorder.state !== "recording")) {
        this.restartFromProlog();
      } else {
        this.updateHudStatus(
          this.motionMode
            ? `<strong>🎬 Mode Motion Design</strong> · Tekan R (ulang) atau V (rekam) untuk memulai`
            : `<strong>📜 Mode Scroll</strong> · Tekan R (ulang) atau V (rekam) untuk memulai`
        );
      }
    }

    syncHudUi() {
      if (!this.hud) return;
      const motionBtn = this.hud.querySelector("#swarm-btn-motion");
      if (motionBtn) {
        motionBtn.classList.toggle("is-active", this.motionMode);
        motionBtn.textContent = this.motionMode ? "🎬 Motion (G)" : "📜 Scroll (G)";
      }
      const ghostBtn = this.hud.querySelector("#swarm-btn-ghost");
      if (ghostBtn) {
        ghostBtn.classList.toggle("is-active", this.ghostMode);
        ghostBtn.textContent = this.ghostMode ? "👻 Ghost: ON" : "👻 Ghost (C)";
      }
      const termBtn = this.hud.querySelector("#swarm-btn-term");
      if (termBtn) {
        termBtn.classList.toggle("is-active", this.terminalVisible);
      }
      const themeBtn = this.hud.querySelector("#swarm-btn-theme");
      if (themeBtn) {
        const labels = { figma: "🎨 Figma", architect: "📐 CAD", cyberpunk: "⚡ Neon" };
        themeBtn.textContent = labels[this.theme] || "🎨 Tema";
        themeBtn.classList.toggle("is-active", this.theme !== "figma");
      }
      const speedBtn = this.hud.querySelector("#swarm-btn-speed");
      if (speedBtn) {
        speedBtn.textContent = `${this.speed}×`;
      }
      const muteBtn = this.hud.querySelector("#swarm-btn-mute");
      if (muteBtn) {
        muteBtn.textContent = this.sound.muted ? "🔇" : "🔊";
      }
      const playBtn = this.hud.querySelector("#swarm-btn-pause");
      if (playBtn) {
        if (!this.running) {
          playBtn.textContent = "▶";
          playBtn.classList.remove("is-active");
        } else {
          playBtn.textContent = this.paused ? "▶️" : "⏸️";
          playBtn.classList.toggle("is-active", this.paused);
        }
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
        { id: "architect", label: "📐 CAD" },
        { id: "cyberpunk", label: "⚡ Neon" },
      ];
      const curIdx = themes.findIndex((t) => t.id === this.theme);
      const next = themes[(curIdx + 1) % themes.length];
      this.theme = next.id;
      if (this.overlay) {
        this.overlay.dataset.theme = this.theme;
      }
      if (this.launchpadBackdrop) {
        this.launchpadBackdrop.dataset.theme = this.theme;
      }
      this.syncHudUi();
      this.syncLaunchpadUi();
      this.savePreferences();
      this.logTerminal(AGENTS[2], "THEME", `stage.setBlueprintTheme("${this.theme}")`);
    }

    enableSectionPicker() {
      if (this.pickerActive) return;
      if (this.showcasePreset === "feature-tour") {
        this.enableManualTourBuilder();
        return;
      }
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
      if (this.tourPickerBar) {
        this.disableManualTourBuilder();
      }
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
      if (!target || this.isIgnoredSubtree(target) || (this.tourPickerBar && this.tourPickerBar.contains(target))) {
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
          if (this.showcasePreset === "feature-tour") {
            tag.textContent = `🎯 Tambah ke Urutan Tour: ${name}`;
          } else {
            tag.textContent = `🎯 Rakit Ulang: ${name} (${Math.round(r.width)}×${Math.round(r.height)})`;
          }
        }
      }
    }

    async onPickerClick(e) {
      if (!this.pickerActive) return;
      if (this.hud && this.hud.contains(e.target)) return;
      if (this.tourPickerBar && this.tourPickerBar.contains(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      const targetEl = this.hoveredPickEl || e.target;
      if (this.showcasePreset === "feature-tour") {
        this.addManualTourStep(targetEl);
        return;
      }
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
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            frameRate: { ideal: 60, max: 60 },
            displaySurface: "browser",
          },
          audio: true,
          preferCurrentTab: true,
        });
        this.mediaStream = displayStream;
        this.recordedChunks = [];

        // Combine display video track + direct WebAudio Synth SFX tracks so sound is ALWAYS captured!
        const combinedTracks = [...displayStream.getVideoTracks()];
        const displayAudio = displayStream.getAudioTracks();
        if (displayAudio.length > 0) {
          combinedTracks.push(...displayAudio);
        } else {
          const synthTracks = this.sound.getRecordingAudioTracks();
          if (synthTracks.length > 0) {
            combinedTracks.push(...synthTracks);
          }
        }
        const recordStream = new MediaStream(combinedTracks);

        const mimeTypes = [
          "video/mp4;codecs=avc1,mp4a.40.2",
          "video/mp4;codecs=avc1",
          "video/mp4",
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ];
        const mimeType =
          mimeTypes.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) ||
          "video/webm";
        this.recordedMimeType = mimeType;

        this.mediaRecorder = new MediaRecorder(recordStream, {
          ...(mimeType ? { mimeType } : {}),
          videoBitsPerSecond: 16000000,
        });
        this.mediaRecorder.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) {
            this.recordedChunks.push(ev.data);
          }
        };
        this.mediaRecorder.onstop = () => {
          this.saveRecordedBlob();
        };
        displayStream.getVideoTracks()[0].addEventListener("ended", () => {
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
        const extLabel = mimeType.includes("mp4") ? "MP4" : "WebM";
        this.logTerminal(
          AGENTS[0],
          "REC",
          `Recording 60FPS ${extLabel} + Synth Audio -> Auto-saving on finish`
        );
        // Hide bottom HUD bar for a clean video and restart from Prolog
        if (!this.hudHidden) {
          this.toggleHudVisibility();
        }
        await this.restartFromProlog();
      } catch (err) {
        this.logTerminal(AGENTS[0], "REC", "Screen capture cancelled -> Proceeding with live build");
        if (this.running && !this.aborted) {
          if (this.launchScope === "pick") this.enableSectionPicker();
          else await this.runShowcaseFlow();
        }
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
      const mime = this.recordedMimeType || "video/webm";
      const isMp4 = mime.includes("mp4");
      const ext = isMp4 ? "mp4" : "webm";
      const blob = new Blob(this.recordedChunks, { type: isMp4 ? "video/mp4" : "video/webm" });
      this.recordedChunks = [];
      const hostSlug = (location.hostname || document.title || "showcase")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 24) || "showcase";
      const fmtSlug = this.videoFormat === "9:16" ? "9x16-reels" : "16x9-hd";
      const filename = `rebuildr-${hostSlug}-${fmtSlug}-${Date.now()}.${ext}`;

      // Expose to window & parent for Web App & Headless Auto-Render
      window.__rebuildrLastVideoBlob = blob;
      window.__rebuildrLastVideoFilename = filename;
      window.__rebuildrLastVideoMime = mime;

      // Convert to base64 for seamless headless Puppeteer extraction
      const reader = new FileReader();
      reader.onloadend = () => {
        window.__rebuildrLastVideoBase64 = reader.result;
        this.notifyReconstructionComplete();
        window.dispatchEvent(
          new CustomEvent("rebuildr:video-ready", {
            detail: { blob, filename, mime, ext, base64: reader.result },
          })
        );
        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage(
              { type: "rebuildr:video-ready", filename, mime, ext, base64: reader.result },
              "*"
            );
          } catch (_) {}
        }
      };
      reader.readAsDataURL(blob);

      // Trigger standard browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 2500);
      this.logTerminal(AGENTS[0], "SAVED", `Video exported (${ext.toUpperCase()}) to Downloads!`);
    }

    notifyReconstructionComplete() {
      if (this.sound) {
        this.sound.stopBgm();
      }
      if (this.audioRecorder && this.audioRecorder.state !== "inactive") {
        try {
          this.audioRecorder.onstop = () => {
            const blob = new Blob(this.audioChunks, { type: "audio/webm" });
            const reader = new FileReader();
            reader.onloadend = () => {
              window.__rebuildrAudioBase64 = reader.result;
              window.__rebuildrReconstructionDone = true;
              window.dispatchEvent(new CustomEvent("rebuildr:done"));
              if (window.parent && window.parent !== window) {
                try {
                  window.parent.postMessage({ type: "rebuildr:done" }, "*");
                } catch (_) {}
              }
            };
            reader.readAsDataURL(blob);
          };
          this.audioRecorder.stop();
          return;
        } catch (_) {}
      }
      window.__rebuildrReconstructionDone = true;
      window.dispatchEvent(new CustomEvent("rebuildr:done"));
      if (window.parent && window.parent !== window) {
        try {
          window.parent.postMessage({ type: "rebuildr:done" }, "*");
        } catch (_) {}
      }
    }

    onKeyDown(e) {
      if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        if (e.key === "Escape") {
          e.preventDefault();
          this.stop();
        }
        return;
      }

      // Special key handling when Pre-Flight Launchpad Modal is open
      if (this.launchpadOpen) {
        if (e.key === "Enter" || e.key === " " || e.code === "Space") {
          e.preventDefault();
          this.launchRebuild();
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          this.onLaunchpadClose();
          return;
        }
        if (e.key === "g" || e.key === "G") {
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            this.toggleMotionMode();
            return;
          }
        }
        if (e.key === "v" || e.key === "V") {
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.autoRecordOnLaunch = !this.autoRecordOnLaunch;
            this.syncLaunchpadUi();
            this.savePreferences();
            return;
          }
        }
        if (e.key === "c" || e.key === "C") {
          e.preventDefault();
          this.toggleGhostMode();
          return;
        }
        if (e.key === "t" || e.key === "T") {
          e.preventDefault();
          this.toggleTerminal();
          return;
        }
        if (e.key === "b" || e.key === "B") {
          e.preventDefault();
          this.cycleTheme();
          return;
        }
        if (e.key === "m" || e.key === "M") {
          e.preventDefault();
          this.sound.muted = !this.sound.muted;
          this.syncLaunchpadUi();
          this.syncHudUi();
          this.savePreferences();
          return;
        }
        if (["1", "2", "3"].includes(e.key)) {
          e.preventDefault();
          this.speed = Number(e.key);
          this.syncLaunchpadUi();
          this.syncHudUi();
          this.savePreferences();
          return;
        }
        if (e.key === "s" || e.key === "S") {
          if (!e.altKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.launchScope = this.launchScope === "full" ? "pick" : "full";
            this.syncLaunchpadUi();
            return;
          }
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
      } else if (e.key === "g" || e.key === "G") {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        e.preventDefault();
        this.toggleMotionMode();
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
      el.style.removeProperty("--swarm-scan-scale");
      el.style.removeProperty("--swarm-scan-blur");
      el.style.removeProperty("--swarm-shell-color");
      if (this.lockedMinHeights && this.lockedMinHeights.has(el)) {
        const rec = this.lockedMinHeights.get(el);
        if (rec.prevMinH) el.style.minHeight = rec.prevMinH;
        else el.style.removeProperty("min-height");
        this.lockedMinHeights.delete(el);
      }
      el.classList.add("swarm-releasing");
      setTimeout(() => {
        el.classList.remove("swarm-releasing");
      }, 540);
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

        // Draw connecting construction line from previous vertex (Smooth Motion Stroke Draw)
        if (i > 0) {
          const [prevX, prevY] = pts[i - 1];
          const edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
          edge.setAttribute("class", "swarm-svg-edge");
          edge.setAttribute("x1", prevX.toFixed(1));
          edge.setAttribute("y1", prevY.toFixed(1));
          edge.setAttribute("x2", px.toFixed(1));
          edge.setAttribute("y2", py.toFixed(1));
          edge.setAttribute("stroke", color2);
          edge.setAttribute("stroke-width", "1.5");
          edge.setAttribute("opacity", "0.82");
          g.appendChild(edge);
        }

        // Draw vertex anchor handle (`□`) + coordinate label on key vertices (Spring Pop)
        const vNode = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        vNode.setAttribute("class", "swarm-svg-vertex");
        vNode.setAttribute("x", (px - 4).toFixed(1));
        vNode.setAttribute("y", (py - 4).toFixed(1));
        vNode.setAttribute("width", "8");
        vNode.setAttribute("height", "8");
        vNode.setAttribute("rx", "2");
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

        // Draw completed low-poly triangles (Smooth Motion Bloom)
        for (const [a, b, c] of tris) {
          if (
            drawnVertices.includes(a) &&
            drawnVertices.includes(b) &&
            drawnVertices.includes(c) &&
            (a === i || b === i || c === i)
          ) {
            const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            poly.setAttribute("class", "swarm-svg-poly");
            const pStr = `${pts[a][0].toFixed(1)},${pts[a][1].toFixed(1)} ${pts[b][0].toFixed(1)},${pts[b][1].toFixed(1)} ${pts[c][0].toFixed(1)},${pts[c][1].toFixed(1)}`;
            poly.setAttribute("points", pStr);
            poly.setAttribute("fill", (a + b + c) % 2 === 0 ? `${color1}26` : `${color2}24`);
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
        el.style.setProperty("--swarm-scan-scale", "1.024");
        el.style.setProperty("--swarm-scan-blur", "4px");
        el.classList.remove("swarm-hidden");
        el.classList.add("swarm-scan-reveal");

        const scanLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        scanLine.setAttribute("x1", rect.left.toFixed(1));
        scanLine.setAttribute("x2", rect.right.toFixed(1));
        scanLine.setAttribute("stroke", "#10b981");
        scanLine.setAttribute("stroke-width", "3");
        scanLine.style.filter = "drop-shadow(0 0 8px #10b981)";
        g.appendChild(scanLine);

        const sweepDuration = (isCharacter ? 940 : 460) / this.speed;
        this.sound.playLaserSweep(sweepDuration);
        let t0 = performance.now();
        let lastNow = t0;
        await new Promise((resolve) => {
          const step = (now) => {
            if (!this.running || this.aborted) return resolve();
            if (this.paused) {
              t0 += now - lastNow;
              lastNow = now;
              return requestAnimationFrame(step);
            }
            lastNow = now;
            const p = Math.min(1, (now - t0) / sweepDuration);
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            const bottomInset = ((1 - ease) * 100).toFixed(1);
            const curScale = (1 + (1 - ease) * 0.024).toFixed(4);
            const curBlur = ((1 - ease) * 4).toFixed(2);
            el.style.setProperty("--swarm-clip", `inset(0 0 ${bottomInset}% 0)`);
            el.style.setProperty("--swarm-scan-scale", curScale);
            el.style.setProperty("--swarm-scan-blur", `${curBlur}px`);

            const scanY = rect.top + rect.height * ease;
            scanLine.setAttribute("y1", scanY.toFixed(1));
            scanLine.setAttribute("y2", scanY.toFixed(1));
            g.style.opacity = (1 - ease * 0.72).toFixed(2);

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

        this.sound.playLockSnap(1.18);
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
      this.sound.playLockSnap(1.08);

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
      if (
        el.closest(
          "script, style, svg, .card-back, .swarm-curated-omit, #swarm-studio-overlay, #swarm-studio-hud, #swarm-launchpad-backdrop, #swarm-curator-badge, #swarm-before-after-banner, .eye-calibration-overlay, .eye-debug-boxes, .character-zzz-floating, #rpg-radar-panel, #rpg-project-bridge, .lofi-radio-drawer, .mobile-nav-drawer, #hidden-secret-trigger"
        )
      ) {
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

        // CRITICAL: Preserve natural rendered height on both unit and its parent card/row
        // before clearing text, so layout NEVER collapses ("ke-enter ke bawah") during typing!
        const cardParent = unitEl.closest(
          ".timeline-node, .skill-card, .mission-card-3d, .rpg-status-card, article, [class*='card'], [class*='item'], [class*='post'], li"
        );
        if (cardParent && !this.lockedMinHeights.has(cardParent)) {
          const cRect = cardParent.getBoundingClientRect();
          if (cRect.height > 18) {
            this.lockedMinHeights.set(cardParent, {
              prevMinH: cardParent.style.minHeight || "",
            });
            cardParent.style.minHeight = `${Math.round(cRect.height)}px`;
          }
        }
        if (unitEl && unitEl !== cardParent && !this.lockedMinHeights.has(unitEl)) {
          const uRect = unitEl.getBoundingClientRect();
          if (uRect.height > 14) {
            this.lockedMinHeights.set(unitEl, {
              prevMinH: unitEl.style.minHeight || "",
            });
            unitEl.style.minHeight = `${Math.round(uRect.height)}px`;
          }
        }

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

      // Feature 7F: Kinetic Rolling Number Counter Animation (Apple / Framer Keynote style)
      if (this.counterRoll && unit.entries && unit.entries.length === 1) {
        const item = unit.entries[0];
        const rawText = (item.fullText || "").trim();
        const numMatch = rawText.match(/^([^\d]*)(\d+)([^\d]*.*)$/);
        if (numMatch && numMatch[2].length <= 5) {
          const prefix = numMatch[1];
          const targetNum = parseInt(numMatch[2], 10);
          const suffix = numMatch[3];
          if (targetNum > 0) {
            cursor.busy = true;
            this.setCursorMode(cursor, "pointer", "COUNTER", `${cursor.agent.name} · ${rawText}`);
            this.logTerminal(
              cursor.agent,
              "COUNTER",
              `counter.roll({ to: ${targetNum}, ease: "power3.out" })`
            );
            if (el) el.classList.add("swarm-counter-rolling");

            const r = el ? el.getBoundingClientRect() : { left: cursor.tx, top: cursor.ty, width: 40, height: 20 };
            if (r.width > 0) {
              cursor.tx = r.left + r.width * 0.5;
              cursor.ty = r.top + r.height * 0.5;
            }

            const rollDuration = Math.max(220, Math.min(520, (280 + Math.min(targetNum, 50) * 4) / this.speed));
            const t0 = performance.now();
            let lastAudioNow = t0;
            const startVal = targetNum > 50 ? Math.floor(targetNum * 0.35) : 0;

            await new Promise((resolve) => {
              const step = (now) => {
                if (!this.running || this.aborted) return resolve();
                if (this.paused) return requestAnimationFrame(step);
                const p = Math.min(1, (now - t0) / rollDuration);
                const ease = 1 - Math.pow(1 - p, 3.2);
                const curVal = Math.round(startVal + (targetNum - startVal) * ease);
                item.node.nodeValue = `${prefix}${curVal}${suffix}`;

                if (now - lastAudioNow > 44) {
                  this.sound.playCounterTick(p);
                  lastAudioNow = now;
                }

                if (p < 1) requestAnimationFrame(step);
                else resolve();
              };
              requestAnimationFrame(step);
            });

            item.node.nodeValue = item.fullText;
            this.savedTextNodes.delete(item.node);
            if (el) el.classList.remove("swarm-counter-rolling");
            this.sound.playLockSnap(1.22);

            if (pillFrame) this.finishSelectionFrame(pillFrame);
            if (unit.isPill) this.releaseElementToNative(el);

            this.setCursorMode(cursor, "pointer", cursor.agent.role, cursor.agent.name);
            cursor.busy = false;
            return;
          }
        }
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

            // Adaptive Camera Follow: If typing newly wrapped lines pushes caret into HUD zone, gently micro-scroll!
            const vh = window.innerHeight;
            const bottomSafe = vh - 76;
            if (cr.bottom > bottomSafe && !this.motionMode) {
              const over = Math.round(cr.bottom - bottomSafe + 16);
              const scroller = this.getScroller();
              if (scroller) {
                const isWin = scroller === document.body || scroller === document.documentElement;
                if (isWin) window.scrollBy({ top: over, behavior: "auto" });
                else scroller.scrollTop += over;
              }
            }
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
      this.logTerminal(cursor.agent, "DATA", `gsap.to(skillBar, { width: "${targetPct}%", ease: "expo.out" })`);
      const dur = 340 / this.speed;
      let t0 = performance.now();
      let lastNow = t0;
      await new Promise((resolve) => {
        const step = (now) => {
          if (!this.running || this.aborted) return resolve();
          if (this.paused) {
            t0 += now - lastNow;
            lastNow = now;
            return requestAnimationFrame(step);
          }
          lastNow = now;
          const p = Math.min(1, (now - t0) / dur);
          const ease = 1 - Math.pow(1 - p, 3.2);
          const curPct = targetPct * ease;
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

    applyFocusAndDof(targets) {
      if (!this.cameraZoom && !this.dofEnabled) return;
      this.clearFocusAndDof();
      const rawList = Array.isArray(targets) ? targets : [targets];
      const validTargets = rawList.filter(
        (el) => el && el.nodeType === 1 && !this.isIgnoredSubtree(el)
      );
      if (validTargets.length === 0) return;

      if (this.cameraZoom) {
        for (const t of validTargets) {
          t.classList.add("swarm-focus-target");
          this.currentFocusTargets.add(t);
        }
      }

      if (this.dofEnabled) {
        // Build complete protection set: active targets, their ancestors, and their descendants must NEVER be blurred!
        const protectedSet = new Set();
        for (const t of validTargets) {
          protectedSet.add(t);
          let p = t.parentElement;
          while (p && p !== document.body && p !== document.documentElement) {
            protectedSet.add(p);
            p = p.parentElement;
          }
          if (t.querySelectorAll) {
            t.querySelectorAll("*").forEach((child) => protectedSet.add(child));
          }
        }

        const STRUCTURAL_TAGS = new Set([
          "BODY", "HTML", "MAIN", "SECTION", "NAV", "HEADER", "FOOTER", "ASIDE", "ARTICLE"
        ]);

        const parents = new Set();
        for (const t of validTargets) {
          if (t.parentElement) parents.add(t.parentElement);
        }

        for (const p of parents) {
          // Skip if parent is a high-level body/main/section/scene container
          if (STRUCTURAL_TAGS.has(p.tagName) || (p.classList && p.classList.contains("story-scene"))) {
            continue;
          }

          for (const child of Array.from(p.children)) {
            if (
              child.nodeType === 1 &&
              !protectedSet.has(child) &&
              !this.isIgnoredSubtree(child) &&
              !STRUCTURAL_TAGS.has(child.tagName) &&
              !child.id?.includes("character") &&
              !child.className?.includes("character") &&
              !child.classList.contains("swarm-focus-target")
            ) {
              child.classList.add("swarm-dof-soften");
              this.currentDofSiblings.add(child);
            }
          }
        }
      }
    }

    clearFocusAndDof() {
      if (this.currentFocusTargets) {
        for (const el of this.currentFocusTargets) {
          el.classList.remove("swarm-focus-target");
        }
        this.currentFocusTargets.clear();
      }
      if (this.currentDofSiblings) {
        for (const el of this.currentDofSiblings) {
          el.classList.remove("swarm-dof-soften");
        }
        this.currentDofSiblings.clear();
      }
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

      this.applyFocusAndDof(validContainers.length > 0 ? validContainers : validScopes);

      try {
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
      } finally {
        this.clearFocusAndDof();
      }
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
      this.sound.playLockSnap(1.0);
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
    // 6D. AI PAGE CURATOR & SMART LAYOUT RE-ARRANGER + SHOWCASE HOOKS
    // -------------------------------------------------------------------------
    scoreCardImportance(card) {
      if (!card || card.nodeType !== 1) return 0;
      let score = 10;
      if (card.hasAttribute("data-curate-priority")) {
        const p = card.getAttribute("data-curate-priority");
        if (p === "high") score += 75;
        else if (p === "low") score -= 60;
      }
      if (card.classList.contains("featured") || card.classList.contains("is-featured")) score += 45;
      if (card.querySelector("img, video, canvas, svg")) score += 32;
      const txt = (card.textContent || "").trim();
      if (/\b\d+(\.\d+)?(%|x|\+|k|m|ms|fps)\b/i.test(txt)) score += 28;
      if (card.querySelector("button, a.btn, [class*='badge'], [class*='pill'], [class*='tag']")) score += 18;
      if (txt.length >= 28 && txt.length <= 240) score += 15;
      else if (txt.length > 420) score -= 20;
      return score;
    }

    curateAndRestructurePage() {
      this.restoreCuratedLayout();
      if (this.launchScope !== "curated" && this.showcasePreset !== "teaser-30s") return;

      let omittedCount = 0;
      let reflowedGrids = 0;
      let totalScanned = 0;

      // 1. Hide low-value noise & clutter sections/elements
      const noiseSel =
        "[data-curate='omit'], .faq-section, [class*='faq-section'], [class*='cookie-banner'], [class*='newsletter-box'], [class*='disclaimer'], aside.clutter-sidebar, footer .footer-links-matrix";
      document.body.querySelectorAll(noiseSel).forEach((el) => {
        if (this.isIgnoredSubtree(el)) return;
        el.classList.add("swarm-curated-omit");
        this.curatedHiddenEls.add(el);
        omittedCount++;
        totalScanned++;
      });

      // 2. Analyze card grids, keep top-scoring cards & reflow layout so no empty grid cells remain!
      const gridSel =
        ".projects-grid, .skills-pill-group, .bento-grid, [class*='bento-grid'], [class*='features-grid'], [class*='cards-grid'], [class*='metrics-grid'], [data-curate-grid]";
      document.body.querySelectorAll(gridSel).forEach((grid) => {
        if (this.isIgnoredSubtree(grid)) return;
        const children = Array.from(grid.children).filter(
          (ch) => ch.nodeType === 1 && !ch.classList.contains("swarm-curated-omit")
        );
        totalScanned += children.length;
        const isSkillGroup = grid.classList.contains("skills-pill-group");
        const maxKeep = isSkillGroup ? 2 : this.videoFormat === "9:16" ? 3 : 4;

        if (children.length > maxKeep) {
          const scored = children.map((el, idx) => ({
            el,
            idx,
            score: this.scoreCardImportance(el) - idx * 0.5,
          }));
          scored.sort((a, b) => b.score - a.score);
          const keepSet = new Set(scored.slice(0, maxKeep).map((item) => item.el));

          children.forEach((ch) => {
            if (!keepSet.has(ch)) {
              ch.classList.add("swarm-curated-omit");
              this.curatedHiddenEls.add(ch);
              omittedCount++;
            }
          });

          if (!isSkillGroup) {
            grid.classList.add("swarm-curated-grid-reflow");
            this.curatedGridEls.add(grid);
          }
          reflowedGrids++;
        }
      });

      document.body.classList.add("swarm-curated-layout");

      // Show sleek floating AI Curator summary pill
      if (omittedCount > 0 || reflowedGrids > 0) {
        this.logTerminal(
          AGENTS[0],
          "CURATE",
          `ai.curator({ scanned: ${totalScanned}, omitted: ${omittedCount}, reflowedGrids: ${reflowedGrids} })`
        );
        const badge = document.createElement("div");
        badge.id = "swarm-curator-badge";
        badge.innerHTML = `<span class="cb-dot"></span><span>✨ AI Curator · Memilih komponen terbaik (${omittedCount} elemen disaring) & menyusun ulang ${reflowedGrids || 1} tata letak grid</span>`;
        document.body.appendChild(badge);
        this.activeArtifacts.add(badge);
        requestAnimationFrame(() => badge.classList.add("is-visible"));
        setTimeout(() => {
          badge.classList.remove("is-visible");
          setTimeout(() => this.removeArtifact(badge), 360);
        }, 3100);
      }
    }

    restoreCuratedLayout() {
      if (this.curatedHiddenEls) {
        for (const el of this.curatedHiddenEls) {
          el.classList.remove("swarm-curated-omit");
        }
        this.curatedHiddenEls.clear();
      }
      if (this.curatedGridEls) {
        for (const g of this.curatedGridEls) {
          g.classList.remove("swarm-curated-grid-reflow");
        }
        this.curatedGridEls.clear();
      }
      document.body.classList.remove("swarm-curated-layout", "swarm-before-blueprint-stage");
      document.getElementById("swarm-curator-badge")?.remove();
      document.getElementById("swarm-before-after-banner")?.remove();
    }

    async playShowcasePresetHook() {
      if (!this.running || this.aborted) return;

      if (this.showcasePreset === "before-after") {
        this.jumpScrollTo(0);
        document.body.classList.add("swarm-before-blueprint-stage");

        const custom = (this.customHookText || "").trim();
        const beforeTxt = custom
          ? (custom.includes("->") ? custom.split("->")[0].trim() : custom)
          : "RAW WIREFRAME SKELETON · 0% STYLING";
        const afterTxt = custom
          ? (custom.includes("->") ? custom.split("->")[1].trim() : "RECONSTRUCTED LIVE BY 8 AI AGENTS ⚡")
          : "RECONSTRUCTED LIVE BY 8 AI AGENTS ⚡";

        const banner = document.createElement("div");
        banner.id = "swarm-before-after-banner";
        banner.innerHTML = `<span class="ba-tag">BEFORE</span><span>${beforeTxt}</span>`;
        document.body.appendChild(banner);
        this.activeArtifacts.add(banner);
        requestAnimationFrame(() => banner.classList.add("is-visible"));

        this.updateHudStatus(`<strong>🔀 BEFORE</strong> · ${beforeTxt}`, 6);
        this.logTerminal(AGENTS[2], "HOOK", `stage.render("BEFORE: ${beforeTxt}")`);
        this.sound.playLaserSweep(680);

        // Sweep cursors across the viewport as if scanning the raw wireframe
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        this.cursors.forEach((c, idx) => {
          c.busy = true;
          this.setCursorMode(c, "pen", "SCAN", `${c.agent.name} · Scan Blueprint`);
          c.tx = vw * (0.15 + (idx / 8) * 0.7);
          c.ty = vh * (0.22 + (idx % 3) * 0.22);
        });
        await this.sleep(1650);
        if (!this.running || this.aborted) {
          document.body.classList.remove("swarm-before-blueprint-stage");
          this.removeArtifact(banner);
          return;
        }

        // Flash transition to AFTER
        this.sound.playWhoosh(1.25);
        this.sound.playLockSnap(1.2);
        document.body.classList.remove("swarm-before-blueprint-stage");
        banner.classList.add("is-after");
        banner.innerHTML = `<span class="ba-tag">AFTER</span><span>${afterTxt}</span>`;
        this.updateHudStatus(`<strong>⚡ AFTER</strong> · ${afterTxt}`, 12);
        this.logTerminal(AGENTS[0], "HOOK", `stage.transition("AFTER: ${afterTxt}")`);

        this.cursors.forEach((c) => {
          c.busy = false;
        });

        setTimeout(() => {
          if (banner.isConnected) {
            banner.classList.remove("is-visible");
            setTimeout(() => this.removeArtifact(banner), 380);
          }
        }, 1600);
      } else if (this.showcasePreset === "teaser-30s") {
        this.launchScope = "curated";
        const stage = this.ensureMotionStage();
        const host =
          location.hostname ||
          (document.title || "Rebuildr Studio").split(/[—|·-]/)[0].trim() ||
          "Rebuildr Studio";
        this.sound.playWhoosh(1.15);
        await this.playTitleCard(stage, {
          num: "⚡",
          kicker: this.customHookText ? "SPECIAL HOOK // FEATURED" : "AI SWARM SHOWCASE // 30s TEASER",
          title: this.customHookText || document.title || "Live AI Website Reconstruction",
          sub: `8 AI Agents · Smart Layout Curation · ${host}`,
          counter: "Hook 01",
          corner: host,
        });
      }
    }

    // -------------------------------------------------------------------------
    // 7. SCENE-BY-SCENE GRANULAR ORCHESTRATION
    // -------------------------------------------------------------------------
    getOrderedScenes() {
      const all = Array.from(document.querySelectorAll(".story-scene[id]"));
      if (this.launchScope === "curated") {
        let curatedIds = ["scene-prolog", "scene-skills", "scene-projects", "scene-timeline"];
        if (this.targetDuration === "15s") {
          curatedIds = ["scene-prolog", "scene-skills"];
          this.speed = Math.max(this.speed, 2.0);
        } else if (this.targetDuration === "60s") {
          curatedIds = ["scene-prolog", "scene-whoami", "scene-skills", "scene-projects", "scene-timeline"];
        }
        return all.filter((s) => curatedIds.includes(s.id));
      }
      return all;
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
      const token = ++this.restartToken;
      this.aborted = true;
      this.paused = false;
      const pauseBtn = this.hud?.querySelector("#swarm-btn-pause");
      if (pauseBtn) {
        pauseBtn.classList.remove("is-active");
        pauseBtn.textContent = "⏸️";
      }
      await new Promise((r) => setTimeout(r, 90));
      if (!this.running || token !== this.restartToken) return;
      this.restoreAllModifiedElements();
      this.clearActiveArtifacts();

      this.jumpScrollTo(0);
      if (document.querySelector(".story-scene")) {
        document.body.dataset.scene = "scene-prolog";
      }
      if (this.overlay) {
        this.overlay.classList.add("is-building");
      }
      await new Promise((r) => setTimeout(r, 90));
      if (!this.running || token !== this.restartToken) return;

      this.aborted = false;
      this.runShowcaseFlow(0);
    }

    // =========================================================================
    // FEATURE TOUR ENGINE (Solo Hero Presenter & High-Impact Demo Showcase)
    // =========================================================================

    detectWebsiteBrandColor() {
      const rootStyle = window.getComputedStyle(document.documentElement);
      const bodyStyle = window.getComputedStyle(document.body);
      const candidates = [
        rootStyle.getPropertyValue("--primary"),
        rootStyle.getPropertyValue("--emerald"),
        rootStyle.getPropertyValue("--brand"),
        rootStyle.getPropertyValue("--accent"),
        bodyStyle.getPropertyValue("--primary"),
      ].map((c) => c.trim()).filter(Boolean);

      for (let c of candidates) {
        if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c) || /^rgb/i.test(c)) return c;
      }

      const primaryBtn = document.querySelector(".btn-primary, button[class*='primary'], a[class*='primary'], .brand-dot");
      if (primaryBtn) {
        const bg = window.getComputedStyle(primaryBtn).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          return bg;
        }
      }

      return "#10b981"; // Fallback to classic Emerald
    }

    applyWebsiteBrandColor() {
      const color = this.detectWebsiteBrandColor();
      document.documentElement.style.setProperty("--brand-color", color);
      const tmp = document.createElement("div");
      tmp.style.color = color;
      document.body.appendChild(tmp);
      const cs = window.getComputedStyle(tmp).color;
      tmp.remove();
      const m = cs.match(/\d+/g);
      if (m && m.length >= 3) {
        document.documentElement.style.setProperty("--brand-rgb", `${m[0]}, ${m[1]}, ${m[2]}`);
      }
      if (this.cursors && this.cursors[0]) {
        this.cursors[0].agent.color = color;
        this.cursors[0].el.style.setProperty("--agent-color", color);
      }
    }

    detectWebsiteNiche() {
      const htmlLang = (document.documentElement.lang || document.querySelector('meta[http-equiv="content-language"]')?.content || "").toLowerCase();
      const isEnglish = this.tourLanguage === "en" || (!this.tourLanguage && htmlLang.startsWith("en"));

      const dict = {
        saas: {
          niche: "saas",
          sampleSearch: isEnglish ? "Cloud Neural Grid Pipeline" : "Cloud Neural Grid",
          sampleEmail: isEnglish ? "dev.ops@cloudstack.io" : "yusuf.dev@startup.io",
          results: isEnglish ? [
            { icon: "⚡", title: "Cloud Neural Grid Pipeline", sub: "v4.2 Autonomous 60FPS Architecture" },
            { icon: "📐", title: "Vector Mesh Triangulation", sub: "High Precision Shader Mapping" },
            { icon: "📊", title: "Real-time Telemetry Analytics", sub: "99.8% Sync · 240ms Latency" },
          ] : [
            { icon: "⚡", title: "Cloud Neural Grid Pipeline", sub: "v4.2 Arsitektur Otonom 60FPS" },
            { icon: "📐", title: "Vector Mesh Triangulation", sub: "Shader Pemetaan Presisi Tinggi" },
            { icon: "📊", title: "Real-time Telemetry Analytics", sub: "99.8% Sync · 240ms Latency" },
          ],
          toastMsg: isEnglish ? "🚀 Sandbox & API Activated Successfully!" : "🚀 Fitur Sandbox & API Berhasil Diaktifkan!",
        },
        ecommerce: {
          niche: "ecommerce",
          sampleSearch: isEnglish ? "Ultra Pro Running Shoes" : "Sepatu Running Ultra Pro",
          sampleEmail: isEnglish ? "loyal.customer@shop.com" : "pelanggan.setia@gmail.com",
          results: isEnglish ? [
            { icon: "👟", title: "Ultra Pro Running Shoes", sub: "25% Off · Limited Edition Stock" },
            { icon: "🎒", title: "Waterproof Travel Backpack", sub: "Best Seller This Week" },
            { icon: "👕", title: "Breathable Athletic Jersey", sub: "Sizes Available: M, L, XL" },
          ] : [
            { icon: "👟", title: "Sepatu Running Ultra Pro", sub: "Diskon 25% · Stok Terbatas" },
            { icon: "🎒", title: "Tas Ransel Waterproof", sub: "Paling Laris Minggu Ini" },
            { icon: "👕", title: "Jersey Apparel Breathable", sub: "Tersedia Ukuran M, L, XL" },
          ],
          toastMsg: isEnglish ? "🛍️ Product Added to Cart Successfully!" : "🛍️ Produk Berhasil Ditambahkan ke Keranjang!",
        },
        fintech: {
          niche: "fintech",
          sampleSearch: isEnglish ? "Bluechip Stock Portfolio" : "Portofolio Saham & Reksadana",
          sampleEmail: isEnglish ? "investor.pro@fintech.com" : "investor.pro@fintech.id",
          results: isEnglish ? [
            { icon: "📈", title: "Bluechip Growth Stock Portfolio", sub: "+18.4% Return YTD" },
            { icon: "💳", title: "Instant Virtual Credit Card", sub: "5% Online Cashback" },
            { icon: "🪙", title: "Daily High-Yield Savings 6%", sub: "Insured & Regulated" },
          ] : [
            { icon: "📈", title: "Portofolio Saham Bluechip", sub: "+18.4% Return YTD" },
            { icon: "💳", title: "Kartu Kredit Virtual Instant", sub: "Cashback 5% Online" },
            { icon: "🪙", title: "Simpanan Bunga Harian 6%", sub: "Dijamin LPS & OJK" },
          ],
          toastMsg: isEnglish ? "💳 Financial Account Linked Successfully!" : "💳 Koneksi Akun Keuangan Berhasil Diotorisasi!",
        },
        creative: {
          niche: "creative",
          sampleSearch: isEnglish ? "Modern Minimalist Design System" : "Desain Sistem Modern & Minimalis",
          sampleEmail: isEnglish ? "studio@artisan-design.co" : "studio@artisan-design.co",
          results: isEnglish ? [
            { icon: "🎨", title: "Design System & Brand Assets", sub: "84 Tested Vector Components" },
            { icon: "📐", title: "Interactive Wireframe Kit", sub: "Figma File 2026 Ready" },
            { icon: "✨", title: "Mobile App Redesign Case Study", sub: "42% Conversion Uplift" },
          ] : [
            { icon: "🎨", title: "Desain Sistem & Brand Guidelines", sub: "84 Komponen Vektor Teruji" },
            { icon: "📐", title: "Wireframe & Prototyping Interaktif", sub: "Figma File 2026 Ready" },
            { icon: "✨", title: "Case Study: Mobile App Redesign", sub: "Meningkatkan Konversi 42%" },
          ],
          toastMsg: isEnglish ? "✨ Portfolio Showcase Opened!" : "✨ Katalog Proyek & Portofolio Dibuka!",
        },
        education: {
          niche: "education",
          sampleSearch: isEnglish ? "Fullstack AI & Web Development 2026" : "Belajar Fullstack AI & Web 2026",
          sampleEmail: isEnglish ? "student.pro@academy.edu" : "pelajar.cerdas@kampus.id",
          results: isEnglish ? [
            { icon: "🎓", title: "Fullstack AI & Next.js Masterclass", sub: "36 Interactive Modules · Certified" },
            { icon: "💻", title: "Hands-on Project Lab & Sandbox", sub: "Direct Practice in Cloud IDE" },
            { icon: "🚀", title: "1-on-1 Mentorship & Placement", sub: "94% Employment Rate" },
          ] : [
            { icon: "🎓", title: "Masterclass Fullstack AI & Next.js", sub: "36 Modul Interaktif · Sertifikat Resmi" },
            { icon: "💻", title: "Hands-on Project Lab & Sandbox", sub: "Praktik Langsung di Cloud IDE" },
            { icon: "🚀", title: "Job Placement & Mentoring 1-on-1", sub: "94% Lulusan Diterima Kerja" },
          ],
          toastMsg: isEnglish ? "🎓 Course Module Enrolled Successfully!" : "🎓 Pendaftaran Modul Kursus Berhasil!",
        },
        culinary: {
          niche: "culinary",
          sampleSearch: isEnglish ? "Signature Cold Brew & Wagyu Steak" : "Signature Artisan Coffee & Wagyu",
          sampleEmail: isEnglish ? "reservations@bistrolounge.com" : "reservasi@bistrolounge.com",
          results: isEnglish ? [
            { icon: "☕", title: "Artisan Single Origin Cold Brew", sub: "Selected Specialty Roast" },
            { icon: "🥩", title: "Prime Wagyu Meltique Steak", sub: "Chef's Signature Recommendation" },
            { icon: "🍷", title: "VIP Rooftop Table Reservation", sub: "Sunset View Spot Available" },
          ] : [
            { icon: "☕", title: "Artisan Single Origin Cold Brew", sub: "Specialty Beans Terpilih" },
            { icon: "🥩", title: "Wagyu Meltique Steak Premium", sub: "Menu Favorit Chef Rekomendasi" },
            { icon: "🍷", title: "Reservasi Meja VIP Malam Ini", sub: "Tersedia Spot Rooftop Sunset" },
          ],
          toastMsg: isEnglish ? "🍽️ Table Reservation Confirmed!" : "🍽️ Reservasi Meja Berhasil Dikonfirmasi!",
        },
      };

      if (this.tourNiche && this.tourNiche !== "auto" && dict[this.tourNiche]) {
        return dict[this.tourNiche];
      }

      const title = (document.title || "").toLowerCase();
      const metaDesc = (document.querySelector('meta[name="description"]')?.content || "").toLowerCase();
      const textSample = (document.body?.innerText?.slice(0, 1600) || "").toLowerCase();
      const allText = `${title} ${metaDesc} ${textSample}`;

      if (/toko|belanja|cart|produk|harga|sepatu|fashion|store|shop|checkout|sale|diskon/i.test(allText)) {
        return dict.ecommerce;
      }
      if (/bank|keuangan|finance|invest|saham|reksadana|crypto|trading|saldo|dompet|transfer|pembayaran/i.test(allText)) {
        return dict.fintech;
      }
      if (/design|agency|portfolio|karya|desain|fotografi|creative|visual|ui\/ux|figma/i.test(allText)) {
        return dict.creative;
      }
      if (/kursus|belajar|sekolah|kuliah|education|academy|course|modul|materi|mentor|siswa|mahasiswa/i.test(allText)) {
        return dict.education;
      }
      if (/menu|makanan|minuman|resto|restoran|cafe|kafe|culinary|food|coffee|dine|meja|reservasi/i.test(allText)) {
        return dict.culinary;
      }

      return dict.saas;
    }

    speakTourNarration(text) {
      if (!text || this.sound?.muted) return;
      if (this.tourLanguage === "mute" || this.tourLanguage === "sfx-only") return;

      const synth = window.speechSynthesis || window.top?.speechSynthesis || window.parent?.speechSynthesis;
      if (!synth) return;

      try {
        synth.cancel();

        // Strip emoji and symbol characters for clean and natural pronunciation
        const cleanText = String(text)
          .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}⚡🚀🔍⌨️📊✨⚙️🎛️📋📂📑🎠🛍️💳🎓🍽️🎬★•]/gu, "")
          .replace(/\s+/g, " ")
          .trim();

        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        const htmlLang = (document.documentElement.lang || document.querySelector('meta[http-equiv="content-language"]')?.content || "").toLowerCase();
        const isEnglish = this.tourLanguage === "en" || (!this.tourLanguage && htmlLang.startsWith("en"));

        utterance.lang = isEnglish ? "en-US" : "id-ID";
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = (synth.getVoices ? synth.getVoices() : []) || [];
        if (voices.length > 0) {
          const targetPrefix = isEnglish ? "en" : "id";
          const matchedVoice = voices.find(v => v.lang && v.lang.toLowerCase().replace("_", "-").startsWith(targetPrefix))
            || voices.find(v => v.lang && v.lang.toLowerCase().includes(targetPrefix));
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }
        }

        synth.speak(utterance);
      } catch (err) {
        console.warn("[VOICE] Speech synthesis notice:", err);
      }
    }

    applyTourElementFocus(targetEl) {
      this.clearTourElementFocus();
      if (!targetEl || !(targetEl instanceof Element)) return;
      this.currentTourTarget = targetEl;
      try {
        targetEl.classList.add("swarm-tour-target-elevated");
      } catch (_) {}

      // Dim surrounding container or sibling sections for elegant depth-of-field
      try {
        const parentSec = targetEl.closest("section, main, article, .hero, .container, [class*='section']") || targetEl.parentElement;
        if (parentSec && parentSec.parentElement) {
          const siblings = Array.from(parentSec.parentElement.children);
          for (const sib of siblings) {
            if (sib !== parentSec && !sib.contains(targetEl) && !sib.id?.startsWith("swarm-")) {
              sib.classList.add("swarm-tour-bg-dimmed");
              this.dimmedTourSections.add(sib);
            }
          }
        }
      } catch (_) {}
    }

    clearTourElementFocus() {
      if (this.currentTourTarget) {
        try {
          this.currentTourTarget.classList.remove("swarm-tour-target-elevated");
        } catch (_) {}
        this.currentTourTarget = null;
      }
      if (this.dimmedTourSections && this.dimmedTourSections.size > 0) {
        for (const el of this.dimmedTourSections) {
          try {
            el.classList.remove("swarm-tour-bg-dimmed");
          } catch (_) {}
        }
        this.dimmedTourSections.clear();
      }
    }

    applyCinematicCameraZoom(rect, targetEl) {
      if (!rect) return;
      this.currentActiveTourEl = targetEl;
      if (targetEl) {
        this.applyTourElementFocus(targetEl);
      }
      document.body.style.transform = "none";
      document.body.style.transformOrigin = "center center";
      document.body.classList.remove("swarm-camera-zoomed");
    }

    resetCinematicCameraZoom() {
      document.body.style.transform = "none";
      this.clearTourElementFocus();
      document.querySelectorAll(".swarm-dof-bokeh").forEach((s) => s.classList.remove("swarm-dof-bokeh"));
      this.currentActiveTourEl = null;
    }

    enableManualTourBuilder() {
      this.ensureTourElements();
      this.manualTourSequence = [];
      this.pickerActive = true;
      this.paused = true;

      if (!this.tourPickerBar || !this.tourPickerBar.isConnected) {
        this.tourPickerBar = document.createElement("div");
        this.tourPickerBar.id = "swarm-tour-picker-bar";
        this.tourPickerBar.innerHTML = `
          <div class="tour-picker-info">
            <span>🎯 Mode Pilih Fitur Tour</span>
            <span class="tour-picker-count" id="tour-picker-count">0 Fitur</span>
          </div>
          <button type="button" class="btn-tour-launch" id="btn-tour-launch-manual">
            <span>▶ Mulai Tour</span>
          </button>
          <button type="button" class="btn-tour-cancel" id="btn-tour-cancel-manual">✕ Batal</button>
        `;
        this.overlay.appendChild(this.tourPickerBar);

        this.tourPickerBar.querySelector("#btn-tour-launch-manual").addEventListener("click", () => {
          if (this.manualTourSequence.length === 0) return;
          this.disableManualTourBuilder();
          this.runFeatureTourFlow(this.manualTourSequence);
        });

        this.tourPickerBar.querySelector("#btn-tour-cancel-manual").addEventListener("click", () => {
          this.disableManualTourBuilder();
        });
      }

      this.tourPickerBar.classList.add("is-visible");
      this.updateHudStatus(`<strong>🎯 Mode Pilih Sendiri</strong> · Klik 3–5 elemen di halaman berurutan!`, 100);
      this.logTerminal(AGENTS[0], "PICK", "Click elements sequentially to build custom feature tour");

      window.addEventListener("mousemove", this.onPickerMove, true);
      window.addEventListener("click", this.onPickerClick, true);
    }

    disableManualTourBuilder() {
      this.pickerActive = false;
      if (this.tourPickerBar) this.tourPickerBar.classList.remove("is-visible");
      document.querySelectorAll(".tour-picked-badge").forEach((b) => b.remove());
      window.removeEventListener("mousemove", this.onPickerMove, true);
      window.removeEventListener("click", this.onPickerClick, true);
    }

    addManualTourStep(targetEl) {
      if (!targetEl || targetEl === document.body) return;
      this.manualTourSequence.push(targetEl);
      const stepNum = this.manualTourSequence.length;

      const rect = targetEl.getBoundingClientRect();
      const badge = document.createElement("div");
      badge.className = "tour-picked-badge";
      badge.textContent = String(stepNum);
      badge.style.top = `${rect.top + window.scrollY - 12}px`;
      badge.style.left = `${rect.left + window.scrollX - 12}px`;
      document.body.appendChild(badge);

      this.sound.playLockSnap(1.1 + stepNum * 0.1);

      const countEl = this.tourPickerBar?.querySelector("#tour-picker-count");
      if (countEl) countEl.textContent = `${stepNum} Fitur`;
      const launchBtn = this.tourPickerBar?.querySelector("#btn-tour-launch-manual span");
      if (launchBtn) launchBtn.textContent = `▶ Mulai Tour (${stepNum} Fitur)`;
    }

    setupTourCrewRoles() {
      if (!this.cursors || this.cursors.length === 0) return;

      this.applyWebsiteBrandColor();

      const hero = this.cursors[0];
      const brandColor = this.detectWebsiteBrandColor();
      hero.agent = { role: "Presenter", name: "Yusuf · Presenter", color: brandColor };
      if (hero.badgeEl) hero.badgeEl.textContent = "Presenter";
      if (hero.nameEl) hero.nameEl.textContent = "Yusuf · Demo";
      hero.el.style.setProperty("--agent-color", brandColor);
      hero.el.classList.add("is-solo-hero");
      hero.el.style.display = "block";
      hero.busy = false;

      for (let i = 1; i < this.cursors.length; i++) {
        const c = this.cursors[i];
        c.el.style.display = "none";
        c.busy = true;
      }

      if (this.termModePill) {
        this.termModePill.textContent = "SOLO PRESENTER";
      }
    }

    restoreTourCrewRoles() {
      if (!this.cursors) return;
      this.resetCinematicCameraZoom();
      this.cursors.forEach((c) => {
        c.el.style.display = "";
        c.el.classList.remove("is-solo-hero");
        c.busy = false;
      });
      if (this.termModePill) {
        this.termModePill.textContent = "8 AGENTS";
      }
    }

    ensureTourElements() {
      if (!this.overlay) return;
      if (!this.tourSpotlightEl || !this.tourSpotlightEl.isConnected) {
        this.tourSpotlightEl = document.createElement("div");
        this.tourSpotlightEl.id = "swarm-tour-spotlight";
        this.tourSpotlightBadge = document.createElement("div");
        this.tourSpotlightBadge.id = "swarm-tour-badge";
        this.tourSpotlightEl.appendChild(this.tourSpotlightBadge);
        this.overlay.appendChild(this.tourSpotlightEl);
      }
      if (!this.tourCaptionEl || !this.tourCaptionEl.isConnected) {
        this.tourCaptionEl = document.createElement("div");
        this.tourCaptionEl.id = "swarm-tour-caption";
        this.tourCaptionEl.innerHTML = `
          <div class="tour-caption-icon" id="tour-caption-icon">⚡</div>
          <div class="tour-caption-body">
            <div class="tour-caption-act" id="tour-caption-act" style="display:none;"></div>
            <div class="tour-caption-title" id="tour-caption-title">Fitur Website</div>
            <div class="tour-caption-sub" id="tour-caption-sub">Keterangan interaksi fitur</div>
          </div>
        `;
        this.overlay.appendChild(this.tourCaptionEl);
      }
      if (!this.tourSearchDropdown || !this.tourSearchDropdown.isConnected) {
        this.tourSearchDropdown = document.createElement("div");
        this.tourSearchDropdown.id = "swarm-tour-search-dropdown";
        this.overlay.appendChild(this.tourSearchDropdown);
      }
      if (!this.tourToast || !this.tourToast.isConnected) {
        this.tourToast = document.createElement("div");
        this.tourToast.id = "swarm-tour-toast";
        this.overlay.appendChild(this.tourToast);
      }
      if (!this.tourChapterCard || !this.tourChapterCard.isConnected) {
        this.tourChapterCard = document.createElement("div");
        this.tourChapterCard.id = "swarm-tour-chapter-card";
        this.overlay.appendChild(this.tourChapterCard);
      }
      if (!this.tourStoryBar || !this.tourStoryBar.isConnected) {
        this.tourStoryBar = document.createElement("div");
        this.tourStoryBar.id = "swarm-tour-story-bar";
        this.overlay.appendChild(this.tourStoryBar);
      }
      if (!this.tourTakeoverBtn || !this.tourTakeoverBtn.isConnected) {
        this.tourTakeoverBtn = document.createElement("button");
        this.tourTakeoverBtn.id = "swarm-tour-takeover-btn";
        this.tourTakeoverBtn.type = "button";
        this.tourTakeoverBtn.innerHTML = `<span>👆</span> <span>Coba Sendiri</span>`;
        this.tourTakeoverBtn.addEventListener("click", () => this.enableTourTakeover());
        this.overlay.appendChild(this.tourTakeoverBtn);
      }
      if (!this.tourSoundBtn || !this.tourSoundBtn.isConnected) {
        this.tourSoundBtn = document.createElement("button");
        this.tourSoundBtn.id = "swarm-tour-sound-btn";
        this.tourSoundBtn.type = "button";
        this.tourSoundBtn.title = "Bisukan / Nyalakan Suara (M)";
        this.tourSoundBtn.innerHTML = `<span>${this.sound.muted ? "🔇" : "🔊"}</span>`;
        this.tourSoundBtn.addEventListener("click", () => {
          this.sound.muted = !this.sound.muted;
          this.tourSoundBtn.innerHTML = `<span>${this.sound.muted ? "🔇" : "🔊"}</span>`;
          this.showTourToast(this.sound.muted ? "🔇 Audio Dibisukan" : "🔊 Audio Diaktifkan");
        });
        this.overlay.appendChild(this.tourSoundBtn);
      }
      if (!this.tourResumeBtn || !this.tourResumeBtn.isConnected) {
        this.tourResumeBtn = document.createElement("button");
        this.tourResumeBtn.id = "swarm-tour-resume-btn";
        this.tourResumeBtn.type = "button";
        this.tourResumeBtn.innerHTML = `<span>▶</span> <span>Lanjutkan Demo AI</span>`;
        this.tourResumeBtn.addEventListener("click", () => this.resumeTourFromTakeover());
        this.overlay.appendChild(this.tourResumeBtn);
      }
      if (!this.mobileScrollIndicator || !this.mobileScrollIndicator.isConnected) {
        this.mobileScrollIndicator = document.createElement("div");
        this.mobileScrollIndicator.id = "swarm-mobile-scroll-indicator";
        this.mobileScrollThumb = document.createElement("div");
        this.mobileScrollThumb.id = "swarm-mobile-scroll-thumb";
        this.mobileScrollIndicator.appendChild(this.mobileScrollThumb);
        this.overlay.appendChild(this.mobileScrollIndicator);
      }
    }

    showTourStoryBar(totalFeatures) {
      this.ensureTourElements();
      if (!this.tourStoryBar) return;
      this.totalTourFeatures = totalFeatures;
      this.tourStoryBar.innerHTML = "";
      for (let i = 0; i < totalFeatures; i++) {
        const seg = document.createElement("div");
        seg.className = "tour-story-segment";
        seg.id = `tour-story-seg-${i}`;
        const fill = document.createElement("div");
        fill.className = "tour-story-fill";
        seg.appendChild(fill);
        this.tourStoryBar.appendChild(seg);
      }
      this.tourStoryBar.classList.add("is-visible");
      if (this.tourSoundBtn) this.tourSoundBtn.classList.add("is-visible");
      if (this.tourTakeoverBtn) this.tourTakeoverBtn.classList.add("is-visible");
    }

    updateTourStoryActive(activeIdx) {
      if (!this.tourStoryBar) return;
      for (let i = 0; i < this.totalTourFeatures; i++) {
        const seg = this.tourStoryBar.querySelector(`#tour-story-seg-${i} .tour-story-fill`);
        if (!seg) continue;
        if (i < activeIdx) {
          seg.style.width = "100%";
        } else if (i === activeIdx) {
          seg.style.width = "40%";
        } else {
          seg.style.width = "0%";
        }
      }
    }

    completeTourStoryActive(activeIdx) {
      const seg = this.tourStoryBar?.querySelector(`#tour-story-seg-${activeIdx} .tour-story-fill`);
      if (seg) seg.style.width = "100%";
    }

    hideTourStoryBar() {
      if (this.tourStoryBar) this.tourStoryBar.classList.remove("is-visible");
      if (this.tourSoundBtn) this.tourSoundBtn.classList.remove("is-visible");
      if (this.tourTakeoverBtn) this.tourTakeoverBtn.classList.remove("is-visible");
    }

    triggerCursorSquish(cursor) {
      if (!cursor || !cursor.el) return;
      cursor.el.classList.add("is-squished");
      setTimeout(() => cursor.el?.classList.remove("is-squished"), 120);
    }

    setHeroCursorMode(cursor, mode = "default") {
      if (!cursor || !cursor.el) return;
      cursor.el.classList.remove("mode-pointer", "mode-text", "mode-grab", "mode-grabbing");
      if (mode !== "default") {
        cursor.el.classList.add(`mode-${mode}`);
      }
    }

    async glideCursorUnderline(cursor, targetEl, durationMs = 500) {
      if (!cursor || !targetEl) return;
      const r = targetEl.getBoundingClientRect();
      const startX = r.left + 12;
      const endX = r.right - 12;
      const lineY = r.bottom + 4;

      targetEl.classList.add("tour-underline-highlight");
      this.sound.playWhoosh(0.7);

      await this.glideCursorBezier(cursor, startX, lineY, 280, { arch: 1 });
      await this.glideCursorBezier(cursor, endX, lineY, durationMs, { arch: -1 });

      setTimeout(() => targetEl.classList.remove("tour-underline-highlight"), 1600);
    }

    enableTourTakeover() {
      this.isTourTakeover = true;
      this.paused = true;
      this.hideTourSpotlight();
      this.hideTourCaption();
      if (this.cursors && this.cursors[0]) {
        this.cursors[0].el.style.opacity = "0";
      }
      this.showTourToast("👋 Kendali diserahkan ke Anda! Coba fitur langsung.");
      if (this.tourResumeBtn) this.tourResumeBtn.classList.add("is-visible");
      if (this.tourTakeoverBtn) this.tourTakeoverBtn.classList.remove("is-visible");
    }

    resumeTourFromTakeover() {
      this.isTourTakeover = false;
      this.paused = false;
      if (this.cursors && this.cursors[0]) {
        this.cursors[0].el.style.opacity = "1";
      }
      if (this.tourResumeBtn) this.tourResumeBtn.classList.remove("is-visible");
      if (this.tourTakeoverBtn) this.tourTakeoverBtn.classList.add("is-visible");
      this.showTourToast("▶ Demo AI Dilanjutkan...");
    }

    showTourSpotlight(rect, badgeText, targetEl = null) {
      this.ensureTourElements();
      if (targetEl) {
        this.applyTourElementFocus(targetEl);
      }
      if (!this.tourSpotlightEl) return;
      const pad = 10;
      const leftPos = Math.max(4, rect.left - pad);
      const topPos = Math.max(4, rect.top - pad);
      const maxW = Math.max(40, window.innerWidth - leftPos - 8);
      const width = Math.min(maxW, rect.width + pad * 2);
      const height = rect.height + pad * 2;

      this.tourSpotlightEl.style.top = `${topPos}px`;
      this.tourSpotlightEl.style.left = `${leftPos}px`;
      this.tourSpotlightEl.style.width = `${width}px`;
      this.tourSpotlightEl.style.height = `${height}px`;

      if (this.tourSpotlightBadge) {
        this.tourSpotlightBadge.textContent = badgeText;
        if (topPos < 38) {
          this.tourSpotlightBadge.style.top = "auto";
          this.tourSpotlightBadge.style.bottom = "-28px";
        } else {
          this.tourSpotlightBadge.style.top = "-30px";
          this.tourSpotlightBadge.style.bottom = "auto";
        }
        if (leftPos + width > window.innerWidth * 0.72) {
          this.tourSpotlightBadge.style.left = "auto";
          this.tourSpotlightBadge.style.right = "6px";
        } else {
          this.tourSpotlightBadge.style.left = "8px";
          this.tourSpotlightBadge.style.right = "auto";
        }
      }
      this.tourSpotlightEl.classList.add("is-active");
    }

    hideTourSpotlight() {
      if (this.tourSpotlightEl) this.tourSpotlightEl.classList.remove("is-active");
      this.clearTourElementFocus();
    }

    showTourCaption(icon, title, desc, actLabel = null, isNearBottom = false) {
      if (typeof actLabel === "boolean") {
        isNearBottom = actLabel;
        actLabel = null;
      }
      this.ensureTourElements();
      if (!this.tourCaptionEl) return;
      const ic = this.tourCaptionEl.querySelector("#tour-caption-icon");
      const tt = this.tourCaptionEl.querySelector("#tour-caption-title");
      const sb = this.tourCaptionEl.querySelector("#tour-caption-sub");
      const act = this.tourCaptionEl.querySelector("#tour-caption-act");
      if (ic) ic.textContent = icon;
      if (act) {
        if (actLabel) {
          act.textContent = actLabel;
          act.style.display = "inline-flex";
        } else {
          act.style.display = "none";
        }
      }
      if (tt) {
        const words = (title || "").trim().split(/\s+/);
        if (words.length > 2) {
          tt.innerHTML = `${words.slice(0, 2).join(" ")} <span class="tour-caption-keyword">${words.slice(2).join(" ")}</span>`;
        } else {
          tt.textContent = title;
        }
      }
      if (sb) sb.textContent = desc;

      this.tourCaptionEl.classList.remove("is-top-docked", "is-bottom-docked");
      if (isNearBottom) {
        this.tourCaptionEl.classList.add("is-top-docked");
      } else {
        this.tourCaptionEl.classList.add("is-bottom-docked");
      }
      this.tourCaptionEl.classList.add("is-visible");

      // Dual vocal engine: Web Audio procedural formant blips (feeds into recording!) + SpeechSynthesis
      this.sound.playProceduralVocalBlips(title, 1400);
      this.speakTourNarration(`${title}. ${desc}`);
    }

    hideTourCaption() {
      if (this.tourCaptionEl) this.tourCaptionEl.classList.remove("is-visible");
    }

    showTourSearchDropdown(inputEl, queryText, nicheData) {
      this.ensureTourElements();
      if (!this.tourSearchDropdown || !inputEl) return;
      const r = inputEl.getBoundingClientRect();
      this.tourSearchDropdown.style.top = `${r.bottom + 8}px`;
      this.tourSearchDropdown.style.left = `${r.left}px`;
      this.tourSearchDropdown.style.width = `${Math.max(280, r.width)}px`;

      const results = (nicheData && nicheData.results) || [
        { icon: "⚡", title: `${queryText} · v4.2 Pipeline`, sub: "Arsitektur Otonom" },
        { icon: "📐", title: `${queryText} · Vector Mesh 60FPS`, sub: "Presisi Tinggi" },
        { icon: "📊", title: `${queryText} · Telemetri Analytics`, sub: "Real-time Metrics" },
      ];

      this.tourSearchDropdown.innerHTML = results.map((res, idx) => `
        <div class="tour-dropdown-item${idx === 0 ? " is-selected" : ""}" id="tour-dd-item-${idx}">
          <span style="font-size:14px;">${res.icon}</span>
          <span style="flex:1;"><strong>${res.title}</strong> · <small style="opacity:0.75;">${res.sub}</small></span>
          <span class="tour-dropdown-item-badge">${idx === 0 ? "ENTER" : "SELECT"}</span>
        </div>
      `).join("");

      this.tourSearchDropdown.classList.add("is-visible");
      this.sound.playSnap(0.9);
    }

    hideTourSearchDropdown() {
      if (this.tourSearchDropdown) this.tourSearchDropdown.classList.remove("is-visible");
    }

    showTourToast(msg) {
      this.ensureTourElements();
      if (!this.tourToast) return;
      this.tourToast.innerHTML = `<span>🚀</span> <span>${msg}</span>`;
      this.tourToast.classList.add("is-visible");
      this.sound.playLockSnap(1.2);
      setTimeout(() => {
        if (this.tourToast) this.tourToast.classList.remove("is-visible");
      }, 2400);
    }

    triggerContentFlash(originEl) {
      const cards = document.querySelectorAll(".card, .bento-card, .metric-card, .hero-visual-card");
      cards.forEach((c) => {
        c.style.transition = "transform 0.35s cubic-bezier(0.16,1,0.3,1), filter 0.35s, box-shadow 0.35s";
        c.style.transform = "scale(1.025) translateY(-2px)";
        c.style.filter = "brightness(1.15)";
        c.style.boxShadow = "0 12px 32px rgba(var(--brand-rgb, 16, 185, 129), 0.25)";
        setTimeout(() => {
          c.style.transform = "";
          c.style.filter = "";
          c.style.boxShadow = "";
        }, 420);
      });
    }

    simulateClickRipple(x, y) {
      if (!this.overlay) return;
      const rip = document.createElement("div");
      rip.className = "swarm-click-ripple";
      rip.style.left = `${x}px`;
      rip.style.top = `${y}px`;
      rip.style.width = `44px`;
      rip.style.height = `44px`;
      this.overlay.appendChild(rip);
      setTimeout(() => rip.remove(), 480);
    }

    // Organic Bezier Arc Curved Cursor Movement Engine
    async glideCursorBezier(cursor, targetX, targetY, durationMs = 520, options = {}) {
      if (!cursor) return;
      cursor.busy = true;

      const p0x = cursor.x;
      const p0y = cursor.y;
      const p2x = targetX;
      const p2y = targetY;

      const dx = p2x - p0x;
      const dy = p2y - p0y;
      const dist = Math.hypot(dx, dy);

      const midX = (p0x + p2x) / 2;
      const midY = (p0y + p2y) / 2;
      const perpX = -(dy / (dist || 1));
      const perpY = dx / (dist || 1);

      const archDir = options.arch || (dx > 0 ? 1 : -1);
      const archMagnitude = Math.min(90, Math.max(28, dist * 0.22)) * archDir;
      const p1x = midX + perpX * archMagnitude;
      const p1y = midY + perpY * archMagnitude - 20;

      const scaledDuration = Math.max(180, durationMs / (this.speed || 1));
      const startTime = performance.now();

      while (this.running && !this.aborted) {
        const now = performance.now();
        const elapsed = now - startTime;
        let progress = Math.min(1, elapsed / scaledDuration);

        // Smooth cubic ease-in-out
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        let curX = Math.pow(1 - ease, 2) * p0x + 2 * (1 - ease) * ease * p1x + Math.pow(ease, 2) * p2x;
        let curY = Math.pow(1 - ease, 2) * p0y + 2 * (1 - ease) * ease * p1y + Math.pow(ease, 2) * p2y;

        if (progress > 0.92 && progress < 0.99) {
          const overRatio = Math.sin((progress - 0.92) / 0.07 * Math.PI) * 3.5;
          curX += (dx / (dist || 1)) * overRatio;
          curY += (dy / (dist || 1)) * overRatio;
        }

        const vx = curX - cursor.x;
        const tilt = Math.max(-14, Math.min(14, vx * 0.6));

        cursor.x = curX;
        cursor.y = curY;
        cursor.tx = curX;
        cursor.ty = curY;
        cursor.el.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg)`;

        if (progress >= 1) break;
        await new Promise((r) => requestAnimationFrame(r));
      }

      cursor.x = targetX;
      cursor.y = targetY;
      cursor.tx = targetX;
      cursor.ty = targetY;
      cursor.el.style.transform = `translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0) rotate(0deg)`;
      cursor.busy = false;
    }

    renderTourChapterCard(chapters) {
      this.ensureTourElements();
      if (!this.tourChapterCard) return;
      const itemsHtml = chapters.map((ch, idx) => `
        <li class="chapter-item">
          <span class="ch-name">
            <span style="color:var(--brand-color, #10b981); font-weight:800;">${idx === 0 ? "★" : (idx === chapters.length - 1 ? "🚀" : "•")}</span>
            <span>${ch.name}</span>
          </span>
          <span class="ch-time">${ch.time}</span>
        </li>
      `).join("");

      this.tourChapterCard.innerHTML = `
        <div class="chapter-card-header">
          <span class="chapter-badge">TIMESTAMPS</span>
          <div class="chapter-title">🎬 Daftar Bab Video Tour</div>
        </div>
        <ul class="chapter-list">
          ${itemsHtml}
        </ul>
        <div class="chapter-footer">
          <span>⚡ Rebuildr Solo Presenter Engine</span>
          <span style="color:var(--brand-color, #10b981); font-weight:700;">✓ 100% Demo Siap Tayang</span>
        </div>
      `;
      this.tourChapterCard.classList.add("is-visible");
    }

    hideTourChapterCard() {
      if (this.tourChapterCard) this.tourChapterCard.classList.remove("is-visible");
    }

    getStickyHeaderOffset() {
      try {
        let maxStickyH = 0;
        const candidates = document.querySelectorAll("header, nav, [class*='header' i], [class*='nav' i], [class*='navbar' i]");
        for (const el of candidates) {
          if (el.id === "swarm-studio-overlay" || el.closest("#swarm-studio-overlay")) continue;
          const style = window.getComputedStyle(el);
          if (style.position === "fixed" || style.position === "sticky") {
            const r = el.getBoundingClientRect();
            if (r.top <= 10 && r.height > 20 && r.height < 140) {
              if (r.height > maxStickyH) maxStickyH = r.height;
            }
          }
        }
        return Math.max(70, maxStickyH + 24);
      } catch (_) {
        return 80;
      }
    }

    async smoothScrollToElement(el) {
      if (!el || !el.isConnected) return;
      const rect = el.getBoundingClientRect();
      const stickyOffset = this.getStickyHeaderOffset();

      const isMobileView = window.innerWidth <= 640 || this.videoFormat === "9:16" || this.videoFormat === "4:5" || document.body.classList.contains("swarm-reels-stage");
      let targetScrollY;

      if (isMobileView) {
        // In mobile view: vertically frame the element in the comfortable focal zone (~36% from top)
        // rather than slamming it against the top sticky header or notch
        const desiredTopOffset = Math.max(stickyOffset + 12, (window.innerHeight * 0.36) - (rect.height * 0.5));
        targetScrollY = Math.max(0, window.scrollY + rect.top - desiredTopOffset);
      } else {
        targetScrollY = Math.max(0, window.scrollY + rect.top - stickyOffset);
      }

      if (Math.abs(window.scrollY - targetScrollY) > 20) {
        window.scrollTo({ top: targetScrollY, behavior: "smooth" });

        const startTime = Date.now();
        let lastY = window.scrollY;
        let stationaryTicks = 0;

        while (Date.now() - startTime < 750) {
          await this.sleep(45);
          const curY = window.scrollY;
          if (Math.abs(curY - lastY) < 1.5) {
            stationaryTicks++;
            if (stationaryTicks >= 2) break;
          } else {
            stationaryTicks = 0;
          }
          lastY = curY;
        }
        await this.sleep(60);
      }
    }

    dismissAnnoyancesAndBanners() {
      try {
        const selectors = [
          '[class*="cookie" i]',
          '[id*="cookie" i]',
          '[class*="consent" i]',
          '[id*="consent" i]',
          '[class*="onetrust" i]',
          '[id*="onetrust" i]',
          '.onetrust-pc-dark-filter',
          '#onetrust-consent-sdk',
          '.cc-banner',
          '.cc-window',
          '.ch2-dialog',
          '[aria-label*="cookie" i]',
          '[aria-label*="consent" i]',
          '.modal-backdrop',
          '.dialog-backdrop',
          '[class*="overlay-backdrop" i]',
          '[class*="newsletter" i][class*="popup" i]',
          '[class*="newsletter-modal" i]',
          '#intercom-container',
          '.intercom-lightweight-app',
          '.crisp-client',
          '#hubspot-messages-iframe-container',
          '#drift-widget',
          '#livechat-compact-container',
          '#livechat-full',
          '#tidio-chat',
          '[id*="tawk" i]',
          '[class*="tawk" i]',
          '[id*="chat-widget" i]',
          '[class*="chat-widget" i]'
        ];

        const elements = document.querySelectorAll(selectors.join(","));
        elements.forEach((el) => {
          if (el.id === "swarm-studio-overlay" || el.closest("#swarm-studio-overlay") || el.id === "swarm-launchpad-backdrop") return;

          const btn = el.querySelector("button, [role='button']");
          if (btn && btn.tagName !== "A" && !btn.hasAttribute("href") && /accept|agree|setuju|terima|got it|allow all|close|tutup|dismiss/i.test(btn.innerText || "")) {
            try { btn.click(); } catch (_) {}
          }

          el.style.setProperty("display", "none", "important");
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("pointer-events", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
        });
      } catch (_) {}
    }

    discoverAndRankFeatures() {
      const body = document.body;
      if (!body) return [];

      const isExcluded = (el) => {
        return !!el.closest("#swarm-studio-overlay, #swarm-hud-bar, #swarm-launchpad-backdrop, #swarm-mockup-island, #swarm-mockup-laptop-bar, #swarm-tour-picker-bar, script, style, noscript");
      };

      const nicheData = this.detectWebsiteNiche();
      const htmlLang = (document.documentElement.lang || document.querySelector('meta[http-equiv="content-language"]')?.content || "").toLowerCase();
      const isEnglish = this.tourLanguage === "en" || (!this.tourLanguage && htmlLang.startsWith("en"));

      const actLabels = {
        hero: isEnglish ? "ACT 1 · HERO HOOK" : "BABAK 1 · NILAI UTAMA",
        workflow: isEnglish ? "ACT 2 · WORKFLOW" : "BABAK 2 · ALUR INTERAKTIF",
        proof: isEnglish ? "ACT 3 · PROOF & METRICS" : "BABAK 3 · BUKTI & KAPABILITAS",
        conversion: isEnglish ? "ACT 4 · CONVERSION" : "BABAK 4 · AKSI KONVERSI"
      };

      // ---------------------------------------------------------
      // CATEGORY 1: HERO HOOK (Headline / Value Proposition)
      // ---------------------------------------------------------
      const heroCandidates = [];
      const headings = Array.from(body.querySelectorAll('h1, [class*="hero" i] h2, [class*="hero" i] .title, [class*="banner" i] h1, main h1, header h1, .hero-title'));
      for (const el of headings) {
        if (isExcluded(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 18) continue;
        if (r.top > 650) continue; // Must be in the hero viewport
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;

        const text = el.innerText.trim().replace(/\s+/g, " ").slice(0, 48);
        if (!text || text.length < 3) continue;

        heroCandidates.push({
          type: "hero",
          act: actLabels.hero,
          element: el,
          rect: r,
          score: 100 - Math.min(20, Math.floor(r.top / 30)),
          title: text.length > 32 ? `${text.slice(0, 30)}...` : text,
          desc: isEnglish ? "Core architectural value proposition & product foundation" : "Fondasi proposisi nilai & arsitektur produk utama",
          icon: "⚡",
          nicheData,
        });
      }
      heroCandidates.sort((a, b) => b.score - a.score);

      // ---------------------------------------------------------
      // CATEGORY 2: CORE WORKFLOW (Inputs, Search, Toggles, Sliders, Tabs)
      // ---------------------------------------------------------
      const workflowCandidates = [];

      // 2A. Inputs & Search Bars
      const inputs = Array.from(body.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]'));
      for (const el of inputs) {
        if (isExcluded(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 20 || r.width > 1200) continue;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;

        const placeholder = el.getAttribute("placeholder") || el.getAttribute("aria-label") || el.name || "";
        const isSearch = el.type === "search" || /search|cari|find|query|filter/i.test(placeholder + " " + el.className + " " + el.id);

        let score = 95;
        if (isSearch) score += 20;
        if (r.top < window.innerHeight * 1.5) score += 15;

        workflowCandidates.push({
          type: isSearch ? "search" : "input",
          act: actLabels.workflow,
          element: el,
          score,
          rect: r,
          title: isSearch ? (isEnglish ? "Smart Search Bar" : "Pencarian Cerdas") : (placeholder ? `${isEnglish ? "Field" : "Kolom"}: ${placeholder.slice(0, 24)}` : (isEnglish ? "Interactive Form" : "Formulir Interaktif")),
          desc: isSearch ? (isEnglish ? `Instant contextual query for ${nicheData.sampleSearch}` : `Cari ${nicheData.sampleSearch} secara instan`) : (isEnglish ? "Fluid & responsive live form input" : "Pengisian data formulir cepat & responsif"),
          icon: isSearch ? "🔍" : "⌨️",
          mockValue: isSearch ? nicheData.sampleSearch : nicheData.sampleEmail,
          nicheData,
        });
      }

      // 2B. Toggles & Switches
      const toggles = Array.from(body.querySelectorAll('input[type="checkbox"], [role="switch"], .toggle, .switch, .form-switch, [class*="toggle"], [class*="switch"], button[aria-checked]'));
      for (const el of toggles) {
        if (isExcluded(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 14 || r.height < 14) continue;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;

        const label = el.closest("label")?.innerText?.trim()?.slice(0, 26)
          || el.getAttribute("aria-label")
          || el.id
          || (isEnglish ? "Feature Switch" : "Sakelar Fitur");

        workflowCandidates.push({
          type: "toggle",
          act: actLabels.workflow,
          element: el,
          score: 91,
          rect: r,
          title: `${isEnglish ? "Toggle" : "Sakelar"}: ${label}`,
          desc: isEnglish ? "Activate parameter switches & adaptive settings" : "Aktifkan atau sesuaikan parameter fungsi otonom",
          icon: "⚙️",
          nicheData,
        });
      }

      // 2C. Range Sliders
      const sliders = Array.from(body.querySelectorAll('input[type="range"], [role="slider"], .range-slider, [class*="slider"]'));
      for (const el of sliders) {
        if (isExcluded(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 8) continue;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;

        const label = el.closest("label")?.innerText?.trim()?.slice(0, 26)
          || el.getAttribute("aria-label")
          || el.name
          || (isEnglish ? "Parameter Slider" : "Parameter Slider");

        workflowCandidates.push({
          type: "slider",
          act: actLabels.workflow,
          element: el,
          score: 89,
          rect: r,
          title: `Slider: ${label}`,
          desc: isEnglish ? "Live drag adjustment for computational throughput" : "Geser nilai kapasitas dan alokasi komputasi live",
          icon: "🎛️",
          nicheData,
        });
      }

      // 2D. Tabs & Accordions
      const tabs = Array.from(body.querySelectorAll('[role="tab"], .tab, [data-tab], details summary, details, .faq-item, .accordion, .filter-chip, [class*="chip"]'));
      for (const el of tabs) {
        if (isExcluded(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 25 || r.height < 18) continue;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;

        const text = el.innerText.trim().slice(0, 28);
        if (!text && !el.getAttribute("aria-label")) continue;

        const isAccordion = el.tagName === "DETAILS" || el.matches(".accordion, .faq-item, details summary");
        let score = isAccordion ? 88 : 82;
        if (r.top < window.innerHeight * 1.2) score += 15;

        workflowCandidates.push({
          type: isAccordion ? "accordion" : "tab",
          act: actLabels.workflow,
          element: el,
          score,
          rect: r,
          title: isAccordion ? (isEnglish ? `Expand: ${text.slice(0, 20)}` : `Eksplorasi Detail: ${text.slice(0, 20)}`) : (isEnglish ? `Tab: ${text || "Nav"}` : `Tab & Filter: ${text || "Navigasi"}`),
          desc: isAccordion ? (isEnglish ? "Smooth accordion disclosure reveals hidden depths" : "Membuka bagian detail tersembunyi secara interaktif") : (isEnglish ? "Switch dynamic perspective categories & live filters" : "Beralih kategori tampilan dan filter dinamis"),
          icon: isAccordion ? "📂" : "📑",
          nicheData,
        });
      }
      workflowCandidates.sort((a, b) => b.score - a.score);

      // ---------------------------------------------------------
      // CATEGORY 3: PROOF & CAPABILITIES (Metrics, Bento Cards, Carousels)
      // ---------------------------------------------------------
      const proofCandidates = [];
      const cards = Array.from(body.querySelectorAll('.metric-card, [class*="metric"], .bento-card, [class*="bento"], .card, [class*="feature"], article'));
      for (const el of cards) {
        if (isExcluded(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 120 || r.height < 50 || r.width > 900) continue;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;

        const heading = el.querySelector("h2, h3, h4, .metric-num, [class*='title']")?.innerText?.trim()?.slice(0, 32);
        const sub = el.querySelector("p, .metric-label, [class*='desc']")?.innerText?.trim()?.slice(0, 70);
        if (!heading && !sub) continue;

        const isMetric = !!el.querySelector(".metric-num, [class*='num'], [class*='stat']");
        let score = isMetric ? 78 : 72;
        if (el.dataset.curatePriority === "high" || el.classList.contains("featured")) score += 20;

        proofCandidates.push({
          type: isMetric ? "metric" : "card",
          act: actLabels.proof,
          element: el,
          score,
          rect: r,
          title: isMetric ? (isEnglish ? `Metric: ${heading}` : `Metrik: ${heading}`) : (heading || (isEnglish ? "Featured Capability" : "Fitur Unggulan")),
          desc: sub || (isEnglish ? "High-performance verified component architecture" : "Komponen arsitektur modern berkinerja tinggi"),
          icon: isMetric ? "📊" : "✨",
          nicheData,
        });
      }

      // Carousels
      const carousels = Array.from(body.querySelectorAll('.carousel, [class*="carousel"], .slider, [class*="slider"], .swiper, [class*="swiper"], [style*="overflow-x: auto"], [style*="overflow-x: scroll"]'));
      for (const el of carousels) {
        if (isExcluded(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 120 || r.height < 50) continue;
        proofCandidates.push({
          type: "carousel",
          act: actLabels.proof,
          element: el,
          score: 83,
          rect: r,
          title: isEnglish ? "Interactive Collection Slider" : "Koleksi Interaktif & Slider",
          desc: isEnglish ? "Fluid horizontal drag gallery exploration" : "Eksplorasi visual horizontal responsif & mulus",
          icon: "🎠",
          nicheData,
        });
      }
      proofCandidates.sort((a, b) => b.score - a.score);

      // ---------------------------------------------------------
      // CATEGORY 4: PRIMARY CONVERSION (CTAs & Action Buttons)
      // ---------------------------------------------------------
      const conversionCandidates = [];
      const buttons = Array.from(body.querySelectorAll('button, [role="button"], a.btn, a[class*="btn"], a[class*="button"], a[class*="cta"], .btn-primary, [class*="primary"]'));
      for (const el of buttons) {
        if (isExcluded(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 22) continue;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;

        const text = el.innerText.trim().slice(0, 32);
        if (!text) continue;

        const combinedText = `${text} ${el.className} ${el.getAttribute("aria-label") || ""} ${el.getAttribute("title") || ""}`;
        const isPostSubmit = el.matches('input[type="submit"], button[type="submit"]') || !!el.closest('form[method="post" i]');
        const dangerousActionPattern = /\b(delete|hapus|pay|checkout|bayar|buy|beli|order|pesan|subscribe|langganan|remove|cancel|batal|unsubscribe|sign[\s-]?out|log[\s-]?out|destroy|purge|billing)\b/i;
        const safeViewPattern = /\b(overview|history|laporan|riwayat|settings?|pengaturan|panduan|guide|docs?)\b/i;

        const isDangerous = (dangerousActionPattern.test(combinedText) && !safeViewPattern.test(combinedText)) || isPostSubmit;
        if (isDangerous) continue;

        const isPrimary = /primary|start|mulai|demo|daftar|coba|get started|try|explore|free|gratis|sign up|launch/i.test(text + " " + el.className);
        let score = isPrimary ? 96 : 74;
        if (r.top < window.innerHeight * 1.5) score += 10;

        conversionCandidates.push({
          type: "button",
          act: actLabels.conversion,
          element: el,
          score,
          rect: r,
          title: `${isEnglish ? "Call to Action" : "Aksi Utama"}: ${text}`,
          desc: isEnglish ? "Frictionless next-step conversion & workflow execution" : "Memicu alur kerja atau eksperimen produk langsung",
          icon: "🚀",
          toastMsg: nicheData.toastMsg,
          nicheData,
        });
      }
      conversionCandidates.sort((a, b) => b.score - a.score);

      // ---------------------------------------------------------
      // ASSEMBLE 4-ACT STORYLINE
      // ---------------------------------------------------------
      let targetCount = 5;
      if (this.tourFeatureCount === "all" || this.tourFeatureCount === "max" || this.tourFeatureCount === "99" || this.tourFeatureCount === 99) {
        targetCount = 99;
      } else if (this.tourFeatureCount && !isNaN(Number(this.tourFeatureCount))) {
        targetCount = Number(this.tourFeatureCount);
      } else if (this.targetDuration === "15s") {
        targetCount = 3;
      } else if (this.targetDuration === "60s") {
        targetCount = 7;
      }

      const storyline = [];
      const usedElements = new Set();

      const tryAdd = (item) => {
        if (!item || !item.element) return false;
        if (usedElements.has(item.element)) return false;
        for (const existing of storyline) {
          if (existing.element.contains(item.element) || item.element.contains(existing.element)) return false;
        }
        storyline.push(item);
        usedElements.add(item.element);
        return true;
      };

      // Act 1: Hero Hook (1-2 items)
      for (const h of heroCandidates) {
        if (storyline.filter(s => s.act === actLabels.hero).length >= (targetCount >= 10 ? 2 : 1)) break;
        tryAdd(h);
      }

      // Act 2: Core Interactive Workflow
      const maxWorkflow = targetCount <= 3 ? 1 : (targetCount <= 5 ? 2 : Math.max(2, Math.floor(targetCount * 0.35)));
      for (const w of workflowCandidates) {
        if (storyline.filter(s => s.act === actLabels.workflow).length >= maxWorkflow) break;
        tryAdd(w);
      }

      // Act 3: Proof & Capabilities
      const maxProof = targetCount <= 3 ? 0 : (targetCount <= 5 ? 1 : Math.max(2, Math.floor(targetCount * 0.40)));
      for (const p of proofCandidates) {
        if (storyline.filter(s => s.act === actLabels.proof).length >= maxProof) break;
        tryAdd(p);
      }

      // Act 4: Primary Conversion CTA
      const maxConversion = targetCount >= 10 ? 2 : 1;
      for (const c of conversionCandidates) {
        if (storyline.filter(s => s.act === actLabels.conversion).length >= maxConversion) break;
        tryAdd(c);
      }

      // Backfill if fewer than targetCount
      const pool = [...workflowCandidates, ...proofCandidates, ...conversionCandidates, ...heroCandidates];
      pool.sort((a, b) => b.score - a.score);
      for (const item of pool) {
        if (storyline.length >= targetCount) break;
        tryAdd(item);
      }

      return storyline.slice(0, targetCount);
    }

    async runFeatureTourFlow(manualList = null) {
      if (!this.running || this.aborted) return;
      this.dismissAnnoyancesAndBanners();
      this.updateHudStatus(`<strong>🎯 Feature Tour</strong> · Solo Presenter Memandu Demo`, 10);
      this.logTerminal(AGENTS[0], "TOUR", "Initiating Solo Presenter Feature Tour Mode...");

      // 1. Safety Interceptors (Form Submits, Navigations & Mutation Network Requests)
      const blockSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.logTerminal(AGENTS[0], "SAFE", "Form submit intercepted (Demo Mode)");
        return false;
      };
      window.addEventListener("submit", blockSubmit, true);
      document.addEventListener("submit", blockSubmit, true);

      const blockNavigation = (e) => {
        const interactive = e.target.closest("a, button, input[type='submit'], input[type='button'], [role='button']");
        if (interactive) {
          e.preventDefault();
          e.stopPropagation();
          this.logTerminal(AGENTS[0], "SAFE", "Interactive navigation intercepted (Demo Mode)");
        }
      };
      window.addEventListener("click", blockNavigation, true);
      document.addEventListener("click", blockNavigation, true);

      // Network Mocking / Sandbox Monkeypatching: Block mutating fetch, XHR, and sendBeacon
      const originalFetch = window.fetch;
      const originalXhrOpen = XMLHttpRequest.prototype.open;
      const originalXhrSend = XMLHttpRequest.prototype.send;
      const originalSendBeacon = navigator.sendBeacon ? navigator.sendBeacon.bind(navigator) : null;

      window.fetch = async (...args) => {
        let method = "GET";
        const init = args[1];
        if (init && init.method) method = String(init.method).toUpperCase();
        else if (args[0] && typeof args[0] === "object" && args[0].method) method = String(args[0].method).toUpperCase();

        if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
          this.logTerminal(AGENTS[0], "SAFE", `Blocked ${method} fetch -> Returned simulated 200 OK`);
          return new Response(JSON.stringify({ success: true, simulated: true, message: "Rebuildr Tour Safe Sandbox: Mutation neutralized" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        return originalFetch.apply(window, args);
      };

      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this.__rebuildrMethod = String(method || "GET").toUpperCase();
        this.__rebuildrUrl = url;
        if (["POST", "PUT", "DELETE", "PATCH"].includes(this.__rebuildrMethod)) {
          return;
        }
        return originalXhrOpen.call(this, method, url, ...rest);
      };

      XMLHttpRequest.prototype.send = function(...bodyArgs) {
        if (["POST", "PUT", "DELETE", "PATCH"].includes(this.__rebuildrMethod)) {
          Object.defineProperty(this, "readyState", { value: 4, configurable: true });
          Object.defineProperty(this, "status", { value: 200, configurable: true });
          Object.defineProperty(this, "responseText", { value: JSON.stringify({ success: true, simulated: true }), configurable: true });
          Object.defineProperty(this, "response", { value: JSON.stringify({ success: true, simulated: true }), configurable: true });
          setTimeout(() => {
            this.dispatchEvent(new Event("readystatechange"));
            this.dispatchEvent(new Event("load"));
            this.dispatchEvent(new Event("loadend"));
          }, 10);
          return;
        }
        return originalXhrSend.apply(this, bodyArgs);
      };

      if (originalSendBeacon) {
        navigator.sendBeacon = function(url, data) {
          return true;
        };
      }

      // 2. Setup Solo Hero Cursor & Brand Color
      this.setupTourCrewRoles();
      this.ensureTourElements();

      // 3. Scan & Rank Features or Use Manual List
      let features;
      const nicheData = this.detectWebsiteNiche();

      if (manualList && manualList.length > 0) {
        features = manualList.map((el, i) => {
          const r = el.getBoundingClientRect();
          const tag = el.tagName.toLowerCase();
          const title = el.querySelector("h1, h2, h3, h4, [class*='title']")?.innerText?.trim()?.slice(0, 32)
            || el.innerText?.trim()?.slice(0, 28)
            || `Fitur ${i + 1}`;
          const isInput = tag === "input" || tag === "textarea";
          return {
            type: isInput ? "input" : (tag === "button" || el.matches("a.btn, [role='button']") ? "button" : (tag === "details" ? "accordion" : "card")),
            element: el,
            rect: r,
            title,
            desc: el.querySelector("p, [class*='desc']")?.innerText?.trim()?.slice(0, 70) || "Fitur kustom pilihan pengguna",
            icon: isInput ? "⌨️" : (tag === "button" ? "⚡" : (tag === "details" ? "📂" : "✨")),
            mockValue: isInput ? nicheData.sampleSearch : "",
            nicheData,
          };
        });
      } else {
        features = this.discoverAndRankFeatures();
      }

      this.logTerminal(AGENTS[0], "DIRECTOR", `Selected ${features.length} interactive features to showcase.`);

      // 4. Reset scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      await this.sleep(400);

      // INTRO SCENE: Solo Hero Cursor greets the viewer
      const heroCursor = this.cursors[0];
      const htmlLang = (document.documentElement.lang || document.querySelector('meta[http-equiv="content-language"]')?.content || "").toLowerCase();
      const isEnglish = this.tourLanguage === "en" || (!this.tourLanguage && htmlLang.startsWith("en"));

      const defaultHookTitle = isEnglish ? "⚡ FEATURE TOUR: AUTONOMOUS PRODUCT DEMO" : "⚡ FEATURE TOUR: EKSPLORASI FITUR OTONOM";
      const defaultHookDesc = isEnglish ? "Interactive showcase of core features & capabilities" : "Panduan interaktif fitur & teknologi terbaik di website ini";
      const hookTitle = this.customHookText || defaultHookTitle;
      this.showTourCaption("🚀", hookTitle, defaultHookDesc);
      this.sound.playWhoosh(1.2);

      await this.glideCursorBezier(heroCursor, window.innerWidth * 0.5, window.innerHeight * 0.38, 700, { arch: 1 });
      await this.sleep(1800);
      this.hideTourCaption();
      await this.sleep(250);

      // CHAPTER TIMELINE TRACKER
      const chapters = [
        { time: "00:00", name: isEnglish ? "Overview & Hero" : "Overview & Hero" }
      ];
      const startTime = Date.now();

      // FEATURE PRESENTATION LOOP
      this.showTourStoryBar(features.length);
      for (let i = 0; i < features.length; i++) {
        if (!this.running || this.aborted) break;
        const feat = features[i];
        const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
        const timeFormatted = `00:${String(elapsedSec).padStart(2, "0")}`;
        chapters.push({
          time: timeFormatted,
          name: feat.title.replace(/^(Tab & Filter:\s*|Aksi Utama:\s*|Kolom:\s*|Metrik Performa:\s*|Eksplorasi Detail:\s*)/, ""),
        });

        const pct = Math.round(15 + ((i + 1) / features.length) * 70);
        this.updateHudStatus(`<strong>${isEnglish ? "Feature" : "Fitur"} ${i + 1}/${features.length}</strong> · ${feat.title}`, pct);

        await this.presentSingleFeature(feat, i, features.length, heroCursor);
      }

      // OUTRO SCENE
      this.hideTourStoryBar();
      if (this.running && !this.aborted) {
        const totalElapsed = Math.floor((Date.now() - startTime) / 1000);
        const outroTitle = isEnglish ? "Summary & Try Live" : "Ringkasan & Coba Sekarang";
        const outroSpeech = isEnglish ? "Feature tour complete. Experience it live directly on this website." : "Demo fitur selesai. Coba sekarang langsung di website ini.";
        chapters.push({
          time: `00:${String(totalElapsed).padStart(2, "0")}`,
          name: outroTitle,
        });

        this.updateHudStatus(isEnglish ? `<strong>🎬 Completed</strong> · Tour Video Created` : `<strong>🎬 Selesai</strong> · Video Tour Berhasil Dibuat`, 100);
        this.sound.playFinaleChord();
        this.renderTourChapterCard(chapters);
        this.speakTourNarration(outroSpeech);

        await this.glideCursorBezier(heroCursor, window.innerWidth * 0.5, window.innerHeight * 0.5 - 170, 600, { arch: -1 });

        await this.sleep(3200);
        this.hideTourChapterCard();
      }

      // Cleanup Interceptors & Restore Network Methods
      window.removeEventListener("submit", blockSubmit, true);
      window.removeEventListener("click", blockNavigation, true);
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXhrOpen;
      XMLHttpRequest.prototype.send = originalXhrSend;
      if (originalSendBeacon) navigator.sendBeacon = originalSendBeacon;
      this.restoreTourCrewRoles();

      if ((this.mediaRecorder && this.mediaRecorder.state === "recording") || this.autoRecordOnLaunch) {
        this.stopVideoRecordingAndSave();
      } else {
        this.notifyReconstructionComplete();
      }
    }

    async presentSingleFeature(feat, idx, total, heroCursor) {
      const el = feat.element;
      if (!el || !el.isConnected) return;

      // 1. Smooth Camera Scroll to Element with Settling Detection
      await this.smoothScrollToElement(el);

      // Re-read bounding rect after scrolling
      const currentRect = el.getBoundingClientRect();
      const isNearBottom = currentRect.bottom > window.innerHeight * 0.58;

      // 2. TRUE CINEMATIC PUNCH-IN CAMERA ZOOM & SPOTLIGHT
      this.applyCinematicCameraZoom(currentRect, el);
      const badgeText = feat.act ? feat.act : `FITUR ${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      this.showTourSpotlight(currentRect, badgeText, el);
      this.sound.playWhoosh(1.1);

      // 3. Caption with Dynamic Collision Avoidance (Top vs Bottom Docking) & Narrative Act
      this.showTourCaption(feat.icon || "⚡", feat.title, feat.desc, feat.act || null, isNearBottom);
      this.sound.playSceneChime();

      // Update Segmented Stories Progress Bar
      this.updateTourStoryActive(idx);

      // 4. Solo Hero Cursor Glides along Bezier Curve to Target Element
      const targetX = currentRect.left + Math.min(60, currentRect.width * 0.5);
      const targetY = currentRect.top + currentRect.height * 0.5;
      await this.glideCursorBezier(heroCursor, targetX, targetY, 650, { arch: idx % 2 === 0 ? 1 : -1 });

      await this.sleep(260);

      // 5. High-Impact Action & Visual Results
      const nicheData = feat.nicheData || this.detectWebsiteNiche();

      if (feat.type === "hero") {
        this.sound.playLockSnap(1.1);
        await this.glideCursorUnderline(heroCursor, el, 550);
        this.triggerCursorSquish(heroCursor);
        this.simulateClickRipple(targetX, targetY);
        await this.sleep(350);
      } else if (feat.type === "input" || feat.type === "search") {
        this.setHeroCursorMode(heroCursor, "text");
        el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: targetX, clientY: targetY }));
        el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: targetX, clientY: targetY }));
        await this.sleep(160);
        this.triggerCursorSquish(heroCursor);
        this.simulateClickRipple(targetX, targetY);
        this.sound.playSnap(1.0);
        el.focus();

        const mockVal = feat.mockValue || nicheData.sampleSearch;
        let curVal = "";
        for (let char of mockVal) {
          if (!this.running || this.aborted) break;
          curVal += char;
          el.value = curVal;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          this.sound.playKey();
          await this.sleep(50);
        }
        el.dispatchEvent(new Event("change", { bubbles: true }));

        // LIVE REVEAL: Search dropdown slides down dynamically!
        this.showTourSearchDropdown(el, curVal, nicheData);
        await this.sleep(400);

        // Solo Cursor moves down to select the first dropdown result!
        const ddItem = this.tourSearchDropdown.querySelector("#tour-dd-item-0");
        if (ddItem) {
          const ddRect = ddItem.getBoundingClientRect();
          this.setHeroCursorMode(heroCursor, "pointer");
          await this.glideCursorBezier(heroCursor, ddRect.left + 80, ddRect.top + ddRect.height * 0.5, 420);
          this.triggerCursorSquish(heroCursor);
          this.simulateClickRipple(ddRect.left + 80, ddRect.top + ddRect.height * 0.5);
          this.sound.playLockSnap(1.15);
          ddItem.style.background = "rgba(var(--brand-rgb, 16, 185, 129), 0.4)";
          await this.sleep(300);
        }
        this.hideTourSearchDropdown();
        this.setHeroCursorMode(heroCursor, "default");
      } else if (feat.type === "toggle") {
        this.setHeroCursorMode(heroCursor, "pointer");
        el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: targetX, clientY: targetY }));
        el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: targetX, clientY: targetY }));
        await this.sleep(160);
        this.triggerCursorSquish(heroCursor);
        this.simulateClickRipple(targetX, targetY);
        this.sound.playToggle(true);

        if (el.tagName === "INPUT" && el.type === "checkbox") {
          el.checked = !el.checked;
          el.dispatchEvent(new Event("change", { bubbles: true }));
          el.dispatchEvent(new Event("click", { bubbles: true }));
        } else {
          const isAct = el.classList.contains("active") || el.getAttribute("aria-checked") === "true";
          el.classList.toggle("active", !isAct);
          el.setAttribute("aria-checked", String(!isAct));
          el.dispatchEvent(new Event("click", { bubbles: true }));
        }
        this.triggerContentFlash(el);
        this.showTourToast("⚙️ Pengaturan Fitur Berhasil Diaktifkan!");
        await this.sleep(700);
        this.setHeroCursorMode(heroCursor, "default");
      } else if (feat.type === "slider") {
        this.setHeroCursorMode(heroCursor, "grab");
        el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: targetX, clientY: targetY }));
        el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: targetX, clientY: targetY }));
        await this.sleep(160);
        this.simulateClickRipple(targetX, targetY);
        await this.sleep(140);
        this.setHeroCursorMode(heroCursor, "grabbing");
        this.triggerCursorSquish(heroCursor);

        const min = parseFloat(el.min) || 0;
        const max = parseFloat(el.max) || 100;
        const initialVal = parseFloat(el.value) || min;
        const targetVal = min + (max - min) * 0.78;

        const steps = 7;
        for (let s = 1; s <= steps; s++) {
          if (!this.running || this.aborted) break;
          const currentV = initialVal + (targetVal - initialVal) * (s / steps);
          el.value = String(Math.round(currentV));
          el.dispatchEvent(new Event("input", { bubbles: true }));
          this.sound.playSliderTick(s / steps);
          await this.sleep(55);
        }
        el.dispatchEvent(new Event("change", { bubbles: true }));
        this.showTourToast("🎛️ Parameter Komputasi Live Disesuaikan");
        await this.sleep(350);
        this.setHeroCursorMode(heroCursor, "default");
      } else if (feat.type === "select") {
        this.setHeroCursorMode(heroCursor, "pointer");
        el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: targetX, clientY: targetY }));
        el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: targetX, clientY: targetY }));
        await this.sleep(160);
        this.triggerCursorSquish(heroCursor);
        this.simulateClickRipple(targetX, targetY);
        this.sound.playPop(1.1);

        if (el.tagName === "SELECT" && el.options && el.options.length > 1) {
          el.selectedIndex = Math.min(1, el.options.length - 1);
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
        this.showTourToast("📋 Opsi Konfigurasi Dipilih");
        await this.sleep(600);
        this.setHeroCursorMode(heroCursor, "default");
      } else if (feat.type === "accordion") {
        this.setHeroCursorMode(heroCursor, "pointer");
        el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: targetX, clientY: targetY }));
        el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: targetX, clientY: targetY }));
        await this.sleep(160);
        this.triggerCursorSquish(heroCursor);
        this.simulateClickRipple(targetX, targetY);
        this.sound.playSnap(1.15);

        if (el.tagName === "DETAILS") {
          el.open = !el.open;
        } else if (el.hasAttribute("aria-expanded")) {
          const isExp = el.getAttribute("aria-expanded") === "true";
          el.setAttribute("aria-expanded", String(!isExp));
        }
        el.classList.add("tour-accordion-highlight");
        await this.sleep(1200);
        if (el.tagName === "DETAILS") el.open = false;
        el.classList.remove("tour-accordion-highlight");
        this.setHeroCursorMode(heroCursor, "default");
      } else if (feat.type === "tab" || feat.type === "button") {
        this.setHeroCursorMode(heroCursor, "pointer");
        el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: targetX, clientY: targetY }));
        el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: targetX, clientY: targetY }));
        await this.sleep(160);
        this.triggerCursorSquish(heroCursor);
        this.simulateClickRipple(targetX, targetY);
        this.sound.playSnap(1.15);

        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

        // Safe interactive click: only dispatch click if it will NOT trigger form submission or navigation
        const isFormSubmit = el.closest("form") || el.matches("button, input[type='submit'], [type='submit']");
        const isLink = el.matches("a, a *");
        if (!isFormSubmit && !isLink) {
          el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
        el.classList.add("active");

        this.triggerContentFlash(el);

        if (feat.type === "button" && /mulai|start|gratis|free|coba|demo|beli|checkout/i.test(feat.title)) {
          this.showTourToast(feat.toastMsg || nicheData.toastMsg || "🚀 Fitur Berhasil Diaktifkan!");
        }
        this.setHeroCursorMode(heroCursor, "default");
      } else if (feat.type === "metric" || feat.type === "card") {
        this.sound.playLockSnap(1.1);
        await this.glideCursorUnderline(heroCursor, el, 420);
        this.triggerCursorSquish(heroCursor);
        this.simulateClickRipple(targetX, targetY);

        el.style.transition = "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s";
        el.style.transform = "scale(1.035) translateY(-4px)";
        el.style.boxShadow = "0 16px 40px rgba(var(--brand-rgb, 16, 185, 129), 0.35)";

        await this.glideCursorBezier(heroCursor, targetX + 40, targetY - 15, 320, { arch: 1 });
        await this.glideCursorBezier(heroCursor, targetX - 20, targetY + 15, 360, { arch: -1 });
        await this.glideCursorBezier(heroCursor, targetX, targetY, 280, { arch: 1 });
      } else if (feat.type === "carousel") {
        this.setHeroCursorMode(heroCursor, "grab");
        const startX = targetX + Math.min(80, currentRect.width * 0.35);
        await this.glideCursorBezier(heroCursor, startX, targetY, 280, { arch: 1 });
        this.setHeroCursorMode(heroCursor, "grabbing");
        this.triggerCursorSquish(heroCursor);
        this.sound.playWhoosh(1.0);

        // Horizontal swipe gesture
        const dragDistance = Math.min(180, currentRect.width * 0.5);
        const steps = 8;
        for (let s = 1; s <= steps; s++) {
          if (!this.running || this.aborted) break;
          const currX = startX - dragDistance * (s / steps);
          heroCursor.x = currX;
          heroCursor.el.style.transform = `translate3d(${currX}px, ${targetY}px, 0)`;
          if (el.scrollBy) el.scrollBy({ left: dragDistance / steps, behavior: "auto" });
          if (s % 3 === 0) this.sound.playSliderTick(s / steps);
          await this.sleep(35);
        }
        this.setHeroCursorMode(heroCursor, "grab");
        this.showTourToast("🎠 Jelajahi Koleksi Interaktif");
        await this.sleep(450);
        this.setHeroCursorMode(heroCursor, "default");
      }

      // 6. Dwell Time for Reader & Complete Stories Step (Adaptive per Target Duration)
      this.completeTourStoryActive(idx);
      const dwellMs = this.targetDuration === "15s" ? 950 : (this.targetDuration === "60s" ? 3200 : 1600);
      await this.sleep(dwellMs);

      // 7. Cleanup & Smooth Camera Zoom Pullback
      this.resetCinematicCameraZoom();
      this.hideTourSpotlight();
      this.hideTourCaption();
      this.setHeroCursorMode(heroCursor, "default");
      if (feat.type === "metric" || feat.type === "card") {
        el.style.transform = "";
        el.style.boxShadow = "";
      }
      if (feat.type === "input" || feat.type === "search") {
        setTimeout(() => {
          try {
            el.value = "";
            el.dispatchEvent(new Event("input", { bubbles: true }));
          } catch (_) {}
        }, 350);
      }
      await this.sleep(280);
    }

    async runShowcaseFlow(forcedStartIndex = null) {
      this.dismissAnnoyancesAndBanners();
      if (this.showcasePreset === "feature-tour") {
        await this.runFeatureTourFlow();
        return;
      }
      if (this.showcasePreset === "teaser-30s") {
        this.launchScope = "curated";
      }
      this.curateAndRestructurePage();
      await this.playShowcasePresetHook();
      if (!this.running || this.aborted) return;

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
        } else if (this.motionMode) {
          // Motion Mode: open the video with a veil + kinetic title card for the first chapter
          this.showMotionVeil();
          this.preHideScene(scene, i === 0);
          await this.motionCut(scene.offsetTop, {
            force: true,
            title: this.getSceneMotionTitle(scene, i, scenes.length),
            transition: this.pickMotionTransition({ ...this.profileMotionElements([scene]), isIntro: true }),
          });
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
        if (this.motionMode) {
          const hostLabel = location.hostname || (document.title || "Rebuildr Studio").split(/[—|·-]/)[0].trim();
          await this.motionCut(0, {
            force: true,
            transition: "zoom",
            title: {
              num: "\u2713",
              kicker: "Rebuilt from scratch",
              title: document.title || hostLabel,
              sub: `${scenes.length} scenes \u00b7 Rebuildr`,
              counter: "Final",
              corner: hostLabel,
            },
          });
          await this.sleep(1000);
        }
        if (!this.running || this.aborted) return;
        this.sound.playFinaleChord();
        this.cursors.forEach((c) => {
          c.busy = false;
          this.setCursorMode(c, "pointer", c.agent.role, c.agent.name);
        });
        this.overlay.classList.remove("is-building");
        this.updateHudStatus(`<strong>✓ Selesai</strong> · Semua Bab Terbangun`, 100);
        this.logTerminal(AGENTS[0], "DONE", "All scenes reconstructed (100%)");
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
          this.stopVideoRecordingAndSave();
        } else {
          this.notifyReconstructionComplete();
        }
      }
    }

    // -------------------------------------------------------------------------
    // 7B. UNIVERSAL WEBSITE REBUILD ENGINE (Works on ANY Website!)
    //     Scans DOM into top-to-bottom viewport rows, auto-scrolls, draws
    //     polygons on media, wireframes on cards, and types 100% of text!
    // -------------------------------------------------------------------------
    async runUniversalWebsiteFlow() {
      if (this.motionMode) {
        await this.runMotionWebsiteFlow();
        return;
      }
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

      let bands = Array.from(bandMap.values())
        .filter((b) => b.anchorEls.length > 0)
        .sort((a, b) => a.idx - b.idx);

      let maxBands = 4;
      if (this.targetDuration === "15s") {
        maxBands = 2;
        this.speed = Math.max(this.speed, 2.0);
      } else if (this.targetDuration === "60s") {
        maxBands = 6;
      }

      if (this.launchScope === "curated" && bands.length > maxBands) {
        this.logTerminal(AGENTS[0], "CURATE", `ai director: filtered ${bands.length} -> ${maxBands} highlight bands (${this.targetDuration || "default"})`);
        bands = bands.slice(0, maxBands);
      }

      for (let i = 0; i < bands.length; i++) {
        if (!this.running || this.aborted) break;
        const band = bands[i];
        const pct = ((i + 0.5) / Math.max(1, bands.length)) * 100;
        this.updateHudStatus(
          `<strong>Bagian ${i + 1}/${bands.length}</strong> · 8 Kursor Merakit Poligon, Wireframe & Teks...`,
          pct
        );

        await this.ensureElementsInView(band.anchorEls.slice(0, 6), 96, 0.2);
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
        this.sound.playFinaleChord();
        this.overlay.classList.remove("is-building");
        this.updateHudStatus(`<strong>✓ Selesai</strong> · Seluruh Halaman Terbangun`, 100);
        this.logTerminal(AGENTS[0], "DONE", "Full webpage reconstructed (100%)");
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
          this.stopVideoRecordingAndSave();
        } else {
          this.notifyReconstructionComplete();
        }
      }
    }

    async smoothScrollTo(targetTop, duration = 520) {
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

      if (Math.abs(dist) > 140) {
        this.sound.playWhoosh(Math.min(1.3, Math.abs(dist) / 480));
      }

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

    async animateScrollTo(targetTop, duration = 520) {
      // Motion Design Mode: cuts with full-screen transition on inter-scene transitions
      if (this.motionMode) {
        await this.motionCut(targetTop);
        return;
      }
      await this.smoothScrollTo(targetTop, duration);
    }

    updateTerminalPlacement(activeElements) {
      if (!this.terminalEl) return;
      const vh = window.innerHeight;
      const els = (Array.isArray(activeElements) ? activeElements : [activeElements]).filter(Boolean);
      let collidesBottomLeft = false;
      for (const el of els) {
        if (!el || typeof el.getBoundingClientRect !== "function") continue;
        const r = el.getBoundingClientRect();
        // Check if element intersects with bottom-left quadrant (where mini-terminal sits)
        if (r.width > 0 && r.height > 0 && r.left < 420 && r.bottom > vh - 260 && r.top < vh) {
          collidesBottomLeft = true;
          break;
        }
      }
      if (collidesBottomLeft) {
        this.terminalEl.classList.add("dock-top-right");
      } else {
        this.terminalEl.classList.remove("dock-top-right");
      }
    }

    async ensureElementsInView(els, paddingBottom = 96, targetTopRatio = 0.2) {
      if (!this.running || this.aborted) return;
      const list = (Array.isArray(els) ? els : [els]).filter(Boolean);
      if (list.length === 0) return;

      // Relocate mini-terminal to top-right if elements being assembled lie in the bottom-left area
      this.updateTerminalPlacement(list);

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
      // Top safe margin: sits cleanly below the fixed top navigation bar (typically 64px - 76px tall)
      const topSafe = 80;
      // Bottom safe margin: sits cleanly above floating bottom HUD bar
      const bottomSafe = vh - Math.max(76, paddingBottom);

      // Find enclosing section boundary (MUST check parentElement so individual cards/articles are not mistaken for sections!)
      const parentSection = list[0].parentElement
        ? list[0].parentElement.closest(".story-scene, section, [role='region'], main > *, [class*='section']")
        : null;

      let maxAllowedScroll = Infinity;
      let minAllowedScroll = 0;
      if (parentSection) {
        const secR = parentSection.getBoundingClientRect();
        const secTopDoc = secR.top + curScrollTop;
        const secBottomDoc = secR.bottom + curScrollTop;
        // Never scroll past the natural bottom of the section (align bottom of section above HUD)
        maxAllowedScroll = Math.max(secTopDoc, Math.round(secBottomDoc - bottomSafe));
        // Never scroll above the top of the section (prevents previous section from bleeding into view)
        minAllowedScroll = Math.max(0, Math.round(secTopDoc));
      }

      // Convert viewport bounding rects into absolute document coordinates
      const elTopDoc = minTop + curScrollTop;
      const elBottomDoc = maxBottom + curScrollTop;
      const elementHeight = elBottomDoc - elTopDoc;
      const availableHeight = bottomSafe - topSafe;

      let targetScroll = curScrollTop;
      if (elementHeight > availableHeight) {
        // CASE A: Element is taller than safe viewport (e.g. 420px card on 472px viewport, or multi-row group)
        // CRITICAL TOP PRIORITY: The header, thumbnail, and title must NEVER be pushed off-screen or behind top-nav!
        // Align the top of the element flush beneath top navbar:
        targetScroll = elTopDoc - topSafe;
      } else {
        // CASE B: Element fits within the viewport safe zone:
        if (maxBottom > bottomSafe) {
          // Bottom overflows: scroll down just enough to bring bottom above bottomSafe
          targetScroll = elBottomDoc - bottomSafe;
          // STRICT CLAMP: Never allow bottom-anchoring to push the top above topSafe!
          if (targetScroll > elTopDoc - topSafe) {
            targetScroll = elTopDoc - topSafe;
          }
        } else if (minTop < topSafe) {
          // Top is hidden behind top navbar: scroll up to align with topSafe
          targetScroll = elTopDoc - topSafe;
        }
      }

      // Clamp target scroll strictly within document boundaries (no overscrolling into negative or past document bottom)
      const maxDocScroll = Math.max(
        0,
        (isWin ? document.documentElement.scrollHeight : scroller.scrollHeight) - vh
      );
      targetScroll = Math.max(0, Math.min(maxDocScroll, targetScroll));

      const deltaY = targetScroll - curScrollTop;
      if (Math.abs(deltaY) < 12) return;
      // In-scene camera follow: ALWAYS smooth auto-scroll directly, no transition overlays!
      await this.smoothScrollTo(targetScroll, 480);
    }

    // -------------------------------------------------------------------------
    // 7C. MOTION DESIGN MODE (G) — Shot-Based Camera, Transitions & Title Cards
    //     Instead of visibly scrolling, the page is "cut" to each new framing
    //     while a full-screen transition covers the jump. Each section opens
    //     with a kinetic title card; tall sections are split into several shots.
    //     The transition style is picked from the content of the next shot.
    // -------------------------------------------------------------------------
    ensureMotionStage() {
      if (!this.motionStage || !this.motionStage.isConnected) {
        const stage = document.createElement("div");
        stage.id = "swarm-motion-stage";
        this.overlay.appendChild(stage);
        this.motionStage = stage;
      }
      return this.motionStage;
    }

    showMotionVeil() {
      const stage = this.ensureMotionStage();
      if (stage.querySelector(".swarm-mx-veil")) return;
      const veil = document.createElement("div");
      veil.className = "swarm-mx-layer swarm-mx-panel swarm-mx-veil";
      stage.appendChild(veil);
    }

    clearMotionStage() {
      this.motionPendingTitle = null;
      this.motionNextTransition = null;
      this.motionNextShotLabel = null;
      this.motionSceneShotIdx = 1;
      if (!this.motionStage) return;
      try {
        this.motionStage.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      } catch (_) {}
      this.motionStage.innerHTML = "";
    }

    jumpScrollTo(top) {
      const scroller = this.getScroller();
      if (!scroller) return;
      const isWin = scroller === document.body || scroller === document.documentElement;
      const html = document.documentElement;
      const prevHtml = html.style.scrollBehavior;
      const prevScroller = scroller.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      scroller.style.scrollBehavior = "auto";
      if (isWin) {
        try {
          window.scrollTo({ top, left: 0, behavior: "instant" });
        } catch (_) {
          window.scrollTo(0, top);
        }
      } else {
        scroller.scrollTop = top;
      }
      html.style.scrollBehavior = prevHtml;
      scroller.style.scrollBehavior = prevScroller;
    }

    mxAnim(el, keyframes, duration, opts = {}) {
      try {
        const a = el.animate(keyframes, {
          duration: Math.max(1, duration),
          delay: Math.max(0, opts.delay || 0),
          easing: opts.easing || "cubic-bezier(0.76, 0, 0.24, 1)",
          fill: "both",
        });
        if (this.paused) a.pause();
        return a.finished.catch(() => {});
      } catch (_) {
        return Promise.resolve();
      }
    }

    // Resolves true when `promise` settles, or false as soon as the run is aborted/stopped
    mxWait(promise) {
      return new Promise((resolve) => {
        let done = false;
        Promise.resolve(promise).then(() => {
          done = true;
          resolve(true);
        });
        const poll = () => {
          if (done) return;
          if (!this.running || this.aborted) return resolve(false);
          setTimeout(poll, 16);
        };
        poll();
      });
    }

    buildMotionFx(type, host, inDur, outDur) {
      const E = "cubic-bezier(0.76, 0, 0.24, 1)";
      const mk = (cls, css = "") => {
        const d = document.createElement("div");
        d.className = cls;
        if (css) d.style.cssText = css;
        host.appendChild(d);
        return d;
      };
      const all = (arr) => Promise.all(arr);

      if (type === "slide-down" || type === "push-down") {
        const acc = mk("swarm-mx-layer swarm-mx-accent");
        const pan = mk("swarm-mx-layer swarm-mx-panel");
        const kf = (a, b) => [{ transform: `translateY(${a})` }, { transform: `translateY(${b})` }];
        return {
          cover: () =>
            all([
              this.mxAnim(acc, kf("-100%", "0%"), inDur * 0.8, { easing: E }),
              this.mxAnim(pan, kf("-100%", "0%"), inDur * 0.8, { easing: E, delay: inDur * 0.18 }),
            ]),
          reveal: () =>
            all([
              this.mxAnim(pan, kf("0%", "100%"), outDur * 0.8, { easing: E }),
              this.mxAnim(acc, kf("0%", "100%"), outDur * 0.8, { easing: E, delay: outDur * 0.18 }),
            ]),
        };
      }

      if (type === "push") {
        const acc = mk("swarm-mx-layer swarm-mx-accent");
        const pan = mk("swarm-mx-layer swarm-mx-panel");
        const kf = (a, b) => [{ transform: `translateY(${a})` }, { transform: `translateY(${b})` }];
        return {
          cover: () =>
            all([
              this.mxAnim(acc, kf("100%", "0%"), inDur * 0.8, { easing: E }),
              this.mxAnim(pan, kf("100%", "0%"), inDur * 0.8, { easing: E, delay: inDur * 0.2 }),
            ]),
          reveal: () =>
            all([
              this.mxAnim(pan, kf("0%", "-100%"), outDur * 0.8, { easing: E }),
              this.mxAnim(acc, kf("0%", "-100%"), outDur * 0.8, { easing: E, delay: outDur * 0.2 }),
            ]),
        };
      }

      if (type === "zoom") {
        const ring = mk("swarm-mx-layer swarm-mx-accent");
        const pan = mk("swarm-mx-layer swarm-mx-panel");
        const kf = [
          { clipPath: "inset(50% 50% 50% 50% round 36px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)" },
        ];
        return {
          cover: () =>
            all([
              this.mxAnim(ring, kf, inDur * 0.72, { easing: E }),
              this.mxAnim(pan, kf, inDur * 0.72, { easing: E, delay: inDur * 0.28 }),
            ]),
          reveal: () => {
            ring.remove();
            return this.mxAnim(
              pan,
              [
                { opacity: 1, transform: "scale(1)", filter: "blur(0px)" },
                { opacity: 0, transform: "scale(1.35)", filter: "blur(14px)" },
              ],
              outDur,
              { easing: "cubic-bezier(0.55, 0, 0.1, 1)" }
            );
          },
        };
      }

      if (type === "iris") {
        const D = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) * 2 + 60);
        const hole = mk("swarm-mx-iris", `width:${D}px;height:${D}px;`);
        const open = { width: `${D}px`, height: `${D}px` };
        const closed = { width: "0px", height: "0px" };
        return {
          cover: () => this.mxAnim(hole, [open, closed], inDur, { easing: "cubic-bezier(0.65, 0, 0.35, 1)" }),
          reveal: () => this.mxAnim(hole, [closed, open], outDur, { easing: "cubic-bezier(0.65, 0, 0.35, 1)" }),
        };
      }

      if (type === "glitch") {
        const n = 7;
        const pieces = [];
        for (let i = 0; i < n; i++) {
          const css = `left:0;right:0;top:${(i * 100) / n}%;height:${100 / n + 0.6}%;`;
          const dir = i % 2 === 0 ? 1 : -1;
          const jitter = Math.random() * 0.3;
          const acc = mk(`swarm-mx-slice ${i % 3 === 0 ? "swarm-mx-accent2" : "swarm-mx-accent"}`, css);
          const pan = mk("swarm-mx-slice swarm-mx-panel", css);
          pieces.push({ acc, pan, dir, jitter });
        }
        const inKf = (dir) => [
          { transform: `translateX(${dir * 105}%)` },
          { transform: `translateX(${dir * -7}%)`, offset: 0.7 },
          { transform: `translateX(${dir * 3}%)`, offset: 0.86 },
          { transform: "translateX(0%)" },
        ];
        const outKf = (dir) => [
          { transform: "translateX(0%)" },
          { transform: `translateX(${dir * 4}%)`, offset: 0.18 },
          { transform: `translateX(${dir * -105}%)` },
        ];
        const ease = "cubic-bezier(0.9, 0, 0.1, 1)";
        return {
          cover: () =>
            all(
              pieces.flatMap((p) => [
                this.mxAnim(p.acc, inKf(p.dir), inDur * 0.6, { easing: ease, delay: inDur * p.jitter }),
                this.mxAnim(p.pan, inKf(p.dir), inDur * 0.6, { easing: ease, delay: inDur * (p.jitter + 0.1) }),
              ])
            ),
          reveal: () =>
            all(
              pieces.flatMap((p) => [
                this.mxAnim(p.pan, outKf(p.dir), outDur * 0.6, { easing: ease, delay: outDur * p.jitter }),
                this.mxAnim(p.acc, outKf(p.dir), outDur * 0.6, { easing: ease, delay: outDur * (p.jitter + 0.1) }),
              ])
            ),
        };
      }

      if (type === "blinds") {
        const n = 8;
        const cols = [];
        for (let i = 0; i < n; i++) {
          cols.push(
            mk(
              "swarm-mx-slice swarm-mx-panel",
              `top:0;bottom:0;left:${(i * 100) / n}%;width:${100 / n + 0.4}%;transform-origin:50% 0%;box-shadow:inset 0 -3px 0 var(--mx-accent);`
            )
          );
        }
        const stagger = (dur) => (dur * 0.35) / n;
        return {
          cover: () =>
            all(
              cols.map((col, i) =>
                this.mxAnim(col, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], inDur * 0.65, {
                  easing: E,
                  delay: i * stagger(inDur),
                })
              )
            ),
          reveal: () =>
            all(
              cols.map((col, i) => {
                col.style.transformOrigin = "50% 100%";
                col.style.boxShadow = "inset 0 3px 0 var(--mx-accent)";
                return this.mxAnim(col, [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], outDur * 0.65, {
                  easing: E,
                  delay: i * stagger(outDur),
                });
              })
            ),
        };
      }

      // Default: "wipe" — accent edge + panel sweeping left → right
      const acc = mk("swarm-mx-layer swarm-mx-accent");
      const pan = mk("swarm-mx-layer swarm-mx-panel");
      const inKf = [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }];
      const outKf = [{ clipPath: "inset(0 0 0 0%)" }, { clipPath: "inset(0 0 0 100%)" }];
      return {
        cover: () =>
          all([
            this.mxAnim(acc, inKf, inDur * 0.78, { easing: E }),
            this.mxAnim(pan, inKf, inDur * 0.78, { easing: E, delay: inDur * 0.22 }),
          ]),
        reveal: () =>
          all([
            this.mxAnim(pan, outKf, outDur * 0.78, { easing: E }),
            this.mxAnim(acc, outKf, outDur * 0.78, { easing: E, delay: outDur * 0.22 }),
          ]),
      };
    }

    async playMotionTransition(type, { title = null, shotLabel = null, onCovered = null } = {}) {
      const stage = this.ensureMotionStage();
      const spd = Math.sqrt(this.speed);
      const hasCard = !!title;
      const inDur = (hasCard ? 560 : 380) / spd;
      const outDur = (hasCard ? 640 : 440) / spd;

      const fxHost = document.createElement("div");
      fxHost.className = "swarm-mx-layer";
      stage.appendChild(fxHost);
      const fx = this.buildMotionFx(type, fxHost, inDur, outDur);

      this.sound.playWhoosh(hasCard ? 1.15 : 0.85);
      this.sound.playSnap(hasCard ? 0.6 : 0.9);
      this.logTerminal(
        AGENTS[4],
        "CUT",
        `timeline.transition("${type}")${hasCard ? ` + titleCard("${String(title.title).slice(0, 28)}")` : ""}`
      );

      if (!(await this.mxWait(fx.cover()))) return;
      stage.querySelectorAll(".swarm-mx-veil").forEach((v) => v.remove());
      if (onCovered) onCovered();

      if (hasCard) {
        if (!(await this.playTitleCard(stage, title))) return;
      } else if (shotLabel) {
        const tag = document.createElement("div");
        tag.className = "swarm-mx-shot-tag";
        tag.textContent = shotLabel;
        stage.appendChild(tag);
        this.mxAnim(
          tag,
          [
            { opacity: 0, transform: "translate(-50%, -50%) scale(0.85)" },
            { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
          ],
          180 / spd,
          { easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
        await this.sleep(320);
        await this.mxWait(this.mxAnim(tag, [{ opacity: 1 }, { opacity: 0 }], 140 / spd, { easing: "linear" }));
        tag.remove();
      } else {
        await this.sleep(70);
      }

      // Let the page re-layout at its new framing before revealing it
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (!this.running || this.aborted) return;
      if (!(await this.mxWait(fx.reveal()))) return;
      fxHost.remove();
    }

    async playTitleCard(stage, t) {
      const esc = (s) =>
        String(s == null ? "" : s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
      const wordsArr = String(t.title || "").split(/\s+/).filter(Boolean);
      const card = document.createElement("div");
      card.className = "swarm-mx-card";
      card.innerHTML = `
        <div class="swarm-mx-card-grid"></div>
        <div class="swarm-mx-corner" style="left:9vw">${esc(t.corner || location.hostname || "Rebuildr")}</div>
        <div class="swarm-mx-corner" style="right:9vw">${esc(t.counter || "")}</div>
        <div class="swarm-mx-num">${esc(t.num)}</div>
        <div class="swarm-mx-kicker">${esc(t.kicker || "")}</div>
        <div class="swarm-mx-title">${wordsArr.map((w) => `<span class="w"><span>${esc(w)}</span></span>`).join("")}</div>
        <div class="swarm-mx-rule"></div>
        <div class="swarm-mx-sub">${esc(t.sub || "")}</div>
      `;
      stage.appendChild(card);

      const spd = Math.sqrt(this.speed);
      const D = (ms) => ms / spd;
      const OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
      this.mxAnim(card, [{ opacity: 0 }, { opacity: 1 }], D(200), { easing: "linear" });
      this.mxAnim(
        card.querySelector(".swarm-mx-num"),
        [
          { opacity: 0, transform: "translateY(42px) scale(0.94)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        D(640),
        { easing: OUT }
      );
      this.mxAnim(
        card.querySelector(".swarm-mx-kicker"),
        [
          { opacity: 0, transform: "translateX(-18px)", letterSpacing: "0.6em" },
          { opacity: 1, transform: "translateX(0)", letterSpacing: "0.32em" },
        ],
        D(560),
        { easing: OUT, delay: D(120) }
      );
      card.querySelectorAll(".swarm-mx-title .w > span").forEach((sp, i) => {
        this.mxAnim(sp, [{ transform: "translateY(110%)" }, { transform: "translateY(0%)" }], D(580), {
          easing: OUT,
          delay: D(180 + i * 60),
        });
      });
      this.mxAnim(card.querySelector(".swarm-mx-rule"), [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], D(720), {
        easing: OUT,
        delay: D(320),
      });
      this.mxAnim(
        card.querySelector(".swarm-mx-sub"),
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        D(420),
        { easing: OUT, delay: D(480) }
      );
      this.sound.playSceneChime();

      await this.sleep(1250 + Math.min(10, wordsArr.length) * 45);
      if (!this.running || this.aborted) return false;
      await this.mxWait(
        this.mxAnim(
          card,
          [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-18px)" },
          ],
          D(320),
          { easing: "cubic-bezier(0.55, 0, 1, 0.45)" }
        )
      );
      card.remove();
      return this.running && !this.aborted;
    }

    async motionCut(targetTop, opts = {}) {
      if (!this.running || this.aborted) return;
      const scroller = this.getScroller();
      if (!scroller) return;
      const isWin = scroller === document.body || scroller === document.documentElement;
      const curTop = isWin ? window.scrollY : scroller.scrollTop;
      const maxScroll = Math.max(
        0,
        (isWin ? document.documentElement.scrollHeight : scroller.scrollHeight) - window.innerHeight
      );
      const clamped = Math.max(0, Math.min(maxScroll, targetTop));

      const title = opts.title || this.motionPendingTitle || null;
      const shotLabel = opts.shotLabel || this.motionNextShotLabel || null;
      const type = opts.transition || this.motionNextTransition || (title ? "wipe" : "push");
      this.motionPendingTitle = null;
      this.motionNextTransition = null;
      this.motionNextShotLabel = null;
      if (!opts.force && !title && Math.abs(clamped - curTop) < 8) return;

      this.motionShotCounter++;
      await this.playMotionTransition(type, {
        title,
        shotLabel,
        onCovered: () => this.jumpScrollTo(clamped),
      });
    }

    // Summarise what a shot contains so the transition can match the content
    profileMotionElements(els) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const p = { mediaCount: 0, mediaRatio: 0, containerCount: 0, unitCount: 0, hasForm: false, isHero: false, isFooter: false };
      let mediaArea = 0;
      for (const el of (els || []).filter((e) => e && e.nodeType === 1)) {
        const medias = el.matches("img, video, canvas, picture")
          ? [el]
          : Array.from(el.querySelectorAll("img, video, canvas, picture"));
        for (const m of medias) {
          const r = m.getBoundingClientRect();
          if (r.width < 44 || r.height < 36) continue;
          p.mediaCount++;
          mediaArea += Math.min(r.width * r.height, vw * vh);
        }
        p.containerCount += Array.from(
          el.querySelectorAll("article, [class*='card'], [class*='tile'], [class*='feature'], .timeline-node, .social-pill")
        ).filter((c) => c.getBoundingClientRect().width >= 90).length;
        p.unitCount += el.querySelectorAll("h1, h2, h3, h4, p, li, blockquote").length;
        if (!p.hasForm) p.hasForm = !!(el.closest("form") || el.querySelector("form, input:not([type='hidden']), textarea, select"));
        if (!p.isHero) p.isHero = el.matches("h1") || !!el.querySelector("h1");
        if (!p.isFooter) p.isFooter = !!el.closest("footer, [role='contentinfo']");
      }
      p.mediaRatio = mediaArea / Math.max(1, vw * vh);
      return p;
    }

    // Content-aware transition picker: hero → zoom, media → iris, card grids → blinds,
    // forms/inputs → glitch, text-heavy → wipe, follow-up shots → push. Never repeats twice in a row.
    pickMotionTransition(p = {}) {
      let t;
      if (p.isContinuation || p.isDescending) {
        t = "slide-down";
      } else if (p.isIntro || (p.isHero && !p.isFooter)) {
        t = "zoom";
      } else if (p.isFooter) {
        t = "iris";
      } else if (p.hasForm) {
        t = "glitch";
      } else if (p.mediaRatio >= 0.3 || p.mediaCount >= 3) {
        t = "iris";
      } else if (p.containerCount >= 3) {
        t = "blinds";
      } else if (p.unitCount >= 6) {
        t = "wipe";
      } else {
        t = "push";
      }
      if (t === this.lastMotionTransition) {
        const alt = {
          zoom: "wipe",
          iris: "zoom",
          blinds: "push",
          glitch: "blinds",
          wipe: "push",
          push: "wipe",
          "slide-down": "wipe",
        };
        t = alt[t] || "wipe";
      }
      this.lastMotionTransition = t;
      return t;
    }

    getSceneMotionTitle(sceneEl, idx, total) {
      const meta = SCENE_META[sceneEl.id] || { title: sceneEl.id, navLabel: sceneEl.id };
      const pad = (n) => String(n).padStart(2, "0");
      return {
        num: pad(idx + 1),
        kicker: meta.navLabel,
        title: String(meta.title).replace(/^Bab\s*\d+\s*\u00b7\s*/i, ""),
        sub: `${location.hostname || "Rebuildr"} \u00b7 Swarm Rebuild`,
        counter: `Scene ${pad(idx + 1)} / ${pad(total)}`,
      };
    }

    // Split the page into its real sections (header / section / main > * / footer…)
    detectMotionSections(scrollY0) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scroller = this.getScroller();
      const isWin = !scroller || scroller === document.body || scroller === document.documentElement;
      const docH = Math.max(vh, isWin ? document.documentElement.scrollHeight : scroller.scrollHeight);
      const SEL =
        "header, nav, main > *, section, article, footer, aside, [role='banner'], [role='main'] > *, [role='region'], [role='contentinfo'], [class*='section'], [class*='hero'], [id*='section']";

      const pool = [];
      for (const el of document.body.querySelectorAll(SEL)) {
        if (this.isIgnoredSubtree(el)) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
        const r = el.getBoundingClientRect();
        if (r.height >= 120 && r.width >= vw * 0.5 && r.height < docH * 0.92) {
          pool.push({ el, top: Math.max(0, r.top + scrollY0), bottom: r.bottom + scrollY0, h: r.height });
        }
      }
      // An element wrapping ≥2 big candidate blocks is a page wrapper → use its children instead
      const bigH = Math.max(200, vh * 0.4);
      const kept = pool.filter(
        (a) => pool.filter((b) => b !== a && b.h >= bigH && a.el.contains(b.el)).length < 2
      );
      let list = kept
        .filter((a) => !kept.some((b) => b !== a && b.el.contains(a.el)))
        .sort((a, b) => a.top - b.top);

      const merged = [];
      for (const s of list) {
        const prev = merged[merged.length - 1];
        if (prev && s.top - prev.top < 60) continue;
        merged.push(s);
      }
      list = merged;

      if (list.length < 2) {
        list = [];
        const step = Math.max(320, Math.round(vh * 0.9));
        for (let y = 0; y < docH - 40; y += step) list.push({ el: null, top: y, bottom: y + step });
      }
      if (list.length === 0) list.push({ el: null, top: 0, bottom: docH });
      list[0].top = 0;

      const kickerMap = { header: "Header", nav: "Navigation", footer: "Footer", aside: "Sidebar", article: "Article" };
      const rawSections = list.map((s, i) => {
        const el = s.el;
        const tag = el ? el.tagName.toLowerCase() : "";
        let title = "";
        if (el) {
          const h = el.querySelector("h1, h2, h3, [role='heading']");
          title = ((h && h.textContent) || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
          if (!title) {
            const raw = el.id || (typeof el.className === "string" ? el.className.trim().split(/\s+/)[0] : "");
            title = (raw || "")
              .replace(/[-_]+/g, " ")
              .replace(/\b\w/g, (ch) => ch.toUpperCase())
              .trim();
          }
        }
        const isFooter =
          !!el && (tag === "footer" || el.getAttribute("role") === "contentinfo" || (i === list.length - 1 && !!el.querySelector("footer")));
        const isHero = i === 0 || (!!el && !!el.querySelector("h1"));
        const hasForm = !!el && !!el.querySelector("form, input:not([type='hidden']), textarea, select");
        if (!title) title = kickerMap[tag] || `Bagian ${i + 1}`;
        if (title.length > 60) title = `${title.slice(0, 57).trim()}…`;
        return {
          ...s,
          title,
          kicker: kickerMap[tag] || (i === 0 ? "Hero" : "Section"),
          isFooter,
          isHero,
          hasForm,
          shots: new Map(),
        };
      });

      // SMART SECTION CLUSTERING:
      // Merge consecutive short blocks (e.g. Navbar + Category Strip + Info Bar)
      // so that each scene is rich, filled with content, and avoids isolated 150px strips
      // that leave 70% empty space below (Images 1 & 2)!
      const clustered = [];
      for (const s of rawSections) {
        const last = clustered[clustered.length - 1];
        if (!last) {
          clustered.push({
            el: s.el,
            elements: [s.el].filter(Boolean),
            top: s.top,
            bottom: s.bottom,
            h: s.bottom - s.top,
            title: s.title,
            kicker: s.kicker,
            isHero: s.isHero,
            isFooter: s.isFooter,
            hasForm: s.hasForm,
            shots: new Map(),
          });
          continue;
        }

        const combinedH = s.bottom - last.top;
        const isLastShort = last.h < vh * 0.58;
        const fitsInView = combinedH <= vh * 0.90;
        const notFooter = !s.isFooter && !last.isFooter;

        if (isLastShort && fitsInView && notFooter) {
          last.bottom = Math.max(last.bottom, s.bottom);
          last.h = last.bottom - last.top;
          if (s.el) last.elements.push(s.el);
          if (!last.title || last.title === "Header" || last.title === "Navigation") {
            if (s.title && s.title !== "Header" && s.title !== "Navigation") {
              last.title = s.title;
              last.kicker = s.kicker || last.kicker;
            }
          }
          last.isHero = last.isHero || s.isHero;
          last.hasForm = last.hasForm || s.hasForm;
        } else {
          clustered.push({
            el: s.el,
            elements: [s.el].filter(Boolean),
            top: s.top,
            bottom: s.bottom,
            h: s.bottom - s.top,
            title: s.title,
            kicker: s.kicker,
            isHero: s.isHero,
            isFooter: s.isFooter,
            hasForm: s.hasForm,
            shots: new Map(),
          });
        }
      }
      clustered[0].top = 0;
      return clustered;
    }

    async runMotionWebsiteFlow() {
      const scroller = this.getScroller();
      const isWin = !scroller || scroller === document.body || scroller === document.documentElement;
      const getScrollY = () => (isWin ? window.scrollY : scroller.scrollTop);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const host =
        location.hostname ||
        (document.title || "Rebuildr Studio").split(/[—|·-]/)[0].trim() ||
        "Rebuildr Studio";
      const pad = (n) => String(n).padStart(2, "0");

      // Cover the page instantly so the viewer never sees it being deconstructed
      this.showMotionVeil();
      this.jumpScrollTo(0);
      await this.sleep(80);
      if (!this.running || this.aborted) return;
      const scrollY0 = getScrollY();

      // 1. Detect real sections & capture EVERY element's natural (pre-deconstruction) coordinates
      //    BEFORE emptying text, so section assignment & multi-shot height splitting match final heights!
      const sections = this.detectMotionSections(scrollY0);
      const naturalRects = new WeakMap();
      for (const el of document.body.querySelectorAll("*")) {
        if (this.isIgnoredSubtree(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width > 0 || r.height > 0) {
          naturalRects.set(el, { top: r.top + scrollY0, width: r.width, height: r.height });
        }
      }
      const getNat = (el) => {
        const saved = naturalRects.get(el);
        if (saved) return saved;
        const r = el.getBoundingClientRect();
        return { top: r.top + getScrollY(), width: r.width, height: r.height };
      };

      // 2. Discover visible media & containers using natural sizes, then empty text & hide upfront
      const mediaCandidates = Array.from(
        document.body.querySelectorAll("img, video, canvas, picture, figure svg")
      ).filter((el) => {
        if (this.isIgnoredSubtree(el)) return false;
        const r = getNat(el);
        return r.width >= 44 && r.height >= 36 && r.width <= vw * 1.05;
      });
      const containerCandidates = Array.from(
        document.body.querySelectorAll(
          "header, nav, article, form, blockquote, .card, [class*='card'], [class*='box'], [class*='panel'], [class*='feature'], [class*='item'], [class*='bento'], section > div > div"
        )
      ).filter((el) => {
        if (this.isIgnoredSubtree(el)) return false;
        const r = getNat(el);
        return r.width >= 90 && r.height >= 42 && r.height <= vh * 0.92;
      });
      const leafContainers = containerCandidates.filter(
        (c) => !containerCandidates.some((other) => other !== c && c.contains(other))
      );

      const allUnits = this.prepareScopeForScratchBuild(document.body);
      mediaCandidates.forEach((m) => this.hideElementForBuild(m));
      leafContainers.forEach((c) => this.hideElementForBuild(c));

      // 3. Assign everything to its section & split tall sections into viewport-sized shots using natural tops
      const TOP_SAFE = 72;
      const BOTTOM_SAFE = 120;
      const shotH = Math.max(240, vh - TOP_SAFE - BOTTOM_SAFE);
      const findSection = (y) => {
        let found = sections[0];
        for (const s of sections) {
          if (s.top <= y + 2) found = s;
          else break;
        }
        return found;
      };
      const addTo = (el, kind) => {
        const r = getNat(el);
        if (kind === "u" && r.width === 0 && r.height === 0) return;
        const y = r.top;
        const s = findSection(y);
        const secH = Math.max(1, s.bottom - s.top);
        let k = 0;
        if (secH > vh * 0.92) {
          // Balanced split for tall sections so no shot gets an awkward leftover tail!
          const numShots = Math.max(2, Math.ceil(secH / (vh * 0.76)));
          const balancedH = secH / numShots;
          k = Math.max(0, Math.min(numShots - 1, Math.floor((y - s.top) / balancedH)));
        }
        if (!s.shots.has(k)) {
          s.shots.set(k, { k, containers: [], mediaEls: [], scopes: [], anchors: [], minY: Infinity, maxY: -Infinity });
        }
        const shot = s.shots.get(k);
        shot.minY = Math.min(shot.minY, y);
        shot.maxY = Math.max(shot.maxY, y + r.height);
        shot.anchors.push(el);
        if (kind === "c") {
          shot.containers.push(el);
          shot.scopes.push(el);
        } else if (kind === "m") {
          shot.mediaEls.push(el);
        } else {
          shot.scopes.push(el);
        }
      };
      leafContainers.forEach((c) => addTo(c, "c"));
      mediaCandidates.forEach((m) => addTo(m, "m"));
      allUnits.forEach((u) => addTo(u.el, "u"));

      let plan = sections
        .map((s) => ({ ...s, shotList: Array.from(s.shots.values()).sort((a, b) => a.k - b.k) }))
        .filter((s) => s.shotList.length > 0);

      let maxScenes = 3;
      if (this.targetDuration === "15s") {
        maxScenes = 2;
        this.speed = Math.max(this.speed, 2.0);
      } else if (this.targetDuration === "60s") {
        maxScenes = 5;
      }

      if (this.launchScope === "curated" && plan.length > maxScenes) {
        this.logTerminal(AGENTS[4], "CURATE", `ai director: curated ${plan.length} -> ${maxScenes} key story scenes (${this.targetDuration || "default"})`);
        plan = plan.slice(0, maxScenes);
      }
      const totalShots = plan.reduce((n, s) => n + s.shotList.length, 0) || 1;
      this.logTerminal(AGENTS[4], "PLAN", `storyboard: ${plan.length} scenes -> ${totalShots} shots`);

      let shotNo = 0;
      for (let si = 0; si < plan.length; si++) {
        const s = plan[si];
        for (let k = 0; k < s.shotList.length; k++) {
          if (!this.running || this.aborted) return;
          const shot = s.shotList[k];
          const isFirstShot = k === 0;
          shotNo++;

          // Profile this shot's content → pick a matching transition
          let mediaArea = 0;
          shot.mediaEls.forEach((m) => {
            const r = getNat(m);
            mediaArea += Math.min(r.width * r.height, vw * vh);
          });
          const transition = !isFirstShot
            ? "slide-down"
            : this.pickMotionTransition({
                mediaCount: shot.mediaEls.length,
                mediaRatio: mediaArea / Math.max(1, vw * vh),
                containerCount: shot.containers.length,
                unitCount: Math.max(0, shot.scopes.length - shot.containers.length),
                hasForm:
                  (isFirstShot && s.hasForm) ||
                  shot.scopes.some((el) => el.matches("input, textarea, select, form") || !!el.closest("form")),
                isHero: s.isHero,
                isFooter: s.isFooter,
                isIntro: si === 0 && isFirstShot,
                isContinuation: !isFirstShot,
              });

          // Measure the framing live: text typed in earlier shots has pushed the layout down since planning
          const yLive = getScrollY();
          const liveTop = (el) => {
            const r = el.getBoundingClientRect();
            return r.width === 0 && r.height === 0 ? Infinity : r.top + yLive;
          };
          const liveBottom = (el) => {
            const r = el.getBoundingClientRect();
            return r.width === 0 && r.height === 0 ? -Infinity : r.bottom + yLive;
          };

          const isLastShotOfSection = k === s.shotList.length - 1;
          const usableH = vh - TOP_SAFE - BOTTOM_SAFE;
          let target;

          if (isFirstShot) {
            if (si === 0) {
              target = 0;
            } else {
              const liveAnchorTops = shot.anchors.map(liveTop).filter(isFinite);
              const liveAnchorBottoms = shot.anchors.map(liveBottom).filter(isFinite);
              const minLive = liveAnchorTops.length > 0 ? Math.min(...liveAnchorTops) : s.top;
              const maxLive = liveAnchorBottoms.length > 0 ? Math.max(...liveAnchorBottoms) : s.bottom;
              const clusterLiveH = maxLive - minLive;

              if (clusterLiveH < usableH * 0.72) {
                // OPTICAL VERTICAL CENTERING:
                // Section is short (e.g. footer or isolated contact form) -> center vertically in viewport!
                // Never stick to the ceiling with 70% empty white space below!
                const freeSpace = usableH - clusterLiveH;
                target = Math.max(0, minLive - TOP_SAFE - freeSpace / 2);
              } else {
                target = Math.max(0, minLive - TOP_SAFE);
              }
            }
          } else {
            // Continuation shot (descending down to the lower tier of cards/content):
            const liveAnchorTops = shot.anchors.map(liveTop).filter(isFinite);
            const liveAnchorBottoms = shot.anchors.map(liveBottom).filter(isFinite);
            const minLive = liveAnchorTops.length > 0 ? Math.min(...liveAnchorTops) : shot.minY;
            const maxLive = liveAnchorBottoms.length > 0 ? Math.max(...liveAnchorBottoms) : shot.maxY;
            const shotLiveH = maxLive - minLive;

            const sBottomLive = s.el ? liveBottom(s.el) : s.bottom;
            const maxSecScroll = Math.max(s.top, sBottomLive - vh + BOTTOM_SAFE + 18);

            if (isLastShotOfSection) {
              // LAST SHOT OF TALL SECTION:
              // Stop exactly at the bottom of the section so cards sit nicely above HUD!
              // NEVER overscroll into empty space below the section!
              target = maxSecScroll;
            } else if (shotLiveH < usableH) {
              const freeSpace = usableH - shotLiveH;
              target = Math.max(s.top, minLive - TOP_SAFE - freeSpace / 2);
            } else {
              target = Math.max(s.top, minLive - TOP_SAFE);
            }
            target = Math.max(0, Math.min(maxSecScroll, Math.round(target)));
          }

          const title = isFirstShot
            ? {
                num: pad(si + 1),
                kicker: s.kicker,
                title: s.title,
                sub: `${s.shotList.length} shot \u00b7 ${host}`,
                counter: `Scene ${pad(si + 1)} / ${pad(plan.length)}`,
                corner: host,
              }
            : null;

          if (isFirstShot) {
            this.updateHudStatus(
              `<strong>🎬 Scene ${si + 1}/${plan.length} · ${s.kicker}</strong> · Motion Design`,
              ((shotNo - 0.5) / totalShots) * 100
            );
            await this.motionCut(target, {
              force: true,
              title,
              transition,
            });
          } else {
            // Inside the same section moving down: automatically smooth-scroll down naturally!
            this.updateHudStatus(
              `<strong>🎬 Scene ${si + 1}/${plan.length} · Lanjutan Konten</strong> · Kamera Otomatis Bergulir...`,
              ((shotNo - 0.5) / totalShots) * 100
            );
            await this.smoothScrollTo(target, 540);
          }
          if (!this.running || this.aborted) return;

          // Build this shot in waves (max 6 containers / 4 media) — the camera stays locked mid-shot
          const conts = shot.containers;
          const meds = shot.mediaEls;
          const waves = Math.max(1, Math.ceil(conts.length / 6), Math.ceil(meds.length / 4));
          for (let w = 0; w < waves; w++) {
            if (!this.running || this.aborted) return;
            const wc = conts.slice(w * 6, w * 6 + 6);
            const wm = meds.slice(w * 4, w * 4 + 4);
            await this.buildWaveWithAllCursors({
              sceneEl: document.body,
              containers: wc,
              mediaEls: wm,
              scopes: w === waves - 1 ? shot.scopes : wc,
              label: `Scene ${si + 1}.${k + 1}`,
            });
          }

          // Hold the finished frame briefly so every shot "lands" in the video
          this.overlay.classList.remove("is-building");
          await this.sleep(560);
          this.overlay.classList.add("is-building");
        }
      }

      this.releaseSceneElements(document.body);
      if (this.running && !this.aborted) {
        await this.sleep(400);
        // Outro: end card, then reveal the fully rebuilt page from the top
        await this.motionCut(0, {
          force: true,
          transition: "zoom",
          title: {
            num: "\u2713",
            kicker: "Rebuilt from scratch",
            title: document.title || host,
            sub: `${plan.length} scenes \u00b7 ${totalShots} shots \u00b7 Rebuildr`,
            counter: "Final",
            corner: host,
          },
        });
        await this.sleep(1200);
      }
      if (this.running && !this.aborted) {
        this.sound.playSceneChime();
        this.overlay.classList.remove("is-building");
        this.updateHudStatus(`<strong>✓ Selesai</strong> · Video Motion Design Selesai`, 100);
        this.logTerminal(AGENTS[0], "DONE", `Motion cut complete: ${totalShots} shots rendered`);
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
          this.stopVideoRecordingAndSave();
        } else {
          this.notifyReconstructionComplete();
        }
      }
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
      if (this.motionMode) {
        this.motionSceneShotIdx = 1;
        this.motionPendingTitle = this.getSceneMotionTitle(sceneEl, sceneIdx, totalScenes);
        this.motionNextTransition = this.pickMotionTransition({
          ...this.profileMotionElements([sceneEl]),
          isFooter: sceneIdx === totalScenes - 1,
        });
      }
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

        if (dock) {
          dock.classList.add("is-building-dock");
          this.updateTerminalPlacement([dock]);
        }

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
        if (dock) {
          dock.classList.remove("is-building-dock");
          this.releaseElementToNative(dock);
          this.updateTerminalPlacement([]);
        }
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
        const skillCards = Array.from(sceneEl.querySelectorAll(".skill-card:not(.swarm-curated-omit)"));
        const heads = Array.from(sceneEl.querySelectorAll(".skill-group-head:not(.swarm-curated-omit)"));

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
        const skillCardsToBuild = this.launchScope === "curated" ? skillCards.slice(0, 4) : skillCards;
        for (let i = 0; i < skillCardsToBuild.length; i += 2) {
          if (!this.running || this.aborted) break;
          const pct = basePct + stepPct * (0.28 + 0.68 * (i / Math.max(1, skillCardsToBuild.length)));
          this.updateHudStatus(
            `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Kartu Keahlian (${Math.min(skillCardsToBuild.length, i + 2)}/${skillCardsToBuild.length})...`,
            pct
          );
          const batch = skillCardsToBuild.slice(i, i + 2);
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
        const cards = Array.from(sceneEl.querySelectorAll(".mission-card-3d:not(.swarm-curated-omit)"));

        // Wave 1: Header + Persona Switcher + Filter Pills + Hyouka Spectator Bubble (All 8 Cursors Working Together!)
        this.updateHudStatus(
          `<strong>${meta.navLabel}</strong> · 8 Kursor Mengetik Header, Filter & Panduan Misi...`,
          basePct + stepPct * 0.22
        );
        await this.ensureElementsInView([headerWrap, spectator], 96, 0.16);
        await this.buildWaveWithAllCursors({
          sceneEl,
          containers: [badge, persona, filter, spectator],
          mediaEls: [spectatorAvatar],
          scopes: [watermark, headerWrap, filter, spectator],
          label: "Projects Header",
        });

        // Waves 2..4: Build ALL 8 Project Cards Row-by-Row (3 per row), Auto-Scrolling Camera & Using All 8 Cursors!
        // CRITICAL: Unstick companion spectator bubble so cards sit cleanly flush to top (right below top-nav),
        // giving the 420px 3D cards 100% full visibility for thumbnails, titles, and tags without any top blockage!
        if (spectator) {
          spectator.classList.add("is-unstick-for-build");
        }

        // Dynamically group cards into visual rows based on responsive layout (2 cols on 1024px laptop, 3 cols on 1440px desktop)
        const rows = [];
        let currentRow = [];
        let currentRowTop = -1;
        for (const card of cards) {
          const cTop = card.offsetTop;
          if (currentRowTop < 0 || Math.abs(cTop - currentRowTop) < 30) {
            currentRow.push(card);
            currentRowTop = cTop;
          } else {
            rows.push(currentRow);
            currentRow = [card];
            currentRowTop = cTop;
          }
        }
        if (currentRow.length > 0) rows.push(currentRow);

        const rowsToBuild = this.launchScope === "curated" ? rows.slice(0, 1) : rows;

        for (let rIdx = 0; rIdx < rowsToBuild.length; rIdx++) {
          if (!this.running || this.aborted) break;
          const row = rowsToBuild[rIdx];
          const pct = basePct + stepPct * (0.35 + 0.6 * (rIdx / Math.max(1, rowsToBuild.length)));
          this.updateHudStatus(
            `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Poligon & Teks Proyek (Baris ${rIdx + 1}/${rowsToBuild.length})...`,
            pct
          );
          const batchFronts = row.map((card) => card.querySelector(".card-front") || card);
          const batchThumbs = row
            .map((card) => card.querySelector(".mission-thumb-wrap, .creative-thumb-wrap"))
            .filter(Boolean);

          // Smoothly scroll down so this visual row of 3D cards sits cleanly flush at topSafe beneath top-nav!
          await this.ensureElementsInView(row, 96, 0.18);
          await this.buildWaveWithAllCursors({
            sceneEl,
            containers: row,
            mediaEls: batchThumbs,
            scopes: batchFronts,
            label: "3D Project Card",
          });
          await this.sleep(240);
        }

        if (spectator) {
          spectator.classList.remove("is-unstick-for-build");
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
        const secondNodes = this.launchScope === "curated" ? [] : nodes.slice(2);
        if (secondNodes.length > 0 || (thought && this.launchScope !== "curated")) {
          this.updateHudStatus(
            `<strong>${meta.navLabel}</strong> · 8 Kursor Merakit Stasiun 03–04 & Kesimpulan...`,
            basePct + stepPct * 0.78
          );
          await this.ensureElementsInView([...secondNodes, thought].filter(Boolean), 112, 0.22);
          await this.buildWaveWithAllCursors({
            sceneEl,
            containers: [...secondNodes, thought].filter(Boolean),
            scopes: [...secondNodes, thought].filter(Boolean),
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
      this.clearMotionStage();
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

      if (this.lockedMinHeights) {
        for (const [el, rec] of this.lockedMinHeights.entries()) {
          if (rec.prevMinH) el.style.minHeight = rec.prevMinH;
          else el.style.removeProperty("min-height");
        }
        this.lockedMinHeights.clear();
      }

      this.clearFocusAndDof();
      this.restoreCuratedLayout();
      document.querySelectorAll(".swarm-counter-rolling").forEach((el) => el.classList.remove("swarm-counter-rolling"));
      document.querySelectorAll(".swarm-focus-target, .swarm-dof-soften").forEach((el) =>
        el.classList.remove("swarm-focus-target", "swarm-dof-soften")
      );
      document.querySelectorAll(".is-unstick-for-build").forEach((el) => el.classList.remove("is-unstick-for-build"));
      document.querySelectorAll(".is-building-dock").forEach((el) => el.classList.remove("is-building-dock"));
      if (this.terminalEl) this.terminalEl.classList.remove("dock-top-right");
    }

    stop() {
      this.running = false;
      this.aborted = true;
      this.disableSectionPicker();
      this.clearFocusAndDof();
      this.clearTourElementFocus();
      document.body.classList.remove("swarm-reels-stage");
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        this.stopVideoRecordingAndSave();
      }
      if (this.rafId) cancelAnimationFrame(this.rafId);
      window.removeEventListener("keydown", this.onKeyDown, true);
      window.removeEventListener("scroll", this.onScrollUpdate);

      this.clearActiveArtifacts();
      this.restoreAllModifiedElements();

      if (this.launchpadBackdrop) {
        this.launchpadBackdrop.remove();
        this.launchpadBackdrop = null;
      }
      this.launchpadOpen = false;

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

  // Listen to remote studio commands (Play, Pause, Resume) from parent workbench
  window.addEventListener("message", (e) => {
    if (!e.data || typeof e.data !== "object") return;
    if (e.data.type === "REBUILDR_TOGGLE_PAUSE") {
      if (!studio.running) studio.launchRebuild();
      else studio.togglePause();
    } else if (e.data.type === "REBUILDR_PAUSE") {
      if (studio.running && !studio.paused) studio.togglePause();
    } else if (e.data.type === "REBUILDR_RESUME" || e.data.type === "REBUILDR_START") {
      if (!studio.running) studio.launchRebuild();
      else if (studio.paused) studio.togglePause();
    } else if (e.data.type === "REBUILDR_RESTART") {
      studio.launchRebuild();
    }
  });

  const bootStudio = () => {
    if (document.body) {
      studio.start();
    } else {
      document.addEventListener("DOMContentLoaded", () => studio.start());
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootStudio);
  } else {
    bootStudio();
  }
})();
