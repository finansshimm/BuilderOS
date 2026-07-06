import { useState } from "react";
import { PHASES, DEV_PHASES } from "../data/phases";

export default function FazlarView({ appName, currentPhase, features }) {
  const [selected, setSelected] = useState(null);
  const [loading]                = useState(false);
  const [aiTip, setAiTip]       = useState(null);
  const [err]                   = useState("");

  const handleFazClick = (faz) => {
    if (selected?.num === faz.num) { setSelected(null); setAiTip(null); return; }
    setSelected(faz);
    setAiTip(null);
    if (!appName) return;
    const tips = {
      1: { tavsiye: `"${appName}" için Bilgi Merkezi fazında: yazılım kavramlarını öğrenmeden kod yazmaya başlama. Değişken, fonksiyon, sınıf ve API kavramlarını sırayla öğren.`, ornek: `"${appName}" bir Flutter uygulamasıdır. Flutter: Dart diliyle yazılır, widget'larla UI oluşturulur. İlk görev: main.dart dosyasını aç, Hello World yaz, çalıştır.`, uyari: "Her şeyi aynı anda öğrenmeye çalışmak — bölüm bölüm ilerle." },
      2: { tavsiye: `"${appName}" için Bina Metaforu fazında: projeyi P1–P20 adımlarıyla bölümlere ayır. Her adım tamamlanmadan diğerine geçme.`, ornek: `"${appName}" P${currentPhase} fazında: ${PHASES[Math.min(currentPhase-1, 19)]?.name || "aktif faz"} aşaması. Bu aşamanın görevlerini listele ve birer birer tamamla.`, uyari: "Bina katlarını atlamak — elektriği duvar örülmeden çekemezsin." },
      3: { tavsiye: `"${appName}" için Proje Üretici fazında: mimari belgeleri oluştur. Master Prompt, Architecture Manifest ve Feature Manifest hazır olsun.`, ornek: `"${appName}" için Architecture Manifest: Sunum → İş Mantığı → Veri katmanları. Feature Manifest: ${(features || []).slice(0,3).map(f=>f.name).join(", ")} — bu sırayla geliştir.`, uyari: "Belge yazıp çekmeciye koymak — her hafta belgeni güncelle ve referans al." },
      4: { tavsiye: `"${appName}" için AI Yardımcısı fazında: Claude veya ChatGPT çıktısını doğrudan kopyala-yapıştır yapma. Önce anla, sonra uygula.`, ornek: `Claude'a sor: "${appName} için kullanıcı giriş ekranı Flutter kodu yaz." Gelen kodu al, AI Yardımcısı sekmesine yapıştır, eksikleri gör.`, uyari: "AI çıktısını anlamadan uygulamak — zombi bug'ların ana kaynağı budur." },
      5: { tavsiye: `"${appName}" için Tam Öğrenme Döngüsünde: Öğren → Üret → Test et → Düzelt → Audit → Refactor → Yayınla → Ölçekle. Bu döngü hiç bitmez.`, ornek: `"${appName}" v1.0 yayında. Kullanıcılar giriş yapamıyor diyor. Döngü: hata logunu al → AI'a gönder → düzelt → test et → v1.0.1 yayınla.`, uyari: "Döngüyü kırmak: test etmeden yayınlamak veya audit yapmadan refactor." },
    };
    setAiTip(tips[faz.num] || { tavsiye: `Faz ${faz.num} için "${appName}" projesini sistematik ilerlet.`, ornek: "Küçük adımlar, büyük sonuçlar.", uyari: "Acele etmek — kaliteli yazılım zaman ister." });
  };

  // Mevcut P fazına göre tahmini Geliştirme Fazı
  const estimatedDevFaz = currentPhase <= 4 ? 1 : currentPhase <= 8 ? 2 : currentPhase <= 12 ? 3 : currentPhase <= 16 ? 4 : 5;

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 16, lineHeight: 1.7 }}>
        Bölüm 17 — Uygulama yapma yolculuğunun <strong style={{ color: "#6c63ff" }}>5 geliştirme fazı</strong>. Bina'daki P1–P20 ile paralel ilerler. Şu an tahminen <span style={{ color: "#43e97b", fontFamily: "monospace" }}>Faz {estimatedDevFaz}</span>'dasın.
      </p>

      {/* Faz kartları */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {DEV_PHASES.map((faz) => {
          const isActive   = faz.num === estimatedDevFaz;
          const isDone     = faz.num < estimatedDevFaz;
          const isSelected = selected?.num === faz.num;

          return (
            <div key={faz.num}>
              <div
                onClick={() => handleFazClick(faz)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: isSelected ? `${faz.color}18` : "#101526",
                  border: `1px solid ${isSelected ? faz.color : isDone ? faz.color + "44" : isActive ? faz.color : "#28304a"}`,
                  borderRadius: isSelected ? "10px 10px 0 0" : 10,
                  padding: "12px 14px", cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 8, background: `${faz.color}18`, border: `1px solid ${faz.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {isDone ? "✅" : isActive ? faz.icon : faz.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: faz.color, fontWeight: 700 }}>FAZ {faz.num}</span>
                    {isActive && <span style={{ fontSize: 9, fontFamily: "monospace", color: faz.color, background: `${faz.color}18`, padding: "1px 6px", borderRadius: 3 }}>🔨 AKTİF</span>}
                    {isDone   && <span style={{ fontSize: 9, fontFamily: "monospace", color: "#43e97b", background: "rgba(67,233,123,0.1)", padding: "1px 6px", borderRadius: 3 }}>✅ TAMAMLANDI</span>}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: faz.num > estimatedDevFaz ? "#4a4a6a" : "#e8e8f0" }}>{faz.label}</div>
                  <div style={{ fontSize: 11, color: "#7a7a9a", marginTop: 2, lineHeight: 1.4 }}>{faz.desc}</div>
                </div>
                <span style={{ color: "#4a4a6a", fontSize: 14, flexShrink: 0 }}>{isSelected ? "▲" : "▼"}</span>
              </div>

              {isSelected && (
                <div style={{ background: "#0c1124", border: `1px solid ${faz.color}`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 14px" }}>
                  {/* Adımlar */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "monospace", color: faz.color, letterSpacing: 1, marginBottom: 8 }}>BU FAZIN ADIMLAR</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {faz.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: faz.color, fontSize: 11, marginTop: 1, flexShrink: 0 }}>▸</span>
                          <span style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.4 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Çıktı */}
                  <div style={{ background: `${faz.color}10`, border: `1px solid ${faz.color}33`, borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "monospace", color: faz.color, marginBottom: 4 }}>🎯 FAZ ÇIKTISI</div>
                    <p style={{ fontSize: 12, color: "#d0d0e8", margin: 0 }}>{faz.cikti}</p>
                  </div>

                  {/* Proje notu */}
                  {appName && (
                    <div style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#f4c55a", letterSpacing: 1, marginBottom: 8 }}>📌 PROJEYE ÖZEL REHBER — {appName.toUpperCase()}</div>
                      {loading ? (
                        <p style={{ fontSize: 12, color: "#4a4a6a", margin: 0 }}>Hazırlanıyor...</p>
                      ) : err ? (
                        <p style={{ fontSize: 12, color: "#ff6584", margin: 0 }}>{err}</p>
                      ) : aiTip ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 10, color: "#43e97b", fontFamily: "monospace", marginBottom: 4 }}>TAVSİYE</div>
                            <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.7, margin: 0 }}>{aiTip.tavsiye}</p>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#6c63ff", fontFamily: "monospace", marginBottom: 4 }}>ÖRNEK</div>
                            <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.6, margin: 0 }}>{aiTip.ornek}</p>
                          </div>
                          <div style={{ background: "rgba(255,101,132,0.08)", border: "1px solid rgba(255,101,132,0.2)", borderRadius: 6, padding: "7px 10px" }}>
                            <div style={{ fontSize: 10, color: "#ff6584", fontFamily: "monospace", marginBottom: 4 }}>⚠ YAYGIN HATA</div>
                            <p style={{ fontSize: 12, color: "#d0d0e8", margin: 0 }}>{aiTip.uyari}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                  {!appName && (
                    <div style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 8, padding: 12, fontSize: 12, color: "#4a4a6a", textAlign: "center" }}>
                      Projeyi oluşturduktan sonra AI burada projeye özel tavsiye verecek.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Büyük Amaç */}
      <div style={{ marginTop: 20, background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 10, padding: "16px 18px" }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#6c63ff", letterSpacing: 1, marginBottom: 8 }}>🎯 MASTER VİZYON — BÖLÜM 25</div>
        <p style={{ fontSize: 13, color: "#d0d0e8", lineHeight: 1.8, margin: 0 }}>
          Bu sistemin amacı kod öğretmek değildir.<br />
          Amaç insanlara; <strong style={{ color: "#6c63ff" }}>uygulama düşünmeyi, planlamayı, tasarlamayı, inşa etmeyi, denetlemeyi, güvenliğini, bakımını ve ölçeklemeyi</strong> öğretmektir.
        </p>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Düşün","Planla","Tasarla","İnşa et","Denetle","Güvenli kıl","Bakımını yap","Ölçekle"].map((k, i) => (
            <span key={i} style={{ fontSize: 11, color: "#a0a0c8", background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 20, padding: "3px 12px" }}>{k}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── OFFLINE MOD: AI desteği kaldırıldı ──────────────────────────────────────
// callClaude ve parseJSON işlevleri kaldırıldı — tüm içerik şablon tabanlı üretilir.


