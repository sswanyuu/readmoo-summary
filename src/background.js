/* global Summarizer, DOMParser */
// Background service worker for Chrome Extension v3
// This script runs in the background and handles extension lifecycle events

// Extension installation/startup
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details)

  // Set default settings
  chrome.storage.sync.set({
    enabled: true,
    autoSummary: false,
    summaryLength: 'medium'
  })
})

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message 123:', request)

  switch (request.action) {
    case 'getSettings':
      chrome.storage.sync.get(['enabled', 'autoSummary', 'summaryLength'], (result) => {
        sendResponse(result)
      })
      return true // Keep message channel open for async response

    case 'updateSettings':
      chrome.storage.sync.set(request.settings, () => {
        sendResponse({ success: true })
      })
      return true

    case 'summarizeContent':
      // Handle content summarization
      handleSummarization(request.content, sendResponse)
      return true

    default:
      sendResponse({ error: 'Unknown action' })
  }
})

// Handle summarization logic
async function handleSummarization (content, sendResponse) {
  try {
    // This is where you would integrate with your summarization service
    // For now, we'll simulate a summary
    const summary = await simulateSummarization(content)
    sendResponse({ success: true, summary })
  } catch (error) {
    console.error('Summarization error:', error)
    sendResponse({ success: false, error: error.message })
  }
}

// Simulate summarization (replace with actual API call)
async function simulateSummarization (content) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const words = content.split(' ').length
      resolve(`This is a simulated summary of ${words} words. The original content has been processed and condensed into key points.`)
    }, 1000)
  })
}

// Handle tab updates to inject content scripts when needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('readmoo.com')) {
    // Check if content script needs to be injected
    chrome.storage.sync.get(['enabled'], (result) => {
      if (result.enabled) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ['content.js']
        }).catch(err => console.log('Script injection failed:', err))
      }
    })
  }
})

// Helper function to extract text from HTML
function extractTextFromHTML (html) {
  // Create a temporary DOM parser
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove script and style tags
  const scripts = doc.querySelectorAll('script, style')
  scripts.forEach(el => el.remove())

  // Get text content
  const text = doc.body.textContent || ''

  // Clean up whitespace
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim()
}

// Helper function to truncate text to fit Summarizer API limits
function truncateText (text, maxWords = 3000) {
  const words = text.split(/\s+/)

  if (words.length <= maxWords) {
    return text
  }

  // Take first portion and add indicator
  const truncated = words.slice(0, maxWords).join(' ')
  console.log(`Text truncated from ${words.length} to ${maxWords} words`)

  return `${truncated}...`
}

const regex = /(p-[0-9]+\.xhtml)$/
chrome.webRequest.onCompleted.addListener(
  async (details) => {
    if (details.documentId && details.url.match(regex)) {
      console.log('✅✅✅ ~~~ ~ background.js:84 ~ details:', details)
      if (!('Summarizer' in self)) {
        console.log('Summarizer API not supported')
        return
      }

      const options = {
        sharedContext: 'This is a scientific article',
        type: 'key-points',
        format: 'markdown',
        length: 'medium',
        monitor (m) {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded * 100}%`)
          })
        }
      }

      const availability = await Summarizer.availability()
      if (availability === 'unavailable') {
        console.log("🚀🚀🚀 ~~~ ~ background.js:102 ~ The Summarizer API isn't usable.")
        return
      }

      try {
        // Fetch the XHTML content
        const res = await fetch(details.url)
        const html = await res.text()

        // Extract text content (remove HTML tags)
        const textContent = extractTextFromHTML(html)
        console.log('📄 Extracted text length:', textContent.length, 'characters')

        // Truncate to fit API limits (roughly 3000 words / ~4000 tokens)
        const truncatedText = truncateText(textContent, 3000)

        // Check if text is too short
        if (truncatedText.length < 100) {
          console.warn('Text too short to summarize:', truncatedText.length, 'characters')
          return
        }

        // Create summarizer and generate summary
        const summarizer = await Summarizer.create(options)
        const summary = await summarizer.summarize(truncatedText)
        console.log('🚀🚀🚀 ~~~ Summary generated:', summary)

        // Store summary for popup to retrieve
        await chrome.storage.local.set({
          lastSummary: summary,
          lastSummaryUrl: details.url,
          lastSummaryTime: Date.now()
        })

        // TODO: Get summary and display in the popup
        // chrome.tabs.sendMessage(details.tabId, { action: 'summaryReady', summary: summary })
      } catch (error) {
        console.error('❌ Summarization failed:', error.message)
        if (error.message.includes('too large')) {
          console.error('Consider reducing maxWords in truncateText()')
        }
      }
    }
    console.log('Request finished:', details.url, 'status:', details.statusCode)
  },
  { urls: ['*://reader.readmoo.com/e/*'] }
)

// async function fetchWithSummary(url) {
//   const res = await fetch(url);
//   const body = await res.text();

//   const summarizer = await Summarizer.create();
//   const summary = await summarizer.summarize(body);
//   console.log(summary);
// }
