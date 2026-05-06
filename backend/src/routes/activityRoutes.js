const express = require('express');
const multer = require('multer');
const path = require('path');
const activityController = require('../controllers/activityController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { auditMiddleware } = require('../middleware/auditMiddleware');
const { createSafeFilename, buildImageFilter } = require('../utils/upload');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/activities')),
  filename: (req, file, cb) => cb(null, createSafeFilename(file)),
});
const upload = multer({ storage, fileFilter: buildImageFilter(), limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGallery = multer({ storage, fileFilter: buildImageFilter(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', optionalAuthMiddleware, activityController.list);
router.get('/:id', optionalAuthMiddleware, activityController.getById);

router.post('/', authMiddleware, adminMiddleware, auditMiddleware, activityController.create);
router.put('/:id', authMiddleware, adminMiddleware, auditMiddleware, activityController.update);
router.delete('/:id', authMiddleware, adminMiddleware, auditMiddleware, activityController.remove);
router.patch('/:id/publish', authMiddleware, adminMiddleware, auditMiddleware, activityController.publish);
router.post('/:id/upload-image', authMiddleware, adminMiddleware, auditMiddleware, upload.single('image'), activityController.uploadImage);
router.post('/:id/upload-gallery', authMiddleware, adminMiddleware, auditMiddleware, uploadGallery.array('images', 6), activityController.uploadGallery);
router.delete('/:id/gallery/:index', authMiddleware, adminMiddleware, auditMiddleware, activityController.deleteGalleryImage);

module.exports = router;
