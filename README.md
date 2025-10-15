
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

## 🎬 Demo

**Generate summaries using Chrome’s built-in AI Summarizer:**

https://github.com/user-attachments/assets/96113429-283b-4959-97d0-a9e8aae29bb3  

**Manage and organize saved summaries:**

https://github.com/user-attachments/assets/ba4eaeaa-9044-4cc5-b004-469ec55f4fdc  

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
