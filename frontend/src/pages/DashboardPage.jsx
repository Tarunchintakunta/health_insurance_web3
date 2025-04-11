import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '../utils/Web3Context';
import Button from '../components/Button';
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Insurance Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your active policies, view your coverage details, and renew your plans.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'active'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Policies
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'expired'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Expired Policies
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'cancelled'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cancelled Policies
            </button>
          </nav>
        </div>
        
        {/* Policies List */}
        {filteredPolicies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'active' && "You don't have any active insurance policies."}
              {activeTab === 'expired' && "You don't have any expired policies that need renewal."}
              {activeTab === 'cancelled' && "You don't have any cancelled policies."}
            </p>
            <Link to="/insurance">
              <Button variant="primary">Browse Insurance Plans</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredPolicies.map((policy) => (
                <li key={policy.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-800">{policy.planName}</h3>
                        <span className="ml-3 bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {policy.planCategory}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Policy ID:</span> #{policy.id}
                        </div>
                        <div>
                          <span className="text-gray-500">Premium:</span> {policy.premium} ETH
                        </div>
                        <div>
                          <span className="text-gray-500">Coverage:</span> {policy.numberOfPeopleCovered} {policy.numberOfPeopleCovered === 1 ? 'person' : 'people'}
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span> 
                          {policy.active && !policy.isExpired && (
                            <span className="text-green-600 font-medium">Active</span>
                          )}
                          {policy.active && policy.isExpired && (
                            <span className="text-red-600 font-medium">Expired</span>
                          )}
                          {!policy.active && (
                            <span className="text-gray-600 font-medium">Cancelled</span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Start Date:</span> {formatDate(policy.startDate)}
                        </div>
                        <div>
                          <span className="text-gray-500">End Date:</span> {formatDate(policy.endDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      {policy.active && policy.isExpired && (
                        <Button 
                          onClick={() => handleRenewPolicy(policy.id, policy.premium)}
                          variant="success"
                          size="sm"
                        >
                          Renew Policy
                        </Button>
                      )}
                      {policy.active && !policy.isExpired && (
                        <Button 
                          onClick={() => handleCancelPolicy(policy.id)}
                          variant="danger"
                          size="sm"
                        >
                          Cancel Policy
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Purchase More Button */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Looking for additional coverage?</p>
          <Link to="/insurance">
            <Button variant="primary">Browse More Insurance Plans</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;