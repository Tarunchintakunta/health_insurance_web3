const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

// Get all policies for a user
router.get('/:address/policies', async (req, res) => {
  try {
    const address = req.params.address;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: true, message: 'Invalid Ethereum address' });
    }
    
    const policyIds = await req.contract.getUserPolicies(address);
    
    const policiesPromises = policyIds.map(async (id) => {
      const policy = await req.contract.getPolicyDetails(id);
      const plan = await req.contract.getPlanDetails(policy.planId);
      
      return {
        id: id.toString(),
        planId: policy.planId.toString(),
        planName: plan.name,
        planCategory: plan.category,
        startDate: new Date(Number(policy.startDate) * 1000),
        endDate: new Date(Number(policy.endDate) * 1000),
        numberOfPeopleCovered: policy.numberOfPeopleCovered.toString(),
        premium: ethers.formatEther(policy.premium),
        active: policy.active,
        isExpired: (Number(policy.endDate) * 1000) < Date.now()
      };
    });
    
    const policies = await Promise.all(policiesPromises);
    
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get user stats
router.get('/:address/stats', async (req, res) => {
  try {
    const address = req.params.address;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: true, message: 'Invalid Ethereum address' });
    }
    
    const policyIds = await req.contract.getUserPolicies(address);
    const policies = await Promise.all(
      policyIds.map(id => req.contract.getPolicyDetails(id))
    );
    
    // Calculate stats
    const activePolicies = policies.filter(p => p.active).length;
    const expiredPolicies = policies.filter(p => 
      p.active && (Number(p.endDate) * 1000) < Date.now()
    ).length;
    
    // In ethers v6, we need to handle BigInt differently
    let totalPremium = ethers.parseEther("0");
    for (const policy of policies) {
      totalPremium += policy.premium;
    }
    
    res.json({
      address,
      totalPolicies: policyIds.length,
      activePolicies,
      expiredPolicies,
      cancelledPolicies: policyIds.length - activePolicies,
      totalPremiumPaid: ethers.formatEther(totalPremium)
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;