// ─────────────────────────────────────────────────────────────
//  features/home/screens/home_screen.dart — Home Screen
//
//  The first screen patients see every day. Designed to be:
//    • Immediately orienting (date, greeting, name)
//    • Clutter-free — only 4 large feature cards
//    • Warm and welcoming — "this is your safe place"
//
//  Navigation: Tap a card → navigates to the matching feature.
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';
import 'package:memento/core/theme/app_colors.dart';

import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/constants/app_strings.dart';
import '../../../shared/widgets/feature_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    super.key,
    required this.onNavigate,
  });

  /// Callback to switch the bottom nav tab.
  /// Index: 0=Home, 1=Reminders, 2=Location, 3=Memory, 4=Chatbot, 5=Caregiver
  final ValueChanged<int> onNavigate;

  @override
  Widget build(BuildContext context) {
    final greeting = _getGreeting();
    final dateString = _getFormattedDate();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppConstants.screenPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: AppConstants.spaceM),

              // ── Date chip ─────────────────────────────────
              _DateChip(dateString: dateString),
              const SizedBox(height: AppConstants.spaceXL),

              // ── Greeting ──────────────────────────────────
              Text(
                '$greeting,',
                style: AppTextStyles.bodyLarge.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppConstants.spaceXS),
              Text(
                // TODO: Replace 'there' with patient's real name from profile
                AppStrings.homeDefaultName,
                style: AppTextStyles.displayLarge,
              ),
              const SizedBox(height: AppConstants.spaceS),
              Text(
                AppStrings.homeSubtitle,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppConstants.spaceXXL),

              // ── Feature Cards Grid ─────────────────────────
              Text(
                'What would you like to do?',
                style: AppTextStyles.headlineSmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppConstants.spaceL),

              GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: AppConstants.spaceM,
                mainAxisSpacing: AppConstants.spaceM,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  // Medications / Reminders
                  FeatureCard(
                    label: AppStrings.homeMyMeds,
                    icon: Icons.medication_rounded,
                    color: AppColors.featureReminders,
                    backgroundColor: AppColors.featureRemindersSurface,
                    onTap: () => onNavigate(1),
                    badge: 2, // TODO: pull real count from reminders service
                  ),
                  // Location
                  FeatureCard(
                    label: AppStrings.homeWhereAmI,
                    icon: Icons.location_on_rounded,
                    color: AppColors.featureLocation,
                    backgroundColor: AppColors.featureLocationSurface,
                    onTap: () => onNavigate(2),
                  ),
                  // Memory book
                  FeatureCard(
                    label: AppStrings.homeMyFamily,
                    icon: Icons.favorite_rounded,
                    color: AppColors.featureMemory,
                    backgroundColor: AppColors.featureMemorySurface,
                    onTap: () => onNavigate(3),
                  ),
                  // Chatbot
                  FeatureCard(
                    label: AppStrings.homeAskMemo,
                    icon: Icons.chat_bubble_rounded,
                    color: AppColors.featureChatbot,
                    backgroundColor: AppColors.featureChatbotSurface,
                    onTap: () => onNavigate(4),
                  ),
                ],
              ),
              const SizedBox(height: AppConstants.spaceXL),

              // ── Quick Help Banner ─────────────────────────
              _EmergencyBanner(),
              const SizedBox(height: AppConstants.spaceXL),
            ],
          ),
        ),
      ),
    );
  }

  // ── Helpers ──────────────────────────────────────────────────

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return AppStrings.homeGreetingMorning;
    if (hour < 17) return AppStrings.homeGreetingAfternoon;
    return AppStrings.homeGreetingEvening;
  }

  String _getFormattedDate() {
    final now = DateTime.now();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const days = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ];
    final dayName = days[now.weekday - 1];
    final monthName = months[now.month - 1];
    return '$dayName, ${now.day} $monthName ${now.year}';
  }
}

// ─────────────────────────────────────────────────────────────
//  Private widgets — only used on the Home screen.
// ─────────────────────────────────────────────────────────────

class _DateChip extends StatelessWidget {
  const _DateChip({required this.dateString});

  final String dateString;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppConstants.spaceM,
        vertical: AppConstants.spaceS,
      ),
      decoration: BoxDecoration(
        color: AppColors.primarySurface,
        borderRadius: BorderRadius.circular(AppConstants.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.calendar_today_rounded,
            size: 18,
            color: AppColors.primary,
          ),
          const SizedBox(width: AppConstants.spaceS),
          Text(
            dateString,
            style: AppTextStyles.labelMedium.copyWith(
              color: AppColors.primary,
            ),
          ),
        ],
      ),
    );
  }
}

class _EmergencyBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // TODO: trigger emergency call / caregiver alert
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppConstants.cardPadding),
        decoration: BoxDecoration(
          color: AppColors.featureCaregiverSurface,
          borderRadius: BorderRadius.circular(AppConstants.radiusL),
          border: Border.all(
            color: AppColors.featureCaregiver.withOpacity(0.4),
            width: 1.5,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: AppColors.featureCaregiver.withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.phone_rounded,
                color: AppColors.featureCaregiver,
                size: 28,
              ),
            ),
            const SizedBox(width: AppConstants.spaceM),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Need help?',
                    style: AppTextStyles.headlineSmall.copyWith(
                      color: AppColors.featureCaregiver,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Tap to call your caregiver',
                    style: AppTextStyles.bodySmall,
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              color: AppColors.featureCaregiver,
              size: 28,
            ),
          ],
        ),
      ),
    );
  }
}
