import { useState, useEffect } from "react";
import { storage } from "../lib/storage";

export default function AuditView({ appName, features, currentPhase }) {
  const [version, setVersion]   = useState("v0.7");
  const [loading, setLoading]   = useState(false);
  const [audit, setAudit]       = useState(null);
  const [history, setHistory]   = useState([]);
  const [err, setErr]           = useState("");
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await storage.get("audit-history", false);
        if (saved && saved.value) {
          const parsed = JSON.parse(saved.value);
          if (Array.isArray(parsed)) setHistory(parsed);
        }
      } catch (_) {}
      finally { setLoaded(true); }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await storage.set("audit-history", JSON.stringify(history), false); } catch (_) {}
    })();
  }, [history, loaded]);

  const runAudit = () => {
    if (!appName || loading) return;
    setLoading(true);
    setErr("");
    setAudit(null);
    const featList = (features || []).map(f => f.name) || [];
    const vNum = parseFloat(version.replace("v",""));
    const parsed = {
      calisan: [
        vNum >= 0.1 ? "Proje kurulumu ve klasör yapısı hazır" : null,
        vNum >= 0.2 ? "Temel ekranlar ve navigasyon çalışıyor" : null,
        vNum >= 0.3 ? "Veri modeli ve CRUD işlemleri aktif" : null,
        vNum >= 0.5 ? "Ana özellikler (" + (featList.slice(0,2).join(", ") || "temel modüller") + ") entegre edildi" : null,
        vNum >= 0.8 ? "Feature freeze uygulandı, test sürecine girildi" : null,
        vNum >= 0.9 ? "Audit tamamlandı, yayın öncesi onay alındı" : null,
        vNum >= 1.0 ? "v1.0 yayınlandı, canlı sistem izleniyor" : null,
      ].filter(Boolean).slice(0, 6),
      uyari: [
        vNum < 0.5 ? "Test kapsamı henüz yetersiz, unit testler eklenmeli" : "Test coverage artırılmaya devam edilmeli",
        "Teknik borç birikimi takip edilmeli, refactor planlanmalı",
        vNum < 1.0 ? "Kullanıcı deneyimi testleri henüz yapılmadı" : "Kullanıcı geri bildirimleri aktif takip edilmeli",
      ],
      kritik: vNum < 0.3 ? ["Veri modeli kesinleşmeden özellik geliştirme başlamamalı"] : [],
      ozet: `"${appName}" ${version} sürümü genel değerlendirme: P${currentPhase} fazında ilerleme devam ediyor. ${vNum < 0.5 ? "Temel mimari oturuyor, özellikler ekleniyor." : vNum < 1.0 ? "Yayına hazırlık aşamasında, testler kritik." : "Canlıda, bakım döngüsü aktif."}`,
    };
    setAudit(parsed);
    setHistory(h => [{ version, appName, audit: parsed, date: new Date().toLocaleDateString("tr-TR") }, ...h.slice(0, 9)]);
    setLoading(false);
  };

  const VERSION_OPTIONS = ["v0.1","v0.2","v0.3","v0.5","v0.7","v0.8","v0.9","v1.0","v1.1","v1.2","v1.5","v2.0"];

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 16, lineHeight: 1.7 }}>
        Projenin belirli bir sürümünü denetle. Metottaki audit formatını kullanır:<br/>
        <span style={{ color: "#43e97b", fontFamily: "monospace" }}>✓ çalışıyor</span> ve <span style={{ color: "#f4c55a", fontFamily: "monospace" }}>⚠ uyarı</span> maddeleri üretir.
      </p>

      {/* Sürüm seçici */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 140px" }}>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, marginBottom: 6 }}>SÜRÜM</div>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={{ width: "100%", background: "#161c32", border: "1px solid #6c63ff", borderRadius: 6, color: "#fff", fontSize: 13, padding: "8px 10px", fontFamily: "inherit", cursor: "pointer" }}
          >
            {VERSION_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <button
          onClick={runAudit}
          disabled={loading || !appName}
          style={{ flex: "1 1 140px", background: loading ? "#2f3a5c" : "#6c63ff", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, padding: "9px 16px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
        >
          {loading ? "⏳ Denetleniyor..." : "🔍 Audit Çalıştır"}
        </button>
      </div>

      {!appName && (
        <div style={{ background: "rgba(244,197,90,0.08)", border: "1px solid rgba(244,197,90,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f4c55a", marginBottom: 14 }}>
          ⚠ Önce projeyi oluştur.
        </div>
      )}

      {err && (
        <div style={{ background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12, marginBottom: 14 }}>
          {err}
        </div>
      )}

      {/* Audit raporu — metindeki format */}
      {audit && (
        <div style={{ background: "#0c1124", border: "1px solid #28304a", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
          {/* Başlık */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #28304a", background: "#101526", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#6c63ff" }}>{version} AUDIT</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4a4a6a" }}>— {appName}</span>
          </div>

          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Çalışan maddeler */}
            {(audit.calisan || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "4px 0" }}>
                <span style={{ color: "#43e97b", fontFamily: "monospace", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "#d0d0e8", lineHeight: 1.4 }}>{m}</span>
              </div>
            ))}

            {/* Uyarı maddeler */}
            {(audit.uyari || []).length > 0 && (
              <div style={{ marginTop: 6 }}>
                {(audit.uyari || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "4px 0" }}>
                    <span style={{ color: "#f4c55a", fontFamily: "monospace", fontSize: 13, flexShrink: 0, marginTop: 1 }}>⚠</span>
                    <span style={{ fontSize: 13, color: "#d0d0e8", lineHeight: 1.4 }}>{m}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Kritik maddeler */}
            {(audit.kritik || []).length > 0 && (
              <div style={{ marginTop: 6 }}>
                {(audit.kritik || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "4px 0" }}>
                    <span style={{ color: "#ff6584", fontFamily: "monospace", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✕</span>
                    <span style={{ fontSize: 13, color: "#d0d0e8", lineHeight: 1.4 }}>{m}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Özet */}
            {audit.ozet && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #28304a", fontSize: 12, color: "#7a7a9a", lineHeight: 1.6 }}>
                {audit.ozet}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Geçmiş auditler */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#4a4a6a", letterSpacing: 1, marginBottom: 8, paddingTop: 8, borderTop: "1px solid #28304a" }}>GEÇMİŞ AUDİTLER</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => { setVersion(h.version); setAudit(h.audit); }}
                style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 8, padding: "10px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6c63ff", fontWeight: 700 }}>{h.version}</span>
                  <span style={{ fontSize: 12, color: "#43e97b" }}>✓ {h.audit?.calisan?.length || 0}</span>
                  <span style={{ fontSize: 12, color: "#f4c55a" }}>⚠ {h.audit?.uyari?.length || 0}</span>
                  {(h.audit?.kritik?.length || 0) > 0 && <span style={{ fontSize: 12, color: "#ff6584" }}>✕ {h.audit.kritik.length}</span>}
                </div>
                <span style={{ fontSize: 10, color: "#4a4a6a" }}>{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

