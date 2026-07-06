import { useState } from "react";

const YASAM_STEPS = [
  { label: "Fikir",      icon: "💡", color: "#6c63ff", desc: "Hedef kitle, sorun, çözüm netleştirilir." },
  { label: "Mimari",     icon: "🏗️", color: "#3ad6e0", desc: "Architecture Manifest, klasör yapısı, modüller kurulur." },
  { label: "İskelet",    icon: "🦴", color: "#f4c55a", desc: "Proje kurulumu, boş yapı, CI/CD hazırlığı yapılır." },
  { label: "İnşaat",     icon: "🔨", color: "#ff6584", desc: "P1–P20 adımlarıyla özellikler eklenir." },
  { label: "Test",       icon: "🧪", color: "#43e97b", desc: "Unit, widget ve integration testler yazılır." },
  { label: "Denetim",    icon: "🔍", color: "#f4c55a", desc: "Audit listesi çalıştırılır, teknik borç ölçülür." },
  { label: "Teslim",     icon: "🚀", color: "#6c63ff", desc: "v1.0 yayınlanır. App Store / Play Store / Web." },
  { label: "Bakım",      icon: "🔧", color: "#3ad6e0", desc: "Bug fix döngüsü, kullanıcı geri bildirimleri toplanır." },
  { label: "Yenileme",   icon: "✨", color: "#43e97b", desc: "Refactor, performans, UI polish yapılır." },
  { label: "Genişleme",  icon: "📈", color: "#ff6584", desc: "v1.x ile yeni modüller, yeni platformlar eklenir." },
  { label: "v2.0",       icon: "🌟", color: "#6c63ff", desc: "Büyük yeniden yapılanma veya tamamen yeniden inşa." },
];

