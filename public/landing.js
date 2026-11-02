// Rebuildr Studio — Marketing Landing Page Controller v3.8
document.addEventListener("DOMContentLoaded", () => {
  // 1. Omnibar Quick Launch Form
  const omnibarInput = document.getElementById("landing-url-input");
  const omnibarBtn = document.getElementById("btn-landing-launch");
  const omnibarForm = document.getElementById("landing-omnibar-form");
  const heroChips = document.querySelectorAll(".hero-chip");

  function launchStudioWithUrl(rawUrl) {
    let target = (rawUrl || "").trim();
    if (!target) {
      target = "showcase-saas.html";
    }
    // Clean target
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

  // 2. Device Tabs & Mockup Switcher (MacBook 16:9, iPhone 9:16, Square 1:1)
  const tabBtns = document.querySelectorAll(".device-tab-btn");
  const frameMacbook = document.getElementById("frame-macbook");
  const frameIphone = document.getElementById("frame-iphone");
  const frameSquare = document.getElementById("frame-square");

  const video169 = document.getElementById("hero-video-16-9");
  const video916 = document.getElementById("hero-video-9-16");
  const video11 = document.getElementById("hero-video-1-1");

  function activateFrame(fmt) {
    if (fmt === "9:16") {
      if (frameMacbook) frameMacbook.style.display = "none";
      if (frameSquare) frameSquare.style.display = "none";
      if (frameIphone) {
        frameIphone.style.display = "block";
        frameIphone.style.opacity = "0";
        setTimeout(() => { frameIphone.style.opacity = "1"; }, 30);
      }
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
        setTimeout(() => { frameSquare.style.opacity = "1"; }, 30);
      }
      try {
        video169?.pause();
        video916?.pause();
        if (video11) {
          video11.currentTime = 0;
          video11.play().catch(() => {});
        }
      } catch (_) {}
    } else {
      // Default: 16:9 MacBook
      if (frameIphone) frameIphone.style.display = "none";
      if (frameSquare) frameSquare.style.display = "none";
      if (frameMacbook) {
        frameMacbook.style.display = "block";
        frameMacbook.style.opacity = "0";
        setTimeout(() => { frameMacbook.style.opacity = "1"; }, 30);
      }
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

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const fmt = btn.dataset.format || "16:9";
      activateFrame(fmt);
    });
  });

  // Ensure initial video plays cleanly
  if (video169) {
    video169.muted = true;
    video169.play().catch(() => {});
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question?.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      faqItems.forEach((i) => i.classList.remove("is-open"));
      if (!isOpen) {
        item.classList.add("is-open");
      }
    });
  });
});
