import { ScrollView, StyleSheet, View } from 'react-native';

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
    paddingTop: Spacing.md,
    paddingBottom: 28,
    gap: Spacing.xl,
  },
  intro: {
    gap: Spacing.sm,
  },
  courses: {
    gap: 10,
  },
});