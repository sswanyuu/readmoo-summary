// Options page script for Chrome Extension
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 ~ Options page loaded')

  // Get DOM elements
  const defaultLengthSelect = document.getElementById('defaultLength')
  const autoClearToggle = document.getElementById('autoClear')
  const showNotificationsToggle = document.getElementById('showNotifications')
  const minContentLengthInput = document.getElementById('minContentLength')
  const saveBtn = document.getElementById('saveBtn')
  const resetBtn = document.getElementById('resetBtn')
  const statusMessage = document.getElementById('statusMessage')

  // Summary elements
  const summaryCount = document.getElementById('summaryCount')
  const summaryList = document.getElementById('summaryList')
  const clearAllSummaries = document.getElementById('clearAllSummaries')
  const exportSummaries = document.getElementById('exportSummaries')

  // Default settings
  const defaultSettings = {
    defaultLength: 'medium',
    autoClear: true,
    showNotifications: true,
    minContentLength: 100
  }

  // Load settings from storage
  async function loadSettings() {
    try {
      const settings = await chrome.storage.sync.get(defaultSettings)

      // Apply settings to UI
      defaultLengthSelect.value = settings.defaultLength
      autoClearToggle.checked = settings.autoClear
      showNotificationsToggle.checked = settings.showNotifications
      minContentLengthInput.value = settings.minContentLength

      console.log('🚀 ~ Settings loaded:', settings)
    } catch (error) {
      console.error('Failed to load settings:', error)
      showStatus('Failed to load settings', 'error')
    }
  }

  // Save settings to storage
  async function saveSettings() {
    try {
      const settings = {
        defaultLength: defaultLengthSelect.value,
        autoClear: autoClearToggle.checked,
        showNotifications: showNotificationsToggle.checked,
        minContentLength: parseInt(minContentLengthInput.value)
      }

      await chrome.storage.sync.set(settings)
      console.log('🚀 ~ Settings saved:', settings)
      showStatus('💾 Settings saved successfully!', 'success')
    } catch (error) {
      console.error('Failed to save settings:', error)
      showStatus('Failed to save settings', 'error')
    }
  }

  // Reset settings to default
  async function resetSettings() {
    try {
      await chrome.storage.sync.clear()
      await chrome.storage.sync.set(defaultSettings)

      // Reset UI to defaults
      defaultLengthSelect.value = defaultSettings.defaultLength
      autoClearToggle.checked = defaultSettings.autoClear
      showNotificationsToggle.checked = defaultSettings.showNotifications
      minContentLengthInput.value = defaultSettings.minContentLength

      console.log('🚀 ~ Settings reset to default')
      showStatus('Settings reset to default', 'success')
    } catch (error) {
      console.error('Failed to reset settings:', error)
      showStatus('Failed to reset settings', 'error')
    }
  }

  // Show status message
  function showStatus(message, type) {
    statusMessage.textContent = message
    statusMessage.className = `status-message ${type} show`

    // Hide after 3 seconds
    setTimeout(() => {
      statusMessage.classList.remove('show')
    }, 3000)
  }

  // Event listeners
  saveBtn.addEventListener('click', saveSettings)
  resetBtn.addEventListener('click', resetSettings)

  if (clearAllSummaries) {
    clearAllSummaries.addEventListener('click', handleClearAllSummaries)
  }

  if (exportSummaries) {
    exportSummaries.addEventListener('click', handleExportSummaries)
  }

  // Add event delegation for summary action buttons
  if (summaryList) {
    summaryList.addEventListener('click', async (e) => {
      const target = e.target
      const summaryId = target.getAttribute('data-summary-id')

      if (!summaryId) return

      if (target.classList.contains('copy-btn')) {
        await handleCopySummary(summaryId)
      } else if (target.classList.contains('view-btn')) {
        handleViewSummary(summaryId)
      } else if (target.classList.contains('delete-btn')) {
        await handleDeleteSummary(summaryId)
      }
    })
  }

  // Validate min content length input
  minContentLengthInput.addEventListener('input', (e) => {
    const value = parseInt(e.target.value)
    if (value < 50) {
      e.target.value = 50
    } else if (value > 1000) {
      e.target.value = 1000
    }
  })

  // Load saved summaries
  async function loadSavedSummaries() {
    try {
      const { savedSummaries = [] } = await chrome.storage.local.get('savedSummaries')

      if (summaryCount) {
        summaryCount.textContent = savedSummaries.length
      }

      if (summaryList) {
        if (savedSummaries.length === 0) {
          summaryList.innerHTML =
            '<p style="text-align: center; color: #6b7280; padding: 20px;">No saved summaries yet.</p>'
        } else {
          summaryList.innerHTML = savedSummaries
            .map((summary) => createSummaryItem(summary))
            .join('')
        }
      }
    } catch (error) {
      console.error('Failed to load saved summaries:', error)
    }
  }

  // Create summary item HTML
  function createSummaryItem(summary) {
    const date = new Date(summary.createdAt).toLocaleDateString()
    const tagsHtml =
      summary.tags && summary.tags.length > 0
        ? `<div class="summary-tags">${summary.tags.map((tag) => `<span class="summary-tag">${tag}</span>`).join('')}</div>`
        : ''

    const notesHtml = summary.notes
      ? `<div class="summary-notes">Notes: ${summary.notes}</div>`
      : ''

    return `
      <div class="summary-item">
        <div class="summary-header">
          <h4 class="summary-title">${summary.bookTitle || 'Untitled'}</h4>
          <span class="summary-date">${date}</span>
        </div>
        ${summary.chapterTitle ? `<div class="summary-chapter">${summary.chapterTitle}</div>` : ''}
        <div class="summary-content">${summary.summary}</div>
        ${tagsHtml}
        ${notesHtml}
        <div class="summary-actions">
          <button class="summary-action-btn copy-btn" data-summary-id="${summary.id}">📋 Copy</button>
          <button class="summary-action-btn view-btn" data-summary-id="${summary.id}">👁️ View</button>
          <button class="summary-action-btn delete-btn delete" data-summary-id="${summary.id}">🗑️ Delete</button>
        </div>
      </div>
    `
  }

  // Handle clear all summaries
  async function handleClearAllSummaries() {
    if (
      confirm('Are you sure you want to delete all saved summaries? This action cannot be undone.')
    ) {
      try {
        await chrome.storage.local.remove('savedSummaries')
        await loadSavedSummaries()
        showStatus('All summaries cleared', 'success')
      } catch (error) {
        console.error('Failed to clear summaries:', error)
        showStatus('Failed to clear summaries', 'error')
      }
    }
  }

  // Handle export summaries
  async function handleExportSummaries() {
    try {
      const { savedSummaries = [] } = await chrome.storage.local.get('savedSummaries')

      if (savedSummaries.length === 0) {
        showStatus('No summaries to export', 'error')
        return
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        totalSummaries: savedSummaries.length,
        summaries: savedSummaries
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `readmoo-summaries-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showStatus('Summaries exported successfully', 'success')
    } catch (error) {
      console.error('Failed to export summaries:', error)
      showStatus('Failed to export summaries', 'error')
    }
  }

  // Handle copy summary
  async function handleCopySummary(summaryId) {
    try {
      console.log('🚀 ~ Copying summary:', summaryId)
      const { savedSummaries = [] } = await chrome.storage.local.get('savedSummaries')
      const summary = savedSummaries.find((s) => s.id === summaryId)
      if (summary) {
        await navigator.clipboard.writeText(summary.summary)
        console.log('🚀 ~ Summary copied successfully')
        showStatus('✅ Summary copied to clipboard!', 'success')
      } else {
        console.log('🚀 ~ Summary not found')
        showStatus('❌ Summary not found', 'error')
      }
    } catch (error) {
      console.error('Failed to copy summary:', error)
      showStatus('❌ Failed to copy summary', 'error')
    }
  }

  // Handle view summary
  async function handleViewSummary(summaryId) {
    try {
      const { savedSummaries = [] } = await chrome.storage.local.get('savedSummaries')
      const summary = savedSummaries.find((s) => s.id === summaryId)
      if (summary) {
        // Create a simple modal to view the full summary
        showSummaryModal(summary)
      }
    } catch (error) {
      console.error('Failed to view summary:', error)
      showStatus('Failed to view summary', 'error')
    }
  }

  // Handle delete summary
  async function handleDeleteSummary(summaryId) {
    if (confirm('Are you sure you want to delete this summary?')) {
      try {
        const { savedSummaries = [] } = await chrome.storage.local.get('savedSummaries')
        const updatedSummaries = savedSummaries.filter((s) => s.id !== summaryId)
        await chrome.storage.local.set({ savedSummaries: updatedSummaries })
        await loadSavedSummaries()
        showStatus('🗑️ Summary deleted successfully', 'success')
      } catch (error) {
        console.error('Failed to delete summary:', error)
        showStatus('❌ Failed to delete summary', 'error')
      }
    }
  }

  // Show summary in modal
  function showSummaryModal(summary) {
    const modal = document.createElement('div')
    modal.className = 'summary-view-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `

    const content = document.createElement('div')
    content.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; color: #374151;">${summary.bookTitle || 'Untitled'}</h3>
        <button id="closeSummaryModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
      </div>
      ${summary.chapterTitle ? `<p style="color: #6b7280; margin-bottom: 16px;">${summary.chapterTitle}</p>` : ''}
      <div style="white-space: pre-wrap; line-height: 1.6; color: #374151; margin-bottom: 16px;">${summary.summary}</div>
      ${summary.notes ? `<div style="background: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 16px;"><strong>Notes:</strong> ${summary.notes}</div>` : ''}
      ${
        summary.tags && summary.tags.length > 0
          ? `
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
          ${summary.tags.map((tag) => `<span style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${tag}</span>`).join('')}
        </div>
      `
          : ''
      }
      <div style="text-align: right;">
        <button id="copyFullSummary" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">📋 Copy Full Summary</button>
      </div>
    `

    modal.appendChild(content)
    document.body.appendChild(modal)

    // Event listeners for modal
    document.getElementById('closeSummaryModal').addEventListener('click', () => {
      document.body.removeChild(modal)
    })

    document.getElementById('copyFullSummary').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summary.summary)

        showStatus('✅ Full summary copied to clipboard!', 'success')
      } catch (error) {
        console.error('Failed to copy summary:', error)
      }
    })

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Load settings and summaries on page load
  await loadSettings()
  await loadSavedSummaries()
})
