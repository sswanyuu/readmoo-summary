# Readmoo Summary Chrome Extension

A Chrome Extension v3 that provides intelligent content summarization for Readmoo pages. This extension helps users quickly understand and digest content from Readmoo by generating concise summaries.

## Features

- 📚 **Smart Summarization**: Automatically extract and summarize content from Readmoo pages
- 🎯 **Targeted Content**: Specifically designed for Readmoo.com content
- ⚙️ **Customizable Settings**: Adjust summary length, language, and behavior
- 💾 **Save Summaries**: Store and manage your generated summaries
- 🎨 **Modern UI**: Clean, responsive interface with dark/light theme support
- 🔄 **Auto-summarize**: Optional automatic summarization when visiting pages
- 📋 **Easy Sharing**: Copy summaries to clipboard with one click

## Installation

### Prerequisites

- Node.js 16+ and npm 8+
- Chrome browser (version 88+)

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
   - Click "Load unpacked" and select the `dist/` folder (⚠️ NOT the root folder)
   - The extension should now appear in your extensions list

5. **Test the extension**
   - Click the extension icon in Chrome's toolbar
   - Navigate to a Readmoo page and test functionality
   - See [TESTING.md](TESTING.md) for detailed testing instructions

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

# Package for distribution
npm run package
```

### Production Installation

For end users, the extension can be installed from the Chrome Web Store (when published) or as a packaged extension.

## Usage

### Basic Usage

1. **Navigate to a Readmoo page** (e.g., `https://readmoo.com/book/...`)
2. **Click the extension icon** in your browser toolbar
3. **Click "Summarize Current Page"** to generate a summary
4. **View the summary** in the popup or on the page
5. **Copy or save** the summary as needed

### Advanced Features

- **Auto-summarize**: Enable in settings to automatically summarize content
- **Custom API**: Configure your own summarization API endpoint
- **Summary Management**: View and manage all saved summaries in the options page
- **Theme Selection**: Choose between light, dark, or auto theme

## File Structure

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
│   └── icons/             # Extension icons (16px, 32px, 48px, 128px)
├── dist/                  # Built extension (generated)
├── tests/                 # Test files
├── .github/              # GitHub Actions workflows
├── package.json          # NPM package configuration
├── webpack.config.js     # Webpack build configuration
├── .eslintrc.js          # ESLint configuration
├── .babelrc              # Babel configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Configuration

### Settings Available

- **Enable Extension**: Turn the extension on/off
- **Auto-summarize**: Automatically summarize content when visiting pages
- **Summary Length**: Choose between short, medium, or long summaries
- **Summary Language**: Select language for generated summaries
- **Show Page Indicator**: Display floating indicator on Readmoo pages
- **Theme**: Choose light, dark, or auto theme
- **API Endpoint**: Configure custom summarization API
- **API Key**: Set API key for custom endpoint
- **Debug Mode**: Enable detailed logging

### API Integration

The extension supports custom API endpoints for summarization:

1. **Set API Endpoint**: Enter your API URL in settings
2. **Configure API Key**: Add authentication if required
3. **API Format**: The extension expects a JSON response with a `summary` field

Example API response:
```json
{
  "summary": "This is the generated summary text...",
  "success": true
}
```

## Development

### Prerequisites

- Node.js 16+ and npm 8+
- Chrome browser (version 88+)
- Basic knowledge of JavaScript, HTML, and CSS
- Chrome Extension development experience (helpful but not required)

### Building and Testing

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development mode**
   ```bash
   npm run dev
   ```
   This will build the extension and watch for changes.

3. **Make changes** to the source files in the `src/` directory
4. **Reload the extension** in `chrome://extensions/` (the build will auto-reload)
5. **Test functionality** on Readmoo pages
6. **Run tests**
   ```bash
   npm test
   ```
7. **Check console** for any errors or debug information

### Available Scripts

- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run watch` - Watch mode for development
- `npm run dev` - Development build with watch
- `npm run clean` - Clean build directory
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run package` - Package extension for distribution

### Debugging

- **Extension Console**: Use Chrome DevTools on the extension pages
- **Content Script Console**: Check the page console for content script logs
- **Background Script**: Use the extension's service worker console
- **Debug Mode**: Enable in settings for detailed logging

### Common Issues

1. **Extension not loading**: Check manifest.json for syntax errors
2. **Content script not running**: Verify host permissions in manifest
3. **API calls failing**: Check network tab and CORS settings
4. **Styling conflicts**: Use `!important` in content.css for page overrides

## Permissions

This extension requires the following permissions:

- `activeTab`: Access current tab content for summarization
- `storage`: Save user settings and summaries
- `scripting`: Inject content scripts into pages
- `https://readmoo.com/*`: Access Readmoo pages

## Security

- **No data collection**: The extension doesn't collect or transmit personal data
- **Local storage**: Settings and summaries are stored locally
- **Secure API**: All API communications use HTTPS
- **Minimal permissions**: Only requests necessary permissions

## Contributing

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Issues**: Report bugs and request features on GitHub
- **Documentation**: Check the wiki for detailed guides
- **Community**: Join discussions in the GitHub discussions section

## Changelog

### v1.0.0
- Initial release
- Basic summarization functionality
- Settings and options page
- Summary management
- Modern UI with theme support

## Roadmap

- [ ] Integration with popular summarization APIs
- [ ] Batch summarization for multiple pages
- [ ] Export summaries to various formats
- [ ] Advanced content filtering
- [ ] Multi-language support improvements
- [ ] Analytics and usage insights

---

**Note**: This extension is designed specifically for Readmoo.com content. For best results, ensure you're on a valid Readmoo page when using the summarization features.
