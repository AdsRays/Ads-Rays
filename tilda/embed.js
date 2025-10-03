// AdsRays embed: рисует список кампаний с аккордеонами и PDF-кнопкой.
(function(){
  const API = (document.currentScript && document.currentScript.dataset.api) || "https://adsrays-api.onrender.com";
  const rootId = (document.currentScript && document.currentScript.dataset.root) || "adsr-root";

  function qs(sel, el){ return (el||document).querySelector(sel); }
  function qsa(sel, el){ return Array.from((el||document).querySelectorAll(sel)); }

  function saveBlobAs(blob, filename){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename || "report.pdf";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  async function fetchJSON(url){ const r = await fetch(url); if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); }
  async function postPDF(){ const r = await fetch(API+"/api/report/pdf", {method:"POST"}); if(!r.ok) throw new Error("HTTP "+r.status); return r.blob(); }

  function adjustSectionHeight(el){
    const rec = el.closest?.(".t-rec"); if(!rec) return;
    const h = rec.scrollHeight || el.scrollHeight; if(h>0) rec.style.height = (h+20)+"px";
  }

  function renderCampaign(c){
    // контейнер одной кампании
    const wrap = document.createElement("div");
    wrap.className = "adsr-acc"; wrap.style.margin = "12px 0";

    wrap.innerHTML = `
      <div class="adsr-pill" role="button" tabindex="0" aria-expanded="false" style="width:1200px;height:35px;position:relative;box-sizing:border-box;background:#1A2049;border:1px solid #383F70;border-radius:28px;cursor:pointer;user-select:none;">
        <div class="adsr-pill__icon" style="position:absolute;left:10px;top:50%;transform:translateY(-11px);width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:400;font-size:12px;line-height:20px;padding:0;color:#B3B3B3;background:#595E81;border:1px solid rgba(0,0,0,0.06);">+</div>
        <div class="adsr-pill__text" style="position:absolute;left:35px;top:50%;transform:translateY(-50%);color:#B3B3B3;font-family:PT Sans,Arial,sans-serif;font-size:14px;line-height:22px;width:900px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
        <div class="adsr-pill__meta" style="position:absolute;left:976px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:10px;color:#B3B3B3;font-family:PT Sans,Arial,sans-serif;font-size:14px;">В кампании <span style="margin:0 4px;">${c.creatives?.length||0}</span> креатива:</div>
        <div class="adsr-pill__dot" style="position:absolute;top:50%;transform:translateY(-50%);left:1143px;width:20px;height:20px;border-radius:50%;background:#FFF37D;border:1px solid rgba(0,0,0,.08);box-shadow:0 1px 0 rgba(0,0,0,.35), inset 0 -1px 0 rgba(0,0,0,.15);"></div>
        <div class="adsr-pill__dot" style="position:absolute;top:50%;transform:translateY(-50%);left:1169px;width:20px;height:20px;border-radius:50%;background:#92C681;border:1px solid rgba(0,0,0,.08);box-shadow:0 1px 0 rgba(0,0,0,.35), inset 0 -1px 0 rgba(0,0,0,.15);"></div>
      </div>
      <div class="adsr-panel" aria-hidden="true" style="max-height:0;overflow:hidden;transition:max-height .26s ease;margin-top:10px;">
        <div class="adsr-actions" style="display:flex;gap:10px;align-items:center;margin:8px 0;">
          <button class="adsr-pdfBtn" style="background:#2B3270;color:#fff;border:1px solid rgba(255,255,255,0.1);padding:6px 12px;border-radius:10px;cursor:pointer;font-family:PT Sans,Arial,sans-serif;font-size:13px;">Сохранить отчёт в PDF</button>
          <span class="adsr-ctrInfo" title="CTR = клики / показы × 100%. Чем выше, тем лучше." style="color:#BFC3E0;font-size:12px;">CTR</span>
        </div>
        <table style="width:100%; border-collapse:collapse; color:#fff; margin-top:6px; font-family:PT Sans,Arial,sans-serif; font-size:13px;">
          <thead><tr><th style="text-align:left; padding:8px 10px; font-weight:600;">Креатив</th><th style="text-align:left; padding:8px 10px;">Показатель</th></tr></thead>
          <tbody>${(c.creatives||[]).map(cr=>`<tr>
            <td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">${cr.name}</td>
            <td style="padding:8px 10px; border-top:1px solid rgba(255,255,255,0.03);">Данные</td>
          </tr>`).join("")}</tbody>
        </table>
      </div>
    `;

    qs(".adsr-pill__text", wrap).textContent = c.name;

    const pill  = qs(".adsr-pill", wrap);
    const icon  = qs(".adsr-pill__icon", wrap);
    const panel = qs(".adsr-panel", wrap);
    function setOpen(open){
      if(open){
        wrap.classList.add("adsr-open");
        pill.setAttribute("aria-expanded","true");
        panel.setAttribute("aria-hidden","false");
        panel.style.maxHeight = "420px";
        icon.textContent = "–";
      } else {
        wrap.classList.remove("adsr-open");
        pill.setAttribute("aria-expanded","false");
        panel.setAttribute("aria-hidden","true");
        panel.style.maxHeight = "0";
        icon.textContent = "+";
      }
      adjustSectionHeight(wrap);
    }
    pill.addEventListener("click", ()=> setOpen(!wrap.classList.contains("adsr-open")));
    pill.addEventListener("keydown",(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); setOpen(!wrap.classList.contains("adsr-open")); }});

    const pdfBtn = qs(".adsr-pdfBtn", wrap);
    pdfBtn.addEventListener("click", async (e)=>{
      e.preventDefault(); pdfBtn.disabled = true;
      try { const blob = await postPDF(); saveBlobAs(blob, "report.pdf"); }
      catch(err){ alert("Ошибка генерации PDF: "+err.message); }
      finally { pdfBtn.disabled = false; }
    });

    return wrap;
  }

  async function boot(){
    const root = document.getElementById(rootId);
    if(!root){ console.warn("[AdsRays] #"+rootId+" not found"); return; }
    const data = await fetchJSON(API+"/api/campaigns");
    const items = data.items || [];
    root.innerHTML = "";
    items.forEach(c=> root.appendChild(renderCampaign(c)));
    // финальная подстройка
    setTimeout(()=>{ const el = root.closest(".t-rec") || root; if(el) el.style.height = (el.scrollHeight+20)+"px"; }, 50);
    window.addEventListener("resize", ()=>{ const el = root.closest(".t-rec")||root; if(el) el.style.height = (el.scrollHeight+20)+"px"; });
  }

  if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded", boot); } else { boot(); }
})();