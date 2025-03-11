const User = require("../models/Users.js");
const Department = require("../models/DepartmentsModel.js");

// Get all users with department name
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("department", "name"); // Populate department name
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { department, ...otherUpdates } = req.body;

        const existingUser = await User.findById(id);
        if (!existingUser) return res.status(404).json({ message: "User not found" });

        // If department changes, update employee count
        if (department && department !== String(existingUser.department)) {
            const oldDepartment = await Department.findById(existingUser.department);
            const newDepartment = await Department.findById(department);

            if (oldDepartment) {
                await Department.findByIdAndUpdate(oldDepartment._id, { $inc: { employeeCount: -1 } });
            }
            if (newDepartment) {
                await Department.findByIdAndUpdate(newDepartment._id, { $inc: { employeeCount: 1 } });
            }
        }

        // Ensure joinDate is set if it's missing
        if (!existingUser.joinDate) {
            otherUpdates.joinDate = new Date();
        }

        const updatedUser = await User.findByIdAndUpdate(id,
            { department, ...otherUpdates },
            { new: true }
        ).populate("department", "name");

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        // Decrement employee count in department
        if (deletedUser.department) {
            const department = await Department.findById(deletedUser.department);
            if (department) {
                await Department.findByIdAndUpdate(department._id, { $inc: { employeeCount: -1 } });
            }
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

module.exports = { getAllUsers, updateUser, deleteUser };
