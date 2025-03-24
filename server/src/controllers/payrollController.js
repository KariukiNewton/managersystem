const mongoose = require("mongoose");
const User = require("../models/Users.js");
const Payroll = require("../models/payrollModel.js");

// Create Payroll
const createPayroll = async (req, res) => {
    try {
        const { name, basicSalary, allowances = {}, deductions = {} } = req.body;

        // Find user by ID
        const user = await User.findOne({ username: name });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if payroll already exists for this user
        const existingPayroll = await Payroll.findOne({ name: user._id });
        if (existingPayroll) {
            return res.status(400).json({ message: "Payroll already exists for this user" });
        }

        // Ensure joinDate is set
        if (!user.joinDate) {
            user.joinDate = new Date();
            await user.save();
        }

        // Calculate Gross Pay
        const totalAllowances = Object.values(allowances).reduce((a, b) => a + b, 0);
        const grossPay = basicSalary + totalAllowances;

        // Calculate Net Pay
        const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
        const netPay = grossPay - totalDeductions;

        // Create new payroll entry
        const newPayroll = new Payroll({
            name: user._id,
            department: user.department,
            joinDate: user.joinDate,
            basicSalary,
            allowances,
            deductions,
            grossPay,
            netPay
        });

        await newPayroll.save();
        res.status(201).json(newPayroll);
    } catch (error) {
        res.status(500).json({ message: "Error creating payroll", error: error.message });
    }
};

// Get All Payroll Records
const getPayroll = async (req, res) => {
    try {
        const users = await User.find();
        const payrollRecords = await Payroll.find().populate("name", "username department");

        // Find users who do not have payroll records
        const usersWithoutPayroll = users.filter(user =>
            !payrollRecords.some(record => record.name && record.name._id.toString() === user._id.toString())
        );

        // Generate payroll for users without it
        const newRecords = [];
        for (const user of usersWithoutPayroll) {
            // Ensure joinDate is set
            if (!user.joinDate) {
                user.joinDate = new Date();
                await user.save();
            }

            const newPayroll = new Payroll({
                name: user._id,
                department: user.department,
                joinDate: user.joinDate,
                basicSalary: user.salary || 0,
                allowances: user.allowances || { housing: 0, transport: 0, medical: 0 },
                deductions: user.deductions || { tax: 0, insurance: 0, pension: 0 },
                grossPay: 0,
                netPay: 0,
                payDate: new Date()
            });

            await newPayroll.save();
            // Populate the user information for frontend consistency
            await newPayroll.populate("name", "username department");
            newRecords.push(newPayroll);


        }

        // Return all records including newly created ones
        res.status(200).json([...payrollRecords || [], ...newRecords || []]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payroll records", error: error.message });
    }
};


// Get Payroll By Name
const getPayrollByName = async (req, res) => {
    try {
        const { name } = req.params;
        const user = await User.findOne({ username: name });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const payrollRecord = await Payroll.findOne({ name: user._id }).populate("name", "username department");
        if (!payrollRecord) {
            return res.status(404).json({ message: "Payroll record not found" });
        }

        res.status(200).json(payrollRecord);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payroll record", error: error.message });
    }
};

// Update Payroll
const updatePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Recalculate gross and net pay if relevant fields are updated
        if (updates.basicSalary !== undefined || updates.allowances !== undefined || updates.deductions !== undefined) {
            const payroll = await Payroll.findById(id);
            if (!payroll) {
                return res.status(404).json({ message: "Payroll record not found" });
            }

            // Update fields
            if (updates.basicSalary !== undefined) payroll.basicSalary = updates.basicSalary;
            if (updates.allowances !== undefined) payroll.allowances = { ...payroll.allowances, ...updates.allowances };
            if (updates.deductions !== undefined) payroll.deductions = { ...payroll.deductions, ...updates.deductions };

            // Recalculate
            const totalAllowances = Object.values(payroll.allowances).reduce((a, b) => a + b, 0);
            const totalDeductions = Object.values(payroll.deductions).reduce((a, b) => a + b, 0);

            payroll.grossPay = payroll.basicSalary + totalAllowances;
            payroll.netPay = payroll.grossPay - totalDeductions;

            // Save and return updated payroll
            await payroll.save();
            return res.status(200).json(payroll);
        }

        // Simple update without recalculation
        const payroll = await Payroll.findByIdAndUpdate(id, updates, { new: true });
        if (!payroll) {
            return res.status(404).json({ message: "Payroll record not found" });
        }

        res.status(200).json(payroll);
    } catch (error) {
        res.status(500).json({ message: "Error updating payroll record", error: error.message });
    }
};

