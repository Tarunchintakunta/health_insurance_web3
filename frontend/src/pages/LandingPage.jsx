// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';

const LandingPage = () => {
  const { connectWallet, isConnected, balance } = useWeb3();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #388e3c 0%, #1b5e20 100%)',
        color: 'white',
        padding: '5rem 1rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Decentralized Health Insurance for the Digital Age
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px', marginBottom: '2.5rem' }}>
            Secure, transparent, and affordable health coverage powered by blockchain technology.
            Take control of your health insurance with no middlemen.
          </p>
          
          {isConnected ? (
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <p style={{ marginBottom: '0.25rem', opacity: 0.7 }}>Your Balance</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{parseFloat(balance).toFixed(4)} ETH</p>
              </div>
              <Link to="/insurance">
                <button style={{
                  backgroundColor: 'white',
                  color: '#388e3c',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  View Insurance Plans
                </button>
              </Link>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              style={{
                backgroundColor: 'white',
                color: '#388e3c',
                padding: '1rem 2rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                cursor: 'pointer'
              }}
            >
              Connect Your Wallet
            </button>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem', color: '#333' }}>
            How It Works
          </h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            <div style={{
              flex: '1',
              minWidth: '250px',
              maxWidth: '350px',
              backgroundColor: '#f8f9fa',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#e8f5e9',
                color: '#4CAF50',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1.5rem'
              }}>1</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
                Connect Your Wallet
              </h3>
              <p style={{ color: '#6c757d' }}>
                Connect your Ethereum wallet to access our decentralized insurance platform securely.
              </p>
            </div>
            
            <div style={{
              flex: '1',
              minWidth: '250px',
              maxWidth: '350px',
              backgroundColor: '#f8f9fa',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#e8f5e9',
                color: '#4CAF50',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1.5rem'
              }}>2</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
                Choose a Plan
              </h3>
              <p style={{ color: '#6c757d' }}>
                Browse and select from various insurance plans tailored to your health needs.
              </p>
            </div>
            
            <div style={{
              flex: '1',
              minWidth: '250px',
              maxWidth: '350px',
              backgroundColor: '#f8f9fa',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#e8f5e9',
                color: '#4CAF50',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1.5rem'
              }}>3</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
                Pay Premium
              </h3>
              <p style={{ color: '#6c757d' }}>
                Pay your premium with cryptocurrency. Transactions are secure and transparent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 1rem',
        backgroundColor: '#4CAF50',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Ready to experience the future of health insurance?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Get started with DeFi Health Insurance today and take control of your healthcare coverage.
          </p>
          {isConnected ? (
            <Link to="/insurance">
              <button style={{
                backgroundColor: 'white',
                color: '#4CAF50',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                cursor: 'pointer'
              }}>
                Browse Insurance Plans
              </button>
            </Link>
          ) : (
            <button 
              onClick={connectWallet}
              style={{
                backgroundColor: 'white',
                color: '#4CAF50',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                cursor: 'pointer'
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;