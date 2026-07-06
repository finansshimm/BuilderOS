import { useState } from "react";

const TEST_STEPS = [
  { id: 1, label: "AI kod üretir",         icon: "🤖", color: "#6c63ff" },
  { id: 2, label: "VS Code'a yapıştır",    icon: "📝", color: "#3ad6e0" },
  { id: 3, label: "Çalıştır",              icon: "▶️",  color: "#43e97b" },
  { id: 4, label: "Terminal hata verir",   icon: "❌", color: "#ff6584" },
  { id: 5, label: "Hataları AI'a gönder", icon: "📤", color: "#f4c55a" },
  { id: 6, label: "AI düzeltir",           icon: "🔧", color: "#6c63ff" },
  { id: 7, label: "Yenisini al",           icon: "⬇️",  color: "#3ad6e0" },
  { id: 8, label: "Hatalar azalır",        icon: "📉", color: "#43e97b" },
  { id: 9, label: "Audit yap",             icon: "✅", color: "#43e97b" },
  { id: 10, label: "İlerle",              icon: "🚀", color: "#6c63ff" },
];

export default function TestDongusuView() {
  const [activeStep, setActiveStep]   = useState(1);
  const [errorText, setErrorText]     = useState("");
  const [loading, setLoading]         = useState(false);
  const [aiResponse, setAiResponse]   = useState(null);
  const [err, setErr]                 = useState("");
  const [cycleCount, setCycleCount]   = useState(0);

  const sendError = () => {
    if (!errorText.trim() || loading) return;
    setLoading(true);
    setErr("");
    setAiResponse(null);
    setActiveStep(5);
    const txt = errorText.toLowerCase();
    let parsed;
    if (txt.includes("null") || txt.includes("nullpointer") || txt.includes("null check")) {
      parsed = { neden: "Null check hatası: beklenen değer null geldi, kontrol yapılmadan kullanılmaya çalışıldı.", cozum: "1) Hatanın geldiği satırı bul. 2) Değişkenin null olup olmadığını if ile kontrol et. 3) Flutter'da ?. operatörü veya ?? varsayılan değer kullan. 4) late kullanıyorsan başlatıldığından emin ol.", kodOrnek: "// Hatalı\nString name = user.name;\n\n// Doğru\nString name = user?.name ?? 'Anonim';", onlemler: ["Değişkenleri kullanmadan önce her zaman null kontrolü yap", "Dart null safety özelliğini aktif kullan: ? ve ! operatörlerini doğru uygula"], zombiRisk: "Bu null değer başka widget'lara veya servislere geçiyorsa, zincir boyunca crash üretir." };
    } else if (txt.includes("setState") || txt.includes("build") || txt.includes("widget")) {
      parsed = { neden: "setState dispose edilmiş widget üzerinde çağrıldı veya build döngüsü sırasında state değiştirilmeye çalışıldı.", cozum: "1) mounted kontrolü ekle: if (!mounted) return; 2) setState'i async işlem sonrasında çağırıyorsan await'ten sonra mounted kontrol et. 3) Gerekirse ChangeNotifier veya Riverpod kullan.", kodOrnek: "// Doğru kullanım\nvoid _update() async {\n  final data = await fetchData();\n  if (!mounted) return;\n  setState(() { _data = data; });\n}", onlemler: ["Her async setState öncesine if (!mounted) return; ekle", "Büyük uygulamalarda setState yerine state yönetim kütüphanesi tercih et"], zombiRisk: "Dispose edilmemiş listener varsa memory leak ve art arda crash oluşabilir." };
    } else if (txt.includes("http") || txt.includes("socket") || txt.includes("network") || txt.includes("connection")) {
      parsed = { neden: "Ağ bağlantısı hatası: sunucuya ulaşılamıyor veya istek zaman aşımına uğradı.", cozum: "1) İnternet bağlantısını kontrol et. 2) URL'nin doğru olduğunu doğrula. 3) Timeout süresi ekle. 4) Offline mod için fallback mekanizması kur. 5) Retry mantığı ekle.", kodOrnek: "final response = await http.get(\n  Uri.parse(url),\n  headers: headers,\n).timeout(Duration(seconds: 10));", onlemler: ["Her HTTP çağrısına timeout ekle", "Connectivity paketi ile bağlantı durumunu önceden kontrol et"], zombiRisk: "Hata yakalanmazsa loading ekranı sonsuza kadar döner, kullanıcı uygulamanın bozuk olduğunu düşünür." };
    } else {
      parsed = { neden: "Hata mesajı analiz edildi: kodun çalışma akışında beklenmedik bir durum oluştu.", cozum: "1) Hata satırına git ve değişken değerlerini print ile logla. 2) try/catch bloğu ekle. 3) Flutter DevTools ile breakpoint koy. 4) Hatadan önceki son başarılı durumu belirle.", kodOrnek: "try {\n  // hatalı kod\n} catch (e, stack) {\n  print('HATA: $e');\n  print('STACK: $stack');\n}", onlemler: ["Kritik işlemleri her zaman try/catch ile sar", "Flutter Inspector ve DevTools'u aktif kullan"], zombiRisk: "Yakalanmayan exception'lar başka modüllerde sessiz hatalara yol açabilir — log sistemi şart." };
    }
    setAiResponse(parsed);
    setActiveStep(6);
    setCycleCount(c => c + 1);
    setLoading(false);
  };

  const nextCycle = () => {
    setActiveStep(1);
    setErrorText("");
    setAiResponse(null);
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 16, lineHeight: 1.7 }}>
        Bölüm 7 — <strong style={{ color: "#6c63ff" }}>İteratif geliştirme döngüsü</strong>. AI kod üretir → çalıştırırsın → hata gelir → AI'a gönderirsin → düzelir → tekrar edersin. Döngü sayısı: <span style={{ color: "#43e97b", fontFamily: "monospace" }}>{cycleCount}</span>
      </p>

      {/* Döngü adımları */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {TEST_STEPS.map((s) => {
          const isActive = s.id === activeStep;
          const isDone   = s.id < activeStep;
          return (
            <div
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: isActive ? `${s.color}22` : isDone ? "rgba(67,233,123,0.08)" : "#101526",
                border: `1px solid ${isActive ? s.color : isDone ? "#43e97b44" : "#28304a"}`,
                borderRadius: 8, padding: "7px 10px", cursor: "pointer",
                transition: "all 0.15s", flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14 }}>{isDone && s.id !== activeStep ? "✅" : s.icon}</span>
              <span style={{ fontSize: 11, color: isActive ? s.color : isDone ? "#43e97b" : "#4a4a6a", fontWeight: isActive ? 700 : 400 }}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Hata giriş bölümü */}
      <div style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 10, padding: "16px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#f4c55a", letterSpacing: 1, marginBottom: 8 }}>
          ADIM 4 — TERMINAL HATASINI YAPISTIR
        </div>
        <textarea
          value={errorText}
          onChange={(e) => { setErrorText(e.target.value); setActiveStep(4); }}
          placeholder="Terminal hatasını veya hata mesajını buraya yapıştır...&#10;Örn: Exception: Null check operator used on a null value&#10;     at _HomeScreenState.build (home_screen.dart:45)"
          rows={6}
          style={{ width: "100%", background: "#0a0e1f", border: "1px solid #28304a", borderRadius: 6, color: "#c8f0a0", fontSize: 12, fontFamily: "monospace", padding: "10px 12px", resize: "vertical", outline: "none", lineHeight: 1.7, boxSizing: "border-box", marginBottom: 10 }}
        />
        <button
          onClick={sendError}
          disabled={loading || !errorText.trim()}
          style={{ width: "100%", background: loading ? "#2f3a5c" : "linear-gradient(135deg,#ff6584,#6c63ff)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, padding: "11px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
        >
          {loading ? "🔍 AI analiz ediyor..." : "📤 Hatayı AI'a Gönder (Adım 5)"}
        </button>
      </div>

      {err && (
        <div style={{ marginBottom: 12, background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12 }}>
          {err}
        </div>
      )}

      {/* AI Cevabı */}
      {aiResponse && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          <div style={{ background: "#0c1124", border: "1px solid #6c63ff", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", background: "rgba(108,99,255,0.15)", borderBottom: "1px solid #6c63ff44", fontSize: 10, fontFamily: "monospace", color: "#6c63ff", letterSpacing: 1 }}>
              🤖 ADIM 6 — AI DÜZELTME ÖNERİSİ
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "#f4c55a", fontFamily: "monospace", marginBottom: 4 }}>NEDEN</div>
                <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.7, margin: 0 }}>{aiResponse.neden}</p>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#43e97b", fontFamily: "monospace", marginBottom: 4 }}>ÇÖZÜM</div>
                <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.7, margin: 0 }}>{aiResponse.cozum}</p>
              </div>
              {aiResponse.kodOrnek && (
                <div>
                  <div style={{ fontSize: 10, color: "#3ad6e0", fontFamily: "monospace", marginBottom: 4 }}>KOD</div>
                  <pre style={{ background: "#0a0e1f", borderRadius: 6, padding: "10px 12px", fontSize: 11, color: "#c8f0a0", fontFamily: "monospace", lineHeight: 1.7, margin: 0, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{aiResponse.kodOrnek}</pre>
                </div>
              )}
              {(aiResponse.onlemler || []).length > 0 && (
                <div>
                  <div style={{ fontSize: 10, color: "#6c63ff", fontFamily: "monospace", marginBottom: 6 }}>ÖNLEMLER</div>
                  {(aiResponse.onlemler || []).map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                      <span style={{ color: "#6c63ff", fontSize: 11 }}>▸</span>
                      <span style={{ fontSize: 12, color: "#d0d0e8" }}>{o}</span>
                    </div>
                  ))}
                </div>
              )}
              {aiResponse.zombiRisk && (
                <div style={{ background: "rgba(255,101,132,0.08)", border: "1px solid rgba(255,101,132,0.2)", borderRadius: 6, padding: "8px 12px" }}>
                  <div style={{ fontSize: 10, color: "#ff6584", fontFamily: "monospace", marginBottom: 4 }}>🧟 ZOMBİ RISK</div>
                  <p style={{ fontSize: 12, color: "#d0d0e8", margin: 0 }}>{aiResponse.zombiRisk}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={nextCycle}
            style={{ background: "rgba(67,233,123,0.15)", border: "1px solid #43e97b", borderRadius: 8, color: "#43e97b", fontSize: 13, fontWeight: 600, padding: "11px", cursor: "pointer", fontFamily: "inherit" }}
          >
            🔄 Yeni Döngü Başlat (Adım 1'e Dön)
          </button>
        </div>
      )}

      {/* AI Maliyet Optimizasyon ipuçları - Bölüm 13 */}
      <div style={{ background: "rgba(244,197,90,0.06)", border: "1px solid rgba(244,197,90,0.2)", borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#f4c55a", letterSpacing: 1, marginBottom: 10 }}>💡 BÖLÜM 13 — AI MALİYET OPTİMİZASYONU</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8 }}>
          {[
            { icon: "✂️", tip: "Küçük parçalarla çalış" },
            { icon: "📄", tip: "Tek dosya gönder" },
            { icon: "🎯", tip: "Sadece ilgili kodu gönder" },
            { icon: "🚫", tip: "Gereksiz bağlam gönderme" },
            { icon: "🔍", tip: "Audit kullan" },
            { icon: "📝", tip: "Özet üret" },
            { icon: "🗺️", tip: "Bağımlılık haritası çıkar" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#101526", borderRadius: 6, padding: "7px 10px" }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <span style={{ fontSize: 11, color: "#a0a0c8" }}>{t.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

