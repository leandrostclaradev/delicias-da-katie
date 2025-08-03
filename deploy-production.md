# 🚀 Deploy em Produção - Sistema Confeitaria FullStack

## 📋 Visão Geral
Este documento explica como fazer o deploy da aplicação em produção usando serviços gratuitos:
- **Backend**: Railway (Java/Spring Boot)
- **Frontend**: Vercel (React/Vite)
- **Banco de Dados**: PostgreSQL (Railway)

## 🎯 Objetivos
- [x] Deploy automático do backend
- [x] Deploy automático do frontend
- [x] Banco de dados PostgreSQL gratuito
- [x] Integração contínua com GitHub
- [x] URLs públicas para demonstração

## 📦 Pré-requisitos
1. Conta no GitHub
2. Conta no Railway (railway.app)
3. Conta no Vercel (vercel.com)
4. Git configurado localmente

## 🔧 Configuração do Backend (Railway)

### 1. Preparar o Backend para Produção

#### 1.1 Atualizar `application.properties`
```properties
# Configuração para produção
spring.profiles.active=prod
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# Configurações de segurança
jwt.secret=${JWT_SECRET}
server.port=${PORT:8080}

# CORS para produção
spring.web.cors.allowed-origins=${FRONTEND_URL:https://confeitaria-frontend.vercel.app}
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

#### 1.2 Adicionar dependência PostgreSQL no `pom.xml`
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### 1.3 Criar `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar",
    "healthcheckPath": "/actuator/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 2. Deploy no Railway

1. **Conectar GitHub ao Railway**
   - Acesse railway.app
   - Faça login com GitHub
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"

2. **Configurar Variáveis de Ambiente**
   ```
   JWT_SECRET=sua_chave_secreta_muito_segura_aqui
   FRONTEND_URL=https://confeitaria-frontend.vercel.app
   ```

3. **Adicionar Banco PostgreSQL**
   - No projeto Railway, clique em "New"
   - Selecione "Database" → "PostgreSQL"
   - Railway automaticamente configurará `DATABASE_URL`

## 🌐 Configuração do Frontend (Vercel)

### 1. Preparar o Frontend para Produção

#### 1.1 Criar `.env.production`
```env
VITE_API_URL=https://seu-backend.railway.app
VITE_APP_NAME=Confeitaria da Katie
```

#### 1.2 Atualizar `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 5173,
    host: true
  }
})
```

#### 1.3 Criar `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### 2. Deploy no Vercel

1. **Conectar GitHub ao Vercel**
   - Acesse vercel.com
   - Faça login com GitHub
   - Clique em "New Project"
   - Importe o repositório

2. **Configurar Build**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Configurar Variáveis de Ambiente**
   ```
   VITE_API_URL=https://seu-backend.railway.app
   ```

## 🔄 Integração Contínua

### 1. GitHub Actions (Opcional)
Criar `.github/workflows/deploy.yml`:
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

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📊 Monitoramento

### 1. Railway Dashboard
- Logs em tempo real
- Métricas de performance
- Status do banco de dados

### 2. Vercel Analytics
- Analytics de visitantes
- Performance do frontend
- Deploy status

## 🔐 Segurança

### 1. Variáveis de Ambiente
- Nunca commitar senhas no código
- Usar variáveis de ambiente para configurações sensíveis
- Rotacionar JWT secrets regularmente

### 2. CORS
- Configurar CORS apenas para domínios permitidos
- Não usar `origins: "*"` em produção

### 3. Banco de Dados
- Usar conexões SSL
- Backup automático (Railway oferece)
- Monitorar queries lentas

## 🚀 URLs de Acesso

Após o deploy, você terá:
- **Frontend**: `https://confeitaria-frontend.vercel.app`
- **Backend**: `https://seu-backend.railway.app`
- **API Docs**: `https://seu-backend.railway.app/swagger-ui.html`

## 📱 Credenciais de Acesso

### Usuário Administrador
- **Email**: admin@confeitaria.com
- **Senha**: 123456

### Usuário Funcionário (criar via API)
- **Email**: funcionario@confeitaria.com
- **Senha**: 123456

## 🔧 Comandos Úteis

### Deploy Manual Backend
```bash
cd backend
mvn clean package
railway up
```

### Deploy Manual Frontend
```bash
cd frontend
npm run build
vercel --prod
```

### Verificar Status
```bash
# Backend
curl https://seu-backend.railway.app/actuator/health

# Frontend
curl https://confeitaria-frontend.vercel.app
```

## 🆘 Troubleshooting

### Problemas Comuns

1. **Backend não inicia**
   - Verificar variáveis de ambiente
   - Verificar logs no Railway
   - Verificar se o banco está conectado

2. **Frontend não carrega**
   - Verificar build no Vercel
   - Verificar variável `VITE_API_URL`
   - Verificar CORS no backend

3. **Banco de dados não conecta**
   - Verificar `DATABASE_URL` no Railway
   - Verificar se o PostgreSQL está ativo
   - Verificar credenciais

### Logs e Debug
```bash
# Railway logs
railway logs

# Vercel logs
vercel logs

# Local debug
mvn spring-boot:run -Dspring.profiles.active=prod
```

## 📈 Próximos Passos

1. **Configurar domínio personalizado**
2. **Implementar SSL/HTTPS**
3. **Configurar backup automático**
4. **Implementar monitoramento avançado**
5. **Configurar CDN para assets**
6. **Implementar cache Redis**

## 📞 Suporte

- **Railway**: https://docs.railway.app
- **Vercel**: https://vercel.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs
- **Spring Boot**: https://spring.io/projects/spring-boot
- **React**: https://react.dev

---

**🎉 Parabéns! Sua aplicação está em produção!** 