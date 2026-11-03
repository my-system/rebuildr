// Rebuildr Web Studio & Cloud Video Generator Server
// Turn any website URL into an automated motion graphic showcase video.
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const net = require("net");
const dns = require("dns").promises;
const puppeteer = require("puppeteer-core");

function isPrivateOrBlockedIP(ipStr) {
  if (!ipStr) return true;
  if (ipStr.startsWith("::ffff:")) {
    ipStr = ipStr.substring(7);
  }
  if (net.isIPv4(ipStr)) {
    const parts = ipStr.split(".").map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return true;
    const [a, b, c, d] = parts;
    if (a === 0) return true; // 0.0.0.0/8
    if (a === 127) return true; // 127.0.0.0/8 loopback
    if (a === 10) return true; // 10.0.0.0/8 private
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 private
    if (a === 192 && b === 168) return true; // 192.168.0.0/16 private
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local / cloud metadata
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a === 198 && (b === 18 || b === 19)) return true; // benchmark
    if (a >= 224) return true; // Multicast & Reserved
    return false;
  }
  if (net.isIPv6(ipStr)) {
    const norm = ipStr.toLowerCase();
    if (norm === "::1" || norm === "::") return true;
    if (norm.startsWith("fe8") || norm.startsWith("fe9") || norm.startsWith("fea") || norm.startsWith("feb")) return true;
    if (norm.startsWith("fc") || norm.startsWith("fd")) return true;
    return false;
  }
  return true;
}

