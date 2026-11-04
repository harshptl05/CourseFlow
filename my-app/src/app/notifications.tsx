import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';

type NotificationKind = 'resource' | 'course' | 'reminder';

interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  courseCode?: string;
  timeAgo: string;
  group: 'Today' | 'Earlier this week';
  unread: boolean;
}

const ICONS: Record<NotificationKind, keyof typeof Feather.glyphMap> = {
  resource: 'file-text',
  course: 'folder',
  reminder: 'clock',
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'new-ml-paper',
    kind: 'resource',
    title: '3 new papers for CS 4375',
    body: 'Fresh arXiv results on transformer efficiency matched your machine learning reading history.',
    courseCode: 'CS 4375',
    timeAgo: '2h ago',
    group: 'Today',
    unread: true,
  },
  {
    id: 'stat-digest',
    kind: 'resource',
    title: 'Tidy Data is trending in your field',
    body: 'Saved by 40 other students in STAT 3355 this week. Add it to your reading list before the midterm.',
    courseCode: 'STAT 3355',
    timeAgo: '5h ago',
    group: 'Today',
    unread: true,
  },
  {
    id: 'folder-ready',
    kind: 'course',
    title: 'CS 3354 folder is ready',
    body: 'Your software engineering folder now has 3 suggested reads grouped by topic.',
    courseCode: 'CS 3354',
    timeAgo: '1d ago',
    group: 'Earlier this week',
    unread: false,
  },
  {
    id: 'reading-reminder',
    kind: 'reminder',
    title: 'You have 2 unread saves',
    body: 'Pick up where you left off in your reading list.',
    timeAgo: '3d ago',
    group: 'Earlier this week',
    unread: false,
  },
];

export const UNREAD_NOTIFICATION_COUNT = NOTIFICATIONS.filter((item) => item.unread).length;

const GROUPS: NotificationItem['group'][] = ['Today', 'Earlier this week'];

export default function NotificationsScreen() {
  const router = useRouter();
  const [readIds, setReadIds] = useState<string[]>([]);

  const isUnread = (item: NotificationItem) => item.unread && !readIds.includes(item.id);
  const unreadCount = NOTIFICATIONS.filter(isUnread).length;

  const markAllRead = () => setReadIds(NOTIFICATIONS.map((item) => item.id));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Feather name="chevron-left" size={20} color={Colors.primary} />
          <ThemedText type="label" style={styles.headerTitle}>
            Notifications
          </ThemedText>
        </Pressable>

        {unreadCount > 0 ? (
          <Pressable
            onPress={markAllRead}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read">
            <ThemedText type="label" style={styles.markAll}>
              Mark all read
            </ThemedText>
          </Pressable>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <ThemedText type="caption" color="muted">
            {unreadCount > 0 ? `${unreadCount} UNREAD` : 'ALL CAUGHT UP'}
          </ThemedText>
          <ThemedText type="display">What&apos;s new for your courses</ThemedText>
        </View>

        {GROUPS.map((group) => {
          const items = NOTIFICATIONS.filter((item) => item.group === group);

          if (items.length === 0) {
            return null;
          }

          return (
            <View key={group} style={styles.group}>
              <ThemedText type="label" color="muted">
                {group}
              </ThemedText>

              <View style={styles.list}>
                {items.map((item) => (
                  <Pressable
                    key={item.id}
                    style={[styles.card, isUnread(item) && styles.cardUnread]}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                    onPress={() => setReadIds((current) => [...current, item.id])}>
                    <View style={styles.iconBadge}>
                      <Feather name={ICONS[item.kind]} size={16} color={Colors.primary} />
                    </View>

                    <View style={styles.cardBody}>
                      <View style={styles.cardTop}>
                        <ThemedText type="label" style={styles.cardTitle}>
                          {item.title}
                        </ThemedText>
                        {isUnread(item) ? <View style={styles.unreadDot} /> : null}
                      </View>

                      <ThemedText type="body" color="muted">
                        {item.body}
                      </ThemedText>

                      <View style={styles.cardMeta}>
                        <ThemedText type="caption" color="muted">
                          {item.timeAgo}
                        </ThemedText>
                        {item.courseCode ? (
                          <ThemedText type="caption" style={styles.courseTag}>
                            {item.courseCode}
                          </ThemedText>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}

        <Pressable
          style={styles.exploreButton}
          accessibilityRole="button"
          onPress={() => router.push('/search')}>
          <ThemedText type="label" style={styles.exploreButtonText}>
            Explore more resources
          </ThemedText>
          <Feather name="arrow-right" size={16} color={Colors.white} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.gutter,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    marginLeft: 4,
  },
  markAll: {
    color: Colors.primary,
  },
  content: {
    paddingHorizontal: Layout.gutter,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
    gap: Spacing.xl,
  },
  intro: {
    gap: Spacing.sm,
  },
  group: {
    gap: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  cardUnread: {
    borderColor: Colors.primary,
    backgroundColor: Colors.tint,
  },
  iconBadge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    backgroundColor: Colors.bg,
  },
  cardBody: {
    flex: 1,
    gap: Spacing.xs,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  courseTag: {
    color: Colors.primary,
  },
  exploreButton: {
    minHeight: Layout.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  exploreButtonText: {
    color: Colors.white,
  },
});
