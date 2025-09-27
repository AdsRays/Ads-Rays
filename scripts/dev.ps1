# AdsRays Demo - Development Script
Write-Host "🚀 Starting AdsRays Demo Development" -ForegroundColor Cyan

# Set environment variable
$env:VITE_API_BASE = "http://localhost:4000"

# Check if port 5173 is available, if not use 5174
Write-Host "`n🔌 Checking frontend port..." -ForegroundColor Yellow

function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("127.0.0.1", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

$frontendPort = 5173
if (Test-Port 5173) {
    Write-Host "⚠️  Port 5173 is occupied, using 5174" -ForegroundColor Yellow
    $frontendPort = 5174
    $env:VITE_PORT = "5174"
} else {
    Write-Host "✅ Using port 5173" -ForegroundColor Green
}

# Start backend in background
Write-Host "`n🔧 Starting backend server..." -ForegroundColor Yellow
Start-Process -FilePath "pnpm" -ArgumentList "--filter", "@adsrays/backend", "dev" -WindowStyle Minimized -RedirectStandardOutput "express.log" -RedirectStandardError "express-error.log"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "`n🎨 Starting frontend server..." -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://127.0.0.1:$frontendPort" -ForegroundColor Green
Write-Host "Backend API available at: http://localhost:4000" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop all servers" -ForegroundColor Yellow

# Start frontend in foreground
pnpm --filter @adsrays/frontend dev

