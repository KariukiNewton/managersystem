const LeaveRequest = require('../models/LeaveRequestModel.js');
const User = require('../models/Users.js');

// Submit a new leave request
const createLeaveRequest = async (req, res) => {
    try {
        const { startDate, endDate, leaveType, reason, attachment, contactInfo, halfDay, halfDayOption } = req.body;
        const userId = req.user.id; // Extracted from authenticated request

        // Create new leave request
        const newRequest = new LeaveRequest({
            user: userId,
            startDate,
            endDate,
            leaveType,
            reason,
            attachment,
            contactInfo,
            halfDay,
            halfDayOption
        });

        await newRequest.save();
        res.status(201).json({ message: 'Leave request submitted successfully', request: newRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get leave requests for a logged-in user
const getUserLeaveRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await LeaveRequest.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all leave requests (Admin view)
const getAllLeaveRequests = async (req, res) => {
    try {
        const requests = await LeaveRequest.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve or reject a leave request (Admin action)
const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { requestId } = req.params;
        const adminId = req.user.id;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        const updatedRequest = await LeaveRequest.findByIdAndUpdate(
            requestId,
            { status, approvedBy: adminId, approvedOn: new Date() },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.status(200).json({ message: `Leave request ${status}`, request: updatedRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a leave request
const deleteLeaveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        await LeaveRequest.findByIdAndDelete(requestId);
        res.status(200).json({ message: 'Leave request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createLeaveRequest,
    getUserLeaveRequests,
    getAllLeaveRequests,
    updateLeaveStatus,
    deleteLeaveRequest
};
