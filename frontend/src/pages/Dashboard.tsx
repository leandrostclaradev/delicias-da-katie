import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Topbar from '../components/Topbar';
import api from '../services/api';

interface DashboardStats {
  totalProdutos: number;
  totalVendas: number;
  totalEncomendas: number;
  totalPromocoes: number;
  vendasHoje: number;
  encomendasHoje: number;
  vendasPendentes: number;
  encomendasPendentes: number;
  vendasEmPreparo: number;
  encomendasEmPreparo: number;
  vendasProntas: number;
  encomendasProntas: number;
  vendasEntregues: number;
  encomendasEntregues: number;
  valorTotalVendas: number;
  valorTotalEncomendas: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProdutos: 0,
    totalVendas: 0,
    totalEncomendas: 0,
    totalPromocoes: 0,
    vendasHoje: 0,
    encomendasHoje: 0,
    vendasPendentes: 0,
    encomendasPendentes: 0,
    vendasEmPreparo: 0,
    encomendasEmPreparo: 0,
    vendasProntas: 0,
    encomendasProntas: 0,
    vendasEntregues: 0,
    encomendasEntregues: 0,
    valorTotalVendas: 0,
    valorTotalEncomendas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados básicos
      const [produtos, vendas, encomendas, promocoes] = await Promise.all([
        api.get('/produtos'),
        api.get('/vendas'),
        api.get('/encomendas'),
        api.get('/promocoes')
      ]);

      const hoje = new Date().toISOString().split('T')[0];
      
      // Calcular estatísticas
      const vendasHoje = vendas.data.filter((v: any) => v.dataVenda === hoje).length;
      const encomendasHoje = encomendas.data.filter((e: any) => e.dataEntrega === hoje).length;
      
      // Melhorar lógica das barras de progresso
      const vendasPendentes = vendas.data.filter((v: any) => v.status === 'PENDENTE').length;
      const vendasEmPreparo = vendas.data.filter((v: any) => v.status === 'EM_PREPARO').length;
      const vendasProntas = vendas.data.filter((v: any) => v.status === 'PRONTO').length;
      const vendasEntregues = vendas.data.filter((v: any) => v.status === 'ENTREGUE').length;
      
      const encomendasPendentes = encomendas.data.filter((e: any) => e.status === 'PENDENTE').length;
      const encomendasEmPreparo = encomendas.data.filter((e: any) => e.status === 'EM_PREPARO').length;
      const encomendasProntas = encomendas.data.filter((e: any) => e.status === 'PRONTO').length;
      const encomendasEntregues = encomendas.data.filter((e: any) => e.status === 'ENTREGUE').length;
      
      const valorTotalVendas = vendas.data.reduce((total: number, v: any) => total + v.valorTotal, 0);
      const valorTotalEncomendas = encomendas.data.reduce((total: number, e: any) => total + e.valor, 0);

      setStats({
        totalProdutos: produtos.data.length,
        totalVendas: vendas.data.length,
        totalEncomendas: encomendas.data.length,
        totalPromocoes: promocoes.data.length,
        vendasHoje,
        encomendasHoje,
        vendasPendentes,
        encomendasPendentes,
        vendasEmPreparo,
        encomendasEmPreparo,
        vendasProntas,
        encomendasProntas,
        vendasEntregues,
        encomendasEntregues,
        valorTotalVendas,
        valorTotalEncomendas
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
  }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );



  const WorkflowCard = ({ title, data, icon, color }: {
    title: string;
    data: { pendente: number; emPreparo: number; pronto: number; entregue: number };
    icon: string;
    color: string;
  }) => {
    const total = data.pendente + data.emPreparo + data.pronto + data.entregue;
    const ativos = data.pendente + data.emPreparo + data.pronto;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>
        
        {/* Status Breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-yellow-50 rounded">
            <p className="text-xs text-yellow-700">⏳ Pendente</p>
            <p className="text-lg font-bold text-yellow-800">{data.pendente}</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <p className="text-xs text-blue-700">👨‍🍳 Em Preparo</p>
            <p className="text-lg font-bold text-blue-800">{data.emPreparo}</p>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded">
            <p className="text-xs text-orange-700">📦 Pronto</p>
            <p className="text-lg font-bold text-orange-800">{data.pronto}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <p className="text-xs text-green-700">✅ Entregue</p>
            <p className="text-lg font-bold text-green-800">{data.entregue}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{ativos} ativos de {total} total</span>
            <span>{total > 0 ? ((ativos / total) * 100).toFixed(1) : 0}% ativos</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${color}`}
            style={{ width: `${total > 0 ? (ativos / total) * 100 : 0}%` }}
          ></div>
        </div>
        
        {/* Summary */}
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600">
            {data.pendente > 0 && `${data.pendente} aguardando`}
            {data.emPreparo > 0 && `${data.emPreparo} em preparo`}
            {data.pronto > 0 && `${data.pronto} prontos`}
            {data.entregue > 0 && `${data.entregue} entregues`}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#abd3f2]">
        <Sidebar />
        <main className="flex-1 flex flex-col py-10">
          <Topbar title="Dashboard" />
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#abd3f2] mx-auto mb-4"></div>
              <p className="text-[#3B82F6]">Carregando dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#abd3f2]">
      <Sidebar />
      <main className="flex-1 flex flex-col py-10">
        <Topbar title="Dashboard" />
        
        <div className="px-6">
          {/* Cards de Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total de Produtos"
              value={stats.totalProdutos}
              icon="🍰"
              color="border-blue-500"
              subtitle="Produtos cadastrados"
            />
            <StatCard
              title="Vendas Hoje"
              value={stats.vendasHoje}
              icon="💰"
              color="border-green-500"
              subtitle="Vendas realizadas hoje"
            />
            <StatCard
              title="Encomendas Hoje"
              value={stats.encomendasHoje}
              icon="📦"
              color="border-orange-500"
              subtitle="Encomendas para hoje"
            />
            <StatCard
              title="Promoções Ativas"
              value={stats.totalPromocoes}
              icon="🎉"
              color="border-purple-500"
              subtitle="Promoções em andamento"
            />
          </div>

          {/* Cards de Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total Vendas</p>
                  <p className="text-3xl font-bold text-green-600">
                    R$ {stats.valorTotalVendas.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Todas as vendas</p>
                </div>
                <div className="text-4xl">💵</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total Encomendas</p>
                  <p className="text-3xl font-bold text-blue-600">
                    R$ {stats.valorTotalEncomendas.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Todas as encomendas</p>
                </div>
                <div className="text-4xl">📋</div>
              </div>
            </div>
          </div>

          {/* Cards de Fluxo de Trabalho */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <WorkflowCard
              title="Fluxo de Vendas"
              data={{
                pendente: stats.vendasPendentes,
                emPreparo: stats.vendasEmPreparo,
                pronto: stats.vendasProntas,
                entregue: stats.vendasEntregues
              }}
              icon="💰"
              color="bg-green-500"
            />
            <WorkflowCard
              title="Fluxo de Encomendas"
              data={{
                pendente: stats.encomendasPendentes,
                emPreparo: stats.encomendasEmPreparo,
                pronto: stats.encomendasProntas,
                entregue: stats.encomendasEntregues
              }}
              icon="📦"
              color="bg-blue-500"
            />
          </div>

          {/* Resumo Geral */}
          <Card>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-6">Resumo Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-900">Total de Vendas</h3>
                <p className="text-2xl font-bold text-[#abd3f2]">{stats.totalVendas}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="font-semibold text-gray-900">Total de Encomendas</h3>
                <p className="text-2xl font-bold text-[#abd3f2]">{stats.totalEncomendas}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🍰</div>
                <h3 className="font-semibold text-gray-900">Produtos Cadastrados</h3>
                <p className="text-2xl font-bold text-[#abd3f2]">{stats.totalProdutos}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 