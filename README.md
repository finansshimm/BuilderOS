# BuilderOS

Turn ideas into real applications. BuilderOS — The operating system for building applications from idea to launch.

Offline React app that walks a project through 20 development phases (P1–P20), with built-in tools: template/builder file generator, zombie-bug analyzer, task board, security checklist, roadmap, and an audit system.

## Stack

- React 19 + Vite
- Data persisted locally via `localStorage` (fully offline, no backend)
- Packaged as an Android app with [Capacitor](https://capacitorjs.com/)

## Development

```bash
npm install
npm run dev
```

## Build web app

```bash
npm run build
```

## Build Android APK

```bash
npx cap sync android
cd android
./gradlew assembleDebug
```

The debug APK is produced at `android/app/build/outputs/apk/debug/app-debug.apk`.
