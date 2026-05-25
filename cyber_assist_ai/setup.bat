@echo off
echo [SYSTEM] INITIALIZING CYBER-ASSIST AI SETUP...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.10+ from python.org
    pause
    exit /b
)

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js from nodejs.org
    pause
    exit /b
)

echo [SYSTEM] INSTALLING BACKEND DEPENDENCIES...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies.
    pause
    exit /b
)

echo [SYSTEM] INSTALLING FRONTEND DEPENDENCIES...
cd ../frontend
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies.
    pause
    exit /b
)

echo [SUCCESS] SETUP COMPLETE.
echo [INFO] RUN 'start_app.bat' TO LAUNCH THE AI.
pause
