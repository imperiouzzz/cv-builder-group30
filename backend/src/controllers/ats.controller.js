// ── ats.controller.js ────────────────────────────────────────
const { PrismaClient } = require('@prisma/client');
const { computeAtsScore, matchJobDescription } = require('../services/ats.service');

const prisma = new PrismaClient();

const CV_INCLUDE = {
  education: true, workExp: true, skills: true,
  projects: true, volunteering: true, references: true, customSections: true,
};

async function scoreCv(req, res, next) {
  try {
    const cv = await prisma.cV.findFirst({
      where: { id: req.params.cvId, userId: req.userId },
      include: CV_INCLUDE,
    });
    if (!cv) return res.status(404).json({ success: false, message: 'CV not found.' });

    const score = computeAtsScore(cv);
    await prisma.cV.update({ where: { id: cv.id }, data: { atsScore: score } });

    res.json({ success: true, data: { score } });
  } catch (err) { next(err); }
}

async function matchJobDesc(req, res, next) {
  try {
    const cv = await prisma.cV.findFirst({
      where: { id: req.params.cvId, userId: req.userId },
      include: CV_INCLUDE,
    });
    if (!cv) return res.status(404).json({ success: false, message: 'CV not found.' });

    const result = matchJobDescription(cv, req.body.jobDescription);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

module.exports = { scoreCv, matchJobDescription: matchJobDesc };
