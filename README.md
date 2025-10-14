# Readmoo Summary Chrome Extension

A Chrome Extension v3 that provides intelligent content summarization for Readmoo pages using Chrome's built-in AI APIs. This extension helps users quickly understand and digest content from Readmoo by generating concise summaries with customizable length options.

## ✨ Features

- 🤖 **Chrome AI Integration**: Uses Chrome's built-in Summarizer and LanguageDetector APIs
- 📝 **Manual Summarization**: Click to generate summaries on demand
- 🎯 **Smart Content Extraction**: Automatically extracts content from Readmoo pages
- 📏 **Adjustable Length**: Choose between Short (3 points), Medium (5 points), or Long (7 points)
- 💾 **Save Summaries**: Store summaries with custom notes, tags, and metadata
- 🏷️ **Tag System**: Organize summaries with custom tags
- 📚 **Summary Management**: View, edit, and delete saved summaries
- 📤 **Export Function**: Export all summaries to JSON format
- 🌐 **Multi-language Support**: Automatic language detection and appropriate response language



- Create summary with extension, using Chrome's built-in AI Summarizer
https://github.com/user-attachments/assets/db58abad-c34f-4f33-a96a-2bd482a10b5f


- Summary Management
https://github.com/user-attachments/assets/c7c422f9-193f-4140-a4a2-4c92aaeb2c5a




## 🚀 Installation

### Prerequisites

- Node.js 16+ and npm 8+
- Chrome browser (version 88+)
- Chrome with AI features enabled (Chrome 126+)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd readmoo-summary-extension
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

4. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist/` folder
   - The extension should now appear in your extensions list

5. **Test the extension**
   - Navigate to a Readmoo page (e.g., `https://readmoo.com/book/...`)
   - Click the extension icon in Chrome's toolbar
   - Click "📝 Summarize Current Page" to generate a summary

### Development Workflow

```bash
# Install dependencies
npm install

# Development build with watch mode
npm run dev

# Production build
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Clean build directory
npm run clean
```

## 📖 Usage

### Basic Usage

1. **Navigate to a Readmoo page** (e.g., `https://readmoo.com/book/...`)
2. **Click the extension icon** in your browser toolbar
3. **Select summary length** (Short/Medium/Long)
4. **Click "📝 Summarize Current Page"** to generate a summary
5. **View the summary** in the popup
6. **Copy or save** the summary as needed

### Saving Summaries

1. **Click "💾 Save"** after generating a summary
2. **Fill in the details**:
   - Book Title (auto-filled from page title)
   - Chapter/Page title
   - Personal notes
   - Tags (comma-separated)
3. **Click "💾 Save Summary"** to store it

### Managing Saved Summaries

1. **Click "⚙️ Settings"** in the popup
2. **View all saved summaries** in the "Saved Summaries" section
3. **Use action buttons**:
   - 📋 Copy: Copy summary to clipboard
   - 👁️ View: View full summary in modal
   - 🗑️ Delete: Remove summary
4. **Export all summaries** using the "📤 Export" button

## 🏗️ File Structure

```
readmoo-summary-extension/
├── src/                   # Source files
│   ├── manifest.json      # Extension manifest (v3)
│   ├── background.js      # Service worker script
│   ├── popup.html         # Extension popup interface
│   ├── popup.css          # Popup styles
│   ├── popup.js           # Popup functionality
│   ├── content.js         # Content script for page interaction
│   ├── content.css        # Content script styles
│   ├── options.html       # Options/settings page
│   ├── options.css        # Options page styles
│   ├── options.js         # Options page functionality
│   ├── styles.css         # Shared CSS variables and utilities
│   └── icons/             # Extension icons (16px, 32px, 48px, 128px)
├── dist/                  # Built extension (generated)
├── tests/                 # Test files
├── package.json          # NPM package configuration
├── webpack.config.js     # Webpack build configuration
├── .eslintrc.js          # ESLint configuration
├── .babelrc              # Babel configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## ⚙️ Configuration

### Settings Available

- **Default Summary Length**: Set default length (Short/Medium/Long)
- **Minimum Content Length**: Set minimum characters for summarization

### Chrome AI API Requirements

The extension uses Chrome's built-in AI APIs:

- **Summarizer API**: For generating summaries
- **LanguageDetector API**: For automatic language detection
- **Chrome 126+**: Required for AI features
- **No API keys needed**: Uses Chrome's built-in capabilities

## 🛠️ Development

### Prerequisites

- Node.js 16+ and npm 8+
- Chrome browser (version 126+)
- Chrome with AI features enabled
- Basic knowledge of JavaScript, HTML, and CSS

### Building and Testing

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development mode**

   ```bash
   npm run dev
   ```

3. **Make changes** to the source files in the `src/` directory
4. **Reload the extension** in `chrome://extensions/`
5. **Test functionality** on Readmoo pages

### Available Scripts

- `npm run build` - Production build
- `npm run dev` - Development build with watch
- `npm run clean` - Clean build directory
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Debugging

- **Extension Console**: Use Chrome DevTools on the extension pages
- **Content Script Console**: Check the page console for content script logs
- **Background Script**: Use the extension's service worker console
- **Console Logs**: Extensive logging for debugging

## 🔒 Permissions

This extension requires the following permissions:

- `activeTab`: Access current tab content for summarization
- `storage`: Save user settings and summaries
- `scripting`: Inject content scripts into pages
- `webRequest`: Monitor page requests for content extraction
- `https://readmoo.com/*`: Access Readmoo pages
- `*://reader.readmoo.com/*`: Access Readmoo reader pages

## 🔐 Security

- **No data collection**: The extension doesn't collect or transmit personal data
- **Local storage**: Settings and summaries are stored locally using Chrome storage API
- **Chrome AI APIs**: Uses Chrome's built-in, secure AI capabilities
- **Minimal permissions**: Only requests necessary permissions

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Development Guidelines

- Follow Chrome Extension v3 best practices
- Use modern JavaScript (ES6+)
- Ensure responsive design
- Test on multiple screen sizes
- Validate all user inputs
- Handle errors gracefully
- Add appropriate console logging

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: Report bugs and request features on GitHub
- **Documentation**: Check this README for detailed guides
- **Community**: Join discussions in the GitHub discussions section

## 📈 Changelog

### v1.0.0 (Current)

- ✅ Chrome AI API integration
- ✅ Manual summarization with length options
- ✅ Save summaries with metadata
- ✅ Summary management interface
- ✅ Export functionality

## 🗺️ Roadmap

- [ ] Advanced content filtering options
- [ ] Summary search and filtering
- [ ] Advanced export formats (PDF, Markdown)
- [ ] Summary sharing features
- [ ] Analytics and usage insights
- [ ] Dark mode theme
- [ ] Keyboard shortcuts
- [ ] Integration with external note-taking apps

---

**Note**: This extension is designed specifically for Readmoo.com content and requires Chrome 126+ with AI features enabled. For best results, ensure you're on a valid Readmoo page when using the summarization features.
