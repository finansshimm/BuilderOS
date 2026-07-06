import { useState } from "react";

const SABLON_KATEGORILERI = [
  { id: "eticaret",  label: "E-Ticaret",       icon: "🛒", hazir: ["Hazır mimari", "Hazır güvenlik", "Hazır klasörler", "Hazır roadmap", "Hazır audit"] },
  { id: "sosyal",    label: "Sosyal Medya",    icon: "💬", hazir: ["Hazır yapı", "Hazır modüller", "Hazır güvenlik", "Hazır test planı"] },
  { id: "saglik",    label: "Sağlık",          icon: "🏥", hazir: ["Hazır güvenlik", "Hazır veri sistemi", "Hazır audit", "Hazır yedekleme"] },
  { id: "egitim",    label: "Eğitim",          icon: "🎓", hazir: ["Hazır ilerleme sistemi", "Hazır kullanıcı sistemi", "Hazır istatistik sistemi"] },
  { id: "harita",    label: "Harita",          icon: "🗺️" },
  { id: "muzik",     label: "Müzik",           icon: "🎵" },
  { id: "fotograf",  label: "Fotoğraf",        icon: "📷" },
  { id: "rezervasyon", label: "Rezervasyon",   icon: "📅" },
  { id: "finans",    label: "Finans",          icon: "💰" },
  { id: "takvim",    label: "Takvim",          icon: "🗓️" },
  { id: "oyun",      label: "Oyun",            icon: "🎮" },
  { id: "dedektif",  label: "Dedektif Oyunu",  icon: "🕵️", hazir: [
      "Hazır 2D üstten/yan/izometrik görünüm mimarisi (Flame motoru ile)",
      "Hazır NPC sistemi (isim, bölüm, güven, yalanSoyler, diyaloglar)",
      "Hazır Delil sistemi (isim, açıklama, bulundu)",
      "Hazır savegame.json kayıt sistemi (bölüm, deliller, görevler)",
      "Hazır sorgulama sistemi (Baskı yap / Sakin konuş / Kanıt göster / Yalanını yakala → stres/güven/itiraf)",
      "Hazır 10 bölümlük hikâye iskeleti (vaka → şüpheliler → ihanet → final)",
      "Hazır harita sistemi (Ev/Karakol/Laboratuvar/Mahalle/Depo/Mezarlık/Tersane/Liman/Otel/Tüneller)",
      "Hazır atmosfer katmanı (yağmur/sis/karanlık sokak/siren/ayak sesi — ses ve görsel efekt klasörleri)",
      "100% offline, ücretsiz, reklamsız, API/AI servisi gerektirmez — SQLite + SharedPreferences + JSON",
    ] },
  { id: "verimlilik", label: "Verimlilik",     icon: "✅" },
  { id: "ajanda",    label: "Ajanda",          icon: "📒" },
  { id: "yapayzeka", label: "Yapay Zekâ",      icon: "🤖" },
  { id: "icerik",    label: "İçerik Yönetimi", icon: "🗂️" },
  { id: "forum",     label: "Forum",           icon: "🗣️" },
  { id: "blog",      label: "Blog",            icon: "✍️" },
  { id: "haber",     label: "Haber",           icon: "📰" },
];

