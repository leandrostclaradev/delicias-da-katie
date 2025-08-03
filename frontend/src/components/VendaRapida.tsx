import React, { useState, useEffect } from 'react';
import Button from './Button';
import Modal from './Modal';
import FormInput from './FormInput';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  valor: number;
  dataVencimento: string;
}

interface ItemCombo {
  id: number;
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

interface ItemVenda {
  id: number;
  nome: string;
  tipo: 'produto' | 'combo';
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  produto?: Produto;
  combo?: Combo;
}

interface VendaRapidaProps {
  isOpen: boolean;
  onClose: () => void;
  onVendaCriada: () => void;
}

const VendaRapida: React.FC<VendaRapidaProps> = ({ isOpen, onClose, onVendaCriada }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [carrinho, setCarrinho] = useState<ItemVenda[]>([]);
  const [cliente, setCliente] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'combos'>('produtos');

  useEffect(() => {
    if (isOpen) {
      fetchDados();
    }
  }, [isOpen]);

  const fetchDados = async () => {
    try {
      const [produtosResponse, combosResponse] = await Promise.all([
        api.get('/produtos'),
        api.get('/combos')
      ]);
      
      setProdutos(produtosResponse.data);
      
      // Filtrar apenas combos ativos e validar dados
      const combosAtivos = combosResponse.data
        .filter((combo: Combo) => combo.ativo)
        .map((combo: Combo) => {
          // Garantir que os itens tenham produtos válidos
          const itensValidos = (combo.itens || []).filter((item: ItemCombo) => 
            item.produto && item.produto.id && item.produto.nome
          );
          
          return {
            ...combo,
            itens: itensValidos
          };
        });
      
      console.log('Combos carregados:', combosAtivos.length);
      setCombos(combosAtivos);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const adicionarAoCarrinho = (produto: Produto) => {
    const itemExistente = carrinho.find(item => item.tipo === 'produto' && item.produto?.id === produto.id);
    
    if (itemExistente) {
      setCarrinho(prev => prev.map(item => 
        item.tipo === 'produto' && item.produto?.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1, valorTotal: (item.quantidade + 1) * item.valorUnitario }
          : item
      ));
    } else {
      const novoItem: ItemVenda = {
        id: produto.id,
        nome: produto.nome,
        tipo: 'produto',
        quantidade: 1,
        valorUnitario: produto.valor,
        valorTotal: produto.valor,
        produto: produto
      };
      setCarrinho(prev => [...prev, novoItem]);
    }
  };

  const adicionarComboAoCarrinho = (combo: Combo) => {
    console.log('Adicionando combo:', combo.nome, 'Valor total:', combo.valorTotal);
    
    if (!combo.itens || combo.itens.length === 0) {
      alert('Este combo não possui produtos. Verifique a configuração.');
      return;
    }
    
    // Filtrar apenas itens com produtos válidos
    const itensValidos = combo.itens.filter(itemCombo => 
      itemCombo.produto && itemCombo.produto.id && itemCombo.produto.nome
    );
    
    if (itensValidos.length === 0) {
      alert('Este combo não possui produtos válidos. Verifique a configuração.');
      return;
    }
    
    const itemExistente = carrinho.find(item => item.tipo === 'combo' && item.combo?.id === combo.id);
    
    if (itemExistente) {
      setCarrinho(prev => prev.map(item => 
        item.tipo === 'combo' && item.combo?.id === combo.id
          ? { ...item, quantidade: item.quantidade + 1, valorTotal: (item.quantidade + 1) * item.valorUnitario }
          : item
      ));
    } else {
      const novoItem: ItemVenda = {
        id: combo.id,
        nome: combo.nome,
        tipo: 'combo',
        quantidade: 1,
        valorUnitario: combo.valorTotal, // Usar o valor total do combo como valor unitário
        valorTotal: combo.valorTotal,    // Valor total inicial é igual ao valor do combo
        combo: combo
      };
      setCarrinho(prev => [...prev, novoItem]);
    }
  };

  const removerDoCarrinho = (itemId: number, tipo: 'produto' | 'combo') => {
    setCarrinho(prev => prev.filter(item => !(item.id === itemId && item.tipo === tipo)));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const alterarQuantidade = (itemId: number, tipo: 'produto' | 'combo', novaQuantidade: number) => {
    // Garantir que a quantidade seja pelo menos 1
    if (novaQuantidade < 1) {
      novaQuantidade = 1;
    }

    setCarrinho(prev => prev.map(item => 
      item.id === itemId && item.tipo === tipo
        ? { ...item, quantidade: novaQuantidade, valorTotal: novaQuantidade * item.valorUnitario }
        : item
    ));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.valorTotal, 0);
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const combosFiltrados = combos.filter(combo =>
    combo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    combo.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      alert('Adicione pelo menos um produto à venda');
      return;
    }

    if (!cliente.trim()) {
      alert('Informe o nome do cliente');
      return;
    }

    setLoading(true);
    try {
      console.log('Iniciando finalização da venda...');
      console.log('Carrinho:', carrinho);
      console.log('Cliente:', cliente);

      const vendaData = {
        cliente: cliente.trim(),
        valorTotal: calcularTotal(),
        data: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
        itens: carrinho.map(item => ({
          produtoId: item.produto?.id,
          comboId: item.combo?.id,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario
        }))
      };

      console.log('Dados da venda a serem enviados:', vendaData);

      const response = await api.post('/vendas', vendaData);
      console.log('Resposta do servidor:', response.data);
      
      // Limpar formulário ANTES de fechar o modal
      setCarrinho([]);
      setCliente('');
      setSearchTerm('');
      
      console.log('Formulário limpo, chamando onVendaCriada...');
      
      // Fechar modal ANTES de chamar onVendaCriada
      console.log('Fechando modal...');
      onClose();
      
      // Aguardar um pouco antes de chamar onVendaCriada
      setTimeout(() => {
        console.log('Chamando onVendaCriada...');
        onVendaCriada();
        console.log('Venda finalizada com sucesso!');
      }, 100);
      
    } catch (error: any) {
      console.error('Erro detalhado ao finalizar venda:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      
      let errorMessage = 'Erro ao finalizar venda. Tente novamente.';
      
      if (error.response?.data?.error) {
        errorMessage = `Erro: ${error.response.data.error}`;
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      alert(errorMessage);
      
      // Não fechar o modal em caso de erro para o usuário poder corrigir
      console.log('Modal mantido aberto devido ao erro');
    } finally {
      setLoading(false);
      console.log('Loading finalizado');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Venda Rápida"
      customSize="w-[95vw] max-w-[1400px] h-[90vh]"
    >
      <div className="flex flex-col h-full">
        {/* Cliente */}
        <div className="mb-4">
          <FormInput
            label="Nome do Cliente"
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Digite o nome do cliente"
            required
          />
        </div>

        <div className="flex flex-1 gap-6 min-h-0">
          {/* Seleção de Produtos/Combos */}
          <div className="flex-1 border rounded-lg p-4">
            {/* Abas */}
            <div className="flex mb-4 border-b border-gray-200">
              <button
                onClick={() => setAbaAtiva('produtos')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  abaAtiva === 'produtos'
                    ? 'border-[#abd3f2] text-[#abd3f2]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🍰 Produtos ({produtosFiltrados.length})
              </button>
              <button
                onClick={() => setAbaAtiva('combos')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  abaAtiva === 'combos'
                    ? 'border-[#abd3f2] text-[#abd3f2]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🎁 Combos ({combosFiltrados.length})
              </button>
            </div>

            {/* Campo de Busca */}
            <div className="mb-3">
              <input
                type="text"
                placeholder={`🔍 Buscar ${abaAtiva === 'produtos' ? 'produtos' : 'combos'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-lg"
              />
            </div>
            
            {/* Conteúdo das Abas */}
            <div className="max-h-[500px] overflow-y-auto">
              {abaAtiva === 'produtos' ? (
                /* Aba de Produtos */
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {produtosFiltrados.map((produto) => (
                    <div
                      key={produto.id}
                      className="flex flex-col justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200 hover:border-[#abd3f2] transition-all duration-200"
                      onClick={() => adicionarAoCarrinho(produto)}
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{produto.nome}</h4>
                        <p className="text-lg font-bold text-[#abd3f2]">{formatarMoeda(produto.valor)}</p>
                      </div>
                      <Button variant="gold" className="text-xs px-3 py-2 mt-2 w-full">
                        + Adicionar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Aba de Combos */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {combosFiltrados.map((combo) => {
                    // Contar itens válidos
                    const itensValidos = (combo.itens || []).filter(item => 
                      item.produto && item.produto.id && item.produto.nome
                    );
                    
                    return (
                      <div
                        key={combo.id}
                        className={`flex flex-col justify-between p-4 rounded-lg border transition-all duration-200 ${
                          itensValidos.length > 0 
                            ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer border-gray-200 hover:border-[#abd3f2]' 
                            : 'bg-red-50 border-red-200 cursor-not-allowed'
                        }`}
                        onClick={() => itensValidos.length > 0 && adicionarComboAoCarrinho(combo)}
                      >
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm mb-1">{combo.nome}</h4>
                          <p className="text-xs text-gray-600 mb-2">{combo.descricao}</p>
                          
                          {itensValidos.length > 0 ? (
                            <div className="text-xs text-gray-500 mb-2">
                              {itensValidos.map((item, index) => (
                                <span key={index}>
                                  {item.quantidade}x {item.produto?.nome}
                                  {index < itensValidos.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-red-500 mb-2">
                              ⚠️ Nenhum produto válido encontrado
                            </div>
                          )}
                          
                          <p className="text-lg font-bold text-[#abd3f2]">{formatarMoeda(combo.valorTotal)}</p>
                        </div>
                        
                        <Button 
                          variant="gold" 
                          className={`text-xs px-3 py-2 mt-2 w-full ${
                            itensValidos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={itensValidos.length === 0}
                        >
                          {itensValidos.length > 0 ? '+ Adicionar Combo' : 'Combo Inválido'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Carrinho */}
          <div className="w-96 border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#1E293B]">🛒 Carrinho</h3>
              {carrinho.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={limparCarrinho}
                  className="text-xs px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  🗑️ Limpar
                </Button>
              )}
            </div>
            
            {carrinho.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 text-lg">Nenhum produto adicionado</p>
                <p className="text-gray-400 text-sm mt-2">Clique nos produtos para adicionar</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                  {carrinho.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.nome}</h4>
                        <p className="text-xs text-gray-600">R$ {item.valorUnitario.toFixed(2)} cada</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => alterarQuantidade(item.id, item.tipo, item.quantidade - 1)}
                          className="text-xs px-2 py-1"
                        >
                          -
                        </Button>
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={item.quantidade}
                          onChange={(e) => {
                            const valor = e.target.value;
                            const novaQuantidade = valor === '' ? 1 : parseInt(valor);
                            if (novaQuantidade >= 1 && novaQuantidade <= 999) {
                              alterarQuantidade(item.id, item.tipo, novaQuantidade);
                            }
                          }}
                          onBlur={(e) => {
                            // Garantir que tenha pelo menos 1 quando perder o foco
                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                              alterarQuantidade(item.id, item.tipo, 1);
                            }
                          }}
                          className="text-lg font-bold text-[#1E293B] w-12 text-center border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-[#abd3f2] focus:border-[#abd3f2]"
                        />
                        <Button
                          variant="secondary"
                          onClick={() => alterarQuantidade(item.id, item.tipo, item.quantidade + 1)}
                          className="text-xs px-2 py-1"
                        >
                          +
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => removerDoCarrinho(item.id, item.tipo)}
                          className="text-xs px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#1E293B]">Total:</span>
                    <span className="text-2xl font-bold text-[#abd3f2]">R$ {calcularTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  variant="gold"
                  onClick={finalizarVenda}
                  disabled={loading}
                  className="w-full text-lg py-3"
                >
                  {loading ? '⏳ Finalizando...' : '💳 Finalizar Venda'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VendaRapida;