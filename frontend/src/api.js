import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const predictNews = async (text) => {
  const { data } = await api.post('/predict', { text });
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get('/history');
  return data;
};

export const clearHistory = async () => {
  const { data } = await api.delete('/history');
  return data;
};

export const getModelInfo = async () => {
  const { data } = await api.get('/model-info');
  return data;
};

export const checkHealth = async () => {
  try {
    const { data } = await api.get('/health');
    return data;
  } catch {
    return { status: 'offline', model_loaded: false };
  }
};

export default api;
