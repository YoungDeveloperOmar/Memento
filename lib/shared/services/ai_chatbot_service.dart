// ─────────────────────────────────────────────────────────────
//  shared/services/ai_chatbot_service.dart
//
//  PLACEHOLDER — No implementation yet.
//
//  This service will handle communication with the AI backend
//  (e.g., OpenAI, Anthropic, or a custom LLM endpoint) to
//  power the "Ask Memo" chatbot feature.
//
//  Future responsibilities:
//    • Send user messages to the AI API
//    • Stream AI responses back to the UI
//    • Text-to-speech (TTS) output of AI responses
//    • Maintain per-session conversation history
//    • Personalise responses with patient profile data
//      (name, medications, family members, safe zones)
//    • Offline fallback for common questions
// ─────────────────────────────────────────────────────────────

/// Represents a single message in the chat conversation.
class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.text,
    required this.isUser,
    required this.timestamp,
  });

  final String id;
  final String text;

  /// true = sent by the patient, false = sent by Memo (AI)
  final bool isUser;

  final DateTime timestamp;
}

/// Placeholder for the AI chatbot service.
/// Replace this stub with a real implementation when the backend is ready.
abstract class AiChatbotService {
  /// Send a user message and receive an AI response.
  /// Returns the AI's reply as a plain string.
  ///
  /// TODO: Stream tokens for real-time response rendering.
  Future<String> sendMessage(String userMessage);

  /// Convert [text] to speech and play it aloud.
  /// Uses device TTS or a cloud TTS API.
  ///
  /// TODO: Integrate flutter_tts or Google Cloud TTS.
  Future<void> speak(String text);

  /// Stop any ongoing speech playback.
  Future<void> stopSpeaking();

  /// Start speech-to-text listening.
  /// Returns the recognised text when the user stops speaking.
  ///
  /// TODO: Integrate speech_to_text package.
  Future<String> listen();

  /// Clear the current conversation history.
  void clearHistory();
}

/// Stub implementation — always returns a placeholder response.
/// Swap this with [AiChatbotServiceImpl] once the backend is wired up.
class AiChatbotServiceStub implements AiChatbotService {
  @override
  Future<String> sendMessage(String userMessage) async {
    await Future.delayed(const Duration(seconds: 1)); // simulate latency
    return 'I\'m Memo! This feature is coming soon. '
        'I\'ll be able to answer your questions shortly.';
  }

  @override
  Future<void> speak(String text) async {
    // TODO: implement TTS
  }

  @override
  Future<void> stopSpeaking() async {
    // TODO: implement
  }

  @override
  Future<String> listen() async {
    // TODO: implement STT
    return '';
  }

  @override
  void clearHistory() {
    // TODO: implement
  }
}
