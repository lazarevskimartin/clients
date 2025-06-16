// src/utils/authApi.ts
import axios from 'axios';

const API_URL = 'https://kurir.crnaovca.mk/api';

export async function register(email: string, password: string) {
  return axios.post(`${API_URL}/register`, { email, password });
}

export async function login(email: string, password: string) {
  return axios.post(`${API_URL}/login`, { email, password });
}
