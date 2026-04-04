// ─────────────────────────────────────────────────────────────
//  shared/services/location_service.dart
//
//  PLACEHOLDER — No implementation yet.
//
//  This service will handle all GPS and geofencing logic
//  required for the patient safety features.
//
//  Future responsibilities:
//    • Obtain and stream the device's current GPS coordinates
//    • Reverse-geocode coordinates → human-readable address
//    • Define one or more "safe zones" (home, day centre, etc.)
//    • Detect when the patient leaves a safe zone
//    • Trigger caregiver alerts on geofence exit/entry
//    • Share live location with designated caregivers
//    • Provide "Get directions home" navigation
//
//  Packages to integrate:
//    • geolocator          — GPS stream
//    • geocoding           — reverse geocoding
//    • flutter_background_service — keep tracking in background
//    • google_maps_flutter — map display
// ─────────────────────────────────────────────────────────────

/// A simple data class representing a geographic coordinate.
class LatLng {
  const LatLng({required this.latitude, required this.longitude});

  final double latitude;
  final double longitude;

  @override
  String toString() => 'LatLng($latitude, $longitude)';
}

/// Represents a named safe zone with a centre and radius.
class SafeZone {
  const SafeZone({
    required this.id,
    required this.name,
    required this.centre,
    this.radiusMeters = 500,
  });

  final String id;
  final String name;
  final LatLng centre;
  final double radiusMeters;
}

/// Possible states of the patient's location relative to safe zones.
enum LocationStatus {
  unknown,
  withinSafeZone,
  outsideSafeZone,
  permissionDenied,
  serviceDisabled,
}

/// Placeholder for the location tracking service.
abstract class LocationService {
  /// Request location permission from the OS.
  Future<bool> requestPermission();

  /// Get the device's current [LatLng] position.
  Future<LatLng?> getCurrentPosition();

  /// Stream position updates continuously.
  Stream<LatLng> positionStream();

  /// Reverse-geocode a coordinate into a human-readable address string.
  Future<String> getAddress(LatLng position);

  /// Determine whether [position] is within the given [zone].
  bool isWithinSafeZone(LatLng position, SafeZone zone);

  /// Start background geofence monitoring.
  Future<void> startGeofenceMonitoring(List<SafeZone> zones);

  /// Stop background geofence monitoring.
  Future<void> stopGeofenceMonitoring();
}

/// Stub — returns mock data so screens can render without real GPS.
class LocationServiceStub implements LocationService {
  @override
  Future<bool> requestPermission() async => true;

  @override
  Future<LatLng?> getCurrentPosition() async {
    // Mock location: Chicago
    return const LatLng(latitude: 41.8781, longitude: -87.6298);
  }

  @override
  Stream<LatLng> positionStream() async* {
    yield const LatLng(latitude: 41.8781, longitude: -87.6298);
  }

  @override
  Future<String> getAddress(LatLng position) async {
    return '123 Home Street, Chicago, IL'; // placeholder
  }

  @override
  bool isWithinSafeZone(LatLng position, SafeZone zone) => true;

  @override
  Future<void> startGeofenceMonitoring(List<SafeZone> zones) async {}

  @override
  Future<void> stopGeofenceMonitoring() async {}
}
