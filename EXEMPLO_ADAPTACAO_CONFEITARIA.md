# 🎂 Exemplo Prático - Adaptação para Confeitaria

## 📋 **Exemplo: Adaptando o Layout**

### **Antes (Aulas de Música):**
```tsx
const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/alunos', label: 'Alunos', icon: '👥' },
  { path: '/pacotes', label: 'Pacotes', icon: '📦' },
  { path: '/pagamentos', label: 'Pagamentos', icon: '💰' },
  { path: '/aulas', label: 'Aulas', icon: '🎵' },
];

<h1 className="text-2xl font-bold text-blue-600">
  🎵 Sistema de Aulas de Música
</h1>
```

### **Depois (Confeitaria):**
```tsx
const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/clientes', label: 'Clientes', icon: '👥' },
  { path: '/produtos', label: 'Produtos', icon: '🍰' },
  { path: '/pedidos', label: 'Pedidos', icon: '📋' },
  { path: '/encomendas', label: 'Encomendas', icon: '🎂' },
];

<h1 className="text-2xl font-bold text-pink-600">
  🎂 Sistema da Confeitaria
</h1>
```

## 🍰 **Exemplo: Adaptando o Dashboard**

### **Antes (Aulas de Música):**
```tsx
const stats = {
  totalAlunos: 0,
  totalPacotes: 0,
  totalPagamentos: 0,
  totalAulas: 0,
  aulasAgendadas: 0,
  aulasConcluidas: 0,
  aulasCanceladas: 0,
  receitaTotal: 0
};

// Cards
<div className="p-2 bg-blue-100 rounded-lg">
  <span className="text-2xl">👥</span>
</div>
<p className="text-sm font-medium text-gray-600">Total de Alunos</p>
```

### **Depois (Confeitaria):**
```tsx
const stats = {
  totalClientes: 0,
  totalProdutos: 0,
  totalPedidos: 0,
  totalEncomendas: 0,
  encomendasPendentes: 0,
  encomendasProntas: 0,
  encomendasEntregues: 0,
  receitaTotal: 0
};

// Cards
<div className="p-2 bg-pink-100 rounded-lg">
  <span className="text-2xl">👥</span>
</div>
<p className="text-sm font-medium text-gray-600">Total de Clientes</p>
```

## 📋 **Exemplo: Adaptando Listagens**

### **Antes (AlunosList.tsx):**
```tsx
<h1 className="text-3xl font-bold text-gray-800">Alunos</h1>
<Link
  to="/alunos/novo"
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
>
  + Novo Aluno
</Link>

// Campos da tabela
<th>Nome</th>
<th>Email</th>
<th>Instrumento</th>
<th>Data Cadastro</th>
```

### **Depois (ClientesList.tsx):**
```tsx
<h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
<Link
  to="/clientes/novo"
  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
>
  + Novo Cliente
</Link>

// Campos da tabela
<th>Nome</th>
<th>Email</th>
<th>Telefone</th>
<th>Data Cadastro</th>
```

## 🎂 **Exemplo: Adaptando Formulários**

### **Antes (AlunoForm.tsx):**
```tsx
<h1 className="text-2xl font-bold text-gray-800 mb-6">
  {id ? 'Editar Aluno' : 'Novo Aluno'}
</h1>

<label htmlFor="instrumento" className="block text-sm font-medium text-gray-700 mb-2">
  Instrumento
</label>
<input
  type="text"
  id="instrumento"
  name="instrumento"
  placeholder="Ex: Violão, Piano, Guitarra"
/>

<button
  type="submit"
  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium"
>
  {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Cadastrar')}
</button>
```

### **Depois (ClienteForm.tsx):**
```tsx
<h1 className="text-2xl font-bold text-gray-800 mb-6">
  {id ? 'Editar Cliente' : 'Novo Cliente'}
</h1>

<label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
  Telefone
</label>
<input
  type="tel"
  id="telefone"
  name="telefone"
  placeholder="(11) 99999-9999"
/>

<button
  type="submit"
  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md font-medium"
>
  {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Cadastrar')}
</button>
```

## 🎨 **Exemplo: Adaptando Status**

### **Antes (Aulas):**
```tsx
const getStatusColor = (status) => {
  switch (status) {
    case 'AGENDADA': return 'bg-blue-100 text-blue-800';
    case 'CONCLUIDA': return 'bg-green-100 text-green-800';
    case 'CANCELADA': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(aula.status)}`}>
  {aula.status}
</span>
```

### **Depois (Encomendas):**
```tsx
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDENTE': return 'bg-blue-100 text-blue-800';
    case 'EM_PREPARO': return 'bg-yellow-100 text-yellow-800';
    case 'PRONTA': return 'bg-green-100 text-green-800';
    case 'ENTREGUE': return 'bg-emerald-100 text-emerald-800';
    case 'CANCELADA': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(encomenda.status)}`}>
  {encomenda.status}
</span>
```

## 🍰 **Exemplo: Adaptando Cards de Produtos**

### **Antes (PacotesList.tsx):**
```tsx
<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  <h3 className="text-xl font-semibold text-gray-800">{pacote.nome}</h3>
  
  <div className="space-y-2 text-sm text-gray-600">
    <div className="flex justify-between">
      <span>Aulas por semana:</span>
      <span className="font-medium">{pacote.aulasPorSemana}</span>
    </div>
    <div className="flex justify-between">
      <span>Valor por aula:</span>
      <span className="font-medium">R$ {pacote.valorPorAula?.toFixed(2)}</span>
    </div>
    <div className="flex justify-between">
      <span>Valor total:</span>
      <span className="font-medium text-green-600">R$ {pacote.valorTotal?.toFixed(2)}</span>
    </div>
  </div>
</div>
```

### **Depois (ProdutosList.tsx):**
```tsx
<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  <h3 className="text-xl font-semibold text-gray-800">{produto.nome}</h3>
  
  <div className="space-y-2 text-sm text-gray-600">
    <div className="flex justify-between">
      <span>Categoria:</span>
      <span className="font-medium">{produto.categoria}</span>
    </div>
    <div className="flex justify-between">
      <span>Preço:</span>
      <span className="font-medium">R$ {produto.preco?.toFixed(2)}</span>
    </div>
    <div className="flex justify-between">
      <span>Disponível:</span>
      <span className={`font-medium ${produto.disponivel ? 'text-green-600' : 'text-red-600'}`}>
        {produto.disponivel ? 'Sim' : 'Não'}
      </span>
    </div>
  </div>
</div>
```

## 🎂 **Exemplo: Adaptando Ações Especiais**

### **Antes (AulasList.tsx):**
```tsx
<button
  onClick={() => handleConcluir(aula.id)}
  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
>
  ✓ Concluir
</button>

<button
  onClick={() => handleCancelar(aula.id)}
  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
>
  ✕ Cancelar
</button>
```

### **Depois (EncomendasList.tsx):**
```tsx
<button
  onClick={() => handleIniciarPreparo(encomenda.id)}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
>
  🍳 Iniciar Preparo
</button>

<button
  onClick={() => handleMarcarPronta(encomenda.id)}
  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
>
  ✅ Pronta
</button>

<button
  onClick={() => handleEntregar(encomenda.id)}
  className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded text-sm"
>
  🚚 Entregar
</button>
```

## 🎨 **Exemplo: Adaptando Cores Globais**

### **Antes (Tailwind Config):**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

### **Depois (Tailwind Config):**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        confeitaria: {
          50: '#FFF0F5',
          100: '#FFE4E1',
          200: '#FFC0CB',
          300: '#FFB6C1',
          400: '#FF69B4',
          500: '#FF1493',
          600: '#DC143C',
          700: '#C71585',
        },
        bege: {
          50: '#FFF8DC',
          100: '#F5F5DC',
          200: '#F0E68C',
        },
        brown: {
          100: '#DEB887',
          200: '#D2B48C',
          300: '#BC8F8F',
        }
      }
    }
  }
}
```

---

**🎂 Com essas adaptações, você pode facilmente transformar o design das aulas de música em um sistema completo para sua confeitaria, mantendo a mesma estrutura e funcionalidade!** 