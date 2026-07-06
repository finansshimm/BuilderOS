import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Android WebView does not support downloading blob: URLs via <a download> —
// the click silently does nothing. On native platforms we write the file to
// the app cache and hand it to the OS share sheet so the user can save it.
export async function downloadBlob(filename, blob) {
  if (Capacitor.isNativePlatform()) {
    const base64 = await blobToBase64(blob);
    const { uri } = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Cache,
    });
    await Share.share({ url: uri, title: filename });
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadText(filename, content, mime = "text/plain;charset=utf-8") {
  return downloadBlob(filename, new Blob([content], { type: mime }));
}
