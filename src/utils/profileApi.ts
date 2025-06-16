import axios from 'axios';

const API_URL = 'https://kurir.crnaovca.mk/api';

export async function getProfile(token: string) {
  return axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
