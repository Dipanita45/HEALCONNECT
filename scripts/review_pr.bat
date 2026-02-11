@echo off
set /p pr_id="Enter PR Number to Review: "

echo Fetching PR #%pr_id%...
git fetch origin pull/%pr_id%/head:pr-%pr_id%

echo Checking out branch pr-%pr_id%...
git checkout pr-%pr_id%

echo.
echo ---------------------------------------------------
echo  PR #%pr_id% is now active on branch 'pr-%pr_id%'
echo  Run 'npm install' if new dependencies were added.
echo  Run 'npm run dev' to start the server.
echo ---------------------------------------------------
pause
