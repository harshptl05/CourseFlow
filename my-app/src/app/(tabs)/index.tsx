import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { CourseCard, type CourseCardProps } from '@/components/course-card';
import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Spacing } from '@/constants/theme';

const COURSES: CourseCardProps[] = [
  {
    code: 'CS 4375',
    icon: require('@/assets/icons/course-ml.svg'),
    resourceCount: '1 resource',
    suggestedReads: '• 5 suggested reads',
    surface: 'tint',
  },
  {
    code: 'CS 3354',
    icon: require('@/assets/icons/course-code.svg'),
    resourceCount: '1 resource',
    suggestedReads: '• 3 suggested reads',
    surface: 'cream',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      
      {/* --- Header --- */}
      <View style={styles.header}>
        <View>
          <ThemedText type="label" style={styles.brandTitle}>CourseFlow</ThemedText>
          <ThemedText type="caption" color="muted">MONDAY, OCTOBER 26</ThemedText>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
            <Feather name="bell" size={20} color={Colors.ink} />
          </TouchableOpacity>

          <View style={styles.avatarBadge}>
            <ThemedText type="label" style={styles.avatarText}>AA</ThemedText>
          </View>

          {/* Search Button connected to /search route */}
          <Link href="/search" asChild>
            <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
              <Feather name="search" size={20} color={Colors.ink} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.intro}>
        <ThemedText type="caption" color="muted">
          Curated for your classroom
        </ThemedText>
        <ThemedText type="display">{'Your reading,\nthoughtfully curated.'}</ThemedText>
      </View>

      <ThemedText type="label">For your courses</ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.courses}>
        {COURSES.map((course) => (
          <CourseCard key={course.code} {...course} />
        ))}
      </ScrollView>
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
    paddingTop: 60, // Adjusted to clear the top safe area
    paddingBottom: 28,
    gap: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EAEFFD', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.primary,
  },
  intro: {
    gap: Spacing.sm,
  },
  courses: {
    gap: 10,
  },
});