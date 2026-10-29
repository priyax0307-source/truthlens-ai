@echo off
title TruthLens AI Launcher
echo ==========================================================
echo        TruthLens AI Platform - Launching Services        
echo ==========================================================

echo [1/3] Launching Python FastAPI AI Microservice (Port 8000)...
start "TruthLens AI Service" cmd /k "cd /d "%~dp0ai-service" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Launching Node.js Express REST API (Port 5000)...
start "TruthLens Express Server" cmd /k "cd /d "%~dp0server" && npm run dev"

echo [3/3] Launching React Vite Frontend (Port 5173)...
start "TruthLens React Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo All services launched!
echo Access the application in your browser at: http://localhost:5173
echo ==========================================================
pause
