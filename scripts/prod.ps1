# AdsRays Demo - Production Script
Write-Host "🏭 Building and starting AdsRays Demo for Production" -ForegroundColor Cyan

# Build frontend
Write-Host "`n🔨 Building frontend..." -ForegroundColor Yellow
pnpm --filter @adsrays/frontend build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend built successfully" -ForegroundColor Green

# Build backend
Write-Host "`n🔨 Building backend..." -ForegroundColor Yellow
pnpm --filter @adsrays/backend build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend built successfully" -ForegroundColor Green

# Start production server
Write-Host "`n🚀 Starting production server..." -ForegroundColor Yellow
Write-Host "Server will serve frontend from: apps/frontend/dist" -ForegroundColor Green
Write-Host "API available at: http://localhost:4000/api" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop server" -ForegroundColor Yellow

# Start backend with static file serving
pnpm --filter @adsrays/backend start

