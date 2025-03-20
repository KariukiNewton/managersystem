const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    leaveType: {
        type: String,
        enum: ['annual', 'sick', 'personal', 'maternity', 'paternity'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    attachment: {
        type: String, // File path or URL
        default: null
    },
    contactInfo: {
        type: String,
        default: ''
    },
    halfDay: {
        type: Boolean,
        default: false
    },
    halfDayOption: {
        type: String,
        enum: ['first', 'second'],
        default: 'first'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    approvedOn: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
