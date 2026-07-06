import { useState, useEffect } from "react";

const storage = {
  async get(key) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? { value: null } : { value: v };
    } catch (_) { return { value: null }; }
  },
  async set(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  },
  async delete(key) {
    try { localStorage.removeItem(key); } catch (_) {}
  },
};

const PHASES = [
  { num: "P1",  name: "Arazi Analizi",   bina: "Arsa",           icon: "🌍", desc: "Fikir netleştirme, hedef kitle, pazar analizi",          gorevler: ["Hedef kitleyi tanımla","Rakip analizi yap","Gelir modelini belirle","Sorun-çözüm eşleştir"], riskler: ["Pazar analizi eksik kalabilir","Hedef kitle çok geniş tutulabilir"], basit: "Bir ev yapmadan önce arsayı incelersin: Burası eve uygun mu? Kimler burada oturacak? Aynı şekilde uygulamayı yapmadan önce 'Bu uygulamayı kim kullanacak, ne işine yarayacak?' diye düşünürüz. Daha kod yazmadan, fikri netleştiririz.", rehber: "Şu soruları kendine sor ve cevapla: 1) Bu uygulamayı kim kullanacak? (Örnek: 'Çiçek satın almak isteyen kişiler') 2) Bu kişilerin hangi sorunu var? (Örnek: 'Çiçekçiye gitmeye vakitleri yok') 3) Uygulaman bu sorunu nasıl çözecek? (Örnek: 'Telefonla sipariş verip eve teslim alacaklar') 4) Para nasıl kazanılacak? (Örnek: 'Her siparişten küçük bir komisyon') Bu 4 soruyu cevapladıysan P1 bitti demektir!" },
  { num: "P2",  name: "Temel Hazırlama", bina: "Temel",          icon: "🏗️", desc: "Mimari karar, teknoloji seçimi, proje kurulumu",          gorevler: ["Teknoloji stackini seç","Proje klasörlerini oluştur","Versiyon kontrolünü kur","CI/CD pipeline planla"], riskler: ["Yanlış teknoloji seçimi","Geç değiştirilmesi pahalı kararlar"], basit: "Ev yapmadan önce hangi malzemeyle yapacağını seçersin: tuğla mı, beton mu? Biz de uygulamayı hangi 'malzemeyle' (hangi programlama diliyle, hangi araçlarla) yapacağımıza karar veririz.", rehber: "Şu soruları kendine sor: 1) Uygulamayı telefon için mi, bilgisayar için mi, ikisi için mi yapacaksın? 2) Bilgiler internete mi kaydedilecek, yoksa sadece telefonda mı kalacak? Cevaplarına göre P2'de 'Proje Türü' ve 'Veritabanı' seçeneklerini yukarıdaki formdan seç.", teknolojiler: [{"isim": "Flutter", "ikon": "🦋", "ne": "Bir uygulama yapma kutusu/aracı. Tek bir kodla hem Android telefon, hem iPhone, hem de bilgisayar için uygulama yapmanı sağlar.", "neden": "Normalde Android için ayrı, iPhone için ayrı kod yazman gerekir — iki kat iş! Flutter ile tek seferde yazıp her cihazda çalıştırırsın. Ücretsizdir, Google yapmıştır."}, {"isim": "Dart", "ikon": "🎯", "ne": "Flutter'ın konuştuğu dil. Flutter bir 'kutu' ise, Dart o kutunun içine yazdığın 'talimatlar'dır (kod).", "neden": "Flutter'ı kullanmak için Dart dilinde yazmak zorundasın — ikisi birlikte çalışır, ayrılmaz bir ikili gibi düşünebilirsin."}, {"isim": "SQLite", "ikon": "🗄️", "ne": "Telefonun içine küçük bir 'defter' kurar ve bilgileri (kullanıcı adı, ürünler, notlar vs.) orada düzenli satır-sütun halinde saklar.", "neden": "İnternet olmadan da çalışır! Bilgiler telefonda kalır, uygulamayı kapatıp açsan bile kaybolmaz. Tamamen ücretsizdir."}, {"isim": "Hive", "ikon": "🐝", "ne": "SQLite'a benzer ama daha basit bir 'kutu' sistemi — bilgileri anahtar-değer şeklinde saklar (örnek: 'isim' kutusuna 'Ahmet' yazarsın).", "neden": "Basit bilgileri (örneğin uygulama ayarları, son bakılan sayfa) SQLite'tan daha hızlı saklamak için kullanılır."}, {"isim": "SharedPreferences", "ikon": "📌", "ne": "Telefonun içinde küçük notlar tutan bir cep defteri. Genelde tek tek küçük bilgiler için kullanılır (örnek: 'karanlık mod açık mı kapalı mı').", "neden": "Karmaşık veri için değil, basit ayarları hatırlamak için idealdir. Kurulumu çok kolaydır."}, {"isim": "JSON", "ikon": "📋", "ne": "Bilgileri yazıyla, düzenli bir liste şeklinde yazmanın bir yolu. Örnek: { isim: 'Elif', yas: 25 } gibi.", "neden": "Bilgisayarların birbirine veya dosyaya bilgi 'göndermesi/kaydetmesi' için ortak, herkesin anladığı bir yazım şeklidir."}, {"isim": "Firebase", "ikon": "🔥", "ne": "Google'ın sunduğu, internete bağlı bilgi saklama ve giriş yapma sistemi. Bilgilerini bulutta (uzak bir bilgisayarda) saklar.", "neden": "Eğer uygulaman internetli çalışacaksa ve farklı telefonlar arasında bilgi paylaşacaksa kullanılır. Bu sistemde varsayılan olarak KAPALI çünkü tamamen offline çalışıyoruz."}, {"isim": "Flame", "ikon": "🎮", "ne": "Flutter'ın üzerine eklenen bir oyun motoru — karakterleri hareket ettirme, çarpışma kontrolü gibi oyun işlerini kolaylaştırır.", "neden": "Sadece oyun yapıyorsan (örneğin Vaka İstanbul gibi) gerekir. Normal uygulamalarda (çiçekçi, ders takip vb.) kullanılmaz."}] },
  { num: "P3",  name: "Beton Dökme",     bina: "Temel Beton",    icon: "🧱", desc: "Core sistem, veri modeli, temel servisler",                gorevler: ["Veri modelini tasarla","Core servisleri yaz","Veritabanı şemasını oluştur","Temel API endpoint'leri kur"], riskler: ["Veri modeli değişirse her şey değişir","Performans sorunları erken fark edilmeyebilir"], basit: "Bina çökmesin diye önce sağlam bir temel dökülür. Uygulamada da en altta, her şeyin üzerine oturduğu temel sistemi (veriler nasıl saklanacak, nasıl çalışacak) kurarız. Bu yanlış olursa sonra her şeyi değiştirmek zorunda kalırız.", rehber: "Uygulamanın hangi bilgileri saklayacağını bir liste yap. Örnek bir çiçekçi uygulaması için: Çiçek adı, fiyatı, fotoğrafı, stok adedi. Bu listeyi çıkarmak, P3'ün yapılması demektir.", teknolojiler: [{"isim": "Veri Modeli", "ikon": "🧩", "ne": "Uygulamandaki bilgilerin nasıl bir şekle sahip olduğunu belirler. Örnek: bir 'Ürün' nesnesinin adı, fiyatı, fotoğrafı olur.", "neden": "Bilgileri düzenli tutmazsan kod karmaşık ve hatalı olur. Önce şekli belirlemek, sonra her yerde aynı şekli kullanmak işini kolaylaştırır."}, {"isim": "Core Servis", "ikon": "⚙️", "ne": "Uygulamanın motoru gibidir — verileri okuyan, kaydeden, hesaplayan arka plan kodu.", "neden": "Ekranlar (butonlar, yazılar) sadece görünümdür; asıl işi yapan bu servisler. Ekran değişse bile servis aynı kalabilir."}] },
  { num: "P4",  name: "Kolonlar",        bina: "Taşıyıcı Kolon", icon: "🏛️", desc: "Ana modüller, kritik özellikler",                         gorevler: ["Ana modülleri kodla","Kritik özellikleri implement et","Modüller arası bağımlılıkları tanımla","İlk entegrasyon testini yap"], riskler: ["Modüller arası bağımlılık karmaşıklığı","Kritik özelliklerin gecikmesi"], basit: "Binayı ayakta tutan kalın direkler (kolonlar) olur. Uygulamanın da onu ayakta tutan en önemli, en kritik özellikleri olur — bunları ilk önce sağlam yaparız.", rehber: "Uygulamanın 'olmazsa olmaz' en önemli 2-3 özelliğini seç. Örnek: bir koşu uygulamasında en önemli özellik 'koşuyu kaydetmek'tir, geri kalan her şey (istatistik, harita rengi vs.) sonra eklenebilir.", teknolojiler: [{"isim": "Modül", "ikon": "📦", "ne": "Uygulamanın bir parçası, kendi başına çalışabilen küçük bir bölüm (örnek: 'Sepet modülü', 'Giriş modülü').", "neden": "Her şeyi tek dosyada yazarsan karman çorman olur. Parçalara bölersen hem anlaması hem düzeltmesi kolaylaşır."}] },
  { num: "P5",  name: "Kat Yapısı",      bina: "Katlar",         icon: "🏢", desc: "Ekranlar, navigasyon, UI akışı",                          gorevler: ["Tüm ekranları tasarla","Navigasyon akışını kur","State yönetimini implement et","Kullanıcı yolculuğunu test et"], riskler: ["UX sorunları geç fark edilebilir","Navigasyon karmaşıklığı"], basit: "Bina kaç katlı olacak, her katta ne olacak diye planlarsın. Uygulamada da kaç tane ekran olacağını ve bu ekranların neler içereceğini planlarız.", rehber: "Bir kağıda uygulamandaki tüm ekranları sırayla yaz. Örnek: Ana Sayfa, Ürün Listesi, Ürün Detayı, Sepet, Ödeme. Bu liste senin 'kat planın' olacak.", teknolojiler: [{"isim": "State (Durum) Yönetimi", "ikon": "🔄", "ne": "Uygulamanın 'şu an ne durumda olduğunu' hatırlayan sistem. Örnek: sepette kaç ürün var, kullanıcı giriş yaptı mı.", "neden": "Bu olmadan ekranlar birbirinden haberdar olmaz — sepete ürün eklesen bile sepet ekranı bunu göremez."}] },
  { num: "P6",  name: "Merdivenler",     bina: "Merdiven",       icon: "🪜", desc: "Ekranlar arası geçiş, deep link, routing",                gorevler: ["Deep link yapısını kur","Route yönetimini implement et","Geri tuşu davranışını ayarla","Bottom nav / drawer kur"], riskler: ["Deep link hataları","Route çakışmaları"], basit: "Katlar arasına merdiven koyarsın ki insanlar geçebilsin. Uygulamada da ekranlar arasında geçiş yapabilmek için 'merdivenler' (bir butona basınca başka ekrana gitme) kurarız.", rehber: "Her ekrandan hangi ekrana, hangi butona basınca gidileceğini ok çizerek göster. Örnek: 'Ana Sayfa'daki 'Ürünler' butonuna basınca 'Ürün Listesi' ekranı açılsın.", teknolojiler: [{"isim": "Routing (Yönlendirme)", "ikon": "🧭", "ne": "Hangi butona basınca hangi ekrana gidileceğini ayarlayan sistem — bir nevi uygulamanın trafik polisi.", "neden": "Ekranlar arasında düzenli geçiş olmazsa kullanıcı kayboluyormuş gibi hisseder."}] },
  { num: "P7",  name: "Elektrik",        bina: "Elektrik Tesisatı", icon: "⚡", desc: "API entegrasyonları, bildirimler, servisler",           gorevler: ["Dış API entegrasyonlarını yap","Push notification kur","Analytics entegre et","Ödeme sistemi bağla"], riskler: ["API değişiklikleri","Bildirim izin sorunları"], basit: "Evde elektrik tesisatı olur, prizler çalışır. Uygulamada da dışarıdan bilgi almak (internet, bildirim göndermek gibi) için benzer bir 'tesisat' kurarız.", rehber: "Uygulamanın dışarıdan bir şeye ihtiyacı var mı diye düşün: Bildirim göndermek mi istiyorsun? Harita mı gösterecek? Bunları yukarıdaki formdaki 'Harita', 'Ödeme' gibi seçeneklerden işaretle.", teknolojiler: [{"isim": "API", "ikon": "🔌", "ne": "İki farklı programın birbiriyle konuşma şekli. Örnek: hava durumu uygulaması, hava durumu sitesinden bilgi 'ister', site de cevap 'gönderir'.", "neden": "Bu sistemde offline çalıştığımız için API'ye genelde ihtiyaç yok, ama ileride internetli bir özellik eklersen gerekebilir."}, {"isim": "Push Notification (Bildirim)", "ikon": "🔔", "ne": "Telefonun ekranına, uygulama kapalıyken bile mesaj göndermesi (örnek: 'Yeni mesajınız var!').", "neden": "Kullanıcıyı uygulamaya geri çağırmak için kullanılır, ama her özellik için gerekli değildir."}] },
  { num: "P8",  name: "Su Tesisatı",     bina: "Su/Kanal",       icon: "🚿", desc: "Veri akışı, senkronizasyon, cache",                      gorevler: ["Cache mekanizmasını kur","Offline senkronizasyon implement et","Veri akışını optimize et","Background sync kur"], riskler: ["Cache invalidation hataları","Offline/online sync çakışmaları"], basit: "Evde su boruları suyu doğru yere taşır. Uygulamada da bilgiler (veriler) bir yerden başka bir yere doğru şekilde akmalı, kaybolmamalı — bunu ayarlarız.", rehber: "Uygulaman internetsizken de çalışsın mı istiyorsun? Eğer evet ise (ki bu sistemde varsayılan budur), bilgiler telefonda saklanır ve internet gelince istersen senkronize edilir.", teknolojiler: [{"isim": "Cache (Önbellek)", "ikon": "💾", "ne": "Sık kullanılan bilgileri geçici olarak saklayıp tekrar tekrar yeniden hesaplamamak.", "neden": "Uygulamayı hızlandırır — her seferinde baştan hesaplamak yerine, hazır olanı gösterir."}, {"isim": "Senkronizasyon (Sync)", "ikon": "🔁", "ne": "Telefonundaki bilgiyle internetteki bilginin birbirine eşit (güncel) tutulması.", "neden": "Offline sistemde genelde gerekmez, ama ileride bulut özelliği eklersen lazım olur."}] },
  { num: "P9",  name: "Çatı",            bina: "Çatı Katı",      icon: "🔐", desc: "Güvenlik katmanı, kimlik doğrulama",                     gorevler: ["Auth sistemini implement et","Token yönetimini kur","Rol tabanlı erişim ekle","Şifrelemeyi kur"], riskler: ["Güvenlik açıkları","Token expire sorunları"], basit: "Evin çatısı yağmurdan, güneşten korur. Uygulamada da kullanıcı bilgilerini kötü insanlardan koruyan bir 'çatı' (güvenlik, şifre kontrolü) kurarız.", rehber: "Uygulamana kim girebilsin diye düşün: Herkes mi, yoksa şifreyle giriş yapanlar mı? Bu kararını not al, P9'da bu karara göre giriş ekranı tasarlanır.", teknolojiler: [{"isim": "Kimlik Doğrulama (Auth)", "ikon": "🪪", "ne": "Uygulamaya giren kişinin gerçekten o kişi olduğunu kontrol etmek (şifre, parmak izi gibi).", "neden": "Kullanıcı bilgilerinin başkası tarafından görülmemesi için gereklidir."}, {"isim": "Token", "ikon": "🎫", "ne": "Giriş yaptıktan sonra sana verilen, 'ben giriş yaptım' diyen geçici bir kimlik kartı gibi.", "neden": "Her ekranda şifreni tekrar tekrar sormaması için kullanılır."}] },
  { num: "P10", name: "Kapılar",         bina: "Kapı/Pencere",   icon: "🚪", desc: "Giriş noktaları, onboarding, auth ekranları",            gorevler: ["Onboarding akışını tasarla","Login/Register ekranlarını bitir","Şifremi unuttum implement et","Social login ekle"], riskler: ["Onboarding drop-off oranı","Auth edge case'leri"], basit: "Eve girmek için kapı ve pencere gerekir. Uygulamaya 'girmek' için de bir giriş ekranı (üye ol, giriş yap gibi) yaparız.", rehber: "Bir kullanıcının uygulamaya ilk girdiğinde göreceği ekranı tasarla: Karşılama mesajı, üye olma/giriş yapma butonları nasıl görünsün?", teknolojiler: [{"isim": "Onboarding", "ikon": "👋", "ne": "Uygulamayı ilk açtığında seni karşılayan, uygulamayı tanıtan ilk ekranlar.", "neden": "Kullanıcı uygulamayı nasıl kullanacağını anlamazsa hemen siler — bu ekranlar yol gösterir."}] },
  { num: "P11", name: "Pencereler",      bina: "Pencere",        icon: "🪟", desc: "UI detayları, widget'lar, görsel bileşenler",            gorevler: ["Custom widget'ları bitir","Responsive tasarımı tamamla","Dark/light mode ekle","Accessibility desteği ekle"], riskler: ["Farklı ekran boyutları","Accessibility eksiklikleri"], basit: "Pencereler eve ışık ve güzellik katar. Uygulamadaki küçük görsel parçaları (butonlar, kutular, ikonlar) burada detaylandırırız.", rehber: "Uygulamandaki butonların, kutucukların renklerini ve şekillerini düşün. Hangi renk şeması seninkine uyar? (Örnek: çiçekçi için pastel pembe-yeşil tonları)", teknolojiler: [{"isim": "Widget", "ikon": "🧱", "ne": "Ekrandaki her küçük parça (buton, yazı kutusu, resim) bir widget'tır. Legolar gibi birleştirerek ekranı oluşturursun.", "neden": "Flutter'da her şey widget'tan yapılır, bu yüzden anlaması uygulamayı anlamanın temelidir."}] },
  { num: "P12", name: "İzolasyon",       bina: "Yalıtım",        icon: "🛡️", desc: "Hata yönetimi, edge case'ler, fallback'ler",            gorevler: ["Global hata yönetimini kur","Loading state'leri ekle","Empty state'leri tasarla","Network hata fallback'lerini yaz"], riskler: ["Yakalanmayan exception'lar","Kötü kullanıcı deneyimi hata durumlarında"], basit: "Evde yalıtım olmazsa soğuk girer, su sızar. Uygulamada da bir şeyler ters giderse (internet kesilirse, yanlış bilgi girilirse) uygulamanın çökmemesi için önlem alırız.", rehber: "'Bir şey ters giderse ne olur?' diye düşün: İnternet kesilirse ne göstereceksin? Kullanıcı yanlış bilgi girerse ne olacak? Bunun için basit bir hata mesajı yaz: 'Bir sorun oluştu, tekrar dene.'", teknolojiler: [{"isim": "Hata Yakalama (Try-Catch)", "ikon": "🧤", "ne": "Kod çalışırken bir hata olursa, uygulamanın çökmek yerine 'bir sorun oluştu' demesini sağlayan yöntem.", "neden": "Hatasız kod yazmak imkansızdır — önemli olan hata olduğunda uygulamanın çökmemesi."}] },
  { num: "P13", name: "Boya",            bina: "Boya/Sıva",      icon: "🎨", desc: "UI polish, tema, animasyonlar",                         gorevler: ["Renk sistemini uygula","Tipografiyi standardize et","Micro animasyonları ekle","Loading skeleton'ları yap"], riskler: ["Tutarsız tasarım dili","Performans yiyen animasyonlar"], basit: "Ev bittikten sonra boyanır, güzelleştirilir. Uygulamayı da renklerle, yazı tipleriyle ve küçük hareketli efektlerle (animasyon) güzelleştiririz.", rehber: "Uygulamana bir ana renk seç (örnek: mavi) ve bir yazı tipi seç. Tüm ekranlarda aynı renk ve yazı tipini kullan, böylece uygulaman düzenli görünür.", teknolojiler: [{"isim": "Tema (Theme)", "ikon": "🎨", "ne": "Uygulamanın renklerini, yazı tiplerini tek bir yerden ayarlayan sistem.", "neden": "Her ekranda renkleri tek tek yazmak yerine, bir kere ayarlayıp her yerde kullanırsın."}] },
  { num: "P14", name: "İç Tasarım",      bina: "Dekorasyon",     icon: "✨", desc: "UX iyileştirme, kullanılabilirlik testi",               gorevler: ["Kullanıcı testi yap","UX akışlarını optimize et","Geri bildirim mekanizması ekle","A/B test planla"], riskler: ["Subjektif UX kararları","Test katılımcısı bulmak"], basit: "Ev sahibi eve taşınmadan önce mobilyaları nereye koyacağını dener, rahat mı diye bakar. Biz de uygulamayı gerçek insanlara denetletir, kullanması kolay mı diye kontrol ederiz.", rehber: "Uygulamanı ailene veya arkadaşına göster, kullanmalarını izle. Nerede zorlandıklarını not al; bu en değerli geri bildirimdir.", teknolojiler: [{"isim": "Kullanılabilirlik Testi (UX Test)", "ikon": "🧪", "ne": "Gerçek insanlara uygulamayı kullandırıp nerede zorlandıklarını izlemek.", "neden": "Sen kendi uygulamana alışkınsın ama başkası ilk defa kullanıyor — onların gözünden bakmak önemlidir."}] },
  { num: "P15", name: "Güvenlik Sistemi",bina: "Alarm/Kilit",    icon: "🔒", desc: "Güvenlik audit, penetrasyon testi, GDPR",               gorevler: ["Güvenlik auditini yap","GDPR uyumluluğunu kontrol et","Penetrasyon testi planla","Veri şifrelemeyi doğrula"], riskler: ["Keşfedilmemiş güvenlik açıkları","GDPR ihlalleri"], basit: "Evlere alarm sistemi ve sağlam kilit takılır, hırsız girmesin diye. Uygulamada da kullanıcı bilgilerinin çalınmaması için ekstra güvenlik kontrolleri yaparız.", rehber: "Kullanıcı bilgilerini (şifre, isim, telefon) kimseyle paylaşmayacağına emin ol. Basit kural: şifreler asla düz yazı olarak kaydedilmez, her zaman şifrelenir.", teknolojiler: [{"isim": "Şifreleme (Encryption)", "ikon": "🔐", "ne": "Bilgiyi karman çorman bir hale getirip, sadece doğru anahtara sahip olanın okuyabilmesini sağlamak.", "neden": "Şifreler düz yazıyla saklanırsa, biri telefonuna erişirse her şeyi görebilir. Şifreleme bunu engeller."}] },
  { num: "P16", name: "Yangın Sistemi",  bina: "Yangın/Alarm",   icon: "🚨", desc: "Crash reporting, monitoring, alerting",                 gorevler: ["Crash reporting kur (Firebase/Sentry)","Performance monitoring ekle","Alert sistemi kur","Log yönetimini implement et"], riskler: ["Sessiz hatalar","Üretim sorunlarını geç fark etmek"], basit: "Binalarda yangın alarmı olur, bir şey yanarsa hemen haber verir. Uygulamada bir hata olursa bunu bize hemen haber veren bir sistem kurarız ki sorunu hızlıca fark edip düzeltelim.", rehber: "Uygulaman çökerse veya hata verirse bunu nasıl öğreneceğini düşün. Basitçe: hata olduğunda bir log (kayıt) dosyasına yaz, böylece sonra bakıp düzeltebilirsin.", teknolojiler: [{"isim": "Crash Reporting", "ikon": "📉", "ne": "Uygulama çöktüğünde, neden çöktüğünü otomatik olarak not eden sistem.", "neden": "Kullanıcı sana 'çöktü' der ama nedenini söylemez — bu sistem sana tam olarak nerede hata olduğunu gösterir."}] },
  { num: "P17", name: "Asansör",         bina: "Asansör",        icon: "🛗", desc: "Performans optimizasyonu, ölçeklenebilirlik",           gorevler: ["Performans profilini çıkar","Darboğazları gider","Pagination/lazy load ekle","Database query'leri optimize et"], riskler: ["Premature optimization","Performans sorunlarını geç fark etmek"], basit: "Yüksek binalarda asansör olmazsa herkes yorulur. Uygulamanın da 'yavaş' kalmaması, hızlı açılması ve akıcı çalışması için iyileştirmeler yaparız.", rehber: "Uygulaman açılırken yavaş mı? Listeler yavaş mı yükleniyor? Bunları test et ve yavaş olan kısımları basitleştir.", teknolojiler: [{"isim": "Performans Optimizasyonu", "ikon": "🚀", "ne": "Uygulamanın daha hızlı açılması ve akıcı çalışması için yapılan iyileştirmeler.", "neden": "Yavaş uygulamalar kullanıcıları sıkar — hız, iyi bir uygulamanın önemli bir parçasıdır."}] },
  { num: "P18", name: "Denetim",         bina: "İnşaat Denetimi",icon: "📋", desc: "Audit, test coverage, code review",                     gorevler: ["Unit test coverage'ı ölç","Integration testleri yaz","Code review checklist uygula","Final audit raporunu yaz"], riskler: ["Düşük test coverage","Gözden kaçan kritik hatalar"], basit: "Bina bitince bir müfettiş gelip her şeyi kontrol eder: kapılar düzgün mü, elektrik güvenli mi? Uygulamada da yayınlamadan önce her şeyi baştan sona test ederiz.", rehber: "Uygulamanın tüm ekranlarını sırayla aç ve dene: Her buton çalışıyor mu? Her form doğru kaydediyor mu? Bulduğun hataları bir listeye yaz.", teknolojiler: [{"isim": "Unit Test", "ikon": "✅", "ne": "Kodun küçük bir parçasının doğru çalışıp çalışmadığını otomatik olarak kontrol eden küçük testler.", "neden": "Elle her şeyi tek tek denemek yerine, bilgisayara 'bunu sen kontrol et' dersin — zamandan tasarruf sağlar."}] },
  { num: "P19", name: "Teslim",          bina: "Taşınma",        icon: "🚀", desc: "v1.0 yayın, store/deploy, lansman",                    gorevler: ["Store listing hazırla","App store optimizasyon yap","Soft launch planla","Lansman kampanyasını kur"], riskler: ["Store reddi","Lansman günü bug'ları"], basit: "Ev hazır olunca insanlar taşınır. Uygulama da hazır olunca mağazaya (Play Store / App Store) yüklenir ve insanlar indirip kullanmaya başlar.", rehber: "Uygulamanı Play Store'a veya App Store'a yüklemeden önce: ikonun hazır mı? Açıklaman yazılı mı? Ekran görüntülerin var mı? Bunlar olmadan yayınlanamaz.", teknolojiler: [{"isim": "Store Listing", "ikon": "🏪", "ne": "Play Store / App Store'da uygulamanın göründüğü sayfa: ikon, açıklama, ekran görüntüleri.", "neden": "İnsanlar uygulamanı indirmeden önce bu sayfaya bakar — düzgün olmazsa kimse indirmez."}] },
  { num: "P20", name: "Bakım",           bina: "Yönetim",        icon: "🔧", desc: "Post-launch bakım, güncelleme döngüsü",                gorevler: ["Kullanıcı geri bildirimlerini topla","Bug fix döngüsünü kur","Güncelleme takvimini oluştur","v1.1 için backlog oluştur"], riskler: ["Teknik borç birikimi","Kullanıcı şikayetlerine yavaş yanıt"], basit: "Eve taşındıktan sonra da bakım gerekir: musluk bozulursa tamir edilir. Uygulama yayınlandıktan sonra da kullanıcıların önerilerine göre güncellenir, hatalar düzeltilir.", rehber: "Yayından sonra kullanıcılardan gelen yorumları oku ve en çok şikayet edilen sorunu önce çöz. Küçük adımlarla, düzenli güncelleme yap.", teknolojiler: [{"isim": "Sürüm (Versiyon) Güncelleme", "ikon": "🔢", "ne": "Uygulamaya küçük düzeltmeler veya yeni özellikler eklendikten sonra yayınlanan yeni hali (örnek: v1.0 → v1.1).", "neden": "Hiçbir uygulama tek seferde mükemmel olmaz — küçük güncellemelerle zamanla gelişir."}] },
];

