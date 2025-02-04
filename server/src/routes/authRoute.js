const express = require('express');
const registerUser = require('../controllers/authContoller');

const router = express.Router;

router.post('/register', registerUser);

module.exports = router;