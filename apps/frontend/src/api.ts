/**
 * ЕДИНСТВЕННЫЙ источник правды для API-урла:
 * правится ТОЛЬКО в apps/frontend/.env.local (VITE_API_BASE)
 */
export const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE
  ?? (globalThis as any)?.VITE_API_BASE
  ?? "http://localhost:4050"; // безопасный дефолт для dev

export async function generatePdfGET(): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/report/pdf`);
  if (!res.ok) throw new Error(`GET pdf failed ${res.status}`);
  return res.blob();
}

export async function generatePdfPOST(): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/report/pdf`, { method: "POST" });
  if (!res.ok) throw new Error(`POST pdf failed ${res.status}`);
  return res.blob();
}
