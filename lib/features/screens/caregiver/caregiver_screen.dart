// ─────────────────────────────────────────────────────────────
//  features/caregiver/screens/caregiver_screen.dart
//
//  Caregiver Dashboard — used by the family member or
//  professional caregiver to monitor the patient.
//  Accessible via the same app (protected by auth in future).
//
//  Sections:
//    1. Patient status card (location, last seen, mood)
//    2. Recent alerts
//    3. Quick actions (call, message, view map)
//    4. Today's reminders summary
//
//  Future: Firebase auth guard, Firestore live data, push alerts.
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/constants/app_strings.dart';
import '../../../shared/widgets/app_scaffold.dart';

// ── Placeholder data models ───────────────────────────────────

class _Alert {
  const _Alert({
    required this.title,
    required this.description,
    required this.time,
    required this.type,
  });

  final String title;
  final String description;
  final String time;
  final _AlertType type;
}

enum _AlertType { location, medication, general }

// Placeholder alerts — replace with Firestore stream
const _alerts = [
  _Alert(
    title: 'Left safe zone',
    description: 'John walked beyond the home perimeter at 2:14 PM.',
    time: '2:14 PM',
    type: _AlertType.location,
  ),
  _Alert(
    title: 'Missed medication',
    description: 'Blood Pressure Pill not marked as taken.',
    time: '8:45 AM',
    type: _AlertType.medication,
  ),
];

