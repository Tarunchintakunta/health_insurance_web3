const { ethers } = require('ethers');
const contractABI = require('../contracts/HealthInsurance.json').abi;

module.exports = async (req, res) => {
  try {
    // Setup provider and contract
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

    // Handle GET requests
    if (req.method === 'GET') {
      const address = req.query.address;
      
      if (!address) {
        return res.status(400).json({ error: true, message: 'Ethereum address is required' });
      }
      
      if (!ethers.utils.isAddress(address)) {
        return res.status(400).json({ error: true, message: 'Invalid Ethereum address' });
      }
      
      // Get user policies
      if (req.query.policies === 'true') {
        try {
          const policyIds = await contract.getUserPolicies(address);
          
          const policiesPromises = policyIds.map(async (id) => {
            const policy = await contract.getPolicyDetails(id);
            const plan = await contract.getPlanDetails(policy.planId);
            
            return {
              id: id.toString(),
              planId: policy.planId.toString(),
              planName: plan.name,
              planCategory: plan.category,
              startDate: new Date(policy.startDate.toNumber() * 1000),
              endDate: new Date(policy.endDate.toNumber() * 1000),
              numberOfPeopleCovered: policy.numberOfPeopleCovered.toString(),
              premium: ethers.utils.formatEther(policy.premium),
              active: policy.active,
              isExpired: (policy.endDate.toNumber() * 1000) < Date.now()
            };
          });
          
          const policies = await Promise.all(policiesPromises);
          
          return res.status(200).json(policies);
        } catch (error) {
          return res.status(500).json({ error: true, message: error.message });
        }
      }
      
      // Get user stats
      if (req.query.stats === 'true') {
        try {
          const policyIds = await contract.getUserPolicies(address);
          const policies = await Promise.all(
            policyIds.map(id => contract.getPolicyDetails(id))
          );
          
          // Calculate stats
          const activePolicies = policies.filter(p => p.active).length;
          const expiredPolicies = policies.filter(p => 
            p.active && (p.endDate.toNumber() * 1000) < Date.now()
          ).length;

          // In ethers v5, we need to handle BigNumber
          let totalPremium = ethers.BigNumber.from(0);
          for (const policy of policies) {
            totalPremium = totalPremium.add(policy.premium);
          }
          
          return res.status(200).json({
            address,
            totalPolicies: policyIds.length,
            activePolicies,
            expiredPolicies,
            cancelledPolicies: policyIds.length - activePolicies,
            totalPremiumPaid: ethers.utils.formatEther(totalPremium)
          });
        } catch (error) {
          return res.status(500).json({ error: true, message: error.message });
        }
      }
      
      // Default user endpoint - return simple data
      return res.status(200).json({ address });
    }
    
    // If no valid endpoints matched
    return res.status(404).json({ error: true, message: 'Endpoint not found' });
    
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};