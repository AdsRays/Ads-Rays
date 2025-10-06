import { NextResponse } from "next/server";
export const runtime = "edge";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store",
};

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try { return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" }); }
  finally { clearTimeout(t); }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  const upstream = "https://adsrays-api.onrender.com/api/campaigns";
  const delays = [500, 1000, 2000]; // 3 попытки: 0.5s, 1s, 2s
  let lastErr: unknown;

  for (let i = 0; i <= delays.length; i++) {
    try {
      const r = await fetchWithTimeout(upstream, 8000);
      if (r.ok) {
        const data = await r.json().catch(() => []);
        return NextResponse.json(Array.isArray(data) ? data : [], { headers: CORS });
      }
      lastErr = new Error(`HTTP ${r.status}`);
    } catch (e) {
      lastErr = e;
    }
    if (i < delays.length) await new Promise(res => setTimeout(res, delays[i]));
  }
  // Возвращаем пустой список с 200, чтобы виджет не падал
  return NextResponse.json([], { status: 200, headers: CORS });
}
