// ─────────────────────────────────────────────────────────────
//  features/reminders/screens/reminders_screen.dart
//
//  Shows the patient's medication and appointment reminders.
//  Grouped by time of day (Morning / Afternoon / Evening).
//
//  Future: Connect to NotificationService + backend CRUD.
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/constants/app_strings.dart';
import '../../../shared/widgets/app_scaffold.dart';

// ── Placeholder data model ────────────────────────────────────
// TODO: Move to a proper model class and load from backend.
class _ReminderItem {
  const _ReminderItem({
    required this.name,
    required this.time,
    required this.dose,
    required this.icon,
    this.isDone = false,
  });

  final String name;
  final String time;
  final String dose;
  final IconData icon;
  final bool isDone;
}

// Placeholder reminders — replace with real data later.
const _morningReminders = [
  _ReminderItem(
    name: 'Aspirin',
    time: '8:00 AM',
    dose: '1 tablet',
    icon: Icons.medication_rounded,
  ),
  _ReminderItem(
    name: 'Blood Pressure Pill',
    time: '8:30 AM',
    dose: '1 tablet',
    icon: Icons.favorite_rounded,
    isDone: true,
  ),
];

const _afternoonReminders = [
  _ReminderItem(
    name: 'Vitamin D',
    time: '1:00 PM',
    dose: '2 tablets',
    icon: Icons.wb_sunny_rounded,
  ),
];

const _eveningReminders = [
  _ReminderItem(
    name: 'Sleep Aid',
    time: '9:00 PM',
    dose: '1 tablet',
    icon: Icons.bedtime_rounded,
  ),
];

class RemindersScreen extends StatelessWidget {
  const RemindersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: AppStrings.remindersTitle,
      subtitle: AppStrings.remindersSubtitle,
      child: ListView(
        children: [
          // ── Morning ─────────────────────────────────────
          const SectionHeader(AppStrings.remindersMorning),
          ..._morningReminders.map(
            (r) => Padding(
              padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
              child: _ReminderCard(reminder: r),
            ),
          ),

          // ── Afternoon ────────────────────────────────────
          const SectionHeader(AppStrings.remindersAfternoon),
          ..._afternoonReminders.map(
            (r) => Padding(
              padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
              child: _ReminderCard(reminder: r),
            ),
          ),

          // ── Evening ──────────────────────────────────────
          const SectionHeader(AppStrings.remindersEvening),
          ..._eveningReminders.map(
            (r) => Padding(
              padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
              child: _ReminderCard(reminder: r),
            ),
          ),

          const SizedBox(height: AppConstants.spaceXXL),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _ReminderCard — a single medication reminder row.
// ─────────────────────────────────────────────────────────────
class _ReminderCard extends StatelessWidget {
  const _ReminderCard({required this.reminder});

  final _ReminderItem reminder;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: reminder.isDone ? 0.5 : 1.0,
      child: Container(
        decoration: BoxDecoration(
          color: reminder.isDone
              ? AppColors.surfaceVariant
              : AppColors.featureRemindersSurface,
          borderRadius: BorderRadius.circular(AppConstants.radiusL),
          border: Border.all(
            color: reminder.isDone
                ? AppColors.divider
                : AppColors.featureReminders.withValues(alpha: 0.3),
            width: 1.5,
          ),
        ),
        padding: const EdgeInsets.all(AppConstants.cardPadding),
        child: Row(
          children: [
            // Icon
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppColors.featureReminders.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(AppConstants.radiusM),
              ),
              child: Icon(
                reminder.icon,
                size: AppConstants.iconL,
                color: AppColors.featureReminders,
              ),
            ),
            const SizedBox(width: AppConstants.spaceM),

            // Name + dose
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    reminder.name,
                    style: AppTextStyles.headlineSmall.copyWith(
                      decoration: reminder.isDone
                          ? TextDecoration.lineThrough
                          : TextDecoration.none,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${reminder.dose} · ${reminder.time}',
                    style: AppTextStyles.bodySmall,
                  ),
                ],
              ),
            ),

            // Done indicator
            if (reminder.isDone)
              const Icon(
                Icons.check_circle_rounded,
                color: AppColors.success,
                size: 32,
              )
            else
              GestureDetector(
                onTap: () {
                  // TODO: mark as done via reminder service
                },
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: AppColors.featureReminders,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
