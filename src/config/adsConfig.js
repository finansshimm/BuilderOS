// Google'ın resmi TEST reklam ID'leri — her zaman test reklamı gösterir,
// gerçek para kazandırmaz, hesabını askıya aldırmadan geliştirme/test için güvenlidir.
// https://developers.google.com/admob/android/test-ads
//
// Gerçek AdMob ID'lerini aldığında SADECE bu dosyadaki değerleri değiştir —
// başka hiçbir yeri değiştirmene gerek yok.

export const ADMOB_APP_ID = "ca-app-pub-3940256099942544~3347511713";

export const AD_UNIT_IDS = {
  banner: "ca-app-pub-3940256099942544/6300978111",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
};

// Gerçek ID'lerini eklediğinde bunu false yap.
export const USING_TEST_ADS = true;
