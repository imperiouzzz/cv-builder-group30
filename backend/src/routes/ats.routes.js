const express = require('express');
const { body, param } = require('express-validator');
const { scoreCv, matchJobDescription } = require('../controllers/ats.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate }     = require('../middleware/validate.middleware');

const router = express.Router();
router.use(authenticate);

// POST /api/ats/score/:cvId  — compute & persist ATS score for a CV
router.post(
  '/score/:cvId',
  [param('cvId').isUUID()],
  validate,
  scoreCv
);

// POST /api/ats/match/:cvId  — compare CV against a job description
router.post(
  '/match/:cvId',
  [
    param('cvId').isUUID(),
    body('jobDescription').isString().isLength({ min: 50 }).withMessage('Job description too short'),
  ],
  validate,
  matchJobDescription
);

module.exports = router;
