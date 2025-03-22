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

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: 'End date cannot be before start date' });
        }

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

        //if (adminId.toString() === leaveRequest.user.toString()) {
        //    return res.status(403).json({ message: "Admins cannot approve their own leave requests" });
        //}

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
        const leaveRequest = await LeaveRequest.findByIdAndDelete(requestId);
        if (!leaveRequest) {
            return res.status(404).json({ message: "Leave request not found" });
        }
        await leaveRequest.deleteOne();
        res.status(200).json({ message: "Leave request deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve a leave request (Admin only)
const approveLeaveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const adminId = req.user.id; // Extract admin ID from token

        // Find the leave request
        const leaveRequest = await LeaveRequest.findById(requestId).populate('user');
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Prevent self-approval
        if (leaveRequest.user._id.toString() === adminId.toString()) {
            return res.status(403).json({ message: "Admins cannot approve their own leave requests" });
        }

        // Ensure request is still pending
        if (leaveRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Leave request is already processed' });
        }

        // Calculate leave duration
        const leaveDuration = (new Date(leaveRequest.endDate) - new Date(leaveRequest.startDate)) / (1000 * 60 * 60 * 24) + 1;

        // Check if user has enough leave balance
        if (leaveRequest.leaveBalance[leaveRequest.leaveType] < leaveDuration) {
            return res.status(400).json({ message: 'Insufficient leave balance' });
        }

        // Deduct leave days from balance
        leaveRequest.leaveBalance[leaveRequest.leaveType] -= leaveDuration;

        // Approve the leave request
        leaveRequest.status = "approved";
        leaveRequest.approvedBy = adminId;
        leaveRequest.approvedOn = new Date();

        await leaveRequest.save();
        res.status(200).json({ message: "Leave request approved", request: leaveRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reject a leave request (Admin only)
const rejectLeaveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const adminId = req.user.id; // Extract admin ID from token

        // Find the leave request
        const leaveRequest = await LeaveRequest.findById(requestId).populate('user');
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Prevent self-rejection
        if (leaveRequest.user._id.toString() === adminId.toString()) {
            return res.status(403).json({ message: "Admins cannot reject their own leave requests" });
        }

        // Ensure request is still pending
        if (leaveRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Leave request is already processed' });
        }

        // Update status to rejected
        leaveRequest.status = "rejected";
        leaveRequest.approvedBy = adminId;
        leaveRequest.approvedOn = new Date();

        await leaveRequest.save();
        res.status(200).json({ message: "Leave request rejected", request: leaveRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLeaveBalance = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the most recent leave request for the user
        const latestLeaveRequest = await LeaveRequest.findOne({ user: userId }).sort({ createdAt: -1 });

        // Default leave balances (ensuring all types exist)
        const defaultBalances = {
            annual: { total: 15, used: 0, pending: 0, available: 15 },
            sick: { total: 8, used: 0, pending: 0, available: 8 },
            personal: { total: 5, used: 0, pending: 0, available: 5 },
            maternity: { total: 90, used: 0, pending: 0, available: 90 },
            paternity: { total: 14, used: 0, pending: 0, available: 14 }
        };

        // If no leave request exists, return default balances
        if (!latestLeaveRequest) {
            return res.status(200).json(defaultBalances);
        }

        // Merge existing leave balances with defaults (to ensure missing types are included)
        const updatedBalance = { ...defaultBalances, ...latestLeaveRequest.leaveBalance };

        res.status(200).json(updatedBalance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave balance' });
    }
};



module.exports = {
    createLeaveRequest,
    getUserLeaveRequests,
    getAllLeaveRequests,
    updateLeaveStatus,
    approveLeaveRequest,
    rejectLeaveRequest,
    deleteLeaveRequest,
    getLeaveBalance
};
