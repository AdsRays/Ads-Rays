# === AdsRays: авто-исправление парсинга JSON для embed/adsr.js ===
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$repo = "C:\Users\Alex\Desktop\adsrays-demo"
$target = Join-Path $repo "apps\site\public\embed\adsr.js"

cd $repo
Write-Host ">>> Проверяю JSON API..." -ForegroundColor Cyan
$apiUrl = "https://site-jm67k1fl1-adsrays.vercel.app/api/proxy/campaigns?demo=1"

try {
    $response = Invoke-WebRequest -Uri $apiUrl -UseBasicParsing -TimeoutSec 10
    $json = $response.Content | ConvertFrom-Json
    if ($json -is [array]) {
        Write-Host "✅ API возвращает массив из $($json.Count) элементов." -ForegroundColor Green
    } else {
        Write-Host "⚠️ API возвращает объект, обновлю парсер под него." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Ошибка при обращении к API: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ">>> Исправляю код парсинга..." -ForegroundColor Cyan
$content = Get-Content $target -Raw -Encoding UTF8

# Новый универсальный код парсинга
$fix = @"
fetch(api)
  .then(r => r.json())
  .then(data => {
    const campaigns = Array.isArray(data) ? data : (data.campaigns || []);
    if (!campaigns.length) throw new Error('Нет кампаний');
    renderTiles(campaigns);
  })
  .catch(err => {
    root.innerHTML = '<div style="color:red;text-align:center;margin:20px">Ошибка загрузки данных</div>';
    console.error(err);
  });
"@

# Заменяем старый участок fetch(...)
$content = [regex]::Replace($content, 'fetch\(api\)[\s\S]+?catch\(err.+?\}\);', $fix)
Set-Content -Path $target -Value $content -Encoding UTF8

Write-Host ">>> Коммит и деплой..." -ForegroundColor Yellow
git add $target
git commit -m "fix(widget): universal JSON parser for campaigns"
git push --set-upstream origin fix/vercel-pages-api

$deployOutput = npx vercel --prod
$deployUrl = ($deployOutput | Select-String -Pattern 'Production:\s+(https://\S+)').Matches.Groups[1].Value
if (-not $deployUrl) {
    Write-Host "⚠️ Не удалось извлечь URL из вывода. Проверяй последний деплой в Vercel вручную." -ForegroundColor Yellow
} else {
    Write-Host "✅ Новый деплой: $deployUrl" -ForegroundColor Green
}

Write-Host "`n=== ГОТОВО ===" -ForegroundColor Cyan
Write-Host "Виджет теперь использует универсальный парсер JSON (массив или объект.campaigns)."
Write-Host "Обнови страницу Тильды с новым параметром v=parse3"
