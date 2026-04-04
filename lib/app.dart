// ─────────────────────────────────────────────────────────────
//  app.dart — Root App Widget
//
//  Configures the MaterialApp with:
//    • Memento's calm, accessible theme
//    • The bottom-navigation shell (MainShell)
//  All routing lives in navigation/app_router.dart.
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import 'core/theme/app_theme.dart';
import 'navigation/app_router.dart';

class MementoApp extends StatelessWidget {
  const MementoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Memento',
      debugShowCheckedModeBanner: false,

      // ── Theming ──────────────────────────────────────────────
      theme: AppTheme.lightTheme,
      // darkTheme: AppTheme.darkTheme,   // TODO: add dark theme later
      themeMode: ThemeMode.light,

      // ── Navigation ───────────────────────────────────────────
      // The main shell contains the BottomNavigationBar + all screens.
      home: const MainShell(),
    );
  }
}
