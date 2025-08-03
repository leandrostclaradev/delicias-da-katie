import React, { useState, useEffect } from 'react';
import Button from './Button';
import api from '../services/api';

interface ItemVenda {
  produto: {
    nome: string;
    valor: number;
  };
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

interface DashboardProducaoProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: number, novoStatus: string) => void;
}

const DashboardProducao: React.FC<DashboardProducaoProps> = ({ isOpen, onClose, onStatusChange }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVendas();
      const interval = setInterval(fetchVendas, 5000); // Atualiza a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const fetchVendas = async () => {
    try {
      const response = await api.get('/vendas');
      
      // Validar e limpar os dados recebidos (mesma lógica da página principal)
      const vendasValidadas = response.data.map((venda: any) => ({
        ...venda,
        valorTotal: venda.valorTotal || 0,
        itens: (venda.itens || []).map((item: any) => {
          const quantidade = item.quantidade || 0;
          const valorUnitario = item.valorUnitario || 0;
          const valorTotalCalculado = quantidade * valorUnitario;
          
          return {
            ...item,
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
      
      const vendasAtivas = vendasValidadas.filter((venda: Venda) => 
        ['PENDENTE', 'EM_PREPARO', 'PRONTO'].includes(venda.status)
      );
      setVendas(vendasAtivas);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
    }
  };

  const handleStatusChange = async (id: number, novoStatus: string) => {
    try {
      setLoading(true);
      await api.put(`/vendas/${id}/status`, { status: novoStatus });
      await fetchVendas();
      onStatusChange?.(id, novoStatus); // Chama a função de callback da página principal
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const vendasPorStatus = {
    PENDENTE: vendas.filter(v => v.status === 'PENDENTE'),
    EM_PREPARO: vendas.filter(v => v.status === 'EM_PREPARO'),
    PRONTO: vendas.filter(v => v.status === 'PRONTO')
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-7xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#abd3f2] p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1E293B]">🏪 Dashboard de Produção</h2>
          <Button variant="secondary" onClick={onClose}>
            ✕ Fechar
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-full">
          {/* Coluna PENDENTE */}
          <div className="flex-1 border-r border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-800">⏳ Pendentes ({vendasPorStatus.PENDENTE.length})</h3>
              <div className="text-2xl">⏳</div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {vendasPorStatus.PENDENTE.map((venda) => (
                <div key={venda.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-yellow-900">#{venda.id} - {venda.cliente}</h4>
                      <p className="text-sm text-yellow-700">{venda.horaVenda}</p>
                    </div>
                    <span className="text-lg font-bold text-yellow-800">R$ {venda.valorTotal.toFixed(2)}</span>
                  </div>
                  <div className="mb-3">
                    {venda.itens.map((item, index) => (
                      <div key={index} className="text-sm text-yellow-700">
                        {item.quantidade}x {item.produto.nome}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="gold"
                    onClick={() => handleStatusChange(venda.id, 'EM_PREPARO')}
                    disabled={loading}
                    className="w-full text-sm"
                  >
                    👨‍🍳 Iniciar Preparo
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna EM PREPARO */}
          <div className="flex-1 border-r border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-800">👨‍🍳 Em Preparo ({vendasPorStatus.EM_PREPARO.length})</h3>
              <div className="text-2xl">👨‍🍳</div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {vendasPorStatus.EM_PREPARO.map((venda) => (
                <div key={venda.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-blue-900">#{venda.id} - {venda.cliente}</h4>
                      <p className="text-sm text-blue-700">{venda.horaVenda}</p>
                    </div>
                    <span className="text-lg font-bold text-blue-800">R$ {venda.valorTotal.toFixed(2)}</span>
                  </div>
                  <div className="mb-3">
                    {venda.itens.map((item, index) => (
                      <div key={index} className="text-sm text-blue-700">
                        {item.quantidade}x {item.produto.nome}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="gold"
                    onClick={() => handleStatusChange(venda.id, 'PRONTO')}
                    disabled={loading}
                    className="w-full text-sm"
                  >
                    📦 Marcar Pronto
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna PRONTO */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-800">📦 Pronto ({vendasPorStatus.PRONTO.length})</h3>
              <div className="text-2xl">📦</div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {vendasPorStatus.PRONTO.map((venda) => (
                <div key={venda.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-orange-900">#{venda.id} - {venda.cliente}</h4>
                      <p className="text-sm text-orange-700">{venda.horaVenda}</p>
                    </div>
                    <span className="text-lg font-bold text-orange-800">R$ {venda.valorTotal.toFixed(2)}</span>
                  </div>
                  <div className="mb-3">
                    {venda.itens.map((item, index) => (
                      <div key={index} className="text-sm text-orange-700">
                        {item.quantidade}x {item.produto.nome}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="gold"
                    onClick={() => handleStatusChange(venda.id, 'ENTREGUE')}
                    disabled={loading}
                    className="w-full text-sm"
                  >
                    🎉 Entregar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducao;