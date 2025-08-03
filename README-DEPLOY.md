# 🚀 Sistema Confeitaria FullStack - Deploy em Produção

## 📋 Resumo do Projeto
Sistema completo de gestão para confeitaria com:
- **Backend**: Spring Boot + Java 21 + PostgreSQL
- **Frontend**: React + Vite + TypeScript
- **Banco**: PostgreSQL (gratuito via Railway)
- **Deploy**: Railway (backend) + Vercel (frontend)

## 🎯 Funcionalidades
- ✅ Gestão de produtos e combos
- ✅ Sistema de vendas e encomendas
- ✅ Controle de usuários e permissões
- ✅ Fluxo de caixa
- ✅ Promoções e descontos
- ✅ Interface responsiva e moderna

## 🚀 Deploy Rápido

### Opção 1: Script Automatizado
```powershell
# Execute o script de deploy
.\deploy-automated.ps1
```

### Opção 2: Deploy Manual

#### 1. Preparar Repositório
```bash
git add .
git commit -m "Configuração para deploy"
git push origin main
```

#### 2. Deploy Backend (Railway)
1. Acesse [railway.app](https://railway.app)
2. Login com GitHub
3. New Project → Deploy from GitHub repo
4. Adicione PostgreSQL: New → Database → PostgreSQL
5. Configure variáveis:
   ```
   JWT_SECRET=sua_chave_secreta_muito_segura_aqui
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```

#### 3. Deploy Frontend (Vercel)
1. Acesse [vercel.com](https://vercel.com)
2. Login com GitHub
3. New Project → Import Git Repository
4. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Configure variável:
   ```
   VITE_API_URL=https://seu-backend.railway.app
   ```

## 🔧 Desenvolvimento Local

### Iniciar Aplicação Completa
```powershell
# Execute o script de inicialização
.\start-app.ps1
```

### Iniciar Separadamente
```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend (em outro terminal)
cd frontend
npm run dev
```

## 📊 URLs de Acesso

### Desenvolvimento Local
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **Banco H2**: http://localhost:8080/h2-console

### Produção
- **Frontend**: https://seu-frontend.vercel.app
- **Backend**: https://seu-backend.railway.app
- **API Health**: https://seu-backend.railway.app/actuator/health

## 🔑 Credenciais de Acesso

### Usuário Administrador
- **Email**: admin@confeitaria.com
- **Senha**: 123456

### Banco de Dados Local (H2)
- **URL**: jdbc:h2:file:./data/confeitaria_db
- **Usuário**: sa
- **Senha**: (vazia)

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21** - Linguagem principal
- **Spring Boot 3.2.0** - Framework
- **Spring Data JPA** - Persistência
- **Spring Security** - Autenticação
- **PostgreSQL** - Banco de dados
- **H2** - Banco local (desenvolvimento)
- **Maven** - Gerenciador de dependências

### Frontend
- **React 19** - Framework
- **TypeScript** - Tipagem
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Axios** - HTTP client
- **React Router** - Navegação

### Deploy
- **Railway** - Backend e banco
- **Vercel** - Frontend
- **GitHub** - Versionamento

## 📁 Estrutura do Projeto
```
confeitaria-fullstack/
├── backend/                 # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   ├── railway.json
│   └── application-prod.properties
├── frontend/               # React App
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── vercel.json
│   └── env.production
├── start-app.ps1          # Script de inicialização
├── deploy-automated.ps1   # Script de deploy
├── deploy-production.md   # Documentação completa
├── deploy-quick.md        # Guia rápido
└── README-DEPLOY.md       # Este arquivo
```

## 🔄 Integração Contínua

### GitHub Actions (Opcional)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway/deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## 📊 Monitoramento

### Railway Dashboard
- Logs em tempo real
- Métricas de performance
- Status do banco de dados
- Uso de recursos

### Vercel Analytics
- Analytics de visitantes
- Performance do frontend
- Deploy status
- Core Web Vitals

## 🔐 Segurança

### Configurações Implementadas
- ✅ HTTPS automático
- ✅ Variáveis de ambiente seguras
- ✅ CORS configurado para produção
- ✅ JWT com secret configurável
- ✅ Backup automático do banco
- ✅ Validação de entrada
- ✅ Sanitização de dados

### Boas Práticas
- Nunca commitar senhas no código
- Rotacionar JWT secrets regularmente
- Monitorar logs de acesso
- Manter dependências atualizadas

## 🆘 Troubleshooting

### Problemas Comuns

#### Backend não inicia
```bash
# Verificar logs
railway logs

# Verificar variáveis de ambiente
railway variables

# Verificar banco de dados
railway connect
```

#### Frontend não carrega
```bash
# Verificar build
vercel logs

# Verificar variáveis
vercel env ls

# Rebuild manual
vercel --prod
```

#### Banco não conecta
```bash
# Verificar DATABASE_URL
railway variables

# Testar conexão
railway connect

# Verificar logs do banco
railway logs --service postgresql
```

### Logs Úteis
```bash
# Backend local
mvn spring-boot:run -Dspring.profiles.active=prod

# Frontend local
npm run build && npm run preview

# Verificar health
curl http://localhost:8080/actuator/health
```

## 📈 Próximos Passos

### Melhorias Planejadas
1. **Domínio personalizado**
2. **SSL/HTTPS customizado**
3. **Monitoramento avançado**
4. **CDN para assets**
5. **Cache Redis**
6. **Testes automatizados**
7. **CI/CD completo**

### Recursos Adicionais
- **Email marketing**
- **Relatórios avançados**
- **Integração com pagamentos**
- **App mobile**
- **API pública**

## 📞 Suporte

### Documentação
- **Railway**: https://docs.railway.app
- **Vercel**: https://vercel.com/docs
- **Spring Boot**: https://spring.io/projects/spring-boot
- **React**: https://react.dev

### Comunidade
- **GitHub Issues**: Para bugs e melhorias
- **Stack Overflow**: Para dúvidas técnicas
- **Discord**: Para suporte em tempo real

---

## 🎉 Parabéns!

Sua aplicação está pronta para demonstração e uso em produção. 

**URLs finais:**
- Frontend: `https://confeitaria-frontend.vercel.app`
- Backend: `https://confeitaria-backend.railway.app`
- Credenciais: `admin@confeitaria.com` / `123456`

**Para mostrar ao cliente:**
1. Acesse o frontend
2. Faça login com as credenciais
3. Demonstre as funcionalidades
4. Mostre o dashboard de gestão

**Para atualizações futuras:**
1. Faça as alterações no código
2. Execute `.\deploy-automated.ps1`
3. Siga os passos do script
4. A aplicação será atualizada automaticamente

---

**Desenvolvido com ❤️ para Confeitaria da Katie** 