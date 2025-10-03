import express from "express";
import reportRouter from "./routes/report";import * as fs from "fs";
import { fileURLToPath } from "url";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const WHO = "adsrays-cyr-v1";

const app = express();
app.use((req,res,next)=>{ const o=req.headers.origin||"*"; res.header("Access-Control-Allow-Origin", o); res.header("Vary","Origin"); res.header("Access-Control-Allow-Methods","GET,POST,OPTIONS"); res.header("Access-Control-Allow-Headers","Content-Type"); if(req.method==="OPTIONS") return res.sendStatus(204); next(); });
app.use(express.json());
app.use("/api", reportRouter);
app.use((req,_res,next)=>{ console.log(`${req.method} ${req.url}`); next(); });

const FONT_PATH = fileURLToPath(new URL("../../../data/fonts/NotoSans-Regular.ttf", import.meta.url));
const FONT_BYTES = fs.readFileSync(FONT_PATH);

app.get("/healthz", (_req,res)=>res.status(200).send("OK"));
app.get("/__whoami", (_req,res)=>res.json({ who: WHO }));

function install(prefix: string){
  app.get(`${prefix}/overview`, (_req,res)=>res.json({ kpis: [], summary: "ok" }));
  app.get(`${prefix}/recommendations`, (_req,res)=>res.json([{ id:1, text:"Р СџР С•Р Р†РЎвЂ№РЎРѓР С‘РЎвЂљРЎРЉ Р В±РЎР‹Р Т‘Р В¶Р ВµРЎвЂљ Р Р…Р В° 10%" }]));
  app.get(`${prefix}/creatives`, (_req,res)=>res.json([]));
  app.post(`${prefix}/forecast`, (req,res)=>res.json({ ok:true, input:req.body ?? {} }));

  app.post(`${prefix}/report/pdf`, async (_req,res)=>{
    try{
      const pdf = await PDFDocument.create();
      pdf.registerFontkit(fontkit);
      pdf.setTitle("Р СџРЎР‚Р С•Р Р†Р ВµРЎР‚Р С”Р В° Р С”Р С‘РЎР‚Р С‘Р В»Р В»Р С‘РЎвЂ РЎвЂ№ - Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ, Р СР С‘РЎР‚!");
      pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");

      const page = pdf.addPage([595,842]);
      const font = await pdf.embedFont(FONT_BYTES);
      const { height } = page.getSize();

      page.drawText("Hello World (English OK)", { x:50, y:height-100, size:14, font, color: rgb(0,0,0) });
      page.drawText("Р СџРЎР‚Р С•Р Р†Р ВµРЎР‚Р С”Р В° Р С”Р С‘РЎР‚Р С‘Р В»Р В»Р С‘РЎвЂ РЎвЂ№: Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ, Р СР С‘РЎР‚!", { x:50, y:height-120, size:14, font, color: rgb(0,0,0) });

      const bytes = await pdf.save({ useObjectStreams:false });
      const outBuf = Buffer.concat([Buffer.from(bytes), Buffer.from("\\n% CHECK Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ\\n","utf8")]);
      res.setHeader("Content-Type","application/pdf");
      res.send(outBuf);
    }catch(e){ console.error(e); res.status(500).send("PDF generation error"); }
  });
}
install(""); install("/api");


});

const BUILD_TAG = "adsrays-20251003_132907";

const campaigns = [
  { id: "cmp-1", title: "Тестовая рекламная кампания № 1",
    creatives: [ { id: "cr-1", name: "Креатив #1", ctr: 1.23 },
                 { id: "cr-2", name: "Креатив #2", ctr: 2.34 } ] },
  { id: "cmp-2", title: "Кампания № 2",
    creatives: [ { id: "cr-3", name: "Видео 15с", ctr: 0.98 } ] },
  { id: "cmp-3", title: "Кампания № 3", creatives: [] }
];

app.get("/api/campaigns", (_req, res) => {
  res.json({ campaigns });
});

app.get("/__version", (_req, res) => {
  res.type("text/plain").send(BUILD_TAG);
});
app.all("*",(req,res)=>res.status(404).send(`Unknown route: ${req.method} ${req.url}`));

