const express = require('express');
const memberController = require('../controllers/memberController');
const cotisationController = require('../controllers/cotisationController');
const adminController = require('../controllers/adminController');
const eventController = require('../controllers/eventController');
const enseignantController = require('../controllers/enseignantController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', adminController.stats);
router.get('/events', eventController.listAdmin);
router.get('/enseignants', enseignantController.listAll);
router.get('/members', memberController.listAdmin);
router.get('/members/:id', memberController.getByIdAdmin);
router.put('/members/:id', memberController.updateAdmin);
router.delete('/members/:id', memberController.removeAdmin);
router.get('/cotisations', cotisationController.listAdmin);
router.patch('/cotisations/:id/confirm', cotisationController.confirm);
router.patch('/cotisations/:id/reject', cotisationController.reject);

module.exports = router;
