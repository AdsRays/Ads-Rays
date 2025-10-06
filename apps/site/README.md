# AdsRays / site

## Live Links
- `/` — главная
- `/api/healthz` — 200 `ok`
- `/api/__version` — JSON `{ ok, sha, ref, version }`
- `/api/proxy/campaigns` — прокси к Render (CORS, таймауты)
- `/embed/adsr.js?v=YYYYMMDDHH` — скрипт-виджет

## Tilda embed
<div id="adsr-root"></div>
<script
  src="https://<PROD>.vercel.app/embed/adsr.js?v=YYYYMMDDHH"
  data-root="adsr-root"
  data-api="https://<PROD>.vercel.app/api/proxy/campaigns">
</script>

## Версионирование
Меняйте `?v=` (например `YYYYMMDDHH`) для сброса кэша.

## Диагностика
1) В DevTools запрос `campaigns` идёт на `https://<PROD>.vercel.app/api/proxy/campaigns` и возвращает 200.
2) Если 404 — проверь Root Directory = `apps/site` и успешный прод-деплой.
3) Если 5xx — проверь апстрим `https://adsrays-api.onrender.com/api/campaigns`.
