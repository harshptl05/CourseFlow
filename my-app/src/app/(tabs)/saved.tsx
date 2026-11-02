import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import { useSaved } from '@/context/SavedContext';

export default function SavedScreen() {
  const router = useRouter();
  const { savedResources, courseAssignments, addResourceToCourse } = useSaved();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.intro}>
        <ThemedText type="caption" color="muted">
          YOUR READING LIST
        </ThemedText>
        <ThemedText type="display">Saved resources</ThemedText>
        <ThemedText type="body" color="muted">
          Keep useful material close and add it to the course folder where it belongs.
        </ThemedText>
      </View>

      {savedResources.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="bookmark" size={24} color={Colors.primary} />
          <ThemedText type="title">Your list is waiting</ThemedText>
          <ThemedText type="body" color="muted" style={styles.emptyDescription}>
            Save a resource from Explore to add it to a course folder.
          </ThemedText>
          <Pressable
            style={styles.primaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/search')}>
            <ThemedText type="label" style={styles.primaryButtonText}>
              Explore resources
            </ThemedText>
            <Feather name="arrow-right" size={16} color={Colors.white} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.resourceList}>
          {savedResources.map((resource) => {
            const assignedCourse = courseAssignments[resource.id];
            const isAssigned = Boolean(assignedCourse);

            return (
              <View key={resource.id} style={styles.resourceCard}>
                <ThemedText type="meta" color="muted" style={styles.category}>
                  {resource.category}
                </ThemedText>
                <ThemedText type="title" style={styles.resourceTitle}>
                  {resource.title}
                </ThemedText>
                <ThemedText type="body" color="muted">
                  {resource.description}
                </ThemedText>
                <View style={styles.resourceMeta}>
                  <ThemedText type="caption" color="muted">
                    {resource.dateInfo}
                  </ThemedText>
                  <ThemedText type="caption" style={styles.relevance}>
                    Relevant to {resource.courseCode}
                  </ThemedText>
                </View>
                <Pressable
                  style={[styles.primaryButton, isAssigned && styles.assignedButton]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isAssigned
                      ? `View ${resource.title} in ${assignedCourse}`
                      : `Add ${resource.title} to ${resource.courseCode}`
                  }
                  onPress={() => {
                    if (assignedCourse) {
                      router.navigate('/(tabs)/courses');
                    } else {
                      addResourceToCourse(resource.id, resource.courseCode);
                    }
                  }}>
                  <ThemedText type="label" style={styles.primaryButtonText}>
                    {assignedCourse
                      ? `Added to ${assignedCourse} · View folder`
                      : `Add to ${resource.courseCode} folder`}
                  </ThemedText>
                  <Feather
                    name={isAssigned ? 'check' : 'folder-plus'}
                    size={16}
                    color={Colors.white}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
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
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    gap: Spacing.md,
  },
  emptyDescription: {
    textAlign: 'center',
  },
  resourceList: {
    gap: Spacing.lg,
  },
  resourceCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  category: {
    letterSpacing: 0.5,
  },
  resourceTitle: {
    lineHeight: 26,
  },
  resourceMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  relevance: {
    color: Colors.primary,
  },
  primaryButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  assignedButton: {
    backgroundColor: Colors.accent,
  },
  primaryButtonText: {
    color: Colors.white,
  },
});
