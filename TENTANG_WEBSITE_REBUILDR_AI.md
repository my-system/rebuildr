# 🌐 DOKUMENTASI LENGKAP: TENTANG WEBSITE REBUILDR AI
### Penjelasan Konsep, Arsitektur Sistem, Struktur Proyek, dan Fitur Utama
*Dokumen ini disusun untuk menjelaskan secara menyeluruh tentang sistem website REBUILDR AI (v3.6) sebagai acuan konsep, presentasi, dan materi pembuatan konten.*

---

## 📑 DAFTAR ISI
1. [Tentang Website Ini (Konsep & Masalah yang Dipecahkan)](#1-tentang-website-ini-konsep--masalah-yang-dipecahkan)
2. [Arsitektur Sistem (Dual-Platform Deployment)](#2-arsitektur-sistem-dual-platform-deployment)
3. [Struktur File & Direktori Proyek](#3-struktur-file--direktori-proyek)
4. [Katalog Fitur Utama & Mekanisme Kerja](#4-katalog-fitur-utama--mekanisme-kerja)
5. [Spesifikasi Teknis & Output Perekaman (60FPS Pipeline)](#5-spesifikasi-teknis--output-perekaman-60fps-pipeline)
6. [Daftar Pintasan Tombol (Keyboard Shortcuts)](#6-daftar-pintasan-tombol-keyboard-shortcuts)

---

## 1. TENTANG WEBSITE INI (KONSEP & MASALAH YANG DIPECAHKAN)

### 1.1 Apa Itu Rebuildr AI?
**REBUILDR AI (Rebuildr Studio v3.6)** adalah platform otomasi pembuatan video *motion graphics* berbasis web yang revolusioner. 

Platform ini mampu **mengambil tautan (URL) dari website apa pun**, mendekonstruksi (membongkar) seluruh elemen tampilan website (*live DOM - Document Object Model*) menjadi kanvas kosong, kemudian **merekonstruksinya (merakitnya kembali) secara bertahap dan kinetik** menggunakan simulasi **8 kursor AI kolaboratif** atau mode mandiri (**Ghost Self-Building Mode**), lalu merekam seluruh aksinya menjadi video berkualitas broadcast **60 FPS MP4 / GIF**.

```
+-------------------------------------------------------------------------------+
|                       CARA KERJA SEDERHANA REBUILDR                           |
+-------------------------------------------------------------------------------+
|                                                                               |
|  [ Input URL Website ]  ──>  [ Bongkar Live DOM ]  ──>  [ Dirakit 8 Kursor AI ]|
|   (cth: linear.app)         (Kanvas jadi kosong)       (Wireframe & Typing)   |
|                                                                  │            |
|                                                                  ▼            |
|  [ Video Promosi 60 FPS Siap Tayang ]  ◀───  [ Headless Chrome + FFmpeg Pipe ]|
|   (Reels / TikTok / YouTube / GIF)                                            |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 1.2 Masalah Nyata yang Dipecahkan (The Problem)
Sebelum adanya Rebuildr, membuat video animasi pamer produk atau portofolio website memiliki banyak kendala:
1. **Waktu Produksi Sangat Lama:** Mengedit manual di Adobe After Effects, Premiere Pro, atau Blender membutuhkan waktu 4 hingga 12 jam per video (memotong aset UI, membuat keyframe posisi kursor satu per satu, masking tombol, dan menganimasikan ketikan teks).
2. **Keterbatasan Keahlian:** Banyak developer dan desainer web tidak menguasai software motion graphic profesional.
3. **Desain Cepat Basi:** Setiap kali ada update tombol atau revisi desain di website, video promosi lama harus dibuat ulang dari awal (*render ulang keyframe*).

### 1.3 Solusi dari Rebuildr AI (The Solution)
Hanya dengan **1 klik atau menempelkan link website**:
* Website dianalisis secara instan.
* Elemen antarmuka digambar otomatis mulai dari wireframe, poligon SVG, teks yang mengetik sendiri, hingga angka metrik yang berputar.
* Kamera bergerak secara sinematik (*Dolly Zoom*, *Bokeh*, *Tilt*).
* Dilengkapi audio synthesizer prosedural yang menghasilkan efek suara mekanik (*clicks, pops, whooshes*) dan ketukan musik Lo-Fi secara *real-time*.
* Langsung diekspor menjadi video **MP4 60FPS** beresolusi tinggi yang siap diunggah ke TikTok, Instagram Reels, atau YouTube Shorts.

---

## 2. ARSITEKTUR SISTEM (DUAL-PLATFORM DEPLOYMENT)

Rebuildr dibangun dengan fleksibilitas tinggi menggunakan dua mode operasional:

```mermaid
graph TD
    User([Pengguna / Kreator]) --> Choice{Pilih Akses}
    
    %% Mode 1
    Choice -->|Buka Tab Browser Aktif| Ext[Mode A: Chrome Extension Manifest v3]
    Ext --> ExtShort[Pintasan Alt + Shift + S]
    ExtShort --> ExtInject[Injeksi background.js -> swarm.js]
    ExtInject --> ExtRec[HTML5 MediaRecorder API Tab Capture 60FPS]
    ExtRec --> WebmDown[Ekspor Lokal: File .webm]
    
    %% Mode 2
    Choice -->|Input URL di Web Studio| Web[Mode B: Web Studio Cloud Server]
    Web --> Serv[server.js - Node.js Backend Server]
    Serv --> Proxy[/proxy?url=... : Reverse Proxy Anti-SSRF]
    Proxy --> Iframe[Live Preview Simulator Iframe]
    Serv --> Worker[Puppeteer Core: Headless Chrome Worker]
    Worker --> CDP[Chrome DevTools Protocol Screencast 60FPS]
    CDP --> FFmpeg[FFmpeg Transcoder: H.264 MP4 & Lanczos GIF]
    FFmpeg --> FinalVid[Ekspor Final: rebuildr-job_xxx.mp4]
```

### 2.1 Mode A: Ekstensi Browser Chrome (Manifest v3)
* Berjalan 100% di browser pengguna (*client-side*) tanpa memerlukan server eksternal.
* Pengguna cukup membuka tab website apa pun, lalu menekan pintasan `Alt + Shift + S`.
* Skrip `swarm.js` disuntikkan ke DOM untuk merekam animasi langsung menggunakan HTML5 `MediaRecorder API`.

### 2.2 Mode B: Web Studio & Cloud Render Server
* Layanan berbasis web mandiri bertenaga **Node.js** dan **Puppeteer Core**.
* Pengguna cukup memasukkan URL di input box antarmuka web studio (`public/index.html`).
* Dilengkapi sistem antrean render (`Job Queue`), reverse proxy berkeamanan tinggi, dan pipa encoding video `FFmpeg` 60 FPS langsung di server.

---

## 3. STRUKTUR FILE & DIREKTORI PROYEK

Berikut adalah peta struktur direktori di dalam proyek:

```
D:\VIBE CODING\REBUILD\
│
├── server.js                     -> Backend HTTP server, API proxy, Job Queue, & worker FFmpeg
├── swarm.js                      -> Mesin animasi utama (fisika kursor, dekonstruksi DOM, audio synth)
├── showcase-saas.html            -> Halaman Landing Showcase interaktif Rebuildr AI
├── background.js                 -> Background service worker untuk Google Chrome Extension
├── manifest.json                 -> Konfigurasi Chrome Extension Manifest v3
├── package.json                  -> Dependensi proyek (puppeteer-core)
│
├── public/                       -> Frontend Web Studio Workbench
│   ├── index.html                -> Antarmuka Web Studio berdesain Glassmorphism
│   ├── app.css                   -> Desain sistem UI dark mode, bento grid, & efek blur kaca
│   └── app.js                    -> Logika state antarmuka, kontrol iframe, & polling status render
│
├── visual-assets/                -> Aset visual branding dan motion graphic
│   ├── 01-branding/              -> Logo dan icon Rebuildr SVG
│   ├── 02-cursors/               -> 8 aset kursor AI berformat SVG dengan nama badge masing-masing
│   ├── 03-frames-mockups/        -> Vektor mockup MacBook, iPhone 15 Pro, & mini terminal
│   ├── 04-motion-cards/          -> Komponen kartu grafis, hook title, dan badge CTA
│   └── 05-backgrounds/           -> Background hero sinematik & grid blueprint pattern
│
├── assets/                       -> Hasil export demo video GIF 16:9 dan 9:16
└── icons/                        -> Ikon ekstensi Chrome berbagai ukuran (16px, 48px, 128px)
```

---

## 4. KATALOG FITUR UTAMA & MEKANISME KERJA

### 4.1 8-Agent AI Multiplayer Swarm
Rebuildr mensimulasikan sekelompok 8 agen AI yang bekerja bersama merakit halaman web secara simultan. Setiap agen memiliki warna, lencana nama, dan tanggung jawab khusus:

| Nama Agen | Warna Badge | Peran & Tanggung Jawab dalam Animasi |
| :--- | :--- | :--- |
| **Lead Dev** | `#6366F1` (Indigo) | Memandu navigasi utama, struktur header, dan arsitektur layout. |
| **Copywriter** | `#EC4899` (Pink) | Mengetik teks headline dan sub-headline huruf demi huruf (*typing effect*). |
| **Figma Vector** | `#F59E0B` (Amber) | Menggambar garis wireframe bersumbu dinamis dan tata letak kontainer. |
| **WebGL Polygon** | `#10B981` (Emerald) | Melakukan triangulasi poligon dan memunculkan bentuk visual geometris. |
| **GSAP Motion** | `#3B82F6` (Blue) | Menganimasikan pergerakan kartu antarmuka, transisi tombol, dan fade. |
| **Data Analytics** | `#8B5CF6` (Purple) | Memutar angka metrik dan statistik dari 0 ke target secara kinetik. |
| **Shader FX** | `#EF4444` (Red) | Memberikan efek cahaya glow, drop shadow, dan gradasi modern. |
| **Audio/Layout** | `#06B6D4` (Cyan) | Menyelaraskan ritme ketukan audio dengan momen klik antarmuka. |

---

### 4.2 Ghost Self-Building Mode (Pintasan `C`)
Jika pengguna tidak ingin melihat kursor yang bergerak, mode **Ghost** dapat diaktifkan:
* Seluruh 8 kursor AI disembunyikan seketika.
* Elemen website tetap merakit dirinya sendiri secara gaib dan elegan: kotak wireframe muncul dari garis tipis, gambar memudar perlahan, dan teks mengetik sendiri.

---

### 4.3 Feature Tour Mode (Solo Hero Presenter)
Selain mode 8 kursor, Rebuildr memiliki mode presentasi solo:
* Satu kursor *hero* tunggal memandu penonton mengelilingi fitur-fitur website secara bertahap.
* Mengarahkan kamera untuk menyorot bagian-bagian penting website secara terarah dan terstruktur.

---

### 4.4 Adaptive Multi-Platform Device Mockups
Rebuildr menyediakan kanvas dengan frame perangkat realistis:
1. **MacBook Pro 16:9 Landscape:** Optimal untuk format desktop YouTube, video pitch deck, dan demo di laptop.
2. **iPhone 15 Pro Titanium 9:16 Vertical:** Dilengkapi bezel tipis dan *Dynamic Island* interaktif, dirancang khusus untuk video vertikal TikTok, Instagram Reels, dan YouTube Shorts.
3. **Square Studio Card 1:1:** Format kotak ideal untuk feed Instagram dan postingan LinkedIn.

---

### 4.5 Procedural Web Audio Engine (Synthesizer Tanpa MP3 Eksternal)
Sistem ini tidak bergantung pada file audio eksternal yang berat. Menggunakan **Web Audio API**, Rebuildr memprogram synthesizer nada langsung di memori:
* Menghasilkan suara *click* mekanik keyboard saat teks diketik.
* Menghasilkan efek *whoosh* saat elemen bergeser cepat.
* Mengiringi presentasi dengan irama musik santai (Lo-Fi atau Synthwave) yang disintesis secara matematis.

---

### 4.6 Keamanan Produksi & Reverse Proxy Anti-SSRF
Untuk mode Web Studio, Rebuildr dilengkapi server proxy cerdas:
* **Anti-SSRF Protection:** Melindungi server dari peretasan dengan memblokir URL yang mengarah ke IP internal/lokal (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`).
* **Defuse Annoyances:** Secara otomatis mematikan dialog pop-up pengganggu seperti *"Are you sure you want to leave this page?"* sehingga proses perekaman video headless tidak pernah terhenti di tengah jalan.

---

## 5. SPESIFIKASI TEKNIS & OUTPUT PEREKAMAN (60FPS PIPELINE)

Perekaman video di Rebuildr menggunakan standar broadcast profesional:

```
[ Headless Chrome ] ──(CDP Screencast JPEG Pipe 60FPS)──> [ FFmpeg Transcoder ]
                                                                   │
                                           ┌───────────────────────┴───────────────────────┐
                                           ▼                                               ▼
                              [ H.264 MP4 Video (CRF 18) ]                    [ Lanczos-Dithered GIF ]
                              Resolusi: 1920x1080 / 1080x1920                 Animasi jernih tanpa banding
```

* **Kecepatan Frame:** 60 FPS (*Frames Per Second*) mentah tanpa interpolasi palsu.
* **Format Video:** MP4 (Video codec: `libx264`, Profil `High 4.2`, Pixel format `yuv420p`, CRF `18`).
* **Format GIF:** Lanczos scaling filter dengan palet 256-warna teroptimasi untuk performa web ringan.
* **Mekanisme Pipa:** Memanfaatkan Chrome DevTools Protocol (`Page.startScreencast`) yang mengalirkan frame JPEG uncompressed langsung ke input stdin proses `ffmpeg`, sehingga hemat memori dan tidak membebani hard disk.

---

## 6. DAFTAR PINTASAN TOMBOL (KEYBOARD SHORTCUTS)

Saat menjalankan mode preview atau ekstensi Rebuildr, pengguna dapat mengontrol animasi secara instan menggunakan keyboard:

| Tombol / Pintasan | Fungsi & Aksi |
| :--- | :--- |
| **`Space`** | Jeda (*Pause*) / Lanjutkan (*Resume*) seluruh timeline animasi. |
| **`C`** | Beralih antara **8-Cursor Swarm Mode** dan **Ghost Self-Building Mode**. |
| **`R`** | Mengulang (*Restart*) seluruh urutan rekonstruksi DOM dari detik 0. |
| **`1`** | Mengubah rasio kanvas ke **16:9 Landscape (MacBook Pro)**. |
| **`2`** | Mengubah rasio kanvas ke **9:16 Vertical (iPhone 15 Pro)**. |
| **`3`** | Mengubah rasio kanvas ke **1:1 Square Card**. |
| **`M`** | Membisukan (*Mute*) atau menyalakan (*Unmute*) Procedural Audio Synthesizer. |
| **`Alt + Shift + S`** | Menjalankan Rebuildr Studio Extension pada tab browser aktif. |

---

*File dokumentasi ini merangkum seluruh fondasi sistem REBUILDR AI v3.6 dan siap digunakan sebagai panduan presentasi, dokumentasi tim, maupun rujukan konten video.*