const EXAMPLES = [
  "🌸 Çiçek satış uygulaması",
  "🏃 Koşu takip uygulaması",
  "🕵️ Vaka İstanbul — 2D dedektif oyunu",
  "📚 Öğrenciler için ders takip sistemi",
  "🐾 Evcil hayvan sahipleri sosyal ağı",
  "🍽️ Restoran rezervasyon uygulaması",
  "📈 Borsa simülasyon uygulaması",
];

const DECISION_EXAMPLES = [
  "Flutter ile yapacağım",
  "SQLite kullanacağım",
  "Ücretsiz yapmak istiyorum",
  "Firebase kullanacağım",
  "React Native ile yapacağım",
  "Tamamen offline çalışsın istiyorum",
  "PostgreSQL kullanacağım",
  "Bulut senkronizasyonu ekleyeceğim",
];

const STATUSES = ["Bekliyor", "Planlandı", "Yapılıyor", "Testte", "Auditte", "Düzeltmede", "Hazır", "Yayınlandı"];
const STATUS_COLORS = {
  "Bekliyor":   "#4a4a6a",
  "Planlandı":  "#7a7a9a",
  "Yapılıyor":  "#6c63ff",
  "Testte":     "#f4c55a",
  "Auditte":    "#ff9f5a",
  "Düzeltmede": "#ff6584",
  "Hazır":      "#43e97b",
  "Yayınlandı": "#3ad6e0",
};

