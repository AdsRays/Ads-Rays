import React from "react";
import { generatePdfPOST, API_BASE } from "./api";

export default function App() {
  const onPostPdf = async () => {
    try {
      const blob = await generatePdfPOST();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "partner-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Ошибка при генерации PDF (POST)");
    }
  };

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h3>AdsRays Demo (минимальный UI)</h3>
      <div style={{ marginBottom: 8 }}>API_BASE: <code>{API_BASE}</code></div>
      <p>
        <a href={`${API_BASE}/api/report/pdf`} target="_blank" rel="noreferrer">
          Открыть PDF (GET)
        </a>
        {"  |  "}
        <button onClick={onPostPdf} style={{ padding: "6px 12px", cursor: "pointer" }}>
          PDF для партнёра (POST)
        </button>
      </p>
      <div>Готово.</div>
    </div>
  );
}
