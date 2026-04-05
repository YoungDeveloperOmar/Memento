// ─────────────────────────────────────────────────────────────
//  shared/widgets/feature_card.dart — Feature Card Widget
//
//  A large, tappable card used on the Home screen to showcase
//  each major feature. Designed for dementia accessibility:
//    • Large icon (visual anchor — patients recognise icons
//      even when text processing is impaired)
//    • Short label below the icon
//    • Soft colour per feature for visual differentiation
//    • Rounded corners and generous padding
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import 'package:memento/core/theme/app_colors.dart';
import 'package:memento/core/theme/app_text_styles.dart';
import 'package:memento/core/constants/app_constants.dart';

class FeatureCard extends StatelessWidget {
  const FeatureCard({
    super.key,
    required this.label,
    required this.icon,
    required this.color,
    required this.backgroundColor,
    required this.onTap,
    this.badge,
  });

  final String label;
  final IconData icon;
  final Color color;
  final Color backgroundColor;
  final VoidCallback onTap;
  final int? badge;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: AppConstants.animFast,
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(28),

          // softer border instead of heavy shadow
          border: Border.all(
            color: color.withValues(alpha: 0.15),
            width: 1,
          ),
        ),
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    icon,
                    size: AppConstants.iconXL,
                    color: color,
                  ),
                ),
                if (badge != null && badge! > 0)
                  Positioned(
                    top: -4,
                    right: -4,
                    child: Container(
                      width: 24,
                      height: 24,
                      decoration: const BoxDecoration(
                        color: AppColors.error,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          badge! > 9 ? '9+' : '$badge',
                          style: const TextStyle(
                            color: AppColors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),

            const SizedBox(height: AppConstants.spaceM),

            Text(
              label,
              style: AppTextStyles.headlineSmall.copyWith(color: color),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

class FeatureListTile extends StatelessWidget {
  const FeatureListTile({
    super.key,
    required this.label,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.backgroundColor,
    required this.onTap,
    this.trailing,
  });

  final String label;
  final String subtitle;
  final IconData icon;
  final Color color;
  final Color backgroundColor;
  final VoidCallback onTap;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(AppConstants.radiusL),
          border: Border.all(
            color: color.withValues(alpha: 0.15),
          ),
        ),
        padding: const EdgeInsets.all(AppConstants.cardPadding),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(AppConstants.radiusM),
              ),
              child: Icon(icon, size: AppConstants.iconL, color: color),
            ),
            const SizedBox(width: AppConstants.spaceM),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: AppTextStyles.headlineSmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: AppTextStyles.bodySmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),

            trailing ??
                Icon(
                  Icons.chevron_right_rounded,
                  color: color,
                  size: AppConstants.iconM,
                ),
          ],
        ),
      ),
    );
  }
}