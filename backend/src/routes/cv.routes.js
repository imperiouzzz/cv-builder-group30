const express = require('express');
const { body, param } = require('express-validator');
const {
  listCVs, getCV, createCV, updateCV, deleteCV, duplicateCV,
} = require('../controllers/cv.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate }     = require('../middleware/validate.middleware');

const router = express.Router();

// All CV routes require authentication
router.use(authenticate);

// GET    /api/cvs            — list all CVs for logged-in user
router.get('/', listCVs);

// POST   /api/cvs            — create a new empty CV
router.post(
  '/',
  [body('title').optional().isString().trim()],
  validate,
  createCV
);

// GET    /api/cvs/:id        — get one CV (with all relations)
router.get(
  '/:id',
  [param('id').isUUID()],
  validate,
  getCV
);

// PUT    /api/cvs/:id        — full CV upsert (personal info + all sections)
router.put(
  '/:id',
  [param('id').isUUID()],
  validate,
  updateCV
);

// DELETE /api/cvs/:id
router.delete(
  '/:id',
  [param('id').isUUID()],
  validate,
  deleteCV
);

// POST   /api/cvs/:id/duplicate
router.post(
  '/:id/duplicate',
  [param('id').isUUID()],
  validate,
  duplicateCV
);

module.exports = router;
