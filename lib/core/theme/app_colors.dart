// ─────────────────────────────────────────────────────────────
//  core/theme/app_colors.dart — Memento Color Palette
//
//  Design philosophy: "A warm, safe sanctuary."
//  Colors are soft and calming — never clinical or harsh.
//  High contrast is maintained for accessibility (WCAG AA).
//
//  Palette:
//    Sage Green  — primary, trustworthy, calming
//    Warm Cream  — background, feels like home
//    Amber       — accent, warm and gentle alerts
//    Deep Slate  — text, high contrast on light backgrounds
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

abstract class AppColors {
  // ── Primary — Sage Green ────────────────────────────────────
  static const Color primary = Color(0xFF5B8C7E);
  static const Color primaryLight = Color(0xFF7EB5A6);
  static const Color primaryDark = Color(0xFF3D6B5E);
  static const Color primarySurface = Color(0xFFE8F4F1); // very light tint

  // ── Secondary — Warm Amber ──────────────────────────────────
  static const Color secondary = Color(0xFFD4845A);
  static const Color secondaryLight = Color(0xFFE8A882);
  static const Color secondarySurface = Color(0xFFFAEDE5);

  // ── Background & Surface ────────────────────────────────────
  static const Color background = Color(0xFFF7F3EE); // warm cream
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF0EBE3);

  // ── Text ────────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFF2C3E35);   // deep sage-slate
  static const Color textSecondary = Color(0xFF5C6E65); // muted
  static const Color textHint = Color(0xFF9AADA5);

  // ── Semantic / Feature Colors ────────────────────────────────
  // Each feature has a distinct, recognizable color for dementia-friendly
  // visual anchoring — patients can learn "blue = location."
  static const Color featureReminders = Color(0xFF7B9ECC); // calm blue
  static const Color featureLocation = Color(0xFF7DC4A0);  // mint green
  static const Color featureMemory = Color(0xFFBF8DC0);    // soft lilac
  static const Color featureChatbot = Color(0xFFD4A35A);   // warm gold
  static const Color featureCaregiver = Color(0xFFD47A7A); // soft rose

  // Lighter tints for card backgrounds
  static const Color featureRemindersSurface = Color(0xFFEBF2FA);
  static const Color featureLocationSurface = Color(0xFFE5F5ED);
  static const Color featureMemorySurface = Color(0xFFF4EBF5);
  static const Color featureChatbotSurface = Color(0xFFFAF2E5);
  static const Color featureCaregiverSurface = Color(0xFFFAEBEB);

  // ── Status ───────────────────────────────────────────────────
  static const Color success = Color(0xFF5B9B72);
  static const Color warning = Color(0xFFD4A35A);
  static const Color error = Color(0xFFBF5B5B);
  static const Color info = Color(0xFF5B7EB2);

  // ── Misc ─────────────────────────────────────────────────────
  static const Color divider = Color(0xFFE0D8CF);
  static const Color shadow = Color(0x1A2C3E35);
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF1A1A1A);
}
