import { useState, useEffect } from "react";
import { PHASES } from "../data/phases";

export default function BinaView({ currentPhase, setCurrentPhase, appName }) {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [phaseLoading, setPhaseLoading]   = useState(false);
  const [phaseDetail, setPhaseDetail]     = useState(null);
  const [hovered, setHovered]             = useState(null);
  const [animTick, setAnimTick]           = useState(0);

  // Aktif kat için titreşim animasyonu
  useEffect(() => {
    const t = setInterval(() => setAnimTick(n => n + 1), 900);
    return () => clearInterval(t);
  }, []);

  const getStatus = (phaseNum) => {
    if (phaseNum < currentPhase)  return "done";
    if (phaseNum === currentPhase) return "active";
    return "pending";
  };

  const handleFloorClick = (phase) => {
    setSelectedPhase(phase);
    if (appName) {
      setPhaseLoading(true);
      setPhaseDetail(null);
      const phaseNum = parseInt(phase.num.replace("P",""));
      const details = {
        1:  `"${appName}" — P1 Arazi Analizi: Hedef kitleyi netleştir. Kim kullanacak? Ne sorunu çözüyor? 3 rakibi incele, farkını belirle. AI'a sor: "${appName} için hedef kitle analizi yap ve temel problemi tanımla." Bu adım sağlam olmazsa P2'deki kararlar yanlış olur.`,
        2:  `"${appName}" — P2 Temel Hazırlama: Flutter + Dart seç. Proje klasörlerini oluştur. Git başlat. AI'a sor: "${appName} için Flutter proje yapısı ve teknoloji stack öner." Temel kararlar burada verilir — sonradan değiştirmek pahalıdır.`,
        3:  `"${appName}" — P3 Beton Dökme: Veri modelini tasarla. User, ana entity sınıflarını yaz. Veritabanı şemasını oluştur. AI'a sor: "${appName} için temel veri modelleri ve SQLite şeması yaz." Veri modeli değişirse her şey değişir — dikkatli ol.`,
        4:  `"${appName}" — P4 Kolonlar: Ana modülleri kodla. Auth, core servisler, provider yapısı kur. AI'a sor: "${appName} için authentication ve core servis katmanı Flutter kodu yaz." Kolonlar sağlam olursa üstüne her şey yapılabilir.`,
        5:  `"${appName}" — P5 Kat Yapısı: Tüm ekranları listele ve navigasyon akışını kur. Go Router veya Navigator 2.0 kullan. AI'a sor: "${appName} için ekran listesi ve Flutter navigasyon yapısı oluştur." UX sorunlarını şimdi yakala.`,
        6:  `"${appName}" — P6 Merdivenler: Deep link yapısı, route yönetimi, geri tuşu davranışları. AI'a sor: "${appName} için Flutter Go Router yapılandırması ve deep link şeması." Route çakışmaları geç fark edilirse çok zaman alır.`,
        7:  `"${appName}" — P7 Elektrik: API entegrasyonları, push notification, analytics. AI'a sor: "${appName} için HTTP servis katmanı ve Firebase push notification entegrasyonu." API değişiklikleri için interface kullan.`,
        8:  `"${appName}" — P8 Su Tesisatı: Cache mekanizması, offline senkronizasyon, background sync. AI'a sor: "${appName} için Hive ile offline-first mimari ve cache invalidation stratejisi." Cache hatası en yaygın zombi bug kaynağıdır.`,
        9:  `"${appName}" — P9 Çatı: Auth sistemi, token yönetimi, rol tabanlı erişim. AI'a sor: "${appName} için Flutter JWT token yönetimi ve secure storage kullanımı." Güvenlik katmanı en üstte ama en başta düşünülmeli.`,
        10: `"${appName}" — P10 Kapılar: Onboarding akışı, login/register ekranları, şifre sıfırlama. AI'a sor: "${appName} için modern Flutter onboarding ve auth ekranları tasarla." İlk izlenim kullanıcıyı tutar veya kaybettirir.`,
        11: `"${appName}" — P11 Pencereler: Custom widget'lar, responsive tasarım, dark/light mode. AI'a sor: "${appName} için Flutter custom widget kütüphanesi ve tema sistemi." Farklı ekran boyutlarını test etmeyi unutma.`,
        12: `"${appName}" — P12 İzolasyon: Global hata yönetimi, loading state'ler, empty state'ler, network fallback. AI'a sor: "${appName} için Flutter global error boundary ve graceful degradation." Hata olmayan uygulama yoktur — iyi yönetim şart.`,
        13: `"${appName}" — P13 Boya: UI polish, tema tutarlılığı, micro animasyonlar, skeleton loading. AI'a sor: "${appName} için Flutter animasyon ve UI polish rehberi." Performansı yiyen animasyonlardan kaçın.`,
        14: `"${appName}" — P14 İç Tasarım: Kullanıcı testi, UX akış optimizasyonu, geri bildirim mekanizması. AI'a sor: "${appName} için kullanılabilirlik testi checklist'i." Gerçek kullanıcıyla test et — varsayımına güvenme.`,
        15: `"${appName}" — P15 Güvenlik Sistemi: Güvenlik audit, GDPR uyumluluğu, penetrasyon testi planı. AI'a sor: "${appName} için Flutter güvenlik audit checklist ve GDPR uyum listesi." KVKK ve GDPR gerekliliklerini öğren.`,
        16: `"${appName}" — P16 Yangın Sistemi: Crash reporting (Firebase Crashlytics veya Sentry), monitoring, alert sistemi. AI'a sor: "${appName} için Firebase Crashlytics entegrasyonu ve monitoring kurulumu." Canlıdaki hatayı 5 dakikada öğren.`,
        17: `"${appName}" — P17 Asansör: Performans profili çıkar, darboğazları gider, pagination ekle. AI'a sor: "${appName} için Flutter performans optimizasyon checklist ve lazy loading." Flutter DevTools'u aktif kullan.`,
        18: `"${appName}" — P18 Denetim: Unit test coverage ölç, integration testleri yaz, final audit raporu. AI'a sor: "${appName} için Flutter test coverage raporu nasıl çıkarılır?" %70+ coverage hedefle.`,
        19: `"${appName}" — P19 Teslim: Store listing hazırla, ASO yap, soft launch planla. AI'a sor: "${appName} için App Store ve Google Play listing içerikleri yaz." Store reddi riskini azaltmak için kuralları oku.`,
        20: `"${appName}" — P20 Bakım: Kullanıcı geri bildirimlerini topla, bug fix döngüsü kur, v1.1 backlog oluştur. AI'a sor: "${appName} için post-launch bakım ve güncelleme döngüsü planı." Sessiz kullanıcı mutlu değil demektir.`,
      };
      setTimeout(() => {
        setPhaseDetail(details[phaseNum] || `"${appName}" — ${phase.num} ${phase.name} fazı: sistematik ilerleme ile bu aşama tamamlanabilir.`);
        setPhaseLoading(false);
      }, 200);
    }
  };

  const doneCount    = currentPhase - 1;
  const pct          = Math.round((doneCount / PHASES.length) * 100);

  // Renk hesapla: done=yeşil, active=mor+parlak, pending=karanlık
  const floorColor = (status, isHov) => {
    if (status === "done")   return isHov ? "#52f090" : "#43e97b";
    if (status === "active") return isHov ? "#8f8aff" : "#6c63ff";
    return isHov ? "#2e3858" : "#161c30";
  };
  const floorBg = (status, isHov) => {
    if (status === "done")   return isHov ? "rgba(67,233,123,0.25)" : "rgba(67,233,123,0.13)";
    if (status === "active") return isHov ? "rgba(108,99,255,0.45)" : "rgba(108,99,255,0.28)";
    return isHov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)";
  };

  // P1 altta, P20 üstte sıralanmış (bina gibi)
  const floorsBottomUp = [...PHASES]; // P1..P20, index 0=P1

  return (
    <div>
      {/* Üst bar: faz seçici + ilerleme */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", background: "#101526", border: "1px solid #28304a", borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, marginBottom: 6 }}>AKTİF FAZ</div>
          <select
            value={currentPhase}
            onChange={(e) => setCurrentPhase(Number(e.target.value))}
            style={{ width: "100%", background: "#161c32", border: "1px solid #6c63ff", borderRadius: 6, color: "#fff", fontSize: 12, padding: "6px 8px", fontFamily: "inherit", cursor: "pointer" }}
          >
            {PHASES.map((p, i) => (
              <option key={i} value={i + 1}>{p.num} — {p.name}</option>
            ))}
          </select>
        </div>
        {/* İlerleme özeti */}
        <div style={{ display: "flex", gap: 8, flex: "0 0 auto" }}>
          {[
            { val: doneCount, label: "Bitti", col: "#43e97b", bg: "rgba(67,233,123,0.1)", border: "rgba(67,233,123,0.3)" },
            { val: 1,         label: "Aktif", col: "#6c63ff", bg: "rgba(108,99,255,0.1)", border: "rgba(108,99,255,0.3)" },
            { val: PHASES.length - currentPhase, label: "Kalan", col: "#7a7a9a", bg: "rgba(255,255,255,0.04)", border: "#28304a" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: "8px 12px", textAlign: "center", minWidth: 54 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.col, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "#7a7a9a", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* İlerleme çubuğu */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1 }}>İNŞAAT İLERLEMESİ</span>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#43e97b", fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: "#161c30", borderRadius: 3, overflow: "hidden", position: "relative" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "linear-gradient(90deg,#6c63ff,#43e97b)",
            borderRadius: 3, transition: "width 0.6s ease",
            boxShadow: "0 0 8px rgba(67,233,123,0.5)",
          }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        {/* ── Animasyonlu Bina SVG Kolonu ── */}
        <div style={{ flex: "0 0 auto", width: 130 }}>
          {/* Anten / Tepe */}
          <div style={{ textAlign: "center", marginBottom: 2 }}>
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 2, height: 14, background: "#4a4a6a", margin: "0 auto" }} />
              <div style={{ width: 0, height: 0, borderLeft: "32px solid transparent", borderRight: "32px solid transparent", borderBottom: "20px solid #28304a" }} />
            </div>
          </div>

          {/* Katlar — P20 üstte P1 altta */}
          {[...floorsBottomUp].reverse().map((phase) => {
            const phaseNum = parseInt(phase.num.replace("P", ""));
            const status   = getStatus(phaseNum);
            const isHov    = hovered === phaseNum;
            const isSel    = selectedPhase?.num === phase.num;
            const isActive = status === "active";
            const pulse    = isActive && animTick % 2 === 0;

            return (
              <div
                key={phase.num}
                onClick={() => handleFloorClick(phase)}
                onMouseEnter={() => setHovered(phaseNum)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: isSel ? "rgba(108,99,255,0.4)" : floorBg(status, isHov),
                  border: `1px solid ${isSel ? "#a09aff" : floorColor(status, isHov)}`,
                  borderRadius: 3, padding: "3px 6px", marginBottom: 2,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  boxShadow: isActive ? `0 0 ${pulse ? "10px" : "4px"} rgba(108,99,255,${pulse ? "0.7" : "0.3"})` :
                             status === "done" ? "0 0 4px rgba(67,233,123,0.2)" : "none",
                  transform: isHov ? "translateX(2px)" : "none",
                }}
              >
                <span style={{ fontSize: 11, flexShrink: 0 }}>{phase.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 8, fontFamily: "monospace", color: floorColor(status, isHov), fontWeight: 700, lineHeight: 1.2 }}>{phase.num}</div>
                  <div style={{ fontSize: 8, color: status === "pending" && !isHov ? "#2f3a5c" : "#a0a0c8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.2 }}>{phase.bina}</div>
                </div>
                {status === "done"   && <span style={{ fontSize: 8 }}>✅</span>}
                {status === "active" && <span style={{ fontSize: 8 }}>{pulse ? "🔨" : "⚒️"}</span>}
              </div>
            );
          })}

          {/* Zemin */}
          <div style={{ background: "linear-gradient(90deg,#13182f,#28304a,#13182f)", borderRadius: "0 0 4px 4px", padding: "5px 8px", textAlign: "center", marginTop: 2, border: "1px solid #2c3650" }}>
            <span style={{ fontSize: 9, color: "#7a7a9a", fontFamily: "monospace" }}>🌍 ZEMİN</span>
          </div>
        </div>

        {/* ── Detay Paneli ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selectedPhase ? (
            <div style={{ background: "#101526", border: "1px dashed #28304a", borderRadius: 10, padding: 20, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontSize: 28 }}>🏗️</div>
              <p style={{ color: "#4a4a6a", fontSize: 12, textAlign: "center", lineHeight: 1.6, margin: 0 }}>
                Bir kata tıkla<br/>detayları gör
              </p>
              <p style={{ color: "#2f3a5c", fontSize: 10, textAlign: "center", margin: 0, fontFamily: "monospace" }}>
                {doneCount}/{PHASES.length} tamamlandı
              </p>
            </div>
          ) : (
            <div style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 10, padding: 14, animation: "fadeIn 0.2s ease" }}>
              {/* Başlık */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #28304a" }}>
                <span style={{ fontSize: 24 }}>{selectedPhase.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{selectedPhase.num} — {selectedPhase.name}</div>
                  <div style={{ fontSize: 9, color: "#7a7a9a", fontFamily: "monospace", marginTop: 2 }}>{selectedPhase.bina.toUpperCase()}</div>
                </div>
                <button
                  onClick={() => setCurrentPhase(parseInt(selectedPhase.num.replace("P","")))}
                  style={{ background: "rgba(108,99,255,0.2)", border: "1px solid #6c63ff", borderRadius: 6, color: "#6c63ff", fontSize: 10, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  Aktif Yap
                </button>
              </div>

              <p style={{ fontSize: 11, color: "#7a7a9a", marginBottom: 10, lineHeight: 1.5 }}>{selectedPhase.desc}</p>

              {/* Basit Açıklama — 12 yaş seviyesinde */}
              {selectedPhase.basit && (
                <div style={{ background: "rgba(244,197,90,0.08)", border: "1px solid rgba(244,197,90,0.25)", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontFamily: "monospace", color: "#f4c55a", letterSpacing: 1, marginBottom: 5 }}>🧒 BASİTÇE ANLATIRSAK</div>
                  <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.6, margin: 0 }}>{selectedPhase.basit}</p>
                </div>
              )}

              {/* Görevler */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: "#6c63ff", letterSpacing: 1, marginBottom: 5 }}>GÖREVLER</div>
                {selectedPhase.gorevler.map((g, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 3 }}>
                    <span style={{ color: "#43e97b", fontSize: 10, marginTop: 1, flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: 11, color: "#d0d0e8", lineHeight: 1.4 }}>{g}</span>
                  </div>
                ))}
              </div>

              {/* Nasıl Yapılır — somut, dolu örnekli rehber */}
              {selectedPhase.rehber && (
                <div style={{ background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.25)", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontFamily: "monospace", color: "#6c63ff", letterSpacing: 1, marginBottom: 5 }}>✏️ ŞİMDİ SEN DENE</div>
                  <p style={{ fontSize: 11.5, color: "#d0d0e8", lineHeight: 1.7, margin: 0 }}>{selectedPhase.rehber}</p>
                </div>
              )}

              {/* Teknolojiler — sadece P2'de, her aracın ne işe yaradığını tek tek açıklar */}
              {selectedPhase.teknolojiler && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontFamily: "monospace", color: "#f4c55a", letterSpacing: 1, marginBottom: 6 }}>🧰 KULLANACAĞIMIZ ARAÇLAR — TEK TEK AÇIKLAMA</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedPhase.teknolojiler.map((t, i) => (
                      <div key={i} style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 16 }}>{t.ikon}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.isim}</span>
                        </div>
                        <div style={{ marginBottom: 5 }}>
                          <span style={{ fontSize: 9, fontFamily: "monospace", color: "#43e97b", letterSpacing: 1 }}>NE İŞE YARAR? </span>
                          <span style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.6 }}>{t.ne}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: 9, fontFamily: "monospace", color: "#6c63ff", letterSpacing: 1 }}>NEDEN BUNU KULLANIYORUZ? </span>
                          <span style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.6 }}>{t.neden}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Riskler */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: "#ff6584", letterSpacing: 1, marginBottom: 5 }}>RİSKLER</div>
                {selectedPhase.riskler.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 3 }}>
                    <span style={{ color: "#ff6584", fontSize: 10, marginTop: 1, flexShrink: 0 }}>⚠</span>
                    <span style={{ fontSize: 11, color: "#d0d0e8", lineHeight: 1.4 }}>{r}</span>
                  </div>
                ))}
              </div>

              {/* AI Tavsiyesi */}
              {appName && (
                <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 9, fontFamily: "monospace", color: "#f4c55a", letterSpacing: 1, marginBottom: 6 }}>📌 PROJEYE ÖZEL REHBER — {appName.toUpperCase()}</div>
                  {phaseLoading ? (
                    <div style={{ color: "#4a4a6a", fontSize: 11 }}>Hazırlanıyor...</div>
                  ) : phaseDetail ? (
                    <p style={{ fontSize: 11, color: "#d0d0e8", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>{phaseDetail}</p>
                  ) : (
                    <p style={{ fontSize: 11, color: "#4a4a6a", margin: 0 }}>Proje oluşturulduktan sonra bu faz için hazır rehber burada görünür.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

