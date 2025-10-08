// Content script for Chrome Extension
// This script runs in the context of web pages to interact with page content

console.log('Readmoo Summary content script loaded')

// Initialize content script
function initContentScript () {
  // Check if we're on a Readmoo page
  if (!window.location.hostname.includes('readmoo.com')) {
    return
  }

  // Add extension indicator to the page
  addExtensionIndicator()

  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener(handleMessage)

  // Auto-summarize if enabled
  checkAutoSummarize()
}

// Add visual indicator that extension is active
function addExtensionIndicator () {
  // Create floating indicator
  const indicator = document.createElement('div')
  indicator.id = 'readmoo-summary-indicator'
  indicator.innerHTML = '📚'
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease;
  `

  indicator.addEventListener('mouseenter', () => {
    indicator.style.transform = 'scale(1.1)'
  })

  indicator.addEventListener('mouseleave', () => {
    indicator.style.transform = 'scale(1)'
  })

  indicator.addEventListener('click', () => {
    showSummaryPanel()
  })

  document.body.appendChild(indicator)
}

// Handle messages from extension
function handleMessage (request, sender, sendResponse) {
  console.log('Content script received message:', request)

  switch (request.action) {
    case 'getPageContent':
      const content = extractPageContent()
      sendResponse({ content })
      break

    case 'highlightContent':
      highlightContent(request.selector)
      sendResponse({ success: true })
      break

    case 'showSummary':
      showSummaryPanel(request.summary)
      sendResponse({ success: true })
      break

    default:
      sendResponse({ error: 'Unknown action' })
  }
}

// Extract main content from the page
function extractPageContent () {
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

// Highlight specific content on the page
function highlightContent (selector) {
  const element = document.querySelector(selector)
  if (element) {
    element.style.cssText += `
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
      border: 2px solid #667eea;
      border-radius: 4px;
      padding: 8px;
    `
  }
}

// Show summary panel
function showSummaryPanel (summary = null) {
  // Remove existing panel if any
  const existingPanel = document.getElementById('readmoo-summary-panel')
  if (existingPanel) {
    existingPanel.remove()
  }

  // Create summary panel
  const panel = document.createElement('div')
  panel.id = 'readmoo-summary-panel'
  panel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 600px;
    max-height: 80vh;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    z-index: 10001;
    overflow: hidden;
    animation: slideIn 0.3s ease;
  `

  panel.innerHTML = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0; font-size: 20px;">📚 Content Summary</h2>
    </div>
    <div style="padding: 20px;">
      <div id="summary-content" style="line-height: 1.6; color: #374151;">
        ${summary || 'Click "Summarize" to generate a summary of this page...'}
      </div>
      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
        <button id="copy-summary" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy
        </button>
        <button id="close-panel" style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer;">
          ✕ Close
        </button>
      </div>
    </div>
  `

  // Add CSS animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
  `
  document.head.appendChild(style)

  document.body.appendChild(panel)

  // Add event listeners
  document.getElementById('copy-summary').addEventListener('click', () => {
    const content = document.getElementById('summary-content').textContent
    navigator.clipboard.writeText(content).then(() => {
      showNotification('Summary copied to clipboard!')
    })
  })

  document.getElementById('close-panel').addEventListener('click', () => {
    panel.remove()
  })

  // Close on backdrop click
  panel.addEventListener('click', (e) => {
    if (e.target === panel) {
      panel.remove()
    }
  })

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      panel.remove()
      document.removeEventListener('keydown', handleEscape)
    }
  }
  document.addEventListener('keydown', handleEscape)
}

// Check if auto-summarize is enabled
async function checkAutoSummarize () {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSettings' })
    if (response.autoSummary) {
      // Wait for page to load completely
      setTimeout(() => {
        autoSummarize()
      }, 2000)
    }
  } catch (error) {
    console.error('Failed to check auto-summarize setting:', error)
  }
}

// Auto-summarize current page
async function autoSummarize () {
  try {
    const content = extractPageContent()
    if (content.text.length < 100) {
      return // Not enough content to summarize
    }

    const response = await chrome.runtime.sendMessage({
      action: 'summarizeContent',
      content: content.text
    })

    if (response.success) {
      showSummaryPanel(response.summary)
    }
  } catch (error) {
    console.error('Auto-summarize error:', error)
  }
}

// Show notification
function showNotification (message) {
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 10002;
    animation: slideInRight 0.3s ease;
  `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Add CSS for animations
const animationStyle = document.createElement('style')
animationStyle.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`
document.head.appendChild(animationStyle)

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript)
} else {
  initContentScript()
}
