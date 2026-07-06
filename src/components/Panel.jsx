export default function Panel({ icon, bg, title, sub, children, onCopy, copied }) {
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
