import { useState, useEffect } from "react";
import { storage } from "../lib/storage";
import { STATUSES, STATUS_COLORS } from "../data/constants";

export default function TaskBoardView({ features }) {
  const [statuses, setStatuses] = useState(() => (features || []).map(() => "Bekliyor"));
  const [loaded, setLoaded]     = useState(false);

  // Özellikler değiştiğinde (yeni proje) varsayılana dön, kayıtlı durum varsa onu kullan
  useEffect(() => {
    let current = true;
    (async () => {
      setLoaded(false);
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

