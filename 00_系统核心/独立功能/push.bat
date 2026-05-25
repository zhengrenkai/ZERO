@echo off
chcp 65001 >nul

setlocal EnableDelayedExpansion

set "GIT_CMD="
set "CACHE_FILE=.git-path-cache.txt"

REM 1. 先读缓存
if exist "%CACHE_FILE%" (
    set /p GIT_CMD=<"%CACHE_FILE%"
    if exist "!GIT_CMD!" (
        goto :found
    ) else (
        echo [缓存失效] 重新查找 Git...
        set "GIT_CMD="
    )
)

REM 2. 尝试直接用 git（PATH 已配置的情况）
where git >nul 2>&1
if !errorlevel! == 0 (
    set "GIT_CMD=git"
    goto :found
)

REM 3. 常见安装路径查找
set "PATHS[0]=C:\Program Files\Git\bin\git.exe"
set "PATHS[1]=C:\Program Files (x86)\Git\bin\git.exe"
set "PATHS[2]=C:\Git\bin\git.exe"
set "PATHS[3]=D:\Git\bin\git.exe"
set "PATHS[4]=%LOCALAPPDATA%\Programs\Git\bin\git.exe"
set "PATHS[5]=%USERPROFILE%\scoop\apps\git\current\bin\git.exe"

for /L %%i in (0,1,5) do (
    if exist "!PATHS[%%i]!" (
        set "GIT_CMD=!PATHS[%%i]!"
        goto :found
    )
)

REM 4. 从注册表查找
for /f "delims=" %%a in ('reg query "HKLM\SOFTWARE\GitForWindows" /v InstallPath 2^>nul ^| findstr "InstallPath"') do (
    for /f "tokens=3*" %%b in ("%%a") do (
        if exist "%%b\bin\git.exe" (
            set "GIT_CMD=%%b\bin\git.exe"
            goto :found
        )
    )
)

echo [错误] 未找到 git.exe，请确保 Git 已安装或手动设置 PATH。
echo.
echo 常见解决方式：
echo   1. 安装 Git for Windows：https://git-scm.com/download/win
echo   2. 或将 git.exe 所在目录加入系统 PATH
echo   3. 或修改本脚本中的 PATHS 数组添加你的 Git 路径
echo.
pause
exit /b 1

:found
REM 写入缓存（只有是完整路径时才缓存，git 命令不缓存）
if not "!GIT_CMD!"=="git" (
    echo !GIT_CMD! > "%CACHE_FILE%"
)

echo [Git] 使用: !GIT_CMD!

for /f "delims=" %%i in ('powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'"') do set TIMESTAMP=%%i

"!GIT_CMD!" add -A
if !errorlevel! neq 0 (
    echo [错误] git add 失败
    pause
    exit /b 1
)

"!GIT_CMD!" commit -m "!TIMESTAMP!"
if !errorlevel! neq 0 (
    echo [提示] git commit 失败，可能没有变更需要提交
    pause
    exit /b 0
)

"!GIT_CMD!" push
if !errorlevel! neq 0 (
    echo [错误] git push 失败
    pause
    exit /b 1
)

echo Done.
pause
