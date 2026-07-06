import { useState } from "react";

export default function AIYardimciView({ appName, features }) {
  const [pasted, setPasted]   = useState("");
  const [source, setSource]   = useState("Claude");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [err, setErr]         = useState("");

  const analyze = () => {
    const text = pasted.trim();
    if (!text || loading) return;
    setLoading(true);
    setErr("");
    setResult(null);
    const wordCount = text.split(/\s+/).length;
    const hasCode   = text.includes("void ") || text.includes("class ") || text.includes("import ") || text.includes("def ") || text.includes("function ");
    const hasJson   = text.startsWith("{") || text.startsWith("[");
    const featNames = (features || []).map(f => f.name);
    const missing   = featNames.filter(f => !text.toLowerCase().includes(f.toLowerCase())).slice(0,4);
    const parsed = {
      ozet: `${source} çıktısı analiz edildi (${wordCount} kelime). ${hasCode ? "Kod içeriği tespit edildi" : hasJson ? "Yapılandırılmış veri tespit edildi" : "Düz metin/plan içeriği tespit edildi"}. ${appName ? `"${appName}" projesi bağlamında ${missing.length > 0 ? missing.length + " eksik özellik bulundu" : "özellikler kapsanmış görünüyor"}.` : ""}`,
      eksikler: [
        ...(missing.length > 0 ? missing.map(m => `${m} özelliği bu çıktıda ele alınmamış`) : ["Tüm planlanan özellikler kapsanmış görünüyor"]),
        wordCount < 100 ? "Çıktı oldukça kısa — daha fazla detay istenebilir" : null,
        !text.toLowerCase().includes("hata") && !text.toLowerCase().includes("error") ? "Hata yönetimi senaryoları eksik" : null,
        !text.toLowerCase().includes("test") ? "Test stratejisi belirtilmemiş" : null,
      ].filter(Boolean).slice(0, 5),
      riskler: [
        "Kopyala-yapıştır öncesi kodu anladığından emin ol — zombi bug riski var",
        hasCode ? "Kod çalıştırılmadan önce test döngüsüne sok" : "Planı uygulamaya geçirmeden önce küçük prototiple doğrula",
        "Bu çıktı güncel olmayabilir — kütüphane versiyonlarını kontrol et",
        appName ? `"${appName}" projesinin spesifik gereksinimlerine uymayabilir` : "Projeye özgü düzenlemeler gerekebilir",
      ],
      oneriler: [
        "Bu çıktıyı AI Yardımcısı sekmesindeki Test Döngüsüne (Bölüm 7) göre işlet",
        hasCode ? "Kodu küçük parçalara böl, her parçayı ayrı test et" : "Planı P1–P20 bina adımlarıyla eşleştir",
        "Anlamadığın kısımları işaretle, AI'a tekrar sor — tüm çıktıyı körü körüne uygulama",
        "Audit sekmesinde proje sürümü için kontrol listesi çalıştır",
      ],
    };
    setTimeout(() => { setResult(parsed); setLoading(false); }, 200);
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 14, lineHeight: 1.6 }}>
        Claude, ChatGPT veya başka bir AI'dan aldığın çıktıyı (kod, plan, açıklama) yapıştır — sistem bu projenin ihtiyaçlarına göre eksikleri, riskleri ve önerileri çıkarsın.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
        <label style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, whiteSpace: "nowrap" }}>KAYNAK</label>
        <select value={source} onChange={(e) => setSource(e.target.value)}
          style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "6px 10px", fontFamily: "inherit", cursor: "pointer" }}>
          <option>Claude</option>
          <option>ChatGPT</option>
          <option>Gemini</option>
          <option>Diğer</option>
        </select>
      </div>

      <textarea
        value={pasted}
        onChange={(e) => setPasted(e.target.value)}
        placeholder="AI çıktısını (kod, plan, açıklama) buraya yapıştır..."
        rows={8}
        style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 8, color: "#e8e8f0", fontSize: 12, fontFamily: "monospace", padding: "12px 14px", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 10 }}
      />

      <button onClick={analyze} disabled={loading || !pasted.trim()}
        style={{ width: "100%", background: loading ? "#2f3a5c" : "#6c63ff", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, padding: "11px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 14 }}>
        {loading ? "⏳ Analiz ediliyor..." : "🔍 Analiz Et"}
      </button>

      {err && (
        <div style={{ marginBottom: 12, background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12 }}>
          {err}
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#6c63ff", letterSpacing: 1, marginBottom: 6 }}>ÖZET</div>
            <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.7, margin: 0 }}>{result.ozet}</p>
          </div>

          <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#ff6584", letterSpacing: 1, marginBottom: 8 }}>EKSİKLER</div>
            {(result.eksikler || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
                <span style={{ color: "#ff6584", fontSize: 11, marginTop: 1 }}>✕</span>
                <span style={{ fontSize: 12, color: "#d0d0e8" }}>{m}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#f4c55a", letterSpacing: 1, marginBottom: 8 }}>RİSKLER</div>
            {(result.riskler || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
                <span style={{ color: "#f4c55a", fontSize: 11, marginTop: 1 }}>⚠</span>
                <span style={{ fontSize: 12, color: "#d0d0e8" }}>{m}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#43e97b", letterSpacing: 1, marginBottom: 8 }}>ÖNERİLER</div>
            {(result.oneriler || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
                <span style={{ color: "#43e97b", fontSize: 11, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 12, color: "#d0d0e8" }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

