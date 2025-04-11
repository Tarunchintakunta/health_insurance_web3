import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '../utils/Web3Context';
import Button from '../components/Button';
import Loading from '../components/Loading';

const PaymentConfirmationPage = () => {
  const { contract, account } = useWeb3();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary-700 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Payment Confirmation</h1>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Your insurance policies have been successfully purchased and are now active.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button onClick={viewOnEtherscan} variant="secondary">
                    View on Etherscan
                  </Button>
                  <Button onClick={goToDashboard} variant="primary">
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}
                
                <div className="divide-y divide-gray-200 mb-6">
                  {selectedPlans.map((plan) => (
                    <div key={plan.id} className="py-4 flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{plan.name}</p>
                        <p className="text-sm text-gray-500">{plan.category}</p>
                        <p className="text-sm text-gray-500">{plan.people} {plan.people === 1 ? 'person' : 'people'} covered</p>
                      </div>
                      <p className="font-semibold text-gray-800">{plan.premium.toFixed(6)} ETH</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium text-gray-700">Total</p>
                    <p className="text-xl font-bold text-primary-700">{totalPremium.toFixed(6)} ETH</p>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Payment will be made from: {account}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">
                        You are about to make a blockchain transaction. This will require ETH for gas fees 
                        in addition to the premium amount. Please ensure you have sufficient funds.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handlePayment}
                    variant="primary"
                    size="lg"
                    disabled={loading}
                  >
                    Confirm Payment
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage;