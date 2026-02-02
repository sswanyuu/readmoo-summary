// Content script for Chrome Extension
// This script runs in the context of web pages to interact with page content

// Initialize content script
function initContentScript() {
  // Check if we're on a Readmoo page
  if (!window.location.hostname.includes('readmoo.com')) {
    return
  }

  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener(handleMessage)
}

// Handle messages from extension
function handleMessage(request, sender, sendResponse) {
  switch (request.action) {
    case 'getPageContent': {
      const content = extractPageContent()
      sendResponse({ content })
      break
    }

    default:
      sendResponse({ error: 'Unknown action' })
  }
}

// Extract main content from the page
function extractPageContent() {
  const selectors = [
    'article',
    '.content',
    '.main-content',
    '.book-content',
    '.chapter-content',
    '.post-content',
    'main',
    '.entry-content',
    '.article-content'
  ]

  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element && element.textContent.trim().length > 100) {
      return {
        text: element.textContent.trim(),
        html: element.innerHTML,
        selector
      }
    }
  }

  // Fallback to body content
  return {
    text: document.body.textContent.trim(),
    html: document.body.innerHTML,
    selector: 'body'
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript)
} else {
  initContentScript()
}
