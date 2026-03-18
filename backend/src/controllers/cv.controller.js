const { PrismaClient } = require('@prisma/client');
const { computeAtsScore } = require('../services/ats.service');

const prisma = new PrismaClient();

// Prisma include block — fetches CV with ALL related sections
const CV_INCLUDE = {
  education:      { orderBy: { sortOrder: 'asc' } },
  workExp:        { orderBy: { sortOrder: 'asc' } },
  skills:         { orderBy: { sortOrder: 'asc' } },
  projects:       { orderBy: { sortOrder: 'asc' } },
  volunteering:   { orderBy: { sortOrder: 'asc' } },
  references:     { orderBy: { sortOrder: 'asc' } },
  customSections: { orderBy: { sortOrder: 'asc' } },
};

// ── List all CVs for user ────────────────────────────────────
async function listCVs(req, res, next) {
  try {
    const cvs = await prisma.cV.findMany({
      where: { userId: req.userId },
      select: { id: true, title: true, atsScore: true, updatedAt: true, template: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: cvs });
  } catch (err) { next(err); }
}

// ── Get one CV with all sections ─────────────────────────────
async function getCV(req, res, next) {
  try {
    const cv = await prisma.cV.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: CV_INCLUDE,
    });
    if (!cv) return res.status(404).json({ success: false, message: 'CV not found.' });
    res.json({ success: true, data: cv });
  } catch (err) { next(err); }
}

// ── Create a new empty CV ────────────────────────────────────
async function createCV(req, res, next) {
  try {
    const cv = await prisma.cV.create({
      data: { userId: req.userId, title: req.body.title || 'My CV' },
      include: CV_INCLUDE,
    });
    res.status(201).json({ success: true, data: cv });
  } catch (err) { next(err); }
}

// ── Full CV upsert (personal info + all sections) ────────────
async function updateCV(req, res, next) {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.cV.findFirst({ where: { id, userId: req.userId } });
    if (!existing) return res.status(404).json({ success: false, message: 'CV not found.' });

    const {
      title, template, font, fullName, jobTitle, email, phone, linkedin, github,
      summary, sectionOrder,
      education = [], workExp = [], skills = [], projects = [],
      volunteering = [], references = [], customSections = [],
    } = req.body;

    // Run everything in a transaction so sections are replaced atomically
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update the CV header
      await tx.cV.update({
        where: { id },
        data: {
          title, template, font, fullName, jobTitle, email, phone,
          linkedin, github, summary,
          sectionOrder: sectionOrder || existing.sectionOrder,
        },
      });

      // 2. Replace each section (delete-all + create-new)
      await tx.education.deleteMany({ where: { cvId: id } });
      if (education.length) await tx.education.createMany({
        data: education.map((e, i) => ({ ...sanitiseSection(e), cvId: id, sortOrder: i })),
      });

      await tx.workExperience.deleteMany({ where: { cvId: id } });
      if (workExp.length) await tx.workExperience.createMany({
        data: workExp.map((e, i) => ({ ...sanitiseSection(e), cvId: id, sortOrder: i })),
      });

      await tx.skill.deleteMany({ where: { cvId: id } });
      if (skills.length) await tx.skill.createMany({
        data: skills.map((e, i) => ({ ...sanitiseSection(e), cvId: id, sortOrder: i })),
      });

      await tx.project.deleteMany({ where: { cvId: id } });
      if (projects.length) await tx.project.createMany({
        data: projects.map((e, i) => ({ ...sanitiseSection(e), cvId: id, sortOrder: i })),
      });

      await tx.volunteering.deleteMany({ where: { cvId: id } });
      if (volunteering.length) await tx.volunteering.createMany({
        data: volunteering.map((e, i) => ({ ...sanitiseSection(e), cvId: id, sortOrder: i })),
      });

      await tx.reference.deleteMany({ where: { cvId: id } });
      if (references.length) await tx.reference.createMany({
        data: references.map((e, i) => ({ ...sanitiseSection(e), cvId: id, sortOrder: i })),
      });

      await tx.customSection.deleteMany({ where: { cvId: id } });
      if (customSections.length) await tx.customSection.createMany({
        data: customSections.map((e, i) => ({ ...sanitiseSection(e), cvId: id, sortOrder: i })),
      });

      // 3. Re-compute ATS score and persist
      const atsScore = computeAtsScore(req.body);
      await tx.cV.update({ where: { id }, data: { atsScore } });

      return tx.cV.findUnique({ where: { id }, include: CV_INCLUDE });
    });

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

// ── Delete CV ────────────────────────────────────────────────
async function deleteCV(req, res, next) {
  try {
    const existing = await prisma.cV.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) return res.status(404).json({ success: false, message: 'CV not found.' });
    await prisma.cV.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'CV deleted.' });
  } catch (err) { next(err); }
}

// ── Duplicate CV ─────────────────────────────────────────────
async function duplicateCV(req, res, next) {
  try {
    const src = await prisma.cV.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: CV_INCLUDE,
    });
    if (!src) return res.status(404).json({ success: false, message: 'CV not found.' });

    const { id: _id, userId: _uid, createdAt: _ca, updatedAt: _ua, ...rest } = src;
    const copy = await prisma.cV.create({
      data: {
        ...rest,
        userId: req.userId,
        title: src.title + ' (Copy)',
        education:      { create: src.education.map(omitId) },
        workExp:        { create: src.workExp.map(omitId) },
        skills:         { create: src.skills.map(omitId) },
        projects:       { create: src.projects.map(omitId) },
        volunteering:   { create: src.volunteering.map(omitId) },
        references:     { create: src.references.map(omitId) },
        customSections: { create: src.customSections.map(omitId) },
      },
      include: CV_INCLUDE,
    });

    res.status(201).json({ success: true, data: copy });
  } catch (err) { next(err); }
}

// ── Helpers ──────────────────────────────────────────────────
/** Strip client-side id, cvId, sortOrder before DB write */
function sanitiseSection(obj) {
  const { id: _id, cvId: _cvId, sortOrder: _so, ...clean } = obj || {};
  return clean;
}
function omitId({ id: _id, cvId: _cvId, ...rest }) { return rest; }

module.exports = { listCVs, getCV, createCV, updateCV, deleteCV, duplicateCV };
