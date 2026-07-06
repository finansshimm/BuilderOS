import JSZip from "jszip";

function toPackageName(appName) {
  const cleaned = (appName || "yeni_uygulama")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/^[0-9]+/, "");
  return cleaned || "yeni_uygulama";
}

function dependenciesFor(tech) {
  const deps = {};
  const veritabani = tech?.Veritabani || "";
  if (/sqlite/i.test(veritabani)) deps.sqflite = "^2.3.0";
  if (/hive/i.test(veritabani)) { deps.hive = "^2.2.3"; deps.hive_flutter = "^1.1.0"; }
  if (/postgres|supabase/i.test(veritabani)) deps.supabase_flutter = "^2.0.0";
  if (/shared/i.test(veritabani)) deps.shared_preferences = "^2.2.2";
  if (tech?.Bulut && !/gerekli değil/i.test(tech.Bulut)) deps.firebase_core = "^2.24.0";
  if (tech?.Odeme && !/gerekli değil/i.test(tech.Odeme)) deps.http = "^1.1.0";
  if (tech?.Harita && !/gerekli değil/i.test(tech.Harita)) deps.google_maps_flutter = "^2.5.0";
  if (tech?.OyunMotoru && !/gerekli değil/i.test(tech.OyunMotoru)) deps.flame = "^1.13.0";
  return deps;
}

function pubspecYaml(appName, tech) {
  const pkg = toPackageName(appName);
  const deps = dependenciesFor(tech);
  const depLines = Object.entries(deps).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return `name: ${pkg}
description: "${appName} — BuilderOS tarafından üretilen proje iskeleti"
publish_to: "none"
version: 0.1.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
${depLines}

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;
}

function mainDart(appName, features) {
  const featureList = (features || []).map(f => f.name);
  const tiles = featureList.map(name => `              _FeatureTile(title: "${name}"),`).join("\n");
  return `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${appName}',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF6C63FF)),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${appName}')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
${tiles || '              _FeatureTile(title: "İlk özelliğini burada listele"),'}
        ],
      ),
    );
  }
}

class _FeatureTile extends StatelessWidget {
  final String title;
  const _FeatureTile({required this.title});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: const Icon(Icons.check_circle_outline),
        title: Text(title),
      ),
    );
  }
}
`;
}

function readmeMd(appName, features, folders) {
  const featureList = (features || []).map(f => `- ${f.name} (${f.priority})`).join("\n") || "- (özellik listesi yok)";
  const folderList = (folders || []).map(f => `- \`${f}\``).join("\n") || "- (klasör listesi yok)";
  return `# ${appName}

BuilderOS ile planlanan bu projenin başlangıç iskeleti.

## Özellikler
${featureList}

## Klasör Yapısı
${folderList}

## Başlarken
\`\`\`bash
flutter pub get
flutter run
\`\`\`
`;
}

const GITIGNORE = `.dart_tool/
.packages
build/
.flutter-plugins
.flutter-plugins-dependencies
*.iml
.idea/
`;

export async function buildScaffoldZip({ appName, features, folders, tech }) {
  const zip = new JSZip();
  const name = appName || "Yeni Uygulama";

  zip.file("pubspec.yaml", pubspecYaml(name, tech));
  zip.file("README.md", readmeMd(name, features, folders));
  zip.file(".gitignore", GITIGNORE);
  zip.file("lib/main.dart", mainDart(name, features));

  for (const folder of folders || []) {
    zip.file(`lib/${folder.replace(/\/$/, "")}/.gitkeep`, "");
  }
  zip.file("test/.gitkeep", "");

  return zip.generateAsync({ type: "blob" });
}

export function scaffoldFileName(appName) {
  const pkg = toPackageName(appName);
  return `${pkg}-proje-iskeleti.zip`;
}
