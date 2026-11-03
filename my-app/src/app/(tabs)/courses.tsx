import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

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
  const { savedResources, courseAssignments, courses, addCourse } = useSaved();
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const courseCodes = Array.from(
    new Set([
      ...DEFAULT_COURSES,
      ...savedResources.map((resource) => resource.courseCode),
      ...Object.values(courseAssignments),
      ...courses.map((course) => course.id),
    ]),
  );

  const resetCourseForm = () => {
    setTitle('');
    setCourseId('');
    setDescription('');
    setFormError('');
  };

  const handleAddCourse = () => {
    const trimmedTitle = title.trim();
    const trimmedCourseId = courseId.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedCourseId || !trimmedDescription) {
      setFormError('Enter a title, course ID, and description.');
      return;
    }

    if (courseCodes.some((code) => code.toLowerCase() === trimmedCourseId.toLowerCase())) {
      setFormError('A course with this ID already exists.');
      return;
    }

    addCourse({
      id: trimmedCourseId,
      title: trimmedTitle,
      description: trimmedDescription,
    });
    resetCourseForm();
    setShowAddCourse(false);
  };

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
        <Pressable
          style={styles.addCourseButton}
          accessibilityRole="button"
          onPress={() => setShowAddCourse(true)}>
          <Feather name="plus" size={17} color={Colors.white} />
          <ThemedText type="label" style={styles.addCourseButtonText}>
            Add course
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.courseList}>
        {courseCodes.map((courseCode) => {
          const course = courses.find((item) => item.id === courseCode);
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
                    {course?.title ??
                      COURSE_NAMES[courseCode] ??
                      'Course materials'}
                  </ThemedText>
                </View>
                <ThemedText type="caption" color="muted">
                  {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
                </ThemedText>
              </View>

              {course?.description ? (
                <ThemedText type="body" color="muted" style={styles.courseDescription}>
                  {course.description}
                </ThemedText>
              ) : null}

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

      <Modal
        visible={showAddCourse}
        transparent
        animationType="fade"
        onRequestClose={() => {
          resetCourseForm();
          setShowAddCourse(false);
        }}>
        <View style={styles.modalBackdrop}>
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <ThemedText type="title">Add a course</ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close add course form"
                hitSlop={10}
                onPress={() => {
                  resetCourseForm();
                  setShowAddCourse(false);
                }}>
                <Feather name="x" size={20} color={Colors.muted} />
              </Pressable>
            </View>

            <ThemedText type="caption" color="muted">Course title</ThemedText>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Introduction to Biology"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              accessibilityLabel="Course title"
              returnKeyType="next"
            />

            <ThemedText type="caption" color="muted">Course ID</ThemedText>
            <TextInput
              value={courseId}
              onChangeText={setCourseId}
              placeholder="e.g. BIOL 1301"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              accessibilityLabel="Course ID"
              autoCapitalize="characters"
              returnKeyType="next"
            />

            <ThemedText type="caption" color="muted">Description</ThemedText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What is this course about?"
              placeholderTextColor={Colors.muted}
              style={[styles.input, styles.descriptionInput]}
              accessibilityLabel="Course description"
              multiline
              textAlignVertical="top"
            />

            {formError ? (
              <ThemedText type="caption" style={styles.formError}>
                {formError}
              </ThemedText>
            ) : null}

            <Pressable
              style={styles.submitButton}
              accessibilityRole="button"
              onPress={handleAddCourse}>
              <ThemedText type="label" style={styles.addCourseButtonText}>
                Save course
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  addCourseButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minHeight: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  addCourseButtonText: {
    color: Colors.white,
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
  courseDescription: {
    marginTop: Spacing.md,
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
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: Layout.gutter,
    backgroundColor: 'rgba(32, 33, 42, 0.4)',
  },
  formCard: {
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    backgroundColor: Colors.bg,
    gap: Spacing.sm,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  input: {
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    color: Colors.ink,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  descriptionInput: {
    minHeight: 90,
  },
  formError: {
    color: '#b42318',
  },
  submitButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
});
