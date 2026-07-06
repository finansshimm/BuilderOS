import { useState, useEffect } from "react";
import { storage } from "../lib/storage";

const ZOMBI_EXAMPLES = [
  "Kullanıcı kayıt olur, profil oluşur ama giriş ekranı güncellenmez",
  "Ürün sepete eklenir ama stok düşmez",
  "Şifre sıfırlama maili gider ama oturum kapatılmaz",
  "Bildirim gönderilir ama okundu olarak işaretlenmez",
  "Kullanıcı silinir ama yorumları kalmaya devam eder",
  "Ödeme onaylanır ama sipariş durumu güncellenmez",
];

export default function ZombiBugView() {
  const [scenario, setScenario] = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [history, setHistory]   = useState([]);
  const [err, setErr]           = useState("");
  const [loaded, setLoaded]     = useState(false);

  // Kayıtlı geçmişi yükle
  useEffect(() => {
    (async () => {
      try {
        const saved = await storage.get("zombi-history", false);
        if (saved && saved.value) {
          const parsed = JSON.parse(saved.value);
          if (Array.isArray(parsed)) setHistory(parsed);
        }
      } catch (_) {}
      finally { setLoaded(true); }
    })();
  }, []);

  // Geçmişi kaydet
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await storage.set("zombi-history", JSON.stringify(history), false); } catch (_) {}
    })();
  }, [history, loaded]);

  const analyze = (text) => {
    const s = (text ?? scenario).trim();
    if (!s || loading) return;
    setLoading(true);
    setErr("");
    setResult(null);
    const parsed = {
      zombiler: [
        {
          baslik: "UI Güncellenmeme Zombisi",
          nerede: "Ana ekran / state katmanı",
          nasil: "İşlem backend'de tamamlanır, ancak UI state güncellenmediği için kullanıcı eski veriyi görmeye devam eder.",
          etki: "Kullanıcı işlemin gerçekleştiğini zannetmez, tekrar dener.",
          cozum: "setState / notifyListeners çağrısının işlem sonrasında tetiklendiğini doğrula.",
          siddet: "Kritik",
        },
        {
          baslik: "Bağımlı Modül Senkron Sorunu",
          nerede: "Servis katmanı / bağımlı modüller",
          nasil: "Bir modülde değişen veri, bağımlı diğer modüle yansımaz; zincir kırılır.",
          etki: "Kullanıcı tutarsız veri görür, hata mesajı almaz.",
          cozum: "Event-driven yaklaşım veya reaktif stream ile modüller senkronize edilmeli.",
          siddet: "Orta",
        },
        {
          baslik: "Silinen Kaydın Hayaleti",
          nerede: "Veri katmanı / yerel cache",
          nasil: "Kayıt veritabanından silinir ama önbellekte yaşamaya devam eder.",
          etki: "Silinmiş içerik hâlâ görüntülenir, kullanıcı kafa karışıklığı yaşar.",
          cozum: "Silme işleminde hem DB hem cache temizlenmeli, invalidation stratejisi eklenmeli.",
          siddet: "Orta",
        },
        {
          baslik: "Hata Yutma Anti-Pattern",
          nerede: "try/catch blokları",
          nasil: "Hata catch'lenir ama ne loglanır ne de kullanıcıya bildirilir; sistem sessizce devam eder.",
          etki: "Kritik hatalar görünmez olur, zombi bug ürer.",
          cozum: "Her catch bloğuna log + kullanıcı bildirimi eklenmeli.",
          siddet: "Kritik",
        },
        {
          baslik: "Yetki Kontrolü Atlatması",
          nerede: "Navigasyon / route katmanı",
          nasil: "Çıkış yapıldıktan sonra deep link ile korumalı sayfalara erişilebilir.",
          etki: "Oturum açılmadan özel veriler görüntülenebilir.",
          cozum: "Her route değişiminde auth durumu kontrol edilmeli, guard eklenmeli.",
          siddet: "Kritik",
        },
      ],
      ozet: `"${s.slice(0,60)}..." senaryosunda 5 zombi bug tespit edildi. En tehlikelisi: UI güncellenmeme ve yetki kontrolü atlatma — her ikisi de kullanıcıya sessiz zarar verir.`,
      oncelik: "Tüm try/catch bloklarına log + bildirim ekle, UI state tetikleyicilerini doğrula.",
    };
    setResult(parsed);
    setHistory(h => [{ scenario: s, result: parsed, date: new Date().toLocaleDateString("tr-TR") }, ...h.slice(0, 9)]);
    setScenario("");
    setLoading(false);
  };

  const siddetStyle = (s) => {
    if (s === "Kritik") return { color: "#ff6584", bg: "rgba(255,101,132,0.12)", icon: "☠️" };
    if (s === "Orta")   return { color: "#f4c55a", bg: "rgba(244,197,90,0.12)",  icon: "⚠️" };
    return                     { color: "#43e97b", bg: "rgba(67,233,123,0.12)",  icon: "🔹" };
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 14, lineHeight: 1.7 }}>
        Bir kullanıcı senaryosu yaz. Sistem o akışta gizlenmiş, zincirleme yayılan <strong style={{ color: "#ff6584" }}>zombi bugları</strong> — yani çözülmüş görünen ama başka yerde yaşamaya devam eden hataları — bulacak.
      </p>

      {/* Giriş alanı */}
      <textarea
        value={scenario}
        onChange={(e) => setScenario(e.target.value)}
        placeholder="Örn: Kullanıcı kayıt olur, profil oluşur ama giriş ekranı güncellenmez..."
        rows={4}
        style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 8, color: "#e8e8f0", fontSize: 13, fontFamily: "inherit", padding: "12px 14px", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 10 }}
      />

      <button
        onClick={() => analyze()}
        disabled={loading || !scenario.trim()}
        style={{ width: "100%", background: loading ? "#2f3a5c" : "linear-gradient(135deg,#ff6584,#6c63ff)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, padding: "11px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 12 }}
      >
        {loading ? "🔍 Zombi buglar aranıyor..." : "🧠 Zombi Bug Tara"}
      </button>

      {/* Hızlı örnekler */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {ZOMBI_EXAMPLES.map((ex) => (
          <button key={ex} onClick={() => analyze(ex)} disabled={loading}
            style={{ background: "transparent", border: "1px solid #28304a", borderRadius: 20, color: "#7a7a9a", fontSize: 10, padding: "3px 10px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", lineHeight: 1.5 }}>
            {ex.length > 45 ? ex.slice(0, 45) + "…" : ex}
          </button>
        ))}
      </div>

      {err && (
        <div style={{ marginBottom: 12, background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12 }}>
          {err}
        </div>
      )}

      {/* Sonuç */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {/* Özet banner */}
          <div style={{ background: "rgba(255,101,132,0.08)", border: "1px solid rgba(255,101,132,0.25)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#ff6584", letterSpacing: 1, marginBottom: 6 }}>🧠 ANALİZ ÖZET</div>
            <p style={{ fontSize: 12, color: "#d0d0e8", margin: 0, lineHeight: 1.7 }}>{result.ozet}</p>
            {result.oncelik && (
              <div style={{ marginTop: 10, background: "rgba(255,101,132,0.12)", borderRadius: 6, padding: "7px 10px", fontSize: 11, color: "#ff6584" }}>
                🚨 <strong>Hemen çöz:</strong> {result.oncelik}
              </div>
            )}
          </div>

          {/* Zombi kartları */}
          {(result.zombiler || []).map((z, i) => {
            const ss = siddetStyle(z.siddet);
            return (
              <div key={i} style={{ background: "#101526", border: `1px solid ${ss.color}44`, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${ss.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>{ss.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{z.baslik}</div>
                    <div style={{ fontSize: 10, fontFamily: "monospace", color: "#4a4a6a", marginTop: 2 }}>{z.nerede}</div>
                  </div>
                  <span style={{ fontSize: 9, fontFamily: "monospace", color: ss.color, background: ss.bg, padding: "2px 8px", borderRadius: 3, fontWeight: 700 }}>{z.siddet?.toUpperCase()}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: "#f4c55a", whiteSpace: "nowrap", marginTop: 1 }}>NASIL</span>
                    <span style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.5 }}>{z.nasil}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: "#ff6584", whiteSpace: "nowrap", marginTop: 1 }}>ETKİ</span>
                    <span style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.5 }}>{z.etki}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: "#43e97b", whiteSpace: "nowrap", marginTop: 1 }}>ÇÖZÜM</span>
                    <span style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.5 }}>{z.cozum}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Geçmiş */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#4a4a6a", letterSpacing: 1, marginBottom: 10, paddingTop: 10, borderTop: "1px solid #28304a" }}>GEÇMİŞ TARAMALAR</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => setResult(h.result)}
                style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 8, padding: "10px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}
              >
                <span style={{ fontSize: 12, color: "#a0a0c8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.scenario}</span>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#ff6584", fontFamily: "monospace" }}>{h.result?.zombiler?.length || 0} zombi</span>
                  <span style={{ fontSize: 10, color: "#4a4a6a" }}>{h.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

