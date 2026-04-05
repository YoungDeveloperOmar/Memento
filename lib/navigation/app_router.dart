// ─────────────────────────────────────────────────────────────
//  navigation/app_router.dart — MainShell + Route Generator
//
//  Bottom nav tab map:
//    0 → Home
//    1 → My Medicine (Reminders)
//    2 → My Memory  (Memory/People)
//    3 → Ask Memo   (Chatbot)
//    4 → Caregiver
//
//  Named routes (pushed on top of the shell):
//    /location → LocationScreen
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../features/screens/home/home_screen.dart';
import '../features/screens/reminders/reminders_screen.dart';
import '../features/screens/memory/memory_screen.dart';
import '../features/screens/chatbot/chatbot_screen.dart';
import '../features/screens/caregiver/caregiver_screen.dart';
import '../features/screens/location/location_screen.dart';
import 'bottom_nav_bar.dart';

// ── Named route generator ─────────────────────────────────────
Route<dynamic> generateRoute(RouteSettings settings) {
  switch (settings.name) {
    case '/location':
      return MaterialPageRoute(
        builder: (_) => const LocationScreen(),
        settings: settings,
      );
    default:
      return MaterialPageRoute(
        builder: (_) => const Scaffold(body: Center(child: Text('Page not found'))),
      );
  }
}

// ── MainShell ─────────────────────────────────────────────────
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  void _onNavTap(int index) => setState(() => _currentIndex = index);

  // IndexedStack keeps screens alive so scroll position is preserved.
  late final List<Widget> _screens = [
    HomeScreen(onNavigate: _onNavTap),  // 0 — Home
    const RemindersScreen(),             // 1 — My Medicine
    const MemoryScreen(),                // 2 — My Memory
    const ChatbotScreen(),               // 3 — Ask Memo
    const CaregiverScreen(),             // 4 — Caregiver
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: MementoBottomNavBar(
        currentIndex: _currentIndex,
        onTap: _onNavTap,
      ),
    );
  }
}
