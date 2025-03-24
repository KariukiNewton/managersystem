const mongoose = require("mongoose");

const PayrollConfigSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        unique: true, // Ensure each department has only one payroll config
        required: true
    },
    baseSalary: {
        type: Number,
        required: true
    },
    allowances: {
        type: Map,
        of: Number, // Allowances stored as key-value pairs (e.g., {house: 5000, transport: 2000})
        default: {}
    },
    deductions: {
        type: Map,
        of: Number, // Deductions stored as key-value pairs (e.g., {tax: 5000, pension: 2000})
        default: {}
    }
});

const PayrollConfig = mongoose.model("PayrollConfig", PayrollConfigSchema);
module.exports = PayrollConfig;
