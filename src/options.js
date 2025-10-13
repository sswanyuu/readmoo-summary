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
      showStatus('Settings saved successfully!', 'success')
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

  // Validate min content length input
  minContentLengthInput.addEventListener('input', (e) => {
    const value = parseInt(e.target.value)
    if (value < 50) {
      e.target.value = 50
    } else if (value > 1000) {
      e.target.value = 1000
    }
  })

  // Load settings on page load
  await loadSettings()
})
