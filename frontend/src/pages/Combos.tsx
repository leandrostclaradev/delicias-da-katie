import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Card from '../components/Card';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import ErrorBoundary from '../components/ErrorBoundary';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  valor: number;
  dataVencimento: string;
}

interface ItemCombo {
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
}

interface Combo {
  id: number;
  nome: string;
  descricao: string;
  itens: ItemCombo[];
  valorTotal: number;
  ativo: boolean;
}

const Combos: React.FC = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valorTotal: ''
  });
  const [itensCombo, setItensCombo] = useState<ItemCombo[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  const fetchData = async () => {
    try {
      console.log('=== FETCH DATA INICIADO ===');
      setLoading(true);
      setError(null);
      
      console.log('Fazendo requisições para API...');
      const [combosResponse, produtosResponse] = await Promise.all([
        api.get('/combos'),
        api.get('/produtos')
      ]);
      
      console.log('Resposta combos:', combosResponse);
      console.log('Resposta produtos:', produtosResponse);
      
      // Validar dados recebidos
      const combosData = Array.isArray(combosResponse.data) ? combosResponse.data : [];
      const produtosData = Array.isArray(produtosResponse.data) ? produtosResponse.data : [];
      
      console.log('Combos validados:', combosData);
      console.log('Produtos validados:', produtosData);
      
      // Log detalhado dos combos para debug
      combosData.forEach((combo, index) => {
        console.log(`Combo ${index + 1}:`, {
          id: combo.id,
          nome: combo.nome,
                  itens: combo.itens?.map((item: any) => ({
          produtoId: item.produto?.id,
          produtoNome: item.produto?.nome,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario
        }))
        });
      });
      
      setCombos(combosData);
      setProdutos(produtosData);
      
      console.log('=== FETCH DATA CONCLUÍDO ===');
    } catch (error) {
      console.error('ERRO no fetchData:', error);
      console.error('Detalhes do erro:', {
        message: (error as any).message,
        status: (error as any).response?.status,
        data: (error as any).response?.data
      });
      setError('Erro ao carregar dados. Verifique sua conexão e tente novamente.');
      // Definir arrays vazios para evitar erros de renderização
      setCombos([]);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNovoCombo = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      descricao: '',
      valorTotal: ''
    });
    setItensCombo([]);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (itensCombo.length === 0) {
      alert('Adicione pelo menos um produto ao combo');
      return;
    }

    try {
      const comboData = {
        nome: formData.nome,
        descricao: formData.descricao,
        valorTotal: parseFloat(formData.valorTotal),
        itens: itensCombo
          .filter(item => item.produto) // Filtrar itens com produto válido
          .map(item => ({
            produtoId: item.produto!.id,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario
          }))
      };

      if (editingId) {
        await api.put(`/combos/${editingId}`, comboData);
      } else {
        await api.post('/combos', comboData);
      }
      
      // Limpar formulário e fechar modal
      setFormData({
        nome: '',
        descricao: '',
        valorTotal: ''
      });
      setItensCombo([]);
      setEditingId(null);
      setShowModal(false);
      
      // Recarregar dados
      await fetchData();
    } catch (error) {
      console.error('Erro ao salvar combo:', error);
      alert('Erro ao salvar combo. Verifique os dados e tente novamente.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const adicionarProduto = (produto: Produto) => {
    try {
      console.log('=== ADICIONAR PRODUTO ===');
      console.log('Produto recebido:', produto);
      console.log('Estado atual itensCombo:', itensCombo);
      
      // Validar se o produto é válido
      if (!produto || !produto.id || !produto.nome) {
        console.error('Produto inválido:', produto);
        alert('Erro: Produto inválido');
        return;
      }
      
      // Validar se o produto tem valor válido
      if (typeof produto.valor !== 'number' || isNaN(produto.valor)) {
        console.error('Valor do produto inválido:', produto.valor);
        alert('Erro: Valor do produto inválido');
        return;
      }
      
      const itemExistente = itensCombo.find(item => item.produto?.id === produto.id);
      console.log('Item existente encontrado:', itemExistente);
      
      let novosItens: ItemCombo[];
      
      if (itemExistente) {
        console.log('Incrementando quantidade do item existente');
        novosItens = itensCombo.map(item => 
          item.produto?.id === produto.id 
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        console.log('Criando novo item no combo');
        novosItens = [...itensCombo, {
          produto,
          quantidade: 1,
          valorUnitario: produto.valor
        }];
      }
      
      console.log('Novos itens calculados:', novosItens);
      
      // Atualizar estado com os novos itens
      setItensCombo(novosItens);
      console.log('Estado itensCombo atualizado');
      
      // Recalcular valor total usando os novos itens
      const novoTotal = novosItens.reduce((sum, item) => sum + (item.valorUnitario * item.quantidade), 0);
      console.log('Novo total calculado:', novoTotal);
      
      setFormData(prev => ({ ...prev, valorTotal: novoTotal.toFixed(2) }));
      console.log('FormData atualizado com novo total');
      
      console.log('=== FIM ADICIONAR PRODUTO ===');
    } catch (error) {
      console.error('ERRO na função adicionarProduto:', error);
      alert('Erro ao adicionar produto. Verifique o console para mais detalhes.');
    }
  };

  const alterarQuantidade = (produtoId: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerProduto(produtoId);
      return;
    }

    const novosItens = itensCombo.map(item => 
      item.produto?.id === produtoId 
        ? { ...item, quantidade: novaQuantidade }
        : item
    );
    
    // Atualizar estado com os novos itens
    setItensCombo(novosItens);
    
    // Recalcular valor total usando os novos itens
    const novoTotal = novosItens.reduce((sum, item) => sum + (item.valorUnitario * item.quantidade), 0);
    setFormData(prev => ({ ...prev, valorTotal: novoTotal.toFixed(2) }));
  };

  const removerProduto = (produtoId: number) => {
    const novosItens = itensCombo.filter(item => item.produto?.id !== produtoId);
    
    // Atualizar estado com os novos itens
    setItensCombo(novosItens);
    
    // Recalcular valor total usando os novos itens
    const novoTotal = novosItens.reduce((sum, item) => sum + (item.valorUnitario * item.quantidade), 0);
    setFormData(prev => ({ ...prev, valorTotal: novoTotal.toFixed(2) }));
  };

  const handleEdit = (combo: Combo) => {
    setEditingId(combo.id);
    setFormData({
      nome: combo.nome,
      descricao: combo.descricao,
      valorTotal: combo.valorTotal.toFixed(2)
    });
    setItensCombo(combo.itens);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este combo?')) {
      try {
        await api.delete(`/combos/${id}`);
        fetchData();
      } catch (error) {
        console.error('Erro ao excluir combo:', error);
        alert('Erro ao excluir combo');
      }
    }
  };

  const toggleStatus = async (id: number, ativo: boolean) => {
    try {
      await api.put(`/combos/${id}/status`, { ativo: !ativo });
      fetchData();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status');
    }
  };

  const formatarMoeda = (valor: number) => {
    try {
      if (typeof valor !== 'number' || isNaN(valor)) {
        console.warn('Valor inválido para formatação:', valor);
        return 'R$ 0,00';
      }
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    } catch (error) {
      console.error('Erro ao formatar moeda:', error);
      return 'R$ 0,00';
    }
  };

  const combosFiltrados = combos.filter(combo => {
    const matchBusca = combo.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                      combo.descricao.toLowerCase().includes(termoBusca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || 
                       (filtroStatus === 'ativos' && combo.ativo) ||
                       (filtroStatus === 'inativos' && !combo.ativo);
    
    return matchBusca && matchStatus;
  });

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="flex min-h-screen bg-[#abd3f2]">
          <Sidebar />
          <main className="flex-1 flex flex-col py-10">
            <Topbar title="Combos" />
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#abd3f2] mx-auto mb-4"></div>
                <p className="text-[#3B82F6]">Carregando combos...</p>
              </div>
            </div>
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  console.log('Renderizando página Combos:', { combos, produtos, error, loading });

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-[#abd3f2]">
        <Sidebar />
        <main className="flex-1 flex flex-col py-10">
          <Topbar title="Combos" />
          
          {/* Header */}
          <div className="px-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-[#1E293B]">🎁 Combos</h1>
              <Button variant="gold" onClick={handleNovoCombo}>
                ➕ Novo Combo
              </Button>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar combos..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div className="flex gap-2">
                  {['todos', 'ativos', 'inativos'].map((status) => (
                    <Button
                      key={status}
                      variant={filtroStatus === status ? "gold" : "secondary"}
                      onClick={() => setFiltroStatus(status as any)}
                      className="text-xs px-3 py-1"
                    >
                      {status === 'todos' && '📋 Todos'}
                      {status === 'ativos' && '✅ Ativos'}
                      {status === 'inativos' && '❌ Inativos'}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Lista de Combos */}
          <div className="px-6">
            {error ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <Button variant="gold" onClick={fetchData}>
                  🔄 Tentar Novamente
                </Button>
              </div>
            ) : combosFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎁</div>
                <p className="text-[#3B82F6] text-lg mb-2">Nenhum combo encontrado</p>
                <Button variant="gold" onClick={handleNovoCombo}>
                  ➕ Criar Primeiro Combo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combosFiltrados.map((combo) => (
                  <Card key={combo.id} className="relative">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#1E293B] mb-1">{combo.nome}</h3>
                        <p className="text-sm text-gray-600 mb-2">{combo.descricao}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-[#abd3f2]">
                            {formatarMoeda(combo.valorTotal)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            combo.ativo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {combo.ativo ? '✅ Ativo' : '❌ Inativo'}
                          </span>
                        </div>
                      </div>
                      <div className="text-2xl">🎁</div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Produtos:</h4>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {combo.itens.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm text-gray-600">
                            <span>
                              {item.quantidade}x {item.produto?.nome || 'Produto não encontrado'}
                            </span>
                            <span>{formatarMoeda(item.valorUnitario * item.quantidade)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="gold"
                        onClick={() => handleEdit(combo)}
                        className="flex-1 text-xs py-2"
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => toggleStatus(combo.id, combo.ativo)}
                        className="text-xs px-3 py-2"
                      >
                        {combo.ativo ? '❌' : '✅'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDelete(combo.id)}
                        className="text-xs px-3 py-2"
                      >
                        🗑️
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Modal de Combo */}
        <Modal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          title={editingId ? "Editar Combo" : "Novo Combo"}
          customSize="w-[95vw] max-w-[1200px] h-[90vh]"
        >
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Combo</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorTotal}
                  onChange={(e) => handleInputChange('valorTotal', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                rows={2}
                placeholder="Descreva o combo..."
              />
            </div>

            {/* Seleção de Produtos */}
            <div className="flex-1 flex gap-6 min-h-0">
              {/* Lista de Produtos */}
              <div className="flex-1 border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-[#1E293B]">🍰 Produtos Disponíveis</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {produtos.map((produto) => (
                    <div key={produto.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-[#1E293B]">{produto.nome}</p>
                        <p className="text-sm text-gray-600">{formatarMoeda(produto.valor)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={(e) => {
                          e.preventDefault(); // Prevenir submit do formulário
                          console.log('Botão Adicionar clicado para produto:', produto);
                          try {
                            adicionarProduto(produto);
                          } catch (error) {
                            console.error('Erro ao clicar no botão Adicionar:', error);
                            alert('Erro ao adicionar produto');
                          }
                        }}
                        className="text-xs px-2 py-1"
                      >
                        ➕ Adicionar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itens do Combo */}
              <div className="w-96 border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-[#1E293B]">🎁 Itens do Combo</h3>
                
                {itensCombo.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎁</div>
                    <p>Nenhum produto adicionado</p>
                    <p className="text-sm">Clique em "Adicionar" para incluir produtos</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {itensCombo.map((item, index) => (
                      <div key={item.produto?.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-[#1E293B]">{item.produto?.nome || 'Produto não encontrado'}</p>
                          <p className="text-sm text-gray-600">{formatarMoeda(item.valorUnitario)} cada</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              alterarQuantidade(item.produto?.id || 0, item.quantidade - 1);
                            }}
                            className="text-xs px-2 py-1"
                          >
                            -
                          </Button>
                          <span className="text-lg font-bold text-[#1E293B] w-8 text-center">
                            {item.quantidade}
                          </span>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              alterarQuantidade(item.produto?.id || 0, item.quantidade + 1);
                            }}
                            className="text-xs px-2 py-1"
                          >
                            +
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              removerProduto(item.produto?.id || 0);
                            }}
                            className="text-xs px-2 py-1 text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" variant="gold" className="flex-1">
                {editingId ? '💾 Salvar Alterações' : '➕ Criar Combo'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                ❌ Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default Combos; 