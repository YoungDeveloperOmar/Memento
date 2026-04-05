// ─────────────────────────────────────────────────────────────
//  shared/widgets/large_button.dart — Large Accessible Button
//
//  Fixes applied to the user's uploaded version:
//    • Added proper LargeButtonStyle enum (was untyped, crashed)
//    • Made backgroundColor optional (defaults to AppColors.primary)
//    • style is now an optional named param (default = primary)
//    • Secondary style shows a coloured border + tinted background
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

enum LargeButtonStyle { primary, secondary }

class LargeButton extends StatelessWidget {
  const LargeButton({
    super.key,
    required this.label,
    required this.icon,
    required this.onPressed,
    this.backgroundColor,
    this.foregroundColor,
    this.style = LargeButtonStyle.primary,
  });

  final String label;
  final IconData icon;
  final VoidCallback onPressed;

  /// Fill colour for primary; border/text colour for secondary.
  /// Defaults to AppColors.primary when not provided.
  final Color? backgroundColor;

  /// Override the icon + text colour (e.g. for error/emergency styling).
  final Color? foregroundColor;

  final LargeButtonStyle style;

  @override
  Widget build(BuildContext context) {
    final resolvedColor = backgroundColor ?? AppColors.primary;

    if (style == LargeButtonStyle.secondary) {
      final fg = foregroundColor ?? resolvedColor;
      return Container(
        height: 70,
        decoration: BoxDecoration(
          color: resolvedColor.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: resolvedColor, width: 2),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(22),
            onTap: onPressed,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Icon(icon, size: 30, color: fg),
                  const SizedBox(width: 18),
                  Expanded(
                    child: Text(
                      label,
                      style: AppTextStyles.headlineSmall.copyWith(color: fg),
                    ),
                  ),
                  Icon(Icons.arrow_forward_ios, size: 18, color: fg),
                ],
              ),
            ),
          ),
        ),
      );
    }

    // Primary (filled) variant
    final fg = foregroundColor ?? Colors.white;
    return Container(
      height: 70,
      decoration: BoxDecoration(
        color: resolvedColor,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: resolvedColor.withValues(alpha: 0.25),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: onPressed,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Icon(icon, size: 30, color: fg),
                const SizedBox(width: 18),
                Expanded(
                  child: Text(
                    label,
                    style: AppTextStyles.headlineSmall.copyWith(color: fg),
                  ),
                ),
                Icon(Icons.arrow_forward_ios, size: 18, color: fg),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
