import { Router } from 'express';
import PDFDocument from 'pdfkit';

export const reportRouter = Router();

reportRouter.post('/pdf', async (req, res) => {
  const { summary = {}, top = [], flop = [], recommendations = [] } = req.body || {};

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="adsrays-report.pdf"');

  const doc = new PDFDocument({ info: { Title: 'AdsRays Report' } });
  doc.pipe(res);

  // Page 1: Summary
  doc.fontSize(20).text('AdsRays Demo — Итоги', { align: 'left' });
  doc.moveDown();
  doc.fontSize(10).fillColor('gray').text(new Date().toLocaleString());
  doc.moveDown();
  doc.fillColor('black').fontSize(12).text('Итоги:');
  doc.fontSize(10).text(JSON.stringify(summary, null, 2));
  doc.moveDown();
  doc.fontSize(12).text('Топ креативы:');
  top.forEach((t: any) => doc.fontSize(10).text(`• ${t.title} — CTR ${t.ctr}% CPA $${t.cpa}`));

  // Page 2: Flop and recommendations with watermark
  doc.addPage();
  doc.fontSize(40).fillColor('lightgray').opacity(0.3).text('DEMO PREVIEW', 100, 200, { angle: 30 });
  doc.opacity(1).fillColor('black');
  doc.fontSize(12).text('Антитоп креативы:');
  flop.forEach((t: any) => doc.fontSize(10).text(`• ${t.title} — CTR ${t.ctr}% CPA $${t.cpa}`));
  doc.moveDown();
  doc.fontSize(12).text('3 рекомендации:');
  recommendations.forEach((r: any, i: number) => doc.fontSize(10).text(`${i + 1}. ${r}`));

  doc.end();
});


