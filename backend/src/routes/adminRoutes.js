const express = require('express');
const path = require('path');
const multer = require('multer');
const memberController = require('../controllers/memberController');
const cotisationController = require('../controllers/cotisationController');
const adminController = require('../controllers/adminController');
const eventController = require('../controllers/eventController');
const enseignantController = require('../controllers/enseignantController');
const pageSettingsController = require('../controllers/pageSettingsController');
const partenaireController = require('../controllers/partenaireController');
const avantageController = require('../controllers/avantageController');
const auditController = require('../controllers/auditController');
const financeController = require('../controllers/financeController');
const couponController = require('../controllers/couponController');
const emailController = require('../controllers/emailController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { auditMiddleware } = require('../middleware/auditMiddleware');

const router = express.Router();

const pagesStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/pages')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`),
});
const uploadPage = multer({ storage: pagesStorage, limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authMiddleware);
router.use(adminMiddleware);
router.use(auditMiddleware);

router.get('/stats', adminController.stats);
router.get('/audit-logs', auditController.list);
router.get('/audit-admins', auditController.listAdmins);
router.get('/finances/overview', financeController.overview);
router.get('/finances/entries', financeController.listEntries);
router.post('/finances/entries', financeController.createEntry);
router.put('/finances/entries/:id', financeController.updateEntry);
router.delete('/finances/entries/:id', financeController.deleteEntry);
router.put('/settings/:key', pageSettingsController.set);
router.post('/pages/enseignants/header', uploadPage.single('image'), pageSettingsController.uploadEnseignantsHeader);
router.post('/pages/a-propos/:pageKey/image', uploadPage.single('image'), pageSettingsController.uploadAProposImage);
router.post('/pages/home/hero-image', uploadPage.single('image'), pageSettingsController.uploadHomeHeroImage);
router.get('/events', eventController.listAdmin);
router.get('/enseignants', enseignantController.listAll);
router.get('/members', memberController.listAdmin);
router.post('/members', memberController.createMember);
router.get('/members/:id', memberController.getByIdAdmin);
router.put('/members/:id', memberController.updateAdmin);
router.delete('/members/:id', memberController.removeAdmin);
router.get('/cotisations', cotisationController.listAdmin);
router.patch('/cotisations/:id/confirm', cotisationController.confirm);
router.patch('/cotisations/:id/reject', cotisationController.reject);
router.get('/partenaires', partenaireController.listAll);
router.get('/avantages', avantageController.listAll);
router.post('/avantages', avantageController.create);
router.put('/avantages/:id', avantageController.update);
router.delete('/avantages/:id', avantageController.remove);
router.get('/coupons', couponController.listAdmin);
router.post('/coupons', couponController.create);
router.put('/coupons/:id', couponController.update);
router.delete('/coupons/:id', couponController.remove);
router.post('/emails/send', emailController.send);

module.exports = router;
