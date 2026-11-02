// Rebuildr (Swarm Rebuild Studio v3.5) - Background Service Worker
// Clicking the toolbar icon, pressing Alt+Shift+S, or using the right-click context menu injects/controls the live showcase builder.

async function rebuild(tab, mode = "toggle") {
  if (!tab || tab.id == null) return;
  const target = { tabId: tab.id };
  try {
    if (mode === "pick") {
      await chrome.scripting.executeScript({
        target,
        func: () => {
          window.__swarmStartInPickerMode = true;
        },
      });
    } else if (mode === "tour") {
      await chrome.scripting.executeScript({
        target,
        func: () => {
          window.__rebuildrAutoLaunch = {
            showcasePreset: "feature-tour",
            autoStart: true,
          };
          if (window.__swarmRebuild) {
            window.__swarmRebuild.stop();
          }
        },
      });
    } else if (mode === "motion" || mode === "scroll") {
      const wantMotion = mode === "motion";
      await chrome.scripting.executeScript({
        target,
        args: [wantMotion],
        func: (isMotion) => {
          window.__rebuildrMotionMode = isMotion;
          if (window.__swarmRebuild) {
            window.__swarmRebuild.stop();
          }
        },
      });
    }
    await chrome.scripting.executeScript({
      target,
      files: ["swarm.js"],
    });
    if (mode === "pick") {
      await chrome.scripting.executeScript({
        target,
        func: () => {
          if (window.__swarmRebuild && !window.__swarmRebuild.pickerActive) {
            window.__swarmRebuild.enableSectionPicker();
          }
        },
      });
    }
  } catch (err) {
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: "#F24822" });
    await chrome.action.setBadgeText({ tabId: tab.id, text: "×" });
    await chrome.action.setTitle({
      tabId: tab.id,
      title: "Rebuildr tidak dapat berjalan di halaman sistem ini",
    });
    setTimeout(() => {
      chrome.action.setBadgeText({ tabId: tab.id, text: "" });
      chrome.action.setTitle({ tabId: tab.id, title: "Rebuildr Studio (Alt+Shift+S)" });
    }, 2500);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  try {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: "rebuildr-feature-tour",
        title: "🎯 Demo Fitur Interaktif — Feature Tour (Rebuildr)",
        contexts: ["all"],
      });
      chrome.contextMenus.create({
        id: "rebuildr-pick-section",
        title: "⚡ Rakit ulang bagian/elemen ini (Rebuildr)",
        contexts: ["all"],
      });
      chrome.contextMenus.create({
        id: "rebuildr-full-page",
        title: "📜 Rakit ulang seluruh halaman — Mode Scroll (Rebuildr)",
        contexts: ["all"],
      });
      chrome.contextMenus.create({
        id: "rebuildr-motion-mode",
        title: "🎬 Rakit ulang seluruh halaman — Mode Motion Design (Rebuildr)",
        contexts: ["all"],
      });
    });
  } catch (_) {}
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "rebuildr-feature-tour") {
    rebuild(tab, "tour");
  } else if (info.menuItemId === "rebuildr-pick-section") {
    rebuild(tab, "pick");
  } else if (info.menuItemId === "rebuildr-full-page") {
    rebuild(tab, "scroll");
  } else if (info.menuItemId === "rebuildr-motion-mode") {
    rebuild(tab, "motion");
  }
});

chrome.action.onClicked.addListener((tab) => rebuild(tab, "toggle"));

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg && msg.type === "swarm:unhide") {
    reply(true);
    return true;
  }
});
