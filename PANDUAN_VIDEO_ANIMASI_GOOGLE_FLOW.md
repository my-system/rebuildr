# 🎬 PANDUAN LENGKAP PRODUKSI VIDEO ANIMASI GOOGLE FLOW
### Studi Kasus Nyata: Mengubah Aset Website REBUILDR AI Menjadi Video Animasi 60FPS
**Host / Presenter:** 3D Chibi Toy Figure (Nendoroid Tech Guy)  
**Format Target:** Multi-Platform (16:9 YouTube / 9:16 TikTok, IG Reels, YouTube Shorts)  
**Estimasi Durasi:** 75 – 90 Detik  

---

## 📌 1. PROFIL KARAKTER & SPESIFIKASI ASET (STYLE GUIDE ANCHOR)

Untuk menjaga konsistensi visual di seluruh scene Google Flow (menggunakan engine Google Veo & Imagen), gunakan deskripsi dan parameter hex berikut sebagai acuan *anchor*:

* **Tipe Karakter:** 3D Chibi / Toy Figure / Nendoroid Collectible Aesthetic.
* **Proporsi:** 2.5 Heads Tall, kepala bulat ekspresif dengan mata besar mengkilap.
* **Palette Warna Resmi (Berdasarkan Sheet 01 & Sheet 02):**
  * Rambut: `#2E2D30` (Dark Charcoal Grey, messy-fluffy anime hair).
  * Kulit: `#FCE6D6` (Smooth Peach soft vinyl texture).
  * Mata: `#2B8048` (Vibrant Emerald Green with glossy reflection).
  * Kemeja: `#FFFFFF` (Crisp White collared shirt, rolled sleeves).
  * Celana: `#3D3C40` (Charcoal Black tailored trousers).
  * Sepatu: `#232224` (Matte Dark Grey formal shoes).
  * Aksesori: `#1F1E20` & `#C5A059` (Black leather wristwatch with gold bezel di tangan kiri).

---

## 📋 2. MASTER PROMPT GOOGLE FLOW (CHARACTER CONSISTENCY)

Gunakan master prompt ini sebagai *system prompt* atau *base character description* di Google Flow:

```text
A premium 3D chibi toy figure collectible character, 2.5 heads tall, Nendoroid aesthetic, smooth matte vinyl texture with subtle studio softbox lighting. Messy fluffy dark grey anime hair (#2E2D30), large expressive glossy emerald green eyes (#2B8048), wearing a crisp white button-up dress shirt with rolled-up sleeves (#FFFFFF), tailored charcoal trousers (#3D3C40), dark shoes (#232224), and a black-and-gold watch on left wrist. Clean tech-studio aesthetic, high fidelity, 8k render, octane render style, no photorealistic human skin texture, strictly stylized toy miniature figure.
```

**Negative Prompt:**
```text
photorealistic human, realistic skin pores, tall adult proportions, deformed fingers, extra limbs, low resolution, blurry, disfigured face, inconsistent eye color, western comic style, oversaturated colors.
```

---

## 🎬 3. NASKAH LENGKAP PER ADEGAN (SCENE-BY-SCENE PRODUCTION SCRIPT)

---

### SCENE 1: HOOK & THE BIG PROMISE
* **Durasi:** 00:00 – 00:10 (10 Detik)
* **Tujuan:** Menarik perhatian penonton dalam 3 detik pertama dengan hasil visual animasi website yang memukau.

#### Visual Layar:
Split screen dinamis: Di latar belakang berputar video animasi mockup MacBook & iPhone Rebuildr AI yang sedang merakit dirinya sendiri secara kinetik. Karakter Chibi melangkah ke depan layar (Full Shot).

#### Aksi & Pose Karakter:
* **Detik 0-3:** Pose `WAVING` (Melambaikan tangan kanan dengan senyum ramah `HAPPY`).
* **Detik 4-10:** Pose `SURPRISED / EXCITED` lalu menunjuk ke arah preview animasi di belakangnya.

#### Naskah Voiceover (Bahasa Indonesia):
> *"Mau tahu cara bikin video animasi produk dan website sehalus ini cuma pakai Google Flow? Tanpa harus jago After Effects atau buang waktu berhari-hari! Tonton video ini sampai habis, saya bakal bongkar alur praktisnya dari nol!"*

#### Prompt Scene Google Flow (Veo Image-to-Video):
```text
Medium shot of the 3D chibi character waving cheerfully towards the camera with a big friendly smile, standing on a floating glass studio pedestal. In the background, a floating holographic 3D MacBook mockup is rotating smoothly with dynamic glowing UI wireframes. Studio soft rim lighting, smooth 60fps camera dolly in, depth of field blur on background, high-end tech presentation vibes.
```

---

### SCENE 2: INPUT ASET & ANCHOR KONSISTENSI
* **Durasi:** 00:10 – 00:25 (15 Detik)
* **Tujuan:** Mengajarkan cara memasukkan Character Reference Sheet dan screenshot website ke dalam Asset Library Google Flow.

