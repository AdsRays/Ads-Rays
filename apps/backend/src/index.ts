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
  app.get(`${prefix}/recommendations`, (_req,res)=>res.json([{ id:1, text:"Р В РЎСџР В РЎвЂўР В Р вЂ Р РЋРІР‚в„–Р РЋР С“Р В РЎвЂР РЋРІР‚С™Р РЋР Р‰ Р В Р’В±Р РЋР вЂ№Р В РўвЂР В Р’В¶Р В Р’ВµР РЋРІР‚С™ Р В Р вЂ¦Р В Р’В° 10%" }]));
  app.get(`${prefix}/creatives`, (_req,res)=>res.json([]));
  app.post(`${prefix}/forecast`, (req,res)=>res.json({ ok:true, input:req.body ?? {} }));

  app.post(`${prefix}/report/pdf`, async (_req,res)=>{
    try{
      const pdf = await PDFDocument.create();
      pdf.registerFontkit(fontkit);
      pdf.setTitle("Р В РЎСџР РЋР вЂљР В РЎвЂўР В Р вЂ Р В Р’ВµР РЋР вЂљР В РЎвЂќР В Р’В° Р В РЎвЂќР В РЎвЂР РЋР вЂљР В РЎвЂР В Р’В»Р В Р’В»Р В РЎвЂР РЋРІР‚В Р РЋРІР‚в„– - Р В РЎСџР РЋР вЂљР В РЎвЂР В Р вЂ Р В Р’ВµР РЋРІР‚С™, Р В РЎВР В РЎвЂР РЋР вЂљ!");
      pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");

      const page = pdf.addPage([595,842]);
      const font = await pdf.embedFont(FONT_BYTES);
      const { height } = page.getSize();

      page.drawText("Hello World (English OK)", { x:50, y:height-100, size:14, font, color: rgb(0,0,0) });
      page.drawText("Р В РЎСџР РЋР вЂљР В РЎвЂўР В Р вЂ Р В Р’ВµР РЋР вЂљР В РЎвЂќР В Р’В° Р В РЎвЂќР В РЎвЂР РЋР вЂљР В РЎвЂР В Р’В»Р В Р’В»Р В РЎвЂР РЋРІР‚В Р РЋРІР‚в„–: Р В РЎСџР РЋР вЂљР В РЎвЂР В Р вЂ Р В Р’ВµР РЋРІР‚С™, Р В РЎВР В РЎвЂР РЋР вЂљ!", { x:50, y:height-120, size:14, font, color: rgb(0,0,0) });

      const bytes = await pdf.save({ useObjectStreams:false });
      const outBuf = Buffer.concat([Buffer.from(bytes), Buffer.from("\\n% CHECK Р В РЎСџР РЋР вЂљР В РЎвЂР В Р вЂ Р В Р’ВµР РЋРІР‚С™\\n","utf8")]);
      res.setHeader("Content-Type","application/pdf");
      res.send(outBuf);
    }catch(e){ console.error(e); res.status(500).send("PDF generation error"); }
  });
}
install(""); install("/api");


});

});

});