class CaregiverScreen extends StatelessWidget {
  const CaregiverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: AppStrings.caregiverTitle,
      subtitle: AppStrings.caregiverSubtitle,
      child: ListView(
        children: [
          // ── Patient Status Card ───────────────────────────
          _PatientStatusCard(),
          const SizedBox(height: AppConstants.spaceL),

          // ── Quick Actions ─────────────────────────────────
          _QuickActions(),
          const SizedBox(height: AppConstants.spaceL),

          // ── Recent Alerts ─────────────────────────────────
          const SectionHeader(AppStrings.caregiverAlertsSection),
          if (_alerts.isEmpty)
            _EmptyAlerts()
          else
            ..._alerts.map(
              (a) => Padding(
                padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
                child: _AlertCard(alert: a),
              ),
            ),

          // ── Today's Reminders Summary ─────────────────────
          const SectionHeader(AppStrings.caregiverRemindersSection),
          _RemindersSummary(),
          const SizedBox(height: AppConstants.spaceXXL),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _PatientStatusCard — overview of patient's current state.
// ─────────────────────────────────────────────────────────────
class _PatientStatusCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryLight],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppConstants.radiusXL),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      padding: const EdgeInsets.all(AppConstants.cardPadding + 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Row(
            children: [
              const CircleAvatar(
                radius: 28,
                backgroundColor: Colors.white24,
                child: Text('👴', style: TextStyle(fontSize: 28)),
              ),
              const SizedBox(width: AppConstants.spaceM),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'John Smith', // TODO: load from patient profile
                      style: AppTextStyles.headlineMedium.copyWith(
                        color: AppColors.white,
                      ),
                    ),
                    Text(
                      'Your patient',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.white.withValues(alpha: 0.8),
                      ),
                    ),
                  ],
                ),
              ),
              // Live indicator dot
              Container(
                width: 12,
                height: 12,
                decoration: const BoxDecoration(
                  color: Color(0xFF6EE7B7), // green dot
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              Text(
                'Live',
                style: AppTextStyles.labelSmall.copyWith(
                  color: AppColors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppConstants.spaceL),

          // Status row
          Row(
            children: [
              const _StatusPill(
                icon: Icons.shield_rounded,
                label: 'In safe zone',
                color: Color(0xFF6EE7B7),
              ),
              const SizedBox(width: AppConstants.spaceM),
              _StatusPill(
                icon: Icons.access_time_rounded,
                label: 'Last seen 3m ago',
                color: AppColors.white.withValues(alpha: 0.85),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatusPill extends StatelessWidget {
  const _StatusPill({
    required this.icon,
    required this.label,
    required this.color,
  });

  final IconData icon;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppConstants.spaceM,
        vertical: AppConstants.spaceS,
      ),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(AppConstants.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 6),
          Text(
            label,
            style: AppTextStyles.labelSmall.copyWith(color: color),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _QuickActions — call, message, view location.
// ─────────────────────────────────────────────────────────────
class _QuickActions extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _ActionButton(
            icon: Icons.phone_rounded,
            label: AppStrings.caregiverCallPatient,
            color: AppColors.featureLocation,
            backgroundColor: AppColors.featureLocationSurface,
            onTap: () {
              // TODO: initiate phone call to patient
            },
          ),
        ),
        const SizedBox(width: AppConstants.spaceM),
        Expanded(
          child: _ActionButton(
            icon: Icons.map_rounded,
            label: AppStrings.caregiverViewLocation,
            color: AppColors.featureChatbot,
            backgroundColor: AppColors.featureChatbotSurface,
            onTap: () {
              // TODO: navigate to location screen / open map
            },
          ),
        ),
        const SizedBox(width: AppConstants.spaceM),
        Expanded(
          child: _ActionButton(
            icon: Icons.message_rounded,
            label: AppStrings.caregiverSendMessage,
            color: AppColors.featureMemory,
            backgroundColor: AppColors.featureMemorySurface,
            onTap: () {
              // TODO: open message composer
            },
          ),
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.backgroundColor,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final Color color;
  final Color backgroundColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(AppConstants.radiusL),
          border: Border.all(
            color: color.withValues(alpha: 0.3),
            width: 1.5,
          ),
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: AppConstants.spaceS,
          vertical: AppConstants.spaceL,
        ),
        child: Column(
          children: [
            Icon(icon, size: AppConstants.iconL, color: color),
            const SizedBox(height: AppConstants.spaceS),
            Text(
              label,
              style: AppTextStyles.labelSmall.copyWith(color: color),
              textAlign: TextAlign.center,
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _AlertCard — a single alert row with severity styling.
// ─────────────────────────────────────────────────────────────
class _AlertCard extends StatelessWidget {
  const _AlertCard({required this.alert});

  final _Alert alert;

  Color get _color {
    switch (alert.type) {
      case _AlertType.location:
        return AppColors.warning;
      case _AlertType.medication:
        return AppColors.featureReminders;
      case _AlertType.general:
        return AppColors.info;
    }
  }

  IconData get _icon {
    switch (alert.type) {
      case _AlertType.location:
        return Icons.location_off_rounded;
      case _AlertType.medication:
        return Icons.medication_rounded;
      case _AlertType.general:
        return Icons.notifications_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppConstants.radiusL),
        border: Border.all(
          color: _color.withValues(alpha: 0.4),
          width: 1.5,
        ),
        boxShadow: const [
          BoxShadow(
            color: AppColors.shadow,
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(AppConstants.cardPadding),
      child: Row(
        children: [
          // Left colour stripe
          Container(
            width: 4,
            height: 52,
            decoration: BoxDecoration(
              color: _color,
              borderRadius: BorderRadius.circular(AppConstants.radiusFull),
            ),
          ),
          const SizedBox(width: AppConstants.spaceM),

          // Icon
          Icon(_icon, size: AppConstants.iconL, color: _color),
          const SizedBox(width: AppConstants.spaceM),

          // Text
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(alert.title, style: AppTextStyles.headlineSmall),
                const SizedBox(height: 4),
                Text(alert.description, style: AppTextStyles.bodySmall),
              ],
            ),
          ),

          // Time
          Text(alert.time, style: AppTextStyles.caption),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _EmptyAlerts — shown when there are no recent alerts.
// ─────────────────────────────────────────────────────────────
class _EmptyAlerts extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppConstants.cardPadding + 8),
      decoration: BoxDecoration(
        color: AppColors.featureLocationSurface,
        borderRadius: BorderRadius.circular(AppConstants.radiusL),
      ),
      child: Column(
        children: [
          const Icon(
            Icons.check_circle_outline_rounded,
            size: AppConstants.iconXL,
            color: AppColors.featureLocation,
          ),
          const SizedBox(height: AppConstants.spaceM),
          Text(
            AppStrings.caregiverNoAlerts,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.featureLocation,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _RemindersSummary — compact overview for the caregiver.
// ─────────────────────────────────────────────────────────────
class _RemindersSummary extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppConstants.radiusL),
        boxShadow: const [
          BoxShadow(
            color: AppColors.shadow,
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(AppConstants.cardPadding),
      child: const Column(
        children: [
          _ReminderRow(name: 'Aspirin', time: '8:00 AM', isDone: true),
          Divider(height: AppConstants.spaceL),
          _ReminderRow(name: 'Blood Pressure Pill', time: '8:30 AM', isDone: false),
          Divider(height: AppConstants.spaceL),
          _ReminderRow(name: 'Vitamin D', time: '1:00 PM', isDone: false),
        ],
      ),
    );
  }
}

class _ReminderRow extends StatelessWidget {
  const _ReminderRow({
    required this.name,
    required this.time,
    required this.isDone,
  });

  final String name;
  final String time;
  final bool isDone;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(
          isDone
              ? Icons.check_circle_rounded
              : Icons.radio_button_unchecked_rounded,
          color: isDone ? AppColors.success : AppColors.featureReminders,
          size: AppConstants.iconM,
        ),
        const SizedBox(width: AppConstants.spaceM),
        Expanded(
          child: Text(
            name,
            style: AppTextStyles.bodyMedium.copyWith(
              decoration:
                  isDone ? TextDecoration.lineThrough : TextDecoration.none,
              color: isDone ? AppColors.textHint : AppColors.textPrimary,
            ),
          ),
        ),
        Text(time, style: AppTextStyles.caption),
      ],
    );
  }
}
