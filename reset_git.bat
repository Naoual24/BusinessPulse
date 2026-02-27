@echo off
setlocal
echo [INFO] Resetting Git repository for "pie vampire"...

:: Move to the project root
cd /d "%~dp0"

:: Delete .git folder if it exists
if exist .git (
    echo [INFO] Removing existing .git folder...
    rmdir /s /q .git
)

:: Re-initialize
echo [INFO] Initializing new Git repository...
git init

:: Add remote
echo [INFO] Adding remote origin...
git remote add origin https://github.com/Naoual24/BusinessPulse.git

:: Add files and commit
echo [INFO] Adding all files...
git add .
echo [INFO] Committing changes...
git commit -m "Initial commit / Reset project"

:: Show current status
echo [INFO] Current Git Status:
git status

:: Push
echo [INFO] Pushing to GitHub (Force Push)...
echo [NOTE] If a login window appears, please log in.
git branch -M main
git push -u origin main -f

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] The push failed with code %ERRORLEVEL%.
    echo [TIP] This is usually due to authentication. 
    echo [TIP] Make sure you are logged into GitHub in this terminal or try:
    echo        git remote set-url origin https://[VOTRE_TOKEN]@github.com/Naoual24/BusinessPulse.git
) else (
    echo.
    echo [SUCCESS] Git repository has been reset and pushed to GitHub!
)

pause
endlocal
