import { Product, User } from '../types';
import { fakeProducts, endpoint } from '../data';
import axios from 'axios';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {

  login: async (email: string, senha: string): Promise<User> => {
    // Tenta cadastrar; ignora 409 (usuário já existe)
    try {
      await axios.post(`${endpoint}/register`, { email, senha });
    } catch (error: any) {
      if (error?.response?.status !== 409) {
        console.error('Erro inesperado no register:', error);
      }
    }

    // Cria a sessão com TTL no Redis
    try {
      const response = await axios.post(`${endpoint}/login`, { email, senha });
      console.log('Login realizado:', response.data);
    } catch (error) {
      console.error('Erro ao efetuar login na API externa:', error);
    }

    return {
      id: 'usr_' + Math.random().toString(36).substring(7),
      name: email.split('@')[0],
      email: email,
      token: 'mock_jwt_token_12345'
    };
  },

  /**
   * Endpoint para listar produtos.
   * Na versão final, fará um GET para sua API Python.
   */
  getProducts: async (): Promise<Product[]> => {
    await delay(400); // Simulando busca rápida
    return fakeProducts;
  },

  /**
   * Busca os ids do carrinho do usuário no Redis.
   */
  getCarrinho: async (email: string): Promise<string[]> => {
    const response = await axios.get(`${endpoint}/carrinho/${email}`);
    return (response.data.carrinho as any[]).map(id => String(id));
  },

  /**
   * Registra o produto no carrinho do usuário no Redis.
   */
  addToCart: async (email: string, produtoId: string): Promise<{ success: boolean }> => {
    await axios.post(`${endpoint}/carrinho`, { email, produtoId });
    return { success: true };
  }

};
