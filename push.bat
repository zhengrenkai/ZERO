@echo off
for /f "delims=" %%i in ('powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'"') do set TIMESTAMP=%%i
git add -A
git commit -m "%TIMESTAMP%"
git push
echo Done.
pause
