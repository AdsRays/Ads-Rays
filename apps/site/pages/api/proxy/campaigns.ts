import type { NextApiRequest, NextApiResponse } from 'next';

const allowOrigin = '*'; // Можно заменить на 'https://ponomarchuk.com.ua'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');

  // демо-данные по ?demo=1
  if (req.method === 'GET' && req.query.demo === '1') {
    return res.status(200).json([
      { id: 1, name: 'Кампания 1', creatives: 2 },
      { id: 2, name: 'Кампания 2', creatives: 3 },
      { id: 3, name: 'Кампания 3', creatives: 1 },
    ]);
  }

  // ...здесь оставь существующую прокси-логику к бэкенду, если она есть
  return res.status(200).json([]);
}