// Delete Payroll
const deletePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const payroll = await Payroll.findByIdAndDelete(id);
        if (!payroll) {
            return res.status(404).json({ message: "Payroll record not found" });
        }
        res.status(200).json({ message: "Payroll record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting payroll record", error: error.message });
    }
};

// Process Payroll for all employees
const processPayroll = async (req, res) => {
    try {
        const { payPeriod, payDate } = req.body;
        if (!payPeriod || !payDate) {
            return res.status(400).json({ message: "Pay period and pay date are required" });
        }

        const users = await User.find().populate("department");
        if (!users.length) {
            return res.status(400).json({ message: "No employees found for payroll processing" });
        }

        for (const user of users) {
            if (!user.department || !departmentPayrollConfig[user.department.name]) {
                console.warn(`No payroll configuration found for department: ${user.department?.name}`);
                continue;
            }

            const payrollConfig = departmentPayrollConfig[user.department.name];

            let payroll = await Payroll.findOne({ name: user._id });
            if (!payroll) {
                payroll = new Payroll({
                    name: user._id,
                    department: user.department.name,
                    joinDate: user.joinDate,
                    payDate: new Date(payDate),
                    payPeriod,
                    basicSalary: payrollConfig.basicSalary,
                    allowances: payrollConfig.allowances,
                    deductions: payrollConfig.deductions
                });
            } else {
                payroll.basicSalary = payrollConfig.basicSalary;
                payroll.allowances = payrollConfig.allowances;
                payroll.deductions = payrollConfig.deductions;
                payroll.payDate = new Date(payDate);
                payroll.payPeriod = payPeriod;
            }

            payroll.grossPay = payroll.basicSalary + Object.values(payroll.allowances).reduce((a, b) => a + b, 0);
            payroll.netPay = payroll.grossPay - Object.values(payroll.deductions).reduce((a, b) => a + b, 0);

            await payroll.save();
        }

        res.status(200).json({ message: "Payroll processed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error processing payroll", error: error.message });
    }
};

// Process Payroll for a specific employee

const departmentPayrollConfig = {
    "Production and Processing": {
        basicSalary: 40000,
        allowances: { housing: 8000, transport: 5000, medical: 3000 },
        deductions: { tax: 4000, insurance: 2000, pension: 3000 }
    },
    "Management": {
        basicSalary: 120000,
        allowances: { housing: 25000, transport: 10000, medical: 5000 },
        deductions: { tax: 12000, insurance: 5000, pension: 8000 }
    },
    "Quality Assuarance": {
        basicSalary: 60000,
        allowances: { housing: 12000, transport: 6000, medical: 4000 },
        deductions: { tax: 6000, insurance: 3000, pension: 4500 }
    },
    "Sales and Marketing": {
        basicSalary: 50000,
        allowances: { housing: 10000, transport: 7000, medical: 3500 },
        deductions: { tax: 5000, insurance: 2500, pension: 4000 }
    },
    "Maintenance and Engineering": {
        basicSalary: 70000,
        allowances: { housing: 15000, transport: 8000, medical: 5000 },
        deductions: { tax: 7000, insurance: 3500, pension: 5000 }
    }
};


const processEmployeePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const { payPeriod, payDate } = req.body;

        // Find user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find or create payroll record
        let payroll = await Payroll.findOne({ name: user._id });
        if (!payroll) {
            payroll = new Payroll({
                name: user._id,
                department: user.department,
                joinDate: user.joinDate,
                basicSalary: user.salary || 0,
                allowances: user.allowances || { housing: 0, transport: 0, medical: 0 },
                deductions: user.deductions || { tax: 0, insurance: 0, pension: 0 },
                grossPay: 0,
                netPay: 0
            });
        }

        // Update payroll with latest user data
        payroll.basicSalary = user.salary || payroll.basicSalary;
        payroll.allowances = user.allowances || payroll.allowances;
        payroll.deductions = user.deductions || payroll.deductions;

        // Calculate totals
        const totalAllowances = Object.values(payroll.allowances).reduce((a, b) => a + b, 0);
        const totalDeductions = Object.values(payroll.deductions).reduce((a, b) => a + b, 0);

        payroll.grossPay = payroll.basicSalary + totalAllowances;
        payroll.netPay = payroll.grossPay - totalDeductions;

        // Update pay date and period
        if (payDate) payroll.payDate = new Date(payDate);
        if (payPeriod) payroll.payPeriod = payPeriod;

        await payroll.save();
        res.status(200).json(payroll);
    } catch (error) {
        res.status(500).json({ message: "Error processing employee payroll", error: error.message });
    }
};

module.exports = {
    createPayroll,
    getPayroll,
    getPayrollByName,
    updatePayroll,
    deletePayroll,
    processPayroll,
    processEmployeePayroll
};