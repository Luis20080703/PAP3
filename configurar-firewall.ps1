# Script para configurar a Firewall do Windows para permitir acesso móvel
# Execute como Administrador

Write-Host "🔥 Configurando Firewall do Windows para NexusHand..." -ForegroundColor Cyan
Write-Host ""

# Permitir porta 8000 (Laravel API)
Write-Host "📡 Adicionando regra para porta 8000 (Laravel API)..." -ForegroundColor Yellow
try {
    New-NetFirewallRule -DisplayName "NexusHand - Laravel API (8000)" `
                        -Direction Inbound `
                        -LocalPort 8000 `
                        -Protocol TCP `
                        -Action Allow `
                        -ErrorAction Stop
    Write-Host "✅ Porta 8000 permitida!" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "⚠️  Regra para porta 8000 já existe" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erro ao adicionar regra para porta 8000: $_" -ForegroundColor Red
    }
}

Write-Host ""

# Permitir porta 3000 (Vite Dev Server)
Write-Host "📡 Adicionando regra para porta 3000 (Vite)..." -ForegroundColor Yellow
try {
    New-NetFirewallRule -DisplayName "NexusHand - Vite Dev Server (3000)" `
                        -Direction Inbound `
                        -LocalPort 3000 `
                        -Protocol TCP `
                        -Action Allow `
                        -ErrorAction Stop
    Write-Host "✅ Porta 3000 permitida!" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "⚠️  Regra para porta 3000 já existe" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erro ao adicionar regra para porta 3000: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Agora pode aceder ao site no telemóvel usando:" -ForegroundColor Cyan

# Obter IP do PC
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Wireless*"} | Select-Object -First 1).IPAddress

if ($ip) {
    Write-Host "   http://$ip:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Configure o IP do servidor na app: $ip" -ForegroundColor Yellow
} else {
    Write-Host "   http://[SEU_IP]:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Não foi possível detetar o IP automaticamente." -ForegroundColor Yellow
    Write-Host "   Execute 'ipconfig' para ver o seu IP" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
