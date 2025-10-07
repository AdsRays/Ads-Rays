(function () {
  var s = document.currentScript;
  var rootId = (s && s.getAttribute("data-root")) || "adsr-root";
  var api     = (s && s.getAttribute("data-api"))  || "";
  var root = document.getElementById(rootId) || document.body;

  // Вставим шрифт + стили один раз
  if (!document.getElementById("adsr-pill-font")) {
    var l = document.createElement("link");
    l.id = "adsr-pill-font";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap";
    document.head.appendChild(l);
  }
  if (!document.getElementById("adsr-pill-style")) {
    var css = document.createElement("style");
    css.id = "adsr-pill-style";
    css.textContent = `
:root{
  --width: 1200px;
  --height: 35px;
  --bg: #1A2049;
  --border: #383F70;
  --radius: 28px;
  --text-color: #B3B3B3;
  --icon-circle-bg: #595E81;
  --icon-plus-color: #B3B3B3;
  --dot1: #FFF37D;
  --dot2: #92C681;
  --font: "PT Sans", Arial, sans-serif;
}
.adsr-row{ width:var(--width); margin:0 auto; }
.adsr-wrapper{ margin:0; padding:0; }
.adsr-block{ margin-bottom:10px; } /* расстояние между плашками 10px */
.adsr-pill{
  width:var(--width); height:var(--height);
  position:relative; box-sizing:border-box;
  background:var(--bg); border:1px solid var(--border);
  border-radius:var(--radius); cursor:pointer; user-select:none;
  padding:0; overflow:visible;
}
.adsr-pill__icon{
  position:absolute; left:10px; top:50%; transform:translateY(-50%);
  width:20px; height:20px; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  font-weight:400; font-size:12px; line-height:20px; padding:0;
  color:var(--icon-plus-color); background:var(--icon-circle-bg);
  border:1px solid rgba(0,0,0,0.06); box-sizing:border-box;
}
.adsr-pill__text{
  position:absolute; left:35px; top:50%; transform:translateY(-50%);
  color:var(--text-color); font-family:var(--font); font-size:14px; font-weight:400; line-height:22px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:900px;
}
.adsr-pill__meta{
  position:absolute; left:976px; top:50%; transform:translateY(-50%);
  display:flex; align-items:center; gap:10px;
  color:var(--text-color); font-family:var(--font); font-size:14px; font-weight:400; white-space:nowrap;
}
.adsr-pill__dot{
  width:20px; height:20px; border-radius:50%; display:inline-block;
  border:1px solid rgba(0,0,0,0.08);
  box-shadow:0 1px 0 rgba(0,0,0,0.35), inset 0 -1px 0 rgba(0,0,0,0.15);
  position:absolute; top:50%; transform:translateY(-50%);
}
.adsr-pill__dot--yellow{ background:var(--dot1); left:1143px; }
.adsr-pill__dot--green { background:var(--dot2); left:1169px; }

.adsr-panel{ max-height:0; overflow:hidden; transition:max-height 260ms ease; margin-top:10px; }
.adsr-open .adsr-panel{ max-height:420px; }

.adsr-pill:focus{ outline:none; box-shadow:0 0 0 3px rgba(56,63,112,0.12); }
.adsr-pill:hover{ filter:brightness(1.02); }
`;
    document.head.appendChild(css);
  }

  function el(tag, cls, txt){
    var e=document.createElement(tag);
    if(cls) e.className=cls;
    if(txt!=null) e.textContent=txt;
    return e;
  }

  function pillBlock(item){
    var wrap = el("div","adsr-block");
    var pill = el("div","adsr-pill"); pill.setAttribute("role","button"); pill.tabIndex=0; pill.setAttribute("aria-expanded","false");

    var icon = el("div","adsr-pill__icon","+"); icon.setAttribute("aria-hidden","true");
    var title = el("div","adsr-pill__text", (item && (item.name||item.title)) || "Тестовая рекламная кампания");
    var meta  = el("div","adsr-pill__meta");
    var metaText = el("div","adsr-pill__meta-text");
    var count = (item && (item.creatives|0)) || 2;
    metaText.innerHTML = 'В кампании <span class="adsr-count" style="display:inline-block;margin:0 4px;color:var(--text-color);font-family:var(--font);font-size:14px;font-weight:400;line-height:22px;">'+count+'</span> креатива:';
    meta.appendChild(metaText);

    var dot1 = el("div","adsr-pill__dot adsr-pill__dot--yellow"); dot1.title="креатив 1";
    var dot2 = el("div","adsr-pill__dot adsr-pill__dot--green");  dot2.title="креатив 2";

    pill.appendChild(icon); pill.appendChild(title); pill.appendChild(meta); pill.appendChild(dot1); pill.appendChild(dot2);
    wrap.appendChild(pill);

    var panel = el("div","adsr-panel"); panel.setAttribute("aria-hidden","true");
    panel.innerHTML = '<table style="width:100%; border-collapse:collapse; color:#fff; margin-top:6px; font-family:var(--font); font-size:13px;">'
      +'<thead><tr><th style="text-align:left; padding:8px 10px; font-weight:600;">Креатив</th><th style="text-align:left; padding:8px 10px;">Показатель</th></tr></thead>'
      +'<tbody>'
      +'<tr><td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">Креатив #1</td><td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">Данные</td></tr>'
      +'<tr><td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">Креатив #2</td><td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">Данные</td></tr>'
      +'</tbody></table>';
    wrap.appendChild(panel);

    function setOpen(open){
      if(open){
        wrap.classList.add("adsr-open");
        pill.setAttribute("aria-expanded","true");
        panel.setAttribute("aria-hidden","false");
        icon.textContent = "–";
      }else{
        wrap.classList.remove("adsr-open");
        pill.setAttribute("aria-expanded","false");
        panel.setAttribute("aria-hidden","true");
        icon.textContent = "+";
      }
    }
    pill.addEventListener("click", function(){ setOpen(!wrap.classList.contains("adsr-open")); });
    pill.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); setOpen(!wrap.classList.contains("adsr-open")); }});

    return wrap;
  }

  function render(list){
    var container = el("div","adsr-row");
    var w = el("div","adsr-wrapper"); container.appendChild(w);
    (list && list.length ? list : [{},{},{}]).forEach(function(item){ w.appendChild(pillBlock(item)); });
    root.innerHTML = ""; root.appendChild(container);
  }

  function renderError(msg){
    root.innerHTML = '<div style="width:var(--width);margin:0 auto;background:#2a1f1f;border:1px solid #5d3434;color:#ffd7d7;border-radius:12px;padding:12px;font-family:var(--font);">'
      + 'Ошибка загрузки: '+msg+'</div>';
  }

  function load(){
    if(!api){ renderError("data-api не указан"); return; }
    fetch(api, { cache:"no-store" })
      .then(function(r){ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
      .then(function(data){ render(Array.isArray(data)?data:[]); })
      .catch(function(e){ renderError(e.message||"network"); });
  }
  load();
})();
