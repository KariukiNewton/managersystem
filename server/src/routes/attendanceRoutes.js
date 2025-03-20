const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const attendanceController = require('../controllers/attendanceControllers.js');

// Employee Routes
router.post('/checkin', authMiddleware, attendanceController.checkIn);
router.post('/checkout', authMiddleware, attendanceController.checkOut);
router.get('/history', authMiddleware, attendanceController.getAttendanceHistory);
router.get('/weekly-summary', authMiddleware, attendanceController.getWeeklySummary);

// Admin Route - Fetch all employees' attendance
router.get('/all', attendanceController.getAllAttendance);

module.exports = router;
