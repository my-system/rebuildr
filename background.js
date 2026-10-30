// Swarm Rebuild Studio v2.0 - Background Service Worker
// Clicking the toolbar icon (or pressing Alt+Shift+S) injects or toggles the live showcase builder.

async function rebuild(tab) {
  if (!tab || tab.id == null) return;
  const target = { tabId: tab.id };
  try {
    await chrome.scripting.executeScript({
      target,
      files: ["swarm.js"],
    });
  } catch (err) {
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: "#F24822" });
    await chrome.action.setBadgeText({ tabId: tab.id, text: "×" });
    await chrome.action.setTitle({ tabId: tab.id, title: "Swarm Rebuild tidak dapat berjalan di halaman sistem ini" });
    setTimeout(() => {
      chrome.action.setBadgeText({ tabId: tab.id, text: "" });
      chrome.action.setTitle({ tabId: tab.id, title: "Swarm Rebuild Studio (Alt+Shift+S)" });
    }, 2500);
  }
}

chrome.action.onClicked.addListener(rebuild);

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg && msg.type === "swarm:unhide") {
    reply(true);
    return true;
  }
});
