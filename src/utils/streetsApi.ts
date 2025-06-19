import axios from 'axios';

const API_URL = '/api/streets';

export const getStreets = async (token: string) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addStreet = async (name: string, googleMapsName: string, token: string) => {
  const res = await axios.post(
    API_URL,
    { name, googleMapsName },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateStreetsOrder = async (order: { _id: string; order: number }[], token: string) => {
  const res = await axios.patch(
    API_URL + '/order',
    { order },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteStreet = async (id: string, token: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