export default function YasamDongusuView({ appName, currentPhase }) {
  const [selected, setSelected] = useState(null);
  const [loading]                = useState(false);
  const [aiTip, setAiTip]       = useState(null);
  const [err]                    = useState("");

  // P1-P20 fazına göre tahmini yaşam döngüsü aşaması
  const estimatedStage = currentPhase <= 2 ? 0 : currentPhase <= 4 ? 2 : currentPhase <= 14 ? 3 : currentPhase <= 16 ? 4 : currentPhase <= 18 ? 5 : currentPhase <= 19 ? 6 : 7;

  const handleClick = (step, idx) => {
    if (selected === idx) { setSelected(null); setAiTip(null); return; }
    setSelected(idx);
    setAiTip(null);
    if (!appName) return;
    const tips = {
      "Fikir":     { durum: `"${appName}" fikir aşamasında: hedef kitle ve sorun netleştirilmeli, rakip analizi yapılmalı.`, yapilacaklar: ["Hedef kitleyi 1 cümleyle tanımla", "Temel problemi ve çözümü yaz", "3 rakip incele, farkını belirle"], dikkat: "Fikri mükemmelleştirmeye çalışmak — hızla prototipe geç." },
      "Mimari":    { durum: `"${appName}" mimari kararlar aşamasında: teknoloji seçimi ve klasör yapısı P2'de belirlenmeli.`, yapilacaklar: ["Teknoloji stack seç: Flutter + SQLite veya Firebase", "Klasör yapısını oluştur (core/, features/, screens/)", "Architecture Manifest belgesi yaz"], dikkat: "Mimariyi çok karmaşık yapmak — sadelik ölçeklenebilirlikten önce gelir." },
      "İskelet":   { durum: `"${appName}" iskelet kurulum aşamasında: boş proje, CI/CD ve versiyon kontrolü kurulacak.`, yapilacaklar: ["Flutter projesi oluştur: flutter create app_name", "Git başlat, .gitignore ekle", "Temel klasörleri ve boş dosyaları oluştur"], dikkat: "İskelet kurmadan özellik geliştirmeye başlamak — temel olmadan bina olmaz." },
      "İnşaat":    { durum: `"${appName}" aktif geliştirme aşamasında (P${currentPhase}): özellikler P1–P20 sırasıyla ekleniyor.`, yapilacaklar: ["Her P adımı için görev listesini tamamla", "Her özellik sonrası mini audit yap", "Hata çıktığında test döngüsünü işlet"], dikkat: "Birden fazla özelliği aynı anda geliştirmek — tek adım, tek test." },
      "Test":      { durum: `"${appName}" test aşamasında: unit, widget ve integration testler yazılıyor.`, yapilacaklar: ["Kritik fonksiyonlar için unit test yaz", "Ana ekranlar için widget test ekle", "Test coverage raporunu çıkar"], dikkat: "Testi sona bırakmak — her özellikle birlikte test yazılmalı." },
      "Denetim":   { durum: `"${appName}" audit aşamasında: kalite kontrol ve teknik borç ölçümü yapılıyor.`, yapilacaklar: ["Audit checklist çalıştır", "Teknik borç skorunu hesapla", "Güvenlik taraması yap"], dikkat: "Audit bulgularını not alıp çözmemek — her bulgu bir görev olmalı." },
      "Teslim":    { durum: `"${appName}" yayın aşamasında: App Store / Play Store veya web için hazırlık yapılıyor.`, yapilacaklar: ["Store listing ve ekran görüntüleri hazırla", "Soft launch: küçük kullanıcı grubuyla başla", "Crash reporting aracını aktif et"], dikkat: "Büyük lansman yerine aşamalı yayın tercih et — hataları erken yakala." },
      "Bakım":     { durum: `"${appName}" bakım döngüsünde: kullanıcı geri bildirimleri toplanıyor, bug fix yapılıyor.`, yapilacaklar: ["Kullanıcı geri bildirimlerini haftalık incele", "Kritik bug'ları önceliklendir", "v1.1 için backlog oluştur"], dikkat: "Geri bildirimlere tepkisiz kalmak — kullanıcı kaybının en hızlı yolu." },
    };
    const tip = tips[step.label] || {
      durum: `"${appName}" için ${step.label} aşaması: sistematik ilerleme ile bu aşama başarıyla tamamlanabilir.`,
      yapilacaklar: ["Bu aşamanın hedefini netleştir", "Küçük adımlara böl", "Her adımı tamamladıkça işaretle"],
      dikkat: "Aşamayı atlamak — her adım bir sonrakinin temelidir.",
    };
    setAiTip(tip);
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 16, lineHeight: 1.7 }}>
        Bölüm 24 — <strong style={{ color: "#6c63ff" }}>Bir bina nasıl yaşarsa, bir uygulama da yaşar.</strong> Fikir'den v2.0'a uzanan tam yaşam döngüsü. Tahmini aşama: <span style={{ color: "#43e97b", fontFamily: "monospace" }}>{YASAM_STEPS[estimatedStage]?.label}</span>
      </p>

      {/* Dikey zaman çizgisi */}
      <div style={{ position: "relative", paddingLeft: 24 }}>
        {/* Sol çizgi */}
        <div style={{ position: "absolute", left: 10, top: 20, bottom: 20, width: 2, background: "linear-gradient(180deg,#6c63ff,#43e97b)" }} />

        {YASAM_STEPS.map((step, idx) => {
          const isActive   = idx === estimatedStage;
          const isDone     = idx < estimatedStage;
          const isSelected = selected === idx;

          return (
            <div key={idx} style={{ marginBottom: 8, position: "relative" }}>
              {/* Nokta */}
              <div style={{
                position: "absolute", left: -20, top: 14,
                width: 14, height: 14, borderRadius: "50%",
                background: isActive ? step.color : isDone ? "#43e97b" : "#161c30",
                border: `2px solid ${isActive ? step.color : isDone ? "#43e97b" : "#2f3a5c"}`,
                boxShadow: isActive ? `0 0 8px ${step.color}` : "none",
                zIndex: 1,
              }} />

              {/* Kart */}
              <div
                onClick={() => handleClick(step, idx)}
                style={{
                  background: isSelected ? `${step.color}10` : "#101526",
                  border: `1px solid ${isSelected ? step.color : isActive ? step.color + "66" : isDone ? "#43e97b33" : "#28304a"}`,
                  borderRadius: isSelected ? "8px 8px 0 0" : 8,
                  padding: "10px 14px", cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{isDone && !isActive ? "✅" : step.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: idx > estimatedStage ? "#4a4a6a" : "#e8e8f0" }}>{step.label}</span>
                    {isActive && <span style={{ fontSize: 9, fontFamily: "monospace", color: step.color, background: `${step.color}18`, padding: "1px 6px", borderRadius: 3 }}>🔨 AKTİF</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#7a7a9a", marginTop: 2 }}>{step.desc}</div>
                </div>
                <span style={{ color: "#4a4a6a", fontSize: 12, flexShrink: 0 }}>{isSelected ? "▲" : "▼"}</span>
              </div>

              {/* Açık detay */}
              {isSelected && (
                <div style={{ background: "#0c1124", border: `1px solid ${step.color}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "12px 14px" }}>
                  {appName ? (
                    loading ? (
                      <p style={{ fontSize: 12, color: "#4a4a6a", margin: 0 }}>Hazırlanıyor...</p>
                    ) : err ? (
                      <p style={{ fontSize: 12, color: "#ff6584", margin: 0 }}>{err}</p>
                    ) : aiTip ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.7, margin: 0 }}>{aiTip.durum}</p>
                        <div>
                          <div style={{ fontSize: 10, color: step.color, fontFamily: "monospace", marginBottom: 6 }}>YAPILACAKLAR</div>
                          {(aiTip.yapilacaklar || []).map((y, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                              <span style={{ color: step.color, fontSize: 11 }}>▸</span>
                              <span style={{ fontSize: 12, color: "#d0d0e8" }}>{y}</span>
                            </div>
                          ))}
                        </div>
                        {aiTip.dikkat && (
                          <div style={{ background: "rgba(255,101,132,0.08)", border: "1px solid rgba(255,101,132,0.2)", borderRadius: 6, padding: "7px 10px", fontSize: 12, color: "#ff9090" }}>
                            ⚠ {aiTip.dikkat}
                          </div>
                        )}
                      </div>
                    ) : null
                  ) : (
                    <p style={{ fontSize: 12, color: "#4a4a6a", margin: 0, textAlign: "center" }}>Projeyi oluşturduktan sonra bu aşamaya özel tavsiye görünür.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

