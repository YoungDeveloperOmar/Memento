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
  // ── Primary — Website Sage Green ───────────────────────────
  static const Color primary = Color(0xFF4F8F74);
  static const Color primaryLight = Color(0xFF6FAF92);
  static const Color primaryDark = Color(0xFF3E7560);
  static const Color primarySurface = Color(0xFFE8F3EF);

  // ── Secondary — Warm accent used on website ────────────────
  static const Color secondary = Color(0xFFD4845A);
  static const Color secondaryLight = Color(0xFFE8A882);
  static const Color secondarySurface = Color(0xFFFAEDE5);

  // ── Background & Surface (matches website beige tone) ─────
  static const Color background = Color(0xFFF6F4EF);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFEEE9E2);

  // ── Text ──────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFF2C3E35);
  static const Color textSecondary = Color(0xFF5C6E65);
  static const Color textHint = Color(0xFF9AADA5);

  // ── Feature Colors (same as before but slightly softened) ─
  static const Color featureReminders = Color(0xFF7B9ECC);
  static const Color featureLocation = Color(0xFF7DC4A0);
  static const Color featureMemory = Color(0xFFBF8DC0);
  static const Color featureChatbot = Color(0xFFD4A35A);
  static const Color featureCaregiver = Color(0xFFD47A7A);

  // Feature background tints
  static const Color featureRemindersSurface = Color(0xFFEBF2FA);
  static const Color featureLocationSurface = Color(0xFFE5F5ED);
  static const Color featureMemorySurface = Color(0xFFF4EBF5);
  static const Color featureChatbotSurface = Color(0xFFFAF2E5);
  static const Color featureCaregiverSurface = Color(0xFFFAEBEB);

  // ── Status ────────────────────────────────────────────────
  static const Color success = Color(0xFF5B9B72);
  static const Color warning = Color(0xFFD4A35A);
  static const Color error = Color(0xFFBF5B5B);
  static const Color info = Color(0xFF5B7EB2);

  // ── Misc ──────────────────────────────────────────────────
  static const Color divider = Color(0xFFE0D8CF);
  static const Color shadow = Color(0x14000000);

  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF1A1A1A);
}