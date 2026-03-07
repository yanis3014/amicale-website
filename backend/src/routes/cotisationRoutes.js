const express = require('express');
const cotisationController = require('../controllers/cotisationController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/submit', authMiddleware, cotisationController.submit);

module.exports = router;
