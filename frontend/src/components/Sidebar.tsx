import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Logo Delicias da Katie.png';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/produtos', label: 'Produtos', icon: '🍰' },
  { to: '/combos', label: 'Combos', icon: '🎁' },
  { to: '/vendas', label: 'Vendas', icon: '💰' },
  { to: '/fluxo-caixa', label: 'Fluxo de Caixa', icon: '💵' },
  { to: '/encomendas', label: 'Encomendas', icon: '📦' },
  { to: '/promocoes', label: 'Promoções', icon: '🏷️' },
  { to: '/usuarios', label: 'Usuários', icon: '👥' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-white/80 shadow-xl border-r border-[#F3F4F6] p-8 flex flex-col gap-6 min-h-screen items-center backdrop-blur-md">
      <div className="flex flex-col items-center mb-6">
        <img src={logo} alt="Logo Delicias da Katie" className="w-20 h-20 object-contain rounded-full shadow-lg mb-2 border-4 border-[#F5E9DA] bg-white" />
        <span className="text-xl font-extrabold text-[#E3C77A] tracking-widest drop-shadow">
          {user?.nome || 'Usuário'}
        </span>
      </div>
      <nav className="flex flex-col gap-2 flex-1 w-full">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-150 text-lg
              ${location.pathname === link.to ? 'bg-[#3B82F6] text-white shadow' : 'text-[#1E293B] hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]'}`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-8 px-6 py-2 bg-[#3B82F6] text-white rounded-full font-bold shadow-lg hover:bg-[#E3C77A] hover:text-[#1E293B] transition-all duration-200"
      >
        Sair
      </button>
    </aside>
  );
};

export default Sidebar; 