import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

// Helper function to create page URLs based on page name
import { createPageUrl } from './utils';

function App() {
  return (
    <Routes>
      <Route path={createPageUrl("Dashboard")} element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
      <Route path={createPageUrl("History")} element={<Layout currentPageName="History"><History /></Layout>} />
      
      {/* Fallback for home or undefined routes to Dashboard */}
      <Route path="/" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
      <Route path="*" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
    </Routes>
  );
}

export default App;
