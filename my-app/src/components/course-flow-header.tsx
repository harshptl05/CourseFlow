import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UNREAD_NOTIFICATION_COUNT } from '@/app/notifications';
import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';

function formatHeaderDate(date: Date) {
  return date
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase();
}

export function CourseFlowHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
      <Image
        source={require('@/assets/icons/logo.svg')}
        style={styles.logo}
        contentFit="contain"
      />

      <View style={styles.wordmark}>
        <ThemedText type="title">CourseFlow</ThemedText>
        <ThemedText type="caption" color="muted">
          {formatHeaderDate(new Date())}
        </ThemedText>
      </View>

      <Link href="/notifications" asChild>
        <Pressable
          style={styles.action}
          accessibilityRole="button"
          accessibilityLabel={
            UNREAD_NOTIFICATION_COUNT > 0
              ? `Notifications, ${UNREAD_NOTIFICATION_COUNT} unread`
              : 'Notifications'
          }>
          <Image
            source={require('@/assets/icons/bell.svg')}
            style={styles.actionIcon}
            contentFit="contain"
          />
          {UNREAD_NOTIFICATION_COUNT > 0 ? <View style={styles.badge} /> : null}
        </Pressable>
      </Link>

      <Pressable style={styles.avatar} accessibilityRole="button" accessibilityLabel="Your profile">
        <ThemedText type="label" color="primary">
          HP
        </ThemedText>
      </Pressable>

      <Link href="/search" asChild>
        <Pressable style={styles.action} accessibilityRole="button" accessibilityLabel="Search">
          <Image
            source={require('@/assets/icons/search.svg')}
            style={styles.actionIcon}
            contentFit="contain"
          />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Layout.gutter,
    paddingBottom: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  logo: {
    width: 26,
    height: 26,
  },
  wordmark: {
    flex: 1,
  },
  action: {
    width: Layout.touchTarget,
    height: Layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 22,
    height: 22,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.bg,
    backgroundColor: Colors.primary,
  },
  avatar: {
    width: Layout.touchTarget,
    height: Layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.tint,
  },
});
