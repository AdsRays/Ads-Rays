export default function Home() {
  return (
    <main style={{minHeight:"100vh",background:"#0b0f16",color:"#e6e8eb",padding:24,fontFamily:"Arial, sans-serif"}}>
      <h1>AdsRays — сайт работает</h1>
      <p>
        Служебные ссылки:{" "}
        <a href="/api/healthz" style={{color:"#7dd3fc"}}>/api/healthz</a>{" | "}
        <a href="/api/__version" style={{color:"#7dd3fc"}}>/api/__version</a>{" | "}
        <a href="/api/proxy/campaigns" style={{color:"#7dd3fc"}}>/api/proxy/campaigns</a>
      </p>
      <p><a href="/embed/adsr.js?v=NOW" style={{color:"#7dd3fc"}}>embed/adsr.js</a></p>
      <div id="adsr-root"></div>
      <script src="/embed/adsr.js?v=NOW" data-root="adsr-root" data-api="/api/proxy/campaigns"></script>
    </main>
  );
}