const PORT = process.env.PORT ? Number(process.env.PORT) : 4050;
app.listen(PORT, ()=>console.log(`API running on http://localhost:${PORT} [${WHO}]`));
/** GET-Р В·Р ВµРЎР‚Р С”Р В°Р В»Р С• Р Т‘Р В»РЎРЏ /api/report/pdf: Р Р…РЎС“Р В¶Р Р…Р С• Р Т‘Р В»РЎРЏ Р С—РЎР‚РЎРЏР СР С•Р в„– РЎРѓРЎРѓРЎвЂ№Р В»Р С”Р С‘ Р С‘Р В· РЎвЂћРЎР‚Р С•Р Р…РЎвЂљР В° */
app.get("/api/report/pdf", async (_req, res) => {
  try {
    const pdf = await PDFDocument.create();
    pdf.setTitle("Р СџРЎР‚Р С•Р Р†Р ВµРЎР‚Р С”Р В° Р С”Р С‘РЎР‚Р С‘Р В»Р В»Р С‘РЎвЂ РЎвЂ№ - Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ, Р СР С‘РЎР‚!");
    pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");
    const page = pdf.addPage([595, 842]); // A4
    const font = await pdf.embedFont(FONT_BYTES);
    const { height } = page.getSize();
    page.drawText("Hello World (English OK)", { x: 50, y: height - 100, size: 14, font, color: rgb(0,0,0) });
    page.drawText("Р СџРЎР‚Р С•Р Р†Р ВµРЎР‚Р С”Р В° Р С”Р С‘РЎР‚Р С‘Р В»Р В»Р С‘РЎвЂ РЎвЂ№: Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ, Р СР С‘РЎР‚!", { x: 50, y: height - 120, size: 14, font, color: rgb(0,0,0) });
    const bytes = await pdf.save({ useObjectStreams: false });
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(bytes));
  } catch (e) {
    console.error(e);
    res.status(500).send("PDF generation error");
  }
});
/** Р С›Р В±РЎвЂ°Р С‘Р в„– Р С•Р В±РЎР‚Р В°Р В±Р С•РЎвЂљРЎвЂЎР С‘Р С” Р С•РЎвЂљР Р†Р ВµРЎвЂљР В° PDF (GET/POST) */
async function generatePdfResponse(_req: any, res: any) {
  try {
    const pdf = await PDFDocument.create();
    pdf.setTitle("Р СџРЎР‚Р С•Р Р†Р ВµРЎР‚Р С”Р В° Р С”Р С‘РЎР‚Р С‘Р В»Р В»Р С‘РЎвЂ РЎвЂ№ - Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ, Р СР С‘РЎР‚!");
    pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");
    const page = pdf.addPage([595, 842]); // A4
    const font = await pdf.embedFont(FONT_BYTES);
    const { height } = page.getSize();
    page.drawText("Hello World (English OK)", { x: 50, y: height - 100, size: 14, font, color: rgb(0,0,0) });
    page.drawText("Р СџРЎР‚Р С•Р Р†Р ВµРЎР‚Р С”Р В° Р С”Р С‘РЎР‚Р С‘Р В»Р В»Р С‘РЎвЂ РЎвЂ№: Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ, Р СР С‘РЎР‚!", { x: 50, y: height - 120, size: 14, font, color: rgb(0,0,0) });
    const bytes = await pdf.save({ useObjectStreams: false });
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(bytes));
  } catch (e) {
    console.error(e);
    res.status(500).send("PDF generation error");
  }
}

import type { Request, Response } from "express";
});
// Р Р€Р Р…Р С‘Р Р†Р ВµРЎР‚РЎРѓР В°Р В»РЎРЉР Р…РЎвЂ№Р в„– РЎРЊР Р…Р Т‘Р С—Р С•Р С‘Р Р…РЎвЂљ Р Т‘Р В»РЎРЏ Tilda-embed
// Р В­Р Р…Р Т‘Р С—Р С•Р С‘Р Р…РЎвЂљ Р Т‘Р В»РЎРЏ Tilda-embed