const BUILD_TAG = "adsrays-20251003_133644";

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
/** GET-Р В Р’В·Р В Р’ВµР РЋР вЂљР В РЎвЂќР В Р’В°Р В Р’В»Р В РЎвЂў Р В РўвЂР В Р’В»Р РЋР РЏ /api/report/pdf: Р В Р вЂ¦Р РЋРЎвЂњР В Р’В¶Р В Р вЂ¦Р В РЎвЂў Р В РўвЂР В Р’В»Р РЋР РЏ Р В РЎвЂ”Р РЋР вЂљР РЋР РЏР В РЎВР В РЎвЂўР В РІвЂћвЂ“ Р РЋР С“Р РЋР С“Р РЋРІР‚в„–Р В Р’В»Р В РЎвЂќР В РЎвЂ Р В РЎвЂР В Р’В· Р РЋРІР‚С›Р РЋР вЂљР В РЎвЂўР В Р вЂ¦Р РЋРІР‚С™Р В Р’В° */
app.get("/api/report/pdf", async (_req, res) => {
  try {
    const pdf = await PDFDocument.create();
    pdf.setTitle("Р В РЎСџР РЋР вЂљР В РЎвЂўР В Р вЂ Р В Р’ВµР РЋР вЂљР В РЎвЂќР В Р’В° Р В РЎвЂќР В РЎвЂР РЋР вЂљР В РЎвЂР В Р’В»Р В Р’В»Р В РЎвЂР РЋРІР‚В Р РЋРІР‚в„– - Р В РЎСџР РЋР вЂљР В РЎвЂР В Р вЂ Р В Р’ВµР РЋРІР‚С™, Р В РЎВР В РЎвЂР РЋР вЂљ!");
    pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");
    const page = pdf.addPage([595, 842]); // A4
    const font = await pdf.embedFont(FONT_BYTES);
    const { height } = page.getSize();
    page.drawText("Hello World (English OK)", { x: 50, y: height - 100, size: 14, font, color: rgb(0,0,0) });
    page.drawText("Р В РЎСџР РЋР вЂљР В РЎвЂўР В Р вЂ Р В Р’ВµР РЋР вЂљР В РЎвЂќР В Р’В° Р В РЎвЂќР В РЎвЂР РЋР вЂљР В РЎвЂР В Р’В»Р В Р’В»Р В РЎвЂР РЋРІР‚В Р РЋРІР‚в„–: Р В РЎСџР РЋР вЂљР В РЎвЂР В Р вЂ Р В Р’ВµР РЋРІР‚С™, Р В РЎВР В РЎвЂР РЋР вЂљ!", { x: 50, y: height - 120, size: 14, font, color: rgb(0,0,0) });
    const bytes = await pdf.save({ useObjectStreams: false });
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(bytes));
  } catch (e) {
    console.error(e);
    res.status(500).send("PDF generation error");
  }
});
/** Р В РЎвЂєР В Р’В±Р РЋРІР‚В°Р В РЎвЂР В РІвЂћвЂ“ Р В РЎвЂўР В Р’В±Р РЋР вЂљР В Р’В°Р В Р’В±Р В РЎвЂўР РЋРІР‚С™Р РЋРІР‚РЋР В РЎвЂР В РЎвЂќ Р В РЎвЂўР РЋРІР‚С™Р В Р вЂ Р В Р’ВµР РЋРІР‚С™Р В Р’В° PDF (GET/POST) */
async function generatePdfResponse(_req: any, res: any) {
  try {
    const pdf = await PDFDocument.create();
    pdf.setTitle("Р В РЎСџР РЋР вЂљР В РЎвЂўР В Р вЂ Р В Р’ВµР РЋР вЂљР В РЎвЂќР В Р’В° Р В РЎвЂќР В РЎвЂР РЋР вЂљР В РЎвЂР В Р’В»Р В Р’В»Р В РЎвЂР РЋРІР‚В Р РЋРІР‚в„– - Р В РЎСџР РЋР вЂљР В РЎвЂР В Р вЂ Р В Р’ВµР РЋРІР‚С™, Р В РЎВР В РЎвЂР РЋР вЂљ!");
    pdf.setAuthor("AdsRays"); pdf.setCreator("AdsRays"); pdf.setProducer("AdsRays pdf-lib");
    const page = pdf.addPage([595, 842]); // A4
    const font = await pdf.embedFont(FONT_BYTES);
    const { height } = page.getSize();
    page.drawText("Hello World (English OK)", { x: 50, y: height - 100, size: 14, font, color: rgb(0,0,0) });
    page.drawText("Р В РЎСџР РЋР вЂљР В РЎвЂўР В Р вЂ Р В Р’ВµР РЋР вЂљР В РЎвЂќР В Р’В° Р В РЎвЂќР В РЎвЂР РЋР вЂљР В РЎвЂР В Р’В»Р В Р’В»Р В РЎвЂР РЋРІР‚В Р РЋРІР‚в„–: Р В РЎСџР РЋР вЂљР В РЎвЂР В Р вЂ Р В Р’ВµР РЋРІР‚С™, Р В РЎВР В РЎвЂР РЋР вЂљ!", { x: 50, y: height - 120, size: 14, font, color: rgb(0,0,0) });
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
// Р В Р в‚¬Р В Р вЂ¦Р В РЎвЂР В Р вЂ Р В Р’ВµР РЋР вЂљР РЋР С“Р В Р’В°Р В Р’В»Р РЋР Р‰Р В Р вЂ¦Р РЋРІР‚в„–Р В РІвЂћвЂ“ Р РЋР РЉР В Р вЂ¦Р В РўвЂР В РЎвЂ”Р В РЎвЂўР В РЎвЂР В Р вЂ¦Р РЋРІР‚С™ Р В РўвЂР В Р’В»Р РЋР РЏ Tilda-embed
// Р В Р’В­Р В Р вЂ¦Р В РўвЂР В РЎвЂ”Р В РЎвЂўР В РЎвЂР В Р вЂ¦Р РЋРІР‚С™ Р В РўвЂР В Р’В»Р РЋР РЏ Tilda-embed
