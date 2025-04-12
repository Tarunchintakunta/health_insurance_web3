// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '../utils/Web3Context';
import Loading from '../components/Loading';

const DashboardPage = () => {
  const { contract, account, isConnected, connectWallet } = useWeb3();
  
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  
  // Connect wallet if not connected
  useEffect(() => {
    if (!isConnected) {
      const connect = async () => {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          setError('Please connect your wallet to view your dashboard.');
        }
      };
      
      connect();
    }
  }, [isConnected, connectWallet]);
  
  // Fetch user policies
  useEffect(() => {
    const fetchPolicies = async () => {
      if (!contract || !account) return;
      
      try {
        setLoading(true);
        
        // Get policy IDs for the user
        const policyIds = await contract.getUserPolicies(account);
        
        // Get details for each policy
        const policyPromises = policyIds.map(async (id) => {
          const policyData = await contract.getPolicyDetails(id);
          const planData = await contract.getPlanDetails(policyData.planId);
          
          // Format dates
          const startDate = new Date(policyData.startDate.toNumber() * 1000);
          const endDate = new Date(policyData.endDate.toNumber() * 1000);
          
          return {
            id: id.toNumber(),
            planId: policyData.planId.toNumber(),
            planName: planData.name,
            planCategory: planData.category,
            startDate,
            endDate,
            numberOfPeopleCovered: policyData.numberOfPeopleCovered.toNumber(),
            premium: ethers.utils.formatEther(policyData.premium),
            active: policyData.active,
            isExpired: endDate < new Date()
          };
        });
        
        const policiesData = await Promise.all(policyPromises);
        setPolicies(policiesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching policies:', err);
        setError('Failed to load your policies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPolicies();
  }, [contract, account]);
  
  // Handle policy renewal
  const handleRenewPolicy = async (policyId, premium) => {
    if (!contract) return;
    
    try {
      setLoading(true);
      
      // Convert premium to wei
      const premiumInWei = ethers.utils.parseEther(premium.toString());
      
      // Renew policy
      const tx = await contract.renewPolicy(policyId, { value: premiumInWei });
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Refresh policies
      const policyData = await contract.getPolicyDetails(policyId);
      const endDate = new Date(policyData.endDate.toNumber() * 1000);
      
      // Update policy in state
      setPolicies(prev => 
        prev.map(policy => 
          policy.id === policyId 
            ? { ...policy, endDate, isExpired: false } 
            : policy
        )
      );
      
      setError(null);
    } catch (err) {
      console.error('Renewal error:', err);
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle policy cancellation
  const handleCancelPolicy = async (policyId) => {
    if (!contract) return;
    
    try {
      setLoading(true);
      
      // Cancel policy
      const tx = await contract.cancelPolicy(policyId);
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Update policy in state
      setPolicies(prev => 
        prev.map(policy => 
          policy.id === policyId 
            ? { ...policy, active: false } 
            : policy
        )
      );
      
      setError(null);
    } catch (err) {
      console.error('Cancellation error:', err);
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter policies based on active tab
  const filteredPolicies = policies.filter(policy => {
    if (activeTab === 'active') return policy.active && !policy.isExpired;
    if (activeTab === 'expired') return policy.active && policy.isExpired;
    if (activeTab === 'cancelled') return !policy.active;
    return true;
  });
  
  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <Loading message="Loading your policies..." />;
  }
  
  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
        Your Insurance Dashboard
      </h1>
      <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
        Manage your active policies, view your coverage details, and renew your plans.
      </p>
      
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
      
      {/* Tabs */}
      <div style={{ 
        borderBottom: '1px solid #dee2e6',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '1rem 0.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'active' ? '2px solid #4CAF50' : '2px solid transparent',
            color: activeTab === 'active' ? '#4CAF50' : '#6c757d',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Active Policies
        </button>
        <button
          onClick={() => setActiveTab('expired')}
          style={{
            padding: '1rem 0.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'expired' ? '2px solid #4CAF50' : '2px solid transparent',
            color: activeTab === 'expired' ? '#4CAF50' : '#6c757d',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Expired Policies
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          style={{
            padding: '1rem 0.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'cancelled' ? '2px solid #4CAF50' : '2px solid transparent',
            color: activeTab === 'cancelled' ? '#4CAF50' : '#6c757d',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Cancelled Policies
        </button>
      </div>
      
      {/* Policies List */}
      {filteredPolicies.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#f8f9fa',
            color: '#adb5bd',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2rem'
          }}>
            📄
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
            No policies found
          </h3>
          <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
            {activeTab === 'active' && "You don't have any active insurance policies."}
            {activeTab === 'expired' && "You don't have any expired policies that need renewal."}
            {activeTab === 'cancelled' && "You don't have any cancelled policies."}
          </p>
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
              Browse Insurance Plans
            </button>
          </Link>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ 
                  padding: '1rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  color: '#6c757d',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  PLAN DETAILS
                </th>
                <th style={{ 
                  padding: '1rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  color: '#6c757d',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  COVERAGE
                </th>
                <th style={{ 
                  padding: '1rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  color: '#6c757d',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  DATES
                </th>
                <th style={{ 
                  padding: '1rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  color: '#6c757d',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  PREMIUM
                </th>
                <th style={{ 
                  padding: '1rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  color: '#6c757d',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  STATUS
                </th>
                <th style={{ 
                  padding: '1rem',
                  textAlign: 'right',
                  borderBottom: '1px solid #dee2e6',
                  color: '#6c757d',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((policy) => (
                <tr key={policy.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                    <div style={{ fontWeight: '500', color: '#333' }}>{policy.planName}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>{policy.planCategory}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>ID: {policy.id}</div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                    <div style={{ color: '#333' }}>
                      {policy.numberOfPeopleCovered} {policy.numberOfPeopleCovered === 1 ? 'person' : 'people'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                    <div style={{ color: '#333' }}>From: {formatDate(policy.startDate)}</div>
                    <div style={{ color: '#333' }}>To: {formatDate(policy.endDate)}</div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6', color: '#333' }}>
                    {policy.premium} ETH
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                    {policy.active && !policy.isExpired && (
                      <span style={{ 
                        backgroundColor: '#e8f5e9', 
                        color: '#388e3c',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        Active
                      </span>
                    )}
                    {policy.active && policy.isExpired && (
                      <span style={{ 
                        backgroundColor: '#ffebee', 
                        color: '#d32f2f',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        Expired
                      </span>
                    )}
                    {!policy.active && (
                      <span style={{ 
                        backgroundColor: '#f5f5f5', 
                        color: '#757575',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>
                    {policy.active && policy.isExpired && (
                      <button 
                        onClick={() => handleRenewPolicy(policy.id, policy.premium)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#4CAF50',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '500',
                          marginRight: '1rem'
                        }}
                      >
                        Renew
                      </button>
                    )}
                    {policy.active && !policy.isExpired && (
                      <button 
                        onClick={() => handleCancelPolicy(policy.id)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#f44336',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Purchase More Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#6c757d', marginBottom: '1rem' }}>Looking for additional coverage?</p>
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
            Browse More Insurance Plans
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;