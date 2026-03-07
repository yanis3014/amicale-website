const express = require('express');
const multer = require('multer');
const path = require('path');
const activityController = require('../controllers/activityController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/activities')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGallery = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', optionalAuthMiddleware, activityController.list);
router.get('/:id', optionalAuthMiddleware, activityController.getById);

router.post('/', authMiddleware, adminMiddleware, activityController.create);
router.put('/:id', authMiddleware, adminMiddleware, activityController.update);
router.delete('/:id', authMiddleware, adminMiddleware, activityController.remove);
router.patch('/:id/publish', authMiddleware, adminMiddleware, activityController.publish);
router.post('/:id/upload-image', authMiddleware, adminMiddleware, upload.single('image'), activityController.uploadImage);
router.post('/:id/upload-gallery', authMiddleware, adminMiddleware, uploadGallery.array('images', 6), activityController.uploadGallery);
router.delete('/:id/gallery/:index', authMiddleware, adminMiddleware, activityController.deleteGalleryImage);

module.exports = router;
