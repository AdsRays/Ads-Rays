import { create } from 'zustand';

type ForecastParams = {
  budget: number;
  audience: string;
  time: string;
  bid: number;
  format: 'reels' | 'stories' | 'feed';
};

type ForecastResult = {
  revenue?: number;
  liftPercent?: number;
  orders: number;
  roi: number;
  ci: { low: number; high: number };
};

type State = {
  niche: 'coffee' | 'cosmetics' | 'fashion';
  lang: 'ru' | 'en';
  forecast: ForecastResult | null;
  setNiche: (n: State['niche']) => void;
  setLang: (l: State['lang']) => void;
  setForecast: (f: ForecastResult) => void;
};

export const useAppStore = create<State>(set => ({
  niche: (import.meta.env.DEFAULT_NICHE as State['niche']) || 'coffee',
  lang: 'ru',
  forecast: null,
  setNiche: niche => set({ niche }),
  setLang: lang => set({ lang }),
  setForecast: forecast => set({ forecast })
}));

export type { ForecastParams, ForecastResult };



