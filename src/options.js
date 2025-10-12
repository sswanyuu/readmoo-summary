// Options page script for Chrome Extension
document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  const enabledToggle = document.getElementById('enabled')
  const autoSummaryToggle = document.getElementById('autoSummary')
  const summaryLengthSelect = document.getElementById('summaryLength')
  const summaryLanguageSelect = document.getElementById('summaryLanguage')
  const showIndicatorToggle = document.getElementById('showIndicator')
  const themeSelect = document.getElementById('theme')
  const apiEndpointInput = document.getElementById('apiEndpoint')
  const apiKeyInput = document.getElementById('apiKey')
  const debugModeToggle = document.getElementById('debugMode')
  const clearSummariesBtn = document.getElementById('clearSummaries')
  const summariesList = document.getElementById('summariesList')
  const resetSettingsBtn = document.getElementById('resetSettings')
  const saveSettingsBtn = document.getElementById('saveSettings')
  const helpLink = document.getElementById('helpLink')
  const privacyLink = document.getElementById('privacyLink')
  const githubLink = document.getElementById('githubLink')

  // Load settings and summaries
  await loadSettings()
  await loadSummaries()

  // Event listeners
  saveSettingsBtn.addEventListener('click', saveSettings)
  resetSettingsBtn.addEventListener('click', resetSettings)
  clearSummariesBtn.addEventListener('click', clearSummaries)
  helpLink.addEventListener('click', openHelp)
  privacyLink.addEventListener('click', openPrivacy)
  githubLink.addEventListener('click', openGitHub)

  // Load settings from storage
  async function loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'getSettings'
      })
      if (response) {
        enabledToggle.checked = response.enabled !== false
        autoSummaryToggle.checked = response.autoSummary || false
        summaryLengthSelect.value = response.summaryLength || 'medium'
        summaryLanguageSelect.value = response.summaryLanguage || 'auto'
        showIndicatorToggle.checked = response.showIndicator !== false
        themeSelect.value = response.theme || 'auto'
        apiEndpointInput.value = response.apiEndpoint || ''
        apiKeyInput.value = response.apiKey || ''
        debugModeToggle.checked = response.debugMode || false
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      showStatus('Failed to load settings', 'error')
    }
  }

  // Save settings to storage
  async function saveSettings() {
    try {
      setLoading(true)

      const settings = {
        enabled: enabledToggle.checked,
        autoSummary: autoSummaryToggle.checked,
        summaryLength: summaryLengthSelect.value,
        summaryLanguage: summaryLanguageSelect.value,
        showIndicator: showIndicatorToggle.checked,
        theme: themeSelect.value,
        apiEndpoint: apiEndpointInput.value,
        apiKey: apiKeyInput.value,
        debugMode: debugModeToggle.checked
      }

      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: settings
      })

      showStatus('Settings saved successfully!', 'success')
    } catch (error) {
      console.error('Failed to save settings:', error)
      showStatus('Failed to save settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Reset settings to defaults
  async function resetSettings() {
    if (!confirm('Are you sure you want to reset all settings to their default values?')) {
      return
    }

    try {
      setLoading(true)

      const defaultSettings = {
        enabled: true,
        autoSummary: false,
        summaryLength: 'medium',
        summaryLanguage: 'auto',
        showIndicator: true,
        theme: 'auto',
        apiEndpoint: '',
        apiKey: '',
        debugMode: false
      }

      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: defaultSettings
      })

      // Reload the form
      await loadSettings()
      showStatus('Settings reset to defaults', 'success')
    } catch (error) {
      console.error('Failed to reset settings:', error)
      showStatus('Failed to reset settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Load saved summaries
  async function loadSummaries() {
    try {
      const result = await chrome.storage.local.get(['summaries'])
      const summaries = result.summaries || []

      if (summaries.length === 0) {
        summariesList.innerHTML =
          '<div style="padding: 20px; text-align: center; color: #6b7280;">No saved summaries yet</div>'
        return
      }

      summariesList.innerHTML = summaries
        .map(
          (summary, index) => `
        <div class="summary-item">
          <div class="summary-content">
            <div style="font-weight: 500; margin-bottom: 4px;">${summary.content.substring(0, 100)}${summary.content.length > 100 ? '...' : ''}</div>
            <div class="summary-actions">
              <button class="copy-btn" onclick="copySummary(${index})">📋 Copy</button>
              <button class="delete-btn" onclick="deleteSummary(${index})">🗑️ Delete</button>
            </div>
          </div>
          <div class="summary-meta">
            <div>${new Date(summary.timestamp).toLocaleDateString()}</div>
            <div>${new Date(summary.timestamp).toLocaleTimeString()}</div>
            <div style="margin-top: 4px; font-size: 10px; color: #9ca3af;">${summary.url}</div>
          </div>
        </div>
      `
        )
        .join('')
    } catch (error) {
      console.error('Failed to load summaries:', error)
      summariesList.innerHTML =
        '<div style="padding: 20px; text-align: center; color: #ef4444;">Failed to load summaries</div>'
    }
  }

  // Clear all summaries
  async function clearSummaries() {
    if (
      !confirm('Are you sure you want to delete all saved summaries? This action cannot be undone.')
    ) {
      return
    }

    try {
      await chrome.storage.local.remove(['summaries'])
      await loadSummaries()
      showStatus('All summaries cleared', 'success')
    } catch (error) {
      console.error('Failed to clear summaries:', error)
      showStatus('Failed to clear summaries', 'error')
    }
  }

  // Copy summary to clipboard
  window.copySummary = async function (index) {
    try {
      const result = await chrome.storage.local.get(['summaries'])
      const summaries = result.summaries || []
      const summary = summaries[index]

      if (summary) {
        await navigator.clipboard.writeText(summary.content)
        showStatus('Summary copied to clipboard!', 'success')
      }
    } catch (error) {
      console.error('Failed to copy summary:', error)
      showStatus('Failed to copy summary', 'error')
    }
  }

  // Delete specific summary
  window.deleteSummary = async function (index) {
    if (!confirm('Are you sure you want to delete this summary?')) {
      return
    }

    try {
      const result = await chrome.storage.local.get(['summaries'])
      const summaries = result.summaries || []
      summaries.splice(index, 1)

      await chrome.storage.local.set({ summaries: summaries })
      await loadSummaries()
      showStatus('Summary deleted', 'success')
    } catch (error) {
      console.error('Failed to delete summary:', error)
      showStatus('Failed to delete summary', 'error')
    }
  }

  // Open help page
  function openHelp(e) {
    e.preventDefault()
    chrome.tabs.create({
      url: 'https://github.com/your-repo/readmoo-summary#help'
    })
  }

  // Open privacy policy
  function openPrivacy(e) {
    e.preventDefault()
    chrome.tabs.create({
      url: 'https://github.com/your-repo/readmoo-summary#privacy'
    })
  }

  // Open GitHub repository
  function openGitHub(e) {
    e.preventDefault()
    chrome.tabs.create({ url: 'https://github.com/your-repo/readmoo-summary' })
  }

  // Show status message
  function showStatus(message, type = 'info') {
    // Remove existing status
    const existingStatus = document.querySelector('.status-indicator')
    if (existingStatus) {
      existingStatus.remove()
    }

    // Create new status
    const status = document.createElement('div')
    status.className = `status-indicator ${type}`
    status.textContent = message
    status.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    `

    document.body.appendChild(status)

    // Remove after 3 seconds
    setTimeout(() => {
      status.remove()
    }, 3000)
  }

  // Set loading state
  function setLoading(loading) {
    const container = document.querySelector('.options-container')
    if (loading) {
      container.classList.add('loading')
      saveSettingsBtn.textContent = 'Saving...'
      saveSettingsBtn.disabled = true
    } else {
      container.classList.remove('loading')
      saveSettingsBtn.textContent = 'Save Settings'
      saveSettingsBtn.disabled = false
    }
  }

  // Add CSS animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
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
  document.head.appendChild(style)
})
