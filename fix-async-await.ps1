# === AdsRays: async/await auto-fix + deploy ===
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
cd "C:\Users\Alex\Desktop\adsrays-demo"

$target = "apps\site\public\embed\adsr.js"
$backup = "$target.bak_asyncfix_$(Get-Date -Format yyyyMMdd_HHmmss)"
Copy-Item $target $backup -Force
Write-Host "Backup saved: $backup" -ForegroundColor Yellow

$content = Get-Content $target -Raw

# Обернём всё тело с await в async IIFE
if ($content -match "await fetch") {
    $wrapper = @"
(async () => {
  try {
    $($content.Trim())
  } catch (e) {
    console.error("Async fetch error:", e);
    const root = document.getElementById('adsr-root');
    if (root) root.innerHTML = '<div style="color:red;text-align:center">Ошибка загрузки данных</div>';
  }
})();
"@
    Set-Content -Path $target -Value $wrapper -Encoding UTF8
    Write-Host "✅ Wrapped await inside async IIFE" -ForegroundColor Green
} else {
    Write-Host "⚠ 'await fetch' not found in $target"
}

git add $target
git commit -m "fix(widget): wrap await fetch in async IIFE for browser compatibility"
git push origin main

Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Cyan
$deployOutput = vercel --prod
$deployUrl = ($deployOutput | Select-String -Pattern "Production:\s+(https://\S+)").Matches.Groups[1].Value
Write-Host "`n✅ Production URL: $deployUrl" -ForegroundColor Green

Write-Host "`nOpen in browser: https://ponomarchuk.com.ua/page82875186.html" -ForegroundColor Yellow
Write-Host "Then check Console: no SyntaxError, no CORS; tiles visible." -ForegroundColor Yellow
