# 🗄️ Sistema de Banco de Dados - Confeitaria

## 📋 **Mudanças Implementadas**

### ✅ **Antes (H2 em Memória)**
- ❌ Dados perdidos a cada reinicialização
- ❌ Não possível manter cadastros entre testes
- ❌ Usuários precisavam ser recriados sempre

### ✅ **Agora (H2 em Arquivo Local)**
- ✅ Dados persistentes entre reinicializações
- ✅ Cadastros mantidos (produtos, usuários, vendas, etc.)
- ✅ Banco local em `./data/confeitaria_db.mv.db`

## 🔧 **Configurações Alteradas**

### **application.properties**
```properties
# Antes
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
spring.sql.init.mode=always

# Agora
spring.datasource.url=jdbc:h2:file:./data/confeitaria_db
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode=never
```

## 📁 **Estrutura de Arquivos**

```
backend/
├── data/                          # Pasta do banco (criada automaticamente)
│   ├── confeitaria_db.mv.db      # Arquivo principal do banco
│   ├── confeitaria_db.trace.db   # Logs do banco (opcional)
│   └── confeitaria_db_backup_*.mv.db  # Backups automáticos
├── scripts/
│   └── manage-db.ps1             # Script de gerenciamento
└── .gitignore                    # Ignora pasta data/
```

## 🛠️ **Gerenciamento do Banco**

### **Script PowerShell** (`scripts/manage-db.ps1`)

```powershell
# Ver informações do banco
.\scripts\manage-db.ps1 info

# Fazer backup
.\scripts\manage-db.ps1 backup

# Resetar banco (CUIDADO!)
.\scripts\manage-db.ps1 reset

# Restaurar backup
.\scripts\manage-db.ps1 restore
```

### **Comandos Manuais**

```powershell
# Verificar se o banco existe
Test-Path ".\data\confeitaria_db.mv.db"

# Ver tamanho do banco
Get-Item ".\data\confeitaria_db.mv.db" | Select-Object Name, Length, LastWriteTime

# Backup manual
Copy-Item ".\data\confeitaria_db.mv.db" ".\data\backup_manual.mv.db"

# Reset manual (CUIDADO!)
Remove-Item ".\data\*" -Recurse -Force
```

## 🚀 **Como Usar**

### **1. Primeira Execução**
```bash
cd backend
./mvnw spring-boot:run
```
- ✅ Banco será criado automaticamente
- ✅ Usuário admin será criado
- ✅ Pasta `data/` será criada

### **2. Execuções Seguintes**
```bash
cd backend
./mvnw spring-boot:run
```
- ✅ Dados anteriores serão mantidos
- ✅ Usuários, produtos, vendas preservados
- ✅ Apenas verificação se admin existe

### **3. Backup Regular**
```powershell
.\scripts\manage-db.ps1 backup
```

## 🔐 **Credenciais Padrão**

```
Email: admin@confeitaria.com
Senha: 123456
```

## ⚠️ **Importante**

### **Git**
- A pasta `data/` está no `.gitignore`
- Backups não são versionados
- Cada desenvolvedor tem seu banco local

### **Desenvolvimento**
- Dados são mantidos entre reinicializações
- Ideal para testes contínuos
- Pode fazer backup antes de mudanças grandes

### **Produção**
- Para produção, considere migrar para PostgreSQL/MySQL
- H2 é apenas para desenvolvimento

## 🎯 **Benefícios**

1. **Persistência**: Dados não se perdem
2. **Testes**: Cadastros mantidos entre sessões
3. **Desenvolvimento**: Mais produtivo
4. **Backup**: Sistema de backup automático
5. **Controle**: Scripts para gerenciamento

## 🔄 **Migração Futura**

Quando for para produção, será fácil migrar para:
- PostgreSQL
- MySQL
- SQL Server

Apenas alterar as dependências e configurações no `pom.xml` e `application.properties`. 