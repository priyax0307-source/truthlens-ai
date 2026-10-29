# TruthLens AI - Launch All Services (Client, Server, FastAPI AI Engine)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       TruthLens AI Platform - Launching Services        " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Python FastAPI AI microservice (Port 8000)
Write-Host "[1/3] Starting Python FastAPI AI Service on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ai-service'; python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

# 2. Start Express Backend API (Port 5000)
Write-Host "[2/3] Starting Node.js Express Server on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"

# 3. Start Vite React Frontend (Port 5173)
Write-Host "[3/3] Starting React Vite Frontend on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"

Write-Host ""
Write-Host "All 3 services launched in separate windows!" -ForegroundColor Green
Write-Host "Frontend:   http://localhost:5173" -ForegroundColor White
Write-Host "Backend:    http://localhost:5000" -ForegroundColor White
Write-Host "AI Service: http://localhost:8000" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
