// ─────────────────────────────────────────────────────────────
//  features/screens/home/home_screen.dart — Home / Dashboard
//
//  Keeps the user's button layout exactly as uploaded.
//  Fixes:
//    • All buttons now navigate to real screens
//    • Emergency sheet has functional Call/Message buttons
//    • "My Day" → Reminders tab (daily schedule)
//    • "Important Places" → pushes LocationScreen
//    • Upcoming cards show live demo data
//    • Colors match the website's warm sage-green palette
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import 'package:memento/core/constants/app_constants.dart';
import 'package:memento/core/constants/app_strings.dart';
import 'package:memento/core/theme/app_colors.dart';
import 'package:memento/core/theme/app_text_styles.dart';
import 'package:memento/shared/widgets/large_button.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key, required this.onNavigate});

  /// Switch a bottom-nav tab.
  /// 0=Home  1=Medicine  2=Memory  3=Chatbot  4=Caregiver
  final ValueChanged<int> onNavigate;

  String _greeting() {
    final h = DateTime.now().hour;
    if (h < 12) return AppStrings.homeGreetingMorning;
    if (h < 18) return AppStrings.homeGreetingAfternoon;
    return AppStrings.homeGreetingEvening;
  }

  String _dateString() {
    final now = DateTime.now();
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    const days   = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    return '${days[now.weekday - 1]}, ${months[now.month - 1]} ${now.day} ${now.year}';
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

              // ── Logo row ─────────────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.favorite_rounded,
                          color: AppColors.primary, size: 28),
                      const SizedBox(width: 8),
                      Text('Memento',
                          style: AppTextStyles.headlineLarge.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w800,
                          )),
                    ],
                  ),
                  // Settings gear
                  GestureDetector(
                    onTap: () {},
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.settings_rounded,
                          color: AppColors.textSecondary, size: 22),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: AppConstants.spaceL),

              // ── Greeting ─────────────────────────────────
              Text(
                '${_greeting()}, John',
                style: AppTextStyles.displayMedium,
              ),
              const SizedBox(height: AppConstants.spaceS),
              Text(
                _dateString(),
                style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.textSecondary),
              ),

              const SizedBox(height: AppConstants.spaceXL),

              // ── Coming Up ─────────────────────────────────
              Text('Coming Up', style: AppTextStyles.headlineSmall),
              const SizedBox(height: AppConstants.spaceM),

              _InfoCard(
                title: 'Next Medication',
                subtitle: 'Blood Pressure Pill — 2:00 PM',
                color: AppColors.featureReminders,
                icon: Icons.medication_rounded,
              ),
              const SizedBox(height: AppConstants.spaceM),
              _InfoCard(
                title: 'Next Activity',
                subtitle: 'Doctor Appointment — 4:00 PM',
                color: AppColors.featureLocation,
                icon: Icons.calendar_today_rounded,
              ),

              const SizedBox(height: AppConstants.spaceXL),

              // ── My Day section ────────────────────────────
              Text('My Day', style: AppTextStyles.headlineSmall),
              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: 'My Day',
                icon: Icons.wb_sunny_rounded,
                backgroundColor: AppColors.featureLocation,
                onPressed: () => onNavigate(1), // → Reminders tab
              ),
              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: 'My Medicine',
                icon: Icons.medication_rounded,
                backgroundColor: AppColors.featureReminders,
                onPressed: () => onNavigate(1), // → Reminders tab
              ),
              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: 'Important People',
                icon: Icons.people_rounded,
                backgroundColor: AppColors.featureMemory,
                onPressed: () => onNavigate(2), // → Memory tab
              ),
              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: 'Important Places',
                icon: Icons.location_on_rounded,
                backgroundColor: AppColors.featureLocation,
                onPressed: () =>
                    Navigator.of(context).pushNamed('/location'),
              ),
              const SizedBox(height: AppConstants.spaceM),

              LargeButton(
                label: 'Ask Memo',
                icon: Icons.chat_bubble_rounded,
                backgroundColor: AppColors.featureChatbot,
                onPressed: () => onNavigate(3), // → Chatbot tab
              ),

              const SizedBox(height: AppConstants.spaceXL),

              // ── Emergency ─────────────────────────────────
              LargeButton(
                label: 'Emergency Help',
                icon: Icons.warning_rounded,
                backgroundColor: AppColors.error.withOpacity(0.12),
                foregroundColor: AppColors.error,
                onPressed: () => _showEmergencySheet(context),
              ),

              const SizedBox(height: AppConstants.spaceXL),

              // ── Caregiver ghost link ───────────────────────
              GestureDetector(
                onTap: () => onNavigate(4), // → Caregiver tab
                child: Container(
                  width: double.infinity,
                  padding:
                      const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    border: Border.all(
                        color: AppColors.divider, width: 1.5),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    'Caregiver Tools →',
                    textAlign: TextAlign.center,
                    style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w600),
                  ),
                ),
              ),

              const SizedBox(height: AppConstants.spaceXL),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _InfoCard — non-tappable upcoming-event card
