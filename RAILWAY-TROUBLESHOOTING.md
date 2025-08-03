# 🔧 Troubleshooting Railway - Sistema Confeitaria FullStack

## ❌ Erro: "Nixpacks build failed"

### Problema
O Railway não consegue identificar automaticamente que é um projeto Java/Spring Boot.

### ✅ Solução

#### 1. Verificar Arquivos de Configuração
Certifique-se de que estes arquivos estão na **raiz do repositório**:

```
confeitaria-fullstack/
├── nixpacks.toml          ← NOVO: Configuração Nixpacks
├── railway.toml           ← NOVO: Configuração Railway
├── Procfile              ← NOVO: Comando de execução
├── .dockerignore         ← NOVO: Otimização de build
├── backend/
│   ├── pom.xml           ← Maven configurado
│   ├── railway.json      ← Atualizado
│   └── src/
├── frontend/
└── ...
```

#### 2. Configuração do Railway

**No Railway Dashboard:**

1. **Vá em "Settings" do projeto**
2. **Em "Build & Deploy":**
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar`
   - Health Check Path: `/actuator/health`

3. **Em "Environment Variables":**
   ```
   JAVA_VERSION=21
   MAVEN_VERSION=3.9.5
   JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```

#### 3. Verificar Estrutura do Projeto

**Certifique-se de que o `pom.xml` está em:**
```
confeitaria-fullstack/backend/pom.xml
```

**NÃO em:**
```
confeitaria-fullstack/pom.xml
```

#### 4. Configuração Manual no Railway

Se o problema persistir:

1. **No Railway, vá em "Settings"**
2. **Em "Build & Deploy":**
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar`
   - **Health Check Path**: `/actuator/health`

#### 5. Verificar Logs

**No Railway Dashboard:**
1. Clique no projeto
2. Vá em "Deployments"
3. Clique no deployment mais recente
4. Verifique os logs de build

### 🔍 Logs Úteis

**Procurar por:**
- ✅ "Java version detected"
- ✅ "Maven build successful"
- ✅ "JAR file created"
- ❌ "No build plan found"
- ❌ "Unsupported language"

### 🚀 Deploy Manual

Se ainda houver problemas:

1. **No Railway, vá em "Settings"**
2. **Em "Build & Deploy":**
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar`
   - **Health Check Path**: `/actuator/health`

3. **Em "Environment Variables":**
   ```
   JAVA_VERSION=21
   MAVEN_VERSION=3.9.5
   JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```

4. **Clique em "Deploy"**

### 📋 Checklist

- [ ] `nixpacks.toml` na raiz
- [ ] `railway.toml` na raiz
- [ ] `Procfile` na raiz
- [ ] `.dockerignore` na raiz
- [ ] `pom.xml` em `backend/`
- [ ] Variáveis de ambiente configuradas
- [ ] Build command configurado
- [ ] Start command configurado

### 🆘 Se Nada Funcionar

**Alternativa: Deploy Manual**

1. **No Railway, vá em "Settings"**
2. **Em "Build & Deploy":**
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar`
   - **Health Check Path**: `/actuator/health`

3. **Force um novo deploy**

---

**💡 Dica:** O problema geralmente é que o Railway não encontra o `pom.xml` na raiz. Como nosso projeto tem estrutura `backend/` e `frontend/`, precisamos especificar manualmente onde está o código Java. 