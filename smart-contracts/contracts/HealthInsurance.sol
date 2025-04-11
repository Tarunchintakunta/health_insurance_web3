// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract HealthInsurance is Ownable {
    using Strings for uint256;

    // Structs
    struct Plan {
        string name;
        string category;
        string description;
        uint256 basePremium; // in wei
        bool active;
    }

    struct Policy {
        uint256 planId;
        address policyholder;
        uint256 startDate;
        uint256 endDate;
        uint256 numberOfPeopleCovered;
        uint256 premium;
        bool active;
    }

    // State variables
    mapping(uint256 => Plan) public plans;
    mapping(uint256 => Policy) public policies;
    mapping(address => uint256[]) public userPolicies;
    
    uint256 public planCount;
    uint256 public policyCount;
    
    // Events
    event PlanCreated(uint256 planId, string name, string category);
    event PlanUpdated(uint256 planId);
    event PlanDeactivated(uint256 planId);
    event PolicyPurchased(uint256 policyId, address policyholder, uint256 planId, uint256 premium);
    event PolicyRenewed(uint256 policyId, uint256 newEndDate);
    event PolicyCancelled(uint256 policyId);

    // Constructor
    constructor() Ownable(msg.sender) {
        // Initialize with basic plans
        _createPlan("Basic Dental", "Dental", "Basic dental coverage including cleanings and fillings", 0.0001 ether);
        _createPlan("Premium Dental", "Dental", "Premium dental coverage including cleanings, fillings, and root canals", 0.0002 ether);
        _createPlan("Basic Health", "General Health", "Basic health coverage for doctor visits and preventative care", 0.0005 ether);
        _createPlan("Premium Health", "General Health", "Comprehensive health coverage including specialists and emergency care", 0.0008 ether);
        _createPlan("Vision Basic", "Vision", "Basic vision coverage including annual eye exam", 0.0002 ether);
        _createPlan("Vision Plus", "Vision", "Enhanced vision coverage including glasses or contacts", 0.0003 ether);
        _createPlan("Preventative Care", "Preventative Care", "Annual check-ups and screenings", 0.0002 ether);
    }

    // Owner functions
    function createPlan(string memory name, string memory category, string memory description, uint256 basePremium) 
        external 
        onlyOwner 
        returns (uint256)
    {
        return _createPlan(name, category, description, basePremium);
    }

    function updatePlan(uint256 planId, string memory name, string memory category, string memory description, uint256 basePremium, bool active) 
        external 
        onlyOwner 
    {
        require(planId < planCount, "Plan does not exist");
        
        Plan storage plan = plans[planId];
        plan.name = name;
        plan.category = category;
        plan.description = description;
        plan.basePremium = basePremium;
        plan.active = active;
        
        emit PlanUpdated(planId);
    }

    function deactivatePlan(uint256 planId) 
        external 
        onlyOwner 
    {
        require(planId < planCount, "Plan does not exist");
        plans[planId].active = false;
        emit PlanDeactivated(planId);
    }

    // User functions
    function purchasePolicy(uint256 planId, uint256 numberOfPeopleCovered) 
        external 
        payable 
        returns (uint256)
    {
        require(planId < planCount, "Plan does not exist");
        require(plans[planId].active, "Plan is not active");
        require(numberOfPeopleCovered > 0 && numberOfPeopleCovered <= 5, "Number of people covered must be between 1 and 5");
        
        Plan memory plan = plans[planId];
        uint256 premium = calculatePremium(planId, numberOfPeopleCovered);
        
        require(msg.value >= premium, "Insufficient payment");
        
        // Create new policy
        Policy memory newPolicy = Policy({
            planId: planId,
            policyholder: msg.sender,
            startDate: block.timestamp,
            endDate: block.timestamp + 365 days,
            numberOfPeopleCovered: numberOfPeopleCovered,
            premium: premium,
            active: true
        });
        
        policies[policyCount] = newPolicy;
        userPolicies[msg.sender].push(policyCount);
        
        uint256 newPolicyId = policyCount;
        policyCount++;
        
        // Refund excess payment if any
        if (msg.value > premium) {
            payable(msg.sender).transfer(msg.value - premium);
        }
        
        emit PolicyPurchased(newPolicyId, msg.sender, planId, premium);
        
        return newPolicyId;
    }

    function renewPolicy(uint256 policyId) 
        external 
        payable 
    {
        require(policyId < policyCount, "Policy does not exist");
        Policy storage policy = policies[policyId];
        
        require(policy.policyholder == msg.sender, "Not the policyholder");
        require(policy.active, "Policy is not active");
        
        uint256 premium = calculatePremium(policy.planId, policy.numberOfPeopleCovered);
        require(msg.value >= premium, "Insufficient payment");
        
        // Extend policy
        policy.endDate = policy.endDate + 365 days;
        
        // Refund excess payment if any
        if (msg.value > premium) {
            payable(msg.sender).transfer(msg.value - premium);
        }
        
        emit PolicyRenewed(policyId, policy.endDate);
    }

    function cancelPolicy(uint256 policyId) 
        external 
    {
        require(policyId < policyCount, "Policy does not exist");
        Policy storage policy = policies[policyId];
        
        require(policy.policyholder == msg.sender, "Not the policyholder");
        require(policy.active, "Policy is already inactive");
        
        policy.active = false;
        
        emit PolicyCancelled(policyId);
    }

    // View functions
    function calculatePremium(uint256 planId, uint256 numberOfPeopleCovered) 
        public 
        view 
        returns (uint256) 
    {
        require(planId < planCount, "Plan does not exist");
        require(numberOfPeopleCovered > 0 && numberOfPeopleCovered <= 5, "Number of people covered must be between 1 and 5");
        
        Plan memory plan = plans[planId];
        
        // Base premium with discount for multiple people
        uint256 discountFactor = 100 - (numberOfPeopleCovered - 1) * 5; // 5% discount per additional person
        
        return (plan.basePremium * numberOfPeopleCovered * discountFactor) / 100;
    }

    function getUserPolicies(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userPolicies[user];
    }

    function getPolicyDetails(uint256 policyId) 
        external 
        view 
        returns (Policy memory) 
    {
        require(policyId < policyCount, "Policy does not exist");
        return policies[policyId];
    }

    function getPlanDetails(uint256 planId) 
        external 
        view 
        returns (Plan memory) 
    {
        require(planId < planCount, "Plan does not exist");
        return plans[planId];
    }
    
    function getAllPlans() 
        external 
        view 
        returns (Plan[] memory) 
    {
        Plan[] memory allPlans = new Plan[](planCount);
        for (uint256 i = 0; i < planCount; i++) {
            allPlans[i] = plans[i];
        }
        return allPlans;
    }

    function getActivePlans() 
        external 
        view 
        returns (Plan[] memory) 
    {
        // Count active plans
        uint256 activeCount = 0;
        for (uint256 i = 0; i < planCount; i++) {
            if (plans[i].active) {
                activeCount++;
            }
        }
        
        // Create array of active plans
        Plan[] memory activePlans = new Plan[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < planCount; i++) {
            if (plans[i].active) {
                activePlans[currentIndex] = plans[i];
                currentIndex++;
            }
        }
        
        return activePlans;
    }

    // Internal functions
    function _createPlan(string memory name, string memory category, string memory description, uint256 basePremium) 
        internal 
        returns (uint256) 
    {
        plans[planCount] = Plan({
            name: name,
            category: category,
            description: description,
            basePremium: basePremium,
            active: true
        });
        
        uint256 newPlanId = planCount;
        planCount++;
        
        emit PlanCreated(newPlanId, name, category);
        
        return newPlanId;
    }
}