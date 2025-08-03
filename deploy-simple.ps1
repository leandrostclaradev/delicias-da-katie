# Script para Deploy - Sistema Confeitaria FullStack
Write-Host "Deploy Automatizado - Sistema Confeitaria FullStack" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Blue

# Verificar se Git está configurado
try {
    $gitUser = git config user.name
    $gitEmail = git config user.email
    Write-Host "Git configurado: $gitUser <$gitEmail>" -ForegroundColor Green
} catch {
    Write-Host "Git nao configurado. Configure antes de continuar:" -ForegroundColor Red
    Write-Host "git config --global user.name 'Seu Nome'" -ForegroundColor Yellow
    Write-Host "git config --global user.email 'seu@email.com'" -ForegroundColor Yellow
    exit 1
}

# Verificar se há mudanças não commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Encontradas mudancas nao commitadas:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
    
    $response = Read-Host "Deseja fazer commit das mudancas? (s/n)"
    if ($response -eq 's' -or $response -eq 'S') {
        $commitMessage = Read-Host "Digite a mensagem do commit"
        if (-not $commitMessage) {
            $commitMessage = "Deploy automatico - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }
        
        git add .
        git commit -m $commitMessage
        Write-Host "Commit realizado: $commitMessage" -ForegroundColor Green
    } else {
        Write-Host "Deploy cancelado. Faca commit das mudancas primeiro." -ForegroundColor Red
        exit 1
    }
}

# Fazer push para o repositório
Write-Host "Fazendo push para o repositorio..." -ForegroundColor Cyan
try {
    git push origin main
    Write-Host "Push realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Erro ao fazer push. Verifique se o repositorio esta configurado." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "PROXIMOS PASSOS PARA DEPLOY:" -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Blue

Write-Host ""
Write-Host "1. DEPLOY DO BACKEND (Railway):" -ForegroundColor Cyan
Write-Host "   - Acesse: https://railway.app" -ForegroundColor Gray
Write-Host "   - Faca login com GitHub" -ForegroundColor Gray
Write-Host "   - New Project -> Deploy from GitHub repo" -ForegroundColor Gray
Write-Host "   - Selecione seu repositorio" -ForegroundColor Gray
Write-Host "   - Adicione PostgreSQL: New -> Database -> PostgreSQL" -ForegroundColor Gray
Write-Host "   - Configure variaveis:" -ForegroundColor Gray
Write-Host "     JWT_SECRET=sua_chave_secreta_muito_segura_aqui" -ForegroundColor Gray
Write-Host "     FRONTEND_URL=https://seu-frontend.vercel.app" -ForegroundColor Gray

Write-Host ""
Write-Host "2. DEPLOY DO FRONTEND (Vercel):" -ForegroundColor Cyan
Write-Host "   - Acesse: https://vercel.com" -ForegroundColor Gray
Write-Host "   - Faca login com GitHub" -ForegroundColor Gray
Write-Host "   - New Project -> Import Git Repository" -ForegroundColor Gray
Write-Host "   - Configure:" -ForegroundColor Gray
Write-Host "     Framework Preset: Vite" -ForegroundColor Gray
Write-Host "     Root Directory: frontend" -ForegroundColor Gray
Write-Host "     Build Command: npm run build" -ForegroundColor Gray
Write-Host "     Output Directory: dist" -ForegroundColor Gray
Write-Host "   - Configure variavel:" -ForegroundColor Gray
Write-Host "     VITE_API_URL=https://seu-backend.railway.app" -ForegroundColor Gray

Write-Host ""
Write-Host "3. CONECTAR FRONTEND E BACKEND:" -ForegroundColor Cyan
Write-Host "   - Copie a URL do backend do Railway" -ForegroundColor Gray
Write-Host "   - No Vercel: Settings -> Environment Variables" -ForegroundColor Gray
Write-Host "   - Atualize VITE_API_URL com a URL do backend" -ForegroundColor Gray
Write-Host "   - Faca novo deploy no Vercel" -ForegroundColor Gray

Write-Host ""
Write-Host "4. TESTAR A APLICACAO:" -ForegroundColor Cyan
Write-Host "   - Frontend: https://seu-frontend.vercel.app" -ForegroundColor Gray
Write-Host "   - Backend: https://seu-backend.railway.app" -ForegroundColor Gray
Write-Host "   - Credenciais: admin@confeitaria.com / 123456" -ForegroundColor Gray

Write-Host ""
Write-Host "COMANDOS UTEIS:" -ForegroundColor Yellow
Write-Host "===============" -ForegroundColor Blue

Write-Host ""
Write-Host "Verificar status do backend:" -ForegroundColor Gray
Write-Host "curl https://seu-backend.railway.app/actuator/health" -ForegroundColor White

Write-Host ""
Write-Host "Verificar status do frontend:" -ForegroundColor Gray
Write-Host "curl https://seu-frontend.vercel.app" -ForegroundColor White

Write-Host ""
Write-Host "Deploy manual backend:" -ForegroundColor Gray
Write-Host "cd backend; mvn clean package; railway up" -ForegroundColor White

Write-Host ""
Write-Host "Deploy manual frontend:" -ForegroundColor Gray
Write-Host "cd frontend; npm run build; vercel --prod" -ForegroundColor White

Write-Host ""
Write-Host "MONITORAMENTO:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Blue
Write-Host "- Railway: Logs e metricas do backend" -ForegroundColor Gray
Write-Host "- Vercel: Analytics e performance do frontend" -ForegroundColor Gray
Write-Host "- PostgreSQL: Backup automatico incluido" -ForegroundColor Gray

Write-Host ""
Write-Host "SEGURANCA:" -ForegroundColor Yellow
Write-Host "==========" -ForegroundColor Blue
Write-Host "- HTTPS automatico" -ForegroundColor Green
Write-Host "- Variaveis de ambiente seguras" -ForegroundColor Green
Write-Host "- CORS configurado" -ForegroundColor Green
Write-Host "- Backup automatico do banco" -ForegroundColor Green

Write-Host ""
Write-Host "Deploy configurado! Siga os passos acima para colocar em producao." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Blue 