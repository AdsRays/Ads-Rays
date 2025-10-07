import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Разрешаем CORS для всех источников
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Тестовые кампании
  const demo = [
    { id: 1, name: "Тестовая рекламная кампания", creatives: 2 },
    { id: 2, name: "Прирост трафика", creatives: 2 },
    { id: 3, name: "Ремаркетинг", creatives: 2 },
  ];

  res.status(200).json(demo);
}
