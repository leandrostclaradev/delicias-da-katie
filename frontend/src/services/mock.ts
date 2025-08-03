import axios from './api';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios, { delayResponse: 500 });

// Usuários
const usuarios = [
  { id: 1, nome: 'Administrador', email: 'admin@confeitaria.com', cargo: 'ADMIN' },
  { id: 2, nome: 'Maria Oliveira', email: 'maria@confeitaria.com', cargo: 'ATENDENTE' },
];

// Produtos
const produtos = [
  { id: 1, nome: 'Bolo de Chocolate', valor: 35.0, quantidade: 10, dataVencimento: '2024-08-01' },
  { id: 2, nome: 'Torta de Limão', valor: 28.0, quantidade: 7, dataVencimento: '2024-07-29' },
];

// Combos
const combos = [
  { id: 1, nome: 'Combo Festa', produtos: [produtos[0], produtos[1]], valorTotal: 60.0 },
];

// Vendas
const vendas = [
  { id: 1, cliente: 'João da Silva', itens: [{ produto: produtos[0], quantidade: 2 }], valorTotal: 70.0, dataVenda: '2024-07-25', horaVenda: '14:30' },
];

// Encomendas
const encomendas = [
  { id: 1, cliente: 'Maria Oliveira', descricao: 'Bolo de aniversário', dataEntrega: '2024-07-30', valor: 80.0 },
];

// Fluxo de Caixa
const fluxoCaixa = [
  { id: 1, data: '2024-07-25', hora: '14:30', tipo: 'Produto', nome: 'Bolo de Chocolate', quantidade: 2, valorUnitario: 35.0, valorTotal: 70.0 },
];

// Promoções
const promocoes = [
  { id: 1, produto: produtos[0], descricaoPromocional: 'Promoção especial de inverno', dataInicio: '2024-07-20', dataFim: '2024-07-31' },
];

// Auth
mock.onPost('/auth/login').reply(config => {
  const { email, senha } = JSON.parse(config.data);
  const user = usuarios.find(u => u.email === email && senha === '123456');
  if (user) {
    return [200, { token: 'fake-jwt-token', user }];
  }
  return [401, { message: 'Credenciais inválidas' }];
});

mock.onGet('/usuarios').reply(200, usuarios);
mock.onGet('/produtos').reply(200, produtos);
mock.onGet('/combos').reply(200, combos);
mock.onGet('/vendas').reply(200, vendas);
mock.onGet('/encomendas').reply(200, encomendas);
mock.onGet('/fluxo-caixa').reply(200, fluxoCaixa);
mock.onGet('/promocoes').reply(200, promocoes);

export default mock; 