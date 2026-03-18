const { PrismaClient } = require('@prisma/client');
const { generateCVPdf } = require('../services/pdf.service');

const prisma = new PrismaClient();

const CV_INCLUDE = {
  education: { orderBy: { sortOrder: 'asc' } },
  workExp:   { orderBy: { sortOrder: 'asc' } },
  skills:    { orderBy: { sortOrder: 'asc' } },
  projects:  { orderBy: { sortOrder: 'asc' } },
  volunteering:   { orderBy: { sortOrder: 'asc' } },
  references:     { orderBy: { sortOrder: 'asc' } },
  customSections: { orderBy: { sortOrder: 'asc' } },
};

async function generatePDF(req, res, next) {
  try {
    const cv = await prisma.cV.findFirst({
      where: { id: req.params.cvId, userId: req.userId },
      include: CV_INCLUDE,
    });
    if (!cv) return res.status(404).json({ success: false, message: 'CV not found.' });

    const pdfBuffer = await generateCVPdf(cv);

    const filename = `${(cv.fullName || 'CV').replace(/\s+/g, '_')}_CV.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) { next(err); }
}

module.exports = { generatePDF };