const TABS = [
  { id: "bina",       label: "🏢 Bina" },
  { id: "manifesto",  label: "📋 Manifesto" },
  { id: "mimari",     label: "🏗️ Mimari" },
  { id: "sablon",     label: "🧩 Şablon Motoru" },
  { id: "teknoloji",  label: "🧰 Teknoloji" },
  { id: "ozellikler", label: "⚙️ Özellikler" },
  { id: "pano",       label: "📌 Görev Panosu" },
  { id: "danisman",   label: "🧭 Danışman" },
  { id: "yardimci",   label: "🤝 AI Yardımcısı" },
  { id: "guvenlik",   label: "🔒 Güvenlik" },
  { id: "roadmap",    label: "🗺️ Roadmap" },
  { id: "klasorler",  label: "📁 Klasörler" },
  { id: "refactor",   label: "♻️ Refactor" },
  { id: "saglik",     label: "📊 Sağlık" },
  { id: "ogrenme",    label: "🎓 Öğrenme Rehberi" },
  { id: "fazlar",     label: "🚀 Geliştirme Fazları" },
  { id: "test",       label: "🔁 Test Döngüsü" },
  { id: "yasam",      label: "🌱 Yaşam Döngüsü" },
  { id: "dokuman",    label: "📄 Dokümantasyon" },
  { id: "zombi",      label: "🧠 Zombi Bug" },
  { id: "builder",    label: "🔧 Builder" },
  { id: "audit",      label: "✅ Audit" },
];

