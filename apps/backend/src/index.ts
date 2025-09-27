import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import multer from "multer";
import PdfPrinter from "pdfmake";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Настройка multer для загрузки файлов
const upload = multer({ dest: 'uploads/' });

// HEALTHCHECK
app.get("/health", (_req, res) => {
  res.json({ ok: true, time: dayjs().toISOString() });
});

// DEMO API
app.get("/api/demo/overview", (_req, res) => {
  res.json({
    status: "ok",
    trafficLight: [
      { id: "summer_sale", label: "Сливает", color: "red", note: "-$240/мес" },
      { id: "new_collection", label: "а грани", color: "yellow", note: "ROI 1.2x" },
      { id: "retargeting", label: "олото", color: "green", note: "ROI 4.8x" },
    ],
  });
});

app.get("/api/demo/recommendations", (_req, res) => {
  res.json({
    nowDo: [
      "тключить аудиторию 45+ в убыточной кампании",
      "еренести $200 в ретаргетинг",
      "оменять креатив с низким CTR (<0.7%)"
    ],
  });
});

app.get("/api/demo/creatives", (_req, res) => {
  res.json({
    items: [
      { id: "A", badge: "🔥", ctr: 2.8, cpa: 12, verdict: "учший - масштабируйте!" },
      { id: "B", badge: "😐", ctr: 1.1, cpa: 19, verdict: "Средний - оптимизируйте" },
      { id: "C", badge: "🥶", ctr: 0.3, cpa: 45, verdict: "тключите" },
      { id: "D", badge: "😐", ctr: 0.9, cpa: 22, verdict: "а доработку" },
    ],
  });
});

// PDF генерация
app.post("/api/report/pdf", (req, res) => {
  try {
    const { summary, top, flop, recommendations } = req.body;
    
    const docDefinition = {
      content: [
        { text: 'AdsRays Report', style: 'header' },
        { text: `Generated: ${dayjs().format('YYYY-MM-DD HH:mm')}`, style: 'subheader' },
        { text: 'Summary', style: 'section' },
        { text: JSON.stringify(summary, null, 2), style: 'code' },
        { text: 'Top Creatives', style: 'section' },
        { text: JSON.stringify(top, null, 2), style: 'code' },
        { text: 'Recommendations', style: 'section' },
        { ul: recommendations }
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 12, color: 'gray' },
        section: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        code: { fontSize: 10, font: 'Courier' }
      }
    };

    const printer = new PdfPrinter({});
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=adsrays-report.pdf');
    
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

// Прогноз
app.post("/api/demo/forecast", (req, res) => {
  const { budget, audience, time, bid, format } = req.body;
  
  // Простая логика прогноза
  const baseRevenue = budget * 0.3;
  const audienceMultiplier = audience === 'retarget' ? 1.5 : 1.0;
  const timeMultiplier = time.includes('08:00-20:00') ? 1.2 : 1.0;
  const bidMultiplier = bid > 30 ? 1.3 : 1.0;
  
  const revenue = baseRevenue * audienceMultiplier * timeMultiplier * bidMultiplier;
  const orders = Math.floor(revenue / 25);
  
  res.json({
    revenue: Math.round(revenue),
    orders,
    liftPercent: Math.round((revenue / budget - 1) * 100)
  });
});

// Загрузка CSV
app.post("/api/demo/upload-csv", upload.single('file'), (req, res) => {
  // Имитация обработки CSV
  res.json({
    problems: [
      "Низкий CTR у креативов A и B",
      "Высокий CPA в кампании 'Лето'",
      "Неоптимальное время показа"
    ],
    actions: [
      "Обновить креативы с низким CTR",
      "Перераспределить бюджет в пользу ретаргетинга",
      "Настроить показы в пиковые часы"
    ]
  });
});

// Загрузка скриншота
app.post("/api/demo/upload-screenshot", upload.single('file'), (req, res) => {
  // Имитация OCR обработки
  res.json({
    problems: [
      "Обнаружены нарушения в тексте объявления",
      "Некорректное использование брендинга",
      "Проблемы с читаемостью текста"
    ],
    actions: [
      "Исправить текст согласно гайдлайнам",
      "Обновить брендинг элементы",
      "Улучшить контрастность текста"
    ]
  });
});

// Serve static files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, "../../frontend/dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDist));
  
  // Handle client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  // Корень (для проверки в браузере)
  app.get("/", (_req, res) => {
    res.type("text/plain").send("AdsRays Demo API is running");
  });
}

const PORT = Number(process.env.PORT || 4000);
// ажно: слушаем 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${PORT}`);
});

