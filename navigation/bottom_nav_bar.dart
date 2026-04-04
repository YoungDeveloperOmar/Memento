// ─────────────────────────────────────────────────────────────
//  navigation/bottom_nav_bar.dart — Memento Bottom Nav Bar
//
//  A custom-styled BottomNavigationBar with 6 items.
//  Design principles:
//    • Large icons (30pt selected, 26pt unselected)
//    • Always shows labels — dementia patients need text anchors
//    • Warm surface background with subtle top shadow
//    • Active tab highlighted with primary colour tint
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_text_styles.dart';
import '../core/constants/app_strings.dart';

/// Definition of a single navigation destination.
class NavDestination {
  const NavDestination({
    required this.label,
    required this.icon,
    required this.activeIcon,
  });

  final String label;
  final IconData icon;
  final IconData activeIcon;
}

/// All navigation destinations in order.
/// Index must match the screen list in MainShell.
const List<NavDestination> navDestinations = [
  NavDestination(
    label: AppStrings.navHome,
    icon: Icons.home_outlined,
    activeIcon: Icons.home_rounded,
  ),
  NavDestination(
    label: AppStrings.navReminders,
    icon: Icons.medication_outlined,
    activeIcon: Icons.medication_rounded,
  ),
  NavDestination(
    label: AppStrings.navLocation,
    icon: Icons.location_on_outlined,
    activeIcon: Icons.location_on_rounded,
  ),
  NavDestination(
    label: AppStrings.navMemory,
    icon: Icons.favorite_outline_rounded,
    activeIcon: Icons.favorite_rounded,
  ),
  NavDestination(
    label: AppStrings.navChatbot,
    icon: Icons.chat_bubble_outline_rounded,
    activeIcon: Icons.chat_bubble_rounded,
  ),
  NavDestination(
    label: AppStrings.navCaregiver,
    icon: Icons.supervisor_account_outlined,
    activeIcon: Icons.supervisor_account_rounded,
  ),
];

class MementoBottomNavBar extends StatelessWidget {
  const MementoBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow,
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 72,
          child: Row(
            children: List.generate(
              navDestinations.length,
              (index) => Expanded(
                child: _NavItem(
                  destination: navDestinations[index],
                  isSelected: currentIndex == index,
                  onTap: () => onTap(index),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _NavItem — a single navigation tab.
// ─────────────────────────────────────────────────────────────
class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.destination,
    required this.isSelected,
    required this.onTap,
  });

  final NavDestination destination;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? AppColors.primary : AppColors.textHint;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withOpacity(0.07)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: Icon(
                isSelected
                    ? destination.activeIcon
                    : destination.icon,
                key: ValueKey(isSelected),
                color: color,
                size: isSelected ? 30 : 26,
              ),
            ),
            const SizedBox(height: 3),
            Text(
              destination.label,
              style: AppTextStyles.navLabel.copyWith(color: color),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
