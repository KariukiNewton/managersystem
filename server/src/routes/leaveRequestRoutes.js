const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyLeaves.js");
const roleMiddleware = require("../middleware/roleMiddleware.js");
const {
    createLeaveRequest,
    getAllLeaveRequests,
    getUserLeaveRequests,
    updateLeaveStatus,
    deleteLeaveRequest,
    getLeaveBalance
    //approveLeaveRequest,
    //rejectLeaveRequest
} = require("../controllers/leaveRequestControllers.js");

// 🔹 Employee Routes
router.post("/", verifyToken, createLeaveRequest);
router.get("/my-leaves", verifyToken, getUserLeaveRequests);
router.delete("/:requestId", verifyToken, deleteLeaveRequest);
router.get('/balance', verifyToken, getLeaveBalance);

// 🔹 Admin Routes
router.get("/", verifyToken, roleMiddleware("admin"), getAllLeaveRequests);
router.put("/:requestId", verifyToken, roleMiddleware("admin"), updateLeaveStatus);
//router.put("/:id/approve", verifyToken, roleMiddleware("admin"), approveLeaveRequest);
//router.put("/:id/reject", verifyToken, roleMiddleware("admin"), rejectLeaveRequest);

module.exports = router;
