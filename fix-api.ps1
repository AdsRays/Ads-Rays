# === AdsRays: автоматическая проверка API и фиксация embed/adsr.js ===
$ErrorActionPreference = "Stop"
$repo = "C:\Users\Alex\Desktop\adsrays-demo"
$target = Join-Path $repo "apps\site\public\embed\adsr.js"

cd $repo
Write-Host ">>> Проверяю актуальный прод-деплой..." -ForegroundColor Cyan

# Получаем список последних деплоев из Vercel
$vercelJson = npx vercel ls adsrays/site --json | ConvertFrom-Json
$latest = $vercelJson.deployments | Sort-Object createdAt -Descending | Select-Object -First 1
$latestUrl = "https://" + $latest.url
Write-Host "Последний билд: $latestUrl"

# Проверяем API по адресу билда
$apiUrl = "$latestUrl/api/proxy/campaigns?demo=1"
Write-Host ">>> Проверяю API: $apiUrl"
try {
    $response = Invoke-WebRequest -Uri $apiUrl -UseBasicParsing -TimeoutSec 10
    $ok = $response.StatusCode -eq 200 -and $response.Content -match '"name"'
} catch {
    $ok = $false
}

if (-not $ok) {
    Write-Host "❌ API на последнем билде не отвечает. Использую резервный стабильный билд..." -ForegroundColor Yellow
    $latestUrl = "https://site-jm67k1fl1-adsrays.vercel.app"  # ← стабильный билд
    $apiUrl = "$latestUrl/api/proxy/campaigns?demo=1"
} else {
    Write-Host "✅ API отвечает корректно." -ForegroundColor Green
}

# Исправляем ссылку на API в embed/adsr.js
Write-Host ">>> Обновляю embed/adsr.js..."
$content = Get-Content $target -Raw
$content = $content -replace 'data-api="https://[^"]*"', "data-api=\"$apiUrl\""
Set-Content -Path $target -Value $content -Encoding UTF8

# Коммит и деплой
Write-Host ">>> Коммит и деплой..." -ForegroundColor Yellow
git add $target
git commit -m "fix(widget): auto-correct API endpoint to $apiUrl"
git push --set-upstream origin fix/vercel-pages-api
npx vercel --prod

Write-Host "`n=== ГОТОВО ==="
Write-Host "Виджет теперь использует API: $apiUrl"
