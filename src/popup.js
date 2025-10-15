// Popup script for Chrome Extension
document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  const summarizeBtn = document.getElementById('summarizeBtn')
  const summarySection = document.getElementById('summarySection')
  const summaryContent = document.getElementById('summaryContent')
  const copySummaryBtn = document.getElementById('copySummary')
  const summaryLengthSelect = document.getElementById('summaryLength')
  const settingsBtn = document.getElementById('settingsBtn')
  const saveSummaryBtn = document.getElementById('saveSummary')

  // Modal elements
  const saveModal = document.getElementById('saveModal')
  const closeModal = document.getElementById('closeModal')
  const cancelSave = document.getElementById('cancelSave')
  const confirmSave = document.getElementById('confirmSave')
  const bookTitle = document.getElementById('bookTitle')
  const chapterTitle = document.getElementById('chapterTitle')
  const notes = document.getElementById('notes')
  const tags = document.getElementById('tags')

  // DOM elements loaded

  // Event listeners
  if (summarizeBtn) {
    summarizeBtn.addEventListener('click', handleSummarize)
  }

  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', handleCopySummary)
  }

  if (saveSummaryBtn) {
    saveSummaryBtn.addEventListener('click', openSaveModal)
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', async () => {
      console.log('🚀 ~ Settings button clicked')
      try {
        // Try chrome.runtime.openOptionsPage first
        if (chrome.runtime.openOptionsPage) {
          await chrome.runtime.openOptionsPage()
          console.log('🚀 ~ Options page opened via openOptionsPage')
        } else {
          // Fallback to chrome.tabs.create
          await chrome.tabs.create({ url: chrome.runtime.getURL('options.html') })
          console.log('🚀 ~ Options page opened via tabs.create')
        }
      } catch (error) {
        console.error('🚀 ~ Failed to open options page:', error)
        // Try fallback method
        try {
          await chrome.tabs.create({ url: chrome.runtime.getURL('options.html') })
          console.log('🚀 ~ Options page opened via fallback')
        } catch (fallbackError) {
          console.error('🚀 ~ Fallback also failed:', fallbackError)
        }
      }
    })
  } else {
    console.error('🚀 ~ Settings button not found')
  }

  // Modal event listeners
  if (closeModal) {
    closeModal.addEventListener('click', closeSaveModal)
  }

  if (cancelSave) {
    cancelSave.addEventListener('click', closeSaveModal)
  }

  if (confirmSave) {
    confirmSave.addEventListener('click', handleSaveSummary)
  }

  // Close modal when clicking outside
  if (saveModal) {
    saveModal.addEventListener('click', (e) => {
      if (e.target === saveModal) {
        closeSaveModal()
      }
    })
  }

  // Clear summary section on startup
  function clearSummary() {
    if (summaryContent && summarySection) {
      summaryContent.textContent = ''
      summarySection.style.display = 'none'
      // Summary section cleared
    }
  }

  // Clear summary on popup open
  clearSummary()

  // Handle summarize button click
  async function handleSummarize() {
    try {
      setLoading(true)
      if (!tab.url.includes('readmoo.com')) {
        showNotification('Please navigate to a Readmoo page first', 'error')
        setLoading(false)
        return
      }

      const response = await chrome.runtime.sendMessage({
        action: 'summarize',
        summaryLength
      })

      if (response && response.success) {
        showSummary(response.summary)
        showNotification('Summary generated successfully!', 'success')
      } else {
        showNotification(
          `Failed to generate summary: ${response?.error || 'Unknown error'}`,
          'error'
        )
      }
    } catch (error) {
      console.error('Summarization error:', error)
      showNotification('An error occurred while summarizing', 'error')
    } finally {
      setLoading(false)
    }
  }

  function showSummary(summary) {
      summaryContent.textContent = summary
      summarySection.style.display = 'block'
      summarySection.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(summaryContent.textContent)
      showNotification('Summary copied to clipboard!', 'success')
    } catch (error) {
      console.error('Copy error:', error)
      showNotification('Failed to copy summary', 'error')
    }
  }

  function setLoading(loading) {
    if (loading) {
      summarizeBtn.textContent = 'Summarizing...'
      summarizeBtn.disabled = true
    } else {
      summarizeBtn.textContent = '📝 Summarize Current Page'
      summarizeBtn.disabled = false
    }
  }

  function openSaveModal() {
    if (saveModal) {
      saveModal.style.display = 'flex'
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && bookTitle) {
          const tabTitle = tabs[0].title
          if (tabTitle && !tabTitle.includes('Readmoo')) {
            bookTitle.value = tabTitle
          }
        }
      })
    }
  }

  // Close save modal
  function closeSaveModal() {
    if (saveModal) {
      saveModal.style.display = 'none'
      // Clear form
      if (bookTitle) bookTitle.value = ''
      if (chapterTitle) chapterTitle.value = ''
      if (notes) notes.value = ''
      if (tags) tags.value = ''
    }
  }

  // Handle save summary
  async function handleSaveSummary() {
    try {
      const summary = summaryContent.textContent
      if (!summary) {
        showNotification('No summary to save', 'error')
        return
      }

      const summaryData = {
        id: Date.now().toString(),
        summary,
        bookTitle: bookTitle.value.trim(),
        chapterTitle: chapterTitle.value.trim(),
        notes: notes.value.trim(),
        tags: tags.value
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        url: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].url,
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      }

      // Get existing saved summaries
      const { savedSummaries = [] } = await chrome.storage.local.get('savedSummaries')

      // Add new summary
      savedSummaries.unshift(summaryData)

      // Keep only last 100 summaries
      if (savedSummaries.length > 100) {
        savedSummaries.splice(100)
      }

      // Save to storage
      await chrome.storage.local.set({ savedSummaries })

      showNotification('Summary saved successfully!', 'success')
      closeSaveModal()
    } catch (error) {
      console.error('Save error:', error)
      showNotification('Failed to save summary', 'error')
    }
  }

  // Show notification
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
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
    `

    document.body.appendChild(notification)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
})
