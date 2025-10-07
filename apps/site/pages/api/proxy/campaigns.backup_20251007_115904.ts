import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Демо: /api/proxy/campaigns?demo=1
 * Возвращает 3 кампании с количеством креативов (2).
 * В бою сохраняйте вашу логику ниже и отдавайте реальный массив.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.demo === "1") {
    return res.status(200).json([
      { id: "c1", name: "Тестовая рекламная кампания № 1", creatives: 2 },
      { id: "c2", name: "Прирост трафика / YouTube",      creatives: 2 },
      { id: "c3", name: "Ремаркетинг / Display",          creatives: 2 }
    ]);
  }

  // === ваша текущая логика (если была) ===
  // Пример заглушки: вернём пустой массив
  return res.status(200).json([]);
}

