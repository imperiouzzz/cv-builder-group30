/**
 * Client-side PDF fallback using jsPDF 2.x + html2canvas.
 *
 * Used when:
 *  • The backend Puppeteer service is unavailable
 *  • The user is offline / on free-tier
 *
 * NOTE: This produces an image-based PDF (not text-selectable).
 * Always prefer the backend Puppeteer route — use this only as fallback.
 *
 * Pinned to jsPDF 2.5.2 — DO NOT upgrade to v3/v4 without updating
 * this file. The constructor and addImage API changed in v3+.
 */

import type { CVData } from '@/types/cv.types';

export async function downloadPDFFallback(cv: CVData): Promise<void> {
  // Dynamically import to avoid SSR issues (Next.js server has no DOM)
  const [jspdfModule, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  // jsPDF 2.x exports: { jsPDF } as named + default
  // Use the named export for reliability across bundlers
  const jsPDF = (jspdfModule as any).jsPDF ?? (jspdfModule as any).default;

  const previewEl = document.getElementById('cv-preview');
  if (!previewEl) {
    alert('Could not locate the CV preview panel. Make sure you are on the builder page.');
    return;
  }

  try {
    // Capture the preview panel at 3× for print quality
    const canvas = await html2canvas(previewEl, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData    = canvas.toDataURL('image/png');
    const pdf        = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth  = pdf.internal.pageSize.getWidth();   // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight();  // 297mm
    const imgWidth   = pageWidth;
    const imgHeight  = (canvas.height * imgWidth) / canvas.width;

    let position   = 0;
    let heightLeft = imgHeight;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Overflow pages
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `${(cv.fullName || 'CV').replace(/\s+/g, '_')}_CV.pdf`;
    pdf.save(filename);
  } catch (err) {
    console.error('[PDF Fallback] Export error:', err);
    alert('Client-side PDF export failed. Please use the server-side Export PDF button instead.');
  }
}
