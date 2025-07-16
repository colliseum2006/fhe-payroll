# 🔐 Confidential Salary Payroll - FHEVM Implementation

A **confidential salary payment system** built using Zama's Fully Homomorphic Encryption Virtual Machine (FHEVM) and OpenZeppelin's Confidential Contracts. This project demonstrates how companies can pay employee salaries while maintaining complete privacy of individual salary amounts on the blockchain.

## 🎯 **Project Overview**

This system allows companies to:
- ✅ Pay employee salaries confidentially using FHE encryption
- ✅ Process bonuses and deductions without exposing amounts
- ✅ Maintain complete privacy while ensuring regulatory compliance
- ✅ Provide transparent audit trails without revealing sensitive data
- ✅ Enable employee-to-employee token transfers

## 🏗️ **Architecture**

The system is built on:
- **Zama FHEVM**: For homomorphic encryption operations
- **Zama Relayer SDK**: For FHEVM interaction and relayer services
- **OpenZeppelin Confidential Contracts**: For the base confidential token functionality
- **Role-based Access Control**: For secure permission management
- **Hardhat**: For development and testing
- **ethers.js**: For all blockchain and smart contract interactions (no viem)

## 📁 **Project Structure**

```
├── contracts/
│   └── ConfidentialSalaryToken.sol    # Main salary token contract
├── test/
│   └── ConfidentialSalaryToken.test.js # Comprehensive test suite
├── scripts/
│   ├── deploy.js                      # Deployment script
│   ├── demo.js                        # Demo script
│   └── frontend-example.js            # Frontend integration example
├── package.json                       # Dependencies
├── hardhat.config.js                  # Hardhat configuration
└── README.md                          # This file
```

## 🚀 **Quick Start**

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Hardhat

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fhe-payroll
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile contracts**
   ```bash
   npm run compile
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Deploy contract**
   ```bash
   npm run deploy
   ```

6. **Run demo**
   ```bash
   npm run demo
   ```

## 🌐 **Deployment Information**

### **Sepolia Testnet Deployment**

The Confidential Salary Token has been successfully deployed to the Sepolia testnet:

- **Contract Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Network**: Sepolia Testnet
- **Block Explorer**: [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x5FbDB2315678afecb367f032d93F642f64180aa3)
- **Token Name**: Confidential Salary Token
- **Token Symbol**: CST
- **Decimals**: 6

### **Contract Verification**

The contract has been verified on Sepolia Etherscan and is publicly accessible for inspection and interaction.

### **Role Assignment**

After deployment, the following roles need to be assigned:

```javascript
// Grant HR role
await confidentialSalaryToken.grantRole(HR_ROLE, hrManagerAddress);

// Grant Payroll role  
await confidentialSalaryToken.grantRole(PAYROLL_ROLE, payrollManagerAddress);

// Grant Admin role
await confidentialSalaryToken.grantRole(ADMIN_ROLE, adminAddress);
```

### **Interacting with the Deployed Contract**

You can interact with the deployed contract using:

1. **Etherscan**: Direct interaction through the verified contract
2. **Hardhat Console**: Connect to Sepolia and interact programmatically
3. **Frontend Integration**: Use the provided frontend example scripts (all using ethers.js)

### **Environment Setup**

Make sure you have the following environment variables set for Sepolia deployment:

```bash
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_sepolia_rpc_url_here
```

## 🔐 **Key Features**

### **Privacy Protection**
- All salary amounts are encrypted using FHE
- Only authorized parties can decrypt amounts
- Public blockchain shows transactions occurred, not amounts
- Optional disclosure for compliance purposes

### **Business Logic**
- **Employee Management**: Add/remove employees with encrypted salaries
- **Salary Payments**: Process monthly salaries confidentially
- **Performance Bonuses**: Handle discretionary bonuses privately
- **Tax Deductions**: Process deductions without exposing amounts
- **Promotions**: Update salaries confidentially
- **Token Transfers**: Employees can transfer tokens to each other

### **Security & Access Control**
- **HR Role**: Employee management and salary updates
- **Payroll Role**: Salary payments, bonuses, and deductions
- **Admin Role**: Contract management and role assignments

## 📊 **Use Cases**

### **1. Confidential Payroll**
```javascript
// HR Manager adds a new employee with encrypted salary
const encryptedSalary = FHE.encrypt(5000); // $5000 salary
await confidentialSalaryToken.connect(hrManager).addEmployee(
    employeeAddress, 
    encryptedSalary
);

// Payroll Manager pays monthly salary
const paymentAmount = FHE.encrypt(5000); // $5000 payment
await confidentialSalaryToken.connect(payrollManager).paySalary(
    employeeAddress, 
    paymentAmount
);
```

### **2. Performance Bonuses**
```javascript
// Payroll Manager pays performance bonus
const bonusAmount = FHE.encrypt(1000); // $1000 bonus
await confidentialSalaryToken.connect(payrollManager).payBonus(
    employeeAddress, 
    bonusAmount, 
    "Q4 Performance Bonus"
);
```

### **3. Tax Deductions**
```javascript
// Payroll Manager processes tax deduction
const deductionAmount = FHE.encrypt(500); // $500 deduction
await confidentialSalaryToken.connect(payrollManager).processDeduction(
    employeeAddress, 
    deductionAmount, 
    "Tax Deduction"
);
```

### **4. Employee Transfers**
```javascript
// Employee transfers tokens to another employee
const transferAmount = FHE.encrypt(500); // $500 transfer
await confidentialSalaryToken.connect(employee1).transfer(
    employee2.address, 
    transferAmount
);
```

## 🔧 **Contract Functions**

### **Employee Management**
- `addEmployee(address employee, euint32 encryptedSalary)` - Add new employee
- `removeEmployee(address employee)` - Remove employee
- `updateEmployeeSalary(address employee, euint32 newEncryptedSalary)` - Update salary
- `getEmployeeSalary(address employee)` - Get encrypted salary
- `isEmployee(address employee)` - Check if address is employee

### **Salary Operations**
- `paySalary(address employee, euint32 amount)` - Pay salary
- `payBonus(address employee, euint32 amount, string reason)` - Pay bonus
- `processDeduction(address employee, euint32 amount, string reason)` - Process deduction

### **Token Operations** (inherited from ConfidentialFungibleToken)
- `balanceOf(address account)` - Get encrypted balance
- `transfer(address to, euint32 amount)` - Transfer tokens
- `transferFrom(address from, address to, euint32 amount)` - Transfer from another address

### **Role Management**
- `grantRole(bytes32 role, address account)` - Grant role
- `revokeRole(bytes32 role, address account)` - Revoke role
- `hasRole(bytes32 role, address account)` - Check role

### **Utility Functions**
- `getTotalEmployees()` - Get total employee count
- `getEmployeeAtIndex(uint256 index)` - Get employee at index
- `pause()` / `unpause()` - Pause/unpause contract

## 🎭 **Demo Script**

The demo script (`scripts/demo.js`) showcases all features:

1. **Employee Management**: Adding employees with encrypted salaries
2. **Salary Payments**: Processing confidential salary payments
3. **Bonus Payments**: Paying performance bonuses
4. **Deductions**: Processing tax and insurance deductions
5. **Transfers**: Employee-to-employee token transfers
6. **Salary Updates**: Updating employee salaries (promotions)
7. **Employee Removal**: Removing employees from the system
8. **Contract Pause**: Pausing and unpausing operations
9. **Enumeration**: Listing all employees

Run the demo:
```bash
npm run demo
```

## 🧪 **Testing**

The test suite covers:
- ✅ Contract deployment and role setup
- ✅ Employee management operations
- ✅ Salary payment functionality
- ✅ Bonus and deduction processing
- ✅ Token transfer operations
- ✅ Access control and permissions
- ✅ Pause/unpause functionality
- ✅ Error handling and edge cases

Run tests:
```bash
npm test
```

## 🔐 **Security Considerations**

### **Privacy Protection**
- All sensitive data is encrypted using FHE
- Only authorized parties can decrypt amounts
- Public blockchain shows transaction existence, not amounts

### **Access Control**
- Role-based permissions prevent unauthorized access
- HR role for employee management
- Payroll role for salary operations
- Admin role for contract management

### **Audit Capabilities**
- Encrypted transaction logs
- Optional disclosure for compliance
- Immutable payment history

## 📈 **Stakeholders Benefits**

### **For Companies**
- Privacy of salary information
- Regulatory compliance maintained
- Transparent audit trail without exposing amounts
- Automated payroll processing

### **For Employees**
- Personal salary information protected
- Verifiable payment history
- Control over disclosure when needed
- Immutable payment records

### **For Regulators**
- Complete transaction history
- Optional disclosure mechanisms
- Public blockchain verification
- Sensitive data protection

## 🔮 **Future Enhancements**

Potential improvements for production use:
- Integration with existing payroll systems
- Multi-currency support
- Advanced compliance features
- Mobile wallet integration
- Automated tax calculations
- Performance optimization for large employee bases
- Integration with traditional banking systems

## 📞 **Support & Resources**

- **Zama Documentation**: https://docs.zama.ai/
- **FHEVM Guides**: https://docs.zama.ai/protocol/solidity-guides/
- **Zama Relayer SDK**: https://docs.zama.ai/protocol/relayer-sdk/
- **OpenZeppelin Confidential Contracts**: https://docs.openzeppelin.com/confidential-contracts/

## 📄 **License**

This project is licensed under the MIT License.

---

**Note**: This is a demonstration project showcasing the capabilities of Zama's FHEVM for real-world privacy applications. For production use, ensure proper security audits and compliance with local regulations. 