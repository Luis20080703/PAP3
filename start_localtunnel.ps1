
# Script para Automatizar Localtunnel e Atualizar .env
$frontDir = "C:\PAP3\Andebolonlineplatform-main"
$apiDir = "C:\PAP3\Api"

# Configura aqui os nomes que queres para o teu link (se estiverem livres, serão estes)
$subdomainSite = "nexushand-luis-site"
$subdomainApi = "nexushand-luis-api"

Write-Host "Iniciando Localtunnel..." -ForegroundColor Cyan

# 1. Matar processos antigos para evitar conflitos
Stop-Process -Name "node" -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# 2. Obter o teu IP Público (O Localtunnel pede isto na primeira vez que abres o link)
$publicIp = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
Write-Host "`n---------------------------------------------------" -ForegroundColor Yellow
Write-Host "IMPORTANTE: Se o site pedir um 'Password/Endpoint IP',"
Write-Host "usa este IP: $publicIp" -ForegroundColor Red
Write-Host "---------------------------------------------------`n" -ForegroundColor Yellow

# 3. Iniciar Túnel da API (Porta 8000)
Write-Host "A abrir túnel para API (8000)..."
$apiLog = "$frontDir\lt_api.log"
if (Test-Path $apiLog) { Remove-Item $apiLog }
$apiProc = Start-Process -FilePath "npx.cmd" -ArgumentList "localtunnel --port 8000 --subdomain $subdomainApi" -RedirectStandardOutput $apiLog -RedirectStandardError "$apiLog.err" -WindowStyle Hidden -PassThru

# 4. Iniciar Túnel do Site (Porta 3000)
Write-Host "A abrir túnel para Site (3000)..."
$siteLog = "$frontDir\lt_site.log"
if (Test-Path $siteLog) { Remove-Item $siteLog }
$siteProc = Start-Process -FilePath "npx.cmd" -ArgumentList "localtunnel --port 3000 --subdomain $subdomainSite" -RedirectStandardOutput $siteLog -RedirectStandardError "$siteLog.err" -WindowStyle Hidden -PassThru

# 5. Aguardar pelos URLs
Write-Host "A aguardar geração de URLs..." -ForegroundColor Yellow
$apiUrl = ""
$siteUrl = ""

for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    if (Test-Path $apiLog) {
        $apiContent = Get-Content $apiLog
        if ($apiContent -match "https://.*\.loca\.lt") {
            $apiUrl = $apiContent
        }
    }
    if (Test-Path $siteLog) {
        $siteContent = Get-Content $siteLog
        if ($siteContent -match "https://.*\.loca\.lt") {
            $siteUrl = $siteContent
        }
    }
    if ($apiUrl -and $siteUrl) { break }
}

if (-not $apiUrl -or -not $siteUrl) {
    Write-Host "Erro: Não foi possível obter os URLs. Tenta correr o comando: npx localtunnel --port 3000" -ForegroundColor Red
    exit
}

Write-Host "`n✅ Links Gerados:" -ForegroundColor Green
Write-Host "API:  $apiUrl"
Write-Host "SITE: $siteUrl"

# 6. Atualizar .env do Backend
Write-Host "`nAtualizando Backend .env..."
$apiEnvPath = "$apiDir\.env"
if (Test-Path $apiEnvPath) {
    $envContent = Get-Content $apiEnvPath
    $envContent = $envContent -replace "APP_URL=.*", "APP_URL=$apiUrl"
    $envContent = $envContent -replace "FRONTEND_URL=.*", "FRONTEND_URL=$siteUrl"
    $envContent | Set-Content $apiEnvPath
}

# 7. Atualizar .env do Frontend
Write-Host "Atualizando Frontend .env..."
$frontEnvPath = "$frontDir\.env"
if (Test-Path $frontEnvPath) {
    $envContent = Get-Content $frontEnvPath
    $envContent = $envContent -replace "VITE_API_URL=.*", "VITE_API_URL=$apiUrl/api"
    $envContent | Set-Content $frontEnvPath
}

Write-Host "`n✨ Tudo pronto! O link do site é fixo se o nome estiver disponível." -ForegroundColor Cyan
