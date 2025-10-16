/* global Summarizer, LanguageDetector */
// Background service worker for Chrome Extension v3
// This script runs in the background and handles extension lifecycle events

class SummaryResult {
  url = null
  summary = null
  latestRequestDetails = null

  isSummarized() {
    return this.url === this.latestRequestDetails?.url
  }

  updateSummary(summary) {
    this.summary = summary
    this.url = this.latestRequestDetails?.url
  }

  async summarize(summaryLength = 'medium') {
    this.summary = await handleSummarization(summaryLength, this.latestRequestDetails.url)
    this.url = this.latestRequestDetails?.url
  }
}


const summaryResult = new SummaryResult()

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'summarize':
      handleSummarization(request.summaryLength)
        .then(summary => {
          return sendResponse({ success: true, summary })
        }).catch(error => {
          return sendResponse({ success: false, error: error.message });
        })
      return true
    default:
      console.log("🚀🚀🚀 ~~~ ~ background.js:42 ~ Unknown action:", request.action);
      return sendResponse({ error: 'Unknown action' });
  }
})

// Handle summarization logic (manual triggered from popup)
async function handleSummarization(summaryLength = 'medium') {
  try {
    // Check API availability
    if (!('Summarizer' in self) || !('LanguageDetector' in self)) {
      console.error('Summarizer API or LanguageDetector API not supported')
      throw new Error('API not supported');
    }

    // Check if we already have a summary for the current content
    if (summaryResult.isSummarized()) {
      return summaryResult.summary
    }

    const res = await fetch(summaryResult.latestRequestDetails.url)
    const html = await res.text()

    const contentToUse = extractTextFromHTML(html)
    if (contentToUse.length < 100) {
      return contentToUse
    }


    const options = {
      type: 'key-points',
      format: 'markdown',
      length: summaryLength
    }

    const availability = await Summarizer.availability()
    if (availability === 'unavailable') {
      console.error("The Summarizer API isn't usable.")
      throw new Error('API unavailable')
    }

    const languageDetectorAvailability = await LanguageDetector.availability()
    if (languageDetectorAvailability === 'unavailable') {
      console.error("The LanguageDetector API isn't usable.")
      throw new Error('Language Detector unavailable')
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

    // TODO: Extract sumarizer and reuse constant
    const summarizer = await Summarizer.create({
      type: options.type,
      format: options.format,
      length: options.length,
      sharedContext: `Please summarize with language ${results[0].detectedLanguage}`,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`📥 Downloaded ${e.loaded * 100}%`)
        })
      }
    })

    const summary = await summarizer.summarize(truncatedText)
    summaryResult.updateSummary(summary)
    return summary;
  } catch (error) {
    console.error('❌ Summarization failed:', error.message)
    throw new Error(error.message)
  }
}

// Helper function to extract text from HTML
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

    summaryResult.latestRequestDetails = details
  },
  { urls: ['*://reader.readmoo.com/*'] }
)
