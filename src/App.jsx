import { useState, useEffect } from "react";
import { storage } from "./lib/storage";
import { downloadText, downloadBlob } from "./lib/download";
import { buildPlanMarkdown } from "./lib/exportPlan";
import { buildScaffoldZip, scaffoldFileName } from "./lib/scaffold";
import { initAds, showInterstitialOnce } from "./lib/ads";
import { EXAMPLES, TABS } from "./data/constants";
import { TEMPLATES } from "./data/templates";
import { useLanguage } from "./i18n/LanguageContext";
import Panel from "./components/Panel";
import BinaView from "./components/BinaView";
import TaskBoardView from "./components/TaskBoardView";
import AuditView from "./components/AuditView";
import BuilderView from "./components/BuilderView";
import ZombiBugView from "./components/ZombiBugView";
import OgrenmeRehberiView from "./components/OgrenmeRehberiView";
import FazlarView from "./components/FazlarView";
import TestDongusuView from "./components/TestDongusuView";
import YasamDongusuView from "./components/YasamDongusuView";
import DokumantasyonView from "./components/DokumantasyonView";
import DanismanView from "./components/DanismanView";
import AIYardimciView from "./components/AIYardimciView";
import SablonMotoruView from "./components/SablonMotoruView";

// ─── Ana Uygulama ─────────────────────────────────────────────────────────────
export default function App() {
  const { lang, setLang, t } = useLanguage();
  const [idea, setIdea]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [step, setStep]           = useState("");
  const [progress, setProgress]   = useState(0);
  const [activeTab, setActiveTab] = useState("bina");
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState("");
  const [copied, setCopied]       = useState("");
  const [buildingApp, setBuildingApp] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [dbNeed, setDbNeed]       = useState("Yerel");
  const [cloudNeed, setCloudNeed] = useState("Hayır");
  const [userScale, setUserScale] = useState("1000");
  const [savedFlash, setSavedFlash] = useState(false);
  const [restoring, setRestoring]   = useState(true);
  // BÖLÜM 18 — Fikir Analizi soruları
  const [pricing, setPricing]     = useState("Ücretsiz");
  const [hasMap, setHasMap]       = useState("Hayır");
  const [hasNotif, setHasNotif]   = useState("Hayır");
  const [hasPayment, setHasPayment] = useState("Hayır");
  // BÖLÜM 19 — Proje Türü
  const [projectType, setProjectType] = useState("Mobil");

  // Reklamları başlat (sadece Android/iOS uygulamasında, web'de no-op)
  useEffect(() => {
    initAds();
  }, []);

  // Sayfa açılırken kayıtlı projeyi yükle
  useEffect(() => {
    (async () => {
      try {
        const saved = await storage.get("current-project", false);
        if (saved && saved.value) {
          const p = JSON.parse(saved.value);
          if (p.idea)        setIdea(p.idea);
          if (p.result)      setResult(p.result);
          if (p.currentPhase) setCurrentPhase(p.currentPhase);
          if (p.dbNeed)      setDbNeed(p.dbNeed);
          if (p.cloudNeed)   setCloudNeed(p.cloudNeed);
          if (p.userScale)   setUserScale(p.userScale);
          if (p.pricing)     setPricing(p.pricing);
          if (p.hasMap)      setHasMap(p.hasMap);
          if (p.hasNotif)    setHasNotif(p.hasNotif);
          if (p.hasPayment)  setHasPayment(p.hasPayment);
          if (p.projectType) setProjectType(p.projectType);
        }
      } catch (_) {
        // kayıtlı proje yok, sorun değil
      } finally {
        setRestoring(false);
      }
    })();
  }, []);

  // Proje üretildikten sonra her değişiklikte otomatik kaydet
  useEffect(() => {
    if (!result || restoring) return;
    (async () => {
      try {
        await storage.set(
          "current-project",
          JSON.stringify({ idea, result, currentPhase, dbNeed, cloudNeed, userScale, pricing, hasMap, hasNotif, hasPayment, projectType }),
          false
        );
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
      } catch (_) {
        // kaydetme başarısız olsa da uygulama çalışmaya devam etsin
      }
    })();
  }, [result, currentPhase, dbNeed, cloudNeed, userScale, pricing, hasMap, hasNotif, hasPayment, projectType]);

  const resetProject = async () => {
    try { await storage.delete("current-project", false); } catch (_) {}
    try { await storage.delete("kanban-statuses", false); } catch (_) {}
    try { await storage.delete("danisman-history", false); } catch (_) {}
    try { await storage.delete("zombi-history", false); } catch (_) {}
    try { await storage.delete("audit-history", false); } catch (_) {}
    setResult(null);
    setIdea("");
    setCurrentPhase(1);
    setDbNeed("Yerel");
    setCloudNeed("Hayır");
    setUserScale("1000");
    setPricing("Ücretsiz");
    setHasMap("Hayır");
    setHasNotif("Hayır");
    setHasPayment("Hayır");
    setProjectType("Mobil");
    setActiveTab("bina");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shortAppName = (name) => {
    const clean = (name || "").trim();
    if (!clean) return "";
    const firstClause = clean.split(/\s+—\s+/)[0];
    return firstClause.length <= 30 ? firstClause : clean.slice(0, 30).trim() + "…";
  };

  const buildAppNow = async () => {
    if (!result || buildingApp) return;
    setBuildingApp(true);
    try {
      const blob = await buildScaffoldZip({
        appName: idea.trim(),
        features: result.features,
        folders: result.folders,
        tech: result.tech,
      });
      await downloadBlob(scaffoldFileName(idea.trim()), blob);
    } finally {
      setBuildingApp(false);
    }
  };

  const generate = () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    const app = idea.trim();
    const out = {};

    setStep("Manifesto oluşturuluyor..."); setProgress(10);
    out.manifesto = `"${app}" projesi, kullanıcıların ihtiyaç duyduğu temel sorunu dijital ortamda çözmek amacıyla geliştirilmektedir. Hedef kitle: uygulamayı günlük hayatında kullanacak bireyler ve küçük işletmeler. Temel sorun: mevcut çözümlerin karmaşıklığı ve maliyeti. Çözüm: ${projectType} üzerinde çalışan, ${dbNeed === "Hayır" ? "tamamen çevrimdışı, ücretsiz" : dbNeed + " veritabanı kullanan"} bir uygulama. Gelir modeli: ${pricing}. Beş yıl içinde bu uygulama, alanında referans çözüm haline gelmeyi ve ${userScale} kullanıcıya ulaşmayı hedeflemektedir. Geliştirme süreci P1–P20 bina metaforu ile yönetilecek, her adım audit ve refactor döngüsüyle desteklenecektir.`;

    setStep("Mimari harita çiziliyor..."); setProgress(20);
    out.mimari = `"${app}" mimarisi ${projectType} platformu için Flutter tabanlı, tek kod tabanıyla tasarlanmıştır. Sistem katmanları: Sunum Katmanı (UI/Ekranlar) → İş Mantığı Katmanı (Servisler/Provider) → Veri Katmanı (${dbNeed === "Hayır" ? "Yerel Depolama" : dbNeed}). Veri akışı: kullanıcı etkileşimi → state yönetimi → servis katmanı → veri kaynağı → UI güncelleme. Modüller arası bağımlılık: core/ bağımsız; features/ core'a bağımlı; screens/ features'a bağımlı. ${cloudNeed !== "Hayır" ? "Bulut senkronizasyonu isteğe bağlı açılıp kapatılabilir." : "Bulut gerektirmez, tamamen yerel çalışır."} Güvenlik: kimlik doğrulama → token yönetimi → rol tabanlı erişim. Ölçeklenebilirlik: ${userScale} kullanıcıya kadar mevcut mimari yeterli.`;

    setStep("Teknoloji önerisi hazırlanıyor..."); setProgress(30);
    const isOyunFikri = /dedektif|vaka|oyun|game/i.test(app);
    out.tech = {
      Frontend: projectType === "Web" ? "Flutter Web" : projectType === "Masaüstü" ? "Flutter Desktop" : projectType === "Mobil + Web" ? "Flutter (Mobil + Web, tek kod tabanı)" : projectType === "Mobil + Web + Desktop" ? "Flutter (Mobil + Web + Desktop, tek kod tabanı)" : "Flutter (Mobil)",
      OyunMotoru: isOyunFikri ? "Flame (2D oyun motoru, Flutter üzerinde)" : "Gerekli değil",
      Backend: userScale === "100000+" ? "Node.js / FastAPI" : "Dart / Yerel",
      Veritabani: dbNeed === "Hayır" ? "SharedPreferences / Hive" : dbNeed === "Yerel" ? "SQLite / Hive" : "PostgreSQL / Supabase",
      Bulut: cloudNeed === "Hayır" ? "Gerekli değil" : "Firebase / Supabase",
      Depolama: cloudNeed === "Hayır" ? "Yerel dosya sistemi (JSON kayıt — savegame.json)" : "Firebase Storage",
      Odeme: hasPayment === "Evet" ? "Stripe / Iyzico" : "Gerekli değil",
      Harita: hasMap === "Evet" ? "Google Maps / OpenStreetMap" : "Gerekli değil",
    };

    setStep("Özellikler listeleniyor..."); setProgress(40);
    const featureTemplates = [
      { name: "Kullanıcı Kayıt / Giriş", priority: "Yüksek", risk: "Orta", desc: "E-posta veya sosyal giriş ile kimlik doğrulama" },
      { name: "Ana Ekran Dashboard", priority: "Yüksek", risk: "Düşük", desc: "Kullanıcıya özel ana sayfa ve özet bilgiler" },
      { name: "Profil Yönetimi", priority: "Orta", risk: "Düşük", desc: "Kullanıcı bilgilerini görüntüleme ve düzenleme" },
      { name: "Arama ve Filtreleme", priority: "Orta", risk: "Orta", desc: "İçerik ve veri arama, kategori filtreleme" },
      { name: "Bildirim Sistemi", priority: hasNotif === "Evet" ? "Yüksek" : "Düşük", risk: "Orta", desc: "Push ve uygulama içi bildirimler" },
      { name: "Ayarlar Paneli", priority: "Orta", risk: "Düşük", desc: "Uygulama tercihleri ve kişiselleştirme" },
      { name: "Veri Yedekleme", priority: "Orta", risk: "Yüksek", desc: "Kullanıcı verilerinin güvenli yedeklenmesi" },
      { name: "Offline Mod", priority: "Yüksek", risk: "Orta", desc: "İnternet bağlantısı olmadan temel işlevler" },
      { name: hasPayment === "Evet" ? "Ödeme Entegrasyonu" : "Sürüm Güncelleme", priority: "Yüksek", risk: "Yüksek", desc: hasPayment === "Evet" ? "Güvenli ödeme işlemleri ve fatura" : "Uygulama güncelleme kontrolü ve bildirimi" },
      { name: "Audit ve Log Sistemi", priority: "Orta", risk: "Düşük", desc: "Kullanıcı hareketleri ve hata kayıtları" },
    ];
    out.features = featureTemplates;

    setStep("Güvenlik planı hazırlanıyor..."); setProgress(54);
    out.security = [
      { category: "Temel", items: [
        { title: "Temel Güvenlik", desc: "Şifreleme, güvenli depolama, erişim kontrolü ve oturum yönetimi" },
        { title: "Veri Şifreleme", desc: "Hassas veriler AES-256 ile şifrelenir, iletimde TLS/HTTPS zorunlu" },
        { title: "GDPR Uyumluluğu", desc: "Veri saklama politikası, kullanıcı onayı ve veri silme hakkı" },
      ]},
      { category: "Kapılar", items: [
        { title: "Yetkilendirme", desc: "Kim içeri girebilir? Rol tabanlı erişim: kullanıcı, yönetici, misafir" },
      ]},
      { category: "Anahtarlar", items: [
        { title: "Token Yönetimi", desc: "JWT token, oturum bilgileri ve API anahtarlarının güvenli saklanması" },
      ]},
      { category: "Kamera", items: [
        { title: "Log Sistemi", desc: "Kim ne yaptı, ne zaman, nerede — tüm kritik olaylar kayıt altında" },
      ]},
      { category: "Yangın", items: [
        { title: "Hata Kurtarma", desc: "Rollback, otomatik yedekleme ve felaket kurtarma planı" },
      ]},
      { category: "Deprem", items: [
        { title: "Dayanıklılık", desc: `Yük testi, stres testi ve ${userScale} kullanıcıya ölçeklenebilirlik` },
      ]},
    ];

    setStep("Yol haritası oluşturuluyor..."); setProgress(64);
    out.roadmap = [
      { version: "v0.1", desc: "İlk fikir — proje kurulumu, klasörler, core yapı" },
      { version: "v0.2", desc: "İlk ekranlar — login, ana sayfa, navigasyon akışı" },
      { version: "v0.3", desc: "Temel özellikler — veri modeli, CRUD işlemleri" },
      { version: "v0.5", desc: "Beta sürümü — tüm ana özellikler çalışır durumda" },
      { version: "v0.8", desc: "Feature freeze — yeni özellik eklenmez, sadece düzeltme" },
      { version: "v0.9", desc: "Audit — test coverage, güvenlik taraması, performans" },
      { version: "v1.0", desc: "Yayın — App Store / Play Store / Web'e açılır" },
      { version: "v1.1", desc: "Küçük geliştirmeler — kullanıcı geri bildirimleri" },
      { version: "v1.2", desc: "Performans optimizasyonu ve refactor turu" },
      { version: "v1.5", desc: "Yeni modüller — ikincil özellikler eklenir" },
      { version: "v2.0", desc: "Büyük güncelleme — mimari yeniden yapılanma" },
    ];

    setStep("Klasör yapısı üretiliyor..."); setProgress(74);
    const basefolders = ["core/", "features/", "screens/", "widgets/", "services/", "providers/", "models/", "utils/", "assets/", "tests/", "audit/", "documentation/"];
    if (dbNeed === "Yerel") basefolders.push("local_db/");
    if (cloudNeed !== "Hayır") basefolders.push("cloud_sync/");
    if (hasPayment === "Evet") basefolders.push("payments/");
    if (hasNotif === "Evet") basefolders.push("notifications/");
    out.folders = basefolders;

    setStep("Refactor planı çıkarılıyor..."); setProgress(84);
    out.refactor = [
      { madde: "Spaghetti Kod Temizleme", aciklama: "İç içe geçmiş, okunaksız kod bloklarını küçük fonksiyonlara böl" },
      { madde: "Tekrarlanan Kodları Kaldırma", aciklama: "DRY prensibi — aynı mantık tek yerde, her yerden çağrılır" },
      { madde: "Optimizasyon", aciklama: "Gereksiz hesaplamalar kaldırılır, cache stratejisi eklenir" },
      { madde: "Yük Azaltma", aciklama: "Ağır işlemler background isolate'e taşınır" },
      { madde: "Bağımlılık Azaltma", aciklama: "Modüller arası sıkı bağ gevşetilir, interface kullanılır" },
      { madde: "Okunabilirlik Artırma", aciklama: "İsimlendirme standartları, dokümantasyon ve yorum satırları" },
      { madde: "Ölçeklenebilirlik Hazırlama", aciklama: "Pagination, lazy load ve veritabanı indexleme eklenir" },
      { madde: "Gelecek Özelliklere Zemin", aciklama: "Yeni modül eklemek mevcut kodu kırmayacak şekilde yapılandır" },
    ];

    setStep("Test planı hazırlanıyor..."); setProgress(88);
    const riskliOzellikler = (out.features || []).filter(f => f.risk === "Yüksek");
    out.testPlan = [
      { tip: "Unit Test", kapsam: "Servis ve use-case fonksiyonları", ornek: `${app} içindeki iş mantığı fonksiyonlarının girdi/çıktı doğruluğu` },
      { tip: "Widget Test", kapsam: "Ekran ve bileşen davranışları", ornek: "Form doğrulama, buton tıklama, state değişimi" },
      { tip: "Entegrasyon Testi", kapsam: "Katmanlar arası veri akışı", ornek: "UI → servis → veri kaynağı → UI güncelleme zinciri" },
      { tip: "Offline Test", kapsam: "Çevrimdışı çalışma senaryoları", ornek: "İnternet yokken temel işlevlerin bozulmadan çalışması" },
      ...riskliOzellikler.map(f => ({ tip: "Risk Testi", kapsam: f.name, ornek: `${f.name} özelliğinde veri kaybı/çakışma senaryoları` })),
      { tip: "Regresyon Testi", kapsam: "v0.8 feature freeze öncesi tüm ana akışlar", ornek: "Her sürüm öncesi otomatik test paketi çalıştırma" },
    ];

    setStep("Sağlık skoru hesaplanıyor..."); setProgress(96);
    const base = userScale === "100" ? 88 : userScale === "1000" ? 82 : userScale === "10000" ? 76 : 70;
    out.health = [
      { label: "Mimari Kalitesi", value: base + 4 },
      { label: "Kod Kalitesi", value: base - 2 },
      { label: "Performans", value: base + 2 },
      { label: "Test Kapsamı", value: base - 6 },
      { label: "Audit Başarısı", value: base + 6 },
      { label: "Dokümantasyon", value: base },
      { label: "Toplam", value: base + 1 },
    ];
    out.debt = `"${app}" projesi başlangıç aşamasında olduğundan teknik borç henüz düşük seviyede. Ancak ${userScale} kullanıcı hedefiyle büyüdükçe veri katmanı ve state yönetimi karmaşıklaşabilir. P1–P8 arasında temel mimari kararların doğru verilmesi kritik öneme sahip. Refactor döngüsü v0.8'den önce planlanmalı.`;

    setProgress(100);
    setStep("Tamamlandı!");
    setTimeout(() => {
      setResult(out);
      setActiveTab("bina");
      setLoading(false);
      setStep("");
      setProgress(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
      showInterstitialOnce();
    }, 400);
  };

  const pickTemplate = (tpl) => {
    setIdea(tpl.idea);
    setProjectType(tpl.projectType);
    setDbNeed(tpl.dbNeed);
    setCloudNeed(tpl.cloudNeed);
    setUserScale(tpl.userScale);
    setPricing(tpl.pricing);
    setHasMap(tpl.hasMap);
    setHasNotif(tpl.hasNotif);
    setHasPayment(tpl.hasPayment);
  };

  const exportPlan = async () => {
    if (!result) return;
    const md = buildPlanMarkdown(idea.trim(), result);
    const safeName = idea.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "proje";
    await downloadText(`${safeName}-mimari-plan.md`, md, "text/markdown;charset=utf-8");
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(typeof text === "object" ? JSON.stringify(text, null, 2) : text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const scoreColor = (v) => v >= 85 ? "#43e97b" : v >= 70 ? "#f4c55a" : "#ff6584";
  const prioColor  = { Yuksek: "#ff6584", Orta: "#f4c55a", Dusuk: "#43e97b", Yüksek: "#ff6584", Düşük: "#43e97b" };

  return (
    <div style={{ background: "#070b18", minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#e8e8f0" }}>
      {/* Grid bg */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(108,99,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", padding: "48px 0 36px" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
            <button onClick={() => setLang("tr")} type="button"
              style={{ background: lang === "tr" ? "#6c63ff" : "transparent", border: "1px solid #6c63ff", borderRadius: 4, color: lang === "tr" ? "#fff" : "#6c63ff", fontFamily: "monospace", fontSize: 10, fontWeight: 700, padding: "3px 9px", cursor: "pointer" }}>
              TR
            </button>
            <button onClick={() => setLang("en")} type="button"
              style={{ background: lang === "en" ? "#6c63ff" : "transparent", border: "1px solid #6c63ff", borderRadius: 4, color: lang === "en" ? "#fff" : "#6c63ff", fontFamily: "monospace", fontSize: 10, fontWeight: 700, padding: "3px 9px", cursor: "pointer" }}>
              EN
            </button>
          </div>
          <div style={{ display: "inline-block", fontFamily: "monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#6c63ff", border: "1px solid #6c63ff", padding: "4px 12px", borderRadius: 2, marginBottom: 20, opacity: 0.8 }}>
            {t("badge")}
          </div>
          <h1 style={{ fontSize: "clamp(26px,6vw,46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", margin: "0 0 12px", background: "linear-gradient(135deg,#fff 30%,#6c63ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t("appTitle")}
          </h1>
          <p style={{ color: "#7a7a9a", fontSize: 14, lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
            {t("appSubtitle")}
          </p>
          <div style={{ minHeight: 22, marginTop: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
            {restoring ? (
              <span style={{ fontSize: 11, color: "#4a4a6a", fontFamily: "monospace" }}>{t("checkingProject")}</span>
            ) : (
              <>
                {savedFlash && (
                  <span style={{ fontSize: 11, color: "#43e97b", fontFamily: "monospace" }}>{t("saved")}</span>
                )}
                {result && (
                  <>
                    <button onClick={buildAppNow} disabled={buildingApp}
                      style={{ background: "rgba(67,233,123,0.15)", border: "1px solid #43e97b", borderRadius: 6, color: "#43e97b", fontSize: 11, padding: "4px 10px", cursor: buildingApp ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                      {buildingApp ? t("buildingApp") : t("buildAppNowLabel")(shortAppName(idea))}
                    </button>
                    <button onClick={resetProject}
                      style={{ background: "transparent", border: "1px solid #28304a", borderRadius: 6, color: "#7a7a9a", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                      {t("newProject")}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* INPUT */}
        <div style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 12, padding: "24px 24px 20px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#6c63ff,#ff6584)" }} />
          <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#7a7a9a", marginBottom: 8 }}>{t("templatesLabel")}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => pickTemplate(tpl)}
                title={tpl.idea}
                style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 20, color: "#a0a0c8", fontSize: 12, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}
              >
                {tpl.icon} {tpl.label}
              </button>
            ))}
          </div>

          <label style={{ display: "block", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#7a7a9a", marginBottom: 10 }}>{t("ideaLabel")}</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && !loading && generate()}
            placeholder={t("ideaPlaceholder")}
            rows={3}
            style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 8, color: "#e8e8f0", fontSize: 14, padding: "12px 14px", resize: "vertical", fontFamily: "inherit", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10, marginBottom: 4 }}>
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => setIdea(ex.replace(/^\S+\s/, ""))}
                style={{ background: "transparent", border: "1px solid #28304a", borderRadius: 20, color: "#7a7a9a", fontSize: 11, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                {ex}
              </button>
            ))}
          </div>

          {/* Proje Türü — BÖLÜM 19: Offline Uygulama Mimarı */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #28304a" }}>
            <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#7a7a9a", marginBottom: 10 }}>{t("projectTypeLabel")}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Mobil", "Web", "Masaüstü", "Mobil + Web", "Mobil + Web + Desktop"].map((pt) => (
                <button
                  key={pt}
                  onClick={() => setProjectType(pt)}
                  type="button"
                  style={{
                    background: projectType === pt ? "rgba(108,99,255,0.18)" : "#161c32",
                    border: `1px solid ${projectType === pt ? "#6c63ff" : "#28304a"}`,
                    borderRadius: 20, color: projectType === pt ? "#6c63ff" : "#a0a0c8",
                    fontSize: 12, fontWeight: projectType === pt ? 600 : 400,
                    padding: "6px 14px", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {t(`projectTypes.${pt}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Proje Detayları — BÖLÜM 18: Fikir Analizi soruları */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #28304a" }}>
            <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#7a7a9a", marginBottom: 10 }}>{t("ideaAnalysisLabel")}</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>{t("pricingLabel")}</label>
                <select value={pricing} onChange={(e) => setPricing(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option value="Ücretsiz">{t("pricingOptions.Ücretsiz")}</option>
                  <option value="Ücretli">{t("pricingOptions.Ücretli")}</option>
                  <option value="Abonelik">{t("pricingOptions.Abonelik")}</option>
                </select>
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>{t("dbLabel")}</label>
                <select value={dbNeed} onChange={(e) => setDbNeed(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option value="Hayır">{t("dbOptions.Hayır")}</option>
                  <option value="Yerel">{t("dbOptions.Yerel")}</option>
                  <option value="Bulut">{t("dbOptions.Bulut")}</option>
                </select>
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>{t("cloudLabel")}</label>
                <select value={cloudNeed} onChange={(e) => setCloudNeed(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option value="Hayır">{t("cloudOptions.Hayır")}</option>
                  <option value="İsteğe bağlı">{t("cloudOptions.İsteğe bağlı")}</option>
                  <option value="Evet">{t("cloudOptions.Evet")}</option>
                </select>
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>{t("userScaleLabel")}</label>
                <select value={userScale} onChange={(e) => setUserScale(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option value="100">100</option>
                  <option value="1000">1.000</option>
                  <option value="10000">10.000</option>
                  <option value="100000+">100.000+</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 130px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>{t("mapLabel")}</label>
                <select value={hasMap} onChange={(e) => setHasMap(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option value="Hayır">{t("yesNo.Hayır")}</option>
                  <option value="Evet">{t("yesNo.Evet")}</option>
                </select>
              </div>
              <div style={{ flex: "1 1 130px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>{t("notifLabel")}</label>
                <select value={hasNotif} onChange={(e) => setHasNotif(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option value="Hayır">{t("yesNo.Hayır")}</option>
                  <option value="Evet">{t("yesNo.Evet")}</option>
                </select>
              </div>
              <div style={{ flex: "1 1 130px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>{t("paymentLabel")}</label>
                <select value={hasPayment} onChange={(e) => setHasPayment(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option value="Hayır">{t("yesNo.Hayır")}</option>
                  <option value="Evet">{t("yesNo.Evet")}</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={generate} disabled={loading || !idea.trim()}
            style={{ width: "100%", background: loading ? "#2f3a5c" : "#6c63ff", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, padding: "13px", cursor: loading ? "not-allowed" : "pointer", marginTop: 12, fontFamily: "inherit" }}>
            {loading ? `⏳ ${step}` : t("generateButton")}
          </button>
          {loading && (
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 3, background: "#28304a", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: progress + "%", background: "linear-gradient(90deg,#6c63ff,#ff6584)", transition: "width 0.5s ease" }} />
              </div>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: "#6c63ff", textAlign: "center", marginTop: 5 }}>
                {step} ({Math.round(progress)}%)
              </p>
            </div>
          )}
          {error && (
            <div style={{ marginTop: 12, background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 13 }}>
              {error}
            </div>
          )}
        </div>

        {/* SONUÇLAR */}
        {result && (
          <>
            {/* Planı dışa aktar */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button
                onClick={exportPlan}
                style={{ background: "rgba(108,99,255,0.12)", border: "1px solid #6c63ff", borderRadius: 6, color: "#6c63ff", fontFamily: "monospace", fontSize: 11, fontWeight: 600, padding: "6px 12px", cursor: "pointer" }}
                title={t("exportPlanTitle")}
              >
                {t("exportPlanButton")}
              </button>
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ flexShrink: 0, background: activeTab === tab.id ? "#6c63ff" : "#101526", border: `1px solid ${activeTab === tab.id ? "#6c63ff" : "#28304a"}`, borderRadius: 6, color: activeTab === tab.id ? "#fff" : "#7a7a9a", fontSize: 12, fontWeight: 500, padding: "6px 13px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                  {t(`tabs.${tab.id}`)}
                </button>
              ))}
            </div>

            {/* 🏢 BİNA */}
            {activeTab === "bina" && (
              <Panel icon="🏢" bg="rgba(108,99,255,0.15)" title="İnşaat Takibi" sub="P1–P20 BINA METAFORU">
                <BinaView currentPhase={currentPhase} setCurrentPhase={setCurrentPhase} appName={idea.trim()} />
              </Panel>
            )}

            {/* 📋 MANİFESTO */}
            {activeTab === "manifesto" && (
              <div>
                <Panel icon="📋" bg="rgba(108,99,255,0.15)" title="Master Prompt" sub="ANA FİKİR BELGESİ" onCopy={() => copy(result.manifesto, "mf")} copied={copied === "mf"}>
                  <p style={{ fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap", color: "#d0d0e8" }}>{result.manifesto}</p>
                </Panel>
                <Panel icon="📜" bg="rgba(108,99,255,0.1)" title="Sistem Manifestosu" sub="MASTER PROMPT v4.0 — BÖLÜM 0">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { bolum: "BÖLÜM 0 — NEDEN?", icon: "🎯", text: "Amaç sadece kod üretmek değildir. Amaç: sıfır bilgiyle başlayan bir insanın proje kurabilmesi, AI kullanabilmesi, hata çözebilmesi, mimari düşünebilmesi, büyük projeleri yönetebilmesi ve sonunda kendi başına uygulama geliştirebilecek seviyeye ulaşabilmesidir." },
                      { bolum: "BÖLÜM 1 — BİNA METAFORU", icon: "🏗️", text: "Bir uygulama bina gibidir. İnsanlar yalnızca son halini görür. Ama görünmeyen yüzlerce süreç vardır: arsa → mimari → mühendislik → temel → kolonlar → katlar → tesisatlar → duvarlar → boya → kontroller → oturum izni → taşınma." },
                      { bolum: "BÖLÜM 4 — REFACTOR", icon: "♻️", text: "Refactor temizlik değildir. Geleceğe yatırım yapmaktır. İçeriği: spaghetti kod temizleme, tekrarlanan kodları kaldırma, optimizasyon, yük azaltma, bağımlılık azaltma, okunabilirlik artırma, ölçeklenebilirlik hazırlama." },
                      { bolum: "BÖLÜM 5 — AUDIT", icon: "✅", text: "Audit; gerçekten çalışıyor mu sorusudur. Kontroller: veri geliyor mu, işleniyor mu, saklanıyor mu, gösteriliyor mu, ekran güncelleniyor mu, bağımlılıklar bağlı mı, sistemler haberleşiyor mu, kayıt tutuluyor mu, hata gizlenmiş mi, zombi bug var mı." },
                      { bolum: "BÖLÜM 6 — ZOMBİ BUG", icon: "🧟", text: "Bir hata çözülmüş görünür. Ama başka yerde yaşamaya devam eder. Örnek: kullanıcı kayıt olur → profil oluşur → ama giriş ekranı güncellenmez → bildirim gelmez → veri kaydedilir → ama yedek alınmaz." },
                      { bolum: "BÖLÜM 8 — ENTEGRASYON DOSYASI", icon: "🔧", text: "Bu dosya bir araçtır: fix.py, builder.py, integrator.py, patch.py, updater.py. Görevi: AI tarafından üretilen değişiklikleri projeye uygulamak. Claude kod üretir → fix.py içine yapıştırılır → python fix.py çalıştırılır → proje güncellenir." },
                      { bolum: "BÖLÜM 9 — ESNEKLİK", icon: "🔄", text: "Bir gün ev yaparsın. Bir gün okul. Bir gün hastane. Bir gün otel. Bir gün gökdelen. Yöntem aynıdır. İçerik değişir." },
                      { bolum: "BÖLÜM 25 — MASTER VİZYON", icon: "🌟", text: "Bu sistemin amacı kod öğretmek değildir. İnsanlara; uygulama düşünmeyi, planlamayı, tasarlamayı, inşa etmeyi, denetlemeyi, güvenliğini sağlamayı, bakımını yapmayı ve ölçeklemeyi öğretmektir." },
                    ].map((item, i) => (
                      <div key={i} style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 16 }}>{item.icon}</span>
                          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#6c63ff", fontWeight: 700, letterSpacing: 1 }}>{item.bolum}</span>
                        </div>
                        <p style={{ fontSize: 12, color: "#a0a0c8", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {/* 🏗️ MİMARİ */}
            {activeTab === "mimari" && (
              <Panel icon="🏗️" bg="rgba(255,101,132,0.15)" title="Architecture Manifest" sub="SİSTEM MİMARİSİ" onCopy={() => copy(result.mimari, "arch")} copied={copied === "arch"}>
                <p style={{ fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap", color: "#d0d0e8" }}>{result.mimari}</p>
              </Panel>
            )}

            {/* 🧩 ŞABLON MOTORU */}
            {activeTab === "sablon" && (
              <Panel icon="🧩" bg="rgba(108,99,255,0.15)" title="Akıllı Şablon Motoru" sub="BÖLÜM 22 — HAZIR ŞABLONLAR">
                <SablonMotoruView appName={idea.trim()} />
              </Panel>
            )}

            {/* 🧰 TEKNOLOJİ ÖNERİSİ */}
            {activeTab === "teknoloji" && (
              <Panel icon="🧰" bg="rgba(58,214,224,0.15)" title="Teknoloji Önerisi" sub="BÖLÜM 18.6 — SİSTEM ÖNERİR">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
                  {Object.entries(result.tech || {}).map(([k, v], i) => (
                    <div key={i} style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: v === "Gerekli değil" ? "#4a4a6a" : "#3ad6e0" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* ⚙️ ÖZELLİKLER */}
            {activeTab === "ozellikler" && (
              <Panel icon="⚙️" bg="rgba(244,197,90,0.15)" title="Feature Manifest" sub="ÖZELLİK ENVANTERİ">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
                  {(result.features || []).map((f, i) => (
                    <div key={i} style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{f.name}</div>
                      <div style={{ fontSize: 11, fontFamily: "monospace" }}>
                        <span style={{ color: prioColor[f.priority] || "#fff" }}>{f.priority}</span>
                        <span style={{ color: "#4a4a6a" }}> · </span>
                        <span style={{ color: "#7a7a9a" }}>Risk: {f.risk}</span>
                      </div>
                      {f.desc && <div style={{ fontSize: 11, color: "#7a7a9a", marginTop: 5, lineHeight: 1.5 }}>{f.desc}</div>}
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* 📌 GÖREV PANOSU */}
            {activeTab === "pano" && (
              <Panel icon="📌" bg="rgba(108,99,255,0.15)" title="Görev Panosu" sub="TASK BOARD">
                <TaskBoardView features={result.features} />
              </Panel>
            )}

            {/* 🧭 DANIŞMAN */}
            {activeTab === "danisman" && (
              <Panel icon="🧭" bg="rgba(244,197,90,0.15)" title="Mimarlık Danışmanı" sub="ARCHITECTURE ADVISOR">
                <DanismanView appName={idea.trim()} initialScale={userScale} />
              </Panel>
            )}

            {/* 🤝 AI YARDIMCISI */}
            {activeTab === "yardimci" && (
              <Panel icon="🤝" bg="rgba(67,233,123,0.12)" title="AI Yardımcısı" sub="AI OUTPUT ANALYZER">
                <AIYardimciView appName={idea.trim()} features={result.features} />
              </Panel>
            )}

            {/* 🔒 GÜVENLİK */}
            {activeTab === "guvenlik" && (
              <Panel icon="🔒" bg="rgba(67,233,123,0.12)" title="Güvenlik Manifestosu" sub="BUILDING SECURITY MANIFEST">
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {(result.security || []).map((cat, ci) => (
                    <div key={ci}>
                      <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#43e97b", marginBottom: 8 }}>
                        {cat.category}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(cat.items || []).map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: "#161c32", borderRadius: 6 }}>
                            <span style={{ color: "#43e97b", flexShrink: 0, marginTop: 1 }}>✓</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.title}</div>
                              <div style={{ fontSize: 12, color: "#7a7a9a", lineHeight: 1.5 }}>{s.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* 🗺️ ROADMAP */}
            {activeTab === "roadmap" && (
              <Panel icon="🗺️" bg="rgba(108,99,255,0.15)" title="Sürüm Yol Haritası" sub="VERSION ROADMAP">
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {(result.roadmap || []).map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#161c32", borderRadius: 6, borderLeft: "3px solid rgba(108,99,255,0.4)" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6c63ff", minWidth: 40, flexShrink: 0 }}>{v.version}</span>
                      <span style={{ fontSize: 13, color: "#d0d0e8" }}>{v.desc}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* 📁 KLASÖRLER */}
            {activeTab === "klasorler" && (
              <div>
                <Panel icon="📁" bg="rgba(255,101,132,0.15)" title="Klasör Yapısı" sub="FOLDER STRUCTURE" onCopy={() => copy((result.folders || []).join("\n"), "fol")} copied={copied === "fol"}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 2.1, background: "#161c32", borderRadius: 8, padding: 16 }}>
                    {(result.folders || []).map((f, i) => (
                      <div key={i} style={{ color: f.endsWith("/") ? "#6c63ff" : "#7a7a9a" }}>
                        {f.endsWith("/") ? "📂 " : "   📄 "}{f}
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel icon="🦴" bg="rgba(108,99,255,0.1)" title="Master Skeleton" sub="BÖLÜM 2 — ANA İNŞAAT İSKELETİ">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
                    {["core/","features/","screens/","widgets/","services/","providers/","data/","network/","storage/","audit/","tests/","analytics/","settings/","assets/","documentation/"].map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "#101526", border: "1px solid #28304a", borderRadius: 6, padding: "7px 10px" }}>
                        <span style={{ fontSize: 13 }}>📂</span>
                        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#6c63ff" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#4a4a6a", marginTop: 12, lineHeight: 1.6 }}>
                    Bu evrensel iskelet her uygulama türü için temel başlangıç noktasıdır. Projeye özel klasörler yukarıdaki Klasör Yapısı bölümünde üretilmiştir.
                  </p>
                </Panel>
              </div>
            )}

            {/* ♻️ REFACTOR */}
            {activeTab === "refactor" && (
              <Panel icon="♻️" bg="rgba(67,233,123,0.12)" title="Refactor Planı" sub="BÖLÜM 4 — GELECEĞE YATIRIM">
                <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 14, lineHeight: 1.7 }}>
                  Refactor temizlik değildir. Geleceğe yatırım yapmaktır.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(result.refactor || []).map((r, i) => (
                    <div key={i} style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#43e97b", marginBottom: 4 }}>♻️ {r.madde}</div>
                      {r.aciklama && <div style={{ fontSize: 12, color: "#a0a0c8", lineHeight: 1.5 }}>{r.aciklama}</div>}
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* ✅ AUDİT */}
            {activeTab === "audit" && (
              <Panel icon="✅" bg="rgba(67,233,123,0.12)" title="Audit Sistemi" sub="SÜRÜM DENETİMİ">
                <AuditView appName={idea.trim()} features={result.features} currentPhase={currentPhase} />
              </Panel>
            )}

            {/* 🔧 BUILDER */}
            {activeTab === "builder" && (
              <Panel icon="🔧" bg="rgba(58,214,224,0.12)" title="Builder Dosyası Üreticisi" sub="FIX.PY / BUILDER.PY ŞABLONU">
                <BuilderView appName={idea.trim()} features={result.features} folders={result.folders} tech={result.tech} />
              </Panel>
            )}

            {/* 🧠 ZOMBİ BUG */}
            {activeTab === "zombi" && (
              <Panel icon="🧠" bg="rgba(255,101,132,0.12)" title="Zombi Bug Denetçisi" sub="GİZLİ ZİNCİRLEME HATA ANALİZİ">
                <ZombiBugView appName={idea.trim()} features={result.features} />
              </Panel>
            )}

            {/* 🎓 ÖĞRENME REHBERİ */}
            {activeTab === "ogrenme" && (
              <Panel icon="🎓" bg="rgba(108,99,255,0.15)" title="Öğrenme Rehberi" sub="10 SEVİYE — KİŞİSEL GELİŞİM">
                <OgrenmeRehberiView appName={idea.trim()} features={result.features} currentPhase={currentPhase} />
              </Panel>
            )}

            {/* 🚀 GELİŞTİRME FAZLARI */}
            {activeTab === "fazlar" && (
              <Panel icon="🚀" bg="rgba(255,101,132,0.12)" title="Geliştirme Fazları" sub="BÖLÜM 17 — FAZ 1-5 ÖĞRENME DÖNGÜSÜ">
                <FazlarView appName={idea.trim()} currentPhase={currentPhase} features={result.features} />
              </Panel>
            )}

            {/* 🔁 TEST DÖNGÜSÜ */}
            {activeTab === "test" && (
              <>
                <Panel icon="🧪" bg="rgba(67,233,123,0.12)" title="Test Planı" sub="PROJEYE ÖZEL TEST SENARYOLARI">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(result.testPlan || []).map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: "#161c32", borderRadius: 6 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#43e97b", flexShrink: 0, minWidth: 110 }}>{t.tip}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{t.kapsam}</div>
                          <div style={{ fontSize: 12, color: "#7a7a9a", lineHeight: 1.5 }}>{t.ornek}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel icon="🔁" bg="rgba(108,99,255,0.12)" title="Test Döngüsü" sub="BÖLÜM 7 — İTERATİF GELİŞTİRME + BÖLÜM 13 MALİYET OPTİMİZASYONU">
                  <TestDongusuView appName={idea.trim()} features={result.features} />
                </Panel>
              </>
            )}

            {/* 🌱 YAŞAM DÖNGÜSÜ */}
            {activeTab === "yasam" && (
              <Panel icon="🌱" bg="rgba(67,233,123,0.12)" title="Proje Yaşam Döngüsü" sub="BÖLÜM 24 — FİKİR'DEN v2.0'A">
                <YasamDongusuView appName={idea.trim()} features={result.features} currentPhase={currentPhase} />
              </Panel>
            )}

            {/* 📄 DOKÜMANTASYON */}
            {activeTab === "dokuman" && (
              <Panel icon="📄" bg="rgba(58,214,224,0.12)" title="Otomatik Dokümantasyon" sub="BÖLÜM 14 — README / CHANGELOG / AUDIT / DEPENDENCY MAP">
                <DokumantasyonView appName={idea.trim()} features={result.features} result={result} currentPhase={currentPhase} />
              </Panel>
            )}

            {/* 📊 SAĞLIK */}
            {activeTab === "saglik" && (
              <>
                <Panel icon="📊" bg="rgba(67,233,123,0.12)" title="Proje Sağlık Skoru" sub="PROJECT HEALTH SCORE">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10 }}>
                    {(result.health || []).map((s, i) => (
                      <div key={i} style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14, textAlign: "center" }}>
                        <div style={{ fontFamily: "monospace", fontSize: 26, fontWeight: 700, color: scoreColor(s.value), lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#7a7a9a", lineHeight: 1.3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
                {result.debt && (
                  <Panel icon="⚠️" bg="rgba(244,197,90,0.15)" title="Teknik Borç Analizi" sub="TECHNICAL DEBT">
                    <p style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "#d0d0e8" }}>{result.debt}</p>
                  </Panel>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

