const express = require('express');
const pageSettingsController = require('../controllers/pageSettingsController');

const router = express.Router();

router.get('/:key', pageSettingsController.get);

module.exports = router;
