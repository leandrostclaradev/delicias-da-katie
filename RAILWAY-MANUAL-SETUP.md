# 🔧 Configuração Manual Railway - Sem Arquivos de Configuração

## ❌ Problema
Os arquivos de configuração estão causando conflitos. Vamos configurar manualmente no Railway Dashboard.

## ✅ Solução: Configuração Manual

### 1. Remover Arquivos de Configuração

**Delete estes arquivos do repositório:**
- ❌ `nixpacks.toml`
- ❌ `railway.toml`
- ❌ `railway.json` (raiz)
- ❌ `Procfile`

**Manter apenas:**
- ✅ `backend/pom.xml` (Java 17)
- ✅ `backend/railway.json` (pode manter)
- ✅ `.dockerignore`

### 2. Configuração Manual no Railway Dashboard

#### **Passo 1: Acessar Settings**
1. Vá para https://railway.app
2. Clique no seu projeto
3. Vá em **"Settings"**

#### **Passo 2: Build & Deploy**
Em **"Build & Deploy"**, configure:

**Build Command:**
```
cd backend && mvn clean package -DskipTests
```

**Start Command:**
```
cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar
```

**Health Check Path:**
```
/actuator/health
```

#### **Passo 3: Environment Variables**
Em **"Environment Variables"**, adicione:

```
JAVA_VERSION=17
MAVEN_VERSION=3.9.5
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024
FRONTEND_URL=https://seu-frontend.vercel.app
```

### 3. Fazer Deploy

1. **Clique em "Deploy"** no Railway Dashboard
2. **Aguarde o build** (pode demorar alguns minutos)
3. **Verifique os logs** para confirmar que está funcionando

### 4. Verificar Logs

**No Railway Dashboard:**
1. Clique no projeto
2. Vá em **"Deployments"**
3. Clique no deployment mais recente
4. Verifique os logs

**Procurar por:**
- ✅ "Java version detected"
- ✅ "Maven build successful"
- ✅ "JAR file created"
- ✅ "Application started"

### 5. Testar Health Check

**Após o deploy, teste:**
```
https://seu-backend.railway.app/actuator/health
```

Deve retornar:
```json
{
  "status": "UP"
}
```

## 🔍 Troubleshooting

### Se ainda houver erro:

1. **Verifique se o `pom.xml` está em `backend/`**
2. **Confirme que Java version é 17 no `pom.xml`**
3. **Verifique se as variáveis de ambiente estão corretas**
4. **Force um novo deploy**

### Logs Úteis:

**Procurar por:**
- ❌ "undefined variable 'openjdk21'" → Configuração manual não aplicada
- ❌ "No build plan found" → Build command incorreto
- ❌ "JAR file not found" → Start command incorreto

## 📋 Checklist

- [ ] Arquivos de configuração removidos
- [ ] Build Command configurado manualmente
- [ ] Start Command configurado manualmente
- [ ] Health Check Path configurado
- [ ] Environment Variables configuradas
- [ ] Novo deploy realizado
- [ ] Logs verificados
- [ ] Health check testado

---

**💡 Dica:** A configuração manual no Railway Dashboard tem prioridade sobre os arquivos de configuração. Isso resolve conflitos e dá mais controle sobre o deploy. 