const { ethers } = require("hardhat");
const { createInstance, SepoliaConfig } = require("@zama-fhe/relayer-sdk");

async function main() {
    console.log("🚀 Deploying ConfidentialSalaryToken to Sepolia...");
    
    // Initialize Zama Relayer SDK
    console.log("🔧 Initializing Zama Relayer SDK...");
    const instance = await createInstance(SepoliaConfig);
    console.log("✅ Relayer SDK initialized with Sepolia config");
    console.log("📊 Gateway Chain ID:", SepoliaConfig.gatewayChainId);
    console.log("🔗 Chain ID:", SepoliaConfig.chainId);
    console.log();
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
    
    // Contract parameters
    const tokenName = "Confidential Salary Token";
    const tokenSymbol = "CST";
    const tokenURI = "https://api.example.com/metadata/";
    const admin = deployer.address;
    
    console.log("📋 Contract Parameters:");
    console.log("  Name:", tokenName);
    console.log("  Symbol:", tokenSymbol);
    console.log("  Token URI:", tokenURI);
    console.log("  Admin:", admin);
    console.log();
    
    // Deploy the ConfidentialSalaryToken contract
    const ConfidentialSalaryToken = await ethers.getContractFactory("ConfidentialSalaryToken");
    const confidentialSalaryToken = await ConfidentialSalaryToken.deploy(
        tokenName,
        tokenSymbol,
        tokenURI,
        admin
    );
    await confidentialSalaryToken.waitForDeployment();
    
    const contractAddress = await confidentialSalaryToken.getAddress();
    console.log("✅ ConfidentialSalaryToken deployed to:", contractAddress);
    
    // Log role constants
    console.log("\n📋 Role Constants:");
    console.log("HR_ROLE:", await confidentialSalaryToken.HR_ROLE());
    console.log("PAYROLL_ROLE:", await confidentialSalaryToken.PAYROLL_ROLE());
    console.log("ADMIN_ROLE:", await confidentialSalaryToken.ADMIN_ROLE());
    
    // Verify roles are set correctly
    console.log("\n🔐 Initial Roles:");
    console.log("Deployer has DEFAULT_ADMIN_ROLE:", await confidentialSalaryToken.hasRole(await confidentialSalaryToken.DEFAULT_ADMIN_ROLE(), deployer.address));
    console.log("Deployer has ADMIN_ROLE:", await confidentialSalaryToken.hasRole(await confidentialSalaryToken.ADMIN_ROLE(), deployer.address));
    
    // Log token information
    console.log("\n🪙 Token Information:");
    console.log("Name:", await confidentialSalaryToken.name());
    console.log("Symbol:", await confidentialSalaryToken.symbol());
    console.log("Token URI:", await confidentialSalaryToken.tokenURI());
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("📄 Contract Address:", contractAddress);
    console.log("🌐 Sepolia Explorer: https://sepolia.etherscan.io/address/" + contractAddress);
    
    return {
        confidentialSalaryToken,
        contractAddress,
        tokenName,
        tokenSymbol,
        tokenURI
    };
}

// Execute deployment
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ Deployment failed:", error);
            process.exit(1);
        });
}

module.exports = { main }; 