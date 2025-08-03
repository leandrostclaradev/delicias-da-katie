Crie um projeto fullstack completo e toda sua estrutura com pastas e arquivos, dividido em duas pastas: `/backend` e `/frontend`.

---

## BACKEND (`/backend`) – Java 17 + Spring Boot

### Dependências:
- Spring Web
- Spring Data JPA
- Spring Security
- H2 Database
- Lombok

### Banco de dados:
- Use banco de dados H2 em memória para testes
- Configuração no `application.properties`:
  - `spring.h2.console.enabled=true`
  - `spring.datasource.url=jdbc:h2:mem:testdb`
  - `spring.jpa.hibernate.ddl-auto=update`

### Módulos:

#### 1. Usuário
- id, nome, email, senha (criptografada), cargo (ATENDENTE, COZINHA, ADMIN)
- Autenticação com JWT (login e controle de acesso por perfil)

#### 2. Produto
- id, nome, valor, dataVencimento, quantidade

#### 3. Combo
- id, nome, produtos (lista), valorTotal

#### 4. Venda
- id, cliente (obrigatório), itens (produto + quantidade), valorTotal, dataVenda, horaVenda

#### 5. Encomenda
- id, cliente, descricao, dataEntrega, valor

#### 6. FluxoCaixa
- id, data, hora, produto ou combo, quantidade, valorUnitario, valorTotal

#### 7. ItemPromocional
- id, produto, descricaoPromocional, dataInicio, dataFim

### Endpoints REST:
- `/api/auth/login`
- `/api/usuarios`
- `/api/produtos`
- `/api/combos`
- `/api/vendas`
- `/api/encomendas`
- `/api/fluxo-caixa`
- `/api/promocoes`

Implemente controladores simples com dados de exemplo (fake) e retorno JSON.

---

## FRONTEND (`/frontend`) – React + TypeScript + Vite

### Stack:
- Vite + React + TypeScript
- Axios para requisições HTTP
- React Router Dom para navegação
- Tailwind CSS (ou Material UI)
- useContext para autenticação simples (login/logout)

### Páginas e Rotas:
1. `/login` – Login de usuários
2. `/dashboard` – Página principal com menu lateral
3. `/produtos` – Listar, cadastrar e editar produtos
4. `/combos` – Gerenciar combos
5. `/vendas` – Realizar venda, registrar cliente, calcular total
6. `/fluxo-caixa` – Listar movimentações
7. `/encomendas` – Cadastrar e visualizar encomendas
8. `/promocoes` – Cadastrar e listar destaques promocionais
9. `/usuarios` – Cadastro e gerenciamento de funcionários

### Funcionalidades:
- Página de login salva token JWT
- Após login, rota protegida redireciona para dashboard
- Cada tela deve ter ao menos um formulário funcional simulando chamadas via Axios para a API
- Simule os dados das requisições com Axios interceptors ou mocks locais (`axios-mock-adapter` ou `msw`)
- O layout pode ser simples e responsivo, com componentes reutilizáveis (FormCard, TableList etc)

---

## Outras instruções:
- Estruture o front-end com pasta `src/pages`, `src/services/api.ts`, `src/components`
- Crie contextos para autenticação (`AuthContext`) e loading (`LoadingContext`)
- Exiba alertas simples em operações de sucesso ou erro (ex: `toast` ou `alert`)
- Implemente função de "Imprimir cupom" como botão que gera uma visualização imprimível da venda
- Utilize seed data (exemplo) no back-end para testes iniciais (ex: 2 produtos, 1 venda)

---

**Gere todos os arquivos necessários para rodar tanto o front quanto o back. O projeto deve estar pronto para ser testado com `npm run dev` no front e `mvn spring-boot:run` no back.**

### **Como resolver o problema de estilos e deixar o frontend bonito como o Nubank:**

---

## **1. Corrija a configuração do Tailwind CSS**

- **Verifique se o arquivo `tailwind.config.js`** está presente na raiz do frontend e contém:
  ```js
  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  ```

- **No arquivo `src/index.css`**, as primeiras linhas devem ser:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

- **No `package.json`**, garanta que as dependências estão instaladas:
  - `tailwindcss`
  - `postcss`
  - `autoprefixer`

---

## **2. Reinstale as dependências e rode o build**

No terminal, dentro da pasta `frontend`:
```sh
npm install
npm run dev
```

---

## **3. Se ainda não funcionar:**
- **Apague a pasta `node_modules` e o arquivo `package-lock.json`**, depois rode novamente:
  ```sh
  rm -rf node_modules package-lock.json
  npm install
  npm run dev
  ```

---

## **4. Layout Nubank-like:**
Depois que o Tailwind estiver funcionando, posso:
- Aplicar **gradientes**, **cartões arredondados**, **botões grandes e animados**, **tipografia marcante** e **efeitos de transição**.
- Usar **paleta Nubank** (ou a sua) com roxos, dourados, brancos e azuis.
- Deixar o layout mais “mobile first”, com animações e microinterações.

---

## **5. Se quiser um visual Nubank-like:**
- **Confirme que o Tailwind está funcionando** (os botões e cards devem ficar bonitos, não simples).
- Me envie se quer manter a paleta atual ou usar tons de roxo/dourado/branco.
- Posso então refatorar todos os componentes para um visual Nubank-like, com gradientes, sombras, animações e responsividade.

---

**Resumindo:**  
Seu problema atual é de CSS/Tailwind não aplicado.  
Corrija isso e me avise — aí sim posso transformar o layout para algo realmente bonito, elegante e moderno, como o Nubank!

Se quiser, posso te ajudar a depurar o Tailwind passo a passo. Quer tentar isso agora?
