import fs from 'node:fs/promises';
import path from 'node:path';

export async function loadOverview() {
  const file = path.resolve(process.cwd(), 'apps/backend/src/data/overview.json');
  const raw = await fs.readFile(file, 'utf-8');
  return JSON.parse(raw);
}

export async function loadRecommendations() {
  const file = path.resolve(process.cwd(), 'apps/backend/src/data/recommendations.json');
  const raw = await fs.readFile(file, 'utf-8');
  return JSON.parse(raw);
}

type ForecastInput = {
  budget: number;
  audience: string;
  time: string;
  bid: number;
  format: 'reels' | 'stories' | 'feed';
};

export async function forecast(input: ForecastInput) {
  const mode = process.env.FORECAST_MODE === 'percent' ? 'percent' : 'money';
  const baseCvr = 0.02; // 2% baseline conversion rate
  const formatMultiplier = input.format === 'reels' ? 1.1 : input.format === 'stories' ? 1.0 : 0.95;
  const bidEff = Math.min(1.2, 0.8 + input.bid / 100);
  const audienceFactor = input.audience.toLowerCase().includes('retarget') ? 1.3 : 1.0;
  const timeFactor = input.time.includes('22:00') || input.time.includes('06:00') ? 0.6 : 1.0;

  const effectiveBudget = input.budget * formatMultiplier * bidEff * audienceFactor * timeFactor;
  const avgOrderValue = 40; // $40
  const cpa = 12; // $12 cost per acquisition baseline
  const orders = Math.round(effectiveBudget / cpa * baseCvr * 50);
  const revenue = orders * avgOrderValue;
  const roi = revenue > 0 ? (revenue - effectiveBudget) / effectiveBudget : 0;
  const ci = {
    low: Math.max(0, revenue * 0.85),
    high: revenue * 1.15
  };

  return mode === 'money'
    ? { revenue, orders, roi, ci }
    : { liftPercent: roi * 100, orders, roi, ci };
}



