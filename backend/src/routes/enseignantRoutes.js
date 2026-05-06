const express = require('express');
const multer = require('multer');
const path = require('path');
const enseignantController = require('../controllers/enseignantController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { auditMiddleware } = require('../middleware/auditMiddleware');
const { createSafeFilename, buildImageFilter } = require('../utils/upload');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/enseignants')),
  filename: (req, file, cb) => cb(null, createSafeFilename(file)),
});
const upload = multer({ storage, fileFilter: buildImageFilter(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', enseignantController.list);
router.get('/:id', enseignantController.getById);

router.post('/', authMiddleware, adminMiddleware, auditMiddleware, enseignantController.create);
router.put('/:id', authMiddleware, adminMiddleware, auditMiddleware, enseignantController.update);
router.delete('/:id', authMiddleware, adminMiddleware, auditMiddleware, enseignantController.remove);
router.patch('/:id/reorder', authMiddleware, adminMiddleware, auditMiddleware, enseignantController.reorder);
router.post('/:id/upload-photo', authMiddleware, adminMiddleware, auditMiddleware, upload.single('photo'), enseignantController.uploadPhoto);

module.exports = router;
