import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WalletProvider from './context/WalletProvider';
import AppLayout from './components/layout/AppLayout';

import Landing from './pages/Landing';
import NotFound from './pages/NotFound';

function App() {
  return (
    <WalletProvider>
      <Routes>
        <Route path="/" element={<AppLayout><Landing /></AppLayout>} />
        {/* Hiding other routes for Phase 1 as requested */}
        <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
      </Routes>
    </WalletProvider>
  );
}

export default App;
