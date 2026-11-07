let preferences = { hideShorts: true, hideSidebar: true, hideComments: true };
let timeSpentSeconds = 0;

// Load initial preferences and time
chrome.storage.local.get(['ytFocusPrefs', 'ytTimeSpent', 'lastDate'], (data) => {
  if (data.ytFocusPrefs) preferences = data.ytFocusPrefs;
  
  const today = new Date().toDateString();
  if (data.lastDate === today && data.ytTimeSpent) {
    timeSpentSeconds = data.ytTimeSpent;
  } else {
    timeSpentSeconds = 0;
    chrome.storage.local.set({ lastDate: today, ytTimeSpent: 0 });
  }
});

// Track active viewing time
setInterval(() => {
  if (document.hasFocus()) {
    timeSpentSeconds++;
    if (timeSpentSeconds % 5 === 0) {
      chrome.storage.local.set({ ytTimeSpent: timeSpentSeconds });
    }
  }
}, 1000);

// Distraction hider using MutationObserver to handle YouTube's SPA navigation
const observer = new MutationObserver(() => {
  if (preferences.hideShorts) {
    document.querySelectorAll('ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts], a[title="Shorts"]').forEach(el => el.style.display = 'none');
  }
  if (preferences.hideSidebar) {
    const sidebar = document.querySelector('#secondary');
    if (sidebar) sidebar.style.display = 'none';
  }
  if (preferences.hideComments) {
    const comments = document.querySelector('#comments');
    if (comments) comments.style.display = 'none';
  }
});

observer.observe(document.documentElement, { childList: true, subtree: true });

// Listen for interactions from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const video = document.querySelector('video');
  
  if (request.action === 'seek' && video) {
    video.currentTime = request.time;
  } else if (request.action === 'getTimestamp') {
    sendResponse({ time: video ? Math.floor(video.currentTime) : 0 });
  } else if (request.action === 'updatePrefs') {
    preferences = request.prefs;
    location.reload(); 
  }
  return true; 
});