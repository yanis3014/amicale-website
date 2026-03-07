const express = require('express');
const memberController = require('../controllers/memberController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/me/profile', authMiddleware, memberController.getMyProfile);
router.get('/me/events', authMiddleware, memberController.getMyEvents);

module.exports = router;
