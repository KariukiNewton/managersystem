const UserModel = require("../models/Users.js");
const DepartmentModel = require("../models/DepartmentsModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @desc Register a new user
 * @route POST /auth/register
 * @access Public
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, department, age, gender } = req.body;

    // Validate role
    const validRoles = ["admin", "finance", "employee"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selection" });
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique userId based on role
    const rolePrefix = role.charAt(0).toUpperCase(); // A for admin, F for finance, E for employee
    const userCount = await UserModel.countDocuments({ role });
    const userId = `${rolePrefix}${String(userCount + 1).padStart(4, "0")}`; // Format: A0001, F0001, E0001

    // Find the department by name and retrieve its ObjectId
    let departmentId = null;
    if (department && department !== "Not Assigned") {
      const departmentRecord = await DepartmentModel.findOne({ name: department });
      if (!departmentRecord) {
        return res.status(400).json({ message: "Department not found" });
      }
      departmentId = departmentRecord._id; // Assign ObjectId
    }

    // Create and save new user
    const newUser = new UserModel({
      userId,
      username,
      email,
      password: hashedPassword,
      role,
      department: departmentId, // Save ObjectId or null
      age: age || null,
      gender: gender || "Not Specified",
      lastLogin: null, // User hasn't logged in yet
    });

    await newUser.save();

    // Increment department employee count if assigned
    if (departmentId) {
      await DepartmentModel.findByIdAndUpdate(departmentId, { $inc: { employeeCount: 1 } });
    }

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc Login a user
 * @route POST /auth/login
 * @access Public
 */
const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare password with the hashed password in DB
    const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
    console.log("Entered password:", password);
    console.log("Stored hashed password:", user.password);
    console.log("Password match result:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid user ID or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie with token
    res.cookie("token", token, { httpOnly: true });

    // Send response with user details
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, userId: user.userId, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
  res.json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
