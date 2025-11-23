import { useMemo } from 'react'
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

// RouterWrapper component ensures router is created after AuthProvider is mounted
function RouterWrapper() {
  // Use useMemo to create router only once when component mounts
  // At this point, AuthProvider is already mounted and context is available
  const router = useMemo(() => createRouter(), [])

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
