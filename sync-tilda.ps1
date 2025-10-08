# === AdsRays: Автоматическая синхронизация Тильды с Vercel ===
$ErrorActionPreference = "Stop"

# === НАСТРОЙКИ ===
$tildaUrl = "https://ponomarchuk.com.ua/page82875186.html"   # ← Укажи свой URL страницы на Тильде
$repoPath = "C:\Users\Alex\Desktop\adsrays-demo"
$siteDir = Join-Path $repoPath "apps\site"
$tildaFile = Join-Path $siteDir "public\tilda.html"
$branch = "fix/vercel-pages-api"
$vercelAlias = "site-rosy-gamma.vercel.app"

Write-Host "`n=== СИНХРОНИЗАЦИЯ ТИЛЬДЫ ===" -ForegroundColor Cyan
cd $repoPath

# 1) Скачиваем HTML с Тильды
Write-Host "→ Загружаю страницу с Тильды..."
try {
    $html = Invoke-WebRequest -Uri $tildaUrl -UseBasicParsing | Select-Object -ExpandProperty Content
    if (-not $html) { throw "Пустой HTML. Проверь ссылку." }
    $html | Out-File -FilePath $tildaFile -Encoding UTF8
}
catch {
    Write-Host "Ошибка: не удалось скачать страницу с Тильды." -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

# 2) Исправляем пути на CDN
Write-Host "→ Исправляю пути к CDN..."
(Get-Content $tildaFile -Raw) `
-replace 'href="/tilda', 'href="https://static.tildacdn.com/tilda' `
-replace "src=\"/tilda", "src=\"https://static.tildacdn.com/tilda" `
-replace "src='/tilda", "src='https://static.tildacdn.com/tilda" `
| Set-Content $tildaFile -Encoding UTF8

# 3) Коммит
Write-Host "→ Фиксирую изменения..."
git add $tildaFile
git commit -m "sync(site): auto-update from Tilda $((Get-Date).ToString('yyyy-MM-dd HH:mm'))" | Out-Null

# 4) Пуш
Write-Host "→ Отправляю в GitHub..."
git push --set-upstream origin $branch

# 5) Деплой
Write-Host "→ Запускаю деплой в Vercel..."
npx vercel --prod

# 6) Привязка основного алиаса
Write-Host "→ Обновляю прод-алиас..."
npx vercel alias set (npx vercel ls adsrays/site --json | ConvertFrom-Json | Select-Object -ExpandProperty deployments | Sort-Object createdAt -Descending | Select-Object -First 1 | Select-Object -ExpandProperty url) $vercelAlias

# 7) Логирование
$log = Join-Path $repoPath "tilda_sync.log"
"[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Синхронизация завершена успешно." | Add-Content $log

Write-Host "`n=== ГОТОВО ===" -ForegroundColor Green
Write-Host "Tilda → Vercel синхронизирована. Проверяй $vercelAlias"
