const mongoose = require('mongoose');

const generateDepartmentId = async function () {
    const lastDepartment = await this.constructor.findOne().sort({ createdAt: -1 });
    let newId = "DPT001";

    if (lastDepartment) {
        const lastIdNum = parseInt(lastDepartment.departmentId.replace("DPT", ""), 10);
        newId = `DPT${String(lastIdNum + 1).padStart(3, "0")}`;
    }

    return newId;
};

// Department Schema
const DepartmentSchema = new mongoose.Schema(
    {
        departmentId: {
            type: String,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        manager: {
            type: String,//mongoose.Schema.Types.ObjectId
            ref: 'User', // References User model
            required: false
        },
        performance: {
            type: String,
            enum: ["excellent", "good", "average", "poor"],
            default: "average"
        },
        employeeCount: {
            type: Number,
            default: 0
        },
        budget: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// Pre-save hook to auto-generate departmentId
DepartmentSchema.pre("save", async function (next) {
    if (!this.departmentId) {
        this.departmentId = await generateDepartmentId.call(this);
    }
    next();
});

const PayrollConfig = require("./payrollConfig.js"); // Import PayrollConfig

DepartmentSchema.post("save", async function (doc, next) {
    try {
        const existingConfig = await PayrollConfig.findOne({ department: doc._id });

        if (!existingConfig) {
            await PayrollConfig.create({
                department: doc._id,
                baseSalary: 45000, // Default salary (modify as needed)
                allowances: { housing: 4000, transport: 2000, medical: 1500 },
                deductions: { tax: 4000, insurance: 1500, pension: 2500 }
            });

            console.log(`Default PayrollConfig created for new department: ${doc.name}`);
        }
    } catch (error) {
        console.error("Error creating payroll config:", error);
    }
    next();
});

const Department = mongoose.model("Department", DepartmentSchema);
module.exports = Department;
