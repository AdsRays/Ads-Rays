# AdsRays Demo - Health Check Script
Write-Host "🔍 AdsRays Demo Health Check" -ForegroundColor Cyan

# Check Node.js version
Write-Host "`n📦 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($nodeVersion -match "v(\d+)\.") {
    $majorVersion = [int]$matches[1]
    if ($majorVersion -ge 20) {
        Write-Host "✅ Node.js $nodeVersion (OK)" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js $nodeVersion (Requires 20+)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    exit 1
}

# Check PNPM version
Write-Host "`n📦 Checking PNPM version..." -ForegroundColor Yellow
$pnpmVersion = pnpm --version
Write-Host "✅ PNPM $pnpmVersion" -ForegroundColor Green

# Check if ports are available
Write-Host "`n🔌 Checking ports..." -ForegroundColor Yellow

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

if (Test-Port 5173) {
    Write-Host "⚠️  Port 5173 is occupied (Frontend)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 5173 is available (Frontend)" -ForegroundColor Green
}

if (Test-Port 4000) {
    Write-Host "⚠️  Port 4000 is occupied (Backend)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 4000 is available (Backend)" -ForegroundColor Green
}

# Check dependencies
Write-Host "`n📋 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ Root dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Dependencies not installed. Run: pnpm install" -ForegroundColor Red
}

if (Test-Path "apps/frontend/node_modules") {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend dependencies not installed" -ForegroundColor Red
}

if (Test-Path "apps/backend/node_modules") {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Backend dependencies not installed" -ForegroundColor Red
}

# Check build status
Write-Host "`n🔨 Checking build status..." -ForegroundColor Yellow
if (Test-Path "apps/frontend/dist") {
    Write-Host "✅ Frontend built" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend not built (run: pnpm --filter @adsrays/frontend build)" -ForegroundColor Yellow
}

if (Test-Path "apps/backend/dist") {
    Write-Host "✅ Backend built" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend not built (run: pnpm --filter @adsrays/backend build)" -ForegroundColor Yellow
}

# Check logs
Write-Host "`n📊 Recent logs:" -ForegroundColor Yellow
if (Test-Path "vite.log") {
    Write-Host "Vite logs (last 5 lines):" -ForegroundColor Cyan
    Get-Content "vite.log" -Tail 5 | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "No Vite logs found" -ForegroundColor Gray
}

if (Test-Path "express.log") {
    Write-Host "Express logs (last 5 lines):" -ForegroundColor Cyan
    Get-Content "express.log" -Tail 5 | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "No Express logs found" -ForegroundColor Gray
}

Write-Host "`n🎯 Health check completed!" -ForegroundColor Cyan
Write-Host "Run 'scripts/dev.ps1' to start development servers" -ForegroundColor Green

