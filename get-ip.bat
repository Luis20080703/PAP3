@echo off
echo.
echo ========================================
echo    NEXUSHAND - IP DO SERVIDOR
echo ========================================
echo.
echo Procurando IP da rede Wi-Fi...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    echo IP encontrado: %%a
)

echo.
echo ========================================
echo.
echo 1. No telemovel, aceda a: http://[IP]:3000
echo 2. Clique no botao de configuracao (engrenagem)
echo 3. Insira o IP mostrado acima
echo 4. Clique em "Testar Conexao" e depois "Guardar"
echo.
echo ========================================
echo.
pause