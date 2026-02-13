
@echo off
set SITE_NAME=nexushand-luis-2026-site
set API_NAME=nexushand-luis-2026-api

echo ---------------------------------------------------
echo *** INICIANDO LINKS ESTATICOS (LOCALTUNNEL) ***
echo ---------------------------------------------------
echo.
echo 1. O link do teu SITE sera: https://%SITE_NAME%.loca.lt
echo 2. O link da tua API sera:  https://%API_NAME%.loca.lt
echo.
echo IMPORTANTE: Se o site pedir um IP, usa o teu IP atual.
echo.

:: Iniciar API em background
start /min npx -y localtunnel --port 8000 --subdomain %API_NAME%

:: Iniciar Site em background
start /min npx -y localtunnel --port 3000 --subdomain %SITE_NAME%

echo.
echo AGUARDA 5 SEGUNDOS...
timeout /t 5 > nul

echo.
echo *** ATUALIZANDO FICHEIROS .ENV ***
:: Aqui vou usar o PowerShell para editar os ficheiros de forma segura
powershell -Command "(Get-Content C:\PAP3\Api\.env) -replace 'APP_URL=.*', 'APP_URL=https://%API_NAME%.loca.lt' -replace 'FRONTEND_URL=.*', 'FRONTEND_URL=https://%SITE_NAME%.loca.lt' | Set-Content C:\PAP3\Api\.env"
powershell -Command "(Get-Content C:\PAP3\Andebolonlineplatform-main\.env) -replace 'VITE_API_URL=.*', 'VITE_API_URL=https://%API_NAME%.loca.lt/api' | Set-Content C:\PAP3\Andebolonlineplatform-main\.env"

echo.
echo ✅ TUDO PRONTO!
echo Podes enviar os emails. O link sera sempre este.
echo.
pause