#### Visual Layar:
UI Google Flow terbuka di layar utama. Cursor mengunggah 2 file:
1. `Chibi_Style_Guide_Sheet_01.jpg` & `Sheet_02.jpg`.
2. Tangkapan layar layout dashboard **REBUILDR AI**.

#### Aksi & Pose Karakter:
Karakter Chibi mengecil dan berdiri di sudut kanan bawah (Presenter Corner).
* **Detik 10-17:** Pose `THINKING` (Tangan di dagu, mata melirik ke panel upload).
* **Detik 18-25:** Pose `POINTING` (Menunjuk dokumen aset yang terunggah dengan senyum percaya diri).

#### Naskah Voiceover (Bahasa Indonesia):
> *"Kunci utama bikin animasi yang bagus di Google Flow adalah konsistensi aset! Pertama, masuk ke Asset Library, lalu upload Character Sheet seperti ini—lengkap dengan turnaround pose dan palet warna. Setelah itu, masukkan bahan presentasi kalian. Di sini saya pakai tangkapan layar website Rebuildr AI yang baru saja saya bangun sebagai studi kasusnya."*

#### Prompt Scene Google Flow:
```text
Picture-in-picture presenter mode. On the main canvas, a clean software UI displaying an upload dropzone labeled 'Asset Ingestion' with two blueprint sheets sliding in smoothly. In the bottom-right corner, the 3D chibi character stands in thinking pose, tapping chin, then pointing enthusiastically at the uploaded UI wireframe cards. Clean corporate motion design, subtle ambient shadows.
```

---

### SCENE 3: MULTI-SHOT STORYBOARD & PROMPTING KAMERA (VEO ENGINE)
* **Durasi:** 00:25 – 00:45 (20 Detik)
* **Tujuan:** Menjelaskan teknik menulis prompt kamera (Dolly Zoom, Orbit 3D) dan menghidupkan 8 kursor AI di Google Flow.

#### Visual Layar:
Menampilkan Storyboard Timeline di Google Flow. Terlihat timeline multi-shot. Teks prompt diketikkan ke dalam prompt box: *"3D Orbit around MacBook mockup with 8 glowing AI cursor agents moving kinetically"*.

#### Aksi & Pose Karakter:
* **Detik 25-35:** Pose `HANDS ON HIPS` (Berdiri tegas seperti pengajar profesional).
* **Detik 36-45:** Karakter Chibi berinteraksi dengan elemen mockup: melirik ke layar laptop yang memunculkan 8 kursor warna-warni (`Lead Dev`, `Figma Vector`, `GSAP Motion`).

#### Naskah Voiceover (Bahasa Indonesia):
> *"Langkah kedua: Masuk ke Storyboard Builder. Jangan cuma pakai prompt teks sederhana! Manfaatkan kontrol kamera Google Veo. Ketikkan pergerakan kamera seperti 'Dolly Zoom' atau '3D Orbit'. Lihat contohnya: aset website Rebuildr AI tadi langsung hidup—8 agen kursor AI bergerak serentak merakit wireframe dan tombol-tombolnya secara kinetik!"*

#### Prompt Scene Google Flow:
```text
Cinematic 3D camera pan and orbit around a sleek floating MacBook Pro mockup displaying an energetic website reconstruction. Eight distinct glowing cursor badges (Lead Dev, Copywriter, Vector, Shader) dart across the screen assembling buttons and typography with spring physics. The 3D chibi presenter stands beside the device, pointing at the dynamic motion elements with a smug satisfied smile. Volumetric lighting, 60fps buttery smooth motion.
```

---

### SCENE 4: SINKRONISASI AUDIO & VISEME LIPSYNC (SHEET 02)
* **Durasi:** 00:45 – 01:05 (20 Detik)
* **Tujuan:** Menunjukkan bagaimana Sheet 02 (Viseme Chart A-I-U-E-O) dipakai untuk mencocokkan suara narator dengan mulut karakter.

#### Visual Layar:
Zoom-in ke modul audio Google Flow. Terdapat audio waveform narasi. Kamera menampilkan split screen close-up wajah Chibi dengan bentuk bibir berganti-ganti sesuai vokal (A, I, U, E, O).

#### Aksi & Pose Karakter:
* **Detik 45-55:** Pose `CLOSE-UP TALKING` (Bibir bergerak sinkron, kelopak mata berkedip natural sesuai siklus kedipan di Sheet 02).
* **Detik 56-65:** Pose `LAUGHING / GIGGLING` (Tangan di depan mulut, tertawa ceria lalu menatap kamera).

#### Naskah Voiceover (Bahasa Indonesia):
> *"Langkah ketiga: Bikin karakternya berbicara! Di Google Flow, kita tinggal masukkan audio rekaman suara kita. Dengan panduan Viseme Chart yang kita siapkan tadi, AI akan otomatis mencocokkan bentuk mulut huruf A, I, U, E, O dan gerakan kepala karakter. Hasilnya? Bicara jadi luwes dan natural tanpa kaku sama sekali!"*

