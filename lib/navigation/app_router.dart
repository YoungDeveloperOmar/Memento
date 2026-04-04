// ─────────────────────────────────────────────────────────────
//  navigation/app_router.dart — MainShell (Navigation Host)
//
//  MainShell is the root widget shown after app launch.
//  It owns the BottomNavigationBar state and renders
//  the correct feature screen based on the selected tab.
//
//  Architecture notes:
//    • IndexedStack keeps all screens alive (preserves scroll
//      position etc.) — appropriate for this simple shell.
//    • In Phase 2, swap this for go_router + ShellRoute for
//      deep-linking, push notification navigation, and auth guards.
//
//  Screen index map:
//    0 → Home
//    1 → Reminders
//    2 → Location
//    3 → Memory
//    4 → Chatbot
//    5 → Caregiver Dashboard
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';
import 'package:memento/features/screens/home/home_screen.dart';

class MainShell extends StatelessWidget {
  const MainShell({super.key});

  @override
  Widget build(BuildContext context) {
    return const HomeScreen();
  }
}
// ─────────────────────────────────────────────────────────────
//  Future: go_router integration
//
//  When you add deep linking, replace MainShell with a GoRouter
//  ShellRoute. Example skeleton:
//
//  final router = GoRouter(
//    routes: [
//      ShellRoute(
//        builder: (context, state, child) => MainShell(child: child),
//        routes: [
//          GoRoute(path: '/', builder: (_, __) => const HomeScreen(...)),
//          GoRoute(path: '/reminders', builder: (_, __) => const RemindersScreen()),
//          GoRoute(path: '/location', builder: (_, __) => const LocationScreen()),
//          GoRoute(path: '/memory', builder: (_, __) => const MemoryScreen()),
//          GoRoute(path: '/chatbot', builder: (_, __) => const ChatbotScreen()),
//          GoRoute(path: '/caregiver', builder: (_, __) => const CaregiverScreen()),
//        ],
//      ),
//    ],
//  );
// ─────────────────────────────────────────────────────────────
