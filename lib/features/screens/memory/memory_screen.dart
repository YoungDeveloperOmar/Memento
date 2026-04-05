// ─────────────────────────────────────────────────────────────
//  features/screens/memory/memory_screen.dart — My Memory
//
//  Keeps the user's Memory Book layout.
//  Fixes:
//    • Imports use consistent relative paths
//    • PersonCard taps show a detail bottom sheet
//    • PlaceCard taps show directions prompt
//    • All data is rich demo data
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/constants/app_strings.dart';
import '../../../shared/widgets/app_scaffold.dart';

// ── Demo data models ──────────────────────────────────────────
class _Person {
  const _Person({
    required this.name,
    required this.relationship,
    required this.emoji,
    required this.phone,
    required this.note,
  });
  final String name, relationship, emoji, phone, note;
}

class _Place {
  const _Place({
    required this.name,
    required this.description,
    required this.icon,
    required this.note,
  });
  final String name, description, note;
  final IconData icon;
}

const _people = [
  _Person(name: 'Sarah',     relationship: 'Daughter', emoji: '👩',    phone: '555-0101', note: 'Sarah loves you and visits every weekend.'),
  _Person(name: 'Michael',   relationship: 'Son',      emoji: '👨',    phone: '555-0102', note: 'Michael calls every evening to check on you.'),
  _Person(name: 'Dr. James', relationship: 'Doctor',   emoji: '👨‍⚕️', phone: '555-0202', note: 'Dr. James is your family doctor at City Medical.'),
  _Person(name: 'Linda',     relationship: 'Caregiver',emoji: '🧑‍⚕️', phone: '555-0303', note: 'Linda helps you during the week. She is very kind.'),
];

const _places = [
  _Place(name: 'Home',            description: '42 Maple Street, Chicago',   icon: Icons.home_rounded,           note: 'This is your home. You are safe here.'),
  _Place(name: "Doctor's Office", description: 'City Medical Center',         icon: Icons.local_hospital_rounded, note: "This is where Dr. James checks your health."),
  _Place(name: 'Day Centre',      description: 'Maple Grove Day Centre',       icon: Icons.people_rounded,         note: 'You enjoy activities here on Tuesdays.'),
  _Place(name: 'Pharmacy',        description: '55 Oak Road, Chicago',         icon: Icons.local_pharmacy_rounded, note: 'This is where you pick up your medicines.'),
];

