import { useState } from "react";

const LEARNING_LEVELS = [
  {
    num: 1, label: "Değişken", icon: "🌱",
    desc: "Programlamanın en temel yapı taşı: veri saklamak.",
    konular: ["Değişken nedir?", "String, int, bool türleri", "Veri atama ve okuma"],
    gorev: "Kullanıcı adı ve yaşı saklayan 3 değişken yaz.",
    kaynak: "Flutter: var, String, int, double, bool",
  },
  {
    num: 2, label: "Fonksiyon", icon: "⚙️",
    desc: "Tekrarlanan işlemleri bir kez yaz, istediğin kadar çalıştır.",
    konular: ["Fonksiyon tanımlama", "Parametre ve return", "void vs değer dönen"],
    gorev: "İki sayı alan ve toplamını döndüren bir fonksiyon yaz.",
    kaynak: "Dart: void, return, opsiyonel parametre",
  },
  {
    num: 3, label: "Sınıflar", icon: "🧱",
    desc: "Gerçek dünyadaki nesneleri kodla modellemek.",
    konular: ["class ve object", "Constructor", "Getter/Setter", "Inheritance"],
    gorev: "Uygulamana ait bir model sınıfı oluştur (örn. User, Product).",
    kaynak: "Dart: class, extends, @override",
  },
  {
    num: 4, label: "API", icon: "🔌",
    desc: "Dış dünyayla konuşmak: veri almak ve göndermek.",
    konular: ["HTTP GET/POST", "JSON parse etme", "async/await", "Hata yönetimi"],
    gorev: "Bir REST API'dan veri çek ve ekranda listele.",
    kaynak: "Flutter: http paketi, json.decode, Future",
  },
  {
    num: 5, label: "Mimari", icon: "🏗️",
    desc: "Kodun nasıl organize edileceğini tasarlamak.",
    konular: ["Katmanlı mimari", "Repository pattern", "Separation of concerns", "SOLID"],
    gorev: "Uygulamanı data / domain / presentation katmanlarına böl.",
    kaynak: "Clean Architecture, Feature-First yapı",
  },
  {
    num: 6, label: "Audit", icon: "🔍",
    desc: "Kodun gerçekten çalışıp çalışmadığını sistematik kontrol etmek.",
    konular: ["Unit test yazma", "Widget test", "Integration test", "Test coverage"],
    gorev: "En kritik 3 fonksiyon için unit test yaz.",
    kaynak: "Flutter: flutter_test, mockito, coverage",
  },
  {
    num: 7, label: "Refactor", icon: "♻️",
    desc: "Çalışan kodu daha temiz, okunabilir ve sürdürülebilir hale getirmek.",
    konular: ["DRY prensibi", "Tekrar eden kod kaldırma", "İsimlendirme standardı", "Bağımlılık azaltma"],
    gorev: "Uygulamanda tekrar eden en az 2 kod bloğunu birleştir.",
    kaynak: "Extract method, extract class, rename refactoring",
  },
  {
    num: 8, label: "Ölçeklenebilirlik", icon: "📈",
    desc: "10 kullanıcıda çalışan kodun 100.000'de de çalışmasını sağlamak.",
    konular: ["Pagination / lazy load", "Cache stratejisi", "Background işlemler", "Database indexleme"],
    gorev: "Liste ekranına pagination ekle, her seferinde 20 kayıt yükle.",
    kaynak: "Flutter: Isolate, compute(), sqflite index",
  },
  {
    num: 9, label: "Yazılım Tasarımı", icon: "🎨",
    desc: "Büyük sistemleri nasıl tasarlayacağını bilmek.",
    konular: ["Design pattern'ler", "State yönetimi", "Event-driven mimari", "Modülerlik"],
    gorev: "Uygulanı için bir state yönetimi kütüphanesi seç ve implement et.",
    kaynak: "Provider, Riverpod, BLoC, GetX karşılaştırması",
  },
  {
    num: 10, label: "Sistem Mimarlığı", icon: "🌐",
    desc: "Tek uygulamanın ötesinde: sistemlerin sistemini tasarlamak.",
    konular: ["Microservices vs Monolith", "API Gateway", "Event bus", "DevOps / CI-CD"],
    gorev: "Uygulamanın production deployment planını çiz.",
    kaynak: "Firebase, Supabase, Docker, GitHub Actions",
  },
];

