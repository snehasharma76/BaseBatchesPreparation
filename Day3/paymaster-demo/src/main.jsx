/**
 * Application Entry Point
 * 
 * Initializes and renders the React application to the DOM.
 * Uses React 19's StrictMode for development checks.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Mount the React application to the root DOM element
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