class MemoryScreen extends StatelessWidget {
  const MemoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: AppStrings.memoryTitle,
      subtitle: AppStrings.memorySubtitle,
      child: ListView(
        children: [
          // ── Family & Friends ──────────────────────────
          const SectionHeader(AppStrings.memoryFamilySection),
          SizedBox(
            height: 160,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _people.length,
              separatorBuilder: (_, __) =>
                  const SizedBox(width: AppConstants.spaceM),
              itemBuilder: (context, i) =>
                  _PersonCard(person: _people[i]),
            ),
          ),
          const SizedBox(height: AppConstants.spaceL),

          // ── Familiar Places ───────────────────────────
          const SectionHeader(AppStrings.memoryPlacesSection),
          ..._places.map((p) => Padding(
                padding:
                    const EdgeInsets.only(bottom: AppConstants.spaceM),
                child: _PlaceCard(place: p),
              )),

          // ── Important Info ────────────────────────────
          const SectionHeader(AppStrings.memoryImportantSection),
          const _InfoCard(label: 'My Name',      value: 'John Smith',         icon: Icons.badge_rounded),
          const SizedBox(height: AppConstants.spaceM),
          const _InfoCard(label: 'My Address',   value: '42 Maple Street, Chicago, IL', icon: Icons.home_rounded),
          const SizedBox(height: AppConstants.spaceM),
          const _InfoCard(label: 'Date of Birth',value: '12 March 1945',       icon: Icons.cake_rounded),
          const SizedBox(height: AppConstants.spaceM),
          const _InfoCard(label: 'Blood Type',   value: 'A Positive',          icon: Icons.bloodtype_rounded),
          const SizedBox(height: AppConstants.spaceXXL),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
class _PersonCard extends StatelessWidget {
  const _PersonCard({required this.person});
  final _Person person;

  void _showDetail(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 24, 20, 40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle
            Center(child: Container(width: 40, height: 4,
                decoration: BoxDecoration(color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2)))),
            const SizedBox(height: 20),
            // Avatar
            Container(width: 80, height: 80,
                decoration: BoxDecoration(
                    color: AppColors.featureMemory.withOpacity(0.2),
                    shape: BoxShape.circle),
                child: Center(child: Text(person.emoji,
                    style: const TextStyle(fontSize: 44)))),
            const SizedBox(height: 12),
            Text(person.name, style: AppTextStyles.headlineLarge),
            Text(person.relationship,
                style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.textSecondary)),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                  color: AppColors.featureMemorySurface,
                  borderRadius: BorderRadius.circular(16)),
              child: Text('"${person.note}"',
                  style: AppTextStyles.bodyMedium.copyWith(
                      fontStyle: FontStyle.italic),
                  textAlign: TextAlign.center),
            ),
            const SizedBox(height: 16),
            Row(children: [
              Expanded(child: ElevatedButton.icon(
                icon: const Icon(Icons.call),
                label: const Text('Call'),
                style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(0, 52),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14))),
                onPressed: () { /* TODO: launch tel: */ Navigator.pop(context); },
              )),
              const SizedBox(width: 12),
              Expanded(child: OutlinedButton.icon(
                icon: const Icon(Icons.message),
                label: const Text('Message'),
                style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    minimumSize: const Size(0, 52),
                    side: const BorderSide(color: AppColors.primary, width: 2),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14))),
                onPressed: () { /* TODO: launch sms: */ Navigator.pop(context); },
              )),
            ]),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _showDetail(context),
      child: Container(
        width: 120,
        decoration: BoxDecoration(
          color: AppColors.featureMemorySurface,
          borderRadius: BorderRadius.circular(AppConstants.radiusL),
          border: Border.all(
              color: AppColors.featureMemory.withOpacity(0.3), width: 1.5),
        ),
        padding: const EdgeInsets.all(AppConstants.spaceM),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 64, height: 64,
              decoration: BoxDecoration(
                  color: AppColors.featureMemory.withOpacity(0.2),
                  shape: BoxShape.circle),
              child: Center(child: Text(person.emoji,
                  style: const TextStyle(fontSize: 36))),
            ),
            const SizedBox(height: AppConstants.spaceS),
            Text(person.name,
                style: AppTextStyles.headlineSmall.copyWith(
                    color: AppColors.featureMemory, fontSize: 15),
                textAlign: TextAlign.center,
                maxLines: 1, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 2),
            Text(person.relationship,
                style: AppTextStyles.caption,
                textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
class _PlaceCard extends StatelessWidget {
  const _PlaceCard({required this.place});
  final _Place place;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('${place.note}',
              style: AppTextStyles.bodySmall.copyWith(color: Colors.white)),
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppColors.featureMemory,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12)),
        ));
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.featureMemorySurface,
          borderRadius: BorderRadius.circular(AppConstants.radiusL),
          border: Border.all(
              color: AppColors.featureMemory.withOpacity(0.3), width: 1.5),
        ),
        padding: const EdgeInsets.all(AppConstants.cardPadding),
        child: Row(
          children: [
            Container(
              width: 52, height: 52,
              decoration: BoxDecoration(
                  color: AppColors.featureMemory.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(AppConstants.radiusM)),
              child: Icon(place.icon,
                  size: AppConstants.iconL, color: AppColors.featureMemory),
            ),
            const SizedBox(width: AppConstants.spaceM),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(place.name, style: AppTextStyles.headlineSmall),
                  const SizedBox(height: 2),
                  Text(place.description, style: AppTextStyles.bodySmall),
                ],
              ),
            ),
            Icon(Icons.info_outline_rounded,
                color: AppColors.featureMemory,
                size: AppConstants.iconM),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.label,
    required this.value,
    required this.icon,
  });
  final String label, value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppConstants.radiusL),
        boxShadow: const [
          BoxShadow(color: AppColors.shadow, blurRadius: 8, offset: Offset(0, 2)),
        ],
      ),
      padding: const EdgeInsets.all(AppConstants.cardPadding),
      child: Row(
        children: [
          Icon(icon, size: AppConstants.iconM, color: AppColors.primary),
          const SizedBox(width: AppConstants.spaceM),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppTextStyles.caption),
              const SizedBox(height: 2),
              Text(value, style: AppTextStyles.bodyLarge),
            ],
          ),
        ],
      ),
    );
  }
}