export default function SablonMotoruView() {
  const [selected, setSelected] = useState(null);
  const [loading]                = useState(false);
  const [detay, setDetay]       = useState(null);
  const [err, setErr]            = useState("");

  const pickCategory = (kat) => {
    setSelected(kat);
    setDetay(null);
    setErr("");
    // Bölüm 22'de zaten hazır liste tanımlı kategoriler için ek AI çağrısı gerekmez
    if (kat.hazir) {
      setDetay({ hazir: kat.hazir });
      return;
    }
    const sablonlar = {
      harita:      { hazir: ["Hazır GPS entegrasyon mimarisi", "Hazır konum gizliliği güvenlik seti", "Hazır harita klasörleri (maps/, location/, geocoding/)", "Hazır offline harita roadmap", "Hazır konum audit checklist"] },
      muzik:       { hazir: ["Hazır ses oynatma mimarisi", "Hazır telif hakkı güvenlik seti", "Hazır müzik klasörleri (player/, library/, streaming/)", "Hazır playlist roadmap", "Hazır medya audit checklist"] },
      fotograf:    { hazir: ["Hazır medya yönetim mimarisi", "Hazır EXIF/gizlilik güvenlik seti", "Hazır fotoğraf klasörleri (gallery/, editor/, storage/)", "Hazır filtre modülü roadmap", "Hazır medya audit checklist"] },
      rezervasyon: { hazir: ["Hazır takvim entegrasyon mimarisi", "Hazır ödeme güvenlik seti", "Hazır rezervasyon klasörleri (booking/, calendar/, payments/)", "Hazır bildirim sistemi roadmap", "Hazır rezervasyon audit checklist"] },
      finans:      { hazir: ["Hazır fintech mimari seti", "Hazır PCI-DSS güvenlik seti", "Hazır finans klasörleri (transactions/, wallet/, reports/)", "Hazır grafik modülü roadmap", "Hazır finans audit checklist"] },
      takvim:      { hazir: ["Hazır takvim senkronizasyon mimarisi", "Hazır veri şifreleme güvenlik seti", "Hazır takvim klasörleri (events/, reminders/, sync/)", "Hazır tekrar eden etkinlik roadmap", "Hazır takvim audit checklist"] },
      oyun:        { hazir: ["Hazır oyun döngüsü mimarisi", "Hazır anti-cheat güvenlik seti", "Hazır oyun klasörleri (game_engine/, assets/, leaderboard/)", "Hazır çok oyunculu roadmap", "Hazır oyun audit checklist"] },
      verimlilik:  { hazir: ["Hazır görev yönetim mimarisi", "Hazır veri şifreleme güvenlik seti", "Hazır verimlilik klasörleri (tasks/, projects/, analytics/)", "Hazır entegrasyon roadmap", "Hazır verimlilik audit checklist"] },
      ajanda:      { hazir: ["Hazır not alma mimarisi", "Hazır yerel şifreleme güvenlik seti", "Hazır ajanda klasörleri (notes/, tags/, search/)", "Hazır export özelliği roadmap", "Hazır ajanda audit checklist"] },
      yapayzeka:   { hazir: ["Hazır AI entegrasyon mimarisi", "Hazır veri gizliliği güvenlik seti", "Hazır AI klasörleri (models/, inference/, data/)", "Hazır model güncelleme roadmap", "Hazır AI audit checklist"] },
      icerik:      { hazir: ["Hazır CMS mimarisi", "Hazır içerik moderasyon güvenlik seti", "Hazır CMS klasörleri (content/, categories/, media/)", "Hazır yayın akışı roadmap", "Hazır içerik audit checklist"] },
      forum:       { hazir: ["Hazır topluluk platform mimarisi", "Hazır moderasyon güvenlik seti", "Hazır forum klasörleri (threads/, comments/, votes/)", "Hazır bildirim roadmap", "Hazır forum audit checklist"] },
      blog:        { hazir: ["Hazır blog platform mimarisi", "Hazır SEO ve gizlilik güvenlik seti", "Hazır blog klasörleri (posts/, comments/, tags/)", "Hazır editor roadmap", "Hazır blog audit checklist"] },
      haber:       { hazir: ["Hazır haber akışı mimarisi", "Hazır kaynak doğrulama güvenlik seti", "Hazır haber klasörleri (articles/, feeds/, categories/)", "Hazır öneri sistemi roadmap", "Hazır haber audit checklist"] },
    };
    setDetay(sablonlar[kat.id] || { hazir: ["Hazır mimari seti", "Hazır güvenlik planı", "Hazır klasör yapısı", "Hazır roadmap şablonu", "Hazır audit checklist"] });
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 16, lineHeight: 1.7 }}>
        Sistem içerisinde yüzlerce hazır şablon bulunur. Bir kategori seç —
        sistem en yakın kategoriye bağlanır ve hazır mimari, güvenlik, klasör, roadmap, audit setini gösterir.
        Bu sayede sıfırdan düşünmek zorunda kalmazsın.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: 16 }}>
        {SABLON_KATEGORILERI.map((kat) => (
          <div
            key={kat.id}
            onClick={() => pickCategory(kat)}
            style={{
              background: selected?.id === kat.id ? "rgba(108,99,255,0.15)" : "#101526",
              border: `1px solid ${selected?.id === kat.id ? "#6c63ff" : "#28304a"}`,
              borderRadius: 8, padding: "10px 10px", cursor: "pointer", textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 4 }}>{kat.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: selected?.id === kat.id ? "#6c63ff" : "#a0a0c8" }}>{kat.label}</div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14, color: "#4a4a6a", fontSize: 12 }}>
          Şablon getiriliyor...
        </div>
      )}

      {err && (
        <div style={{ background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12, marginBottom: 14 }}>
          {err}
        </div>
      )}

      {selected && detay && (
        <div style={{ background: "#0c1124", border: "1px solid #28304a", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>{selected.icon}</span>
            <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#6c63ff" }}>{selected.label}</span>
            <span style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "monospace" }}>↓ HAZIR ŞABLON</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(detay.hazir || []).map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#43e97b", fontFamily: "monospace", fontSize: 12, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "#d0d0e8" }}>{h}</span>
              </div>
            ))}
          </div>

          {selected.id === "dedektif" && (
            <>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #28304a" }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 1, color: "#6c63ff", marginBottom: 8 }}>
                  10 BÖLÜMLÜK HİKÂYE — VAKA İSTANBUL
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    "1. Elif'in Ölümü — ev incelemesi, kan izi, telefon kayıtları, ilk şüpheli",
                    "2. Karakol — tanık sorgulama, eski dosyalar, parmak izi inceleme",
                    "3. Terk Edilmiş Depo — bulmaca, gizli belge",
                    "4. Yeraltı Bağlantıları — yeni örgüt üyeleri",
                    "5. Elif'in Geçmişi — büyük sır",
                    "6. Yanlış Şüpheli — oyuncunun kafası karışır",
                    "7. İhanet — yakın bir karakter örgütle bağlantılı çıkar",
                    "8. Örgüt Lideri — liderine yaklaşılır",
                    "9. Gerçek Katil — ortaya çıkmaya başlar",
                    "10. Final — tüm deliller birleşir, gerçek açıklanır",
                  ].map((b, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#a0a0c8", padding: "4px 0" }}>{b}</div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #28304a" }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 1, color: "#6c63ff", marginBottom: 8 }}>
                  ÖRNEK DART SINIFLARI
                </div>
                <pre style={{ background: "#161c32", borderRadius: 6, padding: "10px 12px", fontSize: 11, color: "#7a7a9a", overflowX: "auto", margin: 0, fontFamily: "monospace", lineHeight: 1.6 }}>
{`class NPC {
  String isim;
  int bolum;
  int guven;
  bool yalanSoyler;
  List<String> diyaloglar;
}

class Delil {
  String isim;
  String aciklama;
  bool bulundu;
}`}
                </pre>
              </div>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #28304a" }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 1, color: "#6c63ff", marginBottom: 8 }}>
                  HARİTA / MEKÂNLAR
                </div>
                <div style={{ fontSize: 12, color: "#a0a0c8" }}>
                  Ev · Karakol · Laboratuvar · Mahalle · Depo · Mezarlık · Tersane · Liman · Otel · Tüneller
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
