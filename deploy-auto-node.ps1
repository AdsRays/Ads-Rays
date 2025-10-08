$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
cd "C:\Users\Alex\Desktop\adsrays-demo"

Write-Host "=== 1. Обновление main из GitHub ===" -ForegroundColor Cyan
git checkout main | Out-Null
git pull origin main | Out-Null

Write-Host "=== 2. Подготовка статической сборки ===" -ForegroundColor Cyan
$staticPath = "C:\Users\Alex\Desktop\adsrays-demo\_static_build"
Remove-Item $staticPath -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item "apps\site\public" $staticPath -Recurse -Force
Write-Host "✅ Папка скопирована: $staticPath"

Write-Host "=== 3. Запуск деплоя через Node ===" -ForegroundColor Cyan
$vercelJs = "$env:APPDATA\npm\node_modules\vercel\dist\vc.js"
if (-not (Test-Path $vercelJs)) {
  Write-Host "❌ Не найден $vercelJs. Установи: npm i -g vercel" -ForegroundColor Red
  exit
}

$token = "2TWMd0TIPr7TfWgHR2jshpJ0"
$projectName = "adsrays-static"
$deployArgs = @($vercelJs, "deploy", $staticPath, "--yes", "--prod", "--name=$projectName", "--token=$token")

Write-Host "🚀 Запускаю деплой через node.exe..." -ForegroundColor Yellow
$deployOutput = & node.exe $deployArgs 2>&1
$deployOutput | Out-File -FilePath "deploy_log.txt" -Encoding UTF8

$deployUrl = ($deployOutput | Select-String -Pattern "https://\S+\.vercel\.app" -AllMatches).Matches.Value | Select-Object -Last 1
if (-not $deployUrl) { Write-Host "❌ URL билда не найден. См. deploy_log.txt" -ForegroundColor Red; exit }
Write-Host "✅ Новый билд опубликован: $deployUrl" -ForegroundColor Green

try {
  $resp = Invoke-WebRequest "$deployUrl/embed/adsr.js?v=final" -UseBasicParsing -TimeoutSec 20
  if ($resp.StatusCode -eq 200) { Write-Host "✅ JS успешно загружается (200 OK)" } else { Write-Host "⚠ Код ответа: $($resp.StatusCode)" }
} catch { Write-Host "⚠ Ошибка проверки: $($_.Exception.Message)" }

$tildaEmbed = "<script src='$deployUrl/embed/adsr.js?v=final' data-root='adsr-root' data-api='https://site-jm67k1fl1-adsrays.vercel.app/api/proxy/campaigns?demo=1'></script>"
Set-Content -Path "tilda/embed.js" -Value $tildaEmbed -Encoding UTF8
Write-Host "`n🌍 Production: $deployUrl" -ForegroundColor Green
Write-Host "👉 Вставь этот код в Тильду:" -ForegroundColor Yellow
Write-Host $tildaEmbed -ForegroundColor Green
