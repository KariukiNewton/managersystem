const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkin: { type: String, default: null }, // Format: HH:MM:SS
    checkout: { type: String, default: null }, // Format: HH:MM:SS
    status: { type: String, enum: ['present', 'late', 'absent'], default: 'present' },
    hoursWorked: { type: String, default: '0:00' }, // Daily work hours

    // Weekly Summary Fields
    weekStart: { type: String, required: true }, // Start date of the week (YYYY-MM-DD)
    totalWeekHours: { type: String, default: '0:00' }, // Total hours worked in a week
    overtimeHours: { type: String, default: '0:00' },
    lateCount: { type: Number, default: 0 },
    earlyDepartureCount: { type: Number, default: 0 },
    absenceCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
