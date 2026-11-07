document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    avatar: document.getElementById('goblin-avatar'),
    count: document.getElementById('tab-count'),
    status: document.getElementById('goblin-status'),
    feedBtn: document.getElementById('feed-btn'),
    saveBtn: document.getElementById('save-session-btn'),
    restoreBtn: document.getElementById('restore-session-btn'),
    whitelistInput: document.getElementById('whitelist-input'),
    whitelistList: document.getElementById('whitelist-list'),
    addWhitelistBtn: document.getElementById('add-whitelist-btn'),
    tabList: document.getElementById('tab-list')
  };

  let openTabs = [];
  let whitelist = [];

  // Initialize data
  chrome.storage.local.get(['tabGoblinWhitelist'], (data) => {
    whitelist = data.tabGoblinWhitelist || [];
    renderWhitelist();
    refreshTabs();
  });

  // Refresh tab data and update UI
  function refreshTabs() {
    chrome.tabs.query({}, (tabs) => {
      openTabs = tabs;
      
      // Update count and Goblin expression
      const total = tabs.length;
      elements.count.innerText = total;
      
      if (total < 10) {
        elements.avatar.innerText = '😌';
        elements.status.innerText = "Goblin is calm. Memory is safe.";
      } else if (total < 20) {
        elements.avatar.innerText = '🤤';
        elements.status.innerText = "Goblin is getting hungry...";
      } else if (total < 30) {
        elements.avatar.innerText = '👹';
        elements.status.innerText = "Goblin is starving! Feed it!";
      } else {
        elements.avatar.innerText = '😱';
        elements.status.innerText = "TAB OVERLOAD! Goblin is screaming!";
      }

      // Sort by idle time (lastAccessed) - oldest first
      const sortedTabs = [...tabs].sort((a, b) => (a.lastAccessed || 0) - (b.lastAccessed || 0));
      
      elements.tabList.innerHTML = '';
      sortedTabs.forEach(tab => {
        const li = document.createElement('li');
        const titleSpan = document.createElement('span');
        titleSpan.innerText = tab.title || tab.url;
        li.appendChild(titleSpan);

        if (tab.discarded) {
          const badge = document.createElement('span');
          badge.className = 'badge';
          badge.innerText = 'Sleeping';
          li.appendChild(badge);
        } else if (tab.active) {
          const badge = document.createElement('span');
          badge.className = 'badge';
          badge.style.background = '#55efc4';
          badge.innerText = 'Active';
          li.appendChild(badge);
        }
        
        elements.tabList.appendChild(li);
      });
    });
  }

  // Feed the Goblin (Discard Tabs)
  elements.feedBtn.addEventListener('click', () => {
    let feedCount = 0;
    openTabs.forEach(tab => {
      // Don't discard active tab, already discarded tabs, or whitelisted domains
      if (!tab.active && !tab.discarded) {
        const isWhitelisted = whitelist.some(domain => tab.url && tab.url.includes(domain));
        if (!isWhitelisted) {
          chrome.tabs.discard(tab.id);
          feedCount++;
        }
      }
    });
    
    elements.status.innerText = `Goblin ate ${feedCount} tabs! *Burp*`;
    setTimeout(refreshTabs, 1000);
  });

  // Whitelist Logic
  function renderWhitelist() {
    elements.whitelistList.innerHTML = '';
    whitelist.forEach((domain, index) => {
      const li = document.createElement('li');
      li.innerText = domain;
      const removeBtn = document.createElement('span');
      removeBtn.innerText = '×';
      removeBtn.className = 'remove-btn';
      removeBtn.onclick = () => {
        whitelist.splice(index, 1);
        chrome.storage.local.set({ tabGoblinWhitelist: whitelist }, renderWhitelist);
      };
      li.appendChild(removeBtn);
      elements.whitelistList.appendChild(li);
    });
  }

  elements.addWhitelistBtn.addEventListener('click', () => {
    const domain = elements.whitelistInput.value.trim();
    if (domain && !whitelist.includes(domain)) {
      whitelist.push(domain);
      chrome.storage.local.set({ tabGoblinWhitelist: whitelist }, () => {
        renderWhitelist();
        elements.whitelistInput.value = '';
      });
    }
  });

  // Session Saver Logic
  elements.saveBtn.addEventListener('click', () => {
    const urls = openTabs.map(tab => tab.url).filter(url => url && !url.startsWith('chrome://'));
    chrome.storage.local.set({ tabGoblinSession: urls }, () => {
      elements.status.innerText = `Session saved! (${urls.length} links)`;
    });
  });

  elements.restoreBtn.addEventListener('click', () => {
    chrome.storage.local.get(['tabGoblinSession'], (data) => {
      const urls = data.tabGoblinSession;
      if (urls && urls.length > 0) {
        urls.forEach(url => chrome.tabs.create({ url, active: false }));
        elements.status.innerText = "Session restoring...";
      } else {
        elements.status.innerText = "No saved session found.";
      }
    });
  });
});