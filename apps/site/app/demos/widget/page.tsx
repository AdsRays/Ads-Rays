import Script from "next/script";

export const metadata = { title: "AdsRays Widget Demo" } as any;

export default function WidgetDemoPage() {
  return (
    <main style={{minHeight:"100vh",background:"#0f163b",color:"#fff",padding:"40px 0"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <h1 style={{fontSize:24,marginBottom:16}}>AdsRays — демо виджета</h1>

        <div id="adsr-root" />

        {/* Подключаем embed.js после интерактива страницы */}
        {/* data-атрибуты будут переданы как есть */}
        {/* @ts-ignore — чтобы TS не ругался на произвольные data-* */}
        <Script
          src="https://cdn.jsdelivr.net/gh/AdsRays/Ads-Rays@main/tilda/embed.js"
          strategy="afterInteractive"
          data-root="adsr-root"
          data-api="https://adsrays-api.onrender.com/api/campaigns"
        />
      </div>
    </main>
  );
}
