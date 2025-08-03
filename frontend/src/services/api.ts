import axios from 'axios';

// Função para obter o IP da máquina na rede local
const getLocalIP = () => {
  // Em desenvolvimento, tenta detectar o IP local
  if (import.meta.env.DEV) {
    // Pode ser configurado manualmente se necessário
    const manualIP = import.meta.env.VITE_API_IP;
    if (manualIP) {
      return manualIP;
    }
    
    // Fallback para localhost
    return 'localhost';
  }
  
  // Em produção, usa o host atual
  return window.location.hostname;
};

const api = axios.create({
  baseURL: `http://${getLocalIP()}:8080/api`,
});

export default api; 