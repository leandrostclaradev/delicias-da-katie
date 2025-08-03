# Script para Deploy Automatizado - Sistema Confeitaria FullStack
# Autor: Sistema Confeitaria FullStack
# Data: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🚀 Deploy Automatizado - Sistema Confeitaria FullStack" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Blue

# Verificar se Git está configurado
try {
    $gitUser = git config user.name
    $gitEmail = git config user.email
    Write-Host "✅ Git configurado: $gitUser <$gitEmail>" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não configurado. Configure antes de continuar:" -ForegroundColor Red
    Write-Host "   git config --global user.name 'Seu Nome'" -ForegroundColor Yellow
    Write-Host "   git config --global user.email 'seu@email.com'" -ForegroundColor Yellow
    exit 1
}

# Verificar se há mudanças não commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Encontradas mudanças não commitadas:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
    
    $response = Read-Host "Deseja fazer commit das mudanças? (s/n)"
    if ($response -eq 's' -or $response -eq 'S') {
        $commitMessage = Read-Host "Digite a mensagem do commit"
        if (-not $commitMessage) {
            $commitMessage = "Deploy automático - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }
        
        git add .
        git commit -m $commitMessage
        Write-Host "✅ Commit realizado: $commitMessage" -ForegroundColor Green
    } else {
        Write-Host "❌ Deploy cancelado. Faça commit das mudanças primeiro." -ForegroundColor Red
        exit 1
    }
}

# Fazer push para o repositório
Write-Host "📤 Fazendo push para o repositório..." -ForegroundColor Cyan
try {
    git push origin main
    Write-Host "✅ Push realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao fazer push. Verifique se o repositório está configurado." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Próximos Passos para Deploy:" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Blue

Write-Host ""
Write-Host "1️⃣  DEPLOY DO BACKEND (Railway):" -ForegroundColor Cyan
Write-Host "   • Acesse: https://railway.app" -ForegroundColor Gray
Write-Host "   • Faça login com GitHub" -ForegroundColor Gray
Write-Host "   • New Project → Deploy from GitHub repo" -ForegroundColor Gray
Write-Host "   • Selecione seu repositório" -ForegroundColor Gray
Write-Host "   • Adicione PostgreSQL: New → Database → PostgreSQL" -ForegroundColor Gray
Write-Host "   • Configure variáveis:" -ForegroundColor Gray
Write-Host "     JWT_SECRET=sua_chave_secreta_muito_segura_aqui" -ForegroundColor Gray
Write-Host "     FRONTEND_URL=https://seu-frontend.vercel.app" -ForegroundColor Gray

Write-Host ""
Write-Host "2️⃣  DEPLOY DO FRONTEND (Vercel):" -ForegroundColor Cyan
Write-Host "   • Acesse: https://vercel.com" -ForegroundColor Gray
Write-Host "   • Faça login com GitHub" -ForegroundColor Gray
Write-Host "   • New Project → Import Git Repository" -ForegroundColor Gray
Write-Host "   • Configure:" -ForegroundColor Gray
Write-Host "     Framework Preset: Vite" -ForegroundColor Gray
Write-Host "     Root Directory: frontend" -ForegroundColor Gray
Write-Host "     Build Command: npm run build" -ForegroundColor Gray
Write-Host "     Output Directory: dist" -ForegroundColor Gray
Write-Host "   • Configure variável:" -ForegroundColor Gray
Write-Host "     VITE_API_URL=https://seu-backend.railway.app" -ForegroundColor Gray

Write-Host ""
Write-Host "3️⃣  CONECTAR FRONTEND E BACKEND:" -ForegroundColor Cyan
Write-Host "   • Copie a URL do backend do Railway" -ForegroundColor Gray
Write-Host "   • No Vercel: Settings → Environment Variables" -ForegroundColor Gray
Write-Host "   • Atualize VITE_API_URL com a URL do backend" -ForegroundColor Gray
Write-Host "   • Faça novo deploy no Vercel" -ForegroundColor Gray

Write-Host ""
Write-Host "4️⃣  TESTAR A APLICAÇÃO:" -ForegroundColor Cyan
Write-Host "   • Frontend: https://seu-frontend.vercel.app" -ForegroundColor Gray
Write-Host "   • Backend: https://seu-backend.railway.app" -ForegroundColor Gray
Write-Host "   • Credenciais: admin@confeitaria.com / 123456" -ForegroundColor Gray

Write-Host ""
Write-Host "🔧 COMANDOS ÚTEIS:" -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Blue

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
Write-Host "📊 MONITORAMENTO:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Blue
Write-Host "• Railway: Logs e métricas do backend" -ForegroundColor Gray
Write-Host "• Vercel: Analytics e performance do frontend" -ForegroundColor Gray
Write-Host "• PostgreSQL: Backup automático incluído" -ForegroundColor Gray

Write-Host ""
Write-Host "🔐 SEGURANÇA:" -ForegroundColor Yellow
Write-Host "=============" -ForegroundColor Blue
Write-Host "• ✅ HTTPS automático" -ForegroundColor Green
Write-Host "• ✅ Variáveis de ambiente seguras" -ForegroundColor Green
Write-Host "• ✅ CORS configurado" -ForegroundColor Green
Write-Host "• ✅ Backup automático do banco" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Deploy configurado! Siga os passos acima para colocar em produção." -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Blue 