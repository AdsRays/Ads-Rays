(function () {
  var s = document.currentScript;
  var rootId = s && s.getAttribute("data-root") || "adsr-root";
  var api = s && s.getAttribute("data-api");
  var root = document.getElementById(rootId) || document.body;

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function skeleton() {
    var wrap = el("div", "adsr-wrap");
    wrap.style.cssText = "font-family:Arial,sans-serif;color:#e6e8eb";
    for (var i = 1; i <= 3; i++) {
      var card = el("div", "adsr-card");
      card.style.cssText = "background:#162033;border-radius:12px;padding:12px;margin:8px 0;min-height:56px;display:flex;align-items:center;opacity:.7";
      card.appendChild(el("div", "", "Кампания " + i + " · загрузка…"));
      wrap.appendChild(card);
    }
    return wrap;
  }

  function render(data) {
    var wrap = el("div", "adsr-wrap");
    wrap.style.cssText = "font-family:Arial,sans-serif;color:#e6e8eb";
    (data.slice(0,3).length ? data.slice(0,3) : [1,2,3]).forEach(function (item, idx) {
      var card = el("div", "adsr-card");
      card.style.cssText = "background:#162033;border-radius:12px;padding:12px;margin:8px 0;min-height:56px;display:flex;align-items:center";
      var title = typeof item === "object" ? (item.name || item.title || ("Кампания " + (idx+1))) : ("Кампания " + (idx+1));
      card.appendChild(el("div", "", title));
      wrap.appendChild(card);
    });
    root.innerHTML = "";
    root.appendChild(wrap);
  }

  function renderError(msg) {
    root.innerHTML = "";
    var box = el("div");
    box.style.cssText = "background:#2a1f1f;border:1px solid #5d3434;color:#ffd7d7;border-radius:12px;padding:12px";
    box.appendChild(el("div", "", "Ошибка загрузки: " + msg));
    var btn = el("button", "", "Повторить");
    btn.style.cssText = "margin-top:8px;padding:8px 12px;border-radius:8px;border:0;background:#2b6cb0;color:#fff;cursor:pointer";
    btn.onclick = load;
    box.appendChild(btn);
    root.appendChild(box);
  }

  function load() {
    if (!api) return renderError("data-api не указан");
    root.innerHTML = "";
    root.appendChild(skeleton());
    fetch(api, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) { render(Array.isArray(data) ? data : []); })
      .catch(function (e) { renderError(e.message || "network"); });
  }

  load();
})();
