import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState, type ReactNode } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { Article } from '@/data/articles';

type Accent = { fg: string; bg: string };

const PUBLISHER_ACCENTS: Record<string, Accent> = {
  AJMC: { fg: '#1f6f6b', bg: '#e6f2f1' },
  BIOENGINEER: { fg: '#2f6b3a', bg: '#e8f2e9' },
  ETCIO: { fg: '#9a5410', bg: '#fbeedd' },
  FORBES: { fg: '#2b2f3a', bg: '#ebecef' },
  TECHXPLORE: { fg: '#2a52a8', bg: '#e8eefb' },
  ARXIV: { fg: '#a32020', bg: '#fae9e9' },
};

const DEFAULT_ACCENT: Accent = { fg: Colors.primary, bg: Colors.tint };

const KIND_ICONS = {
  news: 'file-text',
  research: 'book-open',
} as const;

function splitSource(article: Article) {
  const [publisher, kindLabel] = article.source.split('·').map((part) => part.trim());

  return {
    publisher,
    kindLabel: kindLabel ?? article.kind.toUpperCase(),
    accent: PUBLISHER_ACCENTS[publisher] ?? DEFAULT_ACCENT,
  };
}

export function openArticle(article: Article) {
  Linking.openURL(article.url).catch(() => {
    // The link stays unopened if no browser can handle it
  });
}

function ArticleThumbnail({ article, accent }: { article: Article; accent: Accent }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (article.imageUrl && !imageFailed) {
    return (
      <View style={styles.thumbnail}>
        <Image
          source={{ uri: article.imageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          onError={() => setImageFailed(true)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.thumbnail, styles.thumbnailFallback, { backgroundColor: accent.bg }]}>
      <Feather name={KIND_ICONS[article.kind]} size={24} color={accent.fg} />
    </View>
  );
}

export function ArticleCard({
  article,
  actions,
}: {
  article: Article;
  actions?: ReactNode;
}) {
  const { publisher, kindLabel, accent } = splitSource(article);

  return (
    <View style={styles.card}>
      <View style={styles.sourceRow}>
        <View style={[styles.publisherPill, { backgroundColor: accent.bg }]}>
          <ThemedText type="meta" style={[styles.publisherName, { color: accent.fg }]}>
            {publisher}
          </ThemedText>
        </View>
        <ThemedText type="meta" color="muted" style={styles.kindLabel}>
          {kindLabel}
        </ThemedText>
      </View>

      <Pressable
        style={({ pressed }) => [styles.headline, pressed && styles.headlinePressed]}
        accessibilityRole="link"
        accessibilityLabel={`Open ${article.title}`}
        onPress={() => openArticle(article)}>
        <ThemedText type="title" style={styles.title}>
          {article.title}
        </ThemedText>
        <ArticleThumbnail article={article} accent={accent} />
      </Pressable>

      <ThemedText type="body" color="muted">
        {article.summary}
      </ThemedText>

      <ThemedText type="caption" color="muted">
        {article.dateInfo} · {article.readTime}
      </ThemedText>

      <View style={styles.footer}>
        <ThemedText type="caption" style={styles.relevance}>
          Relevant to {article.courseCode}
        </ThemedText>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Read ${article.title}`}
            hitSlop={8}
            onPress={() => openArticle(article)}>
            <View style={styles.readAction}>
              <ThemedText type="label" style={styles.actionText}>
                Read
              </ThemedText>
              <Feather name="external-link" size={14} color={Colors.primary} />
            </View>
          </Pressable>
          {actions}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  publisherPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  publisherName: {
    letterSpacing: 0.6,
  },
  kindLabel: {
    letterSpacing: 0.6,
  },
  headline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  headlinePressed: {
    opacity: 0.6,
  },
  title: {
    flex: 1,
    fontSize: 19,
    lineHeight: 26,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.tint,
  },
  thumbnailFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  relevance: {
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  readAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionText: {
    color: Colors.primary,
  },
});
