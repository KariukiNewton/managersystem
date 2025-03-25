const express = require("express");
const {
    createPayroll,
    getPayroll,
    getPayrollByName,
    updatePayroll,
    deletePayroll,
    processPayroll,
    processEmployeePayroll
} = require("../controllers/payrollController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Create a new payroll record
router.post("/", createPayroll);

// Get all payroll records
router.get("/", getPayroll);

// Get a specific payroll record by employee name
router.get("/me", authMiddleware, getPayrollByName);

// Update a payroll record
router.put("/:id", updatePayroll);

// Delete a payroll record
router.delete("/:id", deletePayroll);

// Process payroll for all employees
router.post("/process", processPayroll);

// Process payroll for a specific employee
router.post("/process/:id", processEmployeePayroll);

module.exports = router;