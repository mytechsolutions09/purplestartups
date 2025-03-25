@echo off
echo === Startup Guru Build Process ===
echo.

echo Step 1: Preparation
node scripts/prepare-build.cjs
if %ERRORLEVEL% NEQ 0 (
  echo Build preparation failed
  exit /b %ERRORLEVEL%
)

echo.
echo Step 2: Installing dependencies
call npm ci
if %ERRORLEVEL% NEQ 0 (
  echo Dependency installation failed
  exit /b %ERRORLEVEL%
)

echo.
echo Step 3: Building application
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Build failed
  exit /b %ERRORLEVEL%
)

echo.
echo Build completed successfully! 