// ─────────────────────────────────────────────────────────────
//  navigation/bottom_nav_bar.dart — 5-Tab Bottom Navigation Bar
//
//  Tabs:  Home | My Medicine | My Memory | Ask Memo | Caregiver
//  Large icons + always-visible labels for dementia accessibility.
//  Warm surface background matching the website design.
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_text_styles.dart';

class _NavItem {
  const _NavItem({required this.label, required this.icon, required this.activeIcon});
  final String label;
  final IconData icon;
  final IconData activeIcon;
}

const _items = [
  _NavItem(label: 'Home',      icon: Icons.home_outlined,               activeIcon: Icons.home_rounded),
  _NavItem(label: 'Medicine',  icon: Icons.medication_outlined,         activeIcon: Icons.medication_rounded),
  _NavItem(label: 'Memory',    icon: Icons.favorite_border_rounded,     activeIcon: Icons.favorite_rounded),
  _NavItem(label: 'Ask Memo',  icon: Icons.chat_bubble_outline_rounded, activeIcon: Icons.chat_bubble_rounded),
  _NavItem(label: 'Caregiver', icon: Icons.supervisor_account_outlined, activeIcon: Icons.supervisor_account_rounded),
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
        border: Border(top: BorderSide(color: AppColors.divider, width: 1)),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow,
            blurRadius: 16,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 70,
          child: Row(
            children: List.generate(
              _items.length,
              (i) => Expanded(child: _Tab(item: _items[i], isSelected: currentIndex == i, onTap: () => onTap(i))),
            ),
          ),
        ),
      ),
    );
  }
}

class _Tab extends StatelessWidget {
  const _Tab({required this.item, required this.isSelected, required this.onTap});

  final _NavItem item;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? AppColors.primary : AppColors.textHint;
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.06) : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 180),
              child: Icon(
                isSelected ? item.activeIcon : item.icon,
                key: ValueKey(isSelected),
                color: color,
                size: isSelected ? 30 : 26,
              ),
            ),
            const SizedBox(height: 3),
            Text(item.label, style: AppTextStyles.navLabel.copyWith(color: color)),
          ],
        ),
      ),
    );
  }
}
