(() => {
  // Создаём локальный scope без доступа к window.*
  const currentScript = document.currentScript;
  if (!currentScript) return;

  const rootId = currentScript.dataset.root || "adsr-root";
  const apiUrl = currentScript.dataset.api || "";
  const allowFallback = (currentScript.dataset.fallback || "").toLowerCase() === "true";
  const container = document.getElementById(rootId);
  if (!container) return;

  const render = (html) => (container.innerHTML = html);
  const styleBox =
    "padding:12px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;font-family:sans-serif;";

  const demoData = [
    { id: "c1", name: "Тестовая рекламная кампания № 1", creatives: 2 },
    { id: "c2", name: "Прирост трафика / YouTube", creatives: 2 },
    { id: "c3", name: "Ремаркетинг / Display", creatives: 2 },
  ];

  async function load() {
    try {
      const res = await fetch(apiUrl, { mode: "cors", cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid JSON");
      renderList(data);
    } catch (e) {
      console.warn(`[AdsRays3:${rootId}] Fetch error:`, e);
      if (allowFallback) renderList(demoData);
      else render(`<div style="${styleBox}color:#b91c1c">Ошибка загрузки данных</div>`);
    }
  }

  function renderList(list) {
    const cards = list
      .map(
        (c) => `
        <div style="border:1px solid #ddd;border-radius:8px;padding:10px;margin:6px 0;background:#fff;">
          <div style="font-weight:600;">${c.name}</div>
          <div style="font-size:13px;color:#555;">Креативов: ${c.creatives}</div>
        </div>`
      )
      .join("");
    render(`<div style="${styleBox}">${cards}</div>`);
  }

  render(`<div style="${styleBox}color:#666;">Загрузка...</div>`);
  load();
})();
