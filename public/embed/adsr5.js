/* AdsRays Widget v5 — pills + раскрывающаяся панель (метрики + график)
   Изолировано для каждого <script>. Без библиотек. Одна линия эффективности.
*/
(function () {
  const script = document.currentScript;
  const rootId = script.dataset.root || "adsr-root";
  const root = document.getElementById(rootId);
  if (!script || !root) return;

  // ---------- СТИЛИ (один раз на страницу) ----------
  if (!document.getElementById("adsr5-styles")) {
    const css = document.createElement("style");
    css.id = "adsr5-styles";
    css.textContent = `
:root{
  --w:1200px; --h:35px; --bg:#111a3a; --bg2:#0f1633; --border:#383F70; --radius:28px;
  --txt:#B3B3B3; --muted:#6b7280; --white:#f3f4f6; --pill:#1A2049; --grid:#2a345e; --accent:#b26cff;
  --good1:#FFF37D; --good2:#92C681; --font:"PT Sans", Arial, sans-serif;
}
.adsr5-row{width:var(--w);margin:0 auto 16px;}
.adsr5-pill{height:var(--h);position:relative;background:var(--pill);border:1px solid var(--border);
  border-radius:var(--radius);cursor:pointer;user-select:none;outline:none;}
.adsr5-pill__icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);
  width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:12px;color:#cbd5e1;background:#595E81;}
.adsr5-pill__title{position:absolute;left:35px;top:50%;transform:translateY(-50%);
  color:var(--txt);font:14px/1 var(--font);max-width:900px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.adsr5-pill__meta{position:absolute;right:62px;top:50%;transform:translateY(-50%);
  color:var(--txt);font:14px/1 var(--font);}
.adsr5-pill__dot{position:absolute;right:36px;top:50%;transform:translateY(-50%);width:20px;height:20px;border-radius:50%;}
.adsr5-pill__dot.y{right:36px;background:var(--good1);}
.adsr5-pill__dot.g{right:10px;background:var(--good2);}
.adsr5-panel{overflow:hidden;max-height:0;transition:max-height .28s ease; }
.adsr5-open .adsr5-panel{max-height:900px;}
/* Панель */
.adsr5-card{margin:10px auto 0;border:1px solid var(--border);border-radius:12px;background:var(--bg2);padding:16px;}
.adsr5-metrics{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px;}
.adsr5-m{background:#131c43;border:1px solid #273163;border-radius:12px;padding:14px;text-align:center;color:var(--white);}
.adsr5-m b{display:block;font:700 26px/1.1 var(--font);margin-top:6px;letter-spacing:.5px}
.adsr5-m span{font:12px/1.2 var(--font);color:#d1d5db}
.adsr5-chartwrap{display:grid;grid-template-columns:2fr 1fr;gap:12px}
.adsr5-box{background:#0f173b;border:1px solid #273163;border-radius:10px;padding:10px;min-height:240px}
.adsr5-label{color:#9aa4c7;font:12px/1 var(--font);margin-bottom:8px}
.canvas{width:100%;height:220px;display:block}
`;
    document.head.appendChild(css);
  }

  // ---------- ДАННЫЕ ----------
  const fallbackCampaigns = [
    { id: "c1", name: "Тестовая рекламная кампания № 1", creatives: 2 },
    { id: "c2", name: "Прирост трафика / YouTube", creatives: 2 },
    { id: "c3", name: "Ремаркетинг / Display", creatives: 2 }
  ];

  // демо-метрики для панели (простая модель)
  function buildDemoStats() {
    return {
      seen: 10000, clicks: 100, landing: 80, leads: 5, cpl: 1.58,
      labels: ["Пн.","Вт.","Ср.","Чт.","Пт.","Сб.","Вс."],
      efficiency: [8, 20, 24, 26, 31, 27, 30] // % условной эффективности
    };
  }

  const apiCandidates = [
    script.dataset.api || "",
    "https://adsrays-stable-frn2wl122-adsrays.vercel.app/api/campaigns",
    "https://adsrays-demo-ciks65ni2-adsrays.vercel.app/api/campaigns",
    "https://adsrays-demo-buukk73gi-adsrays.vercel.app/api/campaigns"
  ].filter(Boolean);

  // ---------- УТИЛИТЫ ----------
  const fmt = (n) => n.toLocaleString("ru-RU");
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  // Простой рендер линии на canvas
  function drawLineChart(canvas, labels, values) {
    // размер
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // фон сетки
    ctx.strokeStyle = "#2a345e";
    ctx.lineWidth = 1;
    const rows = 5;
    for (let i=0;i<=rows;i++){
      const y = Math.round((h-30) * (i/rows)) + 10;
      ctx.beginPath(); ctx.moveTo(36, y); ctx.lineTo(w-10, y); ctx.stroke();
    }

    // оси
    ctx.strokeStyle = "#3a4579";
    ctx.beginPath(); ctx.moveTo(36, 10); ctx.lineTo(36, h-20); ctx.lineTo(w-10, h-20); ctx.stroke();

    // подписи X
    ctx.fillStyle = "#9aa4c7";
    ctx.font = "12px PT Sans, Arial";
    const stepX = (w-56) / Math.max(1, labels.length-1);
    labels.forEach((t,i)=>{
      const x = 36 + stepX*i;
      ctx.fillText(t, x-8, h-6);
    });

    // масштаб по Y
    const maxV = Math.max(10, Math.max(...values));
    const mapY = (v) => (h-20) - ( (v/maxV) * (h-40) );

    // линия
    ctx.strokeStyle = "#b26cff";  // фиолетовая
    ctx.lineWidth = 2;
    ctx.beginPath();
    values.forEach((v,i)=>{
      const x = 36 + stepX*i;
      const y = mapY(v);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
  }

  // ---------- РЕНДЕР ----------
  function renderCampaignList(campaigns, sourceLabel) {
    campaigns.forEach((c) => {
      const row = el("div","adsr5-row");
      const wrap = el("div");

      const pill = el("div","adsr5-pill");
      pill.setAttribute("tabindex","0");

      const icon = el("div","adsr5-pill__icon","+");
      const title = el("div","adsr5-pill__title", `${c.name} <span style="color:#8ea0d5">(${sourceLabel})</span>`);
      const meta  = el("div","adsr5-pill__meta", `В кампании <span>${fmt(c.creatives||0)}</span> креатива`);
      const d1 = el("div","adsr5-pill__dot y");
      const d2 = el("div","adsr5-pill__dot g");

      pill.append(icon,title,meta,d1,d2);

      // панель
      const panel = el("div","adsr5-panel");
      const card  = el("div","adsr5-card");

      const stats = buildDemoStats(); // можно заменить реальными данными, если API начнет их отдавать

      // метрики
      const metrics = el("div","adsr5-metrics");
      metrics.append(
        el("div","adsr5-m", `<span>УВИДЕЛИ</span><b>${fmt(stats.seen)}</b><span>человек</span>`),
        el("div","adsr5-m", `<span>КЛИКНУЛИ</span><b>${fmt(stats.clicks)}</b><span>человек</span>`),
        el("div","adsr5-m", `<span>ЗАШЛИ НА ЦС</span><b>${fmt(stats.landing)}</b><span>человек</span>`),
        el("div","adsr5-m", `<span>ЛИДЫ</span><b>${fmt(stats.leads)}</b><span>человек</span>`),
        el("div","adsr5-m", `<span>СТОИМОСТЬ ЛИДА</span><b>${stats.cpl}</b><span>USD</span>`)
      );

      // график
      const chartWrap = el("div","adsr5-chartwrap");
      const box1 = el("div","adsr5-box");
      const box2 = el("div","adsr5-box");
      box1.append(el("div","adsr5-label","1 неделя"));
      const canvas = el("canvas","canvas");
      box1.append(canvas);
      box2.append(el("div","adsr5-label"," "));
      chartWrap.append(box1, box2);

      card.append(metrics, chartWrap);
      panel.append(card);

      wrap.append(pill,panel);
      row.append(wrap);
      root.append(row);

      // логика раскрытия
      function toggle(open){
        if (open) {
          wrap.classList.add("adsr5-open");
          icon.textContent = "–";
          // отрисовать график после раскрытия (чтобы ширина была корректной)
          requestAnimationFrame(()=> drawLineChart(canvas, stats.labels, stats.efficiency));
        } else {
          wrap.classList.remove("adsr5-open");
          icon.textContent = "+";
        }
      }
      pill.addEventListener("click", ()=> toggle(!wrap.classList.contains("adsr5-open")));
      pill.addEventListener("keydown", (e)=>{
        if (e.key==="Enter" || e.key===" "){ e.preventDefault(); toggle(!wrap.classList.contains("adsr5-open")); }
      });

      // ресайз — перерисовать график, если открыт
      window.addEventListener("resize", ()=>{
        if (wrap.classList.contains("adsr5-open")) drawLineChart(canvas, stats.labels, stats.efficiency);
      });
    });
  }

  // ---------- ЗАГРУЗКА ДАННЫХ ----------
  (async () => {
    for (const url of apiCandidates) {
      try {
        const res = await fetch(url, { mode:"cors", cache:"no-store" });
        if (!res.ok) throw new Error("bad");
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          renderCampaignList(data, new URL(url).hostname);
          return;
        }
      } catch (_) { /* следующий источник */ }
    }
    renderCampaignList(fallbackCampaigns, "fallback");
  })();
})();
