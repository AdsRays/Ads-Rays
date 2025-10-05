import escapeHtml from 'escape-html';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import reportRouter from "./routes/report.js";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const WHO = "adsrays-cyr-v1";
const app = express();

// Явная обработка OPTIONS для /api/report/pdf
app.options("/api/report/pdf", (req: Request, res: Response) => {
  res.status(204).end();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || "*";
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  next();
});
app.use(express.json());
app.use("/api", reportRouter);
app.use((req: Request, _res: Response, next: NextFunction) => { console.log(`${req.method} ${req.url}`); next(); });

const FONT_PATH = fileURLToPath(new URL("../../../data/fonts/NotoSans-Regular.ttf", import.meta.url));
const FONT_BYTES = fs.readFileSync(FONT_PATH);

// healthz — для смоук-тестов
app.get("/healthz", (_req: Request, res: Response) => res.status(200).send("OK"));

// версия сервиса
app.get("/__version", (req: Request, res: Response) => {
  const v = process.env.GIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.RENDER_GIT_COMMIT || 'dev';
  res.status(200).json({ version: v });
});

// список кампаний (json)
app.get("/api/campaigns", (req: Request, res: Response) => {
  const list = [
    { id: 'cmp-1', name: 'Тестовая кампания 1', status: 'ACTIVE', creatives: 2 },
    { id: 'cmp-2', name: 'Тестовая кампания 2', status: 'PAUSED', creatives: 2 }
  ];
  res.status(200).json(list);
});

// PDF-отчёт (GET и POST)
app.get("/api/report/pdf", async (_req: Request, res: Response) => {
  try {
    const pdf = await PDFDocument.create();
    pdf.setTitle("Аналитика кампаний");
    pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");
    const page = pdf.addPage([595, 842]); // A4
    const font = await pdf.embedFont(FONT_BYTES);
    const { height } = page.getSize();
    page.drawText("Hello World (English OK)", { x: 50, y: height - 100, size: 14, font, color: rgb(0, 0, 0) });
    page.drawText("Тестовая PDF", { x: 50, y: height - 130, size: 14, font, color: rgb(0, 0, 0) });
    const bytes = await pdf.save({ useObjectStreams: false });
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(bytes));
  } catch (e) {
    console.error(e);
    res.status(500).send("PDF generation error");
  }
});
app.post("/api/report/pdf", async (_req: Request, res: Response) => {
  try {
    const pdf = await PDFDocument.create();
    pdf.setTitle("Аналитика кампаний");
    pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");
    const page = pdf.addPage([595, 842]); // A4
    const font = await pdf.embedFont(FONT_BYTES);
    const { height } = page.getSize();
    page.drawText("Hello World (English OK)", { x: 50, y: height - 100, size: 14, font, color: rgb(0, 0, 0) });
    page.drawText("Тестовая PDF", { x: 50, y: height - 130, size: 14, font, color: rgb(0, 0, 0) });
    const bytes = await pdf.save({ useObjectStreams: false });
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(bytes));
  } catch (e) {
    console.error(e);
    res.status(500).send("PDF generation error");
  }
});

// Диагностический маршрут для вывода всех зарегистрированных роутов
app.get("/__routes", (_req: Request, res: Response) => {
  try {
    const out = [];
    const stack = (app as any)._router?.stack || [];
    for (const layer of stack) {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods||{}).filter(Boolean).join(",");
        out.push({ method: methods.toUpperCase(), path: String(layer.route.path) });
      }
    }
    res.type("application/json").send(JSON.stringify(out));
  } catch (e) {
    res.status(500).type("application/json").send(JSON.stringify({ error: String(e) }));
  }
});

// Глобальный 404 (должен идти самым последним!)
app.all("*", (req: Request, res: Response) => {
  const msg = `Unknown route: ${escapeHtml(req.method)} ${escapeHtml(req.url)}`;
  res.status(404).type("text/plain").send(msg);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4050;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  // Диагностика: логируем 10 первых маршрутов
  try {
    const stack = (app as any)._router?.stack || [];
    const list = stack.filter((l:any)=>l.route && l.route.path).slice(0,10).map((l:any)=>`${Object.keys(l.route.methods||{}).join(",").toUpperCase()} ${l.route.path}`);
    console.log("[routes]", list);
  } catch {}
});
