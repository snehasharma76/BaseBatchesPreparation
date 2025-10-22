import React from 'react'
import { AppProvider } from './contexts/AppContext'
import HomePage from './pages/HomePage'
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    sdk.actions.ready();
}, []);

  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  )
}

export default App
