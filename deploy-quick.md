# 🚀 Deploy Rápido - Sistema Confeitaria FullStack

## ⚡ Deploy em 5 Passos

### 1. 📦 Preparar o Repositório
```bash
# Fazer commit de todas as alterações
git add .
git commit -m "Configuração para deploy em produção"
git push origin main
```

### 2. 🔧 Deploy do Backend (Railway)
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório
5. Adicione um banco PostgreSQL:
   - Clique em "New" → "Database" → "PostgreSQL"
6. Configure as variáveis de ambiente:
   ```
   JWT_SECRET=sua_chave_secreta_muito_segura_aqui
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```

### 3. 🌐 Deploy do Frontend (Vercel)
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Importe seu repositório
5. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Configure variáveis de ambiente:
   ```
   VITE_API_URL=https://seu-backend.railway.app
   ```

### 4. 🔗 Conectar Frontend e Backend
1. Copie a URL do backend do Railway
2. No Vercel, vá em Settings → Environment Variables
3. Atualize `VITE_API_URL` com a URL do backend
4. Faça um novo deploy

### 5. ✅ Testar a Aplicação
- Frontend: `https://seu-frontend.vercel.app`
- Backend: `https://seu-backend.railway.app`
- Credenciais: admin@confeitaria.com / 123456

## 🎯 URLs Finais
Após o deploy, você terá:
- **Frontend**: `https://confeitaria-frontend.vercel.app`
- **Backend**: `https://confeitaria-backend.railway.app`
- **Banco**: PostgreSQL gerenciado pelo Railway

## 🔧 Comandos Úteis

### Deploy Manual
```bash
# Backend
cd backend
mvn clean package
railway up

# Frontend
cd frontend
npm run build
vercel --prod
```

### Verificar Status
```bash
# Backend health
curl https://seu-backend.railway.app/actuator/health

# Frontend
curl https://seu-frontend.vercel.app
```

## 🆘 Problemas Comuns

### Backend não inicia
- Verificar variáveis de ambiente no Railway
- Verificar logs: `railway logs`
- Verificar se o banco PostgreSQL está ativo

### Frontend não carrega
- Verificar build no Vercel
- Verificar variável `VITE_API_URL`
- Verificar CORS no backend

### Banco não conecta
- Verificar `DATABASE_URL` no Railway
- Verificar se o PostgreSQL está ativo
- Verificar credenciais

## 📊 Monitoramento
- **Railway**: Logs e métricas do backend
- **Vercel**: Analytics e performance do frontend
- **PostgreSQL**: Backup automático incluído

## 🔐 Segurança
- ✅ HTTPS automático
- ✅ Variáveis de ambiente seguras
- ✅ CORS configurado
- ✅ Backup automático do banco

---

**🎉 Sua aplicação está pronta para demonstração!** 