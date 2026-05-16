@echo off
echo Starting AttendPro...

:: 1. Start MySQL
start "" "C:\Users\Athik Ahamed\tools\mysql\mysql-8.0.36-winx64\bin\mysqld.exe" --defaults-file="C:\Users\Athik Ahamed\tools\mysql\mysql-8.0.36-winx64\my.ini"
timeout /t 5 /nobreak >nul

:: 2. Start Backend
start "Backend" "C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot\bin\java.exe" -jar "e:\oxygen lab\college-attendance-management\backend\target\attendance-1.0.0.jar"
timeout /t 12 /nobreak >nul

:: 3. Start Frontend
start "Frontend" "C:\Users\Athik Ahamed\tools\node-v24.15.0-win-x64\node.exe" "e:\oxygen lab\college-attendance-management\frontend\server.js"
timeout /t 2 /nobreak >nul

:: 4. Open browser
start "" http://localhost:3000

echo Done! App is running at http://localhost:3000
