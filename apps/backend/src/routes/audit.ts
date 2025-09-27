import { Router } from 'express';
import multer from 'multer';
import { parseCsvAndDiagnose, simulateOcrAndDiagnose } from '../services/auditService.js';

const upload = multer({ storage: multer.memoryStorage() });
export const auditRouter = Router();

auditRouter.post('/upload-csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const result = await parseCsvAndDiagnose(req.file.buffer.toString('utf-8'));
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: 'CSV parse failed', detail: String(e) });
  }
});

auditRouter.post('/upload-screenshot', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const result = await simulateOcrAndDiagnose();
  res.json(result);
});



