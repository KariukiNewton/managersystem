const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
    payrollId: {
        type: String,
        unique: true
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    department: {
        type: String,
        required: true
    },
    joinDate: {
        type: Date,
        required: true
    },
    payDate: {
        type: Date,
        default: function () {
            let today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), 28);
        }
    },
    payPeriod: {
        type: String,
        default: function () {
            const today = new Date();
            const monthName = today.toLocaleString("default", { month: "long" });
            return `${monthName} ${today.getFullYear()}`;
        }
    },
    basicSalary: {
        type: Number,
        required: true,
        default: 0
    },
    allowances: {
        housing: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        medical: { type: Number, default: 0 }
    },
    deductions: {
        tax: { type: Number, default: 0 },
        insurance: { type: Number, default: 0 },
        pension: { type: Number, default: 0 }
    },
    grossPay: {
        type: Number,
        default: 0
    },
    netPay: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'paid'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });


// Auto-generate Payroll ID (P001, P002...)
payrollSchema.pre("save", async function (next) {
    if (!this.payrollId) {
        const count = await mongoose.model("Payroll").countDocuments();
        this.payrollId = `P${String(count + 1).padStart(3, "0")}`;
    }

    // Calculate gross and net pay before saving
    this.grossPay = this.basicSalary + Object.values(this.allowances).reduce((a, b) => a + b, 0);
    this.netPay = this.grossPay - Object.values(this.deductions).reduce((a, b) => a + b, 0);

    // Update the timestamp
    this.updatedAt = new Date();

    next();
});


payrollSchema.pre("validate", async function (next) {
    try {
        const User = mongoose.model("User");

        // Ensure the 'name' field (User reference) is an ObjectId
        if (!mongoose.Types.ObjectId.isValid(this.name)) {
            return next(new Error("Invalid user ObjectId format"));
        }

        const user = await User.findById(this.name); // Find the user

        if (!user) {
            return next(new Error("Referenced user does not exist"));
        }

        next();
    } catch (error) {
        next(error);
    }
});



// Remove payroll record if an employee is deleted
payrollSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        console.log(`Payroll record for Employee ${doc.name} deleted.`);
    }
});

const Payroll = mongoose.model("Payroll", payrollSchema);
module.exports = Payroll;