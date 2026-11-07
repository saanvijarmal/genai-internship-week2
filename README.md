# 🚀 GenAI Internship — Week 2 Build Showcase

Welcome to the **Week 2 Projects** repository for the **Bharat Space Education Research Centre GenAI Virtual Internship**! 

This repository contains **8 fully functional, offline-first applications** built across Web Tools, Phone Apps, Chrome Extensions, and Video/Design Workflows. Every project in this showcase was engineered in collaboration with **AI coding agents** (Claude, ChatGPT, GitHub Copilot) by authoring precise prompt specifications, handling edge cases, and iteratively debugging code.

---

## 📑 Executive Summary

* **Intern:** Saanvi Jarmal
* **Program:** DEF Space / Bharat Space Education Research Centre — GenAI Virtual Internship
* **Week 2 Focus:** Autonomous Agent-Driven Software Engineering & Offline Tooling
* **Projects Built:** 8 / 17 (Exceeding mandatory track rules across all 4 sections)
* **Core Constraint:** 100% Client-Side / Local execution without paid cloud APIs or user login requirements.

---

## 🛠️ Project Portfolio Breakdown

### 🌐 Section A: Web Tools
Useful browser applications where user data never leaves the local machine.

* **Project 3: Resume Builder (`/Section-A/project-03-resume-builder`)**
  * *Features:* Form inputs with a real-time A4 preview, 3 customizable layout templates, drag-and-drop section reordering, JSON state export/import, and `@media print` CSS for clean multi-page PDF generation without text clipping.
* **Project 5: Scribbly Notes (`/Section-A/project-05-scribbly-notes`)**
  * *Features:* Text editor converting plain notes into handwritten notebook pages using embedded local fonts (`@font-face`), organic word position/rotation jittering, multi-page layout splitting, and image/PDF export.

---

### 📱 Section B: Phone Apps & Games
Mobile-first applications and interfaces designed for lightweight local performance.

* **Project 6: Reel Monster (`/Section-B/project-06-reel-monster`)**
  * *Features:* Floating overlay monster interface tracking scrolling habits on Instagram/YouTube, featuring manual (+1 tap) and auto-increment modes, dynamic monster mood expressions, and a persistent 7-day usage dashboard stored in `localStorage`.
* **Project 7: Bill Book (`/Section-B/project-07-bill-book`)**
  * *Features:* Offline Progressive Web App (PWA) for small business billing. Includes inventory management, invoice creation with custom taxes/discounts, client-side UPI QR code generation, WhatsApp bill formatting, and daily sales tracking.

---

### 🧩 Section C: Chrome Extensions
Manifest V3 browser extensions modifying web behavior for productivity.

* **Project 9: YouTube Focus Board (`/Section-C/project-09-youtube-focus-board`)**
  * *Features:* Focus extension utilizing `MutationObserver` to remove YouTube Shorts, comments, and recommended sidebars. Includes a timestamped study note-taker linked to video seeking and a "Why are you here?" focus duration gate.
* **Project 14: Tab Goblin (`/Section-C/project-14-tab-goblin`)**
  * *Features:* Memory-saving extension using `chrome.tabs.discard()` to sleep idle tabs while keeping un-submitted form data intact. Includes an expressive goblin character UI, a whitelist pin list, and session save/restore capabilities.

---

### 🎨 Section D: Video, Skills & Design
Automated video pipelines and UI/UX redesign methodology.

* **Project 15: One-Minute Reel Cut (`/Section-D/project-15-one-minute-reel-cut`)**
  * *Features:* Python video editing pipeline using `moviepy`, `opencv-python`, and `ffmpeg`. Automatically crops 16:9 horizontal footage into a 9:16 vertical reel, trims duration under 60 seconds, and burns speech captions over the frame.
* **Project 17: Same Page, New Design (`/Section-D/project-17-same-page-new-design`)**
  * *Features:* Before-and-after UI redesign exercise (`before.html` vs. `after.html`). Maintains 100% word-for-word text parity while applying modern dark-mode aesthetics, visual hierarchy, CSS Grid card structures, and mobile responsiveness.

---

## 🤖 AI Agent Workflow & Prompt Engineering

Every project inside this workspace was engineered through iterative prompting and human-in-the-loop debugging with AI agents:

1. **Prompt Specification (`prompts.md`):** All original instructions, follow-up prompts, and bug fixes are logged chronologically in `prompts.md`.
2. **Local Debugging & Testing:** Verified offline functionality, canvas calculations, DOM element mutations, and layout rendering directly in local browser environments and VS Code.
3. **Refinement Loop:** Provided error logs and UI edge-cases back to AI agents to generate targeted patches (e.g., handling print page-breaks, fixing CSS box-sizing bounds, and updating MoviePy v2 module imports).

---

## ⚡ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/genai-internship-week2.html.git](https://github.com/YOUR_USERNAME/genai-internship-week2.html.git)
   cd genai-internship-week2

   Run Web Tools & Mobile PWAs (Projects 3, 5, 6, 7, 17):

Open any index.html file directly in your browser or serve using VS Code Live Server.

Load Chrome Extensions (Projects 9 & 14):

Navigate to chrome://extensions/ in Google Chrome.

Toggle Developer mode ON.

Click Load unpacked and select the specific project folder.

Run Python Video Script (Project 15):
cd Section-D/project-15-one-minute-reel-cut
pip install opencv-python moviepy speechrecognition ffmpeg-python
python reel_cut.py raw_video.mp4 final_reel.mp4

Created by Saanvi Jarmal with Google Gemini & AI Agent Collaboration.