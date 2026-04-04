// ─────────────────────────────────────────────────────────────
//  shared/widgets/large_button.dart — Accessible Large Button
//
//  A high-contrast, large-touch-target button designed for
//  dementia accessibility. Supports:
//    • Primary style (solid fill)
//    • Secondary style (outline)
//    • Icon + label layout
//    • Loading state
//    • Custom colors for feature-specific variants
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/constants/app_constants.dart';

enum LargeButtonStyle { primary, secondary, ghost }

class LargeButton extends StatelessWidget {
  const LargeButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.style = LargeButtonStyle.primary,
    this.backgroundColor,
    this.foregroundColor,
    this.isLoading = false,
    this.minHeight = AppConstants.minTouchTarget,
  });

  /// The text displayed on the button. Keep it SHORT — 1–3 words.
  final String label;

  /// Callback. Pass null to disable the button.
  final VoidCallback? onPressed;

  /// Optional leading icon.
  final IconData? icon;

  final LargeButtonStyle style;

  /// Override the background colour (e.g., for feature-specific buttons).
  final Color? backgroundColor;

  /// Override the label/icon colour.
  final Color? foregroundColor;

  /// Shows a spinner and disables tap when true.
  final bool isLoading;

  /// Minimum height — defaults to 64pt (exceeds WCAG 2.5.5 44pt).
  final double minHeight;

  @override
  Widget build(BuildContext context) {
    final bool isDisabled = onPressed == null || isLoading;

    switch (style) {
      case LargeButtonStyle.primary:
        return _PrimaryButton(
          label: label,
          onPressed: isDisabled ? null : onPressed,
          icon: icon,
          isLoading: isLoading,
          backgroundColor: backgroundColor ?? AppColors.primary,
          foregroundColor: foregroundColor ?? AppColors.white,
          minHeight: minHeight,
        );
      case LargeButtonStyle.secondary:
        return _SecondaryButton(
          label: label,
          onPressed: isDisabled ? null : onPressed,
          icon: icon,
          isLoading: isLoading,
          color: backgroundColor ?? AppColors.primary,
          minHeight: minHeight,
        );
      case LargeButtonStyle.ghost:
        return _GhostButton(
          label: label,
          onPressed: isDisabled ? null : onPressed,
          icon: icon,
          color: backgroundColor ?? AppColors.primary,
          minHeight: minHeight,
        );
    }
  }
}

// ── Primary (filled) ─────────────────────────────────────────
class _PrimaryButton extends StatelessWidget {
  const _PrimaryButton({
    required this.label,
    required this.onPressed,
    required this.isLoading,
    required this.backgroundColor,
    required this.foregroundColor,
    required this.minHeight,
    this.icon,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final Color backgroundColor;
  final Color foregroundColor;
  final double minHeight;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: minHeight,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: foregroundColor,
          disabledBackgroundColor: AppColors.divider,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.radiusL),
          ),
          elevation: 2,
          shadowColor: AppColors.shadow,
        ),
        child: isLoading
            ? SizedBox(
                height: 24,
                width: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  color: foregroundColor,
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: AppConstants.iconM, color: foregroundColor),
                    const SizedBox(width: AppConstants.spaceM),
                  ],
                  Text(
                    label,
                    style: AppTextStyles.buttonPrimary.copyWith(
                      color: foregroundColor,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

// ── Secondary (outline) ───────────────────────────────────────
class _SecondaryButton extends StatelessWidget {
  const _SecondaryButton({
    required this.label,
    required this.onPressed,
    required this.isLoading,
    required this.color,
    required this.minHeight,
    this.icon,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final Color color;
  final double minHeight;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: minHeight,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: color,
          side: BorderSide(color: color, width: 2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.radiusL),
          ),
        ),
        child: isLoading
            ? SizedBox(
                height: 24,
                width: 24,
                child: CircularProgressIndicator(strokeWidth: 2.5, color: color),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: AppConstants.iconM, color: color),
                    const SizedBox(width: AppConstants.spaceM),
                  ],
                  Text(
                    label,
                    style: AppTextStyles.buttonPrimary.copyWith(color: color),
                  ),
                ],
              ),
      ),
    );
  }
}

// ── Ghost (text only) ─────────────────────────────────────────
class _GhostButton extends StatelessWidget {
  const _GhostButton({
    required this.label,
    required this.onPressed,
    required this.color,
    required this.minHeight,
    this.icon,
  });

  final String label;
  final VoidCallback? onPressed;
  final Color color;
  final double minHeight;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: minHeight,
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          foregroundColor: color,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.radiusL),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              Icon(icon, size: AppConstants.iconM, color: color),
              const SizedBox(width: AppConstants.spaceS),
            ],
            Text(
              label,
              style: AppTextStyles.buttonPrimary.copyWith(color: color),
            ),
          ],
        ),
      ),
    );
  }
}
