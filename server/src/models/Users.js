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
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Generate unique userId before validation
userSchema.pre('validate', async function (next) {
    if (!this.userId) {
        const prefix = this.role.charAt(0).toUpperCase(); // A for admin, F for finance, E for employee
        const count = await mongoose.model('User').countDocuments({ role: this.role });
        this.userId = `${prefix}${String(count + 1).padStart(4, '0')}`; // Format: A0001, F0001, E0001
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
