(function() {
  // Получаем контейнер для вставки из data-root атрибута
  var scriptTag = document.currentScript || (function(){
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length-1];
  })();
  var rootId = scriptTag.getAttribute('data-root') || 'adsr-root';
  var root = document.getElementById(rootId);
  if (!root) return;

  // Стили вставляем один раз
  if (!document.getElementById('adsr-pill-styles')) {
    var style = document.createElement('style');
    style.id = 'adsr-pill-styles';
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap');
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
    .adsr-row { width: var(--width); margin: 0 auto 15px auto; }
    .adsr-pill {
      width: var(--width);
      height: var(--height);
      position: relative;
      box-sizing: border-box;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      cursor: pointer;
      user-select: none;
      padding: 0;
      overflow: visible;
    }
    .adsr-pill__icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      padding: 0;
      color: var(--icon-plus-color);
      background: var(--icon-circle-bg);
      border: 1px solid rgba(0,0,0,0.06);
      box-sizing: border-box;
    }
    .adsr-pill__text {
      position: absolute;
      left: 35px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-color);
      font-family: var(--font);
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 900px;
    }
    .adsr-pill__meta {
      position: absolute;
      left: 976px;
      top: 50%;
      transform: translateY(-50%);
      display:flex;
      align-items:center;
      gap:10px;
      color: var(--text-color);
      font-family: var(--font);
      font-size: 14px;
      font-weight: 400;
      white-space: nowrap;
    }
    .adsr-pill__dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display:inline-block;
      border:1px solid rgba(0,0,0,0.08);
      box-shadow: 0 1px 0 rgba(0,0,0,0.35), inset 0 -1px 0 rgba(0,0,0,0.15);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .adsr-pill__dot--yellow{ background: var(--dot1); left: 1143px; }
    .adsr-pill__dot--green { background: var(--dot2); left: 1169px; }
    .adsr-panel {
      max-height: 0;
      overflow: hidden;
      transition: max-height 260ms ease;
      margin-top: 10px;
    }
    .adsr-open .adsr-panel{ max-height: 420px; }
    .adsr-pill:focus{ outline: none; box-shadow: 0 0 0 3px rgba(56,63,112,0.12); }
    .adsr-pill:hover{ filter: brightness(1.02); }
    `;
    document.head.appendChild(style);
  }

  // Получаем API URL из атрибута data-api
  var apiUrl = scriptTag.getAttribute('data-api');
  
  // Функция для рендеринга кампаний
  function renderCampaigns(campaigns) {
    campaigns.forEach(function(campaign, idx) {
    var row = document.createElement('div');
    row.className = 'adsr-row';

    var wrapper = document.createElement('div');
    wrapper.className = 'adsr-wrapper';

    var pill = document.createElement('div');
    pill.className = 'adsr-pill';
    pill.setAttribute('role','button');
    pill.setAttribute('tabindex', '0');
    pill.setAttribute('aria-expanded', 'false');

    var icon = document.createElement('div');
    icon.className = 'adsr-pill__icon';
    icon.textContent = '+';

    var text = document.createElement('div');
    text.className = 'adsr-pill__text';
    text.textContent = campaign.name;

    var meta = document.createElement('div');
    meta.className = 'adsr-pill__meta';
    meta.innerHTML = '<div class="adsr-pill__meta-text">В кампании <span class="adsr-count" style="display:inline-block;margin:0 4px;color:var(--text-color);font-family:var(--font);font-size:14px;font-weight:400;line-height:22px;">' +
      campaign.creatives + '</span>креатива:</div>';

    var dot1 = document.createElement('div');
    dot1.className = 'adsr-pill__dot adsr-pill__dot--yellow';
    dot1.title = 'креатив 1';

    var dot2 = document.createElement('div');
    dot2.className = 'adsr-pill__dot adsr-pill__dot--green';
    dot2.title = 'креатив 2';

    pill.appendChild(icon);
    pill.appendChild(text);
    pill.appendChild(meta);
    pill.appendChild(dot1);
    pill.appendChild(dot2);

    var panel = document.createElement('div');
    panel.className = 'adsr-panel';
    panel.setAttribute('aria-hidden','true');
    panel.innerHTML = `
      <table style="width:100%; border-collapse:collapse; color:#fff; margin-top:6px; font-family:var(--font); font-size:13px;">
        <thead><tr><th style="text-align:left; padding:8px 10px; font-weight:600;">Креатив</th><th style="text-align:left; padding:8px 10px;">Показатель</th></tr></thead>
        <tbody>
          <tr><td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">Креатив #1</td><td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">Данные</td></tr>
          <tr><td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">Креатив #2</td><td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">Данные</td></tr>
        </tbody>
      </table>
    `;

    wrapper.appendChild(pill);
    wrapper.appendChild(panel);
    row.appendChild(wrapper);
    root.appendChild(row);

    // JS для открытия/закрытия
    function setOpen(open) {
      if(open){
        wrapper.classList.add('adsr-open');
        pill.setAttribute('aria-expanded','true');
        panel.setAttribute('aria-hidden','false');
        icon.textContent = '–';
      } else {
        wrapper.classList.remove('adsr-open');
        pill.setAttribute('aria-expanded','false');
        panel.setAttribute('aria-hidden','true');
        icon.textContent = '+';
      }
    }
    pill.addEventListener('click', function(){ setOpen(!wrapper.classList.contains('adsr-open')); });
    pill.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!wrapper.classList.contains('adsr-open')); }
    });
    });
  }

  // Данные для примера (fallback если API недоступен)
  var fallbackCampaigns = [
    { name: "Тестовая рекламная кампания № 1", creatives: 2 },
    { name: "Тестовая рекламная кампания № 2", creatives: 2 },
    { name: "Тестовая рекламная кампания № 3", creatives: 2 }
  ];

  // Если указан data-api, пытаемся загрузить данные с API
  if (apiUrl) {
    fetch(apiUrl + '/api/campaigns')
      .then(function(response) {
        if (!response.ok) throw new Error('API error');
        return response.json();
      })
      .then(function(campaigns) {
        renderCampaigns(campaigns);
      })
      .catch(function(error) {
        console.warn('Failed to load campaigns from API, using fallback data:', error);
        renderCampaigns(fallbackCampaigns);
      });
  } else {
    // Если data-api не указан, используем fallback данные
    renderCampaigns(fallbackCampaigns);
  }
})();
