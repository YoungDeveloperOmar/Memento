// ─────────────────────────────────────────────────────────────
//  features/memory/screens/memory_screen.dart
//
//  The "Memory Book" — a visual reference for people and places
//  that matter to the patient. Helps with orientation and
//  reduces anxiety when the patient can't remember names or faces.
//
//  Future: Load from Firestore, support photo uploads.
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/constants/app_strings.dart';
import '../../../shared/widgets/app_scaffold.dart';

// ── Placeholder data models ───────────────────────────────────
// TODO: Move to proper model files in features/memory/models/

class _Person {
  const _Person({
    required this.name,
    required this.relationship,
    required this.emoji, // placeholder for real photos
    required this.phone,
  });

  final String name;
  final String relationship;
  final String emoji;
  final String phone;
}

class _Place {
  const _Place({
    required this.name,
    required this.description,
    required this.icon,
  });

  final String name;
  final String description;
  final IconData icon;
}

// Placeholder data — replace with real data from backend.
const _people = [
  _Person(name: 'Sarah', relationship: 'Daughter', emoji: '👩', phone: '+1 (555) 0101'),
  _Person(name: 'Michael', relationship: 'Son', emoji: '👨', phone: '+1 (555) 0102'),
  _Person(name: 'Dr. Patel', relationship: 'Doctor', emoji: '👩‍⚕️', phone: '+1 (555) 0103'),
  _Person(name: 'Nurse Linda', relationship: 'Caregiver', emoji: '🧑‍⚕️', phone: '+1 (555) 0104'),
];

const _places = [
  _Place(name: 'Home', description: '123 Home Street, Chicago', icon: Icons.home_rounded),
  _Place(name: 'Doctor\'s Office', description: 'City Medical Center', icon: Icons.local_hospital_rounded),
  _Place(name: 'Day Centre', description: 'Maple Grove Day Centre', icon: Icons.people_rounded),
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
          // ── Family & Friends ──────────────────────────────
          const SectionHeader(AppStrings.memoryFamilySection),
          SizedBox(
            height: 160,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _people.length,
              separatorBuilder: (_, __) =>
                  const SizedBox(width: AppConstants.spaceM),
              itemBuilder: (context, i) => _PersonCard(person: _people[i]),
            ),
          ),
          const SizedBox(height: AppConstants.spaceL),

          // ── Familiar Places ────────────────────────────────
          const SectionHeader(AppStrings.memoryPlacesSection),
          ..._places.map(
            (p) => Padding(
              padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
              child: _PlaceCard(place: p),
            ),
          ),

          // ── Important Info ─────────────────────────────────
          const SectionHeader(AppStrings.memoryImportantSection),
          const _InfoCard(
            label: 'My Name',
            value: 'John Smith', // TODO: load from profile
            icon: Icons.badge_rounded,
          ),
          const SizedBox(height: AppConstants.spaceM),
          const _InfoCard(
            label: 'My Address',
            value: '123 Home Street, Chicago, IL',
            icon: Icons.home_rounded,
          ),
          const SizedBox(height: AppConstants.spaceM),
          const _InfoCard(
            label: 'Date of Birth',
            value: '12 March 1945',
            icon: Icons.cake_rounded,
          ),
          const SizedBox(height: AppConstants.spaceXXL),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _PersonCard — Scrollable avatar card for a person.
// ─────────────────────────────────────────────────────────────
class _PersonCard extends StatelessWidget {
  const _PersonCard({required this.person});

  final _Person person;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // TODO: show detail sheet with photo + phone + info
      },
      child: Container(
        width: 120,
        decoration: BoxDecoration(
          color: AppColors.featureMemorySurface,
          borderRadius: BorderRadius.circular(AppConstants.radiusL),
          border: Border.all(
            color: AppColors.featureMemory.withValues(alpha: 0.3),
            width: 1.5,
          ),
        ),
        padding: const EdgeInsets.all(AppConstants.spaceM),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Avatar placeholder — replace with CachedNetworkImage
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppColors.featureMemory.withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  person.emoji,
                  style: const TextStyle(fontSize: 36),
                ),
              ),
            ),
            const SizedBox(height: AppConstants.spaceS),
            Text(
              person.name,
              style: AppTextStyles.headlineSmall.copyWith(
                color: AppColors.featureMemory,
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              person.relationship,
              style: AppTextStyles.caption,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _PlaceCard — a row card for a familiar place.
// ─────────────────────────────────────────────────────────────
class _PlaceCard extends StatelessWidget {
  const _PlaceCard({required this.place});

  final _Place place;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // TODO: open map directions
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.featureMemorySurface,
          borderRadius: BorderRadius.circular(AppConstants.radiusL),
          border: Border.all(
            color: AppColors.featureMemory.withValues(alpha: 0.3),
            width: 1.5,
          ),
        ),
        padding: const EdgeInsets.all(AppConstants.cardPadding),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: AppColors.featureMemory.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(AppConstants.radiusM),
              ),
              child: Icon(
                place.icon,
                size: AppConstants.iconL,
                color: AppColors.featureMemory,
              ),
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
            const Icon(
              Icons.directions_rounded,
              color: AppColors.featureMemory,
              size: AppConstants.iconM,
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _InfoCard — a row for important personal information.
// ─────────────────────────────────────────────────────────────
class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.label,
    required this.value,
    required this.icon,
  });

  final String label;
  final String value;
  final IconData icon;

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