#### Prompt Scene Google Flow:
```text
Extreme close-up shot of the 3D chibi character's face. The character is articulating speech with natural lipsync matching vowels and consonants, blinking smoothly with emerald green eyes, subtle eyebrow animation and hair sway secondary motion. Warm studio keylight, soft depth of field, 4k macro render quality.
```

---

### SCENE 5: GENERATE & REVEAL HASIL AKHIR
* **Durasi:** 01:05 – 01:20 (15 Detik)
* **Tujuan:** Menunjukkan momen tombol Generate ditekan dan hasil video showcase website 60FPS yang memukau.

#### Visual Layar:
Tombol *Generate Video* berwarna ungu gradasi di-klik di Google Flow $\rightarrow$ Progress bar melesat 100% $\rightarrow$ Layar menampilkan hasil akhir video: Mockup iPhone 15 Pro Titanium dan MacBook Pro berotasi 3D berdampingan dengan badge "Rebuildr AI 60FPS Rendered".

#### Aksi & Pose Karakter:
* **Detik 65-72:** Pose `FIST PUMP` (Mengepalkan tangan dengan penuh semangat).
* **Detik 73-80:** Pose `JUMPING / RECOIL` (Melompat riang di udara merayakan hasil video yang berhasil dibuat).

#### Naskah Voiceover (Bahasa Indonesia):
> *"Terakhir, klik tombol Generate! Dan hanya dalam hitungan detik... BOOM! Video presentasi animasi website beresolusi tinggi 60 FPS langsung jadi! Mulai dari format 16:9 untuk YouTube sampai 9:16 untuk TikTok, semuanya siap pakai!"*

#### Prompt Scene Google Flow:
```text
Wide celebratory shot. The 3D chibi character does an energetic fist pump and jumps happily into the air with joy. Beside the character, two glowing high-tech mockups (iPhone 15 Pro Titanium vertical and MacBook Pro landscape) display flawless 60fps animated product motion graphics with sparkles and dynamic particles. Crisp studio lighting, cinematic master shot.
```

---

### SCENE 6: KESIMPULAN & CALL TO ACTION (OUTRO)
* **Durasi:** 01:20 – 01:30 (10 Detik)
* **Tujuan:** Mendorong interaksi (like, comment, save) dan membagikan template prompt ke penonton.

#### Visual Layar:
Tampil kartu ringkasan 3 Langkah:  
1. **Upload Asset Reference**  
2. **Setup Camera & Storyboard**  
3. **Audio Lipsync & Generate**  
Di bawahnya tertera teks: *"Ketik 'PROMPT' di kolom komentar untuk dapatkan template lengkapnya!"*

#### Aksi & Pose Karakter:
* Pose `WAVING` dengan kedua tangan melambai ramah, tersenyum lebar (`HAPPY`).

#### Naskah Voiceover (Bahasa Indonesia):
> *"Tiga langkah simpel: masukkan aset, atur kamera di storyboard, dan sinkronkan audio. Sekarang giliran kalian coba bikin animasi website keren kalian sendiri di Google Flow. Mau daftar prompt lengkap dari video ini? Tulis 'PROMPT' di kolom komentar, dan sampai jumpa di video berikutnya!"*

#### Prompt Scene Google Flow:
```text
Outro screen. The 3D chibi character stands cheerfully waving goodbye with both hands, warm radiant smile. On the left side, modern glassmorphic cards display summary bullet points with checkmarks. Clean gradient background in deep navy and cyber emerald accents. Soft slow zoom out to final fade.
```

---

## 🛠️ 4. PANDUAN TEKNIS EKSEKUSI DI GOOGLE FLOW

### A. Trik Menjaga Konsistensi Wajah Karakter (Face Locking)
1. **Upload Sheet 01 & Sheet 02 sebagai Reference Images (Image-to-Video Mode)**:  
   Jangan gunakan *Text-to-Video* murni dari kanvas kosong jika ingin karakter konsisten. Selalu pilih **Image-to-Video** dan pilih crop pose `IDLE` atau `FRONT VIEW` dari Sheet 01 sebagai frame awal.
2. **Gunakan Fixed Seed**:  
   Kunci parameter `Seed` di angka yang sama pada tiap adegan agar fitur wajah tidak bergeser antar shot.
3. **Motion Strength Slider**:  
   Atur `Motion Strength` di kisaran **35 – 50%**. Nilai yang terlalu tinggi (>75%) bisa membuat proporsi Chibi melar atau distorsi pada tangan.

### B. Opsi Composite (Green Screen Background)
Jika Anda ingin mengedit video ini lebih leluasa di CapCut, Premiere, atau DaVinci Resolve:
* Tambahkan prompt: `on solid bright green screen chroma key background, isolated, no shadows on green wall` pada karakter Chibi.
* Dengan begitu, rekaman demo website **REBUILDR AI** bisa ditaruh di layer bawah, dan karakter Chibi ditaruh di layer atas sebagai presenter transparan.

---
*Dokumen ini siap dieksekusi langsung ke dalam pipeline produksi konten Google Flow Anda.*
