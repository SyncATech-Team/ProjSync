@echo off

@REM Start WAMP server for MySQL
set /p start_wamp=Start WAMP server - Y/y:
if /i "%start_wamp%" == "Y" (
    echo Starting WAMP server...
    start cmd /c python ./python/wamp_start.py "C:\wamp64\wampmanager.exe"
) else if /i "%start_wamp%" == "y" (
    echo Starting WAMP server...
    start cmd /c python ./python/wamp_start.py "C:\wamp64\wampmanager.exe"
) else (
    echo Skipping WAMP start...
)

REM Prompt user to press ENTER after WAMP server has started
set /p user_input=Press ENTER after WAMP server has started:

@REM Start frontend & backend
start cmd /k python ./python/app_start.py "./front/angular" "ng serve --open"
start cmd /k python ./python/app_start.py "./back/backAPI/backAPI" "dotnet run"