// ─────────────────────────────────────────────────────────────
//  app.dart — Root App Widget
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
      theme: AppTheme.lightTheme,
      themeMode: ThemeMode.light,
      home: const MainShell(),
      // Named routes pushed on top of the shell (no bottom nav)
      onGenerateRoute: generateRoute,
    );
  }
}
