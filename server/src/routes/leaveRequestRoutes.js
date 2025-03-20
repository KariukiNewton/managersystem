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
    //approveLeaveRequest,
    //rejectLeaveRequest
} = require("../controllers/leaveRequestControllers.js");

// 🔹 Employee Routes
router.post("/", verifyToken, createLeaveRequest);
router.get("/my-leaves", verifyToken, getUserLeaveRequests);
router.delete("/:id", verifyToken, deleteLeaveRequest);

// 🔹 Admin Routes
router.get("/", verifyToken, roleMiddleware("admin"), getAllLeaveRequests);
router.put("/:id", verifyToken, roleMiddleware("admin"), updateLeaveStatus);
//router.put("/:id/approve", verifyToken, roleMiddleware("admin"), approveLeaveRequest);
//router.put("/:id/reject", verifyToken, roleMiddleware("admin"), rejectLeaveRequest);

module.exports = router;
