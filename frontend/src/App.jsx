// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider } from './utils/Web3Context';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import InsuranceSelectionPage from './pages/InsuranceSelectionPage';
import PaymentConfirmationPage from './pages/PaymentConfirmationPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa'
        }}>
          <Header />
          <main style={{ flex: '1 0 auto' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/insurance" element={<InsuranceSelectionPage />} />
              <Route path="/payment" element={<PaymentConfirmationPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;