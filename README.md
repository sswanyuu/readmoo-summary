
# Readmoo Summary Chrome Extension

A Chrome Extension (v3) that provides AI-powered content summarization for Readmoo pages using Chrome’s built-in Summarizer and LanguageDetector APIs. It helps users quickly digest book content with concise, customizable summaries.

---


## ✨ Features
- 🤖 **AI-Powered Summaries** – Uses Chrome’s built-in Summarizer and LanguageDetector APIs  
- 📝 **On-Demand Summarization** – Click to generate summaries instantly  
- 🎯 **Smart Content Extraction** – Automatically detects and extracts Readmoo content  
- 📏 **Adjustable Length** – Short (3 points), Medium (5), or Long (7)  
- 💾 **Save & Manage Summaries** – Add notes, tags, and metadata; edit or delete anytime  
- 📤 **Export to JSON** – Export all summaries with one click  
- 🌐 **Multi-Language Support** – Auto-detects content language and responds accordingly  

---

- popup
<img width="324" height="302" alt="截圖 2026-02-01 下午4 31 13" src="https://github.com/user-attachments/assets/f14239ee-7628-43d2-9ce1-2654ba8e9180" />

- setup page
<img width="1113" height="763" alt="截圖 2026-02-01 下午4 27 03" src="https://github.com/user-attachments/assets/646210dd-cba3-42d5-9f0a-0bf9195ee91f" />


## 🎬 Demo

**Generate summaries using Chrome’s built-in AI Summarizer:**



https://github.com/user-attachments/assets/08e38d7f-a06a-4d99-8f10-7e92f1b175ae



**Manage and organize saved summaries:**



https://github.com/user-attachments/assets/3f87466d-d40e-4dc5-9b30-e64355abf35f



---

## 🚀 Installation
1. **Clone & Install**

   ```bash
   git clone <repo-url>
   cd readmoo-summary-extension
   npm install
   ```
2. **Build**

   ```bash
   npm run build
   ```
3. **Load in Chrome**

   * Open `chrome://extensions/`
   * Enable *Developer mode* → *Load unpacked* → select the `dist/` folder
4. **Test**

   * Visit a Readmoo page → click the extension → choose summary length → click “📝 Summarize”

---

## 📖 Usage

1. Open a Readmoo page
2. Click the extension icon
3. Select summary length (Short / Medium / Long)
4. Generate, view, or save the summary
5. Manage or export summaries from Settings

---

## 🏗️ File Structure

```
src/
 ├── manifest.json
 ├── background.js
 ├── popup.{html,css,js}
 ├── content.{js,css}
 ├── options.{html,css,js}
 └── icons/
```

---

## ⚙️ Development

```bash
npm run dev     # Watch mode
npm run build   # Production build
npm run test    # Run tests
npm run lint    # Lint code
npm run clean   # Clean build folder
```

### Requirements

* Node.js 16+
* Chrome 126+ with AI features enabled

---

## 🔒 Permissions

* `activeTab`, `storage`, `scripting`, `webRequest`
* `https://readmoo.com/*`, `*://reader.readmoo.com/*`

> All data is stored locally — no external collection or transmission.

---

## 🤝 Contributing

1. Fork and create a feature branch
2. Make changes and test thoroughly
3. Submit a pull request

---

## 📜 License

MIT License

---

## 🗺️ Roadmap

* [ ] Summary search and filters
* [ ] Advanced export formats (PDF, Markdown)
* [ ] Dark mode and keyboard shortcuts
* [ ] Integration with note-taking apps

---

**Note:** Works exclusively on Readmoo.com pages and requires Chrome 126+ with AI features enabled.
