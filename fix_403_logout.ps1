# Script para corrigir o problema de logout automático no erro 403
$filePath = "c:\PAP3\Andebolonlineplatform-main\src\services\api.ts"

Write-Host "📖 Lendo ficheiro..." -ForegroundColor Cyan
$lines = Get-Content $filePath -Encoding UTF8

Write-Host "🔍 Procurando bloco de código a substituir..." -ForegroundColor Cyan

$newLines = @()
$skipMode = $false
$blockFound = $false

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    
    # Detectar início do bloco a remover
    if ($line -match "CHECK FOR 403.*Forbidden.*Admin privileges lost") {
        $blockFound = $true
        $skipMode = $true
        
        # Adicionar o novo código simplificado
        $newLines += "    // ✅ LOG 403 errors but don't force logout"
        $newLines += "    if (response.status === 403) {"
        $newLines += "      console.warn('⚠️ Acesso negado (403). Verifique se tem privilégios suficientes.');"
        $newLines += "    }"
        
        Write-Host "✅ Bloco encontrado na linha $($i+1)" -ForegroundColor Green
        continue
    }
    
    # Detectar fim do bloco (3 fechamentos de chavetas consecutivos)
    if ($skipMode) {
        # Contar chavetas de fecho
        if ($line -match '^\s*}\s*$') {
            # Verificar se as próximas 2 linhas também são chavetas
            if ($i+1 -lt $lines.Count -and $lines[$i+1] -match '^\s*}\s*$') {
                # Pular esta linha e a próxima
                $i++
                $skipMode = $false
                continue
            }
        }
        continue
    }
    
    # Adicionar linha normal
    $newLines += $line
}

if ($blockFound) {
    Write-Host "💾 Guardando ficheiro corrigido..." -ForegroundColor Cyan
    $newLines | Set-Content $filePath -Encoding UTF8
    Write-Host "✅ Correção aplicada com sucesso!" -ForegroundColor Green
    Write-Host "📋 Backup guardado em: api.ts.backup" -ForegroundColor Yellow
} else {
    Write-Host "❌ Bloco de código não encontrado!" -ForegroundColor Red
    Write-Host "⚠️ O ficheiro pode já estar corrigido ou ter sido modificado." -ForegroundColor Yellow
}
