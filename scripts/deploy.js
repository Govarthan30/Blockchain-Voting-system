const { ethers } = require("hardhat");

async function main() {
    const BlockchainVoting = await ethers.getContractFactory("BlockchainVoting");

    // List of candidates to initialize the contract
    const candidates = ["Alice", "Bob", "Charlie", "Gova"];

    // Deploy contract with candidates
    const voting = await BlockchainVoting.deploy(candidates);
    await voting.waitForDeployment();  

    console.log("✅ BlockchainVoting contract deployed at:", voting.target);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
});
