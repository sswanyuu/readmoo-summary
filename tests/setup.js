// Jest setup file for Chrome Extension testing
import { jest } from '@jest/globals'

// Mock Chrome APIs
global.chrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn()
    },
    onMessage: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn(),
    openOptionsPage: jest.fn()
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn()
    },
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn()
    }
    },
  tabs: {
    query: jest.fn(),
    create: jest.fn(),
    onUpdated: {
      addListener: jest.fn()
    }
  },
  scripting: {
    executeScript: jest.fn()
  }
}

// Mock browser APIs
global.browser = global.chrome

// Mock DOM APIs that might be used in content scripts
Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: jest.fn()
    }
  },
  writable: true
})

// Mock console for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}
