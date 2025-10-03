/**
 * AdsRays Tilda bridge (минимум логики, простой JS без сборки)
 * Требуется: кнопка с id="pdfBtn"; элемент с id="ctrInfo" (для подсказки).
 */
(function(){
  const API_BASE = "https://adsrays-api.onrender.com"; // твой Render API

  function saveBlobAs(blob, filename){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename || "report.pdf";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  async function postPdf(){
    const rsp = await fetch(API_BASE + "/api/report/pdf", { method: "POST" });
    if (!rsp.ok) throw new Error("HTTP " + rsp.status);
    const blob = await rsp.blob();
    saveBlobAs(blob, "report.pdf");
  }

  // Привязка к кнопке
  function wire(){
    const btn = document.getElementById("pdfBtn");
    if (btn && !btn.__adsraysBound){
      btn.__adsraysBound = true;
      btn.addEventListener("click", async (e)=>{
        e.preventDefault();
        btn.disabled = true;
        try { await postPdf(); }
        catch(err){ alert("Ошибка генерации PDF: " + err.message); }
        finally { btn.disabled = false; }
      });
    }
    // Подсказка при наведении на CTR — простая, через title
    const ctr = document.getElementById("ctrInfo");
    if (ctr && !ctr.title){
      ctr.title = "CTR = клики / показы × 100%. Чем выше, тем лучше.";
    }
  }

  // Ждём готовности DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();