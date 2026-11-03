// Rebuildr Studio — Interactive Cinema Lab Controller (Linear & Screen Studio Aesthetic)
document.addEventListener("DOMContentLoaded", () => {
  // 1. Omnibar Quick Launch Form
  const omnibarInput = document.getElementById("landing-url-input");
  const omnibarBtn = document.getElementById("btn-landing-launch");
  const omnibarForm = document.getElementById("landing-omnibar-form");
  const heroChips = document.querySelectorAll(".preset-chip-btn");

  function launchStudioWithUrl(rawUrl) {
    let target = (rawUrl || "").trim();
    if (!target) {
      target = "/showcase-saas.html";
    }
    if (!target.startsWith("/") && !/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }
    window.location.href = `/studio?url=${encodeURIComponent(target)}`;
  }

  omnibarForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    launchStudioWithUrl(omnibarInput?.value);
  });

  omnibarBtn?.addEventListener("click", () => {
    launchStudioWithUrl(omnibarInput?.value);
  });

  heroChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const url = chip.dataset.url;
      if (omnibarInput) omnibarInput.value = url;
      launchStudioWithUrl(url);
    });
  });

  // 2. Interactive Aspect Ratio Switcher (MacBook 16:9, iPhone 9:16, Square 1:1)
  const ratioBtns = document.querySelectorAll(".ratio-deck-btn");
  const frameMacbook = document.getElementById("frame-macbook");
  const frameIphone = document.getElementById("frame-iphone");
  const frameSquare = document.getElementById("frame-square");

  const video169 = document.getElementById("hero-video-16-9");
  const video916 = document.getElementById("hero-video-9-16");
  const video11 = document.getElementById("hero-video-1-1");

  let activeVideo = video169;

  function activateFormat(fmt) {
    ratioBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.format === fmt);
    });

    if (fmt === "9:16") {
      if (frameMacbook) frameMacbook.style.display = "none";
      if (frameSquare) frameSquare.style.display = "none";
      if (frameIphone) {
        frameIphone.style.display = "block";
        frameIphone.style.opacity = "0";
        setTimeout(() => { frameIphone.style.opacity = "1"; }, 20);
      }
      activeVideo = video916;
      try {
        video169?.pause();
        video11?.pause();
        if (video916) {
          video916.currentTime = 0;
          video916.play().catch(() => {});
        }
      } catch (_) {}
    } else if (fmt === "1:1") {
      if (frameMacbook) frameMacbook.style.display = "none";
      if (frameIphone) frameIphone.style.display = "none";
      if (frameSquare) {
        frameSquare.style.display = "block";
        frameSquare.style.opacity = "0";
        setTimeout(() => { frameSquare.style.opacity = "1"; }, 20);
      }
      activeVideo = video11;
      try {
        video169?.pause();
        video916?.pause();
        if (video11) {
          video11.currentTime = 0;
          video11.play().catch(() => {});
        }
      } catch (_) {}
    } else {
      // 16:9 MacBook
      if (frameIphone) frameIphone.style.display = "none";
      if (frameSquare) frameSquare.style.display = "none";
      if (frameMacbook) {
        frameMacbook.style.display = "block";
        frameMacbook.style.opacity = "0";
        setTimeout(() => { frameMacbook.style.opacity = "1"; }, 20);
      }
      activeVideo = video169;
      try {
        video916?.pause();
        video11?.pause();
        if (video169) {
          video169.currentTime = 0;
          video169.play().catch(() => {});
        }
      } catch (_) {}
    }
  }

  ratioBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activateFormat(btn.dataset.format);
    });
  });

  // 3. Stage Video Scrubber & Play/Pause
  const btnHeroPlay = document.getElementById("btn-hero-play-pause");
  const scrubTrack = document.getElementById("hero-scrub-track");
  const scrubFill = document.getElementById("hero-scrub-fill");
  const stageTimecode = document.getElementById("stage-timecode");
  const durationMeta = document.getElementById("hero-duration-meta");

  let isHeroPaused = false;

  btnHeroPlay?.addEventListener("click", () => {
    if (!activeVideo) return;
    isHeroPaused = !isHeroPaused;
    if (isHeroPaused) {
      activeVideo.pause();
      btnHeroPlay.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    } else {
      activeVideo.play().catch(() => {});
      btnHeroPlay.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
    }
  });

  // Sync Video timeupdate
  [video169, video916, video11].forEach((vid) => {
    vid?.addEventListener("timeupdate", () => {
      if (vid !== activeVideo) return;
      const cur = vid.currentTime || 0;
      const dur = vid.duration || 26;
      const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
      if (scrubFill) scrubFill.style.width = `${pct}%`;

      const m = Math.floor(cur / 60);
      const s = Math.floor(cur % 60);
      const f = Math.floor((cur % 1) * 30);
      if (stageTimecode) {
        stageTimecode.textContent = `TC 00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
      }
      if (durationMeta) {
        const dm = Math.floor(dur / 60);
        const ds = Math.floor(dur % 60);
        durationMeta.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} / ${String(dm).padStart(2, "0")}:${String(ds).padStart(2, "0")}`;
      }
    });
  });

  // Click Scrubber
  scrubTrack?.addEventListener("click", (e) => {
    if (!activeVideo) return;
    const rect = scrubTrack.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const dur = activeVideo.duration || 26;
    activeVideo.currentTime = ratio * dur;
  });

  // 4. Procedural WebAudio Synth Lab
  let audioCtx = null;
  let activeSynthNodes = [];
  let activeSynthType = null;
  let synthTimer = null;

  function stopSynth() {
    activeSynthNodes.forEach((n) => {
      try { n.stop(); n.disconnect(); } catch (_) {}
    });
    activeSynthNodes = [];
    if (synthTimer) clearTimeout(synthTimer);
    document.querySelectorAll(".synth-mode-btn").forEach((b) => b.classList.remove("is-playing"));
    activeSynthType = null;
  }

  function playSynthTrack(type) {
    if (activeSynthType === type) {
      stopSynth();
      return;
    }
    stopSynth();

    const btn = document.getElementById(`btn-synth-${type}`);
    if (btn) btn.classList.add("is-playing");
    activeSynthType = type;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const now = audioCtx.currentTime;

      if (type === "lofi") {
        // Mellow pentatonic chord progression
        const freqs = [174.61, 220.00, 261.63, 329.63, 392.00];
        freqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const filter = audioCtx.createBiquadFilter();

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(600, now);

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.04, now + 0.3 + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now);
          osc.stop(now + 4.8);
          activeSynthNodes.push(osc);
        });
      } else if (type === "synthwave") {
        // 80s Cyber Arpeggio
        const arp = [110, 146.83, 164.81, 220, 293.66, 329.63];
        arp.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now + i * 0.22);

          gain.gain.setValueAtTime(0, now + i * 0.22);
          gain.gain.linearRampToValueAtTime(0.05, now + i * 0.22 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.22 + 0.4);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now + i * 0.22);
          osc.stop(now + i * 0.22 + 0.45);
          activeSynthNodes.push(osc);
        });
      } else {
        // Haptic SFX clicks
        for (let i = 0; i < 6; i++) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(600 + Math.random() * 400, now + i * 0.18);

          gain.gain.setValueAtTime(0, now + i * 0.18);
          gain.gain.linearRampToValueAtTime(0.08, now + i * 0.18 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.08);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now + i * 0.18);
          osc.stop(now + i * 0.18 + 0.1);
          activeSynthNodes.push(osc);
        }
      }

      synthTimer = setTimeout(() => {
        stopSynth();
      }, 5000);
    } catch (_) {}
  }

  document.getElementById("btn-synth-lofi")?.addEventListener("click", () => playSynthTrack("lofi"));
  document.getElementById("btn-synth-synthwave")?.addEventListener("click", () => playSynthTrack("synthwave"));
  document.getElementById("btn-synth-sfx")?.addEventListener("click", () => playSynthTrack("sfx"));
});
