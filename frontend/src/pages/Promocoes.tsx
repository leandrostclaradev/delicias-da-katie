import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Card from '../components/Card';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import api from '../services/api';

interface Promocao {
  id: number;
  produto: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
}

const Promocoes: React.FC = () => {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    produto: '',
    descricao: '',
    dataInicio: '',
    dataFim: ''
  });

  const fetchPromocoes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/promocoes');
      setPromocoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar promoções:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromocoes();
  }, []);

  const handleNovaPromocao = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/promocoes', formData);
      
      // Limpar formulário
      setFormData({
        produto: '',
        descricao: '',
        dataInicio: '',
        dataFim: ''
      });
      
      setShowModal(false);
      
      // Recarregar lista
      fetchPromocoes();
    } catch (error) {
      console.error('Erro ao cadastrar promoção:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#abd3f2]">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center py-10">
        <Topbar title="Promoções" />
        <Card className="w-full max-w-3xl">
          <h1 className="text-3xl font-extrabold text-[#abd3f2] mb-6 tracking-tight">Promoções</h1>
          <Button variant="gold" className="mb-4" onClick={handleNovaPromocao}>Nova Promoção</Button>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-[#3B82F6]">Carregando promoções...</p>
            </div>
          ) : promocoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#3B82F6]">Nenhuma promoção cadastrada</p>
            </div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5E9DA] text-[#1E293B]">
                <th className="p-2">Produto</th>
                <th className="p-2">Descrição</th>
                <th className="p-2">Início</th>
                <th className="p-2">Fim</th>
              </tr>
            </thead>
            <tbody>
              {promocoes.map((p) => (
                <tr key={p.id} className="border-b hover:bg-[#f5f5f5]">
                  <td className="p-2">{p.produto}</td>
                  <td className="p-2">{p.descricao}</td>
                  <td className="p-2">{p.dataInicio}</td>
                  <td className="p-2">{p.dataFim}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </Card>
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Promoção">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Produto"
            type="text"
            value={formData.produto}
            onChange={(e) => handleInputChange('produto', e.target.value)}
            required
          />
          <FormInput
            label="Descrição"
            type="text"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            required
          />
          <FormInput
            label="Data de Início"
            type="date"
            value={formData.dataInicio}
            onChange={(e) => handleInputChange('dataInicio', e.target.value)}
            required
          />
          <FormInput
            label="Data de Fim"
            type="date"
            value={formData.dataFim}
            onChange={(e) => handleInputChange('dataFim', e.target.value)}
            required
          />
          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="gold" className="flex-1">
              Cadastrar
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

export default Promocoes; 