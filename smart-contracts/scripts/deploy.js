const hre = require("hardhat");

async function main() {
  console.log("Deploying HealthInsurance contract...");

  // Deploy the contract
  const HealthInsurance = await hre.ethers.getContractFactory("HealthInsurance");
  const healthInsurance = await HealthInsurance.deploy();

  await healthInsurance.waitForDeployment();

  const contractAddress = await healthInsurance.getAddress();
  console.log(`HealthInsurance deployed to: ${contractAddress}`);

  // Wait for a few block confirmations to ensure deployment is confirmed
  console.log("Waiting for block confirmations...");
  await healthInsurance.deploymentTransaction().wait(5);
  
  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan!");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
  
  // Output important information
  console.log("\n----- Deployment Information -----");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Sepolia Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("-----------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });