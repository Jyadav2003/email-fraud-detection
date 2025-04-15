// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './components/Dashboard/Dashboard';
import EmailScanner from './components/EmailAnalysis/EmailScanner';
import AnalysisResult from './components/EmailAnalysis/AnalysisResult';

// Mock authentication (would connect to auth.js service in real app)
const isAuthenticated = true;

function App() {
  // If not authenticated, would show login page
  if (!isAuthenticated) {
    return <div>Login page would go here</div>;
  }

  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis" element={<EmailScanner />} />
            <Route path="/analysis/:id" element={<AnalysisResult />} />
            <Route path="/threats" element={<div>Threat Reports Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;