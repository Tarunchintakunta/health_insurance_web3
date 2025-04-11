import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import HealthInsuranceABI from '../contracts/HealthInsurance.json';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const sepoliaChainId = '0xaa36a7'; // 11155111 in decimal, 0xaa36a7 in hex

  const connectWallet = async () => {
    try {
      setError(null);
      
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this application");
      }
      
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock your MetaMask wallet.");
      }
      
      // Get network information
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdDecimal = parseInt(chainIdHex, 16);
      setChainId(chainIdDecimal);
      
      // Check if connected to Sepolia
      if (chainIdHex !== sepoliaChainId) {
        try {
          // Try to switch to Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: sepoliaChainId }],
          });
        } catch (switchError) {
          // If Sepolia is not added to MetaMask, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: sepoliaChainId,
                  chainName: 'Sepolia Testnet',
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                },
              ],
            });
          } else {
            throw new Error("Failed to switch to the Sepolia network");
          }
        }
      }
      
      // Initialize ethers with MetaMask provider
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      const ethSigner = ethProvider.getSigner();
      const healthInsuranceContract = new ethers.Contract(
        contractAddress,
        HealthInsuranceABI.abi,
        ethSigner
      );
      
      // Get user account and balance
      const userAddress = accounts[0];
      const userBalance = await ethProvider.getBalance(userAddress);
      const formattedBalance = ethers.utils.formatEther(userBalance);
      
      // Set state
      setAccount(userAddress);
      setBalance(formattedBalance);
      setProvider(ethProvider);
      setSigner(ethSigner);
      setContract(healthInsuranceContract);
      setIsConnected(true);
      
      return {
        account: userAddress,
        balance: formattedBalance
      };
    } catch (error) {
      console.error("Wallet connection error:", error);
      setError(error.message || "Failed to connect wallet");
      setIsConnected(false);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setSigner(null);
    setContract(null);
    setIsConnected(false);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          // User has disconnected their wallet
          disconnectWallet();
        } else if (isConnected) {
          // User has switched accounts
          setAccount(accounts[0]);
          // Update balance
          if (provider) {
            provider.getBalance(accounts[0]).then(balance => {
              setBalance(ethers.utils.formatEther(balance));
            });
          }
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        // Handle chain change
        window.location.reload();
      });

      // Cleanup
      return () => {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      };
    }
  }, [isConnected, provider]);

  const value = {
    account,
    balance,
    provider,
    signer,
    contract,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
    chainId
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};