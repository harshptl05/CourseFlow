import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

      <Pressable
        style={styles.action}
        accessibilityRole="button"
        accessibilityLabel="Notifications">
        <Image
          source={require('@/assets/icons/bell.svg')}
          style={styles.actionIcon}
          contentFit="contain"
        />
      </Pressable>

      <Pressable style={styles.avatar} accessibilityRole="button" accessibilityLabel="Your profile">
        <ThemedText type="label" color="primary">
          HP
        </ThemedText>
      </Pressable>

      <Pressable style={styles.action} accessibilityRole="button" accessibilityLabel="Search">
        <Image
          source={require('@/assets/icons/search.svg')}
          style={styles.actionIcon}
          contentFit="contain"
        />
      </Pressable>
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
  avatar: {
    width: Layout.touchTarget,
    height: Layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.tint,
  },
});
