import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';

export default function SettingsScreen() {
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
    backgroundColor: '#F5EFE6', // Warm cream surface matching your course cards
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
});