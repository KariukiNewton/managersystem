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

module.exports = mongoose.model('User', userSchema);



{/*const mongoose = require('mongoose');
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
            ref: 'Department',
            default: null, // ✅ Defaults to null if not provided
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

// Auto-update department employee count on user creation
userSchema.post('save', async function (doc, next) {
    if (doc.department && doc.role === 'employee') { // ✅ Only update for employees
        const Department = mongoose.model('Department');
        await Department.findByIdAndUpdate(doc.department, { $inc: { employeeCount: 1 } });
    }
    next();
});

// Auto-decrease employee count when a user is removed
userSchema.post('findOneAndDelete', async function (doc) {
    if (doc && doc.department && doc.role === 'employee') { // ✅ Only update for employees
        const Department = mongoose.model('Department');
        await Department.findByIdAndUpdate(doc.department, { $inc: { employeeCount: -1 } });
    }
});

// Auto-update department when an employee is transferred
userSchema.post('findOneAndUpdate', async function (doc) {
    if (!doc) return;

    const updatedUser = await mongoose.model('User').findById(doc._id);
    if (!updatedUser) return;

    const Department = mongoose.model('Department');

    // If department changed, update both old and new department counts
    if (doc.department && updatedUser.department.toString() !== doc.department.toString()) {
        await Department.findByIdAndUpdate(doc.department, { $inc: { employeeCount: -1 } });
        await Department.findByIdAndUpdate(updatedUser.department, { $inc: { employeeCount: 1 } });
    }
});

module.exports = mongoose.model('User', userSchema);

    */}