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

import '../features/home/screens/home_screen.dart';
import '../features/reminders/screens/reminders_screen.dart';
import '../features/location/screens/location_screen.dart';
import '../features/memory/screens/memory_screen.dart';
import '../features/chatbot/screens/chatbot_screen.dart';
import '../features/caregiver/screens/caregiver_screen.dart';
import 'bottom_nav_bar.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  void _onNavTap(int index) {
    setState(() => _currentIndex = index);
  }

  // ── Screen list ───────────────────────────────────────────
  // Built lazily — each screen is only constructed once and
  // kept alive by the IndexedStack.
  late final List<Widget> _screens = [
    HomeScreen(onNavigate: _onNavTap), // index 0
    const RemindersScreen(),           // index 1
    const LocationScreen(),            // index 2
    const MemoryScreen(),              // index 3
    const ChatbotScreen(),             // index 4
    const CaregiverScreen(),           // index 5
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // ── Body ───────────────────────────────────────────────
      // IndexedStack renders all screens but only shows the
      // active one — avoids rebuild/state-loss on tab switch.
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),

      // ── Bottom Navigation ──────────────────────────────────
      bottomNavigationBar: MementoBottomNavBar(
        currentIndex: _currentIndex,
        onTap: _onNavTap,
      ),
    );
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
