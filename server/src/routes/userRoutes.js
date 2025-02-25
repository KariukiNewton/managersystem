const express = require("express");
const { getAllUsers, updateUser, deleteUser } = require("../controllers/userControllers.js");
const router = express.Router();

router.get("/", getAllUsers); // ✅ Fetch all users
router.put("/:id", updateUser); // ✅ Update user
router.delete("/:id", deleteUser); // ✅ Delete user

module.exports = router;
