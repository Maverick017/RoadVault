// frontend/src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { pingBackend } from './utils/api'

// Fires immediately when anyone opens the site
// Wakes the Render server in the background before the user
// clicks anything — reduces cold start wait to near zero
pingBackend()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)