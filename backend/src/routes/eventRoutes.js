const express = require('express');
const multer = require('multer');
const path = require('path');
const eventController = require('../controllers/eventController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/events')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGallery = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Public
router.get('/', eventController.list);
router.get('/:id', eventController.getById);

// Admin
router.post('/', authMiddleware, adminMiddleware, eventController.create);
router.put('/:id', authMiddleware, adminMiddleware, eventController.update);
router.delete('/:id', authMiddleware, adminMiddleware, eventController.remove);
router.patch('/:id/publish', authMiddleware, adminMiddleware, eventController.publish);
router.post('/:id/upload-image', authMiddleware, adminMiddleware, upload.single('image'), eventController.uploadImage);
router.post('/:id/upload-gallery', authMiddleware, adminMiddleware, uploadGallery.array('images', 20), eventController.uploadEventGallery);
router.delete('/:id/gallery/:index', authMiddleware, adminMiddleware, eventController.deleteEventGalleryImage);

// Registrations
router.get('/:id/registrations', authMiddleware, adminMiddleware, eventController.getRegistrations);
router.post('/:id/register', authMiddleware, eventController.registerToEvent);
router.patch('/:id/registrations/:regId/confirm', authMiddleware, adminMiddleware, eventController.confirmRegistration);
router.patch('/:id/registrations/:regId/cancel', authMiddleware, eventController.cancelRegistration);

module.exports = router;
