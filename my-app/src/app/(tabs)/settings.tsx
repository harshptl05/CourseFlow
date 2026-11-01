import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';

const INITIAL_INTERESTS = [
  { id: 'ml', name: 'Machine Learning', enabled: true },
  { id: 'se', name: 'Software Engineering', enabled: true },
  { id: 'stat', name: 'Statistics', enabled: true },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'main' | 'interests'>('main');

  const SETTINGS_LINKS = [
    { label: 'Notifications', onPress: () => {} },
    { label: 'Daily Brief preferences', onPress: () => {} },
    { label: 'Content interests', onPress: () => setActiveView('interests') },
    { label: 'Manage courses', onPress: () => router.push('/courses') },
    { label: 'Account', onPress: () => {} },
  ];

  if (activeView === 'interests') {
    return (
      <View style={styles.screen}>
        {/* --- Sub-header --- */}
        <View style={styles.subHeader}>
          <TouchableOpacity
            onPress={() => setActiveView('main')}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={20} color={Colors.primary} />
            <ThemedText type="label" style={styles.headerTitle}>
              Content interests
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* --- Content Interest Cards --- */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.interestList}>
            {INITIAL_INTERESTS.map((item) => (
              <View key={item.id} style={styles.interestCard}>
                <ThemedText type="label">{item.name}</ThemedText>

                <View style={styles.toggleBtn}>
                  <ThemedText type="label" style={{ color: Colors.primary }}>
                    On
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

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
            onPress={item.onPress}
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
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.gutter,
    paddingTop: Spacing.sm,
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
  interestList: {
    gap: Spacing.lg,
  },
  interestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleBtn: {
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});