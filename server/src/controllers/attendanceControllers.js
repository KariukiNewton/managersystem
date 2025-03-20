const Attendance = require('../models/AttendanceModel.js');
const User = require('../models/Users.js');
const mongoose = require('mongoose');
const moment = require('moment');

// Helper function to calculate hours worked
const calculateHoursWorked = (checkin, checkout) => {
    const [inHours, inMinutes, inSeconds] = checkin.split(':').map(Number);
    const [outHours, outMinutes, outSeconds] = checkout.split(':').map(Number);

    const checkinTime = new Date(0, 0, 0, inHours, inMinutes, inSeconds);
    const checkoutTime = new Date(0, 0, 0, outHours, outMinutes, outSeconds);

    if (checkoutTime < checkinTime) {
        checkoutTime.setDate(checkoutTime.getDate() + 1);
    }

    let diffMs = checkoutTime - checkinTime;
    if (diffMs < 0) return '0:00'; // Prevent negative values

    let diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    let diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}:${diffMinutes.toString().padStart(2, '0')}`;
};

// Employee Check-in
const checkIn = async (req, res) => {
    try {
        // ✅ User is already verified by middleware
        const userId = req.user.id; // Extracted from token

        const today = moment().format("YYYY-MM-DD");
        const currentTime = moment().format("HH:mm:ss");
        const weekStart = moment().startOf("isoWeek").format("YYYY-MM-DD");

        let attendance = await Attendance.findOne({ user: userId, date: today });

        if (attendance) return res.status(400).json({ message: "Already checked in today" });

        const status = moment().isAfter(moment(today + " 08:30:00")) ? "late" : "present";

        attendance = new Attendance({
            user: userId,
            date: today,
            checkin: currentTime,
            status,
            weekStart,
        });

        await attendance.save();
        res.status(201).json({ message: "Checked in successfully", attendance });
    } catch (error) {
        res.status(500).json({ message: "Error checking in", error: error.message });
    }
};


// Employee Check-out
const checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = moment().format('YYYY-MM-DD');
        const currentTime = moment().format('HH:mm:ss');

        let attendance = await Attendance.findOne({ user: userId, date: today });
        console.log("🔍 Attendance Record Found:", attendance);

        if (!attendance || attendance.checkout) return res.status(400).json({ message: 'Not checked in or already checked out' });

        const hoursWorked = calculateHoursWorked(attendance.checkin, currentTime);

        attendance.checkout = currentTime;
        attendance.hoursWorked = hoursWorked;
        await attendance.save();

        res.status(200).json({ message: 'Checked out successfully', attendance });
    } catch (error) {
        console.error("❌ Checkout Error:", error);
        res.status(500).json({ message: 'Server error on Checking Out', error });
    }
};

// Fetch attendance records for an employee
const getAttendanceHistory = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Get from URL parameter
        const history = await Attendance.find({ user: userId }).sort({ date: -1 });
        res.status(200).json({ history });

    } catch (error) {
        console.error('Error fetching attendance history:', error);
        res.status(500).json({ message: 'Server error on fetching attendance Records', error });
    }
};

// Fetch weekly summary for an employee
const getWeeklySummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const weekStart = moment().startOf('isoWeek').format('YYYY-MM-DD');

        const weekRecords = await Attendance.find({ user: userId, weekStart });
        let totalMinutes = 0, lateCount = 0, absenceCount = 0;
        const STANDARD_WEEK_HOURS = 40 * 60; // 40 hours in minutes

        weekRecords.forEach(record => {
            const [hours, minutes] = record.hoursWorked.split(':').map(Number);
            totalMinutes += hours * 60 + minutes;
            if (record.status === 'late') lateCount++;
            if (record.status === 'absent') absenceCount++;
        });

        const totalWeekHours = `${Math.floor(totalMinutes / 60)}:${totalMinutes % 60}`;
        const overtimeMinutes = Math.max(totalMinutes - STANDARD_WEEK_HOURS, 0);
        const overtimeHours = `${Math.floor(overtimeMinutes / 60)}:${overtimeMinutes % 60}`;

        res.status(200).json({ totalWeekHours, lateCount, absenceCount, overtimeHours });
    } catch (error) {
        res.status(500).json({ message: 'Server Error On Weekly Summaries', error });
    }
};

// Admin: Fetch attendance for all employees
const getAllAttendance = async (req, res) => {
    try {
        // Check if the role is explicitly passed as "admin"
        if (req.query.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }

        const records = await Attendance.find().populate('user', 'username email role');
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error Admin Fetching Attendance', error });
    }
};

// Export all functions
module.exports = {
    checkIn,
    checkOut,
    getAttendanceHistory,
    getWeeklySummary,
    getAllAttendance
};
