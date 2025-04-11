import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import Button from '../components/Button';

const LandingPage = () => {
  const { connectWallet, isConnected, balance } = useWeb3();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Decentralized Health Insurance for the Digital Age
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Secure, transparent, and affordable health coverage powered by blockchain technology.
                Take control of your health insurance with no middlemen.
              </p>
              
              {isConnected ? (
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-gray-300 mb-1">Your Balance</p>
                    <p className="text-2xl font-semibold">{parseFloat(balance).toFixed(4)} ETH</p>
                  </div>
                  <Link to="/insurance">
                    <Button size="lg" variant="secondary">
                      View Insurance Plans
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button 
                  onClick={handleConnect} 
                  size="lg"
                  variant="secondary"
                >
                  Connect Your Wallet
                </Button>
              )}
            </div>
            
            <div className="lg:w-1/2 lg:pl-12">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" 
                  alt="Health insurance" 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Why Choose DeFi Health?</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Lower premiums with no intermediaries
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Transparent claims processing
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Immutable policy records on blockchain
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Self-executing smart contracts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How DeFi Health Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">1. Connect Wallet</h3>
              <p className="text-gray-600">
                Connect your Ethereum wallet to access our decentralized insurance platform securely.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">2. Choose a Plan</h3>
              <p className="text-gray-600">
                Browse and select from various insurance plans tailored to your health needs.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">3. Pay Premium</h3>
              <p className="text-gray-600">
                Pay your premium directly with cryptocurrency. Transactions are secure and transparent.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button onClick={isConnected ? () => {} : handleConnect} variant="primary" size="lg">
              {isConnected ? <Link to="/insurance">Get Started</Link> : "Connect Wallet to Begin"}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-primary-50 rounded-lg p-6">
              <div className="text-primary-600 mb-4">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Secure & Private</h3>
              <p className="text-gray-600">
                Your health data and policy information are kept secure on the blockchain.
              </p>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-6">
              <div className="text-primary-600 mb-4">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Lightning Fast</h3>
              <p className="text-gray-600">
                Quick policy activation and claim processing with smart contracts.
              </p>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-6">
              <div className="text-primary-600 mb-4">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Cost Effective</h3>
              <p className="text-gray-600">
                Lower premiums by eliminating intermediaries and reducing overhead costs.
              </p>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-6">
              <div className="text-primary-600 mb-4">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Transparent</h3>
              <p className="text-gray-600">
                All transactions and policy details are verifiable on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">How does blockchain-based health insurance work?</h3>
              <p className="text-gray-600">
                Blockchain health insurance uses smart contracts to automate policy management, premium payments, and claims processing, 
                eliminating the need for intermediaries and reducing costs.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">What cryptocurrency do I need to purchase a policy?</h3>
              <p className="text-gray-600">
                Our platform uses Ethereum (ETH) on the Sepolia testnet for all transactions. You'll need a small amount of test ETH to purchase policies.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">How are claims processed?</h3>
              <p className="text-gray-600">
                Claims are submitted through our platform and verified by a decentralized network of validators. 
                Once approved, payments are automatically processed through the smart contract.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Is my health data secure?</h3>
              <p className="text-gray-600">
                Yes, your health data is encrypted and stored securely on the blockchain. Only you and authorized parties 
                can access your information through cryptographic keys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to experience the future of health insurance?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already discovered the benefits of decentralized health insurance.
          </p>
          <Button onClick={isConnected ? () => {} : handleConnect} variant="secondary" size="lg">
            {isConnected ? <Link to="/insurance">View Available Plans</Link> : "Connect Wallet Now"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;