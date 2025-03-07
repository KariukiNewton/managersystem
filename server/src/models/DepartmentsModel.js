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

const Department = mongoose.model("Department", DepartmentSchema);
module.exports = Department;
