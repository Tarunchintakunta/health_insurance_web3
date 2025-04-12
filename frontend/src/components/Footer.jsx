// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      padding: '2rem 0',
      borderTop: '1px solid #e9ecef'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '0 1rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>DeFi Health Insurance</h3>
          <p style={{ color: '#6c757d', maxWidth: '400px' }}>
            Blockchain-powered health insurance for a transparent and efficient future.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ color: '#4CAF50', textDecoration: 'none' }}>Home</Link>
          <Link to="/insurance" style={{ color: '#4CAF50', textDecoration: 'none' }}>Insurance Plans</Link>
          <Link to="/dashboard" style={{ color: '#4CAF50', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/about" style={{ color: '#4CAF50', textDecoration: 'none' }}>About</Link>
        </div>
      </div>
      
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        color: '#6c757d',
        fontSize: '0.875rem'
      }}>
        <p>&copy; {new Date().getFullYear()} DeFi Health Insurance. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>Running on Sepolia Testnet</p>
      </div>
    </footer>
  );
};

export default Footer;