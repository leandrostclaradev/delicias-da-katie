# 🌐 Configuração para Teste em Rede Local

## ✅ Configurações Realizadas

### Backend (Spring Boot)
- ✅ Configurado para aceitar conexões em `0.0.0.0:8080`
- ✅ CORS configurado para permitir todas as origens
- ✅ Spring Security configurado para aceitar conexões externas

### Frontend (Vite)
- ✅ Configurado para aceitar conexões em `0.0.0.0:3000`
- ✅ API configurada para detectar IP automaticamente
- ✅ Suporte a configuração manual via variável de ambiente

## 🚀 Como Testar

### 1. Descubra seu IP Local
Execute no PowerShell:
```powershell
ipconfig
```
Procure por "IPv4 Address" na sua interface de rede (Ethernet ou Wi-Fi).

### 2. Configure o Frontend
Crie o arquivo `frontend/.env.local` com o conteúdo:
```
VITE_API_IP=SEU_IP_AQUI
```

**Exemplo:**
```
VITE_API_IP=192.168.100.56
```

### 3. Inicie os Serviços

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 4. URLs para Acesso

- **Frontend**: `http://SEU_IP:3000`
- **Backend**: `http://SEU_IP:8080`
- **H2 Console**: `http://SEU_IP:8080/h2-console`

**Exemplo com IP detectado:**
- Frontend: `http://192.168.100.56:3000`
- Backend: `http://192.168.100.56:8080`
- H2 Console: `http://192.168.100.56:8080/h2-console`

## 🔧 Solução de Problemas

### Firewall
Se não conseguir acessar, verifique se o Windows Firewall está permitindo conexões nas portas 3000 e 8080.

### Antivírus
Alguns antivírus podem bloquear conexões. Adicione exceções se necessário.

### Rede
Certifique-se de que todos os dispositivos estão na mesma rede Wi-Fi/LAN.

## 📱 Teste em Dispositivos

1. **Celular/Tablet**: Acesse `http://SEU_IP:3000`
2. **Outro Computador**: Acesse `http://SEU_IP:3000`
3. **Qualquer dispositivo na rede**: Use o mesmo URL

## 🔒 Segurança

⚠️ **Importante**: Estas configurações são apenas para desenvolvimento e teste local. Para produção, configure adequadamente:
- CORS restritivo
- Firewall
- HTTPS
- Autenticação robusta 