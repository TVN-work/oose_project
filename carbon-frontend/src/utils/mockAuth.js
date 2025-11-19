// Mock authentication helpers for development
// Use these functions in browser console to test protected routes

export const mockEVOwnerAuth = () => {
  const mockUser = {
    id: 1,
    name: 'EV Owner',
    email: 'evowner@example.com',
    role: 'EV_OWNER',
  }
  localStorage.setItem('authToken', 'mock-token-ev-owner')
  localStorage.setItem('mockUser', JSON.stringify(mockUser))
  window.location.reload()
}

export const mockBuyerAuth = () => {
  const mockUser = {
    id: 2,
    name: 'Carbon Buyer',
    email: 'buyer@example.com',
    role: 'BUYER',
  }
  localStorage.setItem('authToken', 'mock-token-buyer')
  localStorage.setItem('mockUser', JSON.stringify(mockUser))
  window.location.reload()
}

export const clearMockAuth = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('mockUser')
  window.location.reload()
}

// Make functions available globally in development
if (import.meta.env.DEV) {
  window.mockEVOwnerAuth = mockEVOwnerAuth
  window.mockBuyerAuth = mockBuyerAuth
  window.clearMockAuth = clearMockAuth
  console.log('🔧 Mock Auth helpers available:')
  console.log('  - mockEVOwnerAuth() - Login as EV Owner')
  console.log('  - mockBuyerAuth() - Login as Buyer')
  console.log('  - clearMockAuth() - Logout')
}

