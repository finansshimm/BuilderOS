import { useState } from "react";

const DOC_TYPES = [
  { id: "readme",    label: "README.md",       icon: "📖", color: "#6c63ff", desc: "Projeye giriş, kurulum, kullanım kılavuzu" },
  { id: "changelog", label: "CHANGELOG.md",    icon: "📝", color: "#3ad6e0", desc: "Sürüm geçmişi ve değişiklik listesi" },
  { id: "audit",     label: "AUDIT_REPORT.md", icon: "✅", color: "#43e97b", desc: "Kapsamlı audit ve kalite raporu" },
  { id: "bug",       label: "BUG_REPORT.md",   icon: "🐛", color: "#ff6584", desc: "Bilinen buglar ve çözüm durumları" },
  { id: "depmap",    label: "DEPENDENCY_MAP.md",icon: "🗺️", color: "#f4c55a", desc: "Modüller arası bağımlılık haritası" },
  { id: "arch",      label: "ARCHITECTURE.md", icon: "🏗️", color: "#ff9f5a", desc: "Sistem mimarisi ve tasarım kararları" },
];

export default function DokumantasyonView({ appName, features, result, currentPhase }) {
  const [selectedDoc, setSelectedDoc] = useState(DOC_TYPES[0]);
  const [loading, setLoading]         = useState(false);
  const [output, setOutput]           = useState(null);
  const [copied, setCopied]           = useState(false);
  const [err, setErr]                 = useState("");

  const generate = () => {
    if (!appName || loading) return;
    setLoading(true);
    setErr("");
    setOutput(null);
    const featList   = (features || []).map(f => `- **${f.name}** (${f.priority}, Risk: ${f.risk}) — ${f.desc || ""}`).join("\n") || "- Henüz belirlenmedi";
    const healthStr  = (result?.health  || []).map(h => `- ${h.label}: **${h.value}/100**`).join("\n") || "- Sağlık skoru hesaplanmadı";
    const today = new Date().toLocaleDateString("tr-TR");
    let out = "";
    if (selectedDoc.id === "readme") {
      out = `# ${appName}\n\n> Uygulama Mimar Stüdyosu — Master Prompt v4.0 ile oluşturuldu.\n\n## 📖 Proje Hakkında\n\n${appName}, kullanıcıların ihtiyaçlarını karşılamak üzere tasarlanmış, Flutter tabanlı bir uygulamadır. Offline çalışabilir, hızlı ve güvenlidir.\n\n## ✨ Özellikler\n\n${featList}\n\n## 🚀 Kurulum\n\n\`\`\`bash\n# Depoyu klonla\ngit clone https://github.com/kullanici/${appName.toLowerCase().replace(/ /g,"-")}.git\n\n# Bağımlılıkları yükle\nflutter pub get\n\n# Uygulamayı çalıştır\nflutter run\n\`\`\`\n\n## 🏗️ Teknoloji Stack\n\n- **Mobil**: Flutter / Dart\n- **Veritabanı**: SQLite / Hive (yerel)\n- **State Yönetimi**: Provider / Riverpod\n- **Test**: flutter_test, mockito\n\n## 📁 Klasör Yapısı\n\n\`\`\`\n${(result?.folders || ["core/","features/","screens/","services/"]).join("\n")}\n\`\`\`\n\n## 📄 Lisans\n\nMIT License — ${new Date().getFullYear()}\n`;
    } else if (selectedDoc.id === "changelog") {
      out = `# CHANGELOG — ${appName}\n\nBu proje [Keep a Changelog](https://keepachangelog.com) formatını kullanır.\n\n---\n\n${(result?.roadmap || []).map(r => `## [${r.version}]\n\n### Eklendi\n- ${r.desc}\n`).join("\n") || "## [v0.1]\n\n### Eklendi\n- Proje başlatıldı\n"}\n---\n\n_Son güncelleme: ${today}_\n`;
    } else if (selectedDoc.id === "audit") {
      out = `# AUDIT REPORT — ${appName}\n\n_Tarih: ${today} | Aktif Faz: P${currentPhase}_\n\n## 📊 Yönetici Özeti\n\nProje P${currentPhase} fazında aktif geliştirme sürecinde. Temel sistemler çalışır durumda, test kapsamı artırılmaya devam ediyor.\n\n## 🏆 Sağlık Skoru\n\n${healthStr}\n\n## ✅ Sistem Durumu\n\n${(features || []).map(f => `- ${f.name}: **${f.priority === "Yüksek" ? "⚠ Kritik Öncelik" : "✓ Planlandı"}**`).join("\n")}\n\n## ⚠ Teknik Borç\n\n${result?.debt || "Henüz analiz edilmedi."}\n\n## 📋 Öneriler\n\n1. Test kapsamını artır — kritik fonksiyonlar öncelikli\n2. Refactor planını v0.8 öncesinde uygula\n3. Güvenlik taramasını P15'te gerçekleştir\n`;
    } else if (selectedDoc.id === "bug") {
      out = `# BUG REPORT — ${appName}\n\n_Tarih: ${today}_\n\n## Bilinen Sorunlar\n\n| ID | Başlık | Ciddiyet | Durum |\n|---|---|---|---|\n| BUG-001 | UI güncellenmeme (state sorunu) | Yüksek | Açık |\n| BUG-002 | Bağımlı modül senkron sorunu | Orta | İnceleniyor |\n| BUG-003 | Hata yutma — sessiz exception | Yüksek | Açık |\n\n## Şablon: Yeni Bug Bildirimi\n\n### Başlık\n[Kısa, net açıklama]\n\n### Yeniden Üretim\n1. Adım 1\n2. Adım 2\n3. Adım 3\n\n### Beklenen Davranış\n[Ne olması gerekiyordu]\n\n### Gerçekleşen Davranış\n[Ne oldu]\n\n### Ciddiyet\n- [ ] Kritik  - [ ] Yüksek  - [ ] Orta  - [ ] Düşük\n`;
    } else if (selectedDoc.id === "depmap") {
      out = `# DEPENDENCY MAP — ${appName}\n\n_Tarih: ${today}_\n\n## Modül Bağımlılık Diyagramı\n\n\`\`\`\nscreens/\n  └── features/\n        ├── core/\n        │     ├── models/\n        │     └── utils/\n        ├── services/\n        │     ├── local_db/ (veya cloud_sync/)\n        │     └── network/\n        └── providers/\n              └── services/\n\`\`\`\n\n## Özellik Bağımlılıkları\n\n${(features || []).map((f,i) => `### ${f.name}\n- Bağımlı: ${i > 0 ? (features[i-1]?.name || "core") : "core/"}\n- Risk: ${f.risk}\n`).join("\n")}\n\n## Veri Akışı\n\n\`\`\`\nKullanıcı → Screen → Provider → Service → Repository → DataSource\n                ↑                                              ↓\n                └──────────── State Update ←──────────────────┘\n\`\`\`\n`;
    } else if (selectedDoc.id === "arch") {
      out = `# ARCHITECTURE — ${appName}\n\n_Tarih: ${today} | Aktif Faz: P${currentPhase}_\n\n## Sistem Genel Bakış\n\n${appName}, Clean Architecture prensiplerine göre yapılandırılmıştır. Katmanlar birbirinden bağımsız test edilebilir.\n\n## Katmanlar\n\n### Sunum Katmanı (Presentation)\n- Screens, Widgets, Providers\n- Kullanıcı etkileşimini yönetir\n- State yönetimi: Provider / Riverpod\n\n### İş Mantığı Katmanı (Domain)\n- Use Cases, Entities\n- İş kuralları burada yaşar\n- Hiçbir framework bağımlılığı yok\n\n### Veri Katmanı (Data)\n- Repositories, DataSources, Models\n- Yerel (SQLite/Hive) ve uzak (API) kaynaklar\n\n## Tasarım Kararları\n\n| Karar | Gerekçe |\n|---|---|\n| Flutter seçimi | Cross-platform, tek kod tabanı |\n| Feature-first klasör | Büyük projede modülerlik |\n| Offline-first | ${result?.tech?.Bulut === "Gerekli değil" ? "Bulut gerektirmiyor, ücretsiz" : "Önce yerel, sonra sync"} |\n\n## Ölçeklenebilirlik\n\nMevcut mimari ${result ? Object.values(result.tech || {}).find(v => v.includes("000")) || "10.000" : "10.000"} kullanıcıya kadar yeterlidir. Sonrası için backend servis katmanı eklenmeli.\n`;
    }
    setTimeout(() => { setOutput(out); setLoading(false); }, 200);
  };

  const copyDoc = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadDoc = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = selectedDoc.label;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 16, lineHeight: 1.7 }}>
        Bölüm 14 — Sistem otomatik dokümantasyon üretir: <strong style={{ color: "#6c63ff" }}>README, CHANGELOG, AUDIT REPORT, BUG REPORT, DEPENDENCY MAP, ARCHITECTURE</strong>. Seç ve üret.
      </p>

      {/* Doküman tipi seçici */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 8, marginBottom: 16 }}>
        {DOC_TYPES.map((t) => (
          <div
            key={t.id}
            onClick={() => { setSelectedDoc(t); setOutput(null); }}
            style={{
              background: selectedDoc.id === t.id ? `${t.color}15` : "#101526",
              border: `1px solid ${selectedDoc.id === t.id ? t.color : "#28304a"}`,
              borderRadius: 8, padding: "10px 12px", cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
            <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: selectedDoc.id === t.id ? t.color : "#7a7a9a", marginBottom: 3 }}>{t.label}</div>
            <div style={{ fontSize: 10, color: "#4a4a6a", lineHeight: 1.4 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <button
        onClick={generate}
        disabled={loading || !appName}
        style={{ width: "100%", background: loading ? "#2f3a5c" : `linear-gradient(135deg,${selectedDoc.color},#6c63ff)`, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, padding: "11px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 14 }}
      >
        {loading ? `⏳ ${selectedDoc.label} üretiliyor...` : `📄 ${selectedDoc.label} Üret`}
      </button>

      {!appName && (
        <div style={{ background: "rgba(244,197,90,0.08)", border: "1px solid rgba(244,197,90,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f4c55a", marginBottom: 14 }}>
          ⚠ Önce projeyi oluştur — dokümantasyon projeye özel üretilecek.
        </div>
      )}

      {err && (
        <div style={{ marginBottom: 12, background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12 }}>
          {err}
        </div>
      )}

      {output && (
        <div style={{ background: "#0a0e1f", border: "1px solid #28304a", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #28304a", background: "#101526" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{selectedDoc.icon}</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: selectedDoc.color, fontWeight: 700 }}>{selectedDoc.label}</span>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4a4a6a" }}>— {appName}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={copyDoc}
                style={{ background: copied ? "rgba(67,233,123,0.15)" : "transparent", border: `1px solid ${copied ? "#43e97b" : "#28304a"}`, borderRadius: 6, color: copied ? "#43e97b" : "#7a7a9a", fontFamily: "monospace", fontSize: 10, padding: "4px 10px", cursor: "pointer" }}>
                {copied ? "✓ kopyalandı" : "kopyala"}
              </button>
              <button onClick={downloadDoc}
                style={{ background: `${selectedDoc.color}22`, border: `1px solid ${selectedDoc.color}`, borderRadius: 6, color: selectedDoc.color, fontFamily: "monospace", fontSize: 10, padding: "4px 10px", cursor: "pointer" }}>
                ⬇ indir
              </button>
            </div>
          </div>
          <pre style={{ margin: 0, padding: "16px 14px", fontFamily: "monospace", fontSize: 11, color: "#c8c8e0", lineHeight: 1.8, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 520, overflowY: "auto" }}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

