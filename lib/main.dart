// ─────────────────────────────────────────────────────────────
//  main.dart — Memento App Entry Point
//
//  This is the root of the application. It simply calls
//  runApp() with the top-level App widget defined in app.dart.
//  Keep this file minimal — all configuration lives in app.dart.
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app.dart';

void main() {
  // Ensure Flutter bindings are initialized before any plugin calls.
  WidgetsFlutterBinding.ensureInitialized();

  // Lock orientation to portrait for dementia accessibility —
  // landscape layouts can be disorienting.
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Make the status bar transparent so our warm background shows through.
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(const MementoApp());
}
