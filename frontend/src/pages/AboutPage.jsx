import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About DeFi Health</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're revolutionizing the health insurance industry with blockchain technology,
            creating a more transparent, efficient, and accessible system for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                DeFi Health was founded with a simple yet powerful mission: to make health insurance more accessible, 
                affordable, and transparent through blockchain technology.
              </p>
              <p className="text-gray-600 mb-4">
                Traditional health insurance is plagued by high costs, complex claims processes, and lack of transparency.
                We're changing that by leveraging the power of smart contracts to automate processes, 
                reduce overhead, and create a system that works for patients, not profits.
              </p>
              <p className="text-gray-600">
                By cutting out intermediaries and using blockchain's inherent transparency, we're able to offer lower premiums,
                faster claims processing, and a level of trust that's impossible in traditional systems.
              </p>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Team collaboration" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How Blockchain Insurance Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 text-primary-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Contracts</h3>
              <p className="text-gray-600">
                Our insurance policies are encoded as smart contracts on the Ethereum blockchain, 
                ensuring that all terms are transparent and automatically executed.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 text-primary-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Decentralized Verification</h3>
              <p className="text-gray-600">
                Claims are verified by a network of validators, eliminating the need for a central
                authority and reducing the risk of fraud or bias.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 text-primary-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Immutable Records</h3>
              <p className="text-gray-600">
                All policy details and claims are recorded on the blockchain, creating an 
                immutable record that can't be altered or disputed.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 text-primary-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold text-lg">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Automated Payouts</h3>
              <p className="text-gray-600">
                When a claim is approved, the smart contract automatically releases funds to the 
                policyholder, speeding up the payment process significantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Blockchain Insurance</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Lower Costs</h3>
              <p className="text-gray-600">
                By eliminating intermediaries and automating processes, we can offer premiums 
                that are significantly lower than traditional insurance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Faster Processing</h3>
              <p className="text-gray-600">
                Smart contracts automate the claims process, reducing processing times from 
                weeks to minutes in many cases.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Full Transparency</h3>
              <p className="text-gray-600">
                All policy terms, conditions, and claim processes are publicly visible on the 
                blockchain, creating unprecedented transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Team</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Team member" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
                <p className="text-primary-600 mb-4">Founder & CEO</p>
                <p className="text-gray-600">
                  Former insurance executive with 15 years of experience, 
                  now pioneering the blockchain insurance revolution.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Team member" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Jane Smith</h3>
                <p className="text-primary-600 mb-4">CTO</p>
                <p className="text-gray-600">
                  Blockchain expert with a background in cryptography and 
                  smart contract development for financial applications.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Team member" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Michael Johnson</h3>
                <p className="text-primary-600 mb-4">Chief Medical Officer</p>
                <p className="text-gray-600">
                  Medical doctor with a passion for healthtech innovation 
                  and improving patient care through technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to experience the future of health insurance?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our platform today and discover how blockchain technology 
            can transform your healthcare experience.
          </p>
          <Link to="/insurance">
            <Button variant="secondary" size="lg">
              Explore Our Plans
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;