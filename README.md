# 🎂 Delícias da Katie - Sistema de Confeitaria

Sistema completo de gestão para confeitaria e lanchonete com interface moderna e funcionalidades avançadas.

## 🚀 Tecnologias

### Backend
- **Java 8** - Linguagem principal (compatível com versões superiores)
- **Spring Boot 2.7.18** - Framework web estável
- **Spring Data JPA** - Persistência de dados
- **Spring Security 5** - Segurança
- **H2 Database** - Banco de dados em memória
- **Lombok** - Redução de boilerplate
- **Maven** - Gerenciamento de dependências

### Frontend
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Axios** - Cliente HTTP
- **React Router DOM** - Roteamento

## 📋 Pré-requisitos

- **Java 8+ (JDK)**
- **Node.js 18+**
- **npm** ou **yarn**

## 🛠️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd "Confeitaria FullStack"
```

### 2. Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
O backend estará disponível em: `http://localhost:8080`

**Acessos:**
- **API**: `http://localhost:8080/api/`
- **H2 Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (deixe em branco)

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
O frontend estará disponível em: `http://localhost:3000`

## 🌐 Teste em Rede Local

Para testar a aplicação de outros dispositivos na sua rede local:

### Opção 1: Script Automático (Recomendado)
```powershell
# Execute o script para configuração automática
.\start-network-test.ps1
```

### Opção 2: Configuração Manual

1. **Descubra seu IP local:**
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. **Configure o frontend:**
   ```bash
   cd frontend
   # Crie o arquivo .env.local com seu IP
   echo "VITE_API_IP=SEU_IP_AQUI" > .env.local
   ```

3. **Inicie os serviços:**
   ```bash
   # Backend (aceita conexões externas)
   cd backend
   ./mvnw spring-boot:run
   
   # Frontend (aceita conexões externas)
   cd frontend
   npm run dev
   ```

4. **Acesse de outros dispositivos:**
   - **Frontend**: `http://SEU_IP:3000`
   - **Backend**: `http://SEU_IP:8080`
   - **H2 Console**: `http://SEU_IP:8080/h2-console`

### Configurações de Rede
- **Backend**: Configurado para aceitar conexões em `0.0.0.0:8080`
- **Frontend**: Configurado para aceitar conexões em `0.0.0.0:3000`
- **CORS**: Configurado para permitir todas as origens em desenvolvimento

**Credenciais de Login:**
- **Email**: `admin@confeitaria.com`
- **Senha**: `123456`

## 🎯 Funcionalidades

### 📊 Dashboard
- Estatísticas em tempo real
- Cards visuais com métricas
- Barras de progresso
- Resumo geral da operação

### 🍰 Produtos
- Cadastro com cards visuais
- Categorização por valor
- Alertas de vencimento
- Busca e filtros avançados
- Edição e exclusão

### 💰 Vendas
- Sistema de carrinho
- Múltiplos produtos
- Cálculo automático
- Status visual (Pendente → Entregue)
- Filtros e busca

### 📦 Encomendas
- Gestão de pedidos
- Data de entrega
- Status tracking
- Histórico completo

### 👥 Usuários
- Gestão de funcionários
- Níveis de acesso
- Autenticação segura

### 🎉 Promoções
- Cadastro de ofertas
- Período de vigência
- Produtos em promoção

### 💳 Fluxo de Caixa
- Controle financeiro
- Entradas e saídas
- Relatórios

## 🎨 Design System

### Cores
- **Primária**: `#abd3f2` (Azul)
- **Secundária**: `#d8c7b5` (Bege)
- **Destaque**: `#e3d292` (Dourado)
- **Status**: Verde (Sucesso), Amarelo (Atenção), Vermelho (Erro)

### Componentes
- Cards responsivos
- Botões com variantes
- Modais interativos
- Loading states
- Feedback visual

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop** (3+ colunas)
- **Tablet** (2 colunas)
- **Mobile** (1 coluna)

## 🔧 Melhorias Implementadas

### Recursos Modernos Utilizados
- **Stream API** para processamento de dados
- **Optional** para tratamento seguro de nulos
- **Builder Pattern** com Lombok
- **Logging estruturado** com SLF4J
- **Tratamento de erros** robusto
- **CORS configurado** para frontend

### Spring Boot 2.7.18
- **Spring Security 5** configurado
- **JPA/Hibernate** otimizado
- **DevTools** para desenvolvimento
- **H2 Console** habilitado

## 🚀 Deploy

### Backend
```bash
cd backend
./mvnw clean package
java -jar target/delicias-da-katie-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvimento

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**🎂 Delícias da Katie** - Sistema profissional para confeitarias! 