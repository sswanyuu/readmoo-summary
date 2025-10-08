// Tests for popup functionality
import { jest } from '@jest/globals'

describe('Popup Script', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="summarizeBtn">Summarize</div>
      <div id="toggleBtn">Toggle</div>
      <div id="autoSummary">Auto Summary</div>
      <div id="summaryLength">Medium</div>
    `
  })

  test('should load settings on popup open', async () => {
    const mockSettings = {
      enabled: true,
      autoSummary: false,
      summaryLength: 'medium'
    }
    
    chrome.runtime.sendMessage.mockResolvedValue(mockSettings)
    
    // Simulate popup load
    const event = new Event('DOMContentLoaded')
    document.dispatchEvent(event)
    
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      action: 'getSettings'
    })
  })

  test('should handle summarize button click', async () => {
    const mockTab = { id: 1, url: 'https://readmoo.com/book/123' }
    const mockContent = 'Sample book content for testing'
    
    chrome.tabs.query.mockResolvedValue([mockTab])
    chrome.scripting.executeScript.mockResolvedValue([{ result: mockContent }])
    chrome.runtime.sendMessage.mockResolvedValue({ success: true, summary: 'Test summary' })
    
    // Simulate button click
    const button = document.getElementById('summarizeBtn')
    button.click()
    
    expect(chrome.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true })
  })
})
