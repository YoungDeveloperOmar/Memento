// ─────────────────────────────────────────────────────────────
//  features/screens/reminders/reminders_screen.dart — My Medicine
//
//  Fixes:
//    • Made StatefulWidget so Done/Snooze buttons update UI
//    • _ReminderItem.isDone is now mutable (not final/const)
//    • Snooze shows a SnackBar confirmation
//    • Section headers use SectionHeader from app_scaffold.dart
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/constants/app_strings.dart';
import '../../../shared/widgets/app_scaffold.dart';

// ── Mutable data model ────────────────────────────────────────
class _ReminderItem {
  _ReminderItem({
    required this.name,
    required this.time,
    required this.dose,
    required this.icon,
    this.isDone = false,
    this.isSnoozed = false,
  });

  final String name;
  final String time;
  final String dose;
  final IconData icon;
  bool isDone;
  bool isSnoozed;
}

class RemindersScreen extends StatefulWidget {
  const RemindersScreen({super.key});

  @override
  State<RemindersScreen> createState() => _RemindersScreenState();
}

class _RemindersScreenState extends State<RemindersScreen> {
  // Demo data — replace with real data from backend later.
  final _morningReminders = [
    _ReminderItem(name: 'Aspirin',             time: '8:00 AM', dose: '1 tablet',  icon: Icons.medication_rounded),
    _ReminderItem(name: 'Blood Pressure Pill', time: '8:30 AM', dose: '1 tablet',  icon: Icons.favorite_rounded, isDone: true),
  ];
  final _afternoonReminders = [
    _ReminderItem(name: 'Vitamin D',           time: '1:00 PM', dose: '2 tablets', icon: Icons.wb_sunny_rounded),
    _ReminderItem(name: 'Fish Oil',            time: '1:30 PM', dose: '1 capsule', icon: Icons.opacity_rounded),
  ];
  final _eveningReminders = [
    _ReminderItem(name: 'Sleep Aid',           time: '9:00 PM', dose: '1 tablet',  icon: Icons.bedtime_rounded),
  ];

  void _markDone(List<_ReminderItem> list, int index) {
    setState(() => list[index].isDone = true);
  }

  void _snooze(List<_ReminderItem> list, int index) {
    setState(() => list[index].isSnoozed = true);
    // TODO: reschedule notification via NotificationService
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("${list[index].name} snoozed for 30 minutes.",
            style: AppTextStyles.bodySmall.copyWith(color: Colors.white)),
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.featureReminders,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: AppStrings.remindersTitle,
      subtitle: AppStrings.remindersSubtitle,
      child: ListView(
        children: [
          // Progress chip
          _ProgressChip(
            done: [..._morningReminders, ..._afternoonReminders, ..._eveningReminders]
                .where((r) => r.isDone).length,
            total: _morningReminders.length + _afternoonReminders.length + _eveningReminders.length,
          ),
          const SizedBox(height: AppConstants.spaceM),

          // ── Morning ──────────────────────────────────────
          const SectionHeader(AppStrings.remindersMorning),
          ..._morningReminders.asMap().entries.map((e) => Padding(
                padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
                child: _ReminderCard(
                  reminder: e.value,
                  onDone:  () => _markDone(_morningReminders,  e.key),
                  onSnooze: () => _snooze(_morningReminders, e.key),
                ),
              )),

          // ── Afternoon ────────────────────────────────────
          const SectionHeader(AppStrings.remindersAfternoon),
          ..._afternoonReminders.asMap().entries.map((e) => Padding(
                padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
                child: _ReminderCard(
                  reminder: e.value,
                  onDone:  () => _markDone(_afternoonReminders,  e.key),
                  onSnooze: () => _snooze(_afternoonReminders, e.key),
                ),
              )),

          // ── Evening ──────────────────────────────────────
          const SectionHeader(AppStrings.remindersEvening),
          ..._eveningReminders.asMap().entries.map((e) => Padding(
                padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
                child: _ReminderCard(
                  reminder: e.value,
                  onDone:  () => _markDone(_eveningReminders,  e.key),
                  onSnooze: () => _snooze(_eveningReminders, e.key),
                ),
              )),

          const SizedBox(height: AppConstants.spaceXXL),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _ProgressChip — "X of Y taken today"
// ─────────────────────────────────────────────────────────────
class _ProgressChip extends StatelessWidget {
  const _ProgressChip({required this.done, required this.total});
  final int done, total;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: done == total
            ? AppColors.success.withValues(alpha: 0.12)
            : AppColors.featureRemindersSurface,
        borderRadius: BorderRadius.circular(AppConstants.radiusFull),
        border: Border.all(
          color: done == total
              ? AppColors.success.withValues(alpha: 0.4)
              : AppColors.featureReminders.withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            done == total ? Icons.check_circle_rounded : Icons.medication_rounded,
            size: 20,
            color: done == total ? AppColors.success : AppColors.featureReminders,
          ),
          const SizedBox(width: 8),
          Text(
            done == total
                ? 'All medicines taken today! 🎉'
                : '$done of $total medicines taken today',
            style: AppTextStyles.labelMedium.copyWith(
              color: done == total ? AppColors.success : AppColors.featureReminders,
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _ReminderCard — single reminder with Done / Snooze buttons
// ─────────────────────────────────────────────────────────────
class _ReminderCard extends StatelessWidget {
  const _ReminderCard({
    required this.reminder,
    required this.onDone,
    required this.onSnooze,
  });

  final _ReminderItem reminder;
  final VoidCallback onDone;
  final VoidCallback onSnooze;

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      duration: AppConstants.animMedium,
      opacity: reminder.isDone ? 0.55 : 1.0,
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top row: icon + name + time
            Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: AppColors.featureReminders.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(AppConstants.radiusM),
                  ),
                  child: Icon(reminder.icon,
                      size: AppConstants.iconL,
                      color: AppColors.featureReminders),
                ),
                const SizedBox(width: AppConstants.spaceM),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        reminder.name,
                        style: AppTextStyles.headlineSmall.copyWith(
                          decoration: reminder.isDone
                              ? TextDecoration.lineThrough
                              : null,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text('${reminder.dose} · ${reminder.time}',
                          style: AppTextStyles.bodySmall),
                    ],
                  ),
                ),
                // Status icon
                if (reminder.isDone)
                  const Icon(Icons.check_circle_rounded,
                      color: AppColors.success, size: 32)
                else if (reminder.isSnoozed)
                  const Icon(Icons.snooze_rounded,
                      color: AppColors.warning, size: 32),
              ],
            ),

            // Action buttons (only show if not done)
            if (!reminder.isDone) ...[
              const SizedBox(height: AppConstants.spaceM),
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: SizedBox(
                      height: 46,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.check_rounded, size: 20),
                        label: const Text('Mark Done'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.success,
                          foregroundColor: Colors.white,
                          minimumSize: Size.zero,
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: onDone,
                      ),
                    ),
                  ),
                  const SizedBox(width: AppConstants.spaceS),
                  Expanded(
                    flex: 2,
                    child: SizedBox(
                      height: 46,
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.snooze_rounded, size: 18),
                        label: const Text('Snooze'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.featureReminders,
                          minimumSize: Size.zero,
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          side: const BorderSide(
                              color: AppColors.featureReminders, width: 1.5),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: reminder.isSnoozed ? null : onSnooze,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
