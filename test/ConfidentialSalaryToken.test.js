const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfidentialSalaryToken", function () {
    let confidentialSalaryToken;
    let owner, hrManager, payrollManager, employee1, employee2, employee3;
    
    // Test values
    const salary1 = 5000; // $5000
    const salary2 = 7500; // $7500
    const salary3 = 6000; // $6000
    const bonusAmount = 1000; // $1000
    const deductionAmount = 500; // $500
    
    beforeEach(async function () {
        [owner, hrManager, payrollManager, employee1, employee2, employee3] = await ethers.getSigners();
        
        const ConfidentialSalaryToken = await ethers.getContractFactory("ConfidentialSalaryToken");
        confidentialSalaryToken = await ConfidentialSalaryToken.deploy(owner.address);
        await confidentialSalaryToken.waitForDeployment();
        
        // Grant roles
        await confidentialSalaryToken.grantRole(await confidentialSalaryToken.HR_ROLE(), hrManager.address);
        await confidentialSalaryToken.grantRole(await confidentialSalaryToken.PAYROLL_ROLE(), payrollManager.address);
    });
    
    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
            expect(await confidentialSalaryToken.hasRole(await confidentialSalaryToken.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
            expect(await confidentialSalaryToken.hasRole(await confidentialSalaryToken.ADMIN_ROLE(), owner.address)).to.be.true;
        });
        
        it("Should have correct role constants", async function () {
            expect(await confidentialSalaryToken.HR_ROLE()).to.equal(ethers.keccak256(ethers.toUtf8Bytes("HR_ROLE")));
            expect(await confidentialSalaryToken.PAYROLL_ROLE()).to.equal(ethers.keccak256(ethers.toUtf8Bytes("PAYROLL_ROLE")));
            expect(await confidentialSalaryToken.ADMIN_ROLE()).to.equal(ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE")));
        });
    });
    
    describe("Role Management", function () {
        it("Should grant HR role correctly", async function () {
            expect(await confidentialSalaryToken.hasRole(await confidentialSalaryToken.HR_ROLE(), hrManager.address)).to.be.true;
        });
        
        it("Should grant Payroll role correctly", async function () {
            expect(await confidentialSalaryToken.hasRole(await confidentialSalaryToken.PAYROLL_ROLE(), payrollManager.address)).to.be.true;
        });
        
        it("Should revoke roles correctly", async function () {
            await confidentialSalaryToken.revokeRole(await confidentialSalaryToken.HR_ROLE(), hrManager.address);
            expect(await confidentialSalaryToken.hasRole(await confidentialSalaryToken.HR_ROLE(), hrManager.address)).to.be.false;
        });
    });
    
    describe("Employee Management", function () {
        it("Should add employee correctly", async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            
            await expect(confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary))
                .to.emit(confidentialSalaryToken, "EmployeeAdded")
                .withArgs(employee1.address, encryptedSalary);
            
            expect(await confidentialSalaryToken.isEmployee(employee1.address)).to.be.true;
            expect(await confidentialSalaryToken.getTotalEmployees()).to.equal(1);
        });
        
        it("Should not allow non-HR to add employee", async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            
            await expect(
                confidentialSalaryToken.connect(employee1).addEmployee(employee2.address, encryptedSalary)
            ).to.be.revertedWithCustomError(confidentialSalaryToken, "UnauthorizedOperation");
        });
        
        it("Should not add employee with zero address", async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            
            await expect(
                confidentialSalaryToken.connect(hrManager).addEmployee(ethers.ZeroAddress, encryptedSalary)
            ).to.be.revertedWithCustomError(confidentialSalaryToken, "EmployeeNotFound");
        });
        
        it("Should not add duplicate employee", async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary);
            
            await expect(
                confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary)
            ).to.be.revertedWithCustomError(confidentialSalaryToken, "EmployeeAlreadyExists");
        });
        
        it("Should remove employee correctly", async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary);
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee2.address, encryptedSalary);
            
            await expect(confidentialSalaryToken.connect(hrManager).removeEmployee(employee1.address))
                .to.emit(confidentialSalaryToken, "EmployeeRemoved")
                .withArgs(employee1.address);
            
            expect(await confidentialSalaryToken.isEmployee(employee1.address)).to.be.false;
            expect(await confidentialSalaryToken.getTotalEmployees()).to.equal(1);
        });
        
        it("Should update employee salary correctly", async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            const newEncryptedSalary = await confidentialSalaryToken.encrypt(salary2);
            
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary);
            
            await expect(confidentialSalaryToken.connect(hrManager).updateEmployeeSalary(employee1.address, newEncryptedSalary))
                .to.emit(confidentialSalaryToken, "SalaryUpdated")
                .withArgs(employee1.address, newEncryptedSalary);
        });
    });
    
    describe("Salary Payments", function () {
        beforeEach(async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary);
        });
        
        it("Should pay salary correctly", async function () {
            const paymentAmount = await confidentialSalaryToken.encrypt(salary1);
            
            await expect(confidentialSalaryToken.connect(payrollManager).paySalary(employee1.address, paymentAmount))
                .to.emit(confidentialSalaryToken, "SalaryPaid")
                .withArgs(employee1.address, paymentAmount);
            
            const balance = await confidentialSalaryToken.balanceOf(employee1.address);
            expect(await confidentialSalaryToken.decrypt(balance)).to.equal(salary1);
        });
        
        it("Should not allow non-payroll to pay salary", async function () {
            const paymentAmount = await confidentialSalaryToken.encrypt(salary1);
            
            await expect(
                confidentialSalaryToken.connect(employee1).paySalary(employee1.address, paymentAmount)
            ).to.be.revertedWithCustomError(confidentialSalaryToken, "UnauthorizedOperation");
        });
        
        it("Should not pay salary to non-employee", async function () {
            const paymentAmount = await confidentialSalaryToken.encrypt(salary1);
            
            await expect(
                confidentialSalaryToken.connect(payrollManager).paySalary(employee2.address, paymentAmount)
            ).to.be.revertedWithCustomError(confidentialSalaryToken, "EmployeeNotFound");
        });
    });
    
    describe("Bonus Payments", function () {
        beforeEach(async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary);
        });
        
        it("Should pay bonus correctly", async function () {
            const bonusEncrypted = await confidentialSalaryToken.encrypt(bonusAmount);
            const reason = "Q4 Performance Bonus";
            
            await expect(confidentialSalaryToken.connect(payrollManager).payBonus(employee1.address, bonusEncrypted, reason))
                .to.emit(confidentialSalaryToken, "BonusPaid")
                .withArgs(employee1.address, bonusEncrypted, reason);
            
            const balance = await confidentialSalaryToken.balanceOf(employee1.address);
            expect(await confidentialSalaryToken.decrypt(balance)).to.equal(bonusAmount);
        });
        
        it("Should not allow non-payroll to pay bonus", async function () {
            const bonusEncrypted = await confidentialSalaryToken.encrypt(bonusAmount);
            
            await expect(
                confidentialSalaryToken.connect(employee1).payBonus(employee1.address, bonusEncrypted, "Bonus")
            ).to.be.revertedWithCustomError(confidentialSalaryToken, "UnauthorizedOperation");
        });
    });
    
    describe("Deductions", function () {
        beforeEach(async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary);
            
            // Pay salary first so employee has balance
            const paymentAmount = await confidentialSalaryToken.encrypt(salary1);
            await confidentialSalaryToken.connect(payrollManager).paySalary(employee1.address, paymentAmount);
        });
        
        it("Should process deduction correctly", async function () {
            const deductionEncrypted = await confidentialSalaryToken.encrypt(deductionAmount);
            const reason = "Tax Deduction";
            
            await expect(confidentialSalaryToken.connect(payrollManager).processDeduction(employee1.address, deductionEncrypted, reason))
                .to.emit(confidentialSalaryToken, "DeductionProcessed")
                .withArgs(employee1.address, deductionEncrypted, reason);
            
            const balance = await confidentialSalaryToken.balanceOf(employee1.address);
            expect(await confidentialSalaryToken.decrypt(balance)).to.equal(salary1 - deductionAmount);
        });
        
        it("Should not allow non-payroll to process deduction", async function () {
            const deductionEncrypted = await confidentialSalaryToken.encrypt(deductionAmount);
            
            await expect(
                confidentialSalaryToken.connect(employee1).processDeduction(employee1.address, deductionEncrypted, "Deduction")
            ).to.be.revertedWithCustomError(confidentialSalaryToken, "UnauthorizedOperation");
        });
    });
    
    describe("Token Transfers", function () {
        beforeEach(async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary);
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee2.address, encryptedSalary);
            
            // Pay salary to both employees
            const paymentAmount = await confidentialSalaryToken.encrypt(salary1);
            await confidentialSalaryToken.connect(payrollManager).paySalary(employee1.address, paymentAmount);
            await confidentialSalaryToken.connect(payrollManager).paySalary(employee2.address, paymentAmount);
        });
        
        it("Should transfer tokens between employees", async function () {
            const transferAmount = await confidentialSalaryToken.encrypt(1000);
            
            await confidentialSalaryToken.connect(employee1).transfer(employee2.address, transferAmount);
            
            const balance1 = await confidentialSalaryToken.balanceOf(employee1.address);
            const balance2 = await confidentialSalaryToken.balanceOf(employee2.address);
            
            expect(await confidentialSalaryToken.decrypt(balance1)).to.equal(salary1 - 1000);
            expect(await confidentialSalaryToken.decrypt(balance2)).to.equal(salary1 + 1000);
        });
    });
    
    describe("Employee Enumeration", function () {
        it("Should track total employees correctly", async function () {
            expect(await confidentialSalaryToken.getTotalEmployees()).to.equal(0);
            
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary);
            
            expect(await confidentialSalaryToken.getTotalEmployees()).to.equal(1);
            
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee2.address, encryptedSalary);
            
            expect(await confidentialSalaryToken.getTotalEmployees()).to.equal(2);
            
            await confidentialSalaryToken.connect(hrManager).removeEmployee(employee1.address);
            
            expect(await confidentialSalaryToken.getTotalEmployees()).to.equal(1);
        });
        
        it("Should get employee at index correctly", async function () {
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary);
            await confidentialSalaryToken.connect(hrManager).addEmployee(employee2.address, encryptedSalary);
            
            expect(await confidentialSalaryToken.getEmployeeAtIndex(0)).to.equal(employee1.address);
            expect(await confidentialSalaryToken.getEmployeeAtIndex(1)).to.equal(employee2.address);
        });
    });
    
    describe("Pausable Functionality", function () {
        it("Should pause and unpause correctly", async function () {
            await confidentialSalaryToken.pause();
            expect(await confidentialSalaryToken.paused()).to.be.true;
            
            await confidentialSalaryToken.unpause();
            expect(await confidentialSalaryToken.paused()).to.be.false;
        });
        
        it("Should not allow non-admin to pause", async function () {
            await expect(
                confidentialSalaryToken.connect(employee1).pause()
            ).to.be.revertedWithCustomError(confidentialSalaryToken, "UnauthorizedOperation");
        });
        
        it("Should not allow operations when paused", async function () {
            await confidentialSalaryToken.pause();
            
            const encryptedSalary = await confidentialSalaryToken.encrypt(salary1);
            
            await expect(
                confidentialSalaryToken.connect(hrManager).addEmployee(employee1.address, encryptedSalary)
            ).to.be.revertedWithCustomError(confidentialSalaryToken, "EnforcedPause");
        });
    });
}); 