// ─── Öğrenme Rehberi View ─────────────────────────────────────────────────────
export default function OgrenmeRehberiView({ appName, currentPhase }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [aiContent, setAiContent]         = useState(null);
  const [userLevel, setUserLevel]         = useState(() => {
    // Mevcut faz'a göre tahmini seviye (P1-P20 → Seviye 1-10)
    return Math.min(10, Math.max(1, Math.ceil(currentPhase / 2)));
  });
  const [err, setErr] = useState("");

  const getAiLesson = (level) => {
    if (!appName) return;
    setLoading(true);
    setErr("");
    setAiContent(null);
    const lessons = {
      1: { gercekOrnek: `"${appName}" projesinde bir değişken tanımı: String appName = "${appName}"; — bu değişken uygulamanın adını tutar ve birden fazla yerde kullanılır.`, ipuclari: ["Değişken adları anlamlı olsun: userName yerine u yazma", "Türleri açık belirt: var yerine String, int, bool kullan", "Sabitler için const veya final tercih et"], hataUyarilari: ["Aynı veriyi farklı değişkenlere kopyalamak — tek kaynak ilkesi", "Null kontrolü yapmadan kullanmak — null safety zorunlu"], sonrakiAdim: "Değişkenleri öğrendikten sonra onları gruplamayı öğren: fonksiyonlar ile başla." },
      2: { gercekOrnek: `"${appName}" için: Future<List<Item>> fetchItems() async { final db = await database; return db.query('items'); } — bu fonksiyon veriyi çeker ve döndürür.`, ipuclari: ["Tek sorumluluk: bir fonksiyon bir iş yapsın", "async/await ile asenkron işlemleri senkron gibi yaz", "Return türünü her zaman belirt"], hataUyarilari: ["Fonksiyon içinde çok fazla iş yapmak — böl", "Hata yönetimi olmadan async çağrı — try/catch şart"], sonrakiAdim: "Fonksiyonları bir araya getirerek sınıf oluşturmayı öğren." },
      3: { gercekOrnek: `class ${appName.split(" ")[0]}Model { final String id; final String name; final DateTime createdAt; ${appName.split(" ")[0]}Model({required this.id, required this.name, required this.createdAt}); }`, ipuclari: ["Model sınıfları sadece veri tutsun, iş mantığı servis katmanında olsun", "copyWith metodu ekle: değişmez veri yapısı için kritik", "toJson/fromJson implement et: depolama ve API için şart"], hataUyarilari: ["Sınıfa çok fazla sorumluluk yüklemek — God class anti-pattern", "Mutable state'i doğrudan değiştirmek — immutability tercih et"], sonrakiAdim: "Sınıfları API ile konuşturmayı öğren: HTTP istekleri ile veri çek." },
      4: { gercekOrnek: `final response = await http.get(Uri.parse('https://api.${appName.toLowerCase().replace(/ /g,"")}. com/items')); if (response.statusCode == 200) { return json.decode(response.body); }`, ipuclari: ["Her API çağrısını try/catch ile sar", "Loading state'i yönet: kullanıcı beklerken spinner göster", "Timeout ekle: bekleme süresini sınırla"], hataUyarilari: ["API anahtarını kodun içine gömmek — .env kullan", "Hata durumunda sadece print() — kullanıcıya bildir"], sonrakiAdim: "API çağrılarını organize etmek için mimari katmanları öğren." },
      5: { gercekOrnek: `"${appName}" Clean Architecture: data/(models, repositories, datasources) → domain/(entities, use_cases) → presentation/(screens, providers, widgets). Herbiri bağımsız test edilebilir.`, ipuclari: ["Bağımlılıklar içeriden dışarıya doğru akar, tersi olmaz", "Interface kullan: implementasyonu değiştirebilirsin", "Feature-first klasör yapısı büyük projelerde daha iyi ölçeklenir"], hataUyarilari: ["Katmanları atlayarak UI'dan direkt DB çağrısı yapmak", "Her şeyi tek bir dosyada yazmak — separation of concerns ihlali"], sonrakiAdim: "Mimariyi oturtunca audit sistemi ile kodunu denetle." },
    };
    const content = lessons[level.num] || {
      gercekOrnek: `Seviye ${level.num} — ${level.label}: "${appName}" projesinde bu seviyeye özel pratik uygulama yapman gerekiyor. Önce kavramı öğren, sonra projenin ilgili modülünde uygula.`,
      ipuclari: ["Dokümantasyonu oku, örnekleri çalıştır", "Küçük başla: tek özellik, tek dosya", "Her değişiklikten sonra test et"],
      hataUyarilari: ["Anlamadan kopyala-yapıştır yapmak", "Çok fazla özelliği aynı anda geliştirmeye çalışmak"],
      sonrakiAdim: `Seviye ${Math.min(10, level.num + 1)}'e geçmeden önce bu seviyenin görevini "${appName}" projesinde uygula.`,
    };
    setAiContent(content);
    setLoading(false);
  };

  const handleLevelClick = (level) => {
    if (selectedLevel?.num === level.num) {
      setSelectedLevel(null);
      setAiContent(null);
    } else {
      setSelectedLevel(level);
      getAiLesson(level);
    }
  };

  const levelStatus = (num) => {
    if (num < userLevel)  return "done";
    if (num === userLevel) return "active";
    return "pending";
  };

  return (
    <div>
      {/* Seviye seçici */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, background: "#101526", border: "1px solid #28304a", borderRadius: 10, padding: "12px 16px" }}>
        <span style={{ fontSize: 12, color: "#7a7a9a", whiteSpace: "nowrap" }}>Şu anki seviyem:</span>
        <select
          value={userLevel}
          onChange={(e) => setUserLevel(Number(e.target.value))}
          style={{ flex: 1, background: "#161c32", border: "1px solid #6c63ff", borderRadius: 6, color: "#fff", fontSize: 13, padding: "6px 10px", fontFamily: "inherit", cursor: "pointer" }}
        >
          {LEARNING_LEVELS.map((l) => (
            <option key={l.num} value={l.num}>Seviye {l.num} — {l.label}</option>
          ))}
        </select>
      </div>

      {/* İlerleme çubuğu */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1 }}>ÖĞRENME İLERLEMESİ</span>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#6c63ff" }}>{userLevel - 1}/10 tamamlandı</span>
        </div>
        <div style={{ height: 4, background: "#28304a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((userLevel - 1) / 10) * 100}%`, background: "linear-gradient(90deg,#6c63ff,#43e97b)", transition: "width 0.4s ease", borderRadius: 2 }} />
        </div>
      </div>

      {/* Seviye kartları */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LEARNING_LEVELS.map((level) => {
          const st = levelStatus(level.num);
          const isSelected = selectedLevel?.num === level.num;
          const borderCol = st === "done" ? "#43e97b" : st === "active" ? "#6c63ff" : "#28304a";
          const numCol    = st === "done" ? "#43e97b" : st === "active" ? "#6c63ff" : "#4a4a6a";
          const badge     = st === "done" ? "✅ Tamamlandı" : st === "active" ? "🔨 Aktif" : "⬜ Bekliyor";
          const badgeCol  = st === "done" ? "#43e97b"      : st === "active" ? "#6c63ff"   : "#4a4a6a";

          return (
            <div key={level.num}>
              {/* Kart başlığı */}
              <div
                onClick={() => handleLevelClick(level)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: isSelected ? "rgba(108,99,255,0.12)" : "#101526",
                  border: `1px solid ${isSelected ? "#6c63ff" : borderCol}`,
                  borderRadius: isSelected ? "10px 10px 0 0" : 10,
                  padding: "12px 14px", cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${numCol}18`, border: `1px solid ${numCol}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {level.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: numCol, fontWeight: 700 }}>SEVİYE {level.num}</span>
                    <span style={{ fontSize: 9, fontFamily: "monospace", color: badgeCol, background: `${badgeCol}18`, padding: "1px 6px", borderRadius: 3 }}>{badge}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: st === "pending" ? "#4a4a6a" : "#e8e8f0" }}>{level.label}</div>
                  <div style={{ fontSize: 11, color: "#7a7a9a", marginTop: 2 }}>{level.desc}</div>
                </div>
                <span style={{ color: "#4a4a6a", fontSize: 14 }}>{isSelected ? "▲" : "▼"}</span>
              </div>

              {/* Açık detay paneli */}
              {isSelected && (
                <div style={{ background: "#0c1124", border: "1px solid #6c63ff", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 14px" }}>

                  {/* Konular */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "monospace", color: "#6c63ff", letterSpacing: 1, marginBottom: 8 }}>BU SEVİYEDE ÖĞRENECEKLER</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {level.konular.map((k, i) => (
                        <span key={i} style={{ background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.25)", borderRadius: 20, fontSize: 11, color: "#a0a0c8", padding: "3px 10px" }}>{k}</span>
                      ))}
                    </div>
                  </div>

                  {/* Görev */}
                  <div style={{ background: "rgba(244,197,90,0.08)", border: "1px solid rgba(244,197,90,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "monospace", color: "#f4c55a", letterSpacing: 1, marginBottom: 5 }}>📋 SEVİYE GÖREVİ</div>
                    <p style={{ fontSize: 12, color: "#d0d0e8", margin: 0, lineHeight: 1.6 }}>{level.gorev}</p>
                  </div>

                  {/* Kaynak */}
                  <div style={{ fontSize: 11, color: "#4a4a6a", marginBottom: 14, fontFamily: "monospace" }}>
                    📚 {level.kaynak}
                  </div>

                  {/* AI İçeriği */}
                  {appName ? (
                    <div style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#43e97b", letterSpacing: 1, marginBottom: 10 }}>
                        🤖 AI DERS — {appName.toUpperCase()}
                      </div>

                      {loading ? (
                        <div style={{ color: "#4a4a6a", fontSize: 12 }}>Projeye özel ders hazırlanıyor...</div>
                      ) : err ? (
                        <div style={{ color: "#ff6584", fontSize: 12 }}>{err}</div>
                      ) : aiContent ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {/* Gerçek örnek */}
                          <div>
                            <div style={{ fontSize: 10, color: "#43e97b", fontFamily: "monospace", marginBottom: 5 }}>PROJEDEN GERÇEK ÖRNEK</div>
                            <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.7, margin: 0 }}>{aiContent.gercekOrnek}</p>
                          </div>
                          {/* İpuçları */}
                          <div>
                            <div style={{ fontSize: 10, color: "#6c63ff", fontFamily: "monospace", marginBottom: 6 }}>💡 İPUÇLARI</div>
                            {(aiContent.ipuclari || []).map((ip, i) => (
                              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                                <span style={{ color: "#6c63ff", fontSize: 11 }}>▸</span>
                                <span style={{ fontSize: 12, color: "#d0d0e8" }}>{ip}</span>
                              </div>
                            ))}
                          </div>
                          {/* Hata uyarıları */}
                          <div>
                            <div style={{ fontSize: 10, color: "#ff6584", fontFamily: "monospace", marginBottom: 6 }}>⚠ YAYGIN HATALAR</div>
                            {(aiContent.hataUyarilari || []).map((h, i) => (
                              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                                <span style={{ color: "#ff6584", fontSize: 11 }}>✕</span>
                                <span style={{ fontSize: 12, color: "#d0d0e8" }}>{h}</span>
                              </div>
                            ))}
                          </div>
                          {/* Sonraki adım */}
                          <div style={{ background: "rgba(67,233,123,0.08)", border: "1px solid rgba(67,233,123,0.2)", borderRadius: 6, padding: "8px 12px" }}>
                            <div style={{ fontSize: 10, color: "#43e97b", fontFamily: "monospace", marginBottom: 4 }}>→ SONRAKI ADIM</div>
                            <p style={{ fontSize: 12, color: "#d0d0e8", margin: 0 }}>{aiContent.sonrakiAdim}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 8, padding: 12, fontSize: 12, color: "#4a4a6a", textAlign: "center" }}>
                      Projeyi oluşturduktan sonra AI burada projeye özel ders verecek.
                    </div>
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

