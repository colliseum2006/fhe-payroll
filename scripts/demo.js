const { ethers } = require("hardhat");
const { createInstance, SepoliaConfig } = require("@zama-fhe/relayer-sdk");

async function main() {
    console.log("🎭 Starting Confidential Salary Token Demo...\n");
    
    // Initialize Zama Relayer SDK
    console.log("🔧 Initializing Zama Relayer SDK...");
    const instance = await createInstance(SepoliaConfig);
    console.log("✅ Relayer SDK initialized with Sepolia config");
    console.log("📊 Gateway Chain ID:", SepoliaConfig.gatewayChainId);
    console.log("🔗 Chain ID:", SepoliaConfig.chainId);
    console.log();
    
    // Get accounts
    const [admin, hrManager, payrollManager, employee1, employee2, employee3] = await ethers.getSigners();
    
    console.log("👥 Demo Participants:");
    console.log("  Admin:", admin.address);
    console.log("  HR Manager:", hrManager.address);
    console.log("  Payroll Manager:", payrollManager.address);
    console.log("  Employee 1:", employee1.address);
    console.log("  Employee 2:", employee2.address);
    console.log("  Employee 3:", employee3.address);
    console.log();
    
    // Deploy contract
    console.log("🚀 Deploying ConfidentialSalaryToken...");
    const ConfidentialSalaryToken = await ethers.getContractFactory("ConfidentialSalaryToken");
    const confidentialSalaryToken = await ConfidentialSalaryToken.deploy(admin.address);
    await confidentialSalaryToken.waitForDeployment();
    
    const contractAddress = await confidentialSalaryToken.getAddress();
    console.log("✅ Contract deployed to:", contractAddress);
    console.log();
    
    // Setup roles
    console.log("🔐 Setting up roles...");
    await confidentialSalaryToken.grantRole(await confidentialSalaryToken.HR_ROLE(), hrManager.address);
    await confidentialSalaryToken.grantRole(await confidentialSalaryToken.PAYROLL_ROLE(), payrollManager.address);
    console.log("✅ Roles assigned successfully");
    console.log();
    
    // Demo 1: Add Employees
    console.log("👨‍💼 Demo 1: Adding Employees");
    console.log("================================");
    
    const salary1 = 5000; // $5000
    const salary2 = 7500; // $7500
    const salary3 = 6000; // $6000
    
    const encryptedSalary1 = await confidentialSalaryToken.encrypt(salary1);
    const encryptedSalary2 = await confidentialSalaryToken.encrypt(salary2);
    const encryptedSalary3 = await confidentialSalaryToken.encrypt(salary3);
    
    await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary1);
    console.log("✅ Added Employee 1 with encrypted salary");
    
    await confidentialSalaryToken.connect(hrManager).addEmployee(employee2.address, encryptedSalary2);
    console.log("✅ Added Employee 2 with encrypted salary");
    
    await confidentialSalaryToken.connect(hrManager).addEmployee(employee3.address, encryptedSalary3);
    console.log("✅ Added Employee 3 with encrypted salary");
    
    console.log("📊 Total employees:", await confidentialSalaryToken.getTotalEmployees());
    console.log();
    
    // Demo 2: Pay Salaries
    console.log("💰 Demo 2: Paying Salaries");
    console.log("================================");
    
    const payment1 = await confidentialSalaryToken.encrypt(salary1);
    const payment2 = await confidentialSalaryToken.encrypt(salary2);
    const payment3 = await confidentialSalaryToken.encrypt(salary3);
    
    await confidentialSalaryToken.connect(payrollManager).paySalary(employee1.address, payment1);
    console.log("✅ Paid salary to Employee 1");
    
    await confidentialSalaryToken.connect(payrollManager).paySalary(employee2.address, payment2);
    console.log("✅ Paid salary to Employee 2");
    
    await confidentialSalaryToken.connect(payrollManager).paySalary(employee3.address, payment3);
    console.log("✅ Paid salary to Employee 3");
    
    // Check balances (encrypted)
    const balance1 = await confidentialSalaryToken.balanceOf(employee1.address);
    const balance2 = await confidentialSalaryToken.balanceOf(employee2.address);
    const balance3 = await confidentialSalaryToken.balanceOf(employee3.address);
    
    console.log("📊 Employee balances (encrypted):");
    console.log("  Employee 1:", balance1);
    console.log("  Employee 2:", balance2);
    console.log("  Employee 3:", balance3);
    console.log();
    
    // Demo 3: Pay Bonuses
    console.log("🎁 Demo 3: Paying Bonuses");
    console.log("================================");
    
    const bonusAmount = 1000; // $1000
    const encryptedBonus = await confidentialSalaryToken.encrypt(bonusAmount);
    
    await confidentialSalaryToken.connect(payrollManager).payBonus(employee1.address, encryptedBonus, "Q4 Performance Bonus");
    console.log("✅ Paid bonus to Employee 1");
    
    await confidentialSalaryToken.connect(payrollManager).payBonus(employee2.address, encryptedBonus, "Outstanding Work Bonus");
    console.log("✅ Paid bonus to Employee 2");
    
    // Check updated balances
    const newBalance1 = await confidentialSalaryToken.balanceOf(employee1.address);
    const newBalance2 = await confidentialSalaryToken.balanceOf(employee2.address);
    
    console.log("📊 Updated balances after bonuses (encrypted):");
    console.log("  Employee 1:", newBalance1);
    console.log("  Employee 2:", newBalance2);
    console.log();
    
    // Demo 4: Process Deductions
    console.log("📉 Demo 4: Processing Deductions");
    console.log("================================");
    
    const deductionAmount = 500; // $500
    const encryptedDeduction = await confidentialSalaryToken.encrypt(deductionAmount);
    
    await confidentialSalaryToken.connect(payrollManager).processDeduction(employee1.address, encryptedDeduction, "Tax Deduction");
    console.log("✅ Processed deduction for Employee 1");
    
    await confidentialSalaryToken.connect(payrollManager).processDeduction(employee2.address, encryptedDeduction, "Insurance Premium");
    console.log("✅ Processed deduction for Employee 2");
    
    // Check final balances
    const finalBalance1 = await confidentialSalaryToken.balanceOf(employee1.address);
    const finalBalance2 = await confidentialSalaryToken.balanceOf(employee2.address);
    const finalBalance3 = await confidentialSalaryToken.balanceOf(employee3.address);
    
    console.log("📊 Final balances after deductions (encrypted):");
    console.log("  Employee 1:", finalBalance1);
    console.log("  Employee 2:", finalBalance2);
    console.log("  Employee 3:", finalBalance3);
    console.log();
    
    // Demo 5: Employee Transfers
    console.log("🔄 Demo 5: Employee Token Transfers");
    console.log("================================");
    
    const transferAmount = 500; // $500
    const encryptedTransfer = await confidentialSalaryToken.encrypt(transferAmount);
    
    await confidentialSalaryToken.connect(employee1).transfer(employee3.address, encryptedTransfer);
    console.log("✅ Employee 1 transferred tokens to Employee 3");
    
    // Check balances after transfer
    const afterTransferBalance1 = await confidentialSalaryToken.balanceOf(employee1.address);
    const afterTransferBalance3 = await confidentialSalaryToken.balanceOf(employee3.address);
    
    console.log("📊 Balances after transfer (encrypted):");
    console.log("  Employee 1:", afterTransferBalance1);
    console.log("  Employee 3:", afterTransferBalance3);
    console.log();
    
    // Demo 6: Update Employee Salary
    console.log("📈 Demo 6: Updating Employee Salary");
    console.log("================================");
    
    const newSalary = 8000; // $8000 (promotion)
    const encryptedNewSalary = await confidentialSalaryToken.encrypt(newSalary);
    
    await confidentialSalaryToken.connect(hrManager).updateEmployeeSalary(employee1.address, encryptedNewSalary);
    console.log("✅ Updated Employee 1 salary (promotion)");
    
    const updatedSalary = await confidentialSalaryToken.getEmployeeSalary(employee1.address);
    console.log("📊 Employee 1 new salary (encrypted):", updatedSalary);
    console.log();
    
    // Demo 7: Remove Employee
    console.log("👋 Demo 7: Removing Employee");
    console.log("================================");
    
    await confidentialSalaryToken.connect(hrManager).removeEmployee(employee3.address);
    console.log("✅ Removed Employee 3");
    
    console.log("📊 Total employees after removal:", await confidentialSalaryToken.getTotalEmployees());
    console.log("❓ Is Employee 3 still active?", await confidentialSalaryToken.isEmployee(employee3.address));
    console.log();
    
    // Demo 8: Pause/Unpause Contract
    console.log("⏸️ Demo 8: Pause/Unpause Functionality");
    console.log("================================");
    
    await confidentialSalaryToken.pause();
    console.log("✅ Contract paused");
    
    console.log("❓ Is contract paused?", await confidentialSalaryToken.paused());
    
    await confidentialSalaryToken.unpause();
    console.log("✅ Contract unpaused");
    
    console.log("❓ Is contract paused?", await confidentialSalaryToken.paused());
    console.log();
    
    // Demo 9: Employee Enumeration
    console.log("📋 Demo 9: Employee Enumeration");
    console.log("================================");
    
    const totalEmployees = await confidentialSalaryToken.getTotalEmployees();
    console.log("📊 Total active employees:", totalEmployees);
    
    for (let i = 0; i < totalEmployees; i++) {
        const employeeAddress = await confidentialSalaryToken.getEmployeeAtIndex(i);
        console.log(`  Employee ${i + 1}:`, employeeAddress);
    }
    console.log();
    
    // Summary
    console.log("🎉 Demo Summary");
    console.log("================================");
    console.log("✅ Successfully demonstrated:");
    console.log("  • Employee management (add/remove/update)");
    console.log("  • Confidential salary payments");
    console.log("  • Bonus payments");
    console.log("  • Deductions processing");
    console.log("  • Employee token transfers");
    console.log("  • Role-based access control");
    console.log("  • Contract pause/unpause");
    console.log("  • Employee enumeration");
    console.log();
    console.log("🔐 All operations maintained privacy using FHE encryption!");
    console.log("📄 Contract Address:", contractAddress);
    console.log();
    console.log("🎭 Demo completed successfully!");
}

// Execute demo
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ Demo failed:", error);
            process.exit(1);
        });
}

module.exports = { main }; 