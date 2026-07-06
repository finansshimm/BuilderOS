import { Capacitor } from "@capacitor/core";
import { AD_UNIT_IDS } from "../config/adsConfig";

let initialized = false;
let interstitialReady = false;

// Reklamlar sadece native (Android/iOS) ortamda çalışır — web build'de
// AdMob eklentisi yok, bu yüzden tüm fonksiyonlar sessizce hiçbir şey yapmaz.
function isNative() {
  return Capacitor.isNativePlatform();
}

export async function initAds() {
  if (!isNative() || initialized) return;
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.initialize({ initializeForTesting: true });
    initialized = true;
    await showBanner();
    await prepareInterstitial();
  } catch (_) {
    // reklam başlatılamazsa uygulama çalışmaya devam etsin
  }
}

export async function showBanner() {
  if (!isNative()) return;
  try {
    const { AdMob, BannerAdSize, BannerAdPosition } = await import("@capacitor-community/admob");
    await AdMob.showBanner({
      adId: AD_UNIT_IDS.banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
    });
  } catch (_) {}
}

export async function prepareInterstitial() {
  if (!isNative()) return;
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.prepareInterstitial({ adId: AD_UNIT_IDS.interstitial });
    interstitialReady = true;
  } catch (_) {
    interstitialReady = false;
  }
}

// Proje üretimi tamamlandığında bir kez çağrılır. Reklam hazır değilse
// sessizce atlar; bir sonraki üretim için arka planda yeniden hazırlar.
export async function showInterstitialOnce() {
  if (!isNative() || !interstitialReady) return;
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    interstitialReady = false;
    await AdMob.showInterstitial();
  } catch (_) {
  } finally {
    prepareInterstitial();
  }
}
