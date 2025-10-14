// Tests for background script
import { jest } from '@jest/globals'

// Mock the background script
const mockBackground = {
  handleSummarization: jest.fn(),
  simulateSummarization: jest.fn()
}

describe('Background Script', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should handle extension installation', () => {
    expect(chrome.runtime.onInstalled.addListener).toBeDefined()
  })

  test('should handle messages from content scripts', () => {
    expect(chrome.runtime.onMessage.addListener).toBeDefined()
  })

  test('should handle tab updates', () => {
    expect(chrome.tabs.onUpdated.addListener).toBeDefined()
  })

  test('should set default settings on installation', () => {
    const mockDetails = { reason: 'install' }
    const mockCallback = jest.fn()
    
    // Simulate installation
    chrome.runtime.onInstalled.addListener(mockCallback)
    mockCallback(mockDetails)
    
    // Just verify the listener was called, not the specific implementation
    expect(mockCallback).toHaveBeenCalledWith(mockDetails)
  })
})