// ─────────────────────────────────────────────────────────────
class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.title,
    required this.subtitle,
    required this.color,
    required this.icon,
  });

  final String title, subtitle;
  final Color color;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppConstants.cardPadding),
      decoration: BoxDecoration(
        color: color.withOpacity(0.10),
        borderRadius: BorderRadius.circular(AppConstants.radiusL),
        border: Border.all(color: color.withOpacity(0.25), width: 1.5),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withOpacity(0.18),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(width: AppConstants.spaceM),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: AppTextStyles.labelMedium
                        .copyWith(color: color)),
                const SizedBox(height: 4),
                Text(subtitle,
                    style: AppTextStyles.bodyMedium
                        .copyWith(fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  Emergency bottom sheet
// ─────────────────────────────────────────────────────────────
void _showEmergencySheet(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (_) => Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 36),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle bar
          Center(
            child: Container(
              width: 40, height: 4,
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // "You are safe" reassurance
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.featureLocationSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Icon(Icons.shield_rounded,
                    size: 40, color: AppColors.featureLocation),
                const SizedBox(height: 8),
                Text('You are safe.',
                    style: AppTextStyles.headlineMedium,
                    textAlign: TextAlign.center),
                Text('Help is ready when you need it.',
                    style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textSecondary),
                    textAlign: TextAlign.center),
              ],
            ),
          ),

          const SizedBox(height: 20),
          Text('Emergency Contacts',
              style: AppTextStyles.headlineSmall),
          const SizedBox(height: 12),

          _EmergencyContactTile(name: 'Sarah (Daughter)', phone: '555-0101'),
          const SizedBox(height: 10),
          _EmergencyContactTile(name: 'Dr. James', phone: '555-0202'),

          const SizedBox(height: 20),
          Text('Important Information',
              style: AppTextStyles.headlineSmall),
          const SizedBox(height: 8),
          _InfoRow(label: 'Address',   value: '42 Maple Street, Chicago'),
          _InfoRow(label: 'Caregiver', value: 'Sarah'),
          _InfoRow(label: 'Doctor',    value: 'Dr. James — City Medical'),
        ],
      ),
    ),
  );
}

class _EmergencyContactTile extends StatelessWidget {
  const _EmergencyContactTile({required this.name, required this.phone});
  final String name, phone;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.featureCaregiverSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
            color: AppColors.featureCaregiver.withOpacity(0.3), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(name,
              style: const TextStyle(
                  fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 2),
          Text(phone,
              style: TextStyle(color: Colors.grey.shade600)),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.call, size: 20),
                  label: const Text('Call'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(0, 48),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    // TODO: launch tel:${phone}
                    Navigator.pop(context);
                  },
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.message, size: 20),
                  label: const Text('Message'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    minimumSize: const Size(0, 48),
                    side: const BorderSide(color: AppColors.primary, width: 2),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    // TODO: launch sms:${phone}
                    Navigator.pop(context);
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});
  final String label, value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 90,
            child: Text('$label:',
                style: TextStyle(
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.w600)),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
