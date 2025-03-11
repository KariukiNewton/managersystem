const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'finance', 'employee'],
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department', // References Department model
            default: null,
        },
        payroll: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payroll', // References Payroll model
            default: null,
        },
        age: {
            type: Number,
            required: true,
            min: 18,
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        joinDate: {
            type: Date,
            default: Date.now,
            immutable: true
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique userId before validation
userSchema.pre('validate', async function (next) {
    if (!this.userId) {
        const prefix = this.role.charAt(0).toUpperCase(); // A for admin, F for finance, E for employee
        const count = await mongoose.model('User').countDocuments({ role: this.role });
        this.userId = `${prefix}${String(count + 1).padStart(4, '0')}`; // Format: A0001, F0001, E0001
    }
    next();
});

// Auto-update department employee count
userSchema.post('save', async function (doc, next) {
    if (doc.department) {
        const Department = mongoose.model('Department');
        await Department.findByIdAndUpdate(doc.department, { $inc: { employeeCount: 1 } });
    }
    next();
});

// Auto-decrease employee count when a user is removed
userSchema.post('findOneAndDelete', async function (doc) {
    if (doc && doc.department) {
        const Department = mongoose.model('Department');
        await Department.findByIdAndUpdate(doc.department, { $inc: { employeeCount: -1 } });
    }
});

// Create Payroll record for ALL users
userSchema.post("save", async function (doc, next) {
    try {
        const Payroll = mongoose.model("Payroll");

        //Logging user details
        console.log("User saved:", doc);
        console.log("User joinDate:", doc.joinDate);

        // Ensure joinDate is set before payroll creation
        if (!doc.joinDate) {
            doc.joinDate = new Date();
            await mongoose.model("User").findByIdAndUpdate(doc._id, { joinDate: doc.joinDate });
        }

        // Check if payroll already exists
        setTimeout(async () => {
            const existingPayroll = await Payroll.findOne({ name: doc._id });

            if (!existingPayroll) {
                const newPayroll = await Payroll.create({
                    name: doc._id, // Ensure this is an ObjectId //doc._id
                    department: doc.department,
                    joinDate: doc.joinDate,
                    basicSalary: 0,
                });

                await mongoose.model("User").findByIdAndUpdate(doc._id, {
                    payroll: newPayroll._id,
                });
            }
        }, 100); // Small delay to let MongoDB commit user

        next();
    } catch (error) {
        console.error("Error creating payroll:", error);
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
