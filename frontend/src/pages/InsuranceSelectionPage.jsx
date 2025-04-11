import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '../utils/Web3Context';
import PlanCard from '../components/PlanCard';
import Button from '../components/Button';
import Loading from '../components/Loading';

const InsuranceSelectionPage = () => {
  const { contract, isConnected, connectWallet } = useWeb3();
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  
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
  const categories = ['all', ...new Set(plans.map(plan => plan.category))];
  
  // Filter plans by category
  const filteredPlans = filterCategory === 'all' 
    ? plans 
    : plans.filter(plan => plan.category === filterCategory);
  
  if (loading) {
    return <Loading message="Loading insurance plans..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Select Your Insurance Plans</h1>
          <p className="text-gray-600 mt-2">
            Choose from our range of health insurance plans to create your customized coverage package.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center space-x-2">
            <span className="text-gray-700 font-medium">Filter by Category:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filterCategory === category 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPlans.length > 0 ? (
            filteredPlans.map(plan => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                onSelect={handlePlanSelect} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No insurance plans available in this category.</p>
            </div>
          )}
        </div>
        
        {/* Selected Plans Summary */}
        {selectedPlans.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Selected Plans</h2>
            
            <div className="divide-y divide-gray-200">
              {selectedPlans.map(plan => (
                <div key={plan.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium text-gray-800">{plan.name}</p>
                    <p className="text-sm text-gray-500">{plan.people} {plan.people === 1 ? 'person' : 'people'} covered</p>
                  </div>
                  <p className="font-semibold text-primary-600">{plan.premium.toFixed(6)} ETH</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-800">Total Premium</p>
              <p className="text-xl font-bold text-primary-600">{calculateTotalPremium().toFixed(6)} ETH</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end">
          <Button 
            onClick={handleProceedToPayment}
            disabled={selectedPlans.length === 0}
            variant={selectedPlans.length === 0 ? 'ghost' : 'primary'}
            size="lg"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceSelectionPage;