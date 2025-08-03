import React, { useState } from 'react';
import Button from './Button';

interface ItemCombo {
  id: number;
  quantidade: number;
  valorUnitario: number;
  produto: {
    id: number;
    nome: string;
    valor: number;
    dataVencimento?: string;
  };
}

interface Item {
  id: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  produto?: {
    id: number;
    nome: string;
    valor: number;
    dataVencimento?: string;
  };
  combo?: {
    id: number;
    nome: string;
    descricao: string;
    valorTotal: number;
    ativo: boolean;
    itens: ItemCombo[];
  };
}

interface PedidoCardProps {
  id: number;
  cliente: string;
  descricao?: string;
  data: string;
  hora?: string;
  valor: number;
  status: string;
  itens: Item[];
  onStatusChange: (id: number, novoStatus: string) => void;
  tipo: 'venda' | 'encomenda';
}

const PedidoCard: React.FC<PedidoCardProps> = ({
  id,
  cliente,
  descricao,
  data,
  hora,
  valor = 0,
  status,
  itens = [],
  onStatusChange,
  tipo
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EM_PREPARO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PRONTO':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ENTREGUE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return '⏳';
      case 'EM_PREPARO':
        return '👨‍🍳';
      case 'PRONTO':
        return '📦';
      case 'ENTREGUE':
        return '🎉';
      case 'CANCELADO':
        return '❌';
      default:
        return '📋';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDENTE':
        return 'EM_PREPARO';
      case 'EM_PREPARO':
        return 'PRONTO';
      case 'PRONTO':
        return 'ENTREGUE';
      default:
        return currentStatus;
    }
  };

  const canAdvanceStatus = (currentStatus: string) => {
    return ['PENDENTE', 'EM_PREPARO', 'PRONTO'].includes(currentStatus);
  };

  const canCancel = (currentStatus: string) => {
    return ['PENDENTE', 'EM_PREPARO'].includes(currentStatus);
  };

  const getItemName = (item: Item) => {
    // Se for um combo, mostrar o nome do combo
    if (item.combo && item.combo.nome) {
      return `🍱 ${item.combo.nome}`;
    }
    
    // Se for um produto, mostrar o nome do produto
    if (item.produto && item.produto.nome) {
      return item.produto.nome;
    }
    
    // Fallback
    return 'Item não encontrado';
  };

  const toggleItemExpansion = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const hasComboItems = (item: Item) => {
    return item.combo && item.combo.itens && item.combo.itens.length > 0;
  };

  const getItemCount = (item: Item) => {
    if (item.combo && item.combo.itens) {
      return item.combo.itens.length;
    }
    return 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {tipo === 'venda' ? 'Venda' : 'Encomenda'} #{id}
          </h3>
          <p className="text-sm text-gray-600">
            Cliente: <span className="font-medium">{cliente}</span>
          </p>
          {descricao && (
            <p className="text-sm text-gray-600 mt-1">
              Descrição: <span className="font-medium">{descricao}</span>
            </p>
          )}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
          {getStatusIcon(status)} {status}
        </div>
      </div>

      {/* Data e Hora */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Data: <span className="font-medium">{data}</span>
          {hora && (
            <>
              {' | '}
              Hora: <span className="font-medium">{hora}</span>
            </>
          )}
        </p>
      </div>

      {/* Lista de Produtos/Combos */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Itens:</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {itens && itens.length > 0 ? (
            itens.map((item, index) => {
              const valorItem = item.valorTotal || (item.quantidade * item.valorUnitario) || 0;
              const isExpanded = expandedItems.has(index);
              const canExpand = hasComboItems(item);
              const itemCount = getItemCount(item);
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                  {/* Item Principal */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {item.quantidade || 0}x {getItemName(item)}
                      </span>
                      {canExpand && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
                            {itemCount} itens
                          </span>
                          <button
                            onClick={() => toggleItemExpansion(index)}
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-200"
                            title={isExpanded ? 'Recolher detalhes' : 'Ver detalhes'}
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      R$ {valorItem.toFixed(2)}
                    </span>
                  </div>

                  {/* Menu Suspenso para Itens do Combo */}
                  {canExpand && isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <span>📋</span>
                        <span>Detalhes do combo:</span>
                      </div>
                      <div className="space-y-1.5 pl-3">
                        {item.combo?.itens?.map((comboItem, comboIndex) => (
                          <div key={comboIndex} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                {comboItem.quantidade}x {comboItem.produto?.nome || 'Produto não encontrado'}
                              </span>
                            </div>
                            <span className="text-gray-500 font-medium">
                              R$ {(comboItem.quantidade * comboItem.valorUnitario).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {item.combo?.descricao && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="text-xs text-gray-500 italic">
                            💡 {item.combo.descricao}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 italic">Nenhum item encontrado</p>
          )}
        </div>
      </div>

      {/* Valor Total */}
      <div className="border-t pt-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-lg font-bold text-[#abd3f2]">R$ {(valor || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2 flex-wrap">
        {canAdvanceStatus(status) && (
          <Button
            variant="gold"
            onClick={() => onStatusChange(id, getNextStatus(status))}
            className="text-xs px-3 py-1"
          >
            {getNextStatus(status) === 'EM_PREPARO' && '👨‍🍳 Marcar Em Preparo'}
            {getNextStatus(status) === 'PRONTO' && '📦 Marcar Pronto'}
            {getNextStatus(status) === 'ENTREGUE' && '🎉 Entregar'}
          </Button>
        )}
        
        {canCancel(status) && (
          <Button
            variant="secondary"
            onClick={() => onStatusChange(id, 'CANCELADO')}
            className="text-xs px-3 py-1"
          >
            ❌ Cancelar
          </Button>
        )}
      </div>
    </div>
  );
};

export default PedidoCard;