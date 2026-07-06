// Claude artifact sandbox'ında native window.storage kullanılır;
// gerçek tarayıcı/APK'da (WebView) localStorage'a düşer.
export const storage = (typeof window !== "undefined" && window.storage) || {
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
