// ─────────────────────────────────────────────────────────────
//  core/constants/app_strings.dart — All User-Facing Strings
//
//  Centralising strings here makes it easy to:
//    1. Audit copy for tone and clarity
//    2. Add localisation (l10n) later (swap this for .arb files)
//    3. Keep screen files clean
//
//  Copy tone: warm, simple, reassuring. Short sentences.
//  Avoid clinical language. Avoid jargon.
// ─────────────────────────────────────────────────────────────

abstract class AppStrings {
  // ── App ───────────────────────────────────────────────────
  static const String appName = 'Memento';
  static const String appTagline = 'Your memory, our care.';

  // ── Navigation labels ─────────────────────────────────────
  static const String navHome = 'Home';
  static const String navReminders = 'Reminders';
  static const String navLocation = 'Location';
  static const String navMemory = 'Memory';
  static const String navChatbot = 'Ask Memo';
  static const String navCaregiver = 'Caregiver';

  // ── Home Screen ───────────────────────────────────────────
  static const String homeGreetingMorning = 'Good morning';
  static const String homeGreetingAfternoon = 'Good afternoon';
  static const String homeGreetingEvening = 'Good evening';
  static const String homeDefaultName = 'there';
  static const String homeSubtitle = 'How can Memento help you today?';
  static const String homeTodayDate = 'Today is';

  // Home quick-action buttons
  static const String homeMyMeds = 'My Medications';
  static const String homeWhereAmI = 'Where Am I?';
  static const String homeMyFamily = 'My Family';
  static const String homeAskMemo = 'Ask Memo';

  // ── Reminders Screen ──────────────────────────────────────
  static const String remindersTitle = 'Reminders';
  static const String remindersSubtitle = 'Your medications and appointments';
  static const String remindersEmpty = 'No reminders yet.\nYour caregiver can add them for you.';
  static const String remindersAddNew = 'Add Reminder';
  static const String remindersTodaySection = "Today's Reminders";
  static const String remindersUpcomingSection = 'Upcoming';
  static const String remindersMorning = 'Morning';
  static const String remindersAfternoon = 'Afternoon';
  static const String remindersEvening = 'Evening';
  static const String remindersMarkDone = 'Mark as done';

  // ── Location Screen ───────────────────────────────────────
  static const String locationTitle = 'My Location';
  static const String locationSubtitle = 'You are safe';
  static const String locationSafeZone = 'You are in your safe zone';
  static const String locationOutsideSafe = 'You have left your safe zone';
  static const String locationShareWith = 'Share with caregiver';
  static const String locationGoHome = 'Get directions home';
  static const String locationCurrentAddress = 'Finding your location…';
  static const String locationPermissionNeeded =
      'Location permission is needed to show your position on the map.';
  static const String locationCallCaregiver = 'Call My Caregiver';

  // ── Memory Screen ─────────────────────────────────────────
  static const String memoryTitle = 'My Memory Book';
  static const String memorySubtitle = 'People and places you love';
  static const String memoryFamilySection = 'My Family';
  static const String memoryPlacesSection = 'Familiar Places';
  static const String memoryImportantSection = 'Important Information';
  static const String memoryAddPerson = 'Add a Person';
  static const String memoryAddPlace = 'Add a Place';
  static const String memoryEmpty = 'Your memory book is empty.\nAsk your caregiver to add people and places.';

  // ── Chatbot Screen ────────────────────────────────────────
  static const String chatbotTitle = 'Ask Memo';
  static const String chatbotSubtitle = 'I\'m here to help you';
  static const String chatbotGreeting =
      'Hello! I\'m Memo. I\'m here to help you. What would you like to know?';
  static const String chatbotInputHint = 'Type your question here…';
  static const String chatbotSend = 'Send';
  static const String chatbotListening = 'Listening…';
  static const String chatbotSpeak = 'Tap to speak';
  static const String chatbotThinking = 'Memo is thinking…';

  // Suggested questions
  static const List<String> chatbotSuggestions = [
    'What day is it today?',
    'What are my medications?',
    'Where do I live?',
    'Who is my caregiver?',
    'What is my doctor\'s name?',
  ];

  // ── Caregiver Screen ──────────────────────────────────────
  static const String caregiverTitle = 'Caregiver Dashboard';
  static const String caregiverSubtitle = 'Monitoring and alerts';
  static const String caregiverPatientSection = 'Your Patient';
  static const String caregiverAlertsSection = 'Recent Alerts';
  static const String caregiverRemindersSection = 'Manage Reminders';
  static const String caregiverLocationSection = 'Live Location';
  static const String caregiverNoAlerts = 'No alerts. Everything looks good!';
  static const String caregiverCallPatient = 'Call Patient';
  static const String caregiverSendMessage = 'Send Message';
  static const String caregiverViewLocation = 'View Location';

  // ── Shared / General ──────────────────────────────────────
  static const String ok = 'OK';
  static const String cancel = 'Cancel';
  static const String save = 'Save';
  static const String edit = 'Edit';
  static const String delete = 'Delete';
  static const String back = 'Back';
  static const String loading = 'Loading…';
  static const String error = 'Something went wrong. Please try again.';
  static const String comingSoon = 'Coming soon';
  static const String placeholderFeature =
      'This feature will be available soon.\nYour caregiver will set it up for you.';
}
