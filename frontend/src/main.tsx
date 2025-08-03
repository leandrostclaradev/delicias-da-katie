import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// import './services/mock'; // Desabilitado para conectar ao backend real

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
