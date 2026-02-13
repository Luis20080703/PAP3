
# Cloudflare Tunnel Auto-Start Script
$frontDir = "C:\PAP3\Andebolonlineplatform-main"
$apiDir = "C:\PAP3\Api"
$cloudflareExe = "$frontDir\cloudflared.exe"

Write-Host "`n*** Iniciando Cloudflare Tunnels ***" -ForegroundColor Cyan

# 1. Kill old processes
Stop-Process -Name "cloudflared" -ErrorAction SilentlyContinue 
Start-Sleep -Seconds 2

# 2. Start Site (3000)
$siteLog = "$frontDir\cf_site.log"
if (Test-Path $siteLog) { Remove-Item $siteLog }
Start-Process -FilePath $cloudflareExe -ArgumentList "tunnel --url http://localhost:3000" -RedirectStandardError $siteLog -WindowStyle Hidden

# 3. Start API (8000)
$apiLog = "$frontDir\cf_api.log"
if (Test-Path $apiLog) { Remove-Item $apiLog }
Start-Process -FilePath $cloudflareExe -ArgumentList "tunnel --url http://localhost:8000" -RedirectStandardError $apiLog -WindowStyle Hidden

# 4. Wait for URLs
Write-Host "Aguardando URLs da Cloudflare..." -ForegroundColor Yellow
$siteUrl = ""
$apiUrl = ""

for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    if (Test-Path $siteLog) {
        $content = Get-Content $siteLog
        foreach ($line in $content) {
            if ($line -match "https://[a-z0-9-]+\.trycloudflare\.com") {
                $siteUrl = $Matches[0]
                break
            }
        }
    }
    if (Test-Path $apiLog) {
        $content = Get-Content $apiLog
        foreach ($line in $content) {
            if ($line -match "https://[a-z0-9-]+\.trycloudflare\.com") {
                $apiUrl = $Matches[0]
                break
            }
        }
    }
    if ($siteUrl -and $apiUrl) { break }
}

if (-not $siteUrl -or -not $apiUrl) {
    Write-Host "Erro: Tempo limite atingido. Tente novamente." -ForegroundColor Red
    exit
}

# 5. Update .env files
Write-Host "Atualizando ficheiros .env..." -ForegroundColor Magenta
$apiEnv = "$apiDir\.env"
$frontEnv = "$frontDir\.env"

if (Test-Path $apiEnv) {
    $c = Get-Content $apiEnv
    $c = $c -replace "APP_URL=.*", "APP_URL=$apiUrl"
    $c = $c -replace "FRONTEND_URL=.*", "FRONTEND_URL=$siteUrl"
    $c | Set-Content $apiEnv
}
if (Test-Path $frontEnv) {
    $c = Get-Content $frontEnv
    $c = $c -replace "VITE_API_URL=.*", "VITE_API_URL=$apiUrl/api"
    $c | Set-Content $frontEnv
}

Write-Host "`n*** SUCESSO! ***" -ForegroundColor Green
Write-Host "SITE: $siteUrl"
Write-Host "API:  $apiUrl"
Write-Host "`nO link do Gmail ja esta atualizado no .env."
