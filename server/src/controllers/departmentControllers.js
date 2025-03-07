const Department = require('../models/DepartmentsModel.js');

// Get all departments
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error });
    }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) return res.status(404).json({ message: 'Department not found' });
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching department', error });
    }
};

// Create new department
const createDepartment = async (req, res) => {
    try {
        const { name, manager, performance, employeeCount, budget } = req.body;
        const newDepartment = new Department({ name, manager, performance, employeeCount, budget });
        await newDepartment.save();
        res.status(201).json(newDepartment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating department', error });
    }
};

// Update department
const updateDepartment = async (req, res) => {
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDepartment) return res.status(404).json({ message: 'Department not found' });
        res.status(200).json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating department', error });
    }
};

// Delete department
const deleteDepartment = async (req, res) => {
    try {
        const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
        if (!deletedDepartment) return res.status(404).json({ message: 'Department not found' });
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting department', error });
    }
};

// Search departments
const searchDepartments = async (req, res) => {
    try {
        const { query } = req.query;
        const departments = await Department.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { manager: { $regex: query, $options: 'i' } },
                { performance: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Error searching departments', error });
    }
};

module.exports = {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    searchDepartments
};
