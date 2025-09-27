import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "/api" });

export const getOverview        = async () => (await api.get("/demo/overview")).data;
export const getRecommendations = async () => (await api.get("/demo/recommendations")).data;
export const getCreatives       = async () => (await api.get("/demo/creatives")).data;

export const generatePdf = async (payload: any) =>
  (await api.post("/report/pdf", payload, { responseType: "blob" })).data;
