import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Card from '../components/Card';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import PedidoCard from '../components/PedidoCard';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  valor: number;
  dataVencimento: string;
}

interface ItemEncomenda {
  id: number;
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface Encomenda {
  id: number;
  cliente: string;
  descricao: string;
  dataEntrega: string;
  valor: number;
  status: string;
  itens: ItemEncomenda[];
}

const Encomendas: React.FC = () => {
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [carrinho, setCarrinho] = useState<ItemEncomenda[]>([]);
  const [formData, setFormData] = useState({
    cliente: '',
    descricao: '',
    dataEntrega: ''
  });
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState('1');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [termoBusca, setTermoBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'ativos' | 'historico'>('ativos');

  const validarDadosEncomendas = (dados: any[]): Encomenda[] => {
    return dados.map((encomenda: any) => ({
      ...encomenda,
      itens: (encomenda.itens || []).map((item: any) => {
        const quantidade = item.quantidade || 0;
        const valorUnitario = item.valorUnitario || 0;
        const valorTotalCalculado = quantidade * valorUnitario;
        
        return {
          ...item,
          id: item.id || Date.now(), // Preservar ID ou gerar novo
          quantidade,
          valorUnitario,
          valorTotal: item.valorTotal || valorTotalCalculado,
          produto: {
            ...item.produto,
            nome: item.produto?.nome || 'Produto não encontrado',
            valor: item.produto?.valor || 0
          }
        };
      })
    }));
  };

  const fetchEncomendas = async () => {
    try {
      const response = await api.get('/encomendas');
      const encomendasValidadas = validarDadosEncomendas(response.data);
      setEncomendas(encomendasValidadas);
    } catch (error) {
      console.error('Erro ao buscar encomendas:', error);
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEncomendas(), fetchProdutos()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleNovaEncomenda = () => {
    setCarrinho([]);
    setFormData({
      cliente: '',
      descricao: '',
      dataEntrega: ''
    });
    setShowModal(true);
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };



  const handleAddToCart = () => {
    if (selectedProduct && quantidade) {
      const qty = parseInt(quantidade);
      const valorTotal = selectedProduct.valor * qty;
      
      const newItem: ItemEncomenda = {
        id: Date.now(), // Gerar ID único
        produto: selectedProduct,
        quantidade: qty,
        valorUnitario: selectedProduct.valor,
        valorTotal: valorTotal
      };

      setCarrinho(prev => [...prev, newItem]);
      setSelectedProduct(null);
      setQuantidade('1');
      setShowAddProductModal(false);
    }
  };

  const removeFromCart = (index: number) => {
    setCarrinho(prev => prev.filter((_, i) => i !== index));
  };

  const calcularValorTotal = () => {
    return carrinho.reduce((total, item) => total + item.valorTotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (carrinho.length === 0) {
      alert('Adicione pelo menos um produto à encomenda');
      return;
    }

    try {
      const encomendaData = {
        cliente: formData.cliente,
        descricao: formData.descricao,
        dataEntrega: formData.dataEntrega,
        valor: calcularValorTotal(),
        itens: carrinho.map(item => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario
        }))
      };

      console.log('Enviando dados da encomenda:', encomendaData);

      const response = await api.post('/encomendas', encomendaData);
      
      if (response.data) {
        // Limpar formulário
        setFormData({
          cliente: '',
          descricao: '',
          dataEntrega: ''
        });
        setCarrinho([]);
        setShowModal(false);
        
        // Recarregar lista
        fetchEncomendas();
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar encomenda:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao criar encomenda';
      alert(`Erro: ${errorMessage}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusChange = async (id: number, novoStatus: string) => {
    try {
      await api.put(`/encomendas/${id}/status`, { status: novoStatus });
      fetchEncomendas(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleBusca = async () => {
    if (termoBusca.trim()) {
      try {
        const response = await api.get(`/encomendas/buscar?termo=${termoBusca}`);
        setEncomendas(response.data);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    } else {
      fetchEncomendas();
    }
  };

  const handleFiltroStatus = async (status: string) => {
    setFiltroStatus(status);
    if (status === 'TODOS') {
      fetchEncomendas();
    } else {
      try {
        const response = await api.get(`/encomendas/status/${status.toLowerCase()}`);
        setEncomendas(response.data);
      } catch (error) {
        console.error('Erro ao filtrar por status:', error);
      }
    }
  };

  const encomendasFiltradas = encomendas.filter(encomenda => {
    const isAtivo = !['ENTREGUE', 'CANCELADO'].includes(encomenda.status);
    return abaAtiva === 'ativos' ? isAtivo : !isAtivo;
  });

  return (
    <div className="flex min-h-screen bg-[#abd3f2]">
      <Sidebar />
      <main className="flex-1 flex flex-col py-10">
        <Topbar title="Encomendas" />
        
        {/* Filtros e Busca */}
        <div className="px-6 mb-6">
          <Card className="mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Busca */}
              <div className="flex-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Buscar por cliente ou ID..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                  <Button variant="gold" onClick={handleBusca}>
                    🔍 Buscar
                  </Button>
                </div>
              </div>

              {/* Filtro por Status */}
              <div className="flex gap-2">
                {['TODOS', 'PENDENTE', 'CONFIRMADO', 'PRONTO', 'ENTREGUE', 'CANCELADO'].map((status) => (
                  <Button
                    key={status}
                    variant={filtroStatus === status ? "gold" : "secondary"}
                    onClick={() => handleFiltroStatus(status)}
                    className="text-xs px-3 py-1"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Abas */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={abaAtiva === 'ativos' ? "gold" : "secondary"}
              onClick={() => setAbaAtiva('ativos')}
            >
              📋 Ativos ({encomendas.filter(e => !['ENTREGUE', 'CANCELADO'].includes(e.status)).length})
            </Button>
            <Button
              variant={abaAtiva === 'historico' ? "gold" : "secondary"}
              onClick={() => setAbaAtiva('historico')}
            >
              📚 Histórico ({encomendas.filter(e => ['ENTREGUE', 'CANCELADO'].includes(e.status)).length})
            </Button>
          </div>

          <Button variant="gold" onClick={handleNovaEncomenda} className="mb-4">
            + Nova Encomenda
          </Button>
        </div>

        {/* Lista de Encomendas */}
        <div className="px-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-[#3B82F6]">Carregando encomendas...</p>
            </div>
          ) : encomendasFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#3B82F6]">
                {abaAtiva === 'ativos' ? 'Nenhuma encomenda ativa' : 'Nenhuma encomenda no histórico'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {encomendasFiltradas.map((encomenda) => (
                <PedidoCard
                  key={encomenda.id}
                  id={encomenda.id}
                  cliente={encomenda.cliente}
                  descricao={encomenda.descricao}
                  data={encomenda.dataEntrega}
                  valor={encomenda.valor}
                  status={encomenda.status}
                  itens={encomenda.itens}
                  onStatusChange={handleStatusChange}
                  tipo="encomenda"
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Nova Encomenda */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Encomenda">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Cliente"
            type="text"
            value={formData.cliente}
            onChange={(e) => handleInputChange('cliente', e.target.value)}
            required
          />
          <FormInput
            label="Descrição da Encomenda"
            type="text"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            required
          />
          <FormInput
            label="Data de Entrega"
            type="date"
            value={formData.dataEntrega}
            onChange={(e) => handleInputChange('dataEntrega', e.target.value)}
            required
          />

          {/* Carrinho de Produtos */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-[#1E293B]">Produtos da Encomenda</h3>
              <Button 
                type="button" 
                variant="gold" 
                onClick={handleAddProduct}
                className="text-sm px-3 py-1"
              >
                + Adicionar Produto
              </Button>
            </div>

            {carrinho.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum produto adicionado</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {carrinho.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.produto.nome}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantidade}x R$ {item.valorUnitario.toFixed(2)} = R$ {item.valorTotal.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {carrinho.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {calcularValorTotal().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="gold" className="flex-1">
              Finalizar Encomenda
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Adicionar Produto */}
      <Modal isOpen={showAddProductModal} onClose={() => setShowAddProductModal(false)} title="Adicionar Produto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2">
              Selecionar Produto
            </label>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const produto = produtos.find(p => p.id === parseInt(e.target.value));
                setSelectedProduct(produto || null);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              required
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - R$ {produto.valor.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="Quantidade"
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />

          {selectedProduct && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">
                <strong>Produto:</strong> {selectedProduct.nome}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Valor Unitário:</strong> R$ {selectedProduct.valor.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Valor Total:</strong> R$ {(selectedProduct.valor * parseInt(quantidade || '0')).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="gold" 
              onClick={handleAddToCart}
              disabled={!selectedProduct || !quantidade}
              className="flex-1"
            >
              Adicionar à Encomenda
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowAddProductModal(false)} 
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Encomendas; 