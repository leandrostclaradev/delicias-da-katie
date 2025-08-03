import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import Card from '../components/Card';
import api from '../services/api';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        email,
        senha: password
      });
      
      // Assumindo que a API retorna token e user
      const { token, user } = response.data;
      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#abd3f2] to-[#d8c7b5]">
      <Card className="w-full max-w-sm flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-[#abd3f2] mb-8 tracking-tight">Login</h2>
        {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="mt-2 w-full bg-gradient-to-r from-[#abd3f2] to-[#e3d292] text-white font-bold py-3 rounded-full shadow-lg hover:from-[#e3d292] hover:to-[#abd3f2] transition-all text-lg">Entrar</button>
        </form>
      </Card>
    </div>
  );
};

export default Login; 