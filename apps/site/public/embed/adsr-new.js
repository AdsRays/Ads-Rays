(function () {
  var s = document.currentScript;
  var rootId = s && s.getAttribute('data-root') || 'adsr-root';
  var api = s && s.getAttribute('data-api');
  var root = document.getElementById(rootId) || document.body;

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function createDropdown(title, lines) {
    var card = el('div', 'adsr-card-new');
    card.style.cssText =
      'width:1160px; margin:18px auto; background:#141B40; border-radius:0 0 5px 5px; ' +
      'box-shadow:0 2px 12px rgba(20,27,64,0.06); padding:0; font-family:Arial,sans-serif; color:#e6e8eb;';

    var head = el('div', 'adsr-card-new-head', title);
    head.style.cssText = 'padding:24px 32px 12px 32px;font-size:22px;font-weight:600;';
    card.appendChild(head);

    var body = el('div', 'adsr-card-new-body');
    body.style.cssText = 'padding:8px 32px 24px 32px;';
    lines.forEach(function (line) {
      var row = el('div', 'adsr-card-new-row', line);
      row.style.cssText = 'padding:12px 0; font-size:18px; border-bottom:1px solid rgba(56,63,112,0.13);';
      body.appendChild(row);
    });
    card.appendChild(body);

    return card;
  }

  function render(data) {
    var wrap = el('div', 'adsr-wrap-new');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;';
    (data.length ? data : [
      {title:'Кампания 1',lines:['Строка 1','Строка 2','Строка 3']},
      {title:'Кампания 2',lines:['Строка A','Строка B','Строка C']},
      {title:'Кампания 3',lines:['Текст 1','Текст 2','Текст 3']}
    ])
      .forEach(function(item){
        wrap.appendChild(createDropdown(item.title, item.lines));
      });
    root.innerHTML = '';
    root.appendChild(wrap);
  }

  function renderError(msg) {
    root.innerHTML = '';
    var box = el('div');
    box.style.cssText = 'background:#2a1f1f;border:1px solid #5d3434;color:#ffd7d7;border-radius:12px;padding:12px';
    box.appendChild(el('div', '', 'Ошибка загрузки: ' + msg));
    root.appendChild(box);
  }

  function load() {
    if (!api) return renderError('data-api не указан');
    root.innerHTML = '<div style=\"color:#aaa;padding:24px;text-align:center;\">Загрузка...</div>';
    fetch(api, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) { render(Array.isArray(data) ? data : []); })
      .catch(function (e) { renderError(e.message || 'network'); });
  }

  load();
})();
