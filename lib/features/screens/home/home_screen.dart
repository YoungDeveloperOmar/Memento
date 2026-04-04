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

import 'package:memento/core/constants/app_constants.dart';
import 'package:memento/core/constants/app_strings.dart';
import 'package:memento/core/theme/app_colors.dart';
import 'package:memento/core/theme/app_text_styles.dart';
import 'package:memento/shared/widgets/large_button.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  String getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return AppStrings.homeGreetingMorning;
    if (hour < 18) return AppStrings.homeGreetingAfternoon;
    return AppStrings.homeGreetingEvening;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppConstants.screenPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Greeting ─────────────────────────────
              Text(
                '${getGreeting()}, ${AppStrings.homeDefaultName}',
                style: AppTextStyles.displayMedium,
              ),

              const SizedBox(height: AppConstants.spaceS),

              Text(
                '${AppStrings.homeTodayDate} ${DateTime.now().toLocal().toString().split(' ')[0]}',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),

              const SizedBox(height: AppConstants.spaceXL),

              // ── Upcoming (NON-clickable) ─────────────
              Text(
                "Coming Up",
                style: AppTextStyles.headlineSmall,
              ),

              const SizedBox(height: AppConstants.spaceM),

              const _InfoCard(
                title: "Next Medication",
                subtitle: "Aspirin - 2:00 PM",
                color: AppColors.featureReminders,
              ),

              const SizedBox(height: AppConstants.spaceM),

              const _InfoCard(
                title: "Next Activity",
                subtitle: "Doctor Appointment - 4:00 PM",
                color: AppColors.featureLocation,
              ),

              const SizedBox(height: AppConstants.spaceXL),

              // ── Buttons ──────────────────────────────
              Text(
                "My Day",
                style: AppTextStyles.headlineSmall,
              ),

              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: "My Day",
                icon: Icons.calendar_today,
                backgroundColor: AppColors.featureLocation,
                onPressed: () {},
              ),

              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: "My Medicine",
                icon: Icons.medication,
                backgroundColor: AppColors.featureReminders,
                onPressed: () {},
              ),

              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: "Important People",
                icon: Icons.people,
                backgroundColor: AppColors.featureMemory,
                onPressed: () {},
              ),

              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: "Important Places",
                icon: Icons.location_on,
                backgroundColor: AppColors.featureLocation,
                onPressed: () {},
              ),

              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: "Ask Memo",
                icon: Icons.chat,
                backgroundColor: AppColors.featureChatbot,
                onPressed: () {},
              ),

              const SizedBox(height: AppConstants.spaceXL),

              LargeButton(
                label: "Emergency Help",
                icon: Icons.warning_rounded,
                backgroundColor: AppColors.error.withValues(alpha: 0.15),
                foregroundColor: AppColors.error,
                onPressed: () {
                  _showEmergencySheet(context);
                },
              ),

              const SizedBox(height: AppConstants.spaceXL),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmergencyContactTile extends StatelessWidget {
  const _EmergencyContactTile({
    required this.name,
    required this.phone,
  });

  final String name;
  final String phone;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text(phone),

          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.call),
                  label: const Text("Call"),
                  onPressed: () {
                    // TODO: integrate phone call
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.message),
                  label: const Text("Message"),
                  onPressed: () {
                    // TODO: integrate SMS
                  },
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}

void _showEmergencySheet(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (_) {
      return const Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Title ─────────────────────────────
            Text(
              "Emergency Contacts",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),

            SizedBox(height: 16),

            // ── Contact 1 ─────────────────────────
            _EmergencyContactTile(
              name: "Sarah (Daughter)",
              phone: "123-456-7890",
            ),

            SizedBox(height: 12),

            // ── Contact 2 ─────────────────────────
            _EmergencyContactTile(
              name: "Dr. Smith",
              phone: "987-654-3210",
            ),

            SizedBox(height: 20),

            // ── Patient Info ──────────────────────
            Text(
              "Important Information",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),

            SizedBox(height: 8),

            Text("Address: 123 Home Street, Chicago, IL"),
            Text("Caregiver: Sarah"),
            Text("Condition: Dementia"),

            SizedBox(height: 24),
          ],
        ),
      );
    },
  );
}

// ─────────────────────────────────────────────
// Simple non-clickable info card
// ─────────────────────────────────────────────
class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.title,
    required this.subtitle,
    required this.color,
  });

  final String title;
  final String subtitle;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppConstants.cardPadding),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppConstants.radiusL),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTextStyles.labelMedium),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: AppTextStyles.bodyLarge.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
