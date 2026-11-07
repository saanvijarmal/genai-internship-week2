document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    goalScreen: document.getElementById('goal-screen'),
    mainScreen: document.getElementById('main-screen'),
    startBtn: document.getElementById('start-btn'),
    goalInput: document.getElementById('goal-input'),
    timeDisplay: document.getElementById('time-display'),
    taskInput: document.getElementById('task-input'),
    taskList: document.getElementById('task-list'),
    addTaskBtn: document.getElementById('add-task'),
    noteInput: document.getElementById('note-input'),
    noteList: document.getElementById('note-list'),
    addNoteBtn: document.getElementById('add-note'),
    toggles: {
      hideShorts: document.getElementById('toggle-shorts'),
      hideSidebar: document.getElementById('toggle-sidebar'),
      hideComments: document.getElementById('toggle-comments')
    }
  };

  const defaultTasks = [
    "Review GenAI architectures",
    "Complete CS & Business Systems reading"
  ];

  // Initialize UI State
  chrome.storage.local.get(['sessionEnd', 'ytTimeSpent', 'checklist', 'notes', 'ytFocusPrefs'], (data) => {
    const now = Date.now();
    if (data.sessionEnd && now < data.sessionEnd) {
      elements.goalScreen.classList.add('hidden');
      elements.mainScreen.classList.remove('hidden');
      renderTime(data.ytTimeSpent || 0);
    }

    // Load Preferences
    const prefs = data.ytFocusPrefs || { hideShorts: true, hideSidebar: true, hideComments: true };
    elements.toggles.hideShorts.checked = prefs.hideShorts;
    elements.toggles.hideSidebar.checked = prefs.hideSidebar;
    elements.toggles.hideComments.checked = prefs.hideComments;

    // Load Tasks & Notes
    renderList(elements.taskList, data.checklist || defaultTasks, 'task');
    renderList(elements.noteList, data.notes || [], 'note');
  });

  // Goal Unlock
  elements.startBtn.addEventListener('click', () => {
    const goal = elements.goalInput.value.trim();
    if (!goal) return;
    
    chrome.storage.local.get(['checklist'], (data) => {
      const sessionEnd = Date.now() + (60 * 60 * 1000);
      const checklist = data.checklist || defaultTasks;
      if (!checklist.includes(goal)) checklist.unshift(goal);
      
      chrome.storage.local.set({ sessionEnd, currentGoal: goal, checklist }, () => {
        elements.goalScreen.classList.add('hidden');
        elements.mainScreen.classList.remove('hidden');
        renderList(elements.taskList, checklist, 'task');
      });
    });
  });

  // Toggle Handling
  const updatePrefs = () => {
    const prefs = {
      hideShorts: elements.toggles.hideShorts.checked,
      hideSidebar: elements.toggles.hideSidebar.checked,
      hideComments: elements.toggles.hideComments.checked
    };
    chrome.storage.local.set({ ytFocusPrefs: prefs });
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      if(tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: 'updatePrefs', prefs });
    });
  };
  Object.values(elements.toggles).forEach(toggle => toggle.addEventListener('change', updatePrefs));

  // Add Task
  elements.addTaskBtn.addEventListener('click', () => {
    const text = elements.taskInput.value.trim();
    if (!text) return;
    chrome.storage.local.get(['checklist'], (data) => {
      const checklist = data.checklist || [];
      checklist.push(text);
      chrome.storage.local.set({ checklist });
      renderList(elements.taskList, checklist, 'task');
      elements.taskInput.value = '';
    });
  });

  // Add Note with Timestamp
  elements.addNoteBtn.addEventListener('click', () => {
    const text = elements.noteInput.value.trim();
    if (!text) return;
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs[0] || !tabs[0].url.includes('youtube.com')) return;
      
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getTimestamp' }, (response) => {
        const time = response ? response.time : 0;
        chrome.storage.local.get(['notes'], (data) => {
          const notes = data.notes || [];
          notes.push({ text, time });
          chrome.storage.local.set({ notes });
          renderList(elements.noteList, notes, 'note');
          elements.noteInput.value = '';
        });
      });
    });
  });

  // Live Timer Display
  setInterval(() => {
    if (!elements.mainScreen.classList.contains('hidden')) {
      chrome.storage.local.get(['ytTimeSpent'], (data) => renderTime(data.ytTimeSpent || 0));
    }
  }, 1000);

  // Helper Functions
  function formatTime(sec) {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
  }

  function renderTime(seconds) {
    elements.timeDisplay.innerText = formatTime(seconds);
  }

  function renderList(container, items, type) {
    container.innerHTML = '';
    items.forEach((item, index) => {
      const li = document.createElement('li');
      if (type === 'note') {
        const stampBtn = document.createElement('span');
        stampBtn.className = 'note-stamp';
        stampBtn.innerText = `[${formatTime(item.time)}]`;
        stampBtn.onclick = () => {
          chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            if(tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: 'seek', time: item.time });
          });
        };
        li.appendChild(stampBtn);
        li.appendChild(document.createTextNode(item.text));
      } else {
        li.innerText = item;
      }
      
      const delBtn = document.createElement('span');
      delBtn.innerText = '×';
      delBtn.style.cursor = 'pointer';
      delBtn.style.color = '#ef4444';
      delBtn.onclick = () => {
        items.splice(index, 1);
        chrome.storage.local.set({ [type === 'note' ? 'notes' : 'checklist']: items });
        renderList(container, items, type);
      };
      li.appendChild(delBtn);
      container.appendChild(li);
    });
  }
});