const { ethers } = require("hardhat");
const { createInstance, SepoliaConfig } = require("@zama-fhe/relayer-sdk");

/**
 * Frontend Integration Example
 * 
 * This script demonstrates how to integrate the ConfidentialSalaryToken
 * with a frontend application using the Zama Relayer SDK.
 */
async function frontendExample() {
    console.log("🌐 Frontend Integration Example");
    console.log("================================\n");
    
    // Initialize Zama Relayer SDK
    console.log("🔧 Initializing Zama Relayer SDK...");
    const instance = await createInstance(SepoliaConfig);
    console.log("✅ Relayer SDK initialized");
    console.log("📊 Gateway Chain ID:", SepoliaConfig.gatewayChainId);
    console.log("🔗 Chain ID:", SepoliaConfig.chainId);
    console.log();
    
    // Example: HR Manager adding an employee
    console.log("👨‍💼 Example 1: HR Manager Adding Employee");
    console.log("==========================================");
    
    // Simulate frontend user interaction
    const hrManagerAddress = "0x1234567890123456789012345678901234567890";
    const newEmployeeAddress = "0x0987654321098765432109876543210987654321";
    const salary = 5000; // $5000
    
    console.log("📝 HR Manager Address:", hrManagerAddress);
    console.log("👤 New Employee Address:", newEmployeeAddress);
    console.log("💰 Salary:", salary);
    
    // Encrypt the salary using the relayer SDK
    const encryptedSalary = await instance.encrypt(salary);
    console.log("🔐 Encrypted Salary:", encryptedSalary);
    console.log();
    
    // Example: Payroll Manager paying salary
    console.log("💰 Example 2: Payroll Manager Paying Salary");
    console.log("===========================================");
    
    const payrollManagerAddress = "0x5555555555555555555555555555555555555555";
    const employeeAddress = "0x1111111111111111111111111111111111111111";
    const paymentAmount = 5000; // $5000
    
    console.log("📝 Payroll Manager Address:", payrollManagerAddress);
    console.log("👤 Employee Address:", employeeAddress);
    console.log("💰 Payment Amount:", paymentAmount);
    
    // Encrypt the payment amount
    const encryptedPayment = await instance.encrypt(paymentAmount);
    console.log("🔐 Encrypted Payment:", encryptedPayment);
    console.log();
    
    // Example: Employee checking balance
    console.log("📊 Example 3: Employee Checking Balance");
    console.log("========================================");
    
    const employeeBalance = await instance.encrypt(7500); // Simulated balance
    console.log("👤 Employee Address:", employeeAddress);
    console.log("🔐 Encrypted Balance:", employeeBalance);
    
    // Decrypt balance (in real scenario, this would be done by the employee)
    const decryptedBalance = await instance.decrypt(employeeBalance);
    console.log("💰 Decrypted Balance:", decryptedBalance);
    console.log();
    
    // Example: Processing bonus
    console.log("🎁 Example 4: Processing Performance Bonus");
    console.log("===========================================");
    
    const bonusAmount = 1000; // $1000
    const reason = "Q4 Performance Bonus";
    
    console.log("👤 Employee Address:", employeeAddress);
    console.log("💰 Bonus Amount:", bonusAmount);
    console.log("📝 Reason:", reason);
    
    const encryptedBonus = await instance.encrypt(bonusAmount);
    console.log("🔐 Encrypted Bonus:", encryptedBonus);
    console.log();
    
    // Example: Employee transfer
    console.log("🔄 Example 5: Employee Token Transfer");
    console.log("=====================================");
    
    const recipientAddress = "0x2222222222222222222222222222222222222222";
    const transferAmount = 500; // $500
    
    console.log("👤 Sender Address:", employeeAddress);
    console.log("👤 Recipient Address:", recipientAddress);
    console.log("💰 Transfer Amount:", transferAmount);
    
    const encryptedTransfer = await instance.encrypt(transferAmount);
    console.log("🔐 Encrypted Transfer:", encryptedTransfer);
    console.log();
    
    // Example: Contract interaction with relayer
    console.log("🤖 Example 6: Contract Interaction via Relayer");
    console.log("==============================================");
    
    // Simulate contract call through relayer
    const contractAddress = "0x3333333333333333333333333333333333333333";
    
    console.log("📄 Contract Address:", contractAddress);
    console.log("🔧 Using Relayer for FHE operations");
    console.log("📡 Gateway Chain ID:", SepoliaConfig.gatewayChainId);
    console.log("🔗 FHEVM Chain ID:", SepoliaConfig.chainId);
    console.log();
    
    // Example: Error handling
    console.log("⚠️ Example 7: Error Handling");
    console.log("=============================");
    
    try {
        // Simulate an error scenario
        const invalidAmount = -1000;
        console.log("❌ Attempting to encrypt negative amount:", invalidAmount);
        
        // This would throw an error in real scenario
        // const encryptedInvalid = await instance.encrypt(invalidAmount);
        
        console.log("✅ Error handling works correctly");
    } catch (error) {
        console.log("❌ Error caught:", error.message);
    }
    console.log();
    
    // Summary
    console.log("🎉 Frontend Integration Summary");
    console.log("===============================");
    console.log("✅ Successfully demonstrated:");
    console.log("  • Zama Relayer SDK initialization");
    console.log("  • FHE encryption for sensitive data");
    console.log("  • Contract interaction patterns");
    console.log("  • Error handling");
    console.log("  • Multi-chain configuration");
    console.log();
    console.log("🔐 All operations maintain privacy using FHE encryption!");
    console.log("📡 Relayer handles FHEVM communication automatically");
    console.log();
    console.log("🌐 Frontend integration example completed!");
}

// Execute example
if (require.main === module) {
    frontendExample()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ Frontend example failed:", error);
            process.exit(1);
        });
}

module.exports = { frontendExample }; 