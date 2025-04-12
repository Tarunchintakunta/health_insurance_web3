// src/pages/InsuranceSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '../utils/Web3Context';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';

const InsuranceSelectionPage = () => {
  const { contract, isConnected, connectWallet } = useWeb3();
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All Categories');
  
  // Fetch plans from the smart contract
  useEffect(() => {
    const fetchPlans = async () => {
      if (!contract) return;
      
      try {
        setLoading(true);
        
        // Get all active plans from contract
        const activePlans = await contract.getActivePlans();
        
        // Process plans data
        const formattedPlans = activePlans.map((plan, index) => ({
          id: index,
          name: plan.name,
          category: plan.category,
          description: plan.description,
          basePremium: plan.basePremium,
          active: plan.active
        }));
        
        setPlans(formattedPlans);
        setError(null);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load insurance plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, [contract]);
  
  // Connect wallet if not connected
  useEffect(() => {
    if (!isConnected) {
      const connect = async () => {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          setError('Please connect your wallet to view insurance plans.');
        }
      };
      
      connect();
    }
  }, [isConnected, connectWallet]);
  
  // Handle plan selection
  const handlePlanSelect = (plan) => {
    if (!plan) {
      // Remove plan from selected plans
      setSelectedPlans(prev => prev.filter(p => p.id !== plan.id));
      return;
    }
    
    // Check if plan is already selected
    const existingPlanIndex = selectedPlans.findIndex(p => p.id === plan.id);
    
    if (existingPlanIndex >= 0) {
      // Update existing plan
      const updatedPlans = [...selectedPlans];
      updatedPlans[existingPlanIndex] = plan;
      setSelectedPlans(updatedPlans);
    } else {
      // Add new plan
      setSelectedPlans(prev => [...prev, plan]);
    }
  };
  
  // Calculate total premium
  const calculateTotalPremium = () => {
    return selectedPlans.reduce((total, plan) => total + plan.premium, 0);
  };
  
  // Proceed to payment
  const handleProceedToPayment = () => {
    if (selectedPlans.length === 0) {
      setError('Please select at least one insurance plan');
      return;
    }
    
    // Navigate to payment page with selected plans
    navigate('/payment', { state: { selectedPlans, totalPremium: calculateTotalPremium() } });
  };
  
  // Get unique categories for filtering
  const categories = ['All Categories', ...new Set(plans.map(plan => plan.category))];
  
  // Filter plans by category
  const filteredPlans = filterCategory === 'All Categories' 
    ? plans 
    : plans.filter(plan => plan.category === filterCategory);
  
  if (loading) {
    return <Loading message="Loading insurance plans..." />;
  }
  
  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
        Select Your Insurance Plans
      </h1>
      <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
        Choose from our range of health insurance plans to create your customized coverage package.
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
      
      {/* Category Filter */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#6c757d', fontWeight: '500' }}>Filter by Category:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: filterCategory === category ? '#4CAF50' : '#e9ecef',
                color: filterCategory === category ? 'white' : '#333'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Plans Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {filteredPlans.length > 0 ? (
          filteredPlans.map(plan => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onSelect={handlePlanSelect} 
            />
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '3rem', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <p style={{ color: '#6c757d', fontSize: '1.125rem' }}>No insurance plans available in this category.</p>
          </div>
        )}
      </div>
      
      {/* Selected Plans Summary */}
      {selectedPlans.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>Selected Plans</h2>
          
          <div>
            {selectedPlans.map(plan => (
              <div key={plan.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: '1px solid #e9ecef'
              }}>
                <div>
                  <p style={{ fontWeight: '500', color: '#333' }}>{plan.name}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                    {plan.people} {plan.people === 1 ? 'person' : 'people'} covered
                  </p>
                </div>
                <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>{plan.premium.toFixed(6)} ETH</p>
              </div>
            ))}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e9ecef'
          }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#333' }}>Total Premium</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>{calculateTotalPremium().toFixed(6)} ETH</p>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleProceedToPayment}
          disabled={selectedPlans.length === 0}
          style={{
            backgroundColor: selectedPlans.length === 0 ? '#e9ecef' : '#4CAF50',
            color: selectedPlans.length === 0 ? '#6c757d' : 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            border: 'none',
            fontWeight: 'bold',
            cursor: selectedPlans.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default InsuranceSelectionPage;