# 🚀 Deploy Manual - Sistema Confeitaria FullStack

## 📋 Pré-requisitos
1. Conta no GitHub
2. Conta no Railway (railway.app)
3. Conta no Vercel (vercel.com)

## 🔧 Passo a Passo

### 1. Preparar o Repositório GitHub

1. **Criar repositório no GitHub**
   - Acesse github.com
   - Clique em "New repository"
   - Nome: `confeitaria-fullstack`
   - Público ou privado
   - Não inicialize com README

2. **Fazer upload dos arquivos**
   - No repositório criado, clique em "uploading an existing file"
   - Arraste todos os arquivos do projeto
   - Commit message: "Configuração inicial para deploy"
   - Clique em "Commit changes"

### 2. Deploy do Backend (Railway)

1. **Acessar Railway**
   - Vá para https://railway.app
   - Faça login com GitHub

2. **Criar projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório `confeitaria-fullstack`

3. **Adicionar banco PostgreSQL**
   - No projeto criado, clique em "New"
   - Selecione "Database" → "PostgreSQL"
   - Railway configurará automaticamente a variável `DATABASE_URL`

4. **Configurar variáveis de ambiente**
   - No projeto, vá em "Variables"
   - Adicione as seguintes variáveis:
   ```
   JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```

5. **Verificar deploy**
   - O Railway fará deploy automático
   - Aguarde alguns minutos
   - Copie a URL do backend (ex: https://confeitaria-backend.railway.app)

### 3. Deploy do Frontend (Vercel)

1. **Acessar Vercel**
   - Vá para https://vercel.com
   - Faça login com GitHub

2. **Criar projeto**
   - Clique em "New Project"
   - Importe o repositório `confeitaria-fullstack`

3. **Configurar build**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: **npm run build**
   - Output Directory: **dist**
   - Install Command: **npm install**

4. **Configurar variáveis de ambiente**
   - Em "Environment Variables", adicione:
   ```
   VITE_API_URL=https://seu-backend.railway.app
   ```
   - Substitua pela URL real do seu backend

5. **Fazer deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Copie a URL do frontend (ex: https://confeitaria-frontend.vercel.app)

### 4. Conectar Frontend e Backend

1. **Atualizar URL do backend**
   - No Vercel, vá em "Settings" → "Environment Variables"
   - Atualize `VITE_API_URL` com a URL real do backend
   - Faça um novo deploy

2. **Atualizar CORS no backend**
   - No Railway, vá em "Variables"
   - Atualize `FRONTEND_URL` com a URL real do frontend
   - O backend será reiniciado automaticamente

## 🧪 Testar a Aplicação

### URLs de Acesso
- **Frontend**: https://seu-frontend.vercel.app
- **Backend**: https://seu-backend.railway.app
- **Health Check**: https://seu-backend.railway.app/actuator/health

### Credenciais de Login
- **Email**: admin@confeitaria.com
- **Senha**: 123456

## 🔧 Comandos Úteis

### Verificar Status
```bash
# Backend health
curl https://seu-backend.railway.app/actuator/health

# Frontend
curl https://seu-frontend.vercel.app
```

### Logs
- **Railway**: Dashboard do projeto → Logs
- **Vercel**: Dashboard do projeto → Functions → Logs

## 🆘 Troubleshooting

### Backend não inicia
1. Verificar variáveis de ambiente no Railway
2. Verificar logs no Railway Dashboard
3. Verificar se o PostgreSQL está ativo

### Frontend não carrega
1. Verificar build no Vercel
2. Verificar variável `VITE_API_URL`
3. Verificar CORS no backend

### Banco não conecta
1. Verificar `DATABASE_URL` no Railway
2. Verificar se o PostgreSQL está ativo
3. Verificar credenciais

## 📊 Monitoramento

### Railway Dashboard
- Logs em tempo real
- Métricas de performance
- Status do banco de dados
- Uso de recursos

### Vercel Dashboard
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

### Boas Práticas
- Nunca commitar senhas no código
- Rotacionar JWT secrets regularmente
- Monitorar logs de acesso
- Manter dependências atualizadas

## 🎯 URLs Finais

Após o deploy, você terá:
- **Frontend**: `https://confeitaria-frontend.vercel.app`
- **Backend**: `https://confeitaria-backend.railway.app`
- **Banco**: PostgreSQL gerenciado pelo Railway

## 📱 Para Mostrar ao Cliente

1. **Acesse o frontend** na URL fornecida
2. **Faça login** com as credenciais
3. **Demonstre as funcionalidades**:
   - Dashboard principal
   - Gestão de produtos
   - Sistema de vendas
   - Relatórios
   - Configurações

## 🔄 Atualizações Futuras

1. **Faça as alterações** no código
2. **Faça upload** para o GitHub
3. **Railway e Vercel** farão deploy automático
4. **Teste** as mudanças nas URLs de produção

---

## 🎉 Parabéns!

Sua aplicação está em produção e pronta para demonstração!

**Próximos passos:**
1. Teste todas as funcionalidades
2. Configure domínio personalizado (opcional)
3. Configure monitoramento avançado
4. Implemente backup adicional

---

**Desenvolvido com ❤️ para Confeitaria da Katie** 