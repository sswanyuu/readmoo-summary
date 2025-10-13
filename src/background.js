/* global Summarizer, LanguageDetector */
// Background service worker for Chrome Extension v3
// This script runs in the background and handles extension lifecycle events

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'summarizeContent':
      handleSummarization(request.content, sendResponse)
      return true

    default:
      sendResponse({ error: 'Unknown action' })
  }
})

// Store the latest request details for manual processing
let latestRequestDetails = null

// Store current summary to avoid re-processing same content
let currentSummary = null
let currentSummaryUrl = null

// Handle summarization logic (manual trigger from popup)
async function handleSummarization(content, sendResponse) {
  try {
    // Check API availability
    if (!('Summarizer' in self) || !('LanguageDetector' in self)) {
      console.log('❌ Summarizer API or LanguageDetector API not supported')
      sendResponse({ success: false, error: 'API not supported' })
      return
    }

    // Check if we already have a summary for the current content
    if (latestRequestDetails && currentSummary && currentSummaryUrl === latestRequestDetails.url) {
      console.log('🚀 ~ handleSummarization ~ using cached summary for:', latestRequestDetails.url)
      sendResponse({ success: true, summary: currentSummary })
      return
    }

    // Use provided content or fetch from latest request
    let contentToUse = content
    let sourceUrl = null

    if (!contentToUse && latestRequestDetails) {
      console.log(
        '🚀 ~ handleSummarization ~ fetching from latest request:',
        latestRequestDetails.url
      )
      try {
        const res = await fetch(latestRequestDetails.url)
        const html = await res.text()
        contentToUse = extractTextFromHTML(html)
        sourceUrl = latestRequestDetails.url
        console.log('🚀 ~ handleSummarization ~ fetched content length:', contentToUse.length)
      } catch (error) {
        console.error('❌ Failed to fetch from latest request:', error)
      }
    }

    if (!contentToUse) {
      console.log('❌ No content available for summarization')
      sendResponse({ success: false, error: 'No content available' })
      return
    }

    // Skip if content is too short
    if (contentToUse.length < 100) {
      console.log('⚠️ Content too short, skipping summarization')
      sendResponse({ success: false, error: 'Content too short' })
      return
    }

    // Filter out tracking and script content
    if (
      contentToUse.includes('FB.init') ||
      contentToUse.includes('Google Tag Manager') ||
      contentToUse.includes('facebook-jssdk') ||
      contentToUse.includes('GTM-') ||
      contentToUse.includes('dataLayer')
    ) {
      console.log('🚀 ~ filtered out tracking content')
      sendResponse({
        success: false,
        error: 'Content contains tracking scripts, not suitable for summarization'
      })
      return
    }

    const options = {
      type: 'key-points',
      format: 'markdown',
      length: 'medium'
    }

    const availability = await Summarizer.availability()
    if (availability === 'unavailable') {
      console.log("❌ The Summarizer API isn't usable.")
      sendResponse({ success: false, error: 'API unavailable' })
      return
    }

    const languageDetectorAvailability = await LanguageDetector.availability()
    if (languageDetectorAvailability === 'unavailable') {
      console.log("❌ The LanguageDetector API isn't usable.")
      sendResponse({ success: false, error: 'Language Detector unavailable' })
      return
    }

    // Truncate to fit API limits (roughly 20,000 characters)
    const truncatedText =
      contentToUse.length > 20000 ? `${contentToUse.slice(0, 20000)}...` : contentToUse

    const detector = await LanguageDetector.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`📥 Language detector downloaded ${e.loaded * 100}%`)
        })
      }
    })
    const results = await detector.detect(truncatedText)

    const summarizer = await Summarizer.create({
      ...options,
      sharedContext: `Please reply with language ${results[0].detectedLanguage}`,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`📥 Downloaded ${e.loaded * 100}%`)
        })
      }
    })

    const summary = await summarizer.summarize(truncatedText)

    // Store summary for popup to retrieve
    await chrome.storage.local.set({
      lastSummary: summary,
      lastSummaryTime: Date.now()
    })

    // Cache the current summary
    currentSummary = summary
    currentSummaryUrl = sourceUrl

    console.log('✅ Summary generated successfully')
    sendResponse({ success: true, summary })
  } catch (error) {
    console.error('❌ Summarization failed:', error.message)
    sendResponse({ success: false, error: error.message })
  }
}

// Helper function to extract text from HTML (Service Worker compatible)
function extractTextFromHTML(html) {
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

// Listen for web requests and store the latest one
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (!details.documentId || details.type !== 'xmlhttprequest') {
      return
    }
    if (details.statusCode !== 200) {
      return
    }

    // Store the latest request details (don't process immediately)
    latestRequestDetails = details
    console.log('🚀 ~ stored latest request:', details.url)
  },
  { urls: ['*://reader.readmoo.com/e/*'] }
)
