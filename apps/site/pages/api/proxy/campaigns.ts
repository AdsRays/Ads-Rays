import type { NextApiRequest, NextApiResponse } from "next";

const UPSTREAM = "https://adsrays-api.onrender.com/api/campaigns";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store"
};

function withCors(res: NextApiResponse, status = 200, body?: any) {
  for (const [k, v] of Object.entries(CORS)) res.setHeader(k, v as string);
  if (status === 204) return res.status(204).end();
  return res.status(status).json(body ?? {});
}

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" });
  } finally {
    clearTimeout(id);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "OPTIONS") return withCors(res, 204);
  if (req.method !== "GET") return withCors(res, 405, { error: "Method Not Allowed" });

  const delays = [0, 500, 1200];
  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await new Promise(r => setTimeout(r, delays[i]));
    try {
      const r = await fetchWithTimeout(UPSTREAM, 8000);
      if (r.ok) {
        const data = await r.json().catch(() => []);
        return withCors(res, 200, Array.isArray(data) ? data : []);
      }
    } catch {}
  }
  return withCors(res, 200, []);
}
