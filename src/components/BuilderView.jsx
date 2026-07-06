import { useState } from "react";
import { downloadBlob } from "../lib/download";
import { buildScaffoldZip, scaffoldFileName } from "../lib/scaffold";

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

export default function BuilderView({ appName, features, folders, tech }) {
  const [selectedType, setSelectedType] = useState(BUILDER_TYPES[0]);
  const [scaffolding, setScaffolding] = useState(false);
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

  const downloadScaffold = async () => {
    if (!appName || scaffolding) return;
    setScaffolding(true);
    try {
      const blob = await buildScaffoldZip({ appName, features, folders, tech });
      downloadBlob(scaffoldFileName(appName), blob);
    } finally {
      setScaffolding(false);
    }
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

      {/* Gerçek proje iskeleti indirme */}
      <div style={{ background: "rgba(67,233,123,0.06)", border: "1px solid rgba(67,233,123,0.25)", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#43e97b", marginBottom: 2 }}>📦 Gerçek Proje İskeleti</div>
          <div style={{ fontSize: 11, color: "#7a7a9a", lineHeight: 1.5 }}>
            Seçtiğin teknoloji ve özelliklere göre çalıştırılabilir bir Flutter proje iskeleti (pubspec.yaml, lib/main.dart, klasörler) üretir ve zip olarak indirir.
          </div>
        </div>
        <button
          onClick={downloadScaffold}
          disabled={!appName || scaffolding}
          style={{ flexShrink: 0, background: scaffolding ? "#2f3a5c" : "#43e97b", color: "#0a0e1f", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, padding: "9px 16px", cursor: !appName || scaffolding ? "not-allowed" : "pointer", fontFamily: "inherit" }}
        >
          {scaffolding ? "⏳ Hazırlanıyor..." : "⬇ İskeleti İndir (.zip)"}
        </button>
      </div>

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

