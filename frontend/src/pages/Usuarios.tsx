import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Card from '../components/Card';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import api from '../services/api';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cargo: 'FUNCIONARIO'
  });

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleNovoUsuario = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/usuarios', formData);
      
      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        senha: '',
        cargo: 'FUNCIONARIO'
      });
      
      setShowModal(false);
      
      // Recarregar lista
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
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
        <Topbar title="Usuários" />
        <Card className="w-full max-w-3xl">
          <h1 className="text-3xl font-extrabold text-[#abd3f2] mb-6 tracking-tight">Usuários</h1>
          <Button variant="gold" className="mb-4" onClick={handleNovoUsuario}>Novo Usuário</Button>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-[#3B82F6]">Carregando usuários...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#3B82F6]">Nenhum usuário cadastrado</p>
            </div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5E9DA] text-[#1E293B]">
                <th className="p-2">Nome</th>
                <th className="p-2">Email</th>
                <th className="p-2">Cargo</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b hover:bg-[#f5f5f5]">
                  <td className="p-2">{u.nome}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.cargo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </Card>
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Usuário">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nome"
            type="text"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          <PasswordInput
            label="Senha"
            value={formData.senha}
            onChange={(e) => handleInputChange('senha', e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2">
              Cargo
            </label>
            <select
              value={formData.cargo}
              onChange={(e) => handleInputChange('cargo', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              required
            >
              <option value="FUNCIONARIO">Funcionário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
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

export default Usuarios; 