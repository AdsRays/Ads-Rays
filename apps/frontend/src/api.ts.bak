import axios from 'axios';
import type { ForecastParams } from './store';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || '/api' });

export const getOverview = () => api.get('/api/demo/overview').then(r => r.data);
export const getRecommendations = () => api.get('/api/demo/recommendations').then(r => r.data);
export const getCreatives = () => api.get('/api/demo/creatives').then(r => r.data);
export const postForecast = (body: ForecastParams) => api.post('/api/demo/forecast', body).then(r => r.data);
export const uploadCsv = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/api/audit/upload-csv', fd).then(r => r.data);
};
export const uploadScreenshot = (file: File) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post('/api/audit/upload-screenshot', fd).then(r => r.data);
};
export const generatePdf = (payload: any) => api.post('/api/report/pdf', payload, { responseType: 'blob' }).then(r => r.data);


