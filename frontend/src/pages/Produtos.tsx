import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Card from '../components/Card';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  valor: number;
  dataVencimento: string;
}

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosOriginais, setProdutosOriginais] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    dataVencimento: ''
  });
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroValor, setFiltroValor] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('nome');

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
      setProdutosOriginais(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Busca em tempo real quando o termo de busca muda
  useEffect(() => {
    if (termoBusca.trim() === '') {
      setProdutos(produtosOriginais);
    } else {
      const produtosFiltrados = produtosOriginais.filter(produto =>
        produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
      );
      setProdutos(produtosFiltrados);
    }
  }, [termoBusca, produtosOriginais]);

  const handleNovaVenda = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      valor: '',
      dataVencimento: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const produtoData = {
        nome: formData.nome,
        valor: parseFloat(formData.valor),
        dataVencimento: formData.dataVencimento
      };

      console.log('Enviando dados do produto:', produtoData);

      let response;
      if (editingId) {
        // Edição - usar PUT
        response = await api.put(`/produtos/${editingId}`, produtoData);
      } else {
        // Criação - usar POST
        response = await api.post('/produtos', produtoData);
      }
      
      if (response.data) {
        setFormData({
          nome: '',
          valor: '',
          dataVencimento: ''
        });
        setEditingId(null);
        setShowModal(false);
        fetchProdutos();
      }
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao salvar produto';
      alert(`Erro: ${errorMessage}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/produtos/${id}`);
        fetchProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
      }
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditingId(produto.id);
    setFormData({
      nome: produto.nome,
      valor: produto.valor.toString(),
      dataVencimento: produto.dataVencimento
    });
    setShowModal(true);
  };

  const handleBuscaKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // A busca já acontece em tempo real, então não precisa fazer nada aqui
    }
  };

  const handleLimparBusca = () => {
    setTermoBusca('');
  };

  const produtosFiltrados = produtos.filter(produto => {
    // Filtro por valor
    if (filtroValor === 'baixo' && produto.valor >= 10) return false;
    if (filtroValor === 'medio' && (produto.valor < 10 || produto.valor >= 50)) return false;
    if (filtroValor === 'alto' && produto.valor < 50) return false;
    return true;
  }).sort((a, b) => {
    // Ordenação
    switch (ordenacao) {
      case 'nome':
        return a.nome.localeCompare(b.nome);
      case 'valor':
        return a.valor - b.valor;
      case 'vencimento':
        return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
      default:
        return 0;
    }
  });

  const getValorCategoria = (valor: number) => {
    if (valor < 10) return { label: 'Baixo', color: 'bg-green-100 text-green-800' };
    if (valor < 50) return { label: 'Médio', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Alto', color: 'bg-red-100 text-red-800' };
  };

  const isVencido = (dataVencimento: string) => {
    if (!dataVencimento || dataVencimento === '') return false;
    return new Date(dataVencimento) < new Date();
  };

  const diasParaVencimento = (dataVencimento: string) => {
    if (!dataVencimento || dataVencimento === '') return null;
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const temDataVencimento = (dataVencimento: string) => {
    return dataVencimento && dataVencimento !== '';
  };

  const ProdutoCard = ({ produto }: { produto: Produto }) => {
    const categoria = getValorCategoria(produto.valor);
    const vencido = isVencido(produto.dataVencimento);
    const diasVencimento = diasParaVencimento(produto.dataVencimento);
    const temVencimento = temDataVencimento(produto.dataVencimento);

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{produto.nome}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-[#abd3f2]">R$ {produto.valor.toFixed(2)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoria.color}`}>
                {categoria.label}
              </span>
            </div>
          </div>
          <div className="text-2xl ml-2">🍰</div>
        </div>

        <div className="space-y-2 mb-3">
          {temVencimento ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vencimento:</span>
                <span className={`font-medium ${vencido ? 'text-red-600' : 'text-gray-900'}`}>
                  {new Date(produto.dataVencimento).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              {vencido ? (
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <p className="text-red-600 text-xs font-medium">⚠️ Vencido</p>
                </div>
              ) : diasVencimento && diasVencimento <= 7 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-yellow-700 text-xs font-medium">
                    ⚠️ Vence em {diasVencimento} dia{diasVencimento !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : diasVencimento ? (
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <p className="text-green-700 text-xs font-medium">
                    ✅ Válido por {diasVencimento} dia{diasVencimento !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded p-2">
              <p className="text-gray-600 text-xs font-medium">
                📅 Sem data de validade (produto fresco)
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="gold"
            onClick={() => handleEdit(produto)}
            className="flex-1 text-xs py-2"
          >
            ✏️ Editar
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleDelete(produto.id)}
            className="text-xs px-3 py-2"
          >
            🗑️
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#abd3f2]">
      <Sidebar />
      <main className="flex-1 flex flex-col py-10">
        <Topbar title="Produtos" />
        
        {/* Filtros e Busca */}
        <div className="px-6 mb-6">
          <Card className="mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Busca */}
              <div className="flex-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Buscar produtos... (digite para filtrar)"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    onKeyPress={handleBuscaKeyPress}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                  {termoBusca && (
                    <Button variant="secondary" onClick={handleLimparBusca}>
                      Limpar
                    </Button>
                  )}
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-2">
                <select
                  value={filtroValor}
                  onChange={(e) => setFiltroValor(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="todos">Todos os valores</option>
                  <option value="baixo">Até R$ 10,00</option>
                  <option value="medio">R$ 10,00 - R$ 50,00</option>
                  <option value="alto">Acima de R$ 50,00</option>
                </select>

                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="nome">Ordenar por Nome</option>
                  <option value="valor">Ordenar por Valor</option>
                  <option value="vencimento">Ordenar por Vencimento</option>
                </select>
              </div>
            </div>
          </Card>

          <Button variant="gold" onClick={handleNovaVenda} className="mb-4">
            + Novo Produto
          </Button>
        </div>

        {/* Lista de Produtos */}
        <div className="px-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#abd3f2] mx-auto mb-4"></div>
              <p className="text-[#3B82F6]">Carregando produtos...</p>
            </div>
          ) : produtosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🍰</div>
              <p className="text-[#3B82F6] text-lg mb-2">
                {termoBusca ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
              </p>
              {termoBusca && (
                <Button variant="secondary" onClick={handleLimparBusca}>
                  Limpar busca
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {produtosFiltrados.map((produto) => (
                <ProdutoCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Produto */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? "Editar Produto" : "Novo Produto"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nome do Produto"
            type="text"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            required
          />
          <FormInput
            label="Valor"
            type="number"
            step="0.01"
            min="0"
            value={formData.valor}
            onChange={(e) => handleInputChange('valor', e.target.value)}
            required
          />
          <FormInput
            label="Data de Vencimento"
            type="date"
            value={formData.dataVencimento}
            onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="gold" className="flex-1">
              {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Produtos; 