// Background service worker for Chrome Extension v3
// This script runs in the background and handles extension lifecycle events

// Extension installation/startup
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details);
  
  // Set default settings
  chrome.storage.sync.set({
    enabled: true,
    autoSummary: false,
    summaryLength: 'medium'
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.action) {
    case 'getSettings':
      chrome.storage.sync.get(['enabled', 'autoSummary', 'summaryLength'], (result) => {
        sendResponse(result);
      });
      return true; // Keep message channel open for async response
      
    case 'updateSettings':
      chrome.storage.sync.set(request.settings, () => {
        sendResponse({ success: true });
      });
      return true;
      
    case 'summarizeContent':
      // Handle content summarization
      handleSummarization(request.content, sendResponse);
      return true;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
});

// Handle summarization logic
async function handleSummarization(content, sendResponse) {
  try {
    // This is where you would integrate with your summarization service
    // For now, we'll simulate a summary
    const summary = await simulateSummarization(content);
    sendResponse({ success: true, summary });
  } catch (error) {
    console.error('Summarization error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Simulate summarization (replace with actual API call)
async function simulateSummarization(content) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const words = content.split(' ').length;
      resolve(`This is a simulated summary of ${words} words. The original content has been processed and condensed into key points.`);
    }, 1000);
  });
}

// Handle tab updates to inject content scripts when needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('readmoo.com')) {
    // Check if content script needs to be injected
    chrome.storage.sync.get(['enabled'], (result) => {
      if (result.enabled) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }).catch(err => console.log('Script injection failed:', err));
      }
    });
  }
});
