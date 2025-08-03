# Script para iniciar a aplicação completa (Backend + Frontend)
# Autor: Sistema Confeitaria FullStack
# Data: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🚀 Iniciando Sistema Confeitaria FullStack..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Blue

# Verificar se Java está instalado
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java encontrado: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java não encontrado. Por favor, instale o Java 21." -ForegroundColor Red
    exit 1
}

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Por favor, instale o Node.js." -ForegroundColor Red
    exit 1
}

# Verificar se Maven está instalado
try {
    $mavenVersion = mvn --version | Select-String "Apache Maven"
    Write-Host "✅ Maven encontrado: $mavenVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Maven não encontrado. Por favor, instale o Maven." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow

# Instalar dependências do frontend
Write-Host "📱 Instalando dependências do Frontend..." -ForegroundColor Cyan
Set-Location "frontend"
if (Test-Path "node_modules") {
    Write-Host "   Dependências já instaladas" -ForegroundColor Gray
} else {
    npm install
}
Set-Location ".."

# Compilar o backend
Write-Host "🔧 Compilando Backend..." -ForegroundColor Cyan
Set-Location "backend"
mvn clean compile
Set-Location ".."

Write-Host ""
Write-Host "🚀 Iniciando serviços..." -ForegroundColor Yellow

# Iniciar o backend em background
Write-Host "🔧 Iniciando Backend (Spring Boot)..." -ForegroundColor Cyan
Set-Location "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run" -WindowStyle Normal
Set-Location ".."

# Aguardar o backend inicializar
Write-Host "⏳ Aguardando Backend inicializar (15 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Iniciar o frontend em background
Write-Host "📱 Iniciando Frontend (Vite)..." -ForegroundColor Cyan
Set-Location "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Set-Location ".."

# Aguardar o frontend inicializar
Write-Host "⏳ Aguardando Frontend inicializar (10 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Abrir o navegador
Write-Host "🌐 Abrindo navegador..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✅ Sistema iniciado com sucesso!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Blue
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🗄️  Banco H2: http://localhost:8080/h2-console" -ForegroundColor Cyan
Write-Host "   Usuário: sa" -ForegroundColor Gray
Write-Host "   Senha: (vazia)" -ForegroundColor Gray
Write-Host "   JDBC URL: jdbc:h2:file:./data/confeitaria_db" -ForegroundColor Gray
Write-Host ""
Write-Host "🔑 Credenciais de acesso:" -ForegroundColor Yellow
Write-Host "   Email: admin@confeitaria.com" -ForegroundColor Gray
Write-Host "   Senha: 123456" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Para parar os serviços, feche as janelas do PowerShell" -ForegroundColor Yellow 