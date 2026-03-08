const express = require('express');
const avantageController = require('../controllers/avantageController');

const router = express.Router();

router.get('/', avantageController.list);

module.exports = router;
