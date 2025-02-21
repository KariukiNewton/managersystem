// routes/protectedRoutes.js
const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

// This route requires authentication (you must be logged in)
router.get("/dashboard", authenticate, (req, res) => {
    res.json({ message: `Welcome, ${req.user.role}!` });
});

// This route requires both authentication and specific role (Finance)
router.get("/finance", authenticate, authorize(["Finance"]), (req, res) => {
    res.json({ message: "Finance dashboard access granted." });
});

// This route requires both authentication and specific role (HR)
router.get("/hr", authenticate, authorize(["HR"]), (req, res) => {
    res.json({ message: "HR dashboard access granted." });
});

module.exports = router;
