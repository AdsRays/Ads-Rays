import { Router } from 'express';
import { loadOverview, loadRecommendations, forecast } from '../services/demoService.js';
import { z } from 'zod';

export const demoRouter = Router();

demoRouter.get('/overview', async (_req, res) => {
  const data = await loadOverview();
  res.json(data);
});

demoRouter.get('/recommendations', async (_req, res) => {
  const data = await loadRecommendations();
  res.json(data);
});

const ForecastSchema = z.object({
  budget: z.number().min(0),
  audience: z.string().min(1),
  time: z.string().min(1),
  bid: z.number().min(0),
  format: z.enum(['reels', 'stories', 'feed'])
});

demoRouter.post('/forecast', async (req, res) => {
  try {
    const input = ForecastSchema.parse(req.body);
    const result = await forecast(input);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'Invalid forecast input', detail: String(err) });
  }
});

demoRouter.get('/creatives', async (_req, res) => {
  const result = await import('../data/creatives.json', { assert: { type: 'json' } });
  res.json(result.default);
});



