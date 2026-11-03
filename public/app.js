// Rebuildr Web Studio — Creative Workbench Controller v3.8 PRO
(() => {
  const state = {
    url: "/showcase-saas.html",
    format: "16:9",
    duration: "30s",
    bgm: "lofi",
    mockup: "flat",
    preset: "before-after",
    scope: "curated",
    mode: "motion",
    theme: "figma",
    speed: 1.5,
    customHookText: "BEFORE: Wireframe Kuno -> AFTER: Dirakit 8 AI ⚡",
    ghost: "false",
    terminal: "false",
    watermark: "none",
    audioBalance: "balanced",
    quality: "1080p",
  };

  // Elements: Omnibar & Hook
  const inputUrl = document.getElementById("input-url");
  const btnClear = document.getElementById("btn-clear-url");
  const btnPasteUrl = document.getElementById("btn-paste-url");
  const chips = document.querySelectorAll(".preset-chips .chip");
  const inputHookText = document.getElementById("input-hook-text");
  const hookChips = document.querySelectorAll(".hook-quick-chips .hook-chip");

  // Elements: Action Buttons
  const btnLaunch = document.getElementById("btn-launch-preview");
  const btnRender = document.getElementById("btn-start-render");
  const btnTopRender = document.getElementById("btn-top-render-action");
  const renderCtaMeta = document.getElementById("render-cta-meta");

  // Elements: Device & Canvas
  const deviceWrapper = document.getElementById("device-wrapper");
  const iframe = document.getElementById("studio-iframe");
  const previewTag = document.getElementById("current-preview-tag");
  const btnToggleRatio = document.getElementById("btn-toggle-ratio");
  const btnReloadStudio = document.getElementById("btn-reload-studio");
  const btnOpenNewTab = document.getElementById("btn-open-new-tab");
  const quickRatioBtns = document.querySelectorAll(".quick-ratio-btn");
  const quickMockBtns = document.querySelectorAll(".quick-mock-btn");
  const quickZoomBtns = document.querySelectorAll(".quick-zoom-btn");

  // Elements: Live Pause System
  const btnStagePause = document.getElementById("btn-stage-pause");
  const stagePauseLabel = document.getElementById("stage-pause-label");
  const stagePauseIcon = document.getElementById("stage-pause-icon");
  const stagePauseOverlay = document.getElementById("stage-pause-overlay");
  const liveStatusDot = document.getElementById("live-status-dot");
  let isLivePaused = true;

  // Elements: Live Timeline Scrubber Bar
  const timeCurrent = document.getElementById("time-current");
  const timeTotal = document.getElementById("time-total");
  const timelineProgressFill = document.getElementById("timeline-progress-fill");
  const timelineScrubHandle = document.getElementById("timeline-scrub-handle");
  const timelineTrackWrap = document.getElementById("timeline-track-wrap");
  const btnTransportPlay = document.getElementById("btn-transport-play");
  const btnTransportReplay = document.getElementById("btn-transport-replay");
  const btnTransportSound = document.getElementById("btn-transport-sound");
  const transportPlaySvg = document.getElementById("transport-play-svg");
  const transportSoundSvg = document.getElementById("transport-sound-svg");
  const headerAudioEq = document.getElementById("header-audio-eq");
  const stagePhaseLabel = document.getElementById("stage-phase-label");

  let timelineElapsed = 0;
  let timelineTimer = null;
  let isMuted = false;

  // Elements: Tabs & Mobile Workbench
  const inspectorTabBtns = document.querySelectorAll(".inspector-tabs-nav .tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const mobTabs = document.querySelectorAll(".mob-tab");
  const workbenchInspector = document.getElementById("workbench-inspector");
  const workbenchStage = document.getElementById("workbench-stage");

  // Elements: Shortcuts Modal
  const shortcutsModal = document.getElementById("shortcuts-modal");
  const btnShortcutsTrigger = document.getElementById("btn-shortcuts-trigger");
  const btnCloseShortcuts = document.getElementById("btn-close-shortcuts");

  // Elements: Quality Selector
  const qualityBtns = document.querySelectorAll("#seg-render-quality .btn-quality");

  // Elements: Render Modal
  const modal = document.getElementById("render-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const modalHeading = document.getElementById("modal-heading");
  const progressFill = document.getElementById("job-progress-fill");
  const progressText = document.getElementById("job-status-text");
  const progressPct = document.getElementById("job-percentage");
  const jobEta = document.getElementById("job-eta");
  const terminalLogs = document.getElementById("job-terminal-logs");
  const resultVideoWrap = document.getElementById("result-video-container");
  const videoPlayer = document.getElementById("result-video-player");
  const btnDownload = document.getElementById("btn-download-video");
  const btnDownloadGif = document.getElementById("btn-download-gif");
  const btnCopyLink = document.getElementById("btn-copy-video-link");

  // Elements: Step Nodes
  const stepNodes = [
    document.getElementById("step-node-1"),
    document.getElementById("step-node-2"),
    document.getElementById("step-node-3"),
    document.getElementById("step-node-4"),
  ];

  // Elements: Gallery
  const galleryGrid = document.getElementById("gallery-cards-grid");
  const btnClearGallery = document.getElementById("btn-clear-gallery");

  let pollInterval = null;
  let etaInterval = null;
  let remainingEta = 35;
  let currentProxyUrl = "";

  // ---------------------------------------------------------------------------
  // 1. TOAST NOTIFICATION UTILITY
  // ---------------------------------------------------------------------------
  function showToast(message, icon = "⚡") {
    const stack = document.getElementById("toast-stack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = "toast-item";
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 260);
    }, 2800);
  }

  // ---------------------------------------------------------------------------
  // 2. INSPECTOR TABS & MOBILE RESPONSIVENESS
  // ---------------------------------------------------------------------------
  inspectorTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;
      inspectorTabBtns.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  mobTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      mobTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.target;
      if (target === "inspector") {
        workbenchInspector?.classList.remove("is-hidden-mobile");
        workbenchStage?.classList.add("is-hidden-mobile");
      } else {
        workbenchInspector?.classList.add("is-hidden-mobile");
        workbenchStage?.classList.remove("is-hidden-mobile");
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 3. CTA METADATA SYNCHRONIZATION
  // ---------------------------------------------------------------------------
  function updateCtaMeta() {
    if (!renderCtaMeta) return;
    const bgmNames = { lofi: "Lo-Fi", synthwave: "Synth", none: "SFX Only" };
    renderCtaMeta.textContent = `${state.format} • ${state.duration} • ${bgmNames[state.bgm] || "Audio"}`;
  }

  // ---------------------------------------------------------------------------
  // 4. CONFIGURATION EVENT LISTENERS (GENERIC SEGMENTED BINDERS)
  // ---------------------------------------------------------------------------
  function bindSegGroup(containerId, stateKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state[stateKey] = btn.dataset.val;

        // Auto-update device frame if format or mockup toggles
        if (stateKey === "format") {
          updateDeviceFrame();
          syncQuickRatioButtons();
        } else if (stateKey === "mockup") {
          updateDeviceFrame();
          syncQuickMockupButtons();
        }

        if (stateKey === "preset") {
          autoSuggestHook(state.url, state.preset);
          syncTimelineChapters();
        }

        updateCtaMeta();
        updateTimelineUi();
        launchStudioPreview(false, !isLivePaused);
      });
    });
  }

  bindSegGroup("seg-format", "format");
  bindSegGroup("seg-duration", "duration");
  bindSegGroup("seg-bgm", "bgm");
  bindSegGroup("seg-mockup", "mockup");
  bindSegGroup("seg-preset", "preset");
  bindSegGroup("seg-scope", "scope");
  bindSegGroup("seg-mode", "mode");
  bindSegGroup("seg-theme", "theme");
  bindSegGroup("seg-speed", "speed");
  bindSegGroup("seg-ghost", "ghost");
  bindSegGroup("seg-terminal", "terminal");
  bindSegGroup("seg-watermark", "watermark");
  bindSegGroup("seg-audio-balance", "audioBalance");

  // Sync Tour Settings Visibility
  function syncTourSettingsVisibility() {
    const card = document.getElementById("card-feature-tour-settings");
    if (card) {
      card.style.display = state.preset === "feature-tour" ? "flex" : "none";
    }
  }
  syncTourSettingsVisibility();

  document.querySelectorAll("#seg-preset button").forEach((b) => {
    b.addEventListener("click", () => {
      syncTourSettingsVisibility();
    });
  });

  // Tour granular select controls
  document.getElementById("tour-count-select")?.addEventListener("change", () => launchStudioPreview());
  document.getElementById("tour-niche-select")?.addEventListener("change", () => launchStudioPreview());
  document.getElementById("tour-lang-select")?.addEventListener("change", () => launchStudioPreview());
  document.getElementById("tour-overlay-select")?.addEventListener("change", () => launchStudioPreview());

  // Smart Headline Hook Suggestions based on domain and preset
  function autoSuggestHook(url, preset) {
    if (!inputHookText) return;
    const lowerUrl = (url || "").toLowerCase();
    let suggestedHook = "Eksplorasi Fitur Unggulan & Demo Interaktif ⚡";
    if (lowerUrl.includes("github")) {
      suggestedHook = "Platform Developer & Kolaborasi Kode Terbesar di Dunia 🐙⚡";
    } else if (lowerUrl.includes("linear")) {
      suggestedHook = "Manajemen Proyek Modern untuk Tim Software Berkecepatan Tinggi 🚀";
    } else if (lowerUrl.includes("vite")) {
      suggestedHook = "Frontend Tooling Generasi Baru dengan HMR Super Cepat ⚡";
    } else if (lowerUrl.includes("yusuf") || lowerUrl.includes("portfolio")) {
      suggestedHook = "Portofolio Desain & Rekayasa Frontend Kreatif ✨";
    } else if (preset === "before-after") {
      suggestedHook = "Transformasi Sebelum & Sesudah Implementasi UI Modern 🔥";
    } else if (preset === "teaser-30s") {
      suggestedHook = "Teaser Kilat 30 Detik — Solusi Cepat untuk Bisnis Anda ⚡";
    }
    inputHookText.value = suggestedHook;
    state.customHookText = suggestedHook;
  }

  // BGM 5-Second Procedural Audio Tester
  let bgmTestOscs = [];
  let bgmTestTimer = null;
  const btnBgmPreview = document.getElementById("btn-bgm-preview");

  function stopBgmTest() {
    bgmTestOscs.forEach((o) => {
      try { o.stop(); o.disconnect(); } catch (_) {}
    });
    bgmTestOscs = [];
    if (bgmTestTimer) clearTimeout(bgmTestTimer);
    if (btnBgmPreview) {
      btnBgmPreview.innerHTML = `<span>🔊 Tes Pratinjau Audio (5 Detik)</span>`;
      btnBgmPreview.style.borderColor = "rgba(255,255,255,0.12)";
      btnBgmPreview.style.color = "#94a3b8";
    }
  }

  btnBgmPreview?.addEventListener("click", () => {
    if (bgmTestOscs.length > 0) {
      stopBgmTest();
      showToast("Pratinjau audio dihentikan", "🔇");
      return;
    }
    if (state.bgm === "none") {
      showToast("Pilih Lo-Fi atau Synthwave untuk menguji BGM", "ℹ️");
      return;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.18, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);
      master.connect(ctx.destination);

      const freqs = state.bgm === "synthwave"
        ? [110.0, 164.81, 220.0, 261.63]
        : [146.83, 220.0, 261.63, 329.63];

      bgmTestOscs = freqs.map((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = state.bgm === "synthwave" ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.2 / freqs.length, now);
        osc.connect(g);
        g.connect(master);
        osc.start(now);
        osc.stop(now + 5.0);
        return osc;
      });

      btnBgmPreview.innerHTML = `<span>⏹️ Memutar ${state.bgm.toUpperCase()} (Klik untuk stop)</span>`;
      btnBgmPreview.style.borderColor = "#10b981";
      btnBgmPreview.style.color = "#10b981";
      showToast(`Pratinjau ${state.bgm.toUpperCase()} diputar selama 5 detik`, "🎵");

      bgmTestTimer = setTimeout(() => {
        stopBgmTest();
      }, 5000);
    } catch (e) {
      showToast("Gagal memutar audio: " + e.message, "⚠️");
    }
  });

  // URL Samples Chips click handler
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const target = chip.dataset.url;
      inputUrl.value = target;
      state.url = target;
      autoSuggestHook(target, state.preset);
      showToast(`Preset dimuat: ${chip.textContent.trim()}`, "⚡");
      launchStudioPreview(false, !isLivePaused);
    });
  });

  // Custom Hook Quick Chips
  hookChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const hook = chip.dataset.hook;
      if (inputHookText) inputHookText.value = hook;
      state.customHookText = hook;
      showToast("Headline diperbarui", "✨");
      launchStudioPreview(false, !isLivePaused);
    });
  });

  inputHookText?.addEventListener("input", (e) => {
    state.customHookText = e.target.value.trim();
  });

  inputUrl?.addEventListener("input", (e) => {
    state.url = e.target.value.trim();
    autoSuggestHook(state.url, state.preset);
  });

  inputUrl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      launchStudioPreview(true, true);
    }
  });

  btnClear?.addEventListener("click", () => {
    inputUrl.value = "";
    inputUrl.focus();
    showToast("URL dibersihkan", "🗑️");
  });

  // Paste from Clipboard Button
  btnPasteUrl?.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        inputUrl.value = text.trim();
        state.url = text.trim();
        showToast("Link ditempel dari clipboard!", "📋");
        launchStudioPreview();
      } else {
        showToast("Clipboard kosong", "⚠️");
      }
    } catch (_) {
      showToast("Izin clipboard diblokir browser, gunakan Ctrl+V", "ℹ️");
    }
  });

  // Quick Ratio Buttons on Canvas Toolbar
  function syncQuickRatioButtons() {
    quickRatioBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.ratio === state.format);
    });
  }

  quickRatioBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const ratio = btn.dataset.ratio;
      state.format = ratio;

      document.querySelectorAll("#seg-format .ratio-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.val === ratio);
      });

      syncQuickRatioButtons();
      updateDeviceFrame();
      updateCtaMeta();
      launchStudioPreview();
    });
  });

  // Quick Mockup Switcher on Canvas Toolbar
  function syncQuickMockupButtons() {
    quickMockBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mockup === state.mockup);
    });
  }

  quickMockBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mock = btn.dataset.mockup;
      state.mockup = mock;

      document.querySelectorAll("#seg-mockup .seg-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.val === mock);
      });

      syncQuickMockupButtons();
      updateDeviceFrame();
      launchStudioPreview();
      showToast(`Mockup diubah: ${btn.textContent.trim()}`, "🖥️");
    });
  });

  // Quick Zoom Scale Switcher on Canvas Toolbar
  quickZoomBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      quickZoomBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const zoom = btn.dataset.zoom;
      if (!deviceWrapper) return;
      if (zoom === "fit") {
        deviceWrapper.style.transform = "";
      } else {
        deviceWrapper.style.transform = `scale(${zoom})`;
        deviceWrapper.style.transformOrigin = "center center";
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 5. LIVE PAUSE & RESUME CONTROLLER (BIDIRECTIONAL)
  // ---------------------------------------------------------------------------
  function setLivePausedState(paused) {
    isLivePaused = !!paused;

    // Canvas Header Pause Button
    if (btnStagePause) {
      btnStagePause.classList.toggle("is-paused", isLivePaused);
    }
    if (stagePauseLabel) {
      stagePauseLabel.textContent = isLivePaused ? "Putar Live" : "Jeda";
    }
    if (stagePauseIcon) {
      if (isLivePaused) {
        stagePauseIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      } else {
        stagePauseIcon.innerHTML = `<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>`;
      }
    }

    // Timeline Scrubber Play/Pause Button
    if (transportPlaySvg) {
      if (isLivePaused) {
        transportPlaySvg.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      } else {
        transportPlaySvg.innerHTML = `<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>`;
      }
    }

    // Canvas Center Overlay
    if (stagePauseOverlay) {
      stagePauseOverlay.classList.toggle("is-hidden", !isLivePaused);
      const titleEl = stagePauseOverlay.querySelector("strong");
      const descEl = stagePauseOverlay.querySelector("span");
      if (titleEl) titleEl.textContent = isLivePaused ? "Mode Standby (Siap Diputar)" : "Live Tour Berjalan";
      if (descEl) descEl.textContent = isLivePaused ? "Atur opsi di sebelah kiri, lalu klik di sini untuk memutar live demo" : "Klik untuk menjeda";
    }

    // Canvas Live Dot
    if (liveStatusDot) {
      if (isLivePaused) {
        liveStatusDot.style.backgroundColor = "#f59e0b";
        liveStatusDot.style.boxShadow = "0 0 10px #f59e0b";
        liveStatusDot.title = "Standby (Klik Putar untuk memulai)";
      } else {
        liveStatusDot.style.backgroundColor = "#10b981";
        liveStatusDot.style.boxShadow = "0 0 10px #10b981";
        liveStatusDot.title = "Live Playing";
      }
    }

    updateTimelineUi();
  }

  function toggleLivePause() {
    isLivePaused = !isLivePaused;
    setLivePausedState(isLivePaused);

    // Communicate to iframe (single-channel delivery to prevent dual-launch)
    if (iframe && iframe.contentWindow) {
      let handledDirectly = false;
      try {
        if (iframe.contentWindow.__swarmRebuild) {
          if (isLivePaused) {
            if (iframe.contentWindow.__swarmRebuild.running && !iframe.contentWindow.__swarmRebuild.paused) {
              iframe.contentWindow.__swarmRebuild.togglePause();
            }
          } else {
            if (!iframe.contentWindow.__swarmRebuild.running) {
              iframe.contentWindow.__swarmRebuild.launchRebuild();
            } else if (iframe.contentWindow.__swarmRebuild.paused) {
              iframe.contentWindow.__swarmRebuild.togglePause();
            }
          }
          handledDirectly = true;
        }
      } catch (_) {}

      if (!handledDirectly) {
        iframe.contentWindow.postMessage(
          { type: isLivePaused ? "REBUILDR_PAUSE" : "REBUILDR_RESUME" },
          "*"
        );
      }
    }

    showToast(isLivePaused ? "Live preview dijeda (Pause)" : "Live tour dimulai (Playing)", isLivePaused ? "⏸️" : "▶️");
  }

  btnStagePause?.addEventListener("click", () => {
    toggleLivePause();
  });

  stagePauseOverlay?.addEventListener("click", () => {
    if (isLivePaused) {
      toggleLivePause();
    }
  });

  // Listen to pause state reports sent from iframe
  window.addEventListener("message", (e) => {
    if (!e.data || typeof e.data !== "object") return;
    if (e.data.type === "REBUILDR_PAUSE_STATE") {
      setLivePausedState(!!e.data.paused);
    }
  });

  // ---------------------------------------------------------------------------
  // 6. LIVE TIMELINE ENGINE (SCRUBBER, TIME CODE & CHAPTERS)
  // ---------------------------------------------------------------------------
  function parseDurationSeconds(durStr) {
    if (durStr === "15s") return 15;
    if (durStr === "60s") return 60;
    return 30;
  }

  function formatTime(sec) {
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  }

  function syncTimelineChapters() {
    const track = document.getElementById("timeline-track");
    if (!track) return;
    const oldMarkers = track.querySelectorAll(".chapter-marker");
    oldMarkers.forEach((m) => m.remove());

    let chapters = [];
    if (state.preset === "before-after") {
      chapters = [
        { label: "Intro", pct: 0, text: "FASE 1/4 • Intro Headline" },
        { label: "Wireframe", pct: 25, text: "FASE 2/4 • Wireframe Sketsa" },
        { label: "AI Reconstruct", pct: 55, text: "FASE 3/4 • 8 AI Reconstruction" },
        { label: "Finish", pct: 85, text: "FASE 4/4 • Final Showcase 60FPS" },
      ];
    } else if (state.preset === "feature-tour") {
      chapters = [
        { label: "Hero Intro", pct: 0, text: "FASE 1/4 • Overview & Hero Section" },
        { label: "Fitur #1", pct: 28, text: "FASE 2/4 • Fitur Unggulan #1" },
        { label: "Fitur #2", pct: 58, text: "FASE 3/4 • Fitur Unggulan #2" },
        { label: "Selesai", pct: 86, text: "FASE 4/4 • Panduan Selesai & CTA" },
      ];
    } else if (state.preset === "teaser-30s") {
      chapters = [
        { label: "Hook", pct: 0, text: "FASE 1/4 • Viral Hook Headline" },
        { label: "Fast Cut 1", pct: 30, text: "FASE 2/4 • Rapid Cut & Zoom" },
        { label: "Fast Cut 2", pct: 60, text: "FASE 3/4 • High Engagement Climax" },
        { label: "Outro CTA", pct: 85, text: "FASE 4/4 • Call-To-Action" },
      ];
    } else {
      chapters = [
        { label: "Blueprint", pct: 0, text: "FASE 1/4 • Blueprint Grid" },
        { label: "Assemble", pct: 35, text: "FASE 2/4 • Assembling DOM Elements" },
        { label: "Code Run", pct: 70, text: "FASE 3/4 • Running Terminal Script" },
        { label: "Done", pct: 90, text: "FASE 4/4 • Ready for Production" },
      ];
    }

    chapters.forEach((ch, idx) => {
      const el = document.createElement("div");
      el.className = `chapter-marker ch-${idx + 1}`;
      el.style.left = `${ch.pct}%`;
      el.title = ch.label;
      el.dataset.phaseText = ch.text;
      el.innerHTML = `<span class="marker-dot"></span><span class="marker-label">${ch.label}</span>`;
      track.appendChild(el);
    });
  }

  function updateTimelineUi() {
    const totalSec = parseDurationSeconds(state.duration);
    if (timeTotal) timeTotal.textContent = formatTime(totalSec);
    if (timeCurrent) timeCurrent.textContent = formatTime(timelineElapsed);

    const pct = Math.min(100, Math.max(0, (timelineElapsed / totalSec) * 100));
    if (timelineProgressFill) timelineProgressFill.style.width = `${pct}%`;
    if (timelineScrubHandle) timelineScrubHandle.style.left = `${pct}%`;

    // Highlight passed chapters & update Live Phase HUD
    let currentPhaseText = "";
    document.querySelectorAll(".chapter-marker").forEach((marker) => {
      const leftPct = parseFloat(marker.style.left);
      const isPassed = pct >= leftPct;
      marker.classList.toggle("is-passed", isPassed);
      if (isPassed && marker.dataset.phaseText) {
        currentPhaseText = marker.dataset.phaseText;
      }
    });

    if (stagePhaseLabel && currentPhaseText) {
      stagePhaseLabel.textContent = currentPhaseText;
    }

    // Audio Equalizer in Header
    if (headerAudioEq) {
      const hasAudio = state.bgm !== "none" && !isMuted && !isLivePaused;
      headerAudioEq.classList.toggle("is-hidden", !hasAudio);
    }
  }

  function startTimelineTicker() {
    if (timelineTimer) clearInterval(timelineTimer);
    timelineTimer = setInterval(() => {
      if (!isLivePaused) {
        const totalSec = parseDurationSeconds(state.duration);
        timelineElapsed += 0.25;
        if (timelineElapsed >= totalSec) {
          timelineElapsed = 0; // loop seamlessly
        }
        updateTimelineUi();
      }
    }, 250);
  }

  function resetTimeline() {
    timelineElapsed = 0;
    updateTimelineUi();
  }

  btnTransportPlay?.addEventListener("click", () => {
    toggleLivePause();
  });

  btnTransportReplay?.addEventListener("click", () => {
    resetTimeline();
    if (iframe && iframe.contentWindow) {
      let handledDirectly = false;
      try {
        if (iframe.contentWindow.__swarmRebuild) {
          iframe.contentWindow.__swarmRebuild.launchRebuild();
          handledDirectly = true;
        }
      } catch (_) {}

      if (!handledDirectly) {
        iframe.contentWindow.postMessage({ type: "REBUILDR_RESTART" }, "*");
      }
    } else {
      launchStudioPreview();
    }
    showToast("Animasi diulang dari awal (Replay)", "↺");
  });

  // Smooth Scrubbing with Drag Support
  let isTimelineScrubbing = false;

  function performTimelineScrub(clientX) {
    if (!timelineTrackWrap) return;
    const rect = timelineTrackWrap.getBoundingClientRect();
    const clickX = Math.min(rect.width, Math.max(0, clientX - rect.left));
    const ratio = rect.width > 0 ? clickX / rect.width : 0;
    const totalSec = parseDurationSeconds(state.duration);
    timelineElapsed = ratio * totalSec;
    updateTimelineUi();
  }

  timelineTrackWrap?.addEventListener("mousedown", (e) => {
    isTimelineScrubbing = true;
    timelineTrackWrap.classList.add("is-scrubbing");
    performTimelineScrub(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    if (isTimelineScrubbing) {
      performTimelineScrub(e.clientX);
    }
  });

  window.addEventListener("mouseup", () => {
    if (isTimelineScrubbing) {
      isTimelineScrubbing = false;
      timelineTrackWrap?.classList.remove("is-scrubbing");
      showToast(`Posisi timeline: detik ${Math.round(timelineElapsed)}s`, "⏱️");
    }
  });

  timelineTrackWrap?.addEventListener("touchstart", (e) => {
    isTimelineScrubbing = true;
    if (e.touches && e.touches[0]) performTimelineScrub(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (isTimelineScrubbing && e.touches && e.touches[0]) {
      performTimelineScrub(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    if (isTimelineScrubbing) isTimelineScrubbing = false;
  });

  btnTransportSound?.addEventListener("click", () => {
    isMuted = !isMuted;
    if (transportSoundSvg) {
      if (isMuted) {
        transportSoundSvg.innerHTML = `<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>`;
      } else {
        transportSoundSvg.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
      }
    }

    // Synchronize mute state to iframe
    if (iframe && iframe.contentWindow) {
      try {
        if (iframe.contentWindow.__swarmRebuild) {
          iframe.contentWindow.__swarmRebuild.sound.muted = isMuted;
          if (iframe.contentWindow.__swarmRebuild.tourAudio) {
            iframe.contentWindow.__swarmRebuild.tourAudio.muted = isMuted;
          }
          if (isMuted) {
            iframe.contentWindow.__swarmRebuild.stopTourNarration();
          }
        }
      } catch (_) {}
      iframe.contentWindow.postMessage({ type: "REBUILDR_MUTE", muted: isMuted }, "*");
    }

    updateTimelineUi();
    showToast(isMuted ? "Suara studio dimatikan (Muted)" : "Suara studio diaktifkan (Unmuted)", isMuted ? "🔇" : "🔊");
  });

  // ---------------------------------------------------------------------------
  // 7. KEYBOARD SHORTCUTS CHEAT SHEET MODAL & GLOBAL HOTKEYS
  // ---------------------------------------------------------------------------
  function openShortcutsModal() {
    shortcutsModal?.classList.add("is-open");
  }

  function closeShortcutsModal() {
    shortcutsModal?.classList.remove("is-open");
  }

  btnShortcutsTrigger?.addEventListener("click", openShortcutsModal);
  btnCloseShortcuts?.addEventListener("click", closeShortcutsModal);
  shortcutsModal?.addEventListener("click", (e) => {
    if (e.target === shortcutsModal) closeShortcutsModal();
  });

  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return;

    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      if (shortcutsModal?.classList.contains("is-open")) closeShortcutsModal();
      else openShortcutsModal();
    } else if (e.key === "Escape") {
      closeShortcutsModal();
      closeModal();
    } else if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      toggleLivePause();
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      resetTimeline();
      launchStudioPreview();
      showToast("Animasi dimuat ulang (Replay)", "↺");
    } else if (e.key === "1") {
      e.preventDefault();
      document.querySelector('.quick-ratio-btn[data-ratio="9:16"]')?.click();
    } else if (e.key === "2") {
      e.preventDefault();
      document.querySelector('.quick-ratio-btn[data-ratio="16:9"]')?.click();
    } else if (e.key === "3") {
      e.preventDefault();
      document.querySelector('.quick-ratio-btn[data-ratio="1:1"]')?.click();
    } else if (e.key === "4") {
      e.preventDefault();
      document.querySelector('.quick-ratio-btn[data-ratio="4:5"]')?.click();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      const mockups = ["flat", "mockup-laptop", "mockup-phone"];
      const nextMock = mockups[(mockups.indexOf(state.mockup) + 1) % mockups.length];
      document.querySelector(`.quick-mock-btn[data-mockup="${nextMock}"]`)?.click();
    } else if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      btnTransportSound?.click();
    } else if (e.key === "Enter") {
      e.preventDefault();
      startCloudRender();
    }
  });

  // ---------------------------------------------------------------------------
  // 8. RENDER QUALITY SELECTOR
  // ---------------------------------------------------------------------------
  qualityBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      qualityBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.quality = btn.dataset.quality;
      showToast(`Kualitas render diatur ke ${btn.textContent.trim()}`, "✨");
    });
  });

  // ---------------------------------------------------------------------------
  // 9. LIVE STUDIO PREVIEW LOGIC
  // ---------------------------------------------------------------------------
  function buildProxyUrl(autoStart = false) {
    let raw = (inputUrl?.value || state.url || "/showcase-saas.html").trim();
    if (!raw.startsWith("/") && !/^https?:\/\//i.test(raw)) {
      raw = `https://${raw}`;
    }
    const currentHook = inputHookText ? inputHookText.value.trim() : state.customHookText;
    const tourCountSelect = document.getElementById("tour-count-select");
    const tourNicheSelect = document.getElementById("tour-niche-select");
    const tourLangSelect = document.getElementById("tour-lang-select");
    const tourOverlaySelect = document.getElementById("tour-overlay-select");

    const tourCount = tourCountSelect ? tourCountSelect.value : "5";
    const tourNiche = tourNicheSelect ? tourNicheSelect.value : "auto";
    const tourLang = tourLangSelect ? tourLangSelect.value : "id";
    const tourOverlay = tourOverlaySelect ? tourOverlaySelect.value : "full";

    const params = new URLSearchParams({
      url: raw,
      format: state.format,
      preset: state.preset,
      scope: state.scope,
      mode: state.mode,
      theme: state.theme,
      speed: state.speed,
      bgm: state.bgm,
      customHookText: currentHook,
      targetDuration: state.duration,
      deviceMockup: state.mockup,
      tourCount,
      tourNiche,
      tourLang,
      tourOverlay,
      ghost: state.ghost === "true" ? "1" : "0",
      terminal: state.terminal === "false" ? "0" : "1",
      watermark: state.watermark,
      audioBalance: state.audioBalance,
      autoStart: autoStart ? "1" : "0",
    });
    return `/proxy?${params.toString()}`;
  }

  function updateDeviceFrame() {
    if (!deviceWrapper) return;
    deviceWrapper.classList.remove(
      "format-9-16",
      "format-16-9",
      "format-1-1",
      "mockup-phone",
      "mockup-laptop",
      "mockup-flat"
    );

    if (state.format === "9:16") {
      deviceWrapper.classList.add("format-9-16");
    } else if (state.format === "1:1") {
      deviceWrapper.classList.add("format-1-1");
    } else {
      deviceWrapper.classList.add("format-16-9");
    }

    if (state.mockup === "mockup-phone") {
      deviceWrapper.classList.add("mockup-phone");
    } else if (state.mockup === "mockup-laptop") {
      deviceWrapper.classList.add("mockup-laptop");
    } else {
      deviceWrapper.classList.add("mockup-flat");
    }

    if (btnToggleRatio) {
      const span = btnToggleRatio.querySelector("span");
      if (span) span.textContent = "Rotasi";
    }
  }

  function launchStudioPreview(shouldScroll = false, autoStart = !isLivePaused) {
    setLivePausedState(!autoStart);
    resetTimeline();
    currentProxyUrl = buildProxyUrl(autoStart);
    updateDeviceFrame();
    syncQuickRatioButtons();
    syncQuickMockupButtons();

    const displayTag = state.url.startsWith("/")
      ? state.url.replace(/^\//, "")
      : state.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");

    if (previewTag) previewTag.textContent = displayTag;

    // Defuse beforeunload inside iframe prior to src assignment to eliminate "Keluar dari situs?"
    try {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.onbeforeunload = null;
        iframe.contentWindow.onunload = null;
      }
    } catch (_) {}

    if (iframe) iframe.src = currentProxyUrl;

    if (shouldScroll && window.innerWidth <= 1080) {
      const stageTab = document.querySelector('.mob-tab[data-target="stage"]');
      if (stageTab) stageTab.click();
    }
  }

  // Ensure iframe document in mobile phone mode never renders ugly desktop scrollbars
  if (iframe) {
    iframe.addEventListener("load", () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc && doc.head && !doc.getElementById("studio-mobile-scroll-fix")) {
          const style = doc.createElement("style");
          style.id = "studio-mobile-scroll-fix";
          style.textContent = `
            :root { color-scheme: dark !important; }
            html, body {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
              overflow-x: hidden !important;
              -webkit-overflow-scrolling: touch !important;
            }
            ::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }
          `;
          doc.head.appendChild(style);
        }
      } catch (_) {}
    });
  }

  btnLaunch?.addEventListener("click", () => {
    launchStudioPreview(true, true);
    showToast("Live Studio diputar", "▶");
  });

  btnToggleRatio?.addEventListener("click", () => {
    const formats = ["9:16", "16:9", "1:1"];
    const curIdx = formats.indexOf(state.format);
    state.format = formats[(curIdx + 1) % formats.length];

    document.querySelectorAll("#seg-format .ratio-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.val === state.format);
    });

    updateDeviceFrame();
    syncQuickRatioButtons();
    updateCtaMeta();
    launchStudioPreview();
  });

  btnReloadStudio?.addEventListener("click", () => {
    if (currentProxyUrl && iframe) {
      iframe.src = currentProxyUrl;
    } else {
      launchStudioPreview();
    }
    resetTimeline();
    showToast("Studio direfresh", "🔄");
  });

  btnOpenNewTab?.addEventListener("click", () => {
    const target = currentProxyUrl || buildProxyUrl();
    window.open(target, "_blank");
  });

  // ---------------------------------------------------------------------------
  // 10. CLOUD RENDER AUTO VIDEO GENERATOR (JOB POLLER & MODAL)
  // ---------------------------------------------------------------------------
  function updateModalStep(stepNumber) {
    stepNodes.forEach((node, idx) => {
      if (!node) return;
      if (idx < stepNumber) {
        node.classList.add("active");
      } else {
        node.classList.remove("active");
      }
    });
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add("is-open");
    resultVideoWrap?.classList.add("is-hidden");
    btnDownloadGif?.classList.add("is-hidden");
    if (terminalLogs) terminalLogs.innerHTML = "";
    if (progressFill) progressFill.style.width = "5%";
    if (progressPct) progressPct.textContent = "5%";
    if (progressText) progressText.textContent = "Mengirim permintaan render ke Cloud Engine...";
    if (modalHeading) modalHeading.textContent = "Merender Video Motion Graphic...";

    updateModalStep(1);

    const durationSec = state.duration === "60s" ? 65 : (state.duration === "15s" ? 25 : 38);
    remainingEta = durationSec;
    if (jobEta) jobEta.textContent = `⏱️ Estimasi: ~${remainingEta}s`;
    if (etaInterval) clearInterval(etaInterval);
    etaInterval = setInterval(() => {
      if (remainingEta > 4) {
        remainingEta--;
        if (jobEta) jobEta.textContent = `⏱️ Estimasi: ~${remainingEta}s`;
      }
    }, 1000);
  }

  function closeModal() {
    modal?.classList.remove("is-open");
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
    if (etaInterval) {
      clearInterval(etaInterval);
      etaInterval = null;
    }
  }

  btnCloseModal?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  async function startCloudRender() {
    let raw = (inputUrl?.value || state.url || "/showcase-saas.html").trim();
    if (!raw.startsWith("/") && !/^https?:\/\//i.test(raw)) {
      raw = `https://${raw}`;
    }

    openModal();

    const currentHook = inputHookText ? inputHookText.value.trim() : state.customHookText;
    const tourCountSelect = document.getElementById("tour-count-select");
    const tourNicheSelect = document.getElementById("tour-niche-select");
    const tourLangSelect = document.getElementById("tour-lang-select");
    const tourOverlaySelect = document.getElementById("tour-overlay-select");

    const tourCount = tourCountSelect ? tourCountSelect.value : "5";
    const tourNiche = tourNicheSelect ? tourNicheSelect.value : "auto";
    const tourLang = tourLangSelect ? tourLangSelect.value : "id";
    const tourOverlay = tourOverlaySelect ? tourOverlaySelect.value : "full";

    // Route external http/https URLs through local /proxy so strict remote CSP headers never block Swarm AI injection
    const renderTargetUrl = /^https?:\/\//i.test(raw) ? buildProxyUrl(true) : raw;

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: renderTargetUrl,
          rawUrl: raw,
          format: state.format,
          preset: state.preset,
          scope: state.scope,
          mode: state.mode,
          theme: state.theme,
          speed: state.speed,
          bgm: state.bgm,
          customHookText: currentHook,
          targetDuration: state.duration,
          deviceMockup: state.mockup,
          tourCount,
          tourNiche,
          tourLang,
          tourOverlay,
          ghost: state.ghost === "true",
          terminal: state.terminal !== "false",
          watermark: state.watermark,
          audioBalance: state.audioBalance,
          quality: state.quality,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.jobId) {
        throw new Error(data.error || "Gagal membuat job render");
      }

      const jobId = data.jobId;
      appendLog(`Job terdaftar: [${jobId}] (${state.quality || "1080p"})`);
      pollRenderStatus(jobId);
    } catch (err) {
      if (progressText) progressText.textContent = `Gagal: ${err.message}`;
      if (progressFill) progressFill.style.background = "#f43f5e";
      appendLog(`ERROR: ${err.message}`);
    }
  }

  function appendLog(line) {
    if (!terminalLogs) return;
    const div = document.createElement("div");
    div.className = "term-line";
    div.textContent = `> ${line}`;
    terminalLogs.appendChild(div);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  function pollRenderStatus(jobId) {
    if (pollInterval) clearInterval(pollInterval);

    pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) return;
        const job = await res.json();

        if (progressFill) progressFill.style.width = `${job.progress}%`;
        if (progressPct) progressPct.textContent = `${job.progress}%`;

        if (job.progress < 25) updateModalStep(1);
        else if (job.progress < 50) updateModalStep(2);
        else if (job.progress < 85) updateModalStep(3);
        else updateModalStep(4);

        const statusMap = {
          queued: job.queuePos ? `Menunggu antrean (#${job.queuePos})...` : "Dalam antrean render...",
          launching_browser: "Meluncurkan browser rendering...",
          loading_page: "Membuka halaman target...",
          analyzing_page: "AI menganalisis struktur DOM...",
          reconstructing: job.preset === "feature-tour"
            ? "🎯 Solo Hero Cursor mendemonstrasikan fitur produk..."
            : (job.ghost ? "👻 Ghost Mode merakit halaman secara otonom..." : "8 Kursor AI sedang merakit komponen & poligon..."),
          encoding_video: "Mengemas video HD 60FPS & menghasilkan GIF...",
          completed: "Selesai 100%! Video siap ditonton & diunduh.",
          failed: `Gagal: ${job.error || "Terjadi kesalahan"}`,
        };

        if (progressText) progressText.textContent = statusMap[job.status] || job.status;

        if (terminalLogs) {
          terminalLogs.innerHTML = "";
          (job.logs || []).forEach((log) => {
            const div = document.createElement("div");
            div.className = "term-line";
            div.textContent = `> ${log}`;
            terminalLogs.appendChild(div);
          });
          terminalLogs.scrollTop = terminalLogs.scrollHeight;
        }

        if (job.status === "completed") {
          clearInterval(pollInterval);
          pollInterval = null;
          if (etaInterval) {
            clearInterval(etaInterval);
            etaInterval = null;
          }
          if (jobEta) jobEta.textContent = "✓ Selesai!";
          if (modalHeading) modalHeading.textContent = "✓ Video Motion Graphic Selesai!";
          if (progressFill) progressFill.style.background = "linear-gradient(90deg, #10b981, #34d399)";
          updateModalStep(4);

          saveJobToGallery(job);
          showToast("Video render selesai 100%!", "🎉");

          if (job.videoUrl && videoPlayer) {
            videoPlayer.src = job.videoUrl;
            videoPlayer.load();
            videoPlayer.play().catch(() => {
              videoPlayer.muted = true;
              videoPlayer.play().catch(() => {});
            });

            if (btnDownload) {
              btnDownload.href = job.videoUrl;
              btnDownload.setAttribute("download", job.filename || "rebuildr-video.mp4");
            }

            if (job.gifUrl && btnDownloadGif) {
              btnDownloadGif.href = job.gifUrl;
              btnDownloadGif.setAttribute("download", job.gifFilename || "rebuildr-animation.gif");
              btnDownloadGif.classList.remove("is-hidden");
            }

            if (btnCopyLink) {
              btnCopyLink.onclick = () => {
                const fullUrl = `${window.location.origin}${job.videoUrl}`;
                navigator.clipboard.writeText(fullUrl).then(() => {
                  showToast("Link file tersalin ke clipboard!", "📋");
                });
              };
            }

            resultVideoWrap?.classList.remove("is-hidden");
          }
        } else if (job.status === "failed") {
          clearInterval(pollInterval);
          pollInterval = null;
          if (etaInterval) {
            clearInterval(etaInterval);
            etaInterval = null;
          }
          if (jobEta) jobEta.textContent = "✕ Gagal";
          if (modalHeading) modalHeading.textContent = "✕ Proses Render Gagal";
          if (progressFill) progressFill.style.background = "#f43f5e";
        }
      } catch (err) {
        appendLog(`Gagal memuat status: ${err.message}`);
      }
    }, 1100);
  }

  // ---------------------------------------------------------------------------
  // 11. RECENT SHOWCASE GALLERY (LOCALSTORAGE)
  // ---------------------------------------------------------------------------
  function saveJobToGallery(job) {
    if (!job || !job.videoUrl) return;
    try {
      const stored = JSON.parse(localStorage.getItem("__rebuildr_gallery") || "[]");
      const exists = stored.find((item) => item.id === job.id);
      if (!exists) {
        const entry = {
          id: job.id,
          url: state.url,
          videoUrl: job.videoUrl,
          gifUrl: job.gifUrl,
          filename: job.filename,
          gifFilename: job.gifFilename,
          format: state.format,
          duration: state.duration,
          timestamp: Date.now(),
        };
        stored.unshift(entry);
        localStorage.setItem("__rebuildr_gallery", JSON.stringify(stored.slice(0, 12)));
        renderGallery();
      }
    } catch (_) {}
  }

  function renderGallery() {
    if (!galleryGrid) return;
    try {
      const stored = JSON.parse(localStorage.getItem("__rebuildr_gallery") || "[]");
      if (stored.length === 0) {
        galleryGrid.innerHTML = `
          <div class="gallery-empty-state" id="gallery-empty">
            <span class="empty-icon">🎬</span>
            <p>Belum ada video di riwayat. Tekan <strong>"Auto-Generate Video"</strong> di atas untuk membuat video pertamamu!</p>
          </div>
        `;
        return;
      }

      galleryGrid.innerHTML = stored.map((item) => {
        const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const isNineSixteen = item.format === "9:16";
        const displayTag = item.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
        return `
          <div class="gallery-card ${isNineSixteen ? "format-9-16" : ""}">
            <div class="gallery-card-preview">
              <video src="${item.videoUrl}" preload="metadata" muted playsinline loop onmouseenter="this.play()" onmouseleave="this.pause()"></video>
            </div>
            <div class="gallery-card-body">
              <div class="gallery-card-title" title="${item.url}">🌐 ${displayTag}</div>
              <div class="gallery-card-meta">
                <span class="gallery-card-badge">${item.format}</span>
                <span>⏱️ ${item.duration}</span>
                <span style="margin-left:auto;">${timeStr}</span>
              </div>
              <div class="gallery-card-actions">
                <a href="${item.videoUrl}" download="${item.filename || 'showcase.mp4'}" class="btn-gal-mp4">⬇ MP4</a>
                ${item.gifUrl ? `<a href="${item.gifUrl}" download="${item.gifFilename || 'showcase.gif'}" class="btn-gal-gif">🖼️ GIF</a>` : ""}
              </div>
            </div>
          </div>
        `;
      }).join("");
    } catch (_) {}
  }

  btnClearGallery?.addEventListener("click", () => {
    localStorage.removeItem("__rebuildr_gallery");
    renderGallery();
    showToast("Riwayat video dibersihkan", "🗑️");
  });

  btnRender?.addEventListener("click", startCloudRender);
  btnTopRender?.addEventListener("click", startCloudRender);

  function syncAllSegButtonsFromState() {
    const mapping = [
      { id: "seg-format", key: "format" },
      { id: "seg-duration", key: "duration" },
      { id: "seg-bgm", key: "bgm" },
      { id: "seg-mockup", key: "mockup" },
      { id: "seg-preset", key: "preset" },
      { id: "seg-scope", key: "scope" },
      { id: "seg-mode", key: "mode" },
      { id: "seg-theme", key: "theme" },
      { id: "seg-speed", key: "speed" },
      { id: "seg-ghost", key: "ghost" },
      { id: "seg-terminal", key: "terminal" },
      { id: "seg-watermark", key: "watermark" },
      { id: "seg-audio-balance", key: "audioBalance" },
    ];
    mapping.forEach(({ id, key }) => {
      const container = document.getElementById(id);
      if (!container) return;
      const buttons = container.querySelectorAll("button");
      buttons.forEach((btn) => {
        if (String(btn.dataset.val) === String(state[key])) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    });
  }

  // Initialize preview, gallery & CTA on load in Clean Standby Mode
  window.addEventListener("DOMContentLoaded", () => {
    // Check if ?url= was passed from Landing Page
    try {
      const qParams = new URLSearchParams(window.location.search);
      const incomingUrl = qParams.get("url");
      if (incomingUrl) {
        state.url = incomingUrl;
        if (inputUrl) inputUrl.value = incomingUrl;
        autoSuggestHook(incomingUrl, state.preset);
      }
    } catch (_) {}

    syncAllSegButtonsFromState();
    syncTimelineChapters();
    updateCtaMeta();
    syncQuickRatioButtons();
    syncQuickMockupButtons();
    startTimelineTicker();
    setLivePausedState(true);
    launchStudioPreview(false, false);
    renderGallery();
  });
})();
