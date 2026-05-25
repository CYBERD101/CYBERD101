@echo off
echo [SYSTEM] STARTING CYBER-ASSIST AI...

start cmd /k "cd backend && python main.py"
start cmd /k "cd frontend && npm start"

echo [SYSTEM] APPLICATION LAUNCHED.
echo [INFO] API: http://localhost:8000
echo [INFO] UI: http://localhost:3000
