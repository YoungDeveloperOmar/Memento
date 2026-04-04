// ─────────────────────────────────────────────────────────────
//  shared/services/notification_service.dart
//
//  PLACEHOLDER — No implementation yet.
//
//  This service manages all local and push notifications
//  for medication reminders, location alerts, and caregiver
//  messages.
//
//  Future responsibilities:
//    • Schedule local notifications for medication reminders
//    • Cancel/reschedule reminders when user marks as done
//    • Send caregiver push alerts when patient leaves safe zone
//    • Support actionable notifications (e.g., "Mark as taken")
//    • Large text + sound for dementia-friendly alerts
//    • Quiet hours / do-not-disturb support
//
//  Packages to integrate:
//    • flutter_local_notifications — local scheduling
//    • firebase_messaging          — remote push notifications
//    • timezone                    — correct scheduling in timezone
// ─────────────────────────────────────────────────────────────

/// Priority level for a notification.
enum NotificationPriority { low, normal, high, urgent }

/// A data class representing a scheduled notification.
class AppNotification {
  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.scheduledAt,
    this.priority = NotificationPriority.normal,
    this.repeating = false,
  });

  final int id;
  final String title;
  final String body;
  final DateTime scheduledAt;
  final NotificationPriority priority;

  /// If true the notification repeats daily at the same time.
  final bool repeating;
}

/// Placeholder for the notification service.
abstract class NotificationService {
  /// Initialise the service (request permissions, configure channels).
  Future<void> initialize();

  /// Schedule a local notification.
  Future<void> schedule(AppNotification notification);

  /// Cancel a scheduled notification by [id].
  Future<void> cancel(int id);

  /// Cancel all scheduled notifications.
  Future<void> cancelAll();

  /// Show an immediate notification (e.g., for caregiver alerts).
  Future<void> showImmediate({
    required String title,
    required String body,
    NotificationPriority priority = NotificationPriority.high,
  });

  /// Get a list of all currently scheduled notifications.
  Future<List<AppNotification>> getPending();
}

/// Stub — logs calls without doing anything.
class NotificationServiceStub implements NotificationService {
  @override
  Future<void> initialize() async {
    // TODO: initialise flutter_local_notifications
  }

  @override
  Future<void> schedule(AppNotification notification) async {
    // TODO: schedule notification
  }

  @override
  Future<void> cancel(int id) async {
    // TODO: cancel notification
  }

  @override
  Future<void> cancelAll() async {
    // TODO: cancel all
  }

  @override
  Future<void> showImmediate({
    required String title,
    required String body,
    NotificationPriority priority = NotificationPriority.high,
  }) async {
    // TODO: show immediate notification
  }

  @override
  Future<List<AppNotification>> getPending() async => [];
}
