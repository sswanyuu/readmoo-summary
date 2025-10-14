// Tests for content script functionality
import { jest } from '@jest/globals'

describe('Content Script', () => {
  beforeEach(() => {
    // Mock DOM
    document.body.innerHTML = `
      <article>
        <h1>Test Article</h1>
        <p>This is a test article content for summarization.</p>
      </article>
    `
    
    // Mock location
    delete window.location
    window.location = {
      hostname: 'readmoo.com',
      href: 'https://readmoo.com/book/123'
    }
  })

  test('should extract page content', () => {
    const extractPageContent = () => {
      const selectors = ['article', '.content', '.main-content']
      
      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element && element.textContent.trim().length > 10) {
          return {
            text: element.textContent.trim(),
            html: element.innerHTML,
            selector: selector
          }
        }
      }
      
      return {
        text: document.body.textContent.trim(),
        html: document.body.innerHTML,
        selector: 'body'
      }
    }
    
    const result = extractPageContent()
    
    expect(result.text).toContain('Test Article')
    expect(result.selector).toBe('article')
  })

  test('should handle messages from background script', () => {
    const mockRequest = {
      action: 'getPageContent'
    }
    
    const mockSendResponse = jest.fn()
    
    // Simulate message handling
    const handleMessage = (request, sender, sendResponse) => {
      if (request.action === 'getPageContent') {
        const content = {
          text: document.body.textContent.trim(),
          html: document.body.innerHTML,
          selector: 'body'
        }
        sendResponse({ content: content })
      }
    }
    
    handleMessage(mockRequest, {}, mockSendResponse)
    
    expect(mockSendResponse).toHaveBeenCalledWith({
      content: expect.objectContaining({
        text: expect.any(String),
        html: expect.any(String),
        selector: expect.any(String)
      })
    })
  })
})
