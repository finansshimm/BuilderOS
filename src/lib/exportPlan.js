export function buildPlanMarkdown(appName, result) {
  const {
    manifesto, mimari, tech, features, security,
    roadmap, folders, refactor, testPlan, health, debt,
  } = result;

  const lines = [];
  lines.push(`# ${appName} — Mimari Plan`);
  lines.push("");
  lines.push(`_BuilderOS tarafından üretildi — ${new Date().toLocaleDateString("tr-TR")}_`);
  lines.push("");

  lines.push("## Manifesto");
  lines.push(manifesto || "-");
  lines.push("");

  lines.push("## Mimari");
  lines.push(mimari || "-");
  lines.push("");

  if (tech) {
    lines.push("## Teknoloji Önerisi");
    for (const [key, value] of Object.entries(tech)) {
      lines.push(`- **${key}**: ${value}`);
    }
    lines.push("");
  }

  if (features?.length) {
    lines.push("## Özellikler");
    for (const f of features) {
      lines.push(`- **${f.name}** (Öncelik: ${f.priority}, Risk: ${f.risk}) — ${f.desc || ""}`);
    }
    lines.push("");
  }

  if (security?.length) {
    lines.push("## Güvenlik");
    for (const cat of security) {
      lines.push(`### ${cat.category}`);
      for (const item of cat.items || []) {
        lines.push(`- **${item.title}**: ${item.desc}`);
      }
    }
    lines.push("");
  }

  if (roadmap?.length) {
    lines.push("## Roadmap");
    for (const r of roadmap) {
      lines.push(`- **${r.version}** — ${r.desc}`);
    }
    lines.push("");
  }

  if (folders?.length) {
    lines.push("## Klasör Yapısı");
    lines.push("```");
    for (const f of folders) lines.push(f);
    lines.push("```");
    lines.push("");
  }

  if (testPlan?.length) {
    lines.push("## Test Planı");
    for (const t of testPlan) {
      lines.push(`- **${t.tip}** (${t.kapsam}) — ${t.ornek}`);
    }
    lines.push("");
  }

  if (refactor?.length) {
    lines.push("## Refactor Planı");
    for (const r of refactor) {
      lines.push(`- **${r.madde}**: ${r.aciklama}`);
    }
    lines.push("");
  }

  if (health?.length) {
    lines.push("## Sağlık Skoru");
    for (const h of health) {
      lines.push(`- ${h.label}: **${h.value}/100**`);
    }
    lines.push("");
  }

  if (debt) {
    lines.push("## Teknik Borç Notu");
    lines.push(debt);
    lines.push("");
  }

  return lines.join("\n");
}
