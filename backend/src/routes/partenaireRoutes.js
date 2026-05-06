const express = require('express');
const multer = require('multer');
const path = require('path');
const partenaireController = require('../controllers/partenaireController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { auditMiddleware } = require('../middleware/auditMiddleware');
const { createSafeFilename, buildImageFilter } = require('../utils/upload');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/partenaires')),
  filename: (req, file, cb) => cb(null, createSafeFilename(file)),
});
const upload = multer({ storage, fileFilter: buildImageFilter(), limits: { fileSize: 2 * 1024 * 1024 } });

router.get('/', partenaireController.list);

router.get('/:id', partenaireController.getById);

router.post('/', authMiddleware, adminMiddleware, auditMiddleware, partenaireController.create);
router.put('/:id', authMiddleware, adminMiddleware, auditMiddleware, partenaireController.update);
router.delete('/:id', authMiddleware, adminMiddleware, auditMiddleware, partenaireController.remove);
router.post('/:id/upload-logo', authMiddleware, adminMiddleware, auditMiddleware, upload.single('logo'), partenaireController.uploadLogo);

module.exports = router;
