const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyLeaves.js");
//const roleMiddleware = require("../middleware/roleMiddleware.js");
const { createLeaveRequest, getAllLeaveRequests, getUserLeaveRequests,
    deleteLeaveRequest, getLeaveBalance, approveLeaveRequest,
    rejectLeaveRequest, //updateLeaveStatus, 
} = require("../controllers/leaveRequestControllers.js");

// 🔹 Employee Routes
router.post("/", verifyToken, createLeaveRequest);
router.get("/my-leaves", verifyToken, getUserLeaveRequests);
router.delete("/:requestId", verifyToken, deleteLeaveRequest);
router.get('/balance', verifyToken, getLeaveBalance);

//router.put("/:requestId/approve", verifyToken, updateLeaveStatus);

// 🔹 Admin Routes
router.get("/admin", getAllLeaveRequests);
router.put("/:requestId/approve", verifyToken, approveLeaveRequest);
router.put("/:requestId/reject", verifyToken, rejectLeaveRequest);

module.exports = router;
