import './i18n';
import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from './store';
import { getCreatives, getOverview, getRecommendations, postForecast, generatePdf, uploadCsv, uploadScreenshot } from './api';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

const currency = (n: number) => `$${n.toFixed(0)}`;

export default function App() {
  const { niche, setNiche, lang, setLang, forecast, setForecast } = useAppStore();
  const [overview, setOverview] = useState<any>(null);
  const [recs, setRecs] = useState<string[]>([]);
  const [creatives, setCreatives] = useState<any[]>([]);
  const [budget, setBudget] = useState(1000);
  const [sim, setSim] = useState({ audience: 'broad', time: '08:00-20:00', bid: 50, format: 'reels' as 'reels'|'stories'|'feed' });

  useEffect(() => {
    getOverview().then(setOverview);
    getRecommendations().then(setRecs);
    getCreatives().then(setCreatives);
  }, []);

  useEffect(() => {
    postForecast({ budget, ...sim }).then(setForecast);
  }, [budget, sim, setForecast]);

  const chartData = useMemo(() => {
    if (!forecast?.revenue && !forecast?.liftPercent) return [];
    const base = 10;
    return Array.from({ length: base }, (_, i) => ({
      day: i + 1,
      value: (forecast.revenue ?? forecast.liftPercent ?? 0) * (0.6 + 0.1 * i)
    }));
  }, [forecast]);

  const onPdf = async () => {
    const payload = {
      summary: overview,
      top: creatives.slice(0, 2),
      flop: creatives.slice(2),
      recommendations: recs
    };
    const blob = await generatePdf(payload);
    const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adsrays-report.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onCsv = async (file: File) => {
    const res = await uploadCsv(file);
    alert(`3 проблемы:\n- ${res.problems.join('\n- ')}\n\n3 действия:\n- ${res.actions.join('\n- ')}`);
  };
  const onScreenshot = async (file: File) => {
    const res = await uploadScreenshot(file);
    alert(`OCR: 3 проблемы:\n- ${res.problems.join('\n- ')}\n\n3 действия:\n- ${res.actions.join('\n- ')}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AdsRays Demo</h1>
        <div className="flex gap-2 items-center">
          <select className="border rounded px-2 py-1" value={niche} onChange={e => setNiche(e.target.value as any)}>
            <option value="coffee">Кофе</option>
            <option value="cosmetics">Косметика</option>
            <option value="fashion">Одежда</option>
          </select>
          <select className="border rounded px-2 py-1" value={lang} onChange={e => setLang(e.target.value as any)}>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-medium mb-2">Светофор кампаний</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TrafficCard title="Сливает" color="bg-red-100" value={overview?.red} />
          <TrafficCard title="На грани" color="bg-yellow-100" value={overview?.yellow} />
          <TrafficCard title="Золото" color="bg-green-100" value={overview?.green} />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Бюджет</span>
            <span>{currency(budget)}</span>
          </div>
          <input type="range" min={100} max={5000} value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full" />
          <div className="text-sm text-gray-600 mt-2">
            {forecast?.revenue ? `Прогноз: +${currency(forecast.revenue)} / +${forecast.orders} заказов в мес` : `Прогноз: +${(forecast?.liftPercent ?? 0).toFixed(0)}% / +${forecast?.orders ?? 0} заказов`}
          </div>
          <AreaChart width={520} height={220} data={chartData} className="mt-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </div>
        <div className="p-4 bg-white rounded shadow space-y-3">
          <h3 className="font-medium">Что если…</h3>
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded px-2 py-1" placeholder="Аудитория" value={sim.audience} onChange={e => setSim(s => ({ ...s, audience: e.target.value }))} />
            <input className="border rounded px-2 py-1" placeholder="Время (например 08:00-20:00)" value={sim.time} onChange={e => setSim(s => ({ ...s, time: e.target.value }))} />
            <input className="border rounded px-2 py-1" placeholder="Ставка" type="number" value={sim.bid} onChange={e => setSim(s => ({ ...s, bid: Number(e.target.value) }))} />
            <select className="border rounded px-2 py-1" value={sim.format} onChange={e => setSim(s => ({ ...s, format: e.target.value as any }))}>
              <option value="reels">Reels</option>
              <option value="stories">Stories</option>
              <option value="feed">Feed</option>
            </select>
          </div>
          <button onClick={() => postForecast({ budget, ...sim }).then(setForecast)} className="bg-blue-600 text-white px-3 py-2 rounded">Пересчитать</button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-2">3 действия сейчас</h3>
          <ul className="list-disc pl-5 space-y-1">
            {recs.map((r, i) => (
              <li key={i}>{r} <button className="ml-2 text-blue-600 underline" onClick={() => setSim(s => ({ ...s, audience: 'retarget' }))}>Применить в симуляторе</button></li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-2">Битва креативов</h3>
          <div className="grid grid-cols-2 gap-3">
            {creatives.map(c => (
              <div key={c.id} className="border rounded p-3">
                <div className="flex justify-between"><span>{c.title}</span><span>{c.tag}</span></div>
                <div className="text-sm text-gray-600">CTR: {c.ctr}% • CPA: ${c.cpa}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex gap-3">
        <button onClick={onPdf} className="bg-purple-600 text-white px-3 py-2 rounded">PDF для партнёра</button>
        <label className="bg-gray-200 px-3 py-2 rounded cursor-pointer">Загрузить CSV
          <input type="file" accept=".csv" className="hidden" onChange={e => e.target.files && onCsv(e.target.files[0])} />
        </label>
        <label className="bg-gray-200 px-3 py-2 rounded cursor-pointer">Загрузить скрин
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && onScreenshot(e.target.files[0])} />
        </label>
        <button className="bg-green-600 text-white px-3 py-2 rounded">Подключить Ads Manager за $10/мес</button>
      </section>
    </div>
  );
}

function TrafficCard({ title, color, value }: { title: string; color: string; value?: any }) {
  if (!value) return <div className={`p-4 rounded ${color}`}>{title}</div>;
  return (
    <div className={`p-4 rounded ${color}`}>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-700">Бюджет: {currency(value.spend)} • Заказы: {value.orders} • ROI: {(value.roi * 100).toFixed(0)}%</div>
    </div>
  );
}


