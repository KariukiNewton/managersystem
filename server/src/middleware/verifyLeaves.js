const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        // 🔹 1️⃣ Get token from request headers
        const authHeader = req.headers.authorization;
        console.log("🔹 Auth Header Received:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];

        // 🔹 2️⃣ Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret

        // 🔹 3️⃣ Attach user info to the request
        req.user = decoded; // { id: 'USER_ID', role: 'employee' }

        // 🔹 4️⃣ Pass control to the next middleware/controller
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
