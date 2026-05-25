@echo off
echo [SYSTEM] STARTING CYBER-ASSIST AI...

:: Open Backend in a new window
start "Cyber-Assist Backend" cmd /k "cd backend && python main.py"

:: Open Frontend in a new window
start "Cyber-Assist Frontend" cmd /k "cd frontend && npm start"

echo [SYSTEM] APPLICATION LAUNCHED.
echo [INFO] API: http://localhost:8000
echo [INFO] UI: http://localhost:3000
