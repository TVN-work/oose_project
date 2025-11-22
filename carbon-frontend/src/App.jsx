import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import createRouter from './routes'
import './App.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Component to render router inside AuthProvider
function RouterWrapper() {
  // Create router inside component that's already wrapped by AuthProvider
  // Use useState lazy initialization to ensure router is created after AuthProvider is mounted
  // This ensures AuthContext is available when ProtectedRoute components are evaluated
  const [router] = useState(() => {
    // Router creation is deferred until this component mounts
    // At this point, AuthProvider is already mounted and AuthContext is available
    return createRouter();
  });
  
  return <RouterProvider router={router} />
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterWrapper />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
