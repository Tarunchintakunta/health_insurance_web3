import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';

const Header = () => {
  const { account, balance, isConnected, connectWallet, disconnectWallet } = useWeb3();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <header className="bg-primary-800 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 mr-2 text-secondary-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
          <span>DeFi Health</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-secondary-300 transition-colors">Home</Link>
          {isConnected && (
            <>
              <Link to="/insurance" className="hover:text-secondary-300 transition-colors">Insurance Plans</Link>
              <Link to="/dashboard" className="hover:text-secondary-300 transition-colors">Dashboard</Link>
            </>
          )}
          <Link to="/about" className="hover:text-secondary-300 transition-colors">About</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="text-sm text-gray-300">Account</div>
                <div className="text-secondary-300 font-mono">{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</div>
              </div>
              <div className="hidden md:block">
                <div className="text-sm text-gray-300">Balance</div>
                <div className="text-secondary-300">{parseFloat(balance).toFixed(4)} ETH</div>
              </div>
              <button 
                onClick={disconnectWallet}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              className="bg-secondary-600 hover:bg-secondary-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;