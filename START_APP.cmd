@echo off
setlocal
cd /d "%~dp0"
where python >nul 2>nul
if not errorlevel 1 (
    python app.py --open
) else (
    py -3 app.py --open
)
if errorlevel 1 pause
