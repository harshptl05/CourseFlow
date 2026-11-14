import { StyleSheet, TouchableOpacity, View, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { UNREAD_NOTIFICATION_COUNT } from '@/app/notifications';
import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import { getInitials, useCourseFlowDB } from '@/db/store';

function getFormattedDate(): string {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const monthDay = now
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    .toUpperCase();
  return `${weekday},\n${monthDay}`;
}

export function CourseFlowHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userProfile } = useCourseFlowDB();

  const initials = getInitials(userProfile.name);
  const dateLabel = getFormattedDate();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
      {/* --- Left Brand & Dynamic Date --- */}
      <View style={styles.brandRow}>
        <Feather name="Columns" size={20} color={Colors.primary} style={styles.logoIcon} />
        <View>
          <ThemedText type="title" style={styles.brandTitle}>
            CourseFlow
          </ThemedText>
          <ThemedText type="caption" color="muted" style={styles.dateText}>
            {dateLabel}
          </ThemedText>
        </View>
      </View>

      {/* --- Right Actions (Missing Wrapper Fixed Here) --- */}
      <View style={styles.actionsRow}>
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

        <TouchableOpacity
          style={styles.avatarBadge}
          activeOpacity={0.8}
          onPress={() => router.push('/settings')}
        >
          <ThemedText type="label" style={{ color: Colors.primary }}>
            {initials}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/search')}
          style={styles.iconBtn}
        >
          <Feather name="search" size={18} color={Colors.muted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.gutter,
    paddingBottom: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoIcon: {
    marginRight: 2,
  },
  brandTitle: {
    fontSize: 22,
    lineHeight: 26,
  },
  dateText: {
    letterSpacing: 0.6,
    lineHeight: 16,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBtn: {
    padding: 4,
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
  avatarBadge: {
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});