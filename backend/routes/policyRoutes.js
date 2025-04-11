const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

// Get all active plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await req.contract.getActivePlans();
    
    const formattedPlans = plans.map((plan, index) => ({
      id: index,
      name: plan.name,
      category: plan.category,
      description: plan.description,
      basePremium: ethers.formatEther(plan.basePremium),
      active: plan.active
    }));
    
    res.json(formattedPlans);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get plan details by ID
router.get('/plans/:id', async (req, res) => {
  try {
    const plan = await req.contract.getPlanDetails(req.params.id);
    
    const formattedPlan = {
      id: req.params.id,
      name: plan.name,
      category: plan.category,
      description: plan.description,
      basePremium: ethers.formatEther(plan.basePremium),
      active: plan.active
    };
    
    res.json(formattedPlan);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get policy details by ID
router.get('/:id', async (req, res) => {
  try {
    const policy = await req.contract.getPolicyDetails(req.params.id);
    const plan = await req.contract.getPlanDetails(policy.planId);
    
    const formattedPolicy = {
      id: req.params.id,
      planId: policy.planId.toString(),
      planName: plan.name,
      planCategory: plan.category,
      policyholder: policy.policyholder,
      startDate: new Date(Number(policy.startDate) * 1000),
      endDate: new Date(Number(policy.endDate) * 1000),
      numberOfPeopleCovered: policy.numberOfPeopleCovered.toString(),
      premium: ethers.formatEther(policy.premium),
      active: policy.active
    };
    
    res.json(formattedPolicy);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Calculate premium for a plan
router.post('/calculate-premium', async (req, res) => {
  try {
    const { planId, numberOfPeopleCovered } = req.body;
    
    if (!planId || !numberOfPeopleCovered) {
      return res.status(400).json({ error: true, message: 'Plan ID and number of people covered are required' });
    }
    
    const premium = await req.contract.calculatePremium(planId, numberOfPeopleCovered);
    
    res.json({
      planId,
      numberOfPeopleCovered,
      premium: ethers.formatEther(premium)
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;