const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '');
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ userId: decode.userId });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Admin access required' });
            }
            next();
        })
    } catch {
        res.status(401).json({ message: 'Please Authenticate' })
    }
};

module.exports = { auth, adminAuth }