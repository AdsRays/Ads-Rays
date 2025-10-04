import escapeHtml from 'escape-html';
import * as cors from 'cors';
import * as express from 'express';
import reportRouter from "./routes/report";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const WHO = "adsrays-cyr-v1";
import escapeHtml from "escape-html";
const app = express();

app.use((req, res, next) => {
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
app.use((req, _res, next) => { console.log(`${req.method} ${req.url}`); next(); });

const FONT_PATH = fileURLToPath(new URL("../../../data/fonts/NotoSans-Regular.ttf", import.meta.url));
const FONT_BYTES = fs.readFileSync(FONT_PATH);

// healthz вЂ” РґР»СЏ СЃРјРѕСѓРє-С‚РµСЃС‚РѕРІ
app.get("/healthz", (_req, res) => res.status(200).send("OK"));

// РІРµСЂСЃРёСЏ СЃРµСЂРІРёСЃР°
app.get("/__version", (req, res) => {
  const v = process.env.GIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.RENDER_GIT_COMMIT || 'dev';
  res.status(200).json({ version: v });
});

// СЃРїРёСЃРѕРє РєР°РјРїР°РЅРёР№ (json)
app.get("/api/campaigns", (req, res) => {
  const list = [
    { id: 'cmp-1', name: 'РўРµСЃС‚РѕРІР°СЏ РєР°РјРїР°РЅРёСЏ 1', status: 'ACTIVE' },
    { id: 'cmp-2', name: 'РўРµСЃС‚РѕРІР°СЏ РєР°РјРїР°РЅРёСЏ 2', status: 'PAUSED' }
  ];
  res.status(200).json(list);
});

// PDF-РѕС‚С‡С‘С‚ (GET Рё POST)
app.get("/api/report/pdf", async (_req, res) => {
  try {
    const pdf = await PDFDocument.create();
    pdf.setTitle("РђРЅР°Р»РёС‚РёРєР° РєР°РјРїР°РЅРёР№");
    pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");
    const page = pdf.addPage([595, 842]); // A4
    const font = await pdf.embedFont(FONT_BYTES);
    const { height } = page.getSize();
    page.drawText("Hello World (English OK)", { x: 50, y: height - 100, size: 14, font, color: rgb(0, 0, 0) });
    page.drawText("РўРµСЃС‚РѕРІР°СЏ PDF", { x: 50, y: height - 130, size: 14, font, color: rgb(0, 0, 0) });
    const bytes = await pdf.save({ useObjectStreams: false });
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(bytes));
  } catch (e) {
    console.error(e);
    res.status(500).send("PDF generation error");
  }
});
app.post("/api/report/pdf", async (_req, res) => {
  try {
    const pdf = await PDFDocument.create();
    pdf.setTitle("РђРЅР°Р»РёС‚РёРєР° РєР°РјРїР°РЅРёР№");
    pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");
    const page = pdf.addPage([595, 842]); // A4
    const font = await pdf.embedFont(FONT_BYTES);
    const { height } = page.getSize();
    page.drawText("Hello World (English OK)", { x: 50, y: height - 100, size: 14, font, color: rgb(0, 0, 0) });
    page.drawText("РўРµСЃС‚РѕРІР°СЏ PDF", { x: 50, y: height - 130, size: 14, font, color: rgb(0, 0, 0) });
    const bytes = await pdf.save({ useObjectStreams: false });
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(bytes));
  } catch (e) {
    console.error(e);
    res.status(500).send("PDF generation error");
  }
});

// Р“Р»РѕР±Р°Р»СЊРЅС‹Р№ 404 (РґРѕР»Р¶РµРЅ РёРґС‚Рё СЃР°РјС‹Рј РїРѕСЃР»РµРґРЅРёРј!)
const PORT = process.env.PORT ? Number(process.env.PORT) : 4050;const u = escapeHtml(String((req as any).originalUrl ?? req.url ?? ""));
  res.status(404)
    .type("text/plain; charset=utf-8")
    .send(Unknown route:  );
});
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT} [${WHO}]`));


