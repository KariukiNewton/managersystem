const express = require("express");
const router = express.Router();
const {
    getDepartments,
    searchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentControllers.js");

// Get all departments
router.get("/", getDepartments);

// Search departments
router.get("/search", searchDepartments);

// Add a new department
router.post("/", createDepartment);

// Update a department
router.put("/:id", updateDepartment);

// Delete a department
router.delete("/:id", deleteDepartment);

module.exports = router;
