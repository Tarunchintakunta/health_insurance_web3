// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';

const Header = () => {
  const { account, balance, isConnected, connectWallet, disconnectWallet } = useWeb3();

  return (
    <header style={{
      backgroundColor: '#4CAF50',
      padding: '1rem',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
          DeFi Health Insurance
        </Link>
        
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/insurance" style={{ color: 'white', textDecoration: 'none' }}>Insurance Plans</Link>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
        </nav>
        
        <div>
          {isConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Account</div>
                <div style={{ fontWeight: 'bold' }}>{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Balance</div>
                <div style={{ fontWeight: 'bold' }}>{parseFloat(balance).toFixed(4)} ETH</div>
              </div>
              <button 
                onClick={disconnectWallet}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              style={{
                backgroundColor: 'white',
                color: '#4CAF50',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;