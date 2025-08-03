# 🎂 Design System - Confeitaria Fullstack

## 🎨 **Paleta de Cores para Confeitaria**

### **Cores Principais:**
- **Rosa Suave:** `#FFB6C1` (Light Pink)
- **Rosa Escuro:** `#FF69B4` (Hot Pink)
- **Bege Claro:** `#FFF8DC` (Cornsilk)
- **Marrom Claro:** `#DEB887` (Burlywood)
- **Branco:** `#FFFFFF` (White)
- **Cinza Claro:** `#F5F5F5` (Light Gray)

### **Cores Secundárias:**
- **Dourado:** `#FFD700` (Gold) - Para destaques
- **Verde Suave:** `#98FB98` (Pale Green) - Para status positivos
- **Vermelho Suave:** `#FFB6C1` (Light Pink) - Para status negativos

## 🏗️ **Estrutura de Componentes**

### **1. Layout Principal (Layout.tsx)**
```tsx
// Adaptação do Layout para Confeitaria
const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/clientes', label: 'Clientes', icon: '👥' },
  { path: '/produtos', label: 'Produtos', icon: '🍰' },
  { path: '/pedidos', label: 'Pedidos', icon: '📋' },
  { path: '/encomendas', label: 'Encomendas', icon: '🎂' },
];

// Cores adaptadas
className="text-2xl font-bold text-pink-600" // Título
className="bg-pink-100 text-pink-700 border-r-2 border-pink-500" // Menu ativo
```

### **2. Dashboard (Dashboard.tsx)**
```tsx
// Cards de estatísticas com cores da confeitaria
const statsCards = [
  {
    title: "Total de Clientes",
    value: totalClientes,
    icon: "👥",
    color: "pink",
    link: "/clientes"
  },
  {
    title: "Produtos Ativos",
    value: totalProdutos,
    icon: "🍰",
    color: "rose",
    link: "/produtos"
  },
  {
    title: "Receita Total",
    value: formatCurrency(receitaTotal),
    icon: "💰",
    color: "amber",
    link: "/pedidos"
  },
  {
    title: "Encomendas Pendentes",
    value: encomendasPendentes,
    icon: "🎂",
    color: "purple",
    link: "/encomendas"
  }
];
```

### **3. Listagens (List Components)**
```tsx
// Estrutura padrão para listagens
<div className="container mx-auto px-4 py-8">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-gray-800">Título da Seção</h1>
    <Link
      to="/novo-item"
      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
      <span>+</span>
      Novo Item
    </Link>
  </div>
  
  {/* Grid ou Tabela */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Cards dos itens */}
  </div>
</div>
```

### **4. Formulários (Form Components)**
```tsx
// Estrutura padrão para formulários
<div className="container mx-auto px-4 py-8 max-w-2xl">
  <div className="bg-white rounded-lg shadow-md p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">
      {id ? 'Editar Item' : 'Novo Item'}
    </h1>
    
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campos do formulário */}
      
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md font-medium"
        >
          {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Cadastrar')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/voltar')}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</div>
```

## 🎯 **Adaptações Específicas para Confeitaria**

### **Entidades Sugeridas:**
1. **Clientes** (substitui Alunos)
2. **Produtos** (substitui Pacotes) - Bolos, doces, etc.
3. **Pedidos** (substitui Pagamentos)
4. **Encomendas** (substitui Aulas) - Pedidos específicos com data de entrega

### **Ícones Temáticos:**
- 🏠 Dashboard
- 👥 Clientes
- 🍰 Produtos
- 📋 Pedidos
- 🎂 Encomendas
- 🧁 Doces
- 🍪 Biscoitos
- 🎨 Decorações
- 📅 Calendário
- 💰 Financeiro

### **Status para Encomendas:**
- **PENDENTE** (azul) - Encomenda recebida
- **EM_PREPARO** (amarelo) - Sendo preparada
- **PRONTA** (verde) - Pronta para entrega
- **ENTREGUE** (verde escuro) - Entregue
- **CANCELADA** (vermelho) - Cancelada

## 🎨 **Classes CSS Personalizadas**

### **Cores Principais:**
```css
/* Rosa Suave */
.bg-pink-50 { background-color: #FFF0F5; }
.bg-pink-100 { background-color: #FFE4E1; }
.bg-pink-500 { background-color: #FFB6C1; }
.bg-pink-600 { background-color: #FF69B4; }

/* Bege */
.bg-beige-50 { background-color: #FFF8DC; }
.bg-beige-100 { background-color: #F5F5DC; }

/* Marrom */
.bg-brown-100 { background-color: #DEB887; }
.bg-brown-200 { background-color: #D2B48C; }
```

### **Componentes Reutilizáveis:**
```tsx
// Card de Estatística
const StatCard = ({ title, value, icon, color, link }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div className="flex items-center">
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
    <div className="mt-4">
      <Link
        to={link}
        className={`text-${color}-600 hover:text-${color}-700 text-sm font-medium`}
      >
        Ver detalhes →
      </Link>
    </div>
  </div>
);

// Botão de Ação
const ActionButton = ({ to, icon, label, color = "pink" }) => (
  <Link
    to={to}
    className={`flex items-center p-3 bg-${color}-50 hover:bg-${color}-100 rounded-lg transition-colors`}
  >
    <span className={`text-${color}-600 mr-3`}>{icon}</span>
    <span className={`text-${color}-700 font-medium`}>{label}</span>
  </Link>
);
```

## 📱 **Responsividade**

### **Breakpoints:**
- **Mobile:** `grid-cols-1`
- **Tablet:** `md:grid-cols-2`
- **Desktop:** `lg:grid-cols-3` ou `lg:grid-cols-4`

### **Layout Adaptativo:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {/* Cards responsivos */}
</div>
```

## 🎂 **Exemplo de Implementação**

### **Dashboard da Confeitaria:**
```tsx
const ConfeitariaDashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProdutos: 0,
    totalPedidos: 0,
    encomendasPendentes: 0,
    receitaTotal: 0
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard da Confeitaria</h1>
        <p className="mt-2 text-gray-600">
          Visão geral da sua confeitaria
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Clientes"
          value={stats.totalClientes}
          icon="👥"
          color="pink"
          link="/clientes"
        />
        <StatCard
          title="Produtos Ativos"
          value={stats.totalProdutos}
          icon="🍰"
          color="rose"
          link="/produtos"
        />
        <StatCard
          title="Receita Total"
          value={formatCurrency(stats.receitaTotal)}
          icon="💰"
          color="amber"
          link="/pedidos"
        />
        <StatCard
          title="Encomendas Pendentes"
          value={stats.encomendasPendentes}
          icon="🎂"
          color="purple"
          link="/encomendas"
        />
      </div>
    </div>
  );
};
```

---

**🎂 Este design system pode ser facilmente adaptado para sua confeitaria, mantendo a mesma estrutura e funcionalidade, mas com a temática e cores apropriadas!** 