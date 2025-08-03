# 🔧 Fix para Erro Nixpacks - Java 21 → Java 17

## ❌ Erro: "undefined variable 'openjdk21'"

### Problema
O Nixpacks não suporta `openjdk21` na versão atual. Precisamos usar Java 17.

### ✅ Solução Aplicada

#### 1. Arquivos Atualizados

**`nixpacks.toml`:**
```toml
[phases.setup]
nixPkgs = ["openjdk17", "maven"]

[phases.install]
cmds = ["cd backend && mvn clean package -DskipTests"]

[start]
cmd = "cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar"
```

**`railway.toml`:**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"

[build.environment]
JAVA_VERSION = "17"
MAVEN_VERSION = "3.9.5"
```

**`backend/pom.xml`:**
```xml
<properties>
    <java.version>17</java.version>
</properties>
```

**`Procfile`:**
```
web: cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar
```

**`railway.json` (raiz):**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar",
    "healthcheckPath": "/actuator/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 2. Próximos Passos

1. **Faça upload dos arquivos atualizados para o GitHub**
2. **No Railway Dashboard:**
   - Vá em "Settings"
   - Em "Build & Deploy":
     - **Build Command**: `cd backend && mvn clean package -DskipTests`
     - **Start Command**: `cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar`
     - **Health Check Path**: `/actuator/health`
   - Em "Environment Variables":
     ```
     JAVA_VERSION=17
     MAVEN_VERSION=3.9.5
     JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024
     FRONTEND_URL=https://seu-frontend.vercel.app
     ```

3. **Force um novo deploy**

### 🔍 Por que Java 17?

- ✅ **Suportado pelo Nixpacks**
- ✅ **Compatível com Spring Boot 3.2.0**
- ✅ **Estável e amplamente usado**
- ✅ **Funciona com todas as dependências**

### 📋 Checklist

- [ ] `nixpacks.toml` atualizado (Java 17)
- [ ] `railway.toml` atualizado (Java 17)
- [ ] `backend/pom.xml` atualizado (Java 17)
- [ ] `Procfile` atualizado (cd backend)
- [ ] `railway.json` na raiz
- [ ] Upload para GitHub
- [ ] Configuração manual no Railway
- [ ] Novo deploy

### 🚀 Deploy Manual (Se necessário)

**No Railway Dashboard:**

1. **Settings → Build & Deploy:**
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `cd backend && java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar`
   - **Health Check Path**: `/actuator/health`

2. **Settings → Environment Variables:**
   ```
   JAVA_VERSION=17
   MAVEN_VERSION=3.9.5
   JWT_SECRET=sua_chave_secreta_muito_segura_aqui_2024
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```

3. **Clique em "Deploy"**

---

**💡 Dica:** O Java 17 é a versão LTS mais recente e estável, sendo perfeitamente compatível com nosso projeto Spring Boot. 