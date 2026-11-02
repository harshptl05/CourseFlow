import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import { useSaved } from '@/context/SavedContext';

const COURSE_NAMES: Record<string, string> = {
  'CS 4375': 'Machine Learning',
  'CS 3354': 'Software Engineering',
  'STAT 3355': 'Statistics',
};

const DEFAULT_COURSES = ['CS 4375', 'CS 3354', 'STAT 3355'];

export default function CoursesScreen() {
  const { savedResources, courseAssignments } = useSaved();
  const courseCodes = Array.from(
    new Set([
      ...DEFAULT_COURSES,
      ...savedResources.map((resource) => resource.courseCode),
      ...Object.values(courseAssignments),
    ]),
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.intro}>
        <ThemedText type="caption" color="muted">
          YOUR LEARNING LIBRARY
        </ThemedText>
        <ThemedText type="display">Your courses</ThemedText>
        <ThemedText type="body" color="muted">
          Materials you add are organized in their course folders.
        </ThemedText>
      </View>

      <View style={styles.courseList}>
        {courseCodes.map((courseCode) => {
          const resources = savedResources.filter(
            (resource) => courseAssignments[resource.id] === courseCode,
          );

          return (
            <View key={courseCode} style={styles.courseFolder}>
              <View style={styles.courseHeader}>
                <View style={styles.folderIcon}>
                  <Feather name="folder" size={18} color={Colors.primary} />
                </View>
                <View style={styles.courseHeading}>
                  <ThemedText type="label">{courseCode}</ThemedText>
                  <ThemedText type="caption" color="muted">
                    {COURSE_NAMES[courseCode] ?? 'Course materials'}
                  </ThemedText>
                </View>
                <ThemedText type="caption" color="muted">
                  {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
                </ThemedText>
              </View>

              {resources.length > 0 ? (
                <View style={styles.materialList}>
                  {resources.map((resource) => (
                    <View key={resource.id} style={styles.material}>
                      <Feather name="file-text" size={17} color={Colors.accent} />
                      <View style={styles.materialContent}>
                        <ThemedText type="label" style={styles.materialTitle}>
                          {resource.title}
                        </ThemedText>
                        <ThemedText type="meta" color="muted">
                          {resource.category} · {resource.dateInfo}
                        </ThemedText>
                      </View>
                      <Feather name="check-circle" size={17} color={Colors.primary} />
                    </View>
                  ))}
                </View>
              ) : (
                <ThemedText type="caption" color="muted" style={styles.emptyFolder}>
                  No materials in this folder yet.
                </ThemedText>
              )}
            </View>
          );
        })}
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
  intro: {
    gap: Spacing.sm,
  },
  courseList: {
    gap: Spacing.md,
  },
  courseFolder: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  folderIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.tint,
  },
  courseHeading: {
    flex: 1,
  },
  materialList: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  material: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingTop: Spacing.md,
  },
  materialContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  materialTitle: {
    lineHeight: 21,
  },
  emptyFolder: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
