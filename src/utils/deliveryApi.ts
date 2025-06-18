import axios from 'axios';

const API_URL = 'https://kurir.crnaovca.mk/api';

export interface DeliveryRecord {
  _id: string;
  date: string;
  delivered: number;
}

export async function getDeliveries(token: string) {
  return axios.get<DeliveryRecord[]>(`${API_URL}/deliveries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function addDelivery(token: string, data: { date: string; delivered: number }) {
  return axios.post<DeliveryRecord>(`${API_URL}/deliveries`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateDelivery(token: string, id: string, data: { date: string; delivered: number }) {
  return axios.put<DeliveryRecord>(`${API_URL}/deliveries/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteDelivery(token: string, id: string) {
  return axios.delete(`${API_URL}/deliveries/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
