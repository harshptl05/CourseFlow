import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  type TextInputInstance,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { CourseCard, type CourseCardProps } from '@/components/course-card';
import { ThemedText } from '@/components/themed-text';
import { COURSE_NAMES, getCourseCodes } from '@/constants/courses';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import { useSaved, type Resource } from '@/context/SavedContext';

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

interface ResourceItem {
  id: string;
  sourceTag: string;
  title: string;
  description: string;
  dateMeta: string;
  courseTag: string;
  courseCode: string;
}

const STATISTICS_RESOURCES: ResourceItem[] = [
  {
    id: 'tidy-data',
    sourceTag: 'JOURNAL OF STATISTICAL SOFTWARE',
    title: 'Tidy Data',
    description:
      'Wickham presents a consistent structure for analysis-ready datasets. Organizing observations, variables and observational units makes data easier to reshape, model and visualize.',
    dateMeta: 'Sep 12, 2014',
    courseTag: 'Relevant to STAT 3355',
    courseCode: 'STAT 3355',
  },
  {
    id: 'conformal-prediction',
    sourceTag: 'ARXIV',
    title:
      'A Gentle Introduction to Conformal Prediction and Distribution-Free Uncertainty Quantification',
    description:
      'This tutorial introduces prediction sets and intervals that quantify uncertainty around model outputs. It combines practical theory with worked examples and Python notebooks.',
    dateMeta: 'Jul 15, 2021',
    courseTag: 'Relevant to STAT 3355',
    courseCode: 'STAT 3355',
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const {
    saveResource,
    removeResource,
    addResourceToCourse,
    isResourceInCourse,
    isResourceSaved,
    savedResources,
    courseAssignments,
    courses,
  } = useSaved();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'research'>('all');
  const [justSavedItem, setJustSavedItem] = useState<Resource | null>(null);
  const [courseSearch, setCourseSearch] = useState('');
  const courseSearchRef = useRef<TextInputInstance>(null);

  const courseCodes = getCourseCodes(
    savedResources.map((resource) => resource.courseCode),
    courseAssignments,
    courses.map((course) => course.id),
  );
  const query = courseSearch.trim().toLocaleLowerCase();
  const matchingCourses = query
    ? courseCodes
        .map((code) => {
          const course = courses.find((item) => item.id === code);
          return {
            code,
            title: course?.title ?? COURSE_NAMES[code] ?? 'Course materials',
            description: course?.description ?? '',
          };
        })
        .filter(({ code, title, description }) =>
          `${code} ${title} ${description}`.toLocaleLowerCase().includes(query),
        )
    : [];

  const handleToggleSave = async (item: ResourceItem) => {
    if (isResourceSaved(item.id)) {
      await removeResource(item.id);
      return;
    }

    const resource: Resource = {
      id: item.id,
      title: item.title,
      category: item.sourceTag,
      description: item.description,
      courseCode: item.courseCode,
      dateInfo: item.dateMeta,
    };

    await saveResource(resource);
    setJustSavedItem(resource);
  };

  const handleAddToCourse = async (item: ResourceItem) => {
    if (!isResourceSaved(item.id)) {
      await saveResource({
        id: item.id,
        title: item.title,
        category: item.sourceTag,
        description: item.description,
        courseCode: item.courseCode,
        dateInfo: item.dateMeta,
      });
    }

    addResourceToCourse(item.id, item.courseCode);
  };

  const openReadingList = () => {
    setJustSavedItem(null);
    router.push('/(tabs)/saved');
  };

  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.screen}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={20} color={Colors.primary} />
          <ThemedText type="label" style={styles.headerTitle}>
            {selectedTopic ?? 'Explore'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Search courses"
          onPress={() => {
            setSelectedTopic(null);
            courseSearchRef.current?.focus();
          }}>
          <Feather name="search" size={20} color={Colors.ink} />
        </TouchableOpacity>
      </View>

      {selectedTopic ? (
        /* --- Topic Results View --- */
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Active Search Pill */}
          <TouchableOpacity
            style={styles.activeSearchPill}
            activeOpacity={0.8}
            onPress={() => setSelectedTopic(null)}
          >
            <ThemedText type="label" style={{ color: Colors.primary }}>
              Search · {selectedTopic}   ×
            </ThemedText>
          </TouchableOpacity>

          {/* Filter Tabs */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'all' && styles.filterTabActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setActiveFilter('all')}
            >
              <ThemedText type="label" style={{ color: Colors.primary }}>
                All material
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === 'research' && styles.filterTabActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setActiveFilter('research')}
            >
              <ThemedText type="label" style={{ color: Colors.primary }}>
                Research only
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText type="caption" color="muted" style={styles.verifiedCount}>
            {STATISTICS_RESOURCES.length} verified resources
          </ThemedText>

          {/* Resource Cards List */}
          <View style={styles.resourceList}>
            {STATISTICS_RESOURCES.map((item) => (
              <View key={item.id} style={styles.resourceCard}>
                <ThemedText type="caption" color="muted" style={styles.sourceTag}>
                  {item.sourceTag}
                </ThemedText>

                <ThemedText type="title" style={styles.resourceTitle}>
                  {item.title}
                </ThemedText>

                <ThemedText
                  type="body"
                  color="muted"
                  style={styles.resourceDescription}
                >
                  {item.description}
                </ThemedText>

                <ThemedText type="caption" color="muted" style={styles.dateMeta}>
                  {item.dateMeta}
                </ThemedText>

                <View style={styles.resourceFooter}>
                  <ThemedText type="caption" style={{ color: Colors.primary }}>
                    {item.courseTag}
                  </ThemedText>

                  <View style={styles.resourceActions}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleToggleSave(item)}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isResourceSaved(item.id)
                          ? `Remove ${item.title} from your reading list`
                          : `Save ${item.title} to your reading list`
                      }
                    >
                      <ThemedText type="label" style={{ color: Colors.primary }}>
                        {isResourceSaved(item.id) ? 'Saved ✓' : 'Save'}
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      disabled={isResourceInCourse(item.id, item.courseCode)}
                      onPress={() => handleAddToCourse(item)}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isResourceInCourse(item.id, item.courseCode)
                          ? `${item.title} is in ${item.courseCode}`
                          : `Add ${item.title} to ${item.courseCode}`
                      }
                    >
                      <ThemedText type="label" style={{ color: Colors.primary }}>
                        {isResourceInCourse(item.id, item.courseCode) ? 'Added ✓' : 'Add'}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* --- Default Explore View --- */
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Hero Section --- */}
          <ThemedText type="display" style={styles.heroTitle}>
            Find one of your courses.
          </ThemedText>

          <View style={styles.searchPill}>
            <Feather name="search" size={18} color={Colors.muted} />
            <TextInput
              ref={courseSearchRef}
              value={courseSearch}
              onChangeText={setCourseSearch}
              placeholder="Search by course title, ID, or description"
              placeholderTextColor={Colors.muted}
              style={styles.searchInput}
              accessibilityLabel="Search your courses"
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {courseSearch.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear course search"
                hitSlop={8}
                onPress={() => setCourseSearch('')}>
                <Feather name="x-circle" size={18} color={Colors.muted} />
              </Pressable>
            ) : null}
          </View>

          {courseSearch.trim() ? (
            <View style={styles.courseSearchResults}>
              <ThemedText type="caption" color="muted">
                {matchingCourses.length === 1
                  ? '1 course found'
                  : `${matchingCourses.length} courses found`}
              </ThemedText>
              {matchingCourses.length > 0 ? (
                <View style={styles.courseResultList}>
                  {matchingCourses.map((course) => {
                    const resourceCount = savedResources.filter(
                      (resource) => courseAssignments[resource.id] === course.code,
                    ).length;

                    return (
                      <Pressable
                        key={course.code}
                        style={styles.courseResult}
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${course.title}, ${course.code}`}
                        onPress={() => router.navigate('/(tabs)/courses')}>
                        <View style={styles.courseResultIcon}>
                          <Feather name="book-open" size={18} color={Colors.primary} />
                        </View>
                        <View style={styles.courseResultText}>
                          <ThemedText type="label">{course.title}</ThemedText>
                          <ThemedText type="caption" color="muted">
                            {course.code} · {resourceCount}{' '}
                            {resourceCount === 1 ? 'resource' : 'resources'}
                          </ThemedText>
                          {course.description ? (
                            <ThemedText
                              type="caption"
                              color="muted"
                              numberOfLines={2}>
                              {course.description}
                            </ThemedText>
                          ) : null}
                        </View>
                        <Feather name="arrow-right" size={17} color={Colors.primary} />
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.noCourseResults}>
                  <ThemedText type="label">No matching courses</ThemedText>
                  <ThemedText type="caption" color="muted">
                    Search using a title, course ID, or description from Your courses.
                  </ThemedText>
                </View>
              )}
            </View>
          ) : (
            <>
              {/* --- Recent Searches --- */}
              <View style={styles.section}>
                <ThemedText type="title">Recent searches</ThemedText>
                <View style={styles.recentList}>
                  {['Machine Learning', 'Software Engineering', 'Statistics'].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.recentItem}
                      activeOpacity={0.7}
                      onPress={() => setSelectedTopic(item)}>
                      <ThemedText type="label" style={{ color: Colors.primary }}>
                        {item}
                      </ThemedText>
                      <Feather name="arrow-right" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* --- Topic Collections --- */}
              <View style={styles.section}>
                <ThemedText type="title">Topic collections</ThemedText>
                <ThemedText type="label" style={styles.subHeading}>
                  For your courses
                </ThemedText>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.coursesScroll}>
                  {COURSES.map((course) => (
                    <CourseCard key={course.code} {...course} />
                  ))}
                </ScrollView>
              </View>
            </>
          )}

        </ScrollView>
      )}

      <Modal
        visible={justSavedItem !== null}
        transparent
        animationType="none"
        onRequestClose={() => setJustSavedItem(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setJustSavedItem(null)}
        >
          <Pressable
            style={styles.bottomSheet}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.sheetHeader}>
              <ThemedText type="title" style={styles.sheetTitle}>
                Saved to your reading list
              </ThemedText>
              <TouchableOpacity
                onPress={() => setJustSavedItem(null)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Close confirmation"
              >
                <Feather name="x" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <ThemedText type="body" color="muted" style={styles.savedItemName}>
              {justSavedItem?.title}
            </ThemedText>

            <TouchableOpacity
              style={styles.viewListButton}
              onPress={openReadingList}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <ThemedText type="label" style={styles.viewListButtonText}>
                View reading list
              </ThemedText>
              <Feather name="arrow-right" size={16} color={Colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.keepReadingButton}
              onPress={() => setJustSavedItem(null)}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <ThemedText type="label" style={styles.keepReadingText}>
                Keep reading
              </ThemedText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
  content: {
    paddingHorizontal: Layout.gutter,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  heroTitle: {
    marginBottom: Spacing.lg,
  },
  searchPill: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
    minHeight: 50,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Spacing.md,
    color: Colors.ink,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  courseSearchResults: {
    gap: Spacing.md,
  },
  courseResultList: {
    gap: Spacing.sm,
  },
  courseResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
  },
  courseResultIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.tint,
  },
  courseResultText: {
    flex: 1,
    gap: Spacing.xs,
  },
  noCourseResults: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  activeSearchPill: {
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#F2F2FF',
  },
  verifiedCount: {
    marginBottom: Spacing.lg,
  },
  resourceList: {
    gap: Spacing.xl,
  },
  resourceCard: {
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  sourceTag: {
    letterSpacing: 0.5,
  },
  resourceTitle: {
    lineHeight: 24,
  },
  resourceDescription: {
    lineHeight: 22,
  },
  dateMeta: {
    marginTop: 2,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  resourceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl + Spacing.sm,
  },
  recentList: {
    marginTop: Spacing.md,
    gap: Spacing.lg,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  subHeading: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  coursesScroll: {
    gap: 10,
    paddingRight: Layout.gutter,
    marginHorizontal: -Layout.gutter,
    paddingLeft: Layout.gutter,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(32, 33, 42, 0.32)',
  },
  bottomSheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Layout.gutter,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl * 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  sheetTitle: {
    fontSize: 22,
    lineHeight: 29,
  },
  savedItemName: {
    marginBottom: Spacing.xl,
  },
  viewListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  viewListButtonText: {
    color: Colors.white,
  },
  keepReadingButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  keepReadingText: {
    color: Colors.primary,
  },
});