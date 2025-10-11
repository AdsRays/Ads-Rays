(() => {
  // Изоляция для каждого <script>
  const thisScript = document.currentScript;
  if (!thisScript) return;

  const rootId = thisScript.dataset.root || "adsr-root";
  const apiUrl = thisScript.dataset.api || "";
  const allowFallback = String(thisScript.dataset.fallback || "false") === "true";

  const container = document.getElementById(rootId);
  if (!container) return;

  // --- Простейший UI ---
  const render = (html) => (container.innerHTML = html);
  const styleBox = "padding:12px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;font-family:sans-serif;";
  const demoData = [
    { id: "c1", name: "Тестовая рекламная кампания № 1", creatives: 2 },
    { id: "c2", name: "Прирост трафика / YouTube", creatives: 2 },
    { id: "c3", name: "Ремаркетинг / Display", creatives: 2 },
  ];

  async function loadData() {
    try {
      const res = await fetch(apiUrl, { method: "GET", mode: "cors", cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Bad JSON");
      renderCampaigns(data);
    } catch (err) {
      console.warn(`[AdsRays3:${rootId}] Failed to fetch`, err);
      if (allowFallback) renderCampaigns(demoData);
      else render(`<div style="${styleBox}color:#b91c1c">Ошибка загрузки данных</div>`);
    }
  }

  function renderCampaigns(list) {
    const cards = list.map(
      (c) => `
      <div style="border:1px solid #ddd;padding:10px;border-radius:8px;margin:6px 0;">
        <div style="font-weight:600;">${c.name}</div>
        <div style="font-size:13px;color:#555;">Креативов: ${c.creatives}</div>
      </div>`
    );
    render(`<div style="${styleBox}">${cards.join("")}</div>`);
  }

  render(`<div style="${styleBox}color:#666;">Загрузка...</div>`);
  loadData();
})();