// ─── Audit Sistemi (Bölüm 8) ─────────────────────────────────────────────────
function AuditView({ appName, features, currentPhase }) {
  const [version, setVersion]   = useState("v0.7");
  const [loading, setLoading]   = useState(false);
  const [audit, setAudit]       = useState(null);
  const [history, setHistory]   = useState([]);
  const [err, setErr]           = useState("");
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await storage.get("audit-history", false);
        if (saved && saved.value) {
          const parsed = JSON.parse(saved.value);
          if (Array.isArray(parsed)) setHistory(parsed);
        }
      } catch (_) {}
      finally { setLoaded(true); }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await storage.set("audit-history", JSON.stringify(history), false); } catch (_) {}
    })();
  }, [history, loaded]);

  const runAudit = () => {
    if (!appName || loading) return;
    setLoading(true);
    setErr("");
    setAudit(null);
    const featList = (features || []).map(f => f.name) || [];
    const vNum = parseFloat(version.replace("v",""));
    const parsed = {
      calisan: [
        vNum >= 0.1 ? "Proje kurulumu ve klasör yapısı hazır" : null,
        vNum >= 0.2 ? "Temel ekranlar ve navigasyon çalışıyor" : null,
        vNum >= 0.3 ? "Veri modeli ve CRUD işlemleri aktif" : null,
        vNum >= 0.5 ? "Ana özellikler (" + (featList.slice(0,2).join(", ") || "temel modüller") + ") entegre edildi" : null,
        vNum >= 0.8 ? "Feature freeze uygulandı, test sürecine girildi" : null,
        vNum >= 0.9 ? "Audit tamamlandı, yayın öncesi onay alındı" : null,
        vNum >= 1.0 ? "v1.0 yayınlandı, canlı sistem izleniyor" : null,
      ].filter(Boolean).slice(0, 6),
      uyari: [
        vNum < 0.5 ? "Test kapsamı henüz yetersiz, unit testler eklenmeli" : "Test coverage artırılmaya devam edilmeli",
        "Teknik borç birikimi takip edilmeli, refactor planlanmalı",
        vNum < 1.0 ? "Kullanıcı deneyimi testleri henüz yapılmadı" : "Kullanıcı geri bildirimleri aktif takip edilmeli",
      ],
      kritik: vNum < 0.3 ? ["Veri modeli kesinleşmeden özellik geliştirme başlamamalı"] : [],
      ozet: `"${appName}" ${version} sürümü genel değerlendirme: P${currentPhase} fazında ilerleme devam ediyor. ${vNum < 0.5 ? "Temel mimari oturuyor, özellikler ekleniyor." : vNum < 1.0 ? "Yayına hazırlık aşamasında, testler kritik." : "Canlıda, bakım döngüsü aktif."}`,
    };
    setAudit(parsed);
    setHistory(h => [{ version, appName, audit: parsed, date: new Date().toLocaleDateString("tr-TR") }, ...h.slice(0, 9)]);
    setLoading(false);
  };

  const VERSION_OPTIONS = ["v0.1","v0.2","v0.3","v0.5","v0.7","v0.8","v0.9","v1.0","v1.1","v1.2","v1.5","v2.0"];

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 16, lineHeight: 1.7 }}>
        Projenin belirli bir sürümünü denetle. Metottaki audit formatını kullanır:<br/>
        <span style={{ color: "#43e97b", fontFamily: "monospace" }}>✓ çalışıyor</span> ve <span style={{ color: "#f4c55a", fontFamily: "monospace" }}>⚠ uyarı</span> maddeleri üretir.
      </p>

      {/* Sürüm seçici */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 140px" }}>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, marginBottom: 6 }}>SÜRÜM</div>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={{ width: "100%", background: "#161c32", border: "1px solid #6c63ff", borderRadius: 6, color: "#fff", fontSize: 13, padding: "8px 10px", fontFamily: "inherit", cursor: "pointer" }}
          >
            {VERSION_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <button
          onClick={runAudit}
          disabled={loading || !appName}
          style={{ flex: "1 1 140px", background: loading ? "#2f3a5c" : "#6c63ff", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, padding: "9px 16px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
        >
          {loading ? "⏳ Denetleniyor..." : "🔍 Audit Çalıştır"}
        </button>
      </div>

      {!appName && (
        <div style={{ background: "rgba(244,197,90,0.08)", border: "1px solid rgba(244,197,90,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f4c55a", marginBottom: 14 }}>
          ⚠ Önce projeyi oluştur.
        </div>
      )}

      {err && (
        <div style={{ background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12, marginBottom: 14 }}>
          {err}
        </div>
      )}

      {/* Audit raporu — metindeki format */}
      {audit && (
        <div style={{ background: "#0c1124", border: "1px solid #28304a", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
          {/* Başlık */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #28304a", background: "#101526", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#6c63ff" }}>{version} AUDIT</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4a4a6a" }}>— {appName}</span>
          </div>

          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Çalışan maddeler */}
            {(audit.calisan || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "4px 0" }}>
                <span style={{ color: "#43e97b", fontFamily: "monospace", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "#d0d0e8", lineHeight: 1.4 }}>{m}</span>
              </div>
            ))}

            {/* Uyarı maddeler */}
            {(audit.uyari || []).length > 0 && (
              <div style={{ marginTop: 6 }}>
                {(audit.uyari || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "4px 0" }}>
                    <span style={{ color: "#f4c55a", fontFamily: "monospace", fontSize: 13, flexShrink: 0, marginTop: 1 }}>⚠</span>
                    <span style={{ fontSize: 13, color: "#d0d0e8", lineHeight: 1.4 }}>{m}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Kritik maddeler */}
            {(audit.kritik || []).length > 0 && (
              <div style={{ marginTop: 6 }}>
                {(audit.kritik || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "4px 0" }}>
                    <span style={{ color: "#ff6584", fontFamily: "monospace", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✕</span>
                    <span style={{ fontSize: 13, color: "#d0d0e8", lineHeight: 1.4 }}>{m}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Özet */}
            {audit.ozet && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #28304a", fontSize: 12, color: "#7a7a9a", lineHeight: 1.6 }}>
                {audit.ozet}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Geçmiş auditler */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#4a4a6a", letterSpacing: 1, marginBottom: 8, paddingTop: 8, borderTop: "1px solid #28304a" }}>GEÇMİŞ AUDİTLER</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => { setVersion(h.version); setAudit(h.audit); }}
                style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 8, padding: "10px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6c63ff", fontWeight: 700 }}>{h.version}</span>
                  <span style={{ fontSize: 12, color: "#43e97b" }}>✓ {h.audit?.calisan?.length || 0}</span>
                  <span style={{ fontSize: 12, color: "#f4c55a" }}>⚠ {h.audit?.uyari?.length || 0}</span>
                  {(h.audit?.kritik?.length || 0) > 0 && <span style={{ fontSize: 12, color: "#ff6584" }}>✕ {h.audit.kritik.length}</span>}
                </div>
                <span style={{ fontSize: 10, color: "#4a4a6a" }}>{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Builder Dosyası Üreticisi ────────────────────────────────────────────────
const BUILDER_TYPES = [
  { id: "fix",         label: "fix.py",          icon: "🔧", desc: "Hataları otomatik düzelten entegrasyon dosyası" },
  { id: "builder",     label: "builder.py",       icon: "🏗️", desc: "Özellik ekleyen yapı dosyası" },
  { id: "integrator",  label: "integrator.py",    icon: "🔌", desc: "Modülleri birleştiren entegratör" },
  { id: "audit",       label: "audit.py",         icon: "🔍", desc: "Proje audit ve kontrol dosyası" },
  { id: "generator",   label: "generator.py",     icon: "⚡", desc: "Kod ve dosya üreten jeneratör" },
  { id: "updater",     label: "updater.py",       icon: "🔄", desc: "Mevcut kodu güncelleyen dosya" },
];

const DEV_METHODS = [
  { id: "manuel",     label: "Manuel", desc: "Kodu sen kendin yaz, dosya sadece referans/iskelet olsun." },
  { id: "ai",         label: "AI destekli", desc: "AI seninle birlikte adım adım kod üretsin." },
  { id: "builder",    label: "Builder sistemi ile", desc: "Tek bir builder dosyası tüm değişiklikleri otomatik uygulasın." },
  { id: "patch",      label: "Otomatik patch sistemi ile", desc: "Küçük patch dosyaları üretilsin, her biri ayrı uygulansın." },
];

function BuilderView({ appName, features, folders }) {
  const [selectedType, setSelectedType] = useState(BUILDER_TYPES[0]);
  const [devMethod, setDevMethod]       = useState(DEV_METHODS[1]);
  const [customTask, setCustomTask]     = useState("");
  const [loading, setLoading]           = useState(false);
  const [output, setOutput]             = useState(null);
  const [copied, setCopied]             = useState(false);
  const [err, setErr]                   = useState("");

  const generate = () => {
    if (!appName || loading) return;
    setLoading(true);
    setErr("");
    setOutput(null);
    const featList   = (features || []).map(f => f.name).join(", ") || "özellikler";
    const folderList = (folders  || []).slice(0, 10).join(", ")    || "core/, features/, screens/";
    const task = customTask.trim() || selectedType.desc;
    const code = `#!/usr/bin/env python3
"""
${selectedType.label} — ${appName}
Görev: ${task}
Geliştirme yöntemi: ${devMethod.label}
Özellikler: ${featList}
"""

import os
import json
import shutil
import datetime
from pathlib import Path

# ── Proje yapılandırması ──────────────────────────────────────────────────────
PROJECT_NAME = "${appName}"
PROJECT_ROOT = Path(".")
LOG_FILE     = PROJECT_ROOT / "audit" / "${selectedType.id}_log.txt"
FEATURES     = [${(features || []).map(f => `"${f.name}"`).join(", ")}]
FOLDERS      = [${(folders  || []).map(f => `"${f}"`).join(", ")}]

def log(msg: str):
    """Mesajı hem ekrana hem log dosyasına yazar."""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    try:
        LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\\n")
    except Exception as e:
        print(f"  ⚠ Log yazılamadı: {e}")

def scan_project():
    """Proje klasörlerini tarar ve durumlarını raporlar."""
    log(f"🔍 '{PROJECT_NAME}' proje taraması başlıyor...")
    found, missing = [], []
    for folder in FOLDERS:
        path = PROJECT_ROOT / folder.rstrip("/")
        if path.exists():
            found.append(folder)
            log(f"  ✓ {folder}")
        else:
            missing.append(folder)
            log(f"  ✕ {folder} (eksik)")
    log(f"Tarama tamamlandı: {len(found)} mevcut, {len(missing)} eksik.")
    return found, missing

def create_missing_folders(missing):
    """Eksik klasörleri oluşturur."""
    if not missing:
        log("✅ Tüm klasörler mevcut, oluşturulacak bir şey yok.")
        return
    log(f"📁 {len(missing)} eksik klasör oluşturuluyor...")
    for folder in missing:
        path = PROJECT_ROOT / folder.rstrip("/")
        path.mkdir(parents=True, exist_ok=True)
        # Boş .gitkeep ekle
        (path / ".gitkeep").touch()
        log(f"  + {folder} oluşturuldu")

def apply_changes():
    """${task} işlemini uygular."""
    log(f"⚡ Görev başlıyor: ${task}")
    # Buraya AI'dan aldığın değişiklikleri yapıştır
    # Örnek: dosya oluşturma, içerik yazma, güncelleme
    log("  → Değişiklikler uygulandı (bu kısma AI çıktısını yapıştır)")

def generate_report():
    """Proje durum raporunu üretir."""
    report = {
        "proje": PROJECT_NAME,
        "tarih": datetime.datetime.now().isoformat(),
        "ozellikler": FEATURES,
        "klasorler": FOLDERS,
        "dosya": "${selectedType.label}",
        "gorev": "${task}",
    }
    report_path = PROJECT_ROOT / "audit" / "${selectedType.id}_report.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    log(f"📊 Rapor kaydedildi: {report_path}")
    return report

def main():
    log("=" * 60)
    log(f"🚀 {PROJECT_NAME} — ${selectedType.label}")
    log("=" * 60)
    found, missing = scan_project()
    create_missing_folders(missing)
    apply_changes()
    report = generate_report()
    log("=" * 60)
    log(f"✅ Tamamlandı! Özellikler: {len(FEATURES)}, Klasörler: {len(FOLDERS)}")
    log("=" * 60)

if __name__ == "__main__":
    main()
`;
    setTimeout(() => { setOutput(code); setLoading(false); }, 300);
  };

  const copyCode = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadFile = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = selectedType.label;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 16, lineHeight: 1.7 }}>
        Master Prompt'taki <strong style={{ color: "#6c63ff" }}>Entegrasyon Dosyası</strong> sistemini kullan —
        AI çıktısını projeye uygulayan, hata düzelten, özellik ekleyen Python dosyaları üret.
        Kopyala veya indir, <code style={{ background: "#161c32", padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>python fix.py</code> ile çalıştır.
      </p>

      {/* Geliştirme yöntemi seçici — Bölüm 18 madde 10 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, marginBottom: 8 }}>PROJEYİ NASIL GELİŞTİRMEK İSTİYORSUN?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {DEV_METHODS.map((m) => (
            <div
              key={m.id}
              onClick={() => setDevMethod(m)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
                background: devMethod.id === m.id ? "rgba(108,99,255,0.1)" : "transparent",
                border: `1px solid ${devMethod.id === m.id ? "#6c63ff" : "#28304a"}`,
                borderRadius: 8, padding: "9px 12px",
              }}
            >
              <span style={{ fontSize: 14, marginTop: 1, color: devMethod.id === m.id ? "#6c63ff" : "#4a4a6a" }}>{devMethod.id === m.id ? "●" : "○"}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: devMethod.id === m.id ? "#fff" : "#a0a0c8" }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "#7a7a9a", marginTop: 2, lineHeight: 1.4 }}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dosya tipi seçici */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, marginBottom: 8 }}>DOSYA TİPİ SEÇ</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
          {BUILDER_TYPES.map((t) => (
            <div
              key={t.id}
              onClick={() => { setSelectedType(t); setOutput(null); }}
              style={{
                background: selectedType.id === t.id ? "rgba(108,99,255,0.15)" : "#101526",
                border: `1px solid ${selectedType.id === t.id ? "#6c63ff" : "#28304a"}`,
                borderRadius: 8, padding: "10px 12px", cursor: "pointer", transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 4 }}>{t.icon}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: selectedType.id === t.id ? "#6c63ff" : "#a0a0c8", marginBottom: 3 }}>{t.label}</div>
              <div style={{ fontSize: 10, color: "#4a4a6a", lineHeight: 1.4 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Özel görev */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, marginBottom: 6 }}>ÖZEL GÖREV (isteğe bağlı)</div>
        <input
          value={customTask}
          onChange={(e) => setCustomTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder={`Örn: "${selectedType.desc}" — boş bırakırsan varsayılan görev kullanılır`}
          style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 13, padding: "9px 12px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* Üret butonu */}
      <button
        onClick={generate}
        disabled={loading || !appName}
        style={{ width: "100%", background: loading ? "#2f3a5c" : "linear-gradient(135deg,#6c63ff,#3ad6e0)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, padding: "11px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 14 }}
      >
        {loading ? `⏳ ${selectedType.label} üretiliyor...` : `⚡ ${selectedType.label} Üret`}
      </button>

      {!appName && (
        <div style={{ background: "rgba(244,197,90,0.08)", border: "1px solid rgba(244,197,90,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f4c55a", marginBottom: 14 }}>
          ⚠ Önce ana ekrandan projeyi oluştur — dosya projeye özel üretilecek.
        </div>
      )}

      {err && (
        <div style={{ marginBottom: 12, background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12 }}>
          {err}
        </div>
      )}

      {/* Kod çıktısı */}
      {output && (
        <div style={{ background: "#0a0e1f", border: "1px solid #28304a", borderRadius: 10, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #28304a", background: "#101526" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{selectedType.icon}</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6c63ff", fontWeight: 700 }}>{selectedType.label}</span>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4a4a6a" }}>— {appName}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={copyCode}
                style={{ background: copied ? "rgba(67,233,123,0.15)" : "transparent", border: `1px solid ${copied ? "#43e97b" : "#28304a"}`, borderRadius: 6, color: copied ? "#43e97b" : "#7a7a9a", fontFamily: "monospace", fontSize: 10, padding: "4px 10px", cursor: "pointer" }}
              >
                {copied ? "✓ kopyalandı" : "kopyala"}
              </button>
              <button
                onClick={downloadFile}
                style={{ background: "rgba(108,99,255,0.15)", border: "1px solid #6c63ff", borderRadius: 6, color: "#6c63ff", fontFamily: "monospace", fontSize: 10, padding: "4px 10px", cursor: "pointer" }}
              >
                ⬇ indir
              </button>
            </div>
          </div>

          {/* Kullanım talimatı */}
          <div style={{ padding: "8px 14px", background: "rgba(67,233,123,0.05)", borderBottom: "1px solid #13192e", fontSize: 11, color: "#43e97b", fontFamily: "monospace" }}>
            $ python {selectedType.label}
          </div>

          {/* Kod */}
          <pre style={{ margin: 0, padding: "16px 14px", fontFamily: "monospace", fontSize: 11, color: "#c8c8e0", lineHeight: 1.8, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 500, overflowY: "auto" }}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Zombi Bug Denetçisi ──────────────────────────────────────────────────────
const ZOMBI_EXAMPLES = [
  "Kullanıcı kayıt olur, profil oluşur ama giriş ekranı güncellenmez",
  "Ürün sepete eklenir ama stok düşmez",
  "Şifre sıfırlama maili gider ama oturum kapatılmaz",
  "Bildirim gönderilir ama okundu olarak işaretlenmez",
  "Kullanıcı silinir ama yorumları kalmaya devam eder",
  "Ödeme onaylanır ama sipariş durumu güncellenmez",
];

function ZombiBugView({ appName, features }) {
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

// ─── Öğrenme Seviyeleri Tanımı ────────────────────────────────────────────────
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
function OgrenmeRehberiView({ appName, features, currentPhase }) {
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

// ─── Test Döngüsü (Bölüm 7) ─────────────────────────────────────────────────
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

function TestDongusuView({ appName, features }) {
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

// ─── Proje Yaşam Döngüsü (Bölüm 24) ─────────────────────────────────────────
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

function YasamDongusuView({ appName, features, currentPhase }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [aiTip, setAiTip]       = useState(null);
  const [err, setErr]           = useState("");

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

// ─── Dokümantasyon Üreticisi (Bölüm 14) ──────────────────────────────────────
const DOC_TYPES = [
  { id: "readme",    label: "README.md",       icon: "📖", color: "#6c63ff", desc: "Projeye giriş, kurulum, kullanım kılavuzu" },
  { id: "changelog", label: "CHANGELOG.md",    icon: "📝", color: "#3ad6e0", desc: "Sürüm geçmişi ve değişiklik listesi" },
  { id: "audit",     label: "AUDIT_REPORT.md", icon: "✅", color: "#43e97b", desc: "Kapsamlı audit ve kalite raporu" },
  { id: "bug",       label: "BUG_REPORT.md",   icon: "🐛", color: "#ff6584", desc: "Bilinen buglar ve çözüm durumları" },
  { id: "depmap",    label: "DEPENDENCY_MAP.md",icon: "🗺️", color: "#f4c55a", desc: "Modüller arası bağımlılık haritası" },
  { id: "arch",      label: "ARCHITECTURE.md", icon: "🏗️", color: "#ff9f5a", desc: "Sistem mimarisi ve tasarım kararları" },
];

function DokumantasyonView({ appName, features, result, currentPhase }) {
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
    const roadmapStr = (result?.roadmap || []).map(r => `- **${r.version}** — ${r.desc}`).join("\n") || "- Roadmap oluşturulmadı";
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

// ─── Geliştirme Fazları (Bölüm 17) ──────────────────────────────────────────
const DEV_PHASES = [
  {
    num: 1,
    label: "Bilgi Merkezi",
    icon: "📖",
    color: "#6c63ff",
    desc: "Temel kavramlar: Yazılım nedir? Kod nedir? API nedir? Veri nedir?",
    items: ["Yazılım nedir?", "Kod nedir?", "API nedir?", "Veri nedir?", "Veritabanı nedir?", "Uygulama türleri"],
    cikti: "Kavram haritası — hangi parça ne işe yarar",
  },
  {
    num: 2,
    label: "Bina Metaforu",
    icon: "🏗️",
    color: "#3ad6e0",
    desc: "Temel → Kolon → Kat → Elektrik → Tesisat → Denetim mantığıyla düşünmek.",
    items: ["Temel (Core sistem)", "Kolon (Ana modüller)", "Kat (Ekranlar)", "Elektrik (API)", "Tesisat (Veri akışı)", "Denetim (Audit)"],
    cikti: "P1–P20 bina haritası ile proje konumunu bilmek",
  },
  {
    num: 3,
    label: "Proje Üretici",
    icon: "⚙️",
    color: "#f4c55a",
    desc: "Kullanıcı seçer — sistem otomatik üretir.",
    items: [
      "Oyun / Eğitim / Müzik / Sosyal medya / Sağlık / Harita / Yapay zekâ / Üretkenlik",
      "Master Prompt üretimi",
      "Architecture Manifest üretimi",
      "Manifest Skeleton üretimi",
      "Feature Manifest üretimi",
      "Audit Planı + Roadmap üretimi",
    ],
    cikti: "Projeye özel eksiksiz mimari paket",
  },
  {
    num: 4,
    label: "AI Yardımcısı",
    icon: "🤝",
    color: "#43e97b",
    desc: "Claude / ChatGPT çıktısını yapıştır — sistem analiz eder.",
    items: [
      "Claude çıktısı yapıştırılır",
      "ChatGPT çıktısı yapıştırılır",
      "Sistem analiz eder",
      "Eksik parçaları bulur",
      "Riskleri gösterir",
      "Audit oluşturur",
    ],
    cikti: "Eksik + risk + öneri raporu",
  },
  {
    num: 5,
    label: "Tam Öğrenme Döngüsü",
    icon: "🔄",
    color: "#ff6584",
    desc: "Öğren → Üret → Test et → Düzelt → Audit yap → Refactor yap → Yayınla → Ölçekle → Tekrar et.",
    items: [
      "Öğren",
      "Üret",
      "Test et",
      "Düzelt",
      "Audit yap",
      "Refactor yap",
      "Yayınla",
      "Ölçekle",
      "Tekrar et",
    ],
    cikti: "Kendi başına uygulama geliştirebilecek seviye",
  },
];

function FazlarView({ appName, currentPhase }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [aiTip, setAiTip]       = useState(null);
  const [err, setErr]           = useState("");

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


// ─── Bina Görünümü (Animasyonlu) ─────────────────────────────────────────────
function BinaView({ currentPhase, setCurrentPhase, appName }) {
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

// ─── Görev Panosu (Kanban) ──────────────────────────────────────────────────────
function TaskBoardView({ features }) {
  const [statuses, setStatuses] = useState(() => (features || []).map(() => "Bekliyor"));
  const [loaded, setLoaded]     = useState(false);

  // Özellikler değiştiğinde (yeni proje) varsayılana dön, kayıtlı durum varsa onu kullan
  useEffect(() => {
    let current = true;
    setLoaded(false);
    (async () => {
      const defaults = (features || []).map(() => "Bekliyor");
      setStatuses(defaults);
      try {
        const saved = await storage.get("kanban-statuses", false);
        if (current && saved && saved.value) {
          const parsed = JSON.parse(saved.value);
          if (Array.isArray(parsed) && parsed.length === (features || []).length) {
            setStatuses(parsed);
          }
        }
      } catch (_) {
        // kayıtlı durum yok
      } finally {
        if (current) setLoaded(true);
      }
    })();
    return () => { current = false; };
  }, [features]);

  // Durumlar değiştikçe kaydet (ilk yükleme tamamlanmadan kaydetme)
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await storage.set("kanban-statuses", JSON.stringify(statuses), false); } catch (_) {}
    })();
  }, [statuses, loaded]);

  if (!features || features.length === 0) {
    return (
      <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 24, textAlign: "center" }}>
        <p style={{ color: "#4a4a6a", fontSize: 12 }}>Henüz özellik üretilmedi.</p>
      </div>
    );
  }

  const grouped = STATUSES.reduce((acc, s) => { acc[s] = []; return acc; }, {});
  features.forEach((f, i) => {
    const st = statuses[i] || "Bekliyor";
    (grouped[st] || grouped["Bekliyor"]).push(i);
  });

  const setStatus = (i, val) => {
    setStatuses((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 12, lineHeight: 1.6 }}>
        Her özelliğin durumunu kart üzerindeki menüden değiştir. Kartlar otomatik olarak ilgili sütuna taşınır.
      </p>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
        {STATUSES.map((st) => (
          <div key={st} style={{ flex: "0 0 156px", background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingBottom: 6, borderBottom: `2px solid ${STATUS_COLORS[st]}` }}>
              <span style={{ fontSize: 10, fontFamily: "monospace", color: STATUS_COLORS[st], fontWeight: 700, letterSpacing: 0.5 }}>{st.toUpperCase()}</span>
              <span style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "monospace" }}>{grouped[st].length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 30 }}>
              {grouped[st].map((i) => {
                const f = features[i];
                return (
                  <div key={i} style={{ background: "#101526", border: `1px solid ${STATUS_COLORS[st]}44`, borderRadius: 6, padding: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>{f.name}</div>
                    <select
                      value={st}
                      onChange={(e) => setStatus(i, e.target.value)}
                      style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 4, color: "#d0d0e8", fontSize: 10, padding: "4px 6px", fontFamily: "inherit", cursor: "pointer" }}
                    >
                      {STATUSES.map((s2) => (<option key={s2} value={s2}>{s2}</option>))}
                    </select>
                  </div>
                );
              })}
              {grouped[st].length === 0 && (
                <div style={{ fontSize: 10, color: "#2c3650", textAlign: "center", padding: "10px 0" }}>—</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mimarlık Danışmanı ─────────────────────────────────────────────────────────
function DanismanView({ appName, initialScale }) {
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

// ─── AI Yardımcısı ──────────────────────────────────────────────────────────────
function AIYardimciView({ appName, features }) {
  const [pasted, setPasted]   = useState("");
  const [source, setSource]   = useState("Claude");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [err, setErr]         = useState("");

  const analyze = () => {
    const text = pasted.trim();
    if (!text || loading) return;
    setLoading(true);
    setErr("");
    setResult(null);
    const wordCount = text.split(/\s+/).length;
    const hasCode   = text.includes("void ") || text.includes("class ") || text.includes("import ") || text.includes("def ") || text.includes("function ");
    const hasJson   = text.startsWith("{") || text.startsWith("[");
    const featNames = (features || []).map(f => f.name);
    const missing   = featNames.filter(f => !text.toLowerCase().includes(f.toLowerCase())).slice(0,4);
    const parsed = {
      ozet: `${source} çıktısı analiz edildi (${wordCount} kelime). ${hasCode ? "Kod içeriği tespit edildi" : hasJson ? "Yapılandırılmış veri tespit edildi" : "Düz metin/plan içeriği tespit edildi"}. ${appName ? `"${appName}" projesi bağlamında ${missing.length > 0 ? missing.length + " eksik özellik bulundu" : "özellikler kapsanmış görünüyor"}.` : ""}`,
      eksikler: [
        ...(missing.length > 0 ? missing.map(m => `${m} özelliği bu çıktıda ele alınmamış`) : ["Tüm planlanan özellikler kapsanmış görünüyor"]),
        wordCount < 100 ? "Çıktı oldukça kısa — daha fazla detay istenebilir" : null,
        !text.toLowerCase().includes("hata") && !text.toLowerCase().includes("error") ? "Hata yönetimi senaryoları eksik" : null,
        !text.toLowerCase().includes("test") ? "Test stratejisi belirtilmemiş" : null,
      ].filter(Boolean).slice(0, 5),
      riskler: [
        "Kopyala-yapıştır öncesi kodu anladığından emin ol — zombi bug riski var",
        hasCode ? "Kod çalıştırılmadan önce test döngüsüne sok" : "Planı uygulamaya geçirmeden önce küçük prototiple doğrula",
        "Bu çıktı güncel olmayabilir — kütüphane versiyonlarını kontrol et",
        appName ? `"${appName}" projesinin spesifik gereksinimlerine uymayabilir` : "Projeye özgü düzenlemeler gerekebilir",
      ],
      oneriler: [
        "Bu çıktıyı AI Yardımcısı sekmesindeki Test Döngüsüne (Bölüm 7) göre işlet",
        hasCode ? "Kodu küçük parçalara böl, her parçayı ayrı test et" : "Planı P1–P20 bina adımlarıyla eşleştir",
        "Anlamadığın kısımları işaretle, AI'a tekrar sor — tüm çıktıyı körü körüne uygulama",
        "Audit sekmesinde proje sürümü için kontrol listesi çalıştır",
      ],
    };
    setTimeout(() => { setResult(parsed); setLoading(false); }, 200);
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#7a7a9a", marginBottom: 14, lineHeight: 1.6 }}>
        Claude, ChatGPT veya başka bir AI'dan aldığın çıktıyı (kod, plan, açıklama) yapıştır — sistem bu projenin ihtiyaçlarına göre eksikleri, riskleri ve önerileri çıkarsın.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
        <label style={{ fontSize: 10, fontFamily: "monospace", color: "#7a7a9a", letterSpacing: 1, whiteSpace: "nowrap" }}>KAYNAK</label>
        <select value={source} onChange={(e) => setSource(e.target.value)}
          style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "6px 10px", fontFamily: "inherit", cursor: "pointer" }}>
          <option>Claude</option>
          <option>ChatGPT</option>
          <option>Gemini</option>
          <option>Diğer</option>
        </select>
      </div>

      <textarea
        value={pasted}
        onChange={(e) => setPasted(e.target.value)}
        placeholder="AI çıktısını (kod, plan, açıklama) buraya yapıştır..."
        rows={8}
        style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 8, color: "#e8e8f0", fontSize: 12, fontFamily: "monospace", padding: "12px 14px", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 10 }}
      />

      <button onClick={analyze} disabled={loading || !pasted.trim()}
        style={{ width: "100%", background: loading ? "#2f3a5c" : "#6c63ff", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, padding: "11px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 14 }}>
        {loading ? "⏳ Analiz ediliyor..." : "🔍 Analiz Et"}
      </button>

      {err && (
        <div style={{ marginBottom: 12, background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ff6584", fontSize: 12 }}>
          {err}
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#6c63ff", letterSpacing: 1, marginBottom: 6 }}>ÖZET</div>
            <p style={{ fontSize: 12, color: "#d0d0e8", lineHeight: 1.7, margin: 0 }}>{result.ozet}</p>
          </div>

          <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#ff6584", letterSpacing: 1, marginBottom: 8 }}>EKSİKLER</div>
            {(result.eksikler || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
                <span style={{ color: "#ff6584", fontSize: 11, marginTop: 1 }}>✕</span>
                <span style={{ fontSize: 12, color: "#d0d0e8" }}>{m}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#f4c55a", letterSpacing: 1, marginBottom: 8 }}>RİSKLER</div>
            {(result.riskler || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
                <span style={{ color: "#f4c55a", fontSize: 11, marginTop: 1 }}>⚠</span>
                <span style={{ fontSize: 12, color: "#d0d0e8" }}>{m}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#161c32", border: "1px solid #28304a", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#43e97b", letterSpacing: 1, marginBottom: 8 }}>ÖNERİLER</div>
            {(result.oneriler || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
                <span style={{ color: "#43e97b", fontSize: 11, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 12, color: "#d0d0e8" }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Akıllı Şablon Motoru (Bölüm 22) ─────────────────────────────────────────
// Metindeki kategoriler: Bölüm 19 Analiz Motoru listesi + Bölüm 22 örnekleri
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

function SablonMotoruView({ appName }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [detay, setDetay]       = useState(null);
  const [err, setErr]           = useState("");

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

// ─── Ana Uygulama ─────────────────────────────────────────────────────────────
export default function App() {
  const [idea, setIdea]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [step, setStep]           = useState("");
  const [progress, setProgress]   = useState(0);
  const [activeTab, setActiveTab] = useState("bina");
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState("");
  const [copied, setCopied]       = useState("");
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
  };

  const exportDocs = () => {
    if (!result) return;
    const lines = [];
    lines.push(`# ${idea.trim() || "Proje"} — Mimari Dokümantasyonu`);
    lines.push(`\n_Oluşturulma: ${new Date().toLocaleDateString("tr-TR")}_`);
    lines.push(`\n## Master Prompt (Manifesto)\n\n${result.manifesto || ""}`);
    lines.push(`\n## Architecture Manifest\n\n${result.mimari || ""}`);
    lines.push(`\n## Feature Manifest`);
    (result.features || []).forEach((f) => lines.push(`- **${f.name}** — Öncelik: ${f.priority}, Risk: ${f.risk}${f.desc ? " — " + f.desc : ""}`));
    lines.push(`\n## Güvenlik Manifestosu`);
    (result.security || []).forEach((cat) => {
      lines.push(`\n### ${cat.category}`);
      (cat.items || []).forEach((s) => lines.push(`- **${s.title}**: ${s.desc}`));
    });
    lines.push(`\n## Test Planı`);
    (result.testPlan || []).forEach((t) => lines.push(`- **${t.tip}** — ${t.kapsam}: ${t.ornek}`));
    lines.push(`\n## Geliştirme Fazları`);
    DEV_PHASES.forEach((faz) => {
      lines.push(`\n### Faz ${faz.num}: ${faz.label} ${faz.icon}`);
      lines.push(faz.desc);
      faz.items.forEach((it) => lines.push(`- ${it}`));
      lines.push(`**Çıktı:** ${faz.cikti}`);
    });
    lines.push(`\n## Version Roadmap`);
    (result.roadmap || []).forEach((v) => lines.push(`- **${v.version}** — ${v.desc}`));
    lines.push(`\n## Klasör Yapısı\n\n\`\`\`\n${(result.folders || []).join("\n")}\n\`\`\``);
    lines.push(`\n## Proje Sağlık Skoru`);
    (result.health || []).forEach((h) => lines.push(`- ${h.label}: ${h.value}/100`));
    if (result.debt) lines.push(`\n### Teknik Borç Analizi\n\n${result.debt}`);
    lines.push(`\n## Bina İlerlemesi (P1–P20) — Detaylı Rehber`);
    PHASES.forEach((p, i) => {
      const num = i + 1;
      const st = num < currentPhase ? "✅ Tamamlandı" : num === currentPhase ? "🔨 Devam Ediyor" : "⬜ Bekliyor";
      lines.push(`\n### ${p.num} — ${p.name} (${p.bina}) ${st}`);
      lines.push(`**Teknik özet:** ${p.desc}`);
      if (p.basit) lines.push(`\n**🧒 Basitçe anlatırsak:** ${p.basit}`);
      lines.push(`\n**Görevler:**`);
      (p.gorevler || []).forEach((g) => lines.push(`- ${g}`));
      lines.push(`\n**Riskler:**`);
      (p.riskler || []).forEach((r) => lines.push(`- ⚠ ${r}`));
      if (p.rehber) lines.push(`\n**✏️ Şimdi sen dene:** ${p.rehber}`);
      if (p.teknolojiler) {
        lines.push(`\n**🧰 Kullanılacak araçlar:**`);
        p.teknolojiler.forEach((t) => lines.push(`- **${t.isim}** — Ne işe yarar? ${t.ne} | Neden kullanıyoruz? ${t.neden}`));
      }
    });
    lines.push(`\n## Proje Detayları`);
    lines.push(`- Beklenen kullanıcı sayısı: ${userScale}`);
    lines.push(`- Veritabanı ihtiyacı: ${dbNeed}`);
    lines.push(`- Bulut ihtiyacı: ${cloudNeed}`);
    lines.push(`\n## Builder Dosyaları`);
    lines.push(`Projeye özel üretilebilecek dosyalar: fix.py, builder.py, integrator.py, audit.py, generator.py, updater.py`);
    lines.push(`Kullanım: \`python fix.py\` — AI çıktısını projeye uygular`);

    const md = lines.join("\n");
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (idea.trim() || "proje").toLowerCase().replace(/[^a-z0-9ığüşöçİĞÜŞÖÇ\s-]/gi, "").trim().replace(/\s+/g, "-").slice(0, 40) || "proje";
    a.download = `${safeName}-dokumantasyon.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generate = () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    const app = idea.trim();
    const appLower = app.toLowerCase();
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
    }, 400);
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
          <div style={{ display: "inline-block", fontFamily: "monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#6c63ff", border: "1px solid #6c63ff", padding: "4px 12px", borderRadius: 2, marginBottom: 20, opacity: 0.8 }}>
            Master Prompt v4.0
          </div>
          <h1 style={{ fontSize: "clamp(26px,6vw,46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", margin: "0 0 12px", background: "linear-gradient(135deg,#fff 30%,#6c63ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Uygulama Mimar Stüdyosu
          </h1>
          <p style={{ color: "#7a7a9a", fontSize: 14, lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
            Fikrini yaz. Mimari, güvenlik, roadmap ve tüm plan otomatik üretilsin.
          </p>
          <div style={{ minHeight: 22, marginTop: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
            {restoring ? (
              <span style={{ fontSize: 11, color: "#4a4a6a", fontFamily: "monospace" }}>Kayıtlı proje kontrol ediliyor...</span>
            ) : (
              <>
                {savedFlash && (
                  <span style={{ fontSize: 11, color: "#43e97b", fontFamily: "monospace" }}>💾 Kaydedildi</span>
                )}
                {result && (
                  <>
                    <button onClick={exportDocs}
                      style={{ background: "rgba(108,99,255,0.15)", border: "1px solid #6c63ff", borderRadius: 6, color: "#6c63ff", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                      📥 Belgeyi İndir
                    </button>
                    <button onClick={resetProject}
                      style={{ background: "transparent", border: "1px solid #28304a", borderRadius: 6, color: "#7a7a9a", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                      🗑️ Yeni Proje
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
          <label style={{ display: "block", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#7a7a9a", marginBottom: 10 }}>Proje Fikrin</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && !loading && generate()}
            placeholder="Örnek: Borsa simülasyon uygulaması yapmak istiyorum..."
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
            <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#7a7a9a", marginBottom: 10 }}>Proje Türü</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Mobil", "Web", "Masaüstü", "Mobil + Web", "Mobil + Web + Desktop"].map((t) => (
                <button
                  key={t}
                  onClick={() => setProjectType(t)}
                  type="button"
                  style={{
                    background: projectType === t ? "rgba(108,99,255,0.18)" : "#161c32",
                    border: `1px solid ${projectType === t ? "#6c63ff" : "#28304a"}`,
                    borderRadius: 20, color: projectType === t ? "#6c63ff" : "#a0a0c8",
                    fontSize: 12, fontWeight: projectType === t ? 600 : 400,
                    padding: "6px 14px", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Proje Detayları — BÖLÜM 18: Fikir Analizi soruları */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #28304a" }}>
            <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#7a7a9a", marginBottom: 10 }}>Fikir Analizi (isteğe bağlı, sonuçları netleştirir)</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>Ücretli mi? Ücretsiz mi?</label>
                <select value={pricing} onChange={(e) => setPricing(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option>Ücretsiz</option>
                  <option>Ücretli</option>
                  <option>Abonelik</option>
                </select>
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>Veritabanı gerekli mi?</label>
                <select value={dbNeed} onChange={(e) => setDbNeed(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option>Hayır</option>
                  <option>Yerel</option>
                  <option>Bulut</option>
                </select>
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>Bulut gerekli mi?</label>
                <select value={cloudNeed} onChange={(e) => setCloudNeed(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option>Hayır</option>
                  <option>İsteğe bağlı</option>
                  <option>Evet</option>
                </select>
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>Kullanıcı sayısı</label>
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
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>Harita olacak mı?</label>
                <select value={hasMap} onChange={(e) => setHasMap(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option>Hayır</option>
                  <option>Evet</option>
                </select>
              </div>
              <div style={{ flex: "1 1 130px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>Bildirim olacak mı?</label>
                <select value={hasNotif} onChange={(e) => setHasNotif(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option>Hayır</option>
                  <option>Evet</option>
                </select>
              </div>
              <div style={{ flex: "1 1 130px" }}>
                <label style={{ display: "block", fontSize: 10, color: "#4a4a6a", marginBottom: 4 }}>Ödeme sistemi olacak mı?</label>
                <select value={hasPayment} onChange={(e) => setHasPayment(e.target.value)}
                  style={{ width: "100%", background: "#161c32", border: "1px solid #28304a", borderRadius: 6, color: "#fff", fontSize: 12, padding: "7px 8px", fontFamily: "inherit", cursor: "pointer" }}>
                  <option>Hayır</option>
                  <option>Evet</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={generate} disabled={loading || !idea.trim()}
            style={{ width: "100%", background: loading ? "#2f3a5c" : "#6c63ff", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, padding: "13px", cursor: loading ? "not-allowed" : "pointer", marginTop: 12, fontFamily: "inherit" }}>
            {loading ? `⏳ ${step}` : "⚡ Proje Mimarisini Oluştur  (Ctrl+Enter)"}
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
            {/* Tab bar */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{ flexShrink: 0, background: activeTab === t.id ? "#6c63ff" : "#101526", border: `1px solid ${activeTab === t.id ? "#6c63ff" : "#28304a"}`, borderRadius: 6, color: activeTab === t.id ? "#fff" : "#7a7a9a", fontSize: 12, fontWeight: 500, padding: "6px 13px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                  {t.label}
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
                <BuilderView appName={idea.trim()} features={result.features} folders={result.folders} />
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
                <FazlarView appName={idea.trim()} currentPhase={currentPhase} />
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

function Panel({ icon, bg, title, sub, children, onCopy, copied }) {
  return (
    <div style={{ background: "#101526", border: "1px solid #28304a", borderRadius: 12, padding: "20px 22px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #28304a" }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
          <div style={{ fontSize: 10, color: "#7a7a9a", fontFamily: "monospace", letterSpacing: 1 }}>{sub}</div>
        </div>
        {onCopy && (
          <button onClick={onCopy} style={{ background: "transparent", border: "1px solid #28304a", borderRadius: 6, color: "#7a7a9a", fontFamily: "monospace", fontSize: 10, padding: "4px 10px", cursor: "pointer" }}>
            {copied ? "✓ kopyalandı" : "kopyala"}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
