// src/pages/PaymentConfirmationPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '../utils/Web3Context';
import Loading from '../components/Loading';

const PaymentConfirmationPage = () => {
  const { contract, account } = useWeb3();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
// src/pages/PaymentConfirmationPage.jsx (continued)
const [txHash, setTxHash] = useState(null);
const [success, setSuccess] = useState(false);

// Get selected plans and total premium from location state
const { selectedPlans, totalPremium } = location.state || { selectedPlans: [], totalPremium: 0 };

// Check if plans exist
if (!selectedPlans || selectedPlans.length === 0) {
  navigate('/insurance');
  return null;
}

// Handle payment
const handlePayment = async () => {
  if (!contract) {
    setError("Contract not initialized. Please make sure your wallet is connected.");
    return;
  }
  
  try {
    setLoading(true);
    setError(null);
    
    // Create an array of promises for each plan purchase
    const purchasePromises = selectedPlans.map(async (plan) => {
      // Convert premium to wei
      const premiumInWei = ethers.utils.parseEther(plan.premium.toString());
      
      // Purchase policy through contract
      const tx = await contract.purchasePolicy(
        plan.id,
        plan.people,
        { value: premiumInWei }
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Return transaction hash
      return {
        planId: plan.id,
        txHash: receipt.transactionHash,
        success: true
      };
    });
    
    // Wait for all transactions to complete
    const results = await Promise.all(purchasePromises);
    
    // Set transaction hash from the first transaction (could display all if needed)
    setTxHash(results[0].txHash);
    setSuccess(true);
    
  } catch (err) {
    console.error('Payment error:', err);
    setError(err.message || 'Transaction failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

// View transaction on Etherscan
const viewOnEtherscan = () => {
  const etherscanUrl = `${import.meta.env.VITE_ETHERSCAN_BASE_URL}/tx/${txHash}`;
  window.open(etherscanUrl, '_blank');
};

// Go to dashboard
const goToDashboard = () => {
  navigate('/dashboard');
};

if (loading) {
  return <Loading message="Processing your transaction. Please wait..." />;
}

return (
  <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '1rem 1.5rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Payment Confirmation</h1>
      </div>
      
      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#e8f5e9',
              color: '#4CAF50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
              Payment Successful!
            </h2>
            <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
              Your insurance policies have been successfully purchased and are now active.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={viewOnEtherscan}
                style={{
                  backgroundColor: '#e8f5e9',
                  color: '#4CAF50',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                View on Etherscan
              </button>
              <button 
                onClick={goToDashboard}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333' }}>
              Order Summary
            </h2>
            
            {error && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1.5rem',
                border: '1px solid #f5c6cb'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '1.5rem' }}>
              {selectedPlans.map((plan) => (
                <div key={plan.id} style={{
                  padding: '1rem 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e9ecef'
                }}>
                  <div>
                    <p style={{ fontWeight: '500', color: '#333' }}>{plan.name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>{plan.category}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                      {plan.people} {plan.people === 1 ? 'person' : 'people'} covered
                    </p>
                  </div>
                  <p style={{ fontWeight: 'bold', color: '#333' }}>{plan.premium.toFixed(6)} ETH</p>
                </div>
              ))}
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#333' }}>Total</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>{totalPremium.toFixed(6)} ETH</p>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6c757d' }}>
                <p>Payment will be made from: {account}</p>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#cce5ff',
              border: '1px solid #b8daff',
              color: '#004085',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <span style={{ fontWeight: 'bold' }}>ℹ️</span>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                You are about to make a blockchain transaction. This will require ETH for gas fees 
                in addition to the premium amount. Please ensure you have sufficient funds.
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handlePayment}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                disabled={loading}
              >
                Confirm Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
};

export default PaymentConfirmationPage;