# освобождаем 4000
$backendPids = Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique
if ($backendPids) { $backendPids | ForEach-Object { taskkill /F /PID $_ } }

# старт бэкенда
Start-Process -WindowStyle Minimized -FilePath "pnpm" -ArgumentList "--filter","@adsrays/backend","dev" -WorkingDirectory (Get-Location)

# старт фронта (5173 или 5174)
$env:VITE_API_BASE="http://localhost:4000"
$frontPort = 5173
if (Get-NetTCPConnection -State Listen -LocalPort 5173 -ErrorAction SilentlyContinue) { $frontPort = 5174 }
Start-Process -FilePath "pnpm" -ArgumentList "--filter","@adsrays/frontend","dev","--","--strictPort","--port",$frontPort,"--host","localhost" -WorkingDirectory (Get-Location)
Write-Host "Открой: http://localhost:$frontPort/"
