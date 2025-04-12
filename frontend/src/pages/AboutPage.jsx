// src/pages/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333' }}>
        About DeFi Health Insurance
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Our Mission
          </h2>
          <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
            DeFi Health Insurance was founded with a mission to revolutionize the health insurance industry 
            through blockchain technology. We're creating a more transparent, efficient, and accessible
            system that works for patients, not profits.
          </p>
          <p style={{ color: '#6c757d', lineHeight: '1.6', marginTop: '1rem' }}>
            By eliminating intermediaries and leveraging smart contracts, we're able to offer lower premiums,
            faster claims processing, and complete transparency in all our operations.
          </p>
        </section>
        
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            How Blockchain Health Insurance Works
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#333' }}>
                Smart Contracts
              </h3>
              <p style={{ color: '#6c757d' }}>
                Our policies are encoded as smart contracts on the Ethereum blockchain, ensuring
                transparent terms and automatic execution.
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#333' }}>
                Decentralized Verification
              </h3>
              <p style={{ color: '#6c757d' }}>
                Claims are verified through a network of validators, eliminating central authorities
                and reducing the risk of fraud.
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#333' }}>
                Immutable Records
              </h3>
              <p style={{ color: '#6c757d' }}>
                All policy details and claims are recorded on the blockchain, creating an
                unalterable record of all transactions.
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#333' }}>
                Automated Payouts
              </h3>
              <p style={{ color: '#6c757d' }}>
                When a claim is approved, funds are automatically released to the policyholder,
                drastically speeding up the payment process.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Key Benefits
          </h2>
          // src/pages/AboutPage.jsx (continued)
          <ul style={{ color: '#6c757d', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Lower Costs:</strong> By eliminating intermediaries and automating processes, we offer premiums that are significantly lower than traditional insurance.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Transparency:</strong> All policy terms, conditions, and claims are publicly visible on the blockchain.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Speed:</strong> Smart contracts automate the claims process, reducing processing times from weeks to minutes.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Security:</strong> Your health data and policy information are kept secure through blockchain technology.
            </li>
            <li>
              <strong>Accessibility:</strong> Our platform is accessible to anyone with an internet connection and a cryptocurrency wallet.
            </li>
          </ul>
        </section>
        
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Getting Started
          </h2>
          <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
            Getting started with DeFi Health Insurance is easy. Just connect your Ethereum wallet, browse our insurance plans, 
            and select the coverage that best fits your needs. You can pay premiums directly with cryptocurrency and manage 
            your policies through our intuitive dashboard.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/insurance">
              <button style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Explore Insurance Plans
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;