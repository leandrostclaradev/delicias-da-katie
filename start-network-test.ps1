# Script para iniciar a aplicação para teste na rede local
Write-Host "=== Confeitaria FullStack - Teste de Rede ===" -ForegroundColor Green

# Obter IP local
$localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*" | Where-Object {$_.IPAddress -notlike "169.254.*" -and $_.IPAddress -notlike "127.*"} | Select-Object -First 1).IPAddress

if (-not $localIP) {
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Where-Object {$_.IPAddress -notlike "169.254.*" -and $_.IPAddress -notlike "127.*"} | Select-Object -First 1).IPAddress
}

if (-not $localIP) {
    Write-Host "Não foi possível detectar o IP local automaticamente." -ForegroundColor Yellow
    Write-Host "Configure manualmente no arquivo frontend/.env.local" -ForegroundColor Yellow
    $localIP = "192.168.1.100" # IP padrão
}

Write-Host "IP detectado: $localIP" -ForegroundColor Cyan
Write-Host ""

# Criar arquivo .env.local se não existir
$envFile = "frontend/.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Criando arquivo de configuração..." -ForegroundColor Yellow
    "VITE_API_IP=$localIP" | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "Arquivo $envFile criado com IP: $localIP" -ForegroundColor Green
} else {
    Write-Host "Arquivo $envFile já existe" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== URLs para teste ===" -ForegroundColor Green
Write-Host "Frontend: http://$localIP`:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://$localIP`:8080" -ForegroundColor Cyan
Write-Host "H2 Console: http://$localIP`:8080/h2-console" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== Instruções ===" -ForegroundColor Green
Write-Host "1. Inicie o backend: cd backend && ./mvnw spring-boot:run" -ForegroundColor White
Write-Host "2. Inicie o frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "3. Acesse de outros dispositivos usando os URLs acima" -ForegroundColor White
Write-Host ""

Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 