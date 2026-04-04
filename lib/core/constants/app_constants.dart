// ─────────────────────────────────────────────────────────────
//  core/constants/app_constants.dart — App-Wide Constants
//
//  Centralised numbers, durations, and sizing constants.
//  Keeping them here avoids magic numbers scattered across files.
// ─────────────────────────────────────────────────────────────

abstract class AppConstants {
  // ── Spacing ───────────────────────────────────────────────
  // All spacing follows an 8pt grid for visual consistency.
  static const double spaceXS = 4.0;
  static const double spaceS = 8.0;
  static const double spaceM = 16.0;
  static const double spaceL = 24.0;
  static const double spaceXL = 32.0;
  static const double spaceXXL = 48.0;

  // ── Border Radius ─────────────────────────────────────────
  static const double radiusS = 8.0;
  static const double radiusM = 14.0;
  static const double radiusL = 20.0;
  static const double radiusXL = 28.0;
  static const double radiusFull = 999.0;

  // ── Touch Targets ─────────────────────────────────────────
  // WCAG 2.5.5 recommends minimum 44×44pt; we use 64pt for
  // dementia patients who may have reduced motor control.
  static const double minTouchTarget = 64.0;
  static const double largeTouchTarget = 80.0;

  // ── Icon Sizes ────────────────────────────────────────────
  static const double iconS = 20.0;
  static const double iconM = 28.0;
  static const double iconL = 36.0;
  static const double iconXL = 48.0;
  static const double iconHero = 64.0;

  // ── Card & Layout ─────────────────────────────────────────
  static const double cardElevation = 0.0;
  static const double screenPadding = 20.0;
  static const double cardPadding = 20.0;

  // ── Animation Durations ───────────────────────────────────
  static const Duration animFast = Duration(milliseconds: 150);
  static const Duration animMedium = Duration(milliseconds: 300);
  static const Duration animSlow = Duration(milliseconds: 500);

  // ── Feature identifiers ───────────────────────────────────
  // Used by navigation and analytics (future)
  static const String featureHome = 'home';
  static const String featureReminders = 'reminders';
  static const String featureLocation = 'location';
  static const String featureMemory = 'memory';
  static const String featureChatbot = 'chatbot';
  static const String featureCaregiver = 'caregiver';
}
