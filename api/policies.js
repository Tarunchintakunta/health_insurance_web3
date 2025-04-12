const { ethers } = require('ethers');
const contractABI = require('../contracts/HealthInsurance.json').abi;

module.exports = async (req, res) => {
  try {
    // Setup provider and contract
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

    // Handle different routes
    if (req.method === 'GET') {
      // Get specific plan by ID
      if (req.query.planId) {
        try {
          const plan = await contract.getPlanDetails(req.query.planId);
          
          const formattedPlan = {
            id: req.query.planId,
            name: plan.name,
            category: plan.category,
            description: plan.description,
            basePremium: ethers.utils.formatEther(plan.basePremium),
            active: plan.active
          };
          
          return res.status(200).json(formattedPlan);
        } catch (error) {
          return res.status(500).json({ error: true, message: error.message });
        }
      }
      
      // Get specific policy by ID
      if (req.query.policyId) {
        try {
          const policy = await contract.getPolicyDetails(req.query.policyId);
          const plan = await contract.getPlanDetails(policy.planId);
          
          const formattedPolicy = {
            id: req.query.policyId,
            planId: policy.planId.toString(),
            planName: plan.name,
            planCategory: plan.category,
            policyholder: policy.policyholder,
            startDate: new Date(policy.startDate.toNumber() * 1000),
            endDate: new Date(policy.endDate.toNumber() * 1000),
            numberOfPeopleCovered: policy.numberOfPeopleCovered.toString(),
            premium: ethers.utils.formatEther(policy.premium),
            active: policy.active
          };
          
          return res.status(200).json(formattedPolicy);
        } catch (error) {
          return res.status(500).json({ error: true, message: error.message });
        }
      }
      
      // Get all plans
      try {
        const activePlans = await contract.getActivePlans();
        
        const formattedPlans = activePlans.map((plan, index) => ({
          id: index,
          name: plan.name,
          category: plan.category,
          description: plan.description,
          basePremium: ethers.utils.formatEther(plan.basePremium),
          active: plan.active
        }));
        
        return res.status(200).json(formattedPlans);
      } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
      }
    }
    
    // Calculate premium
    if (req.method === 'POST' && req.body.action === 'calculate-premium') {
      try {
        const { planId, numberOfPeopleCovered } = req.body;
        
        if (!planId || !numberOfPeopleCovered) {
          return res.status(400).json({ error: true, message: 'Plan ID and number of people covered are required' });
        }
        
        const premium = await contract.calculatePremium(planId, numberOfPeopleCovered);
        
        return res.status(200).json({
          planId,
          numberOfPeopleCovered,
          premium: ethers.utils.formatEther(premium)
        });
      } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
      }
    }
    
    // If no valid endpoints matched
    return res.status(404).json({ error: true, message: 'Endpoint not found' });
    
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};