const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    workHours: {
        type: Number, // Automatically calculated
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
