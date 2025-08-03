import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Card from '../components/Card';
import Topbar from '../components/Topbar';
import ErrorBoundary from '../components/ErrorBoundary';
import api from '../services/api';

interface FluxoCaixa {
  data: string;
  vendas: number;
  encomendas: number;
  totalEntrada: number;
  totalSaida: number;
  saldo: number;
}

interface ResumoFinanceiro {
  vendasHoje: number;
  vendasMes: number;
  encomendasHoje: number;
  encomendasMes: number;
  totalEntradaHoje: number;
  totalEntradaMes: number;
  totalSaidaHoje: number;
  totalSaidaMes: number;
  saldoHoje: number;
  saldoMes: number;
  ticketMedioHoje: number;
  ticketMedioMes: number;
}

interface Venda {
  id: number;
  cliente: string;
  valorTotal: number;
  dataVenda: string;
  horaVenda: string;
  status: string;
  itens: any[];
}

interface Encomenda {
  id: number;
  cliente: string;
  valor: number;
  dataEntrega: string;
  status: string;
  descricao: string;
}

const FluxoCaixa: React.FC = () => {
  const [fluxoCaixa, setFluxoCaixa] = useState<FluxoCaixa[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'hoje' | 'semana' | 'mes'>('hoje');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'entregue' | 'pendente'>('todos');

  useEffect(() => {
    carregarDados();
  }, [periodoSelecionado, filtroStatus]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar vendas
      const vendasResponse = await api.get('/vendas');
      const vendasFiltradas = vendasResponse.data.filter((venda: Venda) => {
        if (filtroStatus === 'entregue') return venda.status === 'ENTREGUE';
        if (filtroStatus === 'pendente') return venda.status !== 'ENTREGUE';
        return true;
      });
      setVendas(vendasFiltradas);

      // Carregar encomendas
      const encomendasResponse = await api.get('/encomendas');
      const encomendasFiltradas = encomendasResponse.data.filter((encomenda: Encomenda) => {
        if (filtroStatus === 'entregue') return encomenda.status === 'ENTREGUE';
        if (filtroStatus === 'pendente') return encomenda.status !== 'ENTREGUE';
        return true;
      });
      setEncomendas(encomendasFiltradas);

      // Calcular resumo financeiro
      calcularResumoFinanceiro(vendasFiltradas, encomendasFiltradas);

      // Calcular fluxo de caixa
      calcularFluxoCaixa(vendasFiltradas, encomendasFiltradas);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  const calcularResumoFinanceiro = (vendasData: Venda[], encomendasData: Encomenda[]) => {
    const hoje = new Date().toISOString().split('T')[0];
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Vendas
    const vendasHoje = vendasData.filter(v => v.dataVenda === hoje && v.status === 'ENTREGUE');
    const vendasMes = vendasData.filter(v => v.dataVenda >= inicioMes && v.status === 'ENTREGUE');

    // Encomendas
    const encomendasHoje = encomendasData.filter(e => e.dataEntrega === hoje && e.status === 'ENTREGUE');
    const encomendasMes = encomendasData.filter(e => e.dataEntrega >= inicioMes && e.status === 'ENTREGUE');

    // Cálculos
    const totalVendasHoje = vendasHoje.reduce((sum, v) => sum + v.valorTotal, 0);
    const totalVendasMes = vendasMes.reduce((sum, v) => sum + v.valorTotal, 0);
    const totalEncomendasHoje = encomendasHoje.reduce((sum, e) => sum + e.valor, 0);
    const totalEncomendasMes = encomendasMes.reduce((sum, e) => sum + e.valor, 0);

    const ticketMedioHoje = vendasHoje.length > 0 ? totalVendasHoje / vendasHoje.length : 0;
    const ticketMedioMes = vendasMes.length > 0 ? totalVendasMes / vendasMes.length : 0;

    setResumo({
      vendasHoje: vendasHoje.length,
      vendasMes: vendasMes.length,
      encomendasHoje: encomendasHoje.length,
      encomendasMes: encomendasMes.length,
      totalEntradaHoje: totalVendasHoje + totalEncomendasHoje,
      totalEntradaMes: totalVendasMes + totalEncomendasMes,
      totalSaidaHoje: 0, // Por enquanto, sem controle de despesas
      totalSaidaMes: 0,
      saldoHoje: totalVendasHoje + totalEncomendasHoje,
      saldoMes: totalVendasMes + totalEncomendasMes,
      ticketMedioHoje,
      ticketMedioMes
    });
  };

  const calcularFluxoCaixa = (vendasData: Venda[], encomendasData: Encomenda[]) => {
    const fluxo: FluxoCaixa[] = [];
    const hoje = new Date();
    
    let diasParaCalcular = 1;
    if (periodoSelecionado === 'semana') diasParaCalcular = 7;
    if (periodoSelecionado === 'mes') diasParaCalcular = 30;

    for (let i = 0; i < diasParaCalcular; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];

      const vendasDia = vendasData.filter(v => v.dataVenda === dataStr && v.status === 'ENTREGUE');
      const encomendasDia = encomendasData.filter(e => e.dataEntrega === dataStr && e.status === 'ENTREGUE');

      const totalVendas = vendasDia.reduce((sum, v) => sum + v.valorTotal, 0);
      const totalEncomendas = encomendasDia.reduce((sum, e) => sum + e.valor, 0);
      const totalEntrada = totalVendas + totalEncomendas;
      const totalSaida = 0; // Por enquanto, sem controle de despesas

      fluxo.unshift({
        data: dataStr,
        vendas: vendasDia.length,
        encomendas: encomendasDia.length,
        totalEntrada,
        totalSaida,
        saldo: totalEntrada - totalSaida
      });
    }

    setFluxoCaixa(fluxo);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ENTREGUE':
        return 'text-green-600 bg-green-100';
      case 'PRONTO':
        return 'text-orange-600 bg-orange-100';
      case 'EM_PREPARO':
        return 'text-blue-600 bg-blue-100';
      case 'PENDENTE':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="flex min-h-screen bg-[#abd3f2]">
          <Sidebar />
          <main className="flex-1 flex flex-col py-10">
            <Topbar title="Fluxo de Caixa" />
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#abd3f2] mx-auto mb-4"></div>
                <p className="text-[#3B82F6]">Carregando dados financeiros...</p>
              </div>
            </div>
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-[#abd3f2]">
        <Sidebar />
        <main className="flex-1 flex flex-col py-10">
          <Topbar title="Fluxo de Caixa" />
          
          {/* Header */}
          <div className="px-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-[#1E293B]">💰 Fluxo de Caixa</h1>
              <div className="flex gap-3">
                <Button variant="gold" onClick={carregarDados}>
                  🔄 Atualizar
                </Button>
              </div>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <div className="flex gap-2">
                    {['hoje', 'semana', 'mes'].map((periodo) => (
                      <Button
                        key={periodo}
                        variant={periodoSelecionado === periodo ? "gold" : "secondary"}
                        onClick={() => setPeriodoSelecionado(periodo as any)}
                        className="text-xs px-3 py-1"
                      >
                        {periodo === 'hoje' && '📅 Hoje'}
                        {periodo === 'semana' && '📊 Semana'}
                        {periodo === 'mes' && '📈 Mês'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex gap-2">
                    {['todos', 'entregue', 'pendente'].map((status) => (
                      <Button
                        key={status}
                        variant={filtroStatus === status ? "gold" : "secondary"}
                        onClick={() => setFiltroStatus(status as any)}
                        className="text-xs px-3 py-1"
                      >
                        {status === 'todos' && '📋 Todos'}
                        {status === 'entregue' && '✅ Entregues'}
                        {status === 'pendente' && '⏳ Pendentes'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {error ? (
            <div className="px-6">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <Button variant="gold" onClick={carregarDados}>
                  🔄 Tentar Novamente
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Resumo Financeiro */}
              {resumo && (
                <div className="px-6 mb-6">
                  <h2 className="text-xl font-semibold text-[#1E293B] mb-4">📊 Resumo Financeiro</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <div className="text-center">
                        <div className="text-2xl mb-2">💰</div>
                        <h3 className="text-lg font-semibold text-green-600">Entradas Hoje</h3>
                        <p className="text-2xl font-bold text-green-600">{formatarMoeda(resumo.totalEntradaHoje)}</p>
                        <p className="text-sm text-gray-600">{resumo.vendasHoje + resumo.encomendasHoje} transações</p>
                      </div>
                    </Card>

                    <Card>
                      <div className="text-center">
                        <div className="text-2xl mb-2">📈</div>
                        <h3 className="text-lg font-semibold text-blue-600">Entradas Mês</h3>
                        <p className="text-2xl font-bold text-blue-600">{formatarMoeda(resumo.totalEntradaMes)}</p>
                        <p className="text-sm text-gray-600">{resumo.vendasMes + resumo.encomendasMes} transações</p>
                      </div>
                    </Card>

                    <Card>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <h3 className="text-lg font-semibold text-purple-600">Ticket Médio</h3>
                        <p className="text-2xl font-bold text-purple-600">{formatarMoeda(resumo.ticketMedioHoje)}</p>
                        <p className="text-sm text-gray-600">Hoje</p>
                      </div>
                    </Card>

                    <Card>
                      <div className="text-center">
                        <div className="text-2xl mb-2">💵</div>
                        <h3 className="text-lg font-semibold text-[#abd3f2]">Saldo Hoje</h3>
                        <p className="text-2xl font-bold text-[#abd3f2]">{formatarMoeda(resumo.saldoHoje)}</p>
                        <p className="text-sm text-gray-600">Disponível</p>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Fluxo de Caixa Detalhado */}
              <div className="px-6 mb-6">
                <h2 className="text-xl font-semibold text-[#1E293B] mb-4">📋 Fluxo de Caixa Detalhado</h2>
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Vendas</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Encomendas</th>
                          <th className="text-center py-3 px-4 font-semibold text-green-600">Entradas</th>
                          <th className="text-center py-3 px-4 font-semibold text-red-600">Saídas</th>
                          <th className="text-center py-3 px-4 font-semibold text-[#abd3f2]">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fluxoCaixa.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{formatarData(item.data)}</td>
                            <td className="py-3 px-4 text-center">{item.vendas}</td>
                            <td className="py-3 px-4 text-center">{item.encomendas}</td>
                            <td className="py-3 px-4 text-center text-green-600 font-semibold">
                              {formatarMoeda(item.totalEntrada)}
                            </td>
                            <td className="py-3 px-4 text-center text-red-600 font-semibold">
                              {formatarMoeda(item.totalSaida)}
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-[#abd3f2]">
                              {formatarMoeda(item.saldo)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Transações Recentes */}
              <div className="px-6">
                <h2 className="text-xl font-semibold text-[#1E293B] mb-4">🕒 Transações Recentes</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Vendas */}
                  <Card>
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center">
                      🛒 Vendas ({vendas.length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {vendas.slice(0, 10).map((venda) => (
                        <div key={venda.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-[#1E293B]">#{venda.id} - {venda.cliente}</p>
                            <p className="text-sm text-gray-600">{formatarData(venda.dataVenda)} às {venda.horaVenda}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(venda.status)}`}>
                              {venda.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{formatarMoeda(venda.valorTotal)}</p>
                            <p className="text-xs text-gray-500">{venda.itens.length} itens</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Encomendas */}
                  <Card>
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center">
                      📦 Encomendas ({encomendas.length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {encomendas.slice(0, 10).map((encomenda) => (
                        <div key={encomenda.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-[#1E293B]">#{encomenda.id} - {encomenda.cliente}</p>
                            <p className="text-sm text-gray-600">Entrega: {formatarData(encomenda.dataEntrega)}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(encomenda.status)}`}>
                              {encomenda.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">{formatarMoeda(encomenda.valor)}</p>
                            <p className="text-xs text-gray-500 truncate max-w-24">{encomenda.descricao}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default FluxoCaixa; 