// ─────────────────────────────────────────────────────────────
//  features/location/screens/location_screen.dart
//
//  Shows the patient's current location status and a map
//  placeholder. Provides quick actions: "Go Home" and
//  "Call Caregiver."
//
//  Future: Integrate google_maps_flutter + LocationService.
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/constants/app_strings.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/large_button.dart';

class LocationScreen extends StatelessWidget {
  const LocationScreen({super.key});

  // TODO: Replace this hardcoded status with LocationService stream.
  static const bool _isInSafeZone = true;

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: AppStrings.locationTitle,
      subtitle: AppStrings.locationSubtitle,
      padding: EdgeInsets.zero, // we handle padding per-section
      child: Column(
        children: [
          // ── Status Banner ─────────────────────────────────
          const Padding(
            padding: EdgeInsets.symmetric(
              horizontal: AppConstants.screenPadding,
            ),
            child: _StatusBanner(isInSafeZone: _isInSafeZone),
          ),
          const SizedBox(height: AppConstants.spaceL),

          // ── Map Placeholder ───────────────────────────────
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppConstants.screenPadding,
              ),
              child: _MapPlaceholder(),
            ),
          ),
          const SizedBox(height: AppConstants.spaceL),

          // ── Action Buttons ────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.screenPadding,
            ),
            child: Column(
              children: [
                LargeButton(
                  label: AppStrings.locationGoHome,
                  icon: Icons.home_rounded,
                  onPressed: () {
                    // TODO: open Google Maps with home address
                  },
                ),
                const SizedBox(height: AppConstants.spaceM),
                LargeButton(
                  label: AppStrings.locationCallCaregiver,
                  icon: Icons.phone_rounded,
                  style: LargeButtonStyle.secondary,
                  backgroundColor: AppColors.featureCaregiver,
                  onPressed: () {
                    // TODO: initiate phone call
                  },
                ),
                const SizedBox(height: AppConstants.spaceXXL),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _StatusBanner — shows whether patient is in their safe zone.
// ─────────────────────────────────────────────────────────────
class _StatusBanner extends StatelessWidget {
  const _StatusBanner({required this.isInSafeZone});

  final bool isInSafeZone;

  @override
  Widget build(BuildContext context) {
    final color =
        isInSafeZone ? AppColors.featureLocation : AppColors.warning;
    final bgColor =
        isInSafeZone ? AppColors.featureLocationSurface : AppColors.featureChatbotSurface;
    final icon =
        isInSafeZone ? Icons.shield_rounded : Icons.warning_amber_rounded;
    final message = isInSafeZone
        ? AppStrings.locationSafeZone
        : AppStrings.locationOutsideSafe;

    return Container(
      padding: const EdgeInsets.all(AppConstants.cardPadding),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(AppConstants.radiusL),
        border: Border.all(color: color.withValues(alpha: 0.4), width: 1.5),
      ),
      child: Row(
        children: [
          Icon(icon, size: AppConstants.iconL, color: color),
          const SizedBox(width: AppConstants.spaceM),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  message,
                  style: AppTextStyles.headlineSmall.copyWith(color: color),
                ),
                const SizedBox(height: 4),
                // TODO: Replace with real address from LocationService
                Text(
                  '123 Home Street, Chicago, IL',
                  style: AppTextStyles.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _MapPlaceholder — replace with GoogleMap widget later.
// ─────────────────────────────────────────────────────────────
class _MapPlaceholder extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.featureLocationSurface,
        borderRadius: BorderRadius.circular(AppConstants.radiusXL),
        border: Border.all(
          color: AppColors.featureLocation.withValues(alpha: 0.3),
          width: 1.5,
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.map_rounded,
            size: AppConstants.iconHero,
            color: AppColors.featureLocation.withValues(alpha: 0.5),
          ),
          const SizedBox(height: AppConstants.spaceM),
          Text(
            'Map coming soon',
            style: AppTextStyles.bodyLarge.copyWith(
              color: AppColors.featureLocation,
            ),
          ),
          const SizedBox(height: AppConstants.spaceS),
          Text(
            'Your location is being tracked safely.',
            style: AppTextStyles.bodySmall,
            textAlign: TextAlign.center,
          ),
          // TODO: Replace this Column with GoogleMap(...)
        ],
      ),
    );
  }
}
