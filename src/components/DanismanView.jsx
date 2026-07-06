import { useState, useEffect } from "react";
import { storage } from "../lib/storage";
import { DECISION_EXAMPLES } from "../data/constants";

export default function DanismanView({ appName, initialScale }) {
  const [scale, setScale]       = useState(initialScale || "1000");
  const [budget, setBudget]     = useState("Ücretsiz");
  const [decision, setDecision] = useState("");
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");
  const [loaded, setLoaded]     = useState(false);

  // Açılışta kayıtlı geçmişi yükle
  useEffect(() => {
    (async () => {
      try {
        const saved = await storage.get("danisman-history", false);
        if (saved && saved.value) {
          const parsed = JSON.parse(saved.value);
          if (Array.isArray(parsed)) setHistory(parsed);
        }
      } catch (_) {
        // kayıtlı geçmiş yok
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Geçmiş değiştikçe kaydet
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await storage.set("danisman-history", JSON.stringify(history), false); } catch (_) {}
    })();
  }, [history, loaded]);

  const ask = (text) => {
    const d = (text ?? decision).trim();
    if (!d || loading) return;
    setLoading(true);
    setErr("");
    const dLower = d.toLowerCase();
    const scaleNum = parseInt(scale.replace(/[^0-9]/g,"")) || 1000;
    const isFree = budget === "Ücretsiz";
    let verdict, feedback;
    if (dLower.includes("flutter")) {
      verdict = "Uygun";
      feedback = `Flutter, ${appName || "bu proje"} için mükemmel bir seçim. Tek kod tabanıyla Android, iOS ve Web hedeflenir. ${scaleNum >= 100000 ? "100K+ kullanıcı için backend servis katmanı gerekecek — Flutter buna hazır." : "Beklenen ölçek için yeterli."} ${isFree ? "Ücretsiz geliştirilebilir, Play Store/App Store lisans ücretleri dışında maliyetsiz." : ""}`;
    } else if (dLower.includes("sqlite") || dLower.includes("hive")) {
      verdict = scaleNum > 10000 ? "Riskli" : "Uygun";
      feedback = scaleNum > 10000 ? `SQLite/Hive ${scaleNum.toLocaleString()} kullanıcı için riskli. Yerel veritabanı tek cihazda mükemmel çalışır; ancak çok kullanıcılı senkronizasyon için Supabase veya Firebase Firestore eklemeyi düşün. Hibrit: offline-first + opsiyonel bulut sync.` : `SQLite/Hive ${scaleNum.toLocaleString()} kullanıcı için yeterli. Yerel depolama, internet gerektirmez, ücretsizdir. Şifreli depolama için flutter_secure_storage ekle.`;
    } else if (dLower.includes("firebase")) {
      verdict = isFree ? "Riskli" : "Uygun";
      feedback = isFree ? `Firebase ücretsiz katmanı (Spark) ${scaleNum > 10000 ? "bu ölçek için yetersiz kalır" : "başlangıç için yeterli"}. Okuma/yazma limitlerine dikkat et. Alternatif: Supabase tamamen açık kaynak ve daha cömert ücretsiz katman sunar.` : `Firebase ${scaleNum.toLocaleString()} kullanıcı için güçlü bir seçim. Auth, Firestore ve Crashlytics entegrasyonu kolaydır. Maliyet takibi için alert kur.`;
    } else if (dLower.includes("react native")) {
      verdict = "Uygun";
      feedback = `React Native ${appName || "bu proje"} için geçerli bir seçenek. JavaScript/TypeScript bilgin varsa verimli olur. Flutter ile karşılaştırma: Flutter daha tutarlı UI, React Native daha geniş ekosistem. ${isFree ? "Her ikisi de ücretsiz." : ""} Ekip bilgisine göre karar ver.`;
    } else if (dLower.includes("postgresql") || dLower.includes("supabase")) {
      verdict = scaleNum < 100 ? "Riskli" : "Uygun";
      feedback = scaleNum < 100 ? `PostgreSQL/Supabase ${scaleNum} kullanıcı için fazla karmaşık. Bu ölçekte SQLite veya Hive yeterli — kurulum ve bakım maliyeti düşük. Büyüyünce Supabase'e migrate kolay.` : `PostgreSQL/Supabase ${scaleNum.toLocaleString()} kullanıcı için sağlam seçim. Row Level Security ile güvenli, gerçek zamanlı özellikler için idealdir. Supabase ücretsiz katmanı başlangıç için yeterli.`;
    } else if (dLower.includes("ücretsiz") || dLower.includes("offline")) {
      verdict = "Uygun";
      feedback = `Ücretsiz/offline yaklaşım ${appName || "bu proje"} için mükemmel bir strateji. Flutter + Hive/SQLite ile tamamen ücretsiz, internetsiz çalışan bir uygulama yapılabilir. Bölüm 19 "Offline Uygulama Mimarı" prensibini takip et. İleride bulut eklemek isteğe bağlı açılabilir.`;
    } else {
      verdict = "Riskli";
      feedback = `"${d}" kararı ${scaleNum.toLocaleString()} kullanıcı ve ${budget} bütçe için değerlendirildi. Önce bu kararın projenin temel gereksinimlerini karşılayıp karşılamadığını doğrula. Alternatif araştır, küçük prototiyle test et, sonra taahhüt ver.`;
    }
    setHistory((h) => [{ decision: d, verdict, feedback }, ...h]);
    setDecision("");
    setLoading(false);
  };

  const verdictStyle = (v) => {
    if (v === "Uygun")      return { color: "#43e97b", bg: "rgba(67,233,123,0.12)",  icon: "✓" };
    if (v === "Riskli")     return { color: "#f4c55a", bg: "rgba(244,197,90,0.12)",  icon: "⚠" };
    return                          { color: "#ff6584", bg: "rgba(255,101,132,0.12)", icon: "✕" };
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 14, lineHeight: 1.6 }}>
        Teknoloji veya mimari kararını yaz, danışman projenin ölçeğine göre değerlendirsin. Örn: <em>"SQLite kullanacağım"</em>, <em>"Flutter ile yapacağım"</em>.
      </p>

      {/* Bağlam seçicileri */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 160px" }}>
          <label style={{ display: "block", fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, marginBottom: 4 }}>KULLANICI SAYISI</label>
          <select value={scale} onChange={(e) => setScale(e.target.value)}
            style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
            <option value="100">~100</option>
            <option value="1000">~1.000</option>
            <option value="10000">~10.000</option>
            <option value="100000+">100.000+</option>
          </select>
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <label style={{ display: "block", fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, marginBottom: 4 }}>BÜTÇE</label>
          <select value={budget} onChange={(e) => setBudget(e.target.value)}
            style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
            <option>Ücretsiz</option>
            <option>Düşük bütçe</option>
            <option>Ücretli / yatırımlı</option>
          </select>
        </div>
      </div>

      {/* Karar girişi */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder='Örn: "Firebase kullanacağım"'
          style={{ flex: 1, background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 13, padding: "9px 12px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
        />
        <button onClick={() => ask()} disabled={loading || !decision.trim()}
          style={{ background: loading ? "#2f3a5c" : "#6c63ff", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, padding: "9px 16px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
          {loading ? "..." : "Sor"}
        </button>
      </div>

      {/* Hızlı örnekler */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {DECISION_EXAMPLES.map((ex) => (
          <button key={ex} onClick={() => ask(ex)} disabled={loading}
            style={{ background: "transparent", border: "1px solid #28304a", borderRadius: 20, color: "#7a7a9a", fontSize: 11, padding: "3px 10px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {ex}
          </button>
        ))}
      </div>

      {err && (
        <div style={{ marginBottom: 12, background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12 }}>
          {err}
        </div>
      )}

      {/* Geçmiş */}
      {history.length === 0 && !loading ? (
        <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 24, textAlign: "center" }}>
          <p style={{ color: "#4a4a6a", fontSize: 12 }}>Henüz değerlendirilmiş bir karar yok.<br/>Yukarıdan bir karar yaz veya örneklerden seç.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {loading && (
            <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14, color: "#4a4a6a", fontSize: 12 }}>
              Değerlendiriliyor...
            </div>
          )}
          {history.map((h, i) => {
            const vs = verdictStyle(h.verdict);
            return (
              <div key={i} style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 8 }}>"{h.decision}"</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: vs.bg, color: vs.color, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontFamily: "monospace", fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>
                  <span>{vs.icon}</span><span>{(h.verdict || "").toUpperCase()}</span>
                </div>
                <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.7, margin: 0 }}>{h.feedback}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

