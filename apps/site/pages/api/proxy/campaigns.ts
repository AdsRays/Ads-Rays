import type { NextApiRequest, NextApiResponse } from "next";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store",
};

function cors(res: NextApiResponse, status = 200, body?: any) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v as string));
  if (status === 204) return res.status(204).end();
  return res.status(status).json(body ?? {});
}

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" }); }
  finally { clearTimeout(t); }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "OPTIONS") return cors(res, 204);
  if (req.method !== "GET") return cors(res, 405, { error: "Method Not Allowed" });

  const upstream = "https://adsrays-api.onrender.com/api/campaigns";
  const delays = [500, 1000, 2000];

  for (let i = 0; i <= delays.length; i++) {
    try {
      const r = await fetchWithTimeout(upstream, 8000);
      if (r.ok) {
        const data = await r.json().catch(() => []);
        return cors(res, 200, Array.isArray(data) ? data : []);
      }
    } catch { /* retry */ }
    if (i < delays.length) await new Promise(r => setTimeout(r, delays[i]));
  }
  return cors(res, 200, []); // не роняем виджет
}
