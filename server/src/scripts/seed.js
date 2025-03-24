const mongoose = require("mongoose");
const PayrollConfig = require("../models/payrollConfig.js");
const Department = require("../models/DepartmentsModel.js");

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/empdatabase");

const initializePayrollConfig = async () => {
    try {
        console.log("🔄 Fetching Departments...");
        const departments = await Department.find();

        if (departments.length === 0) {
            console.log("❌ No departments found. Ensure departments exist before running this script.");
            return;
        }

        for (const dept of departments) {
            const existingConfig = await PayrollConfig.findOne({ department: dept._id });

            if (!existingConfig) {
                console.log(`➕ Creating payroll config for ${dept.name}...`);
                await PayrollConfig.create({
                    department: dept._id,
                    baseSalary: Math.floor(Math.random() * 20000) + 50000, // Dynamic values
                    allowances: {
                        housing: Math.floor(Math.random() * 5000) + 3000,
                        transport: Math.floor(Math.random() * 2000) + 1000,
                        medical: Math.floor(Math.random() * 3000) + 1500
                    },
                    deductions: {
                        tax: Math.floor(Math.random() * 5000) + 2000,
                        insurance: Math.floor(Math.random() * 2000) + 1000,
                        pension: Math.floor(Math.random() * 3000) + 1500
                    }
                });
                console.log(`✅ Payroll config added for ${dept.name}`);
            } else {
                console.log(`⚠️ Payroll config already exists for ${dept.name}`);
            }
        }

        console.log("✅ All payroll configurations are set.");
        mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error initializing payroll config:", error);
    }
};

// Run the function
initializePayrollConfig();