async function validateUrlForSSRF(targetUrlStr) {
  let parsed;
  try {
    parsed = new URL(targetUrlStr);
  } catch (_) {
    return { valid: false, error: "URL tidak valid" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Protokol tidak diizinkan (hanya http:// atau https://)" };
  }

  const hostname = parsed.hostname.toLowerCase();
  const isLocalSelf = (hostname === "localhost" || hostname === "127.0.0.1") && Number(parsed.port || 80) === PORT;
  if (isLocalSelf) {
    return { valid: true };
  }

  if (net.isIP(hostname)) {
    if (isPrivateOrBlockedIP(hostname)) {
      return { valid: false, error: `Akses ke IP privat/internal (${hostname}) diblokir demi keamanan (SSRF Protection).` };
    }
    return { valid: true };
  }

  try {
    const records = await dns.lookup(hostname, { all: true });
    if (!records || records.length === 0) {
      return { valid: false, error: "Hostname tidak dapat diselesaikan via DNS" };
    }
    for (const rec of records) {
      if (isPrivateOrBlockedIP(rec.address)) {
        return { valid: false, error: `Akses ke IP internal (${rec.address}) untuk host ${hostname} diblokir (SSRF Protection).` };
      }
    }
  } catch (err) {
    return { valid: false, error: `Gagal menyelesaikan DNS untuk ${hostname}: ${err.message}` };
  }

  return { valid: true };
}

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const EXPORTS_DIR = path.join(PUBLIC_DIR, "exports");
const TTS_CACHE_DIR = path.join(PUBLIC_DIR, "cache", "tts");

if (!fs.existsSync(EXPORTS_DIR)) {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}
if (!fs.existsSync(TTS_CACHE_DIR)) {
  fs.mkdirSync(TTS_CACHE_DIR, { recursive: true });
}

function chunkTtsText(text, maxLen = 140) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks = [];
  let cur = "";
  for (let s of sentences) {
    s = s.trim();
    if (!s) continue;
    if ((cur + " " + s).trim().length <= maxLen) {
      cur = (cur ? cur + " " : "") + s;
    } else {
      if (cur) chunks.push(cur);
      if (s.length > maxLen) {
        const words = s.split(" ");
        let sub = "";
        for (let w of words) {
          if ((sub + " " + w).trim().length <= maxLen) {
            sub = (sub ? sub + " " : "") + w;
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        if (sub) chunks.push(sub);
        cur = "";
      } else {
        cur = s;
      }
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

function fetchTtsChunk(text, lang = "id") {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 5000
    }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Upstream TTS status ${res.statusCode}`));
      }
      const chunks = [];
      res.on("data", (d) => chunks.push(d));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Upstream TTS timeout"));
    });
  });
}

async function getNeuralTtsAudio(text, lang = "id") {
  const clean = String(text)
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}⚡🚀🔍⌨️📊✨⚙️🎛️📋📂📑🎠🛍️💳🎓🍽️🎬★•]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return null;

  const hash = crypto.createHash("md5").update(`${lang}:${clean}`).digest("hex");
  const cacheFile = path.join(TTS_CACHE_DIR, `${hash}.mp3`);

  if (fs.existsSync(cacheFile)) {
    return fs.readFileSync(cacheFile);
  }

  const chunks = chunkTtsText(clean, 140);
  const buffers = [];
  for (const c of chunks) {
    const buf = await fetchTtsChunk(c, lang);
    buffers.push(buf);
    if (chunks.length > 1) {
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  const fullAudio = Buffer.concat(buffers);
  try {
    fs.writeFileSync(cacheFile, fullAudio);
  } catch (_) {}
  return fullAudio;
}

process.on("uncaughtException", (err) => {
  console.error("[UNCAUGHT EXCEPTION]:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[UNHANDLED REJECTION]:", reason);
});

// In-memory Job Map & Concurrency Queue
const jobs = new Map();
const MAX_CONCURRENT_JOBS = 2;
let activeJobsCount = 0;
const renderQueue = [];

function updateQueuePositions() {
  renderQueue.forEach((job, idx) => {
    job.queuePos = idx + 1;
    if (job.status === "queued") {
      job.logs = [`[${new Date().toLocaleTimeString()}] Menunggu antrean render (Posisi Antrean: #${job.queuePos})...`];
    }
  });
}

function processNextInQueue() {
  if (activeJobsCount >= MAX_CONCURRENT_JOBS || renderQueue.length === 0) return;
  const nextJob = renderQueue.shift();
  updateQueuePositions();
  activeJobsCount++;
  processRenderJob(nextJob).catch((err) => {
    nextJob.status = "failed";
    nextJob.error = err.message;
  });
}

function enqueueRenderJob(job) {
  renderQueue.push(job);
  updateQueuePositions();
  processNextInQueue();
}

// Detect Google Chrome Binary on Windows
function findChromeBinary() {
  const candidates = [
    process.env.CHROME_BIN,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(process.env.LOCALAPPDATA || "", "Google\\Chrome\\Application\\chrome.exe"),
  ].filter(Boolean);

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

const CHROME_PATH = findChromeBinary();

// MIME Types map
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
};

// ---------------------------------------------------------------------------
// 1. CLOUD RENDER WORKER (PUPPETEER ENGINE)
// ---------------------------------------------------------------------------
async function processRenderJob(job) {
  job.status = "launching_browser";
  job.progress = 10;
  job.logs.push(`[${new Date().toLocaleTimeString()}] Menyiapkan lingkungan browser render...`);

  if (!CHROME_PATH) {
    job.status = "failed";
    job.error = "Google Chrome binary tidak ditemukan di sistem host.";
    job.logs.push(`[${new Date().toLocaleTimeString()}] ERROR: Google Chrome executable tidak ditemukan.`);
    return;
  }

  let viewport = { width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false };
  let targetWidth = 1920;
  let targetHeight = 1080;

  if (job.format === "9:16") {
    viewport = { width: 540, height: 960, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
    targetWidth = 1080;
    targetHeight = 1920;
  } else if (job.format === "1:1") {
    viewport = { width: 720, height: 720, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
    targetWidth = 1080;
    targetHeight = 1080;
  } else if (job.format === "4:5") {
    viewport = { width: 540, height: 675, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
    targetWidth = 1080;
    targetHeight = 1350;
  }

  let browser = null;
  let ffmpegProc = null;
  let client = null;
  let frameFeederInterval = null;

  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      defaultViewport: viewport,
      args: [
        "--allow-file-access-from-files",
        "--allow-running-insecure-content",
        "--autoplay-policy=no-user-gesture-required",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--disable-blink-features=AutomationControlled",
        "--ignore-certificate-errors",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    job.status = "loading_page";
    job.progress = 25;
    job.logs.push(`[${new Date().toLocaleTimeString()}] Membuka halaman target: ${job.url}`);

    const page = await browser.newPage();
    await page.setBypassCSP(true);

    const isMobile = job.format === "9:16" || job.format === "4:5" || job.deviceMockup === "mockup-phone";
    await page.setUserAgent(
      isMobile
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    );

    const autoLaunchCfg = {
      autoStart: true,
      videoFormat: job.format,
      showcasePreset: job.preset,
      launchScope: job.scope,
      motionMode: job.mode === "motion",
      theme: job.theme,
      speed: Number(job.speed) || 1.5,
      cameraZoom: false,
      dofEnabled: false,
      counterRoll: true,
      autoRecord: false,
      bgm: job.bgm || "lofi",
      customHookText: job.customHookText || "",
      targetDuration: job.targetDuration || "30s",
      deviceMockup: job.deviceMockup || "flat",
      tourFeatureCount: job.tourFeatureCount || 5,
      tourNiche: job.tourNiche || "auto",
      tourLanguage: job.tourLanguage || "id",
      tourOverlay: job.tourOverlay || "full",
      ghostMode: !!job.ghost,
      terminalVisible: !!job.terminal,
      watermark: job.watermark || "none",
      audioBalance: job.audioBalance || "balanced",
    };

    await page.evaluateOnNewDocument((cfg, serverPort) => {
      window.__rebuildrServerOrigin = `http://localhost:${serverPort}`;
      window.__rebuildrAutoLaunch = cfg;
      document.addEventListener("DOMContentLoaded", () => {
        if (document.body) document.body.dataset.fullscreenRender = "true";
      });
    }, autoLaunchCfg, PORT);

    page.on("console", (msg) => {
      const txt = msg.text();
      if (txt.includes("[SWARM]") || txt.includes("ai director") || txt.includes("rebuildr")) {
        job.logs.push(`[${new Date().toLocaleTimeString()}] ${txt}`);
      }
    });

    // Resolve internal/relative URL if needed
    let targetUrl = job.url.trim();
    if (!/^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith("/")) {
      targetUrl = `https://${targetUrl}`;
    }
    if (targetUrl.startsWith("/")) {
      targetUrl = `http://localhost:${PORT}${targetUrl}`;
    }

    try {
      await page.goto(targetUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      // Settle initial webfonts & styles and smart wait for SPA hydration
      await page.waitForFunction(
        () => {
          const body = document.body;
          if (!body) return false;
          const text = body.innerText ? body.innerText.trim() : "";
          const els = body.querySelectorAll("img, svg, button, a, h1, h2, h3, p");
          return text.length > 30 || els.length > 5;
        },
        { timeout: 8000 }
      ).catch(() => {});
      await new Promise((r) => setTimeout(r, 1500));
    } catch (navErr) {
      const hasBody = await page.evaluate(() => !!document.body).catch(() => false);
      if (!hasBody) {
        throw new Error(`Gagal membuka halaman: ${navErr.message}`);
      }
      job.logs.push(
        `[${new Date().toLocaleTimeString()}] Peringatan jaringan: Beberapa aset eksternal masih memuat, namun struktur DOM berhasil diakses.`
      );
    }

    if (isMobile) {
      await page.evaluate(() => {
        if (!document.getElementById("rebuildr-mobile-scroll-shield")) {
          const st = document.createElement("style");
          st.id = "rebuildr-mobile-scroll-shield";
          st.textContent = `
            html, body, * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
            ::-webkit-scrollbar, *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
            html, body { overflow-x: hidden !important; max-width: 100vw !important; }
          `;
          (document.head || document.documentElement).appendChild(st);
        }
      }).catch(() => {});
    }

    job.status = "analyzing_page";
    job.progress = 40;
    job.logs.push(
      `[${new Date().toLocaleTimeString()}] Menganalisis DOM halaman (Format: ${job.format}, Preset: ${job.preset}, Scope: ${job.scope})...`
    );

    // Generate clean slug for dynamic filenames (rebuildr-<domain>-<ratio>-<preset>.mp4/gif)
    let hostSlug = "showcase";
    try {
      if (job.url.startsWith("/proxy")) {
        const proxyParsed = new URL(job.url, `http://localhost:${PORT}`);
        const innerUrl = proxyParsed.searchParams.get("url") || "";
        if (innerUrl.startsWith("/")) {
          hostSlug = innerUrl.replace(/^\//, "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "showcase";
        } else if (innerUrl) {
          const u = new URL(innerUrl.startsWith("http") ? innerUrl : `https://${innerUrl}`);
          hostSlug = u.hostname.replace(/^www\./, "").replace(/[^a-zA-Z0-9_-]/g, "-");
        }
      } else if (job.url.startsWith("/")) {
        hostSlug = job.url.replace(/^\//, "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "showcase";
      } else {
        const u = new URL(job.url.startsWith("http") ? job.url : `https://${job.url}`);
        hostSlug = u.hostname.replace(/^www\./, "").replace(/[^a-zA-Z0-9_-]/g, "-");
      }
    } catch (_) {}
    const ratioSlug = (job.format || "16-9").replace(":", "-");
    const presetSlug = (job.preset || "tour").replace(/[^a-zA-Z0-9_-]/g, "-");

    // Prepare HD Video Pipelines via Chrome DevTools Protocol Screencast
    const { spawn } = require("child_process");
    const rawVideoPath = path.join(EXPORTS_DIR, `raw-${job.id}.mp4`);
    const finalMp4Name = `rebuildr-${hostSlug}-${ratioSlug}-${presetSlug}.mp4`;
    const finalMp4Path = path.join(EXPORTS_DIR, finalMp4Name);

    ffmpegProc = spawn("ffmpeg", [
      "-y",
      "-f", "image2pipe",
      "-vcodec", "mjpeg",
      "-framerate", "30",
      "-i", "-",
      "-vf", `scale=${targetWidth}:${targetHeight}:flags=lanczos`,
      "-c:v", "libx264",
      "-r", "60",
      "-pix_fmt", "yuv420p",
      "-preset", "veryfast",
      "-crf", "18",
      "-movflags", "+faststart",
      rawVideoPath,
    ]);

    ffmpegProc.on("error", (err) => {
      console.error("[FFmpeg Process Error]:", err.message);
    });
    if (ffmpegProc.stdin) {
      ffmpegProc.stdin.on("error", () => {});
    }

    client = await page.target().createCDPSession();
    await client.send("Page.startScreencast", {
      format: "jpeg",
      quality: 90,
      maxWidth: targetWidth,
      maxHeight: targetHeight,
      everyNthFrame: 1,
    });

    let recordedFrameCount = 0;
    let latestFrameBuffer = null;

    client.on("Page.screencastFrame", async ({ data, sessionId }) => {
      try {
        latestFrameBuffer = Buffer.from(data, "base64");
        await client.send("Page.screencastFrameAck", { sessionId });
      } catch (_) {}
    });

    // Steady 30FPS real-time frame feeder -> duplicated cleanly to 60FPS by FFmpeg so duration matches 1:1
    frameFeederInterval = setInterval(() => {
      try {
        if (latestFrameBuffer && ffmpegProc && ffmpegProc.stdin && ffmpegProc.stdin.writable) {
          ffmpegProc.stdin.write(latestFrameBuffer);
          recordedFrameCount += 2;
        }
      } catch (_) {}
    }, Math.round(1000 / 30));

    // Read latest swarm.js
    const swarmJsPath = path.join(ROOT_DIR, "swarm.js");
    const swarmCode = fs.readFileSync(swarmJsPath, "utf-8");

    // Configure Auto Launch & Execute Swarm Engine (Bypassing strict CSP / TrustedTypes)
    await page.evaluate((cfg, serverPort) => {
      if (document.body) document.body.dataset.fullscreenRender = "true";
      window.__rebuildrServerOrigin = `http://localhost:${serverPort}`;
      window.__rebuildrAutoLaunch = cfg;
    }, autoLaunchCfg, PORT);

    job.status = "reconstructing";
    job.progress = 55;
    job.logs.push(`[${new Date().toLocaleTimeString()}] 8 Agen AI mulai merakit halaman secara live...`);

    await page.evaluate((code) => {
      try {
        (0, eval)(code);
      } catch (e) {
        console.error("[SWARM EVAL ERROR]", e && e.message);
      }
    }, swarmCode);

    const swarmInjected = await page.evaluate(() => !!window.__swarmRebuild).catch(() => false);
    if (!swarmInjected) {
      await page.addScriptTag({ content: swarmCode }).catch(() => {});
    }

    await page.evaluate(() => {
      if (window.__swarmRebuild && !window.__swarmRebuild.running) {
        window.__swarmRebuild.launchRebuild();
      }
    }).catch(() => {});

    // Wait for reconstruction completion
    const maxWaitMs = 95000;
    const startWait = Date.now();

    while (Date.now() - startWait < maxWaitMs) {
      const state = await page.evaluate(() => {
        return {
          done: !!window.__rebuildrReconstructionDone,
          running: window.__swarmRebuild ? !!window.__swarmRebuild.running : false,
          hasSwarm: !!window.__swarmRebuild,
          hasAudio: !!window.__rebuildrAudioBase64,
        };
      });

      if (state.done) {
        job.logs.push(`[${new Date().toLocaleTimeString()}] Rekonstruksi selesai, menutup sesi rekaman kanvas...`);
        break;
      }

      const elapsed = Date.now() - startWait;
      if (elapsed > 6000 && state.hasSwarm && !state.running) {
        job.logs.push(`[${new Date().toLocaleTimeString()}] Animasi selesai, memfinalisasi stream video...`);
        break;
      }

      // Progressively update job progress
      const progressRatio = Math.min(0.92, 0.55 + (elapsed / 40000) * 0.37);
      job.progress = Math.round(progressRatio * 100);

      await new Promise((r) => setTimeout(r, 500));
    }

    // Stop frame feeder and screencast
    if (frameFeederInterval) {
      clearInterval(frameFeederInterval);
      frameFeederInterval = null;
    }
    try {
      await client.send("Page.stopScreencast");
    } catch (_) {}

    if (ffmpegProc && ffmpegProc.stdin) {
      ffmpegProc.stdin.end();
      await new Promise((resolve) => ffmpegProc.on("close", resolve));
    }

    job.status = "encoding_video";
    job.progress = 94;
    job.logs.push(`[${new Date().toLocaleTimeString()}] Memproses file video keluaran (Total: ${recordedFrameCount} frame HD)...`);

    // Check if procedural WebAudio synth was captured
    const audioData = await page.evaluate(() => window.__rebuildrAudioBase64 || null).catch(() => null);

    if (audioData && fs.existsSync(rawVideoPath)) {
      const audioPath = path.join(EXPORTS_DIR, `audio-${job.id}.webm`);
      const audioBuf = Buffer.from(audioData.replace(/^data:audio\/[a-z0-9]+;base64,/, ""), "base64");
      fs.writeFileSync(audioPath, audioBuf);

      // Mux video + audio with ffmpeg
      const { execSync } = require("child_process");
      try {
        execSync(`ffmpeg -y -i "${rawVideoPath}" -i "${audioPath}" -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest "${finalMp4Path}"`, { stdio: "ignore" });
        try { fs.unlinkSync(rawVideoPath); fs.unlinkSync(audioPath); } catch (_) {}
      } catch (_) {
        // Fallback to raw video if audio mux fails
        if (fs.existsSync(rawVideoPath)) fs.renameSync(rawVideoPath, finalMp4Path);
      }
    } else if (fs.existsSync(rawVideoPath)) {
      fs.renameSync(rawVideoPath, finalMp4Path);
    }

    // Generate optimized GIF with clean dynamic naming
    const finalGifName = `rebuildr-${hostSlug}-${ratioSlug}-${presetSlug}.gif`;
    const finalGifPath = path.join(EXPORTS_DIR, finalGifName);
    try {
      if (fs.existsSync(finalMp4Path)) {
        job.logs.push(`[${new Date().toLocaleTimeString()}] Menghasilkan animasi GIF teroptimasi (Lanczos 14FPS)...`);
        const { execSync } = require("child_process");
        const gifCmd = `ffmpeg -y -ss 00:00:01 -t 7 -i "${finalMp4Path}" -vf "fps=14,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" "${finalGifPath}"`;
        execSync(gifCmd, { stdio: "ignore" });
        if (fs.existsSync(finalGifPath)) {
          job.gifUrl = `/exports/${finalGifName}`;
          job.gifFilename = finalGifName;
          job.logs.push(`[${new Date().toLocaleTimeString()}] ✓ GIF Animasi berhasil dibuat (${(fs.statSync(finalGifPath).size / 1024 / 1024).toFixed(2)} MB)!`);
        }
      }
    } catch (gifErr) {
      job.logs.push(`[${new Date().toLocaleTimeString()}] Info: Ekspor GIF dilewati (${gifErr.message})`);
    }

    job.status = "completed";
    job.progress = 100;
    job.filename = finalMp4Name;
    job.videoUrl = `/exports/${finalMp4Name}`;
    job.logs.push(`[${new Date().toLocaleTimeString()}] Selesai 100%! Video HD 60FPS siap di-download.`);
  } catch (err) {
    job.status = "failed";
    job.error = err.message || "Gagal merender video.";
    job.logs.push(`[${new Date().toLocaleTimeString()}] ERROR: ${err.message}`);
  } finally {
    if (frameFeederInterval) {
      clearInterval(frameFeederInterval);
      frameFeederInterval = null;
    }
    if (browser) {
      try {
        await browser.close();
      } catch (_) {}
    }
    activeJobsCount = Math.max(0, activeJobsCount - 1);
    processNextInQueue();
  }
}

// ---------------------------------------------------------------------------
// 2. HTTP SERVER & REVERSE PROXY
// ---------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || `localhost:${PORT}`}`);
  const pathname = reqUrl.pathname;
  const parsedQuery = Object.fromEntries(reqUrl.searchParams.entries());

  // CORS headers for all responses
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // -------------------------------------------------------------------------
  // Route A: Serve swarm.js
  // -------------------------------------------------------------------------
  if (pathname === "/swarm.js") {
    const filePath = path.join(ROOT_DIR, "swarm.js");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("swarm.js not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8" });
      res.end(data);
    });
    return;
  }

  // -------------------------------------------------------------------------
  // Route B: Serve Local SaaS Showcase Template
  // -------------------------------------------------------------------------
  if (pathname === "/showcase-saas.html") {
    const filePath = path.join(ROOT_DIR, "showcase-saas.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
    return;
  }

  // -------------------------------------------------------------------------
  // Route C: Reverse Proxy Endpoint (/proxy?url=...)
  // -------------------------------------------------------------------------
  if (pathname === "/proxy") {
    const targetUrl = parsedQuery.url;
    if (!targetUrl) {
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h3>Missing ?url= parameter</h3>");
      return;
    }

    try {
      let finalTarget = targetUrl.trim();
      if (!/^https?:\/\//i.test(finalTarget) && !finalTarget.startsWith("/")) {
        finalTarget = `https://${finalTarget}`;
      }
      if (finalTarget.startsWith("/")) {
        finalTarget = `http://localhost:${PORT}${finalTarget}`;
      }

      const ssrfCheck = await validateUrlForSSRF(finalTarget);
      if (!ssrfCheck.valid) {
        res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({
          error: "SSRF_BLOCKED",
          message: ssrfCheck.error,
        }));
        return;
      }

      const parsedTarget = new URL(finalTarget);
      const origin = parsedTarget.origin;
      const isMobileFormat = parsedQuery.format === "9:16" || parsedQuery.format === "4:5" || parsedQuery.deviceMockup === "mockup-phone";

      const fetchRes = await fetch(finalTarget, {
        headers: {
          "User-Agent": isMobileFormat
            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        },
        redirect: "follow",
      });

      const contentType = fetchRes.headers.get("content-type") || "text/html";

      if (!contentType.includes("text/html")) {
        // Stream non-HTML asset straight through
        const buf = Buffer.from(await fetchRes.arrayBuffer());
        res.writeHead(fetchRes.status, { "Content-Type": contentType });
        res.end(buf);
        return;
      }

      let html = await fetchRes.text();

      // Extract config parameters from query
      const cfg = {
        autoStart: parsedQuery.autoStart === "1" || parsedQuery.autoStart === "true",
        videoFormat: parsedQuery.format || "16:9",
        showcasePreset: parsedQuery.preset || "feature-tour",
        launchScope: parsedQuery.scope || "full",
        motionMode: parsedQuery.mode === "motion",
        theme: parsedQuery.theme || "figma",
        speed: Number(parsedQuery.speed) || 1,
        cameraZoom: false,
        dofEnabled: false,
        counterRoll: true,
        autoRecord: parsedQuery.autoRecord === "1",
        bgm: parsedQuery.bgm || "lofi",
        customHookText: parsedQuery.customHookText || "",
        targetDuration: parsedQuery.targetDuration || "30s",
        deviceMockup: parsedQuery.deviceMockup || "flat",
        tourFeatureCount: parsedQuery.tourCount === "all" ? 99 : (Number(parsedQuery.tourCount) || 5),
        tourNiche: parsedQuery.tourNiche || "auto",
        tourLanguage: parsedQuery.tourLang || "id",
        tourOverlay: parsedQuery.tourOverlay || "full",
        ghostMode: parsedQuery.ghost === "1" || parsedQuery.ghost === "true",
        terminalVisible: parsedQuery.terminal === "1" || parsedQuery.terminal === "true",
        watermark: parsedQuery.watermark || "none",
        audioBalance: parsedQuery.audioBalance || "balanced",
      };

      // Strip existing frame-busting scripts, CSP, X-Frame-Options, refresh, and beforeunload tags
      html = html.replace(/<meta[^>]*http-equiv=["']?content-security-policy["']?[^>]*>/gi, "");
      html = html.replace(/<meta[^>]*http-equiv=["']?x-frame-options["']?[^>]*>/gi, "");
      html = html.replace(/<meta[^>]*http-equiv=["']?refresh["']?[^>]*>/gi, "");
      html = html.replace(/if\s*\(top\s*!==\s*self\)[^}]+}/gi, "");
      html = html.replace(/top\.location/g, "window.__fakeTopLocation");
      html = html.replace(/window\.top/g, "window.self");
      html = html.replace(/\bon(beforeunload|unload)=["'][^"']*["']/gi, "");

      // Neutralize native form submission navigations on proxied external pages
      html = html.replace(/<form\b([^>]*)>/gi, '<form$1 onsubmit="return false;" action="javascript:void(0);">');

      // Neutralize native link navigations completely so external pages never navigate away and trigger X-Frame-Options blocks
      html = html.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
        let cleanAttrs = attrs.replace(/\btarget=["'][^"']*["']/gi, 'target="_self"');
        cleanAttrs = cleanAttrs.replace(/\bhref=["']([^"']*)["']/gi, 'data-rebuildr-href="$1" href="javascript:void(0);"');
        return `<a ${cleanAttrs} onclick="return false;">`;
      });

      // Add no-referrer policy to images so hotlinking is not blocked & convert lazy-loading to eager
      html = html.replace(/<img\b([^>]*)loading=["']lazy["']([^>]*)>/gi, '<img$1loading="eager"$2>');
      html = html.replace(/<img\b([^>]*)>/gi, '<img$1 referrerpolicy="no-referrer">');

      const hostHeader = req.headers.host || `localhost:${PORT}`;
      const selfOrigin = `http://${hostHeader}`;
      const isLocalTarget = finalTarget.startsWith("http://localhost") || finalTarget.startsWith("http://127.0.0.1");

      // Injection scripts: Set Base URL for external sites + Prevent link navigation + Inject swarm.js
      const injectHtml = `
        ${isLocalTarget ? "" : `<base href="${finalTarget}">`}
        <meta name="referrer" content="no-referrer">
        ${isMobileFormat ? `<meta name="viewport" content="width=390, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">` : ""}
        <style id="rebuildr-mobile-scroll-shield">
          :root {
            color-scheme: dark !important;
          }
          /* Eliminate harsh desktop scrollbar in mobile formats / phone view */
          ${isMobileFormat ? `
            html, body, * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            ::-webkit-scrollbar,
            *::-webkit-scrollbar,
            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
            html, body {
              overflow-x: hidden !important;
              width: 100% !important;
              max-width: 100vw !important;
              box-sizing: border-box !important;
            }
            /* Universal Mobile Text & Headline Shield (Zero Horizontal Cutoffs) */
            h1, [class*="h1" i], [class*="Heading--1" i], [class*="hero" i] h1, .intro-title {
              max-width: 100% !important;
              overflow-wrap: break-word !important;
              word-break: normal !important;
              white-space: normal !important;
              font-size: min(28px, 7.5vw) !important;
              line-height: 1.25 !important;
              box-sizing: border-box !important;
            }
            .line, [class*="line" i] {
              max-width: 100% !important;
              overflow-wrap: break-word !important;
              word-break: normal !important;
              white-space: normal !important;
              display: inline !important;
              box-sizing: border-box !important;
            }
            .word, [class*="word" i] {
              max-width: 100% !important;
              white-space: normal !important;
              display: inline !important;
              box-sizing: border-box !important;
            }
            h2, [class*="h2" i] {
              max-width: 100% !important;
              white-space: normal !important;
              overflow-wrap: break-word !important;
              font-size: min(24px, 6.5vw) !important;
              box-sizing: border-box !important;
            }
            h3, [class*="h3" i] {
              max-width: 100% !important;
              white-space: normal !important;
              overflow-wrap: break-word !important;
              font-size: min(20px, 5.5vw) !important;
              box-sizing: border-box !important;
            }
            header, nav, section, main, footer, .container, [class*="container" i], [class*="wrapper" i] {
              max-width: 100% !important;
              box-sizing: border-box !important;
            }
            [class*="hero" i] [class*="flex" i], [class*="hero" i] [class*="row" i] {
              flex-wrap: wrap !important;
            }
          ` : `
            ::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            ::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 9999px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.38);
            }
          `}
        </style>
        <script>
          window.__rebuildrAutoLaunch = ${JSON.stringify(cfg)};
          window.__rebuildrIsProxy = true;
          document.addEventListener("DOMContentLoaded", () => {
            if (document.body) document.body.dataset.fullscreenRender = "true";
          });

          // 1. Defuse frame busters & window navigation
          window.top = window.self;
          window.parent = window.self;
          try {
            window.location.assign = function() { console.log("[SAFE] location.assign blocked"); };
            window.location.replace = function() { console.log("[SAFE] location.replace blocked"); };
            window.location.reload = function() { console.log("[SAFE] location.reload blocked"); };
            window.open = function() { console.log("[SAFE] window.open blocked"); return null; };
          } catch (_) {}

          // 2. Disable Turbo / PJAX / client routers
          try {
            window.Turbo = { session: { drive: false } };
            document.addEventListener("turbo:before-visit", function(e) { e.preventDefault(); }, true);
            document.addEventListener("turbo:click", function(e) { e.preventDefault(); }, true);
            document.addEventListener("pjax:beforeSend", function(e) { e.preventDefault(); }, true);
            if (window.history) {
              window.history.pushState = function() {};
              window.history.replaceState = function() {};
            }
          } catch (_) {}

          // 3. Unregister service workers so they don't break the proxy
          try {
            if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
              navigator.serviceWorker.getRegistrations().then(regs => {
                for (let r of regs) r.unregister();
              });
            }
          } catch (_) {}

          // 4. Block programmatic form submissions
          try {
            HTMLFormElement.prototype.submit = function() {
              console.log("[SAFE] form.submit() blocked in studio mode");
              return false;
            };
          } catch (_) {}

          // 5. Intercept interactive clicks & form submits globally in capture phase
          const blockNav = (e) => {
            const interactive = e.target.closest("a, [role='link'], button, input[type='submit'], input[type='button'], [role='button']");
            if (interactive) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return false;
            }
          };
          window.addEventListener("click", blockNav, true);
          document.addEventListener("click", blockNav, true);
          window.addEventListener("submit", (e) => { e.preventDefault(); e.stopPropagation(); return false; }, true);
          document.addEventListener("submit", (e) => { e.preventDefault(); e.stopPropagation(); return false; }, true);

          // 6. Defuse "Keluar dari situs?" (beforeunload / unload dialogs) permanently & irrevocably
          try {
            Object.defineProperty(window, "onbeforeunload", {
              get: function() { return null; },
              set: function() {},
              configurable: false
            });
            Object.defineProperty(window, "onunload", {
              get: function() { return null; },
              set: function() {},
              configurable: false
            });
            Object.defineProperty(document, "onbeforeunload", {
              get: function() { return null; },
              set: function() {},
              configurable: false
            });
            const _origAddEvt = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
              if (type === "beforeunload" || type === "unload") return;
              return _origAddEvt.call(this, type, listener, options);
            };
          } catch (_) {}
        </script>
        <script src="${selfOrigin}/swarm.js" defer></script>
      `;

      if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/<head[^>]*>/i, (match) => `${match}\n${injectHtml}`);
      } else {
        html = `${injectHtml}\n${html}`;
      }

      if (isMobileFormat) {
        const bottomShield = `<style id="rebuildr-bottom-mobile-shield">
          html, body, * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
          *::-webkit-scrollbar, html::-webkit-scrollbar, body::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; background: transparent !important; }
          h1, [class*="h1" i], [class*="Heading--1" i], [class*="hero" i] h1, .intro-title { max-width: 100% !important; overflow-wrap: break-word !important; word-break: normal !important; white-space: normal !important; font-size: min(28px, 7.5vw) !important; line-height: 1.25 !important; }
          .line, [class*="line" i] { max-width: 100% !important; overflow-wrap: break-word !important; word-break: normal !important; white-space: normal !important; display: inline !important; }
          .word, [class*="word" i] { max-width: 100% !important; white-space: normal !important; display: inline !important; }
          body, html { overflow-x: hidden !important; width: 100% !important; max-width: 100vw !important; }
        </style>`;
        if (/<\/body>/i.test(html)) {
          html = html.replace(/<\/body>/i, `${bottomShield}</body>`);
        } else {
          html += bottomShield;
        }
      }

      // Allow framing in iframe without illegal headers
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Content-Security-Policy": "frame-ancestors 'self' http://localhost:* http://127.0.0.1:* *",
      });
      res.end(html);
    } catch (err) {
      res.writeHead(502, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`
        <div style="font-family: sans-serif; padding: 32px; background: #0f172a; color: #f8fafc; border-radius: 12px; margin: 20px;">
          <h2 style="color: #f43f5e;">⚡ Tidak dapat memuat URL target</h2>
          <p>${err.message}</p>
          <p style="color: #94a3b8; font-size: 13px;">Pastikan website dapat diakses publik, atau coba gunakan preset sampel bawaan.</p>
        </div>
      `);
    }
    return;
  }

  // -------------------------------------------------------------------------
  // Route TTS: GET /api/tts?text=...&lang=id (Neural HD Voiceover)
  // -------------------------------------------------------------------------
  if (pathname === "/api/tts" && (req.method === "GET" || req.method === "HEAD")) {
    const text = parsedQuery.text || "";
    const lang = (parsedQuery.lang || "id").toLowerCase().startsWith("en") ? "en" : "id";

    if (!text.trim()) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing text parameter" }));
      return;
    }

    try {
      const audioBuffer = await getNeuralTtsAudio(text, lang);
      if (!audioBuffer) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No voice generated" }));
        return;
      }

      res.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length,
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
        "Accept-Ranges": "bytes"
      });
      res.end(audioBuffer);
    } catch (err) {
      console.warn("[TTS] Error generating neural audio:", err.message);
      res.writeHead(502, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify({ error: "TTS generation failed", message: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // Route D: POST /api/render (Trigger Auto Cloud Video Generator)
  // -------------------------------------------------------------------------
  if (pathname === "/api/render" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const data = JSON.parse(body || "{}");
        if (!data.url) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "URL website wajib diisi" }));
          return;
        }

        let targetUrl = data.url.trim();
        if (!/^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith("/")) {
          targetUrl = `https://${targetUrl}`;
        }
        if (targetUrl.startsWith("/")) {
          targetUrl = `http://localhost:${PORT}${targetUrl}`;
        }

        const ssrfCheck = await validateUrlForSSRF(targetUrl);
        if (!ssrfCheck.valid) {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: `SSRF Protection: ${ssrfCheck.error}` }));
          return;
        }

        const jobId = `job_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
        const job = {
          id: jobId,
          url: data.url.trim(),
          format: data.format || "9:16",
          preset: data.preset || "feature-tour",
          mode: data.mode || "motion",
          scope: data.scope || "curated",
          theme: data.theme || "figma",
          speed: data.speed || 1.5,
          bgm: data.bgm || "lofi",
          customHookText: data.customHookText || "",
          targetDuration: data.targetDuration || "30s",
          deviceMockup: data.deviceMockup || "flat",
          tourFeatureCount: data.tourCount === "all" ? 99 : (Number(data.tourCount) || 5),
          tourNiche: data.tourNiche || "auto",
          tourLanguage: data.tourLang || "id",
          tourOverlay: data.tourOverlay || "full",
          ghost: !!data.ghost,
          terminal: data.terminal === true || data.terminal === "true",
          watermark: data.watermark || "none",
          audioBalance: data.audioBalance || "balanced",
          status: "queued",
          progress: 5,
          logs: [`[${new Date().toLocaleTimeString()}] Permintaan diterima untuk: ${data.url}`],
          videoUrl: null,
          filename: null,
          gifUrl: null,
          gifFilename: null,
          queuePos: 1,
          createdAt: Date.now(),
        };

        jobs.set(jobId, job);
        enqueueRenderJob(job);

        res.writeHead(202, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, jobId, message: "Job sedang diproses" }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Payload JSON tidak valid" }));
      }
    });
    return;
  }

  // -------------------------------------------------------------------------
  // Route E: GET /api/jobs/:id (Poll Render Status & Logs)
  // -------------------------------------------------------------------------
  if (pathname.startsWith("/api/jobs/")) {
    const id = pathname.replace("/api/jobs/", "").trim();
    const job = jobs.get(id);
    if (!job) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Job tidak ditemukan" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(job));
    return;
  }

  // -------------------------------------------------------------------------
  // Route F: GET /api/presets (Curated Demo Showcase URLs)
  // -------------------------------------------------------------------------
  if (pathname === "/api/presets") {
    const presets = [
      {
        id: "pulse-saas",
        name: "⚡ PULSE AI Cloud (Template Bawaan)",
        url: "/showcase-saas.html",
        badge: "Internal Demo",
        description: "Landing page SaaS neural modern dengan kartu metrik & bento grid.",
      },
      {
        id: "linear",
        name: "Linear App (Issue Tracker)",
        url: "https://linear.app",
        badge: "Popular SaaS",
        description: "Desain minimalis modern dengan animasi typography tajam.",
      },
      {
        id: "stripe",
        name: "Stripe Payment Infrastructure",
        url: "https://stripe.com",
        badge: "Fintech Leader",
        description: "Landing page kelas dunia dengan gradien mesh dan kartu produk dinamis.",
      },
      {
        id: "github",
        name: "GitHub Universe",
        url: "https://github.com",
        badge: "Developer Hub",
        description: "Arsitektur dark-mode futuristik dengan berbagai blok fitur.",
      },
    ];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(presets));
    return;
  }

  // -------------------------------------------------------------------------
  // Route G: Static Files & Page Routing (/studio -> studio.html, / -> index.html)
  // -------------------------------------------------------------------------
  let filePath;
  if (pathname === "/" || pathname === "/index.html") {
    filePath = path.join(PUBLIC_DIR, "index.html");
  } else if (pathname === "/studio" || pathname === "/studio/") {
    filePath = path.join(PUBLIC_DIR, "studio.html");
  } else {
    filePath = path.join(PUBLIC_DIR, pathname);
  }

  // Normalize path security
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const totalSize = stats.size;
    const range = req.headers.range;

    // HTTP 206 Partial Content support for smooth browser HTML5 video streaming & seeking
    if (range && (ext === ".mp4" || ext === ".webm")) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start >= totalSize || end >= totalSize) {
        res.writeHead(416, {
          "Content-Range": `bytes */${totalSize}`,
        });
        res.end();
        return;
      }

      const chunkSize = end - start + 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${totalSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.on("error", (sErr) => {
        console.error("[STREAM ERROR]", sErr.message);
        if (!res.headersSent) { res.writeHead(500); res.end(); }
      });
      res.on("close", () => {
        try { stream.destroy(); } catch (_) {}
      });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": totalSize,
        "Accept-Ranges": "bytes",
        "Content-Type": contentType,
      });
      const stream = fs.createReadStream(filePath);
      stream.on("error", (sErr) => {
        console.error("[STREAM ERROR]", sErr.message);
        if (!res.headersSent) { res.writeHead(500); res.end(); }
      });
      res.on("close", () => {
        try { stream.destroy(); } catch (_) {}
      });
      stream.pipe(res);
    }
  });
});

process.on("uncaughtException", (err) => {
  console.error("[CRITICAL] Uncaught exception:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("[CRITICAL] Unhandled rejection:", reason);
});

server.listen(PORT, () => {
  console.log(`\n=======================================================`);
  console.log(`⚡ REBUILDR WEB STUDIO — ACTIVE AT: http://localhost:${PORT}`);
  console.log(`=======================================================`);
  console.log(`Chrome Binary: ${CHROME_PATH || "NOT FOUND"}`);
  console.log(`Ready for URL submission, live studio & automated video generation!\n`);
});
