# AdsRays Site (Next.js demo)

## Live Production Links
- Prod `/` — https://ads-rays.vercel.app/
- Prod `/demos/widget` — https://ads-rays.vercel.app/demos/widget

## Инструкция для Tilda (правильный data-api)
Вставьте HTML-блок на странице Тильды:
```html
<div id="adsr-root"></div>
<script
  src="https://cdn.jsdelivr.net/gh/AdsRays/Ads-Rays@main/tilda/embed.js"
  data-root="adsr-root"
  data-api="https://adsrays-api.onrender.com/api/campaigns">
</script>
```

Важно: data-api — полный URL JSON-эндпоинта. Не добавляйте второй /api/campaigns, иначе получится .../api/campaigns/api/campaigns.

Где лежит embed.js и как смотреть логи

Файл скрипта: tilda/embed.js в репозитории AdsRays/Ads-Rays (ветка main).

Диагностика в браузере (DevTools → Console/Network):

Успех: GET https://adsrays-api.onrender.com/api/campaigns → HTTP 200, Content-Type: application/json.

Типичная ошибка: Unknown route: GET /api/campaigns и 404 — на бэкенде нет маршрута или он перекрыт глобальным 404.

Как проверить демо

Откройте /demos/widget: https://ads-rays.vercel.app/demos/widget

В Network убедитесь, что запрос к https://adsrays-api.onrender.com/api/campaigns возвращает 200 + валидный JSON.

В консоли нет ошибок парсинга.

CORS preflight: OPTIONS https://adsrays-api.onrender.com/api/report/pdf → 204 и заголовки Access-Control-Allow-Origin/Methods/Headers.

Технические сведения

Фронтенд: apps/site (Next.js, PNPM workspace).

Прод-деплой: Vercel (Production) с ветки main.

Бэкенд/API: Render → https://adsrays-api.onrender.com.