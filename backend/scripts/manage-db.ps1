# Script para gerenciar o banco de dados H2 da Confeitaria
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("backup", "restore", "reset", "info")]
    [string]$Action = "info"
)

$DataDir = ".\data"
$DbFile = "$DataDir\confeitaria_db.mv.db"

function Show-Info {
    Write-Host "=== GERENCIADOR DE BANCO - CONFEITARIA ===" -ForegroundColor Cyan
    Write-Host "Diretório do banco: $DataDir" -ForegroundColor Yellow
    Write-Host "Arquivo do banco: $DbFile" -ForegroundColor Yellow
    
    if (Test-Path $DbFile) {
        $fileInfo = Get-Item $DbFile
        Write-Host "✅ Banco existe" -ForegroundColor Green
        Write-Host "Tamanho: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor Green
        Write-Host "Última modificação: $($fileInfo.LastWriteTime)" -ForegroundColor Green
    } else {
        Write-Host "❌ Banco não existe" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Comandos disponíveis:" -ForegroundColor Cyan
    Write-Host "  .\scripts\manage-db.ps1 info     - Mostra informações do banco" -ForegroundColor White
    Write-Host "  .\scripts\manage-db.ps1 backup   - Faz backup do banco" -ForegroundColor White
    Write-Host "  .\scripts\manage-db.ps1 reset    - Reseta o banco (CUIDADO!)" -ForegroundColor Red
    Write-Host "  .\scripts\manage-db.ps1 restore  - Restaura backup (se existir)" -ForegroundColor White
}

function Backup-Database {
    if (Test-Path $DbFile) {
        $backupFile = "$DataDir\confeitaria_db_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').mv.db"
        Copy-Item $DbFile $backupFile
        Write-Host "✅ Backup criado: $backupFile" -ForegroundColor Green
    } else {
        Write-Host "❌ Banco não existe para backup" -ForegroundColor Red
    }
}

function Reset-Database {
    Write-Host "⚠️  ATENÇÃO: Isso irá APAGAR todos os dados!" -ForegroundColor Red
    $confirmation = Read-Host "Digite 'SIM' para confirmar"
    
    if ($confirmation -eq "SIM") {
        if (Test-Path $DataDir) {
            Remove-Item "$DataDir\*" -Recurse -Force
            Write-Host "✅ Banco resetado com sucesso!" -ForegroundColor Green
            Write-Host "ℹ️  Reinicie o backend para recriar o usuário admin" -ForegroundColor Yellow
        } else {
            Write-Host "ℹ️  Banco não existe, nada a resetar" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
    }
}

function Restore-Database {
    $backupFiles = Get-ChildItem "$DataDir\confeitaria_db_backup_*.mv.db" | Sort-Object LastWriteTime -Descending
    
    if ($backupFiles.Count -eq 0) {
        Write-Host "❌ Nenhum backup encontrado" -ForegroundColor Red
        return
    }
    
    Write-Host "Backups disponíveis:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $backupFiles.Count; $i++) {
        Write-Host "  $($i + 1). $($backupFiles[$i].Name) - $($backupFiles[$i].LastWriteTime)" -ForegroundColor White
    }
    
    $choice = Read-Host "Escolha o número do backup (1-$($backupFiles.Count))"
    $index = [int]$choice - 1
    
    if ($index -ge 0 -and $index -lt $backupFiles.Count) {
        $selectedBackup = $backupFiles[$index]
        
        if (Test-Path $DbFile) {
            Copy-Item $DbFile "$DataDir\confeitaria_db_old_$(Get-Date -Format 'yyyyMMdd_HHmmss').mv.db"
        }
        
        Copy-Item $selectedBackup.FullName $DbFile
        Write-Host "✅ Banco restaurado do backup: $($selectedBackup.Name)" -ForegroundColor Green
    } else {
        Write-Host "❌ Escolha inválida" -ForegroundColor Red
    }
}

# Executar ação
switch ($Action) {
    "info" { Show-Info }
    "backup" { Backup-Database }
    "reset" { Reset-Database }
    "restore" { Restore-Database }
    default { Show-Info }
} 