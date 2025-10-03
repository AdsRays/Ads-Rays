/**
 * AdsRays Tilda bridge — многократные плашки.
 * Каждая плашка — контейнер .adsr-acc. Внутри:
 *  - .adsr-pill (клик/Enter/Space раскрывает)
 *  - .adsr-pill__icon (текст +/–)
 *  - .adsr-panel (контент, скрывается/раскрывается)
 *  - .adsr-pdfBtn (кнопка «Сохранить отчёт в PDF» для этой плашки)
 *  - .adsr-ctrInfo (элемент с подсказкой про CTR)
 */
(function(){
  const API_BASE = "https://adsrays-api.onrender.com"; // прод API

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
    return await rsp.blob();
  }

  function wireAccordion(acc){
    const pill  = acc.querySelector(".adsr-pill");
    const icon  = acc.querySelector(".adsr-pill__icon");
    const panel = acc.querySelector(".adsr-panel");

    if (!pill || !panel || !icon) return;

    function setOpen(open){
      if (open){
        acc.classList.add("adsr-open");
        pill.setAttribute("aria-expanded","true");
        panel.setAttribute("aria-hidden","false");
        icon.textContent = "–";
      } else {
        acc.classList.remove("adsr-open");
        pill.setAttribute("aria-expanded","false");
        panel.setAttribute("aria-hidden","true");
        icon.textContent = "+";
      }
    }

    // начальное состояние
    setOpen(acc.classList.contains("adsr-open"));

    if (!pill.__adsrBound){
      pill.__adsrBound = true;
      pill.addEventListener("click", ()=> setOpen(!acc.classList.contains("adsr-open")));
      pill.addEventListener("keydown", (e)=>{
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          setOpen(!acc.classList.contains("adsr-open"));
        }
      });
    }

    // кнопка PDF внутри этой плашки (не глобально)
    const pdfBtn = acc.querySelector(".adsr-pdfBtn");
    if (pdfBtn && !pdfBtn.__adsrBound){
      pdfBtn.__adsrBound = true;
      pdfBtn.addEventListener("click", async (e)=>{
        e.preventDefault();
        pdfBtn.disabled = true;
        try {
          const blob = await postPdf();
          saveBlobAs(blob, "report.pdf");
        } catch(err){
          alert("Ошибка генерации PDF: " + err.message);
        } finally {
          pdfBtn.disabled = false;
        }
      });
    }

    // подсказка CTR в рамках этой плашки
    const ctr = acc.querySelector(".adsr-ctrInfo");
    if (ctr && !ctr.title){
      ctr.title = "CTR = клики / показы × 100%. Чем выше, тем лучше.";
    }
  }

  function wireAll(){
    document.querySelectorAll(".adsr-acc").forEach(wireAccordion);
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", wireAll);
  } else {
    wireAll();
  }
})();