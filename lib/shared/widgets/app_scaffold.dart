// ─────────────────────────────────────────────────────────────
//  shared/widgets/app_scaffold.dart — Shared Screen Scaffold
//
//  A wrapper around Scaffold that applies Memento's consistent
//  screen chrome (AppBar, background, padding) so every feature
//  screen looks cohesive without copy-pasting boilerplate.
//
//  Usage:
//    AppScaffold(
//      title: 'My Screen',
//      child: ...,
//    )
// ─────────────────────────────────────────────────────────────

import 'package:flutter/material.dart';

import 'package:memento/core/theme/app_colors.dart';
import 'package:memento/core/theme/app_text_styles.dart';
import 'package:memento/core/constants/app_constants.dart';

class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.title,
    required this.child,
    this.subtitle,
    this.actions,
    this.floatingActionButton,
    this.padding,
    this.backgroundColor,
    this.showBackButton = false,
  });

  /// Screen title shown in the AppBar.
  final String title;

  /// Optional subtitle shown below the title inside the body.
  final String? subtitle;

  /// AppBar trailing action buttons.
  final List<Widget>? actions;

  /// Optional FAB.
  final Widget? floatingActionButton;

  /// Body content. Wrap in SingleChildScrollView if needed.
  final Widget child;

  /// Override default screen padding.
  final EdgeInsets? padding;

  /// Override default scaffold background.
  final Color? backgroundColor;

  /// Show a back button instead of the default leading widget.
  final bool showBackButton;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor ?? AppColors.background,
      appBar: AppBar(
        backgroundColor: backgroundColor ?? AppColors.background,
        elevation: 0,
        automaticallyImplyLeading: showBackButton,
        leading: showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded),
                iconSize: AppConstants.iconM,
                onPressed: () => Navigator.of(context).maybePop(),
              )
            : null,
        titleSpacing: showBackButton ? 0 : AppConstants.screenPadding,
        title: Text(title, style: AppTextStyles.headlineMedium),
        actions: [
          ...?actions,
          const SizedBox(width: 8),
        ],
      ),
      floatingActionButton: floatingActionButton,
      body: SafeArea(
        child: Padding(
          padding: padding ??
              const EdgeInsets.symmetric(
                horizontal: AppConstants.screenPadding,
              ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Optional subtitle
              if (subtitle != null) ...[
                const SizedBox(height: AppConstants.spaceS),
                Text(subtitle!, style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                )),
                const SizedBox(height: AppConstants.spaceL),
              ] else
                const SizedBox(height: AppConstants.spaceM),

              // Main content
              Expanded(child: child),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  SectionHeader — used to label sections within a screen.
// ─────────────────────────────────────────────────────────────
class SectionHeader extends StatelessWidget {
  const SectionHeader(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(
        bottom: AppConstants.spaceM,
        top: AppConstants.spaceL,
      ),
      child: Text(text, style: AppTextStyles.headlineSmall),
    );
  }
}

// ─────────────────────────────────────────────────────────────
//  MementoCard — a styled container (replaces raw Container).
// ─────────────────────────────────────────────────────────────
class MementoCard extends StatelessWidget {
  const MementoCard({
    super.key,
    required this.child,
    this.padding,
    this.color,
    this.borderRadius,
    this.onTap,
  });

  final Widget child;
  final EdgeInsets? padding;
  final Color? color;
  final double? borderRadius;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final container = Container(
      decoration: BoxDecoration(
        color: color ?? AppColors.surface,
        borderRadius:
            BorderRadius.circular(borderRadius ?? AppConstants.radiusL),
        boxShadow: const [
          BoxShadow(
            color: AppColors.shadow,
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      padding: padding ?? const EdgeInsets.all(AppConstants.cardPadding),
      child: child,
    );

    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: container);
    }
    return container;
  }
}
