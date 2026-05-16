@echo off
cd /d C:\seramik-site

echo.
echo ================================
echo Site build kontrolu basliyor...
echo ================================
echo.

npm run build
if errorlevel 1 (
    powershell -NoProfile -Command "Write-Host '❌ Build hatasi var. GitHuba gonderilmedi.' -ForegroundColor Red"
    pause
    exit /b 1
)

echo.
set /p MSG=Commit mesaji yaz: 

if "%MSG%"=="" set MSG=site guncellemesi

git add .
git commit -m "%MSG%"
git push

if errorlevel 1 (
    powershell -NoProfile -Command "Write-Host '❌ GitHub push basarisiz oldu.' -ForegroundColor Red"
    pause
    exit /b 1
)

powershell -NoProfile -Command "Write-Host '✅ GitHub guncellendi. Vercel otomatik yayin alacak.' -ForegroundColor Green"
powershell -NoProfile -Command "Write-Host '✅ SON_CIKTI.md dosyasini ChatGPTye gonderebilirsin.' -ForegroundColor Green"

pause