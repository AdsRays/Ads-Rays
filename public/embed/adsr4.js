(function () {
  const script = document.currentScript;
  const rootId = script.dataset.root || "adsr-root";
  const root = document.getElementById(rootId);
  if (!root) return;

  // подключаем стили один раз
  if (!document.getElementById("adsr-pill-styles")) {
    const style = document.createElement("style");
    style.id = "adsr-pill-styles";
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap');
    :root{
      --width:1200px;--height:35px;--bg:#1A2049;--border:#383F70;--radius:28px;
      --text-color:#B3B3B3;--icon-circle-bg:#595E81;--icon-plus-color:#B3B3B3;
      --dot1:#FFF37D;--dot2:#92C681;--font:"PT Sans",Arial,sans-serif;
    }
    .adsr-row{width:var(--width);margin:0 auto 15px;}
    .adsr-pill{width:var(--width);height:var(--height);position:relative;box-sizing:border-box;
      background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);
      cursor:pointer;user-select:none;overflow:visible;}
    .adsr-pill__icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);
      width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;
      font-size:12px;color:var(--icon-plus-color);background:var(--icon-circle-bg);}
    .adsr-pill__text{position:absolute;left:35px;top:50%;transform:translateY(-50%);
      color:var(--text-color);font-family:var(--font);font-size:14px;width:900px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
    .adsr-pill__meta{position:absolute;left:976px;top:50%;transform:translateY(-50%);
      color:var(--text-color);font-family:var(--font);font-size:14px;}
    .adsr-pill__dot{width:20px;height:20px;border-radius:50%;display:inline-block;
      position:absolute;top:50%;transform:translateY(-50%);}
    .adsr-pill__dot--yellow{background:var(--dot1);left:1143px;}
    .adsr-pill__dot--green{background:var(--dot2);left:1169px;}
    .adsr-panel{max-height:0;overflow:hidden;transition:max-height .26s ease;margin-top:10px;}
    .adsr-open .adsr-panel{max-height:420px;}
    `;
    document.head.appendChild(style);
  }

  // fallback-данные
  const fallbackCampaigns = [
    { name: "Тестовая рекламная кампания № 1", creatives: 2 },
    { name: "Прирост трафика / YouTube", creatives: 2 },
    { name: "Ремаркетинг / Display", creatives: 2 }
  ];

  // список возможных API
  const apiCandidates = [
    script.dataset.api || "",
    "https://adsrays-stable-frn2wl122-adsrays.vercel.app/api/campaigns",
    "https://adsrays-demo-ciks65ni2-adsrays.vercel.app/api/campaigns",
    "https://adsrays-demo-buukk73gi-adsrays.vercel.app/api/campaigns"
  ].filter(Boolean);

  function render(campaigns, source) {
    campaigns.forEach((c) => {
      const row = document.createElement("div");
      row.className = "adsr-row";

      const wrap = document.createElement("div");
      wrap.className = "adsr-wrapper";

      const pill = document.createElement("div");
      pill.className = "adsr-pill";
      pill.setAttribute("tabindex", "0");

      const icon = document.createElement("div");
      icon.className = "adsr-pill__icon";
      icon.textContent = "+";

      const text = document.createElement("div");
      text.className = "adsr-pill__text";
      text.textContent = c.name + `  (${source})`;

      const meta = document.createElement("div");
      meta.className = "adsr-pill__meta";
      meta.innerHTML = `В кампании <span>${c.creatives}</span> креатива`;

      const dot1 = document.createElement("div");
      dot1.className = "adsr-pill__dot adsr-pill__dot--yellow";
      const dot2 = document.createElement("div");
      dot2.className = "adsr-pill__dot adsr-pill__dot--green";

      pill.append(icon, text, meta, dot1, dot2);

      const panel = document.createElement("div");
      panel.className = "adsr-panel";
      panel.innerHTML =
        `<table style="width:100%;color:#fff;font-family:var(--font);font-size:13px;">
          <tbody>
            <tr><td>Креатив #1</td><td>Данные</td></tr>
            <tr><td>Креатив #2</td><td>Данные</td></tr>
          </tbody>
        </table>`;

      wrap.append(pill, panel);
      row.append(wrap);
      root.append(row);

      function toggle(open) {
        if (open) {
          wrap.classList.add("adsr-open");
          icon.textContent = "–";
        } else {
          wrap.classList.remove("adsr-open");
          icon.textContent = "+";
        }
      }
      pill.addEventListener("click", () => toggle(!wrap.classList.contains("adsr-open")));
      pill.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(!wrap.classList.contains("adsr-open"));
        }
      });
    });
  }

  // выбираем первый рабочий API
  (async () => {
    for (const url of apiCandidates) {
      try {
        const res = await fetch(url, { mode: "cors", cache: "no-store" });
        if (!res.ok) throw new Error("bad");
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          render(data, new URL(url).hostname);
          return;
        }
      } catch (_) { /* пробуем следующий */ }
    }
    render(fallbackCampaigns, "fallback");
  })();
})();
