import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Card from '../components/Card';
import Topbar from '../components/Topbar';
import PedidoCard from '../components/PedidoCard';
import VendaRapida from '../components/VendaRapida';
import DashboardProducao from '../components/DashboardProducao';
import ErrorBoundary from '../components/ErrorBoundary';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  valor: number;
  dataVencimento: string;
}

interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface Venda {
  id: number;
  cliente: string;
  valorTotal: number;
  dataVenda: string;
  horaVenda: string;
  status: string;
  itens: ItemVenda[];
}

const Vendas: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVendaRapida, setShowVendaRapida] = useState(false);
  const [showDashboardProducao, setShowDashboardProducao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [abaAtiva, setAbaAtiva] = useState<'ativos' | 'historico'>('ativos');

  // Função utilitária para validar dados das vendas
  const validarDadosVendas = (dados: any[]): Venda[] => {
    return dados.map((venda: any) => ({
      ...venda,
      valorTotal: venda.valorTotal || 0,
      itens: (venda.itens || []).map((item: any) => {
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

  const fetchVendas = async () => {
    try {
      setError(null);
      console.log('Buscando vendas...');
      const response = await api.get('/vendas');
      console.log('Vendas recebidas:', response.data);
      
      // Validar e limpar os dados recebidos
      const vendasValidadas = validarDadosVendas(response.data);
      
      console.log('Vendas validadas:', vendasValidadas);
      setVendas(vendasValidadas);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      setError('Erro ao carregar vendas');
      setVendas([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Iniciando carregamento de dados...');
        await fetchVendas();
        console.log('Dados carregados com sucesso');
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNovaVendaRapida = () => {
    setShowVendaRapida(true);
  };

  const handleAbrirDashboardProducao = () => {
    setShowDashboardProducao(true);
  };

  const handleVendaCriada = async () => {
    try {
      console.log('Recarregando vendas após criação...');
      await fetchVendas();
      console.log('Vendas recarregadas com sucesso');
    } catch (error) {
      console.error('Erro ao recarregar vendas:', error);
      // Não deixar que o erro quebre a aplicação
      setError('Erro ao atualizar lista de vendas, mas a venda foi criada com sucesso');
    }
  };

  const handleStatusChange = async (id: number, novoStatus: string) => {
    try {
      console.log(`Atualizando status da venda ${id} para ${novoStatus}`);
      await api.put(`/vendas/${id}/status`, { status: novoStatus });
      console.log('Status atualizado com sucesso, recarregando vendas...');
      await fetchVendas(); // Recarrega os dados da página principal
      console.log('Vendas recarregadas com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleBusca = async () => {
    if (termoBusca.trim()) {
      try {
        const response = await api.get(`/vendas/buscar?termo=${termoBusca}`);
        const vendasValidadas = validarDadosVendas(response.data);
        setVendas(vendasValidadas);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    } else {
      fetchVendas();
    }
  };

  const handleFiltroStatus = async (status: string) => {
    setFiltroStatus(status);
    if (status === 'TODOS') {
      fetchVendas();
    } else {
      try {
        const response = await api.get(`/vendas/status/${status.toLowerCase()}`);
        const vendasValidadas = validarDadosVendas(response.data);
        setVendas(vendasValidadas);
      } catch (error) {
        console.error('Erro ao filtrar por status:', error);
      }
    }
  };

  const vendasFiltradas = vendas.filter(venda => {
    const isAtivo = !['ENTREGUE', 'CANCELADO'].includes(venda.status);
    return abaAtiva === 'ativos' ? isAtivo : !isAtivo;
  });

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-[#abd3f2]">
        <Sidebar />
        <main className="flex-1 flex flex-col py-10">
          <Topbar title="Vendas" />
          
          {/* Header com Venda Rápida */}
          <div className="px-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-[#1E293B]">Vendas</h1>
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  onClick={handleAbrirDashboardProducao}
                  className="text-lg px-4 py-3"
                >
                  🏪 Dashboard Produção
                </Button>
                <Button 
                  variant="gold" 
                  onClick={handleNovaVendaRapida}
                  className="text-lg px-6 py-3"
                >
                  ⚡ Venda Rápida
                </Button>
              </div>
            </div>

            {/* Filtros e Busca */}
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
                  {['TODOS', 'PENDENTE', 'EM_PREPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO'].map((status) => (
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
                📋 Ativos ({vendas.filter(v => !['ENTREGUE', 'CANCELADO'].includes(v.status)).length})
              </Button>
              <Button
                variant={abaAtiva === 'historico' ? "gold" : "secondary"}
                onClick={() => setAbaAtiva('historico')}
              >
                📚 Histórico ({vendas.filter(v => ['ENTREGUE', 'CANCELADO'].includes(v.status)).length})
              </Button>
            </div>
          </div>

          {/* Lista de Vendas */}
          <div className="px-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#abd3f2] mx-auto mb-4"></div>
                <p className="text-[#3B82F6]">Carregando vendas...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <Button variant="gold" onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchVendas();
                  setLoading(false);
                }}>
                  🔄 Tentar Novamente
                </Button>
              </div>
            ) : vendasFiltradas.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🍰</div>
                <p className="text-[#3B82F6] text-lg mb-2">
                  {abaAtiva === 'ativos' ? 'Nenhuma venda ativa' : 'Nenhuma venda no histórico'}
                </p>
                {abaAtiva === 'ativos' && (
                  <Button variant="gold" onClick={handleNovaVendaRapida}>
                    ⚡ Fazer Primeira Venda
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendasFiltradas.map((venda) => (
                  <PedidoCard
                    key={venda.id}
                    id={venda.id}
                    cliente={venda.cliente}
                    data={venda.dataVenda}
                    hora={venda.horaVenda}
                    valor={venda.valorTotal}
                    status={venda.status}
                    itens={venda.itens}
                    onStatusChange={handleStatusChange}
                    tipo="venda"
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Modal de Venda Rápida */}
        <VendaRapida
          isOpen={showVendaRapida}
          onClose={() => setShowVendaRapida(false)}
          onVendaCriada={handleVendaCriada}
        />

        {/* Dashboard de Produção */}
        <DashboardProducao
          isOpen={showDashboardProducao}
          onClose={() => setShowDashboardProducao(false)}
          onStatusChange={handleStatusChange}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Vendas; 