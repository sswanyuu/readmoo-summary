// Popup script for Chrome Extension
document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  const summarizeBtn = document.getElementById('summarizeBtn');
  const toggleBtn = document.getElementById('toggleBtn');
  const autoSummaryToggle = document.getElementById('autoSummary');
  const summaryLengthSelect = document.getElementById('summaryLength');
  const summarySection = document.getElementById('summarySection');
  const summaryContent = document.getElementById('summaryContent');
  const copySummaryBtn = document.getElementById('copySummary');
  const saveSummaryBtn = document.getElementById('saveSummary');
  const optionsBtn = document.getElementById('optionsBtn');
  const helpBtn = document.getElementById('helpBtn');
  const statusIndicator = document.getElementById('statusIndicator');

  // Load settings on popup open
  await loadSettings();

  // Event listeners
  summarizeBtn.addEventListener('click', handleSummarize);
  toggleBtn.addEventListener('click', handleToggle);
  autoSummaryToggle.addEventListener('change', handleAutoSummaryChange);
  summaryLengthSelect.addEventListener('change', handleSummaryLengthChange);
  copySummaryBtn.addEventListener('click', handleCopySummary);
  saveSummaryBtn.addEventListener('click', handleSaveSummary);
  optionsBtn.addEventListener('click', openOptions);
  helpBtn.addEventListener('click', openHelp);

  // Load settings from storage
  async function loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response) {
        autoSummaryToggle.checked = response.autoSummary || false;
        summaryLengthSelect.value = response.summaryLength || 'medium';
        updateStatusIndicator(response.enabled);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  // Handle summarize button click
  async function handleSummarize() {
    try {
      setLoading(true);
      
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('readmoo.com')) {
        showNotification('Please navigate to a Readmoo page first', 'error');
        return;
      }

      // Get page content
      const content = await getPageContent(tab.id);
      
      if (!content) {
        showNotification('No content found to summarize', 'error');
        return;
      }

      // Send content for summarization
      const response = await chrome.runtime.sendMessage({
        action: 'summarizeContent',
        content: content
      });

      if (response.success) {
        showSummary(response.summary);
        showNotification('Summary generated successfully!', 'success');
      } else {
        showNotification('Failed to generate summary: ' + response.error, 'error');
      }
    } catch (error) {
      console.error('Summarization error:', error);
      showNotification('An error occurred while summarizing', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Get page content from current tab
  async function getPageContent(tabId) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: extractPageContent
      });
      
      return results[0]?.result || null;
    } catch (error) {
      console.error('Failed to extract content:', error);
      return null;
    }
  }

  // Function to extract content (runs in page context)
  function extractPageContent() {
    // Try to find main content areas
    const selectors = [
      'article',
      '.content',
      '.main-content',
      '.book-content',
      '.chapter-content',
      'main',
      '.post-content'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 100) {
        return element.textContent.trim();
      }
    }
    
    // Fallback to body content
    return document.body.textContent.trim();
  }

  // Handle toggle button
  async function handleToggle() {
    try {
      const currentSettings = await chrome.runtime.sendMessage({ action: 'getSettings' });
      const newEnabled = !currentSettings.enabled;
      
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: { enabled: newEnabled }
      });
      
      updateStatusIndicator(newEnabled);
      showNotification(
        newEnabled ? 'Extension enabled' : 'Extension disabled',
        'success'
      );
    } catch (error) {
      console.error('Toggle error:', error);
      showNotification('Failed to toggle extension', 'error');
    }
  }

  // Handle auto-summary toggle
  async function handleAutoSummaryChange() {
    try {
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: { autoSummary: autoSummaryToggle.checked }
      });
    } catch (error) {
      console.error('Auto-summary toggle error:', error);
    }
  }

  // Handle summary length change
  async function handleSummaryLengthChange() {
    try {
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: { summaryLength: summaryLengthSelect.value }
      });
    } catch (error) {
      console.error('Summary length change error:', error);
    }
  }

  // Show summary in popup
  function showSummary(summary) {
    summaryContent.textContent = summary;
    summarySection.style.display = 'block';
  }

  // Handle copy summary
  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(summaryContent.textContent);
      showNotification('Summary copied to clipboard!', 'success');
    } catch (error) {
      console.error('Copy error:', error);
      showNotification('Failed to copy summary', 'error');
    }
  }

  // Handle save summary
  async function handleSaveSummary() {
    try {
      const summary = summaryContent.textContent;
      const timestamp = new Date().toISOString();
      
      // Save to storage
      const savedSummaries = await chrome.storage.local.get(['summaries']) || { summaries: [] };
      savedSummaries.summaries = savedSummaries.summaries || [];
      savedSummaries.summaries.push({
        content: summary,
        timestamp: timestamp,
        url: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].url
      });
      
      await chrome.storage.local.set({ summaries: savedSummaries.summaries });
      showNotification('Summary saved!', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showNotification('Failed to save summary', 'error');
    }
  }

  // Open options page
  function openOptions() {
    chrome.runtime.openOptionsPage();
  }

  // Open help
  function openHelp() {
    chrome.tabs.create({ url: 'https://github.com/your-repo/readmoo-summary' });
  }

  // Update status indicator
  function updateStatusIndicator(enabled) {
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    
    if (enabled) {
      statusDot.style.background = '#4ade80';
      statusText.textContent = 'Active';
    } else {
      statusDot.style.background = '#ef4444';
      statusText.textContent = 'Inactive';
    }
  }

  // Set loading state
  function setLoading(loading) {
    const container = document.querySelector('.popup-container');
    if (loading) {
      container.classList.add('loading');
      summarizeBtn.textContent = 'Summarizing...';
    } else {
      container.classList.remove('loading');
      summarizeBtn.innerHTML = '<span class="btn-icon">📝</span>Summarize Current Page';
    }
  }

  // Show notification
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});
