import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';

const SETTINGS_LINKS = [
  { label: 'Notifications', route: null },
  { label: 'Daily Brief preferences', route: null },
  { label: 'Content interests', route: null },
  { label: 'Manage courses', route: '/courses' as const },
  { label: 'Account', route: null },
];

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="title">Settings</ThemedText>

      {/* --- Profile Card --- */}
      <View style={styles.profileCard}>
        <ThemedText type="display" style={styles.initials}>
          HP
        </ThemedText>
        <ThemedText type="title" style={styles.name}>
          Harsh Patel
        </ThemedText>
        <ThemedText type="caption" color="muted">
          Your teaching workspace
        </ThemedText>
      </View>

      {/* --- Settings Menu Links --- */}
      <View style={styles.menuList}>
        {SETTINGS_LINKS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              if (item.route) {
                router.push(item.route);
              }
            }}
          >
            <ThemedText type="label" style={{ color: Colors.primary }}>
              {item.label}
            </ThemedText>
            <Feather name="arrow-right" size={16} color={Colors.primary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* --- Footer Tagline --- */}
      <ThemedText type="caption" color="muted" style={styles.footerText}>
        CourseFlow · A considered reading habit.
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingHorizontal: Layout.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
    gap: Spacing.xl,
  },
  profileCard: {
    backgroundColor: '#F5EFE6',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  initials: {
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  name: {
    marginBottom: 2,
  },
  menuList: {
    alignItems: 'center',
    gap: Spacing.xl + Spacing.sm,
    marginVertical: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  footerText: {
    marginTop: Spacing.sm,
  },
});