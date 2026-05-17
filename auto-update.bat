@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
cd /d C:\seramik-site

echo.
echo =========================================
echo 1) KLASORLER HAZIRLANIYOR
echo =========================================

if not exist public mkdir public
if not exist public\galeri mkdir public\galeri
if not exist public\media mkdir public\media

echo.
echo =========================================
echo 2) GITIGNORE GUNCELLENIYOR
echo =========================================

(
echo node_modules/
echo .next/
echo out/
echo .vercel/
echo .env
echo .env.local
echo *.log
echo codex_prompt.txt
echo codex_fix_prompt.txt
echo TEST_CODEX_CALISTI.txt
) > .gitignore

echo.
echo =========================================
echo 3) PUBLIC\GALERI KAYNAK OLARAK KORUNUYOR
echo =========================================

echo GALERI_KAYNAK_PUBLIC=TRUE

echo.
echo =========================================
echo 4) VIDEO DOSYASI ARANIYOR
echo =========================================

set "VIDEO_SRC="

for %%P in (
"C:\seramik-site\video"
"C:\seramik-site\public\video"
"C:\Users\hayri\Videos"
"C:\Users\hayri\OneDrive\Videos"
) do (
    if exist %%~P (
        for %%E in (mp4 mov webm m4v) do (
            for /f "delims=" %%F in ('dir /b /s /a:-d "%%~P\*.%%E" 2^>nul') do (
                if not defined VIDEO_SRC set "VIDEO_SRC=%%F"
            )
        )
    )
)

if defined VIDEO_SRC (
    copy /Y "!VIDEO_SRC!" "C:\seramik-site\public\media\atolye-video.mp4" >nul
    echo VIDEO_KOPYALANDI=TRUE
    echo Kaynak video: !VIDEO_SRC!
) else (
    echo VIDEO_BULUNAMADI=TRUE
    echo Video dosyasini manuel olarak su yola koy:
    echo C:\seramik-site\public\media\atolye-video.mp4
)

echo.
echo =========================================
echo 5) CODEX SANDBOX KAPALI SEKILDE CALISIYOR
echo =========================================

codex exec --cd C:\seramik-site --dangerously-bypass-approvals-and-sandbox - < AUTO_PROMPT.txt

if errorlevel 1 (
    echo CODEX_HATA=TRUE
    pause
    exit /b 1
)

echo.
echo =========================================
echo 6) BUILD KONTROLU
echo =========================================

npm run build

if errorlevel 1 (
    echo BUILD_BASARISIZ=TRUE
    pause
    exit /b 1
)

echo.
echo =========================================
echo 7) BUYUK KLASORLER GIT INDEXTEN TEMIZLENIYOR
echo =========================================

git rm -r --cached node_modules >nul 2>nul
git rm -r --cached .next >nul 2>nul
git rm -r --cached out >nul 2>nul
git rm -r --cached .vercel >nul 2>nul
git rm --cached TEST_CODEX_CALISTI.txt >nul 2>nul

echo.
echo =========================================
echo 8) GITHUB GUNCELLEMESI
echo =========================================

git add .

git diff --cached --quiet
if errorlevel 1 (
    git commit -m "site guncellemesi"
) else (
    echo COMMIT_EDILECEK_DEGISIKLIK_YOK=TRUE
)

git push

if errorlevel 1 (
    echo GIT_PUSH_BASARISIZ=TRUE
    pause
    exit /b 1
)

echo.
echo GUNCELLEME_TAMAMLANDI=TRUE
echo CANLI_SITE_LINKI=https://gezici-comlek-atolyesi.vercel.app
echo Vercel deploy icin 1-2 dakika bekle, sonra Ctrl+F5 ile yenile.
echo.
pause
