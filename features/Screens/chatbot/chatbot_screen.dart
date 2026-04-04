// ─────────────────────────────────────────────────────────────
//  features/chatbot/screens/chatbot_screen.dart
//
//  "Ask Memo" — the AI-powered assistant screen.
//  Patients can type or speak questions and receive
//  spoken + written answers in plain, simple language.
//
//  Future: Wire up AiChatbotService + flutter_tts + speech_to_text.
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/constants/app_strings.dart';
import '../../../shared/services/ai_chatbot_service.dart';

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  // TODO: inject real service via dependency injection (e.g., Provider / Riverpod)
  final AiChatbotService _chatbotService = AiChatbotServiceStub();

  final List<ChatMessage> _messages = [
    // Seed with Memo's opening greeting
    ChatMessage(
      id: 'greeting',
      text: AppStrings.chatbotGreeting,
      isUser: false,
      timestamp: DateTime.now(),
    ),
  ];

  bool _isThinking = false;
  bool _isListening = false;

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  // ── Actions ──────────────────────────────────────────────────

  Future<void> _sendMessage(String text) async {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;

    _inputController.clear();
    setState(() {
      _messages.add(ChatMessage(
        id: DateTime.now().toIso8601String(),
        text: trimmed,
        isUser: true,
        timestamp: DateTime.now(),
      ));
      _isThinking = true;
    });
    _scrollToBottom();

    // Call AI service (stub for now)
    final reply = await _chatbotService.sendMessage(trimmed);
    // TODO: also call _chatbotService.speak(reply) for TTS

    setState(() {
      _isThinking = false;
      _messages.add(ChatMessage(
        id: DateTime.now().toIso8601String(),
        text: reply,
        isUser: false,
        timestamp: DateTime.now(),
      ));
    });
    _scrollToBottom();
  }

  Future<void> _toggleListening() async {
    setState(() => _isListening = !_isListening);
    if (_isListening) {
      final spoken = await _chatbotService.listen();
      setState(() => _isListening = false);
      if (spoken.isNotEmpty) await _sendMessage(spoken);
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: AppConstants.animMedium,
          curve: Curves.easeOut,
        );
      }
    });
  }

  // ── Build ─────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        titleSpacing: AppConstants.screenPadding,
        title: Row(
          children: [
            // Memo avatar
            Container(
              width: 44,
              height: 44,
              decoration: const BoxDecoration(
                color: AppColors.featureChatbotSurface,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.smart_toy_rounded,
                color: AppColors.featureChatbot,
                size: 26,
              ),
            ),
            const SizedBox(width: AppConstants.spaceM),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(AppStrings.chatbotTitle, style: AppTextStyles.headlineMedium),
                Text(
                  AppStrings.chatbotSubtitle,
                  style: AppTextStyles.caption,
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Clear conversation
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            iconSize: AppConstants.iconM,
            tooltip: 'Start over',
            onPressed: () {
              setState(() {
                _messages
                  ..clear()
                  ..add(ChatMessage(
                    id: 'greeting_reset',
                    text: AppStrings.chatbotGreeting,
                    isUser: false,
                    timestamp: DateTime.now(),
                  ));
              });
              _chatbotService.clearHistory();
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // ── Suggestion chips ─────────────────────────────
            if (_messages.length <= 1) _SuggestionChips(onTap: _sendMessage),

            // ── Message list ──────────────────────────────────
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.symmetric(
                  horizontal: AppConstants.screenPadding,
                  vertical: AppConstants.spaceM,
                ),
                itemCount: _messages.length + (_isThinking ? 1 : 0),
                itemBuilder: (context, index) {
                  if (_isThinking && index == _messages.length) {
                    return const _ThinkingBubble();
                  }
                  return _MessageBubble(message: _messages[index]);
                },
              ),
            ),

            // ── Input row ─────────────────────────────────────
            _InputBar(
              controller: _inputController,
              isListening: _isListening,
              onSend: _sendMessage,
              onMicTap: _toggleListening,
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _MessageBubble — a single chat message (user or Memo).
// ─────────────────────────────────────────────────────────────
class _MessageBubble extends StatelessWidget {
  const _MessageBubble({required this.message});

  final ChatMessage message;

  @override
  Widget build(BuildContext context) {
    final isUser = message.isUser;

    return Padding(
      padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
      child: Row(
        mainAxisAlignment:
            isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Memo avatar (left)
          if (!isUser) ...[
            Container(
              width: 36,
              height: 36,
              decoration: const BoxDecoration(
                color: AppColors.featureChatbotSurface,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.smart_toy_rounded,
                color: AppColors.featureChatbot,
                size: 20,
              ),
            ),
            const SizedBox(width: AppConstants.spaceS),
          ],

          // Bubble
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppConstants.spaceL,
                vertical: AppConstants.spaceM,
              ),
              decoration: BoxDecoration(
                color: isUser ? AppColors.primary : AppColors.surface,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(AppConstants.radiusL),
                  topRight: const Radius.circular(AppConstants.radiusL),
                  bottomLeft: Radius.circular(
                    isUser ? AppConstants.radiusL : AppConstants.radiusS,
                  ),
                  bottomRight: Radius.circular(
                    isUser ? AppConstants.radiusS : AppConstants.radiusL,
                  ),
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.shadow,
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message.text,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: isUser ? AppColors.white : AppColors.textPrimary,
                    ),
                  ),
                  // TTS speaker button for Memo messages
                  if (!isUser) ...[
                    const SizedBox(height: AppConstants.spaceS),
                    GestureDetector(
                      onTap: () {
                        // TODO: call chatbotService.speak(message.text)
                      },
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.volume_up_rounded,
                            size: 18,
                            color: AppColors.featureChatbot,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Read aloud',
                            style: AppTextStyles.caption.copyWith(
                              color: AppColors.featureChatbot,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),

          // User avatar (right)
          if (isUser) ...[
            const SizedBox(width: AppConstants.spaceS),
            Container(
              width: 36,
              height: 36,
              decoration: const BoxDecoration(
                color: AppColors.primarySurface,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.person_rounded,
                color: AppColors.primary,
                size: 20,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _ThinkingBubble — animated "…" while AI is responding.
// ─────────────────────────────────────────────────────────────
class _ThinkingBubble extends StatelessWidget {
  const _ThinkingBubble();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppConstants.spaceM),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: const BoxDecoration(
              color: AppColors.featureChatbotSurface,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.smart_toy_rounded,
              color: AppColors.featureChatbot,
              size: 20,
            ),
          ),
          const SizedBox(width: AppConstants.spaceS),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spaceL,
              vertical: AppConstants.spaceM,
            ),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(AppConstants.radiusL),
            ),
            child: Text(
              AppStrings.chatbotThinking,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textHint,
                fontStyle: FontStyle.italic,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _SuggestionChips — quick-tap questions shown at session start.
// ─────────────────────────────────────────────────────────────
class _SuggestionChips extends StatelessWidget {
  const _SuggestionChips({required this.onTap});

  final ValueChanged<String> onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      padding: const EdgeInsets.symmetric(horizontal: AppConstants.screenPadding),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: AppStrings.chatbotSuggestions.length,
        separatorBuilder: (_, __) => const SizedBox(width: AppConstants.spaceS),
        itemBuilder: (context, i) {
          final question = AppStrings.chatbotSuggestions[i];
          return ActionChip(
            label: Text(question),
            labelStyle: AppTextStyles.labelMedium.copyWith(
              color: AppColors.featureChatbot,
            ),
            backgroundColor: AppColors.featureChatbotSurface,
            side: BorderSide(
              color: AppColors.featureChatbot.withOpacity(0.4),
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spaceM,
              vertical: AppConstants.spaceS,
            ),
            onPressed: () => onTap(question),
          );
        },
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  _InputBar — text field + mic + send button.
// ─────────────────────────────────────────────────────────────
class _InputBar extends StatelessWidget {
  const _InputBar({
    required this.controller,
    required this.isListening,
    required this.onSend,
    required this.onMicTap,
  });

  final TextEditingController controller;
  final bool isListening;
  final ValueChanged<String> onSend;
  final VoidCallback onMicTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.fromLTRB(
        AppConstants.screenPadding,
        AppConstants.spaceM,
        AppConstants.screenPadding,
        AppConstants.spaceL,
      ),
      child: Row(
        children: [
          // ── Mic button ────────────────────────────────────
          GestureDetector(
            onTap: onMicTap,
            child: AnimatedContainer(
              duration: AppConstants.animMedium,
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: isListening
                    ? AppColors.featureChatbot
                    : AppColors.featureChatbotSurface,
                shape: BoxShape.circle,
              ),
              child: Icon(
                isListening ? Icons.mic_rounded : Icons.mic_none_rounded,
                color: isListening
                    ? AppColors.white
                    : AppColors.featureChatbot,
                size: AppConstants.iconM,
              ),
            ),
          ),
          const SizedBox(width: AppConstants.spaceM),

          // ── Text input ────────────────────────────────────
          Expanded(
            child: TextField(
              controller: controller,
              style: AppTextStyles.bodyMedium,
              minLines: 1,
              maxLines: 3,
              textInputAction: TextInputAction.send,
              onSubmitted: onSend,
              decoration: InputDecoration(
                hintText: AppStrings.chatbotInputHint,
                hintStyle: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textHint,
                ),
                filled: true,
                fillColor: AppColors.background,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: AppConstants.spaceL,
                  vertical: AppConstants.spaceM,
                ),
                border: OutlineInputBorder(
                  borderRadius:
                      BorderRadius.circular(AppConstants.radiusFull),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: AppConstants.spaceM),

          // ── Send button ───────────────────────────────────
          GestureDetector(
            onTap: () => onSend(controller.text),
            child: Container(
              width: 56,
              height: 56,
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.send_rounded,
                color: AppColors.white,
                size: AppConstants.iconM,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
