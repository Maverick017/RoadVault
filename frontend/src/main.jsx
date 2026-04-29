// frontend/src/main.jsx
// This is the very first file React runs — it mounts your app into index.html

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // Global styles loaded here
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)