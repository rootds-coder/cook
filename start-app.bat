@echo off
echo Starting Root Coder Foundation Application...
echo.

:: Start Backend
start cmd /k "cd backend && npm install && npm run dev"

:: Start Frontend
start cmd /k "cd frontend && npm install && npm start"

:: Wait for a moment to ensure both servers are starting
timeout /t 5 /nobreak

:: Show success message
echo.
echo Application started successfully!
echo.
echo BIG DADDY ALWAYS WIN
echo.

:: Create and show a proper Windows popup
echo Set oShell = CreateObject("WScript.Shell") > "%temp%\popup.vbs"
echo oShell.Popup "BIG DADDY ALWAYS WIN", 0, "Success!", 64 >> "%temp%\popup.vbs"
start /wait wscript.exe "%temp%\popup.vbs"

:: Keep the window open
pause 