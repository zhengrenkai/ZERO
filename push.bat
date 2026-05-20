@echo off
git add -A
git commit -m "%date% %time%"
git push
echo Done.
pause
