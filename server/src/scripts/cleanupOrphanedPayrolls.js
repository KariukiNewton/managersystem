const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/Users.js");
const Payroll = require("../models/payrollModel.js");

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/empdatabase", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB...");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit process with failure
    }
};

// Cleanup function for orphaned payrolls
const cleanupOrphanedPayrolls = async () => {
    try {
        console.log("🧹 Starting orphaned payroll cleanup...");

        const payrollRecords = await Payroll.find();

        for (const payroll of payrollRecords) {
            const userExists = await User.exists({ _id: payroll.name });

            if (!userExists) {
                await Payroll.deleteOne({ _id: payroll._id });
                console.log(`🗑️ Deleted orphaned payroll record: ${payroll._id}`);
            }
        }

        console.log("✅ Orphaned payroll cleanup completed.");
    } catch (error) {
        console.error("❌ Error during cleanup:", error);
    } finally {
        mongoose.connection.close();
        console.log("🔌 MongoDB connection closed.");
    }
};

// Execute script
(async () => {
    await connectDB();
    await cleanupOrphanedPayrolls();
})();
