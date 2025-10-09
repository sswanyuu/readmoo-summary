/* global Summarizer */
// Background service worker for Chrome Extension v3
// This script runs in the background and handles extension lifecycle events

// Extension installation/startup
chrome.runtime.onInstalled.addListener((details) => {
  // Set default settings
  chrome.storage.sync.set({
    enabled: true,
    autoSummary: false,
    summaryLength: 'medium'
  })
})

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
      handleSummarization(sendResponse)
      return true

    default:
      sendResponse({ error: 'Unknown action' })
  }
})

// Handle summarization logic
async function handleSummarization (sendResponse) {
  try {
    // This is where you would integrate with your summarization service
    // For now, we'll simulate a summary
    const summary = 'mock'
    sendResponse({ success: true, summary })
  } catch (error) {
    console.error('Summarization error:', error)
    sendResponse({ success: false, error: error.message })
  }
}

// Helper function to extract text from HTML (Service Worker compatible)
function extractTextFromHTML (html) {
  // Remove script and style tags with their content
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ')

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")

  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim()

  return text
}

// Helper function to truncate text to fit Summarizer API limits
function truncateText (text, maxWords = 3000) {
  const words = text.split(/\s+/)

  if (words.length <= maxWords) {
    return text
  }

  // Take first portion and add indicator
  const truncated = words.slice(0, maxWords).join(' ')

  return `${truncated}...`
}

const regex = /(p-[0-9]+\.xhtml)$/
chrome.webRequest.onCompleted.addListener(
  async (details) => {
    if (details.documentId && details.url.match(regex)) {
      if (!('Summarizer' in self) || !('LanguageDetector' in self)) {
        console.log('Summarizer API or LanguageDetector API not supported')
        return
      }

      const options = {
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
        console.log("The Summarizer API isn't usable.")
        return
      }

      const languageDetectorAvailability = await LanguageDetector.availability()
      if (languageDetectorAvailability === 'unavailable') {
        console.log("The LanguageDetector API isn't usable.")
        return
      }

      try {
        // Fetch the XHTML content
        const res = await fetch(details.url)
        const html = await res.text()

        const textContent = extractTextFromHTML(html)
        // Truncate to fit API limits (roughly 3000 words / ~4000 tokens)
        const truncatedText = truncateText(textContent, 3000)

        const detector = await LanguageDetector.create({
          monitor (m) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded * 100}%`)
            })
          }
        })
        const results = await detector.detect(truncatedText)
        const summarizer = await Summarizer.create({
          ...options,
          sharedContext: `Please reply with language ${results[0].detectedLanguage}`
        })

        const summary = await summarizer.summarize(truncatedText)

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
  },
  { urls: ['*://reader.readmoo.com/e/*'] }
)
