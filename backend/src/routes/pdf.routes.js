const express = require('express');
const { param } = require('express-validator');
const { generatePDF } = require('../controllers/pdf.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate }     = require('../middleware/validate.middleware');

const router = express.Router();
router.use(authenticate);

// GET /api/pdf/:cvId  — generate and stream PDF for a CV
router.get(
  '/:cvId',
  [param('cvId').isUUID()],
  validate,
  generatePDF
);

module.exports = router;
