import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Combos from './pages/Combos';
import Vendas from './pages/Vendas';
import FluxoCaixa from './pages/FluxoCaixa';
import Encomendas from './pages/Encomendas';
import Promocoes from './pages/Promocoes';
import Usuarios from './pages/Usuarios';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute><Dashboard /></PrivateRoute>}
            />
            <Route
              path="/produtos"
              element={<PrivateRoute><Produtos /></PrivateRoute>}
            />
            <Route
              path="/combos"
              element={<PrivateRoute><Combos /></PrivateRoute>}
            />
            <Route
              path="/vendas"
              element={<PrivateRoute><Vendas /></PrivateRoute>}
            />
            <Route
              path="/fluxo-caixa"
              element={<PrivateRoute><FluxoCaixa /></PrivateRoute>}
            />
            <Route
              path="/encomendas"
              element={<PrivateRoute><Encomendas /></PrivateRoute>}
            />
            <Route
              path="/promocoes"
              element={<PrivateRoute><Promocoes /></PrivateRoute>}
            />
            <Route
              path="/usuarios"
              element={<PrivateRoute><Usuarios /></PrivateRoute>}
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
