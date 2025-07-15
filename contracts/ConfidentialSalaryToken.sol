// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhevm/solidity/lib/FHE.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts-confidential/token/ConfidentialFungibleToken.sol";

/**
 * @title ConfidentialSalaryToken
 * @dev A confidential salary payment system using FHE encryption
 * @notice This contract allows companies to pay employee salaries while maintaining complete privacy
 */
contract ConfidentialSalaryToken is ConfidentialFungibleToken, AccessControl, ReentrancyGuard, Pausable {
    
    // Role constants
    bytes32 public constant HR_ROLE = keccak256("HR_ROLE");
    bytes32 public constant PAYROLL_ROLE = keccak256("PAYROLL_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    // Employee data structure
    struct Employee {
        euint32 salary;
        bool isActive;
        uint256 lastPaymentTimestamp;
    }
    
    // Mapping from employee address to employee data
    mapping(address => Employee) private _employees;
    
    // Array to track all employees for enumeration
    address[] private _employeeAddresses;
    
    // Mapping to track if address is in the array
    mapping(address => bool) private _isInEmployeeArray;
    
    // Total number of active employees
    uint256 private _totalEmployees;
    
    // Custom events
    event EmployeeAdded(address indexed employee, euint32 encryptedSalary);
    event EmployeeRemoved(address indexed employee);
    event SalaryPaid(address indexed employee, euint32 amount);
    event BonusPaid(address indexed employee, euint32 amount, string reason);
    event DeductionProcessed(address indexed employee, euint32 amount, string reason);
    event SalaryUpdated(address indexed employee, euint32 newSalary);
    
    // Custom errors
    error EmployeeAlreadyExists(address employee);
    error EmployeeNotFound(address employee);
    error InsufficientTreasuryBalance();
    error InsufficientEmployeeBalance(address employee);
    error InvalidAmount();
    error UnauthorizedOperation();
    error EmployeeNotActive(address employee);
    
    /**
     * @dev Constructor sets up initial roles
     * @param admin The initial admin address
     */
    constructor(string memory name, string memory symbol, string memory tokenURI, address admin)
        ConfidentialFungibleToken(name, symbol, tokenURI)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }
    
    /**
     * @dev Modifier to check if caller has HR role
     */
    modifier onlyHR() {
        if (!hasRole(HR_ROLE, msg.sender)) {
            revert UnauthorizedOperation();
        }
        _;
    }
    
    /**
     * @dev Modifier to check if caller has Payroll role
     */
    modifier onlyPayroll() {
        if (!hasRole(PAYROLL_ROLE, msg.sender)) {
            revert UnauthorizedOperation();
        }
        _;
    }
    
    /**
     * @dev Modifier to check if caller has Admin role
     */
    modifier onlyAdmin() {
        if (!hasRole(ADMIN_ROLE, msg.sender)) {
            revert UnauthorizedOperation();
        }
        _;
    }
    
    /**
     * @dev Add a new employee with encrypted salary
     * @param employee The employee's address
     * @param encryptedSalary The encrypted salary amount
     */
    function addEmployee(address employee, euint32 encryptedSalary) 
        external 
        onlyHR 
        whenNotPaused
    {
        if (employee == address(0)) {
            revert EmployeeNotFound(employee);
        }
        
        if (_employees[employee].isActive) {
            revert EmployeeAlreadyExists(employee);
        }
        
        _employees[employee] = Employee({
            salary: encryptedSalary,
            isActive: true,
            lastPaymentTimestamp: block.timestamp
        });
        
        if (!_isInEmployeeArray[employee]) {
            _employeeAddresses.push(employee);
            _isInEmployeeArray[employee] = true;
        }
        
        _totalEmployees++;
        
        emit EmployeeAdded(employee, encryptedSalary);
    }
    
    /**
     * @dev Remove an employee
     * @param employee The employee's address
     */
    function removeEmployee(address employee) 
        external 
        onlyHR 
        whenNotPaused
    {
        if (!_employees[employee].isActive) {
            revert EmployeeNotFound(employee);
        }
        
        _employees[employee].isActive = false;
        _totalEmployees--;
        
        emit EmployeeRemoved(employee);
    }
    
    /**
     * @dev Update an employee's salary
     * @param employee The employee's address
     * @param newEncryptedSalary The new encrypted salary amount
     */
    function updateEmployeeSalary(address employee, euint32 newEncryptedSalary) 
        external 
        onlyHR 
        whenNotPaused
    {
        if (!_employees[employee].isActive) {
            revert EmployeeNotFound(employee);
        }
        
        _employees[employee].salary = newEncryptedSalary;
        
        emit SalaryUpdated(employee, newEncryptedSalary);
    }
    
    /**
     * @dev Get an employee's encrypted salary
     * @param employee The employee's address
     * @return The encrypted salary amount
     */
    function getEmployeeSalary(address employee) 
        external 
        view 
        returns (euint32)
    {
        if (!_employees[employee].isActive) {
            revert EmployeeNotFound(employee);
        }
        return _employees[employee].salary;
    }
    
    /**
     * @dev Check if an address is an active employee
     * @param employee The address to check
     * @return True if the address is an active employee
     */
    function isEmployee(address employee) 
        external 
        view 
        returns (bool)
    {
        return _employees[employee].isActive;
    }
    
    /**
     * @dev Pay salary to an employee
     * @param employee The employee's address
     * @param amount The encrypted payment amount
     */
    function paySalary(address employee, euint32 amount) 
        external 
        onlyPayroll 
        nonReentrant 
        whenNotPaused
    {
        if (!_employees[employee].isActive) {
            revert EmployeeNotFound(employee);
        }
        
        // Mint tokens to employee
        _mint(employee, FHE.asEuint64(amount));
        _employees[employee].lastPaymentTimestamp = block.timestamp;
        
        emit SalaryPaid(employee, amount);
    }
    
    /**
     * @dev Pay a bonus to an employee
     * @param employee The employee's address
     * @param amount The encrypted bonus amount
     * @param reason The reason for the bonus
     */
    function payBonus(address employee, euint32 amount, string memory reason) 
        external 
        onlyPayroll 
        nonReentrant 
        whenNotPaused
    {
        if (!_employees[employee].isActive) {
            revert EmployeeNotFound(employee);
        }
        
        // Mint tokens to employee
        _mint(employee, FHE.asEuint64(amount));
        
        emit BonusPaid(employee, amount, reason);
    }
    
    /**
     * @dev Process a deduction from an employee's balance
     * @param employee The employee's address
     * @param amount The encrypted deduction amount
     * @param reason The reason for the deduction
     */
    function processDeduction(address employee, euint32 amount, string memory reason) 
        external 
        onlyPayroll 
        nonReentrant 
        whenNotPaused
    {
        if (!_employees[employee].isActive) {
            revert EmployeeNotFound(employee);
        }
        
        // Burn tokens from employee
        _burn(employee, FHE.asEuint64(amount));
        
        emit DeductionProcessed(employee, amount, reason);
    }
    

    

    
    /**
     * @dev Get total number of employees
     * @return The total number of active employees
     */
    function getTotalEmployees() 
        external 
        view 
        returns (uint256)
    {
        return _totalEmployees;
    }
    
    /**
     * @dev Get employee address at specific index
     * @param index The index in the employee array
     * @return The employee address at the given index
     */
    function getEmployeeAtIndex(uint256 index) 
        external 
        view 
        returns (address)
    {
        require(index < _employeeAddresses.length, "Index out of bounds");
        return _employeeAddresses[index];
    }
    
    /**
     * @dev Pause the contract (admin only)
     */
    function pause() external onlyAdmin {
        _pause();
    }
    
    /**
     * @dev Unpause the contract (admin only)
     */
    function unpause() external onlyAdmin {
        _unpause();
    }
} 