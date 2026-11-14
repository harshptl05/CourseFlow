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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ArticleCard } from '@/components/article-card';
import { CourseCard } from '@/components/course-card';
import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import {
  COURSE_TOPICS,
  findCourseByTopic,
  getArticlesForCourse,
  type Article,
} from '@/data/articles';
import { useSaved, type Resource } from '@/context/SavedContext';

function toResource(article: Article): Resource {
  return {
    id: article.id,
    title: article.title,
    category: article.source,
    description: article.summary,
    courseCode: article.courseCode,
    dateInfo: article.dateInfo,
    url: article.url,
  };
}

export default function SearchScreen() {
  const router = useRouter();
  const courseSearchRef = useRef<TextInputInstance>(null);
  const { topic } = useLocalSearchParams<{ topic?: string }>();
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
  const [selectedTopic, setSelectedTopic] = useState<string | null>(topic ?? null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'research'>('all');
  const [justSavedItem, setJustSavedItem] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const focusSearchWhenMounted = useRef(false);

  const activeCourse = selectedTopic ? findCourseByTopic(selectedTopic) : undefined;
  const customCourse = selectedTopic
    ? courses.find((course) => course.id === selectedTopic)
    : undefined;
  const selectedCourseCode = activeCourse?.code ?? customCourse?.id;
  const topicArticles = selectedCourseCode ? getArticlesForCourse(selectedCourseCode) : [];
  const visibleArticles =
    activeFilter === 'research'
      ? topicArticles.filter((article) => article.kind === 'research')
      : topicArticles;
  const customCourseResources = customCourse
    ? savedResources.filter(
        (resource) => courseAssignments[resource.id] === customCourse.id,
      )
    : [];
  const courseOptions = [
    ...COURSE_TOPICS.map((course) => ({
      code: course.code,
      title: course.title,
      topic: course.topic,
      description: course.topic,
    })),
    ...courses
      .filter((course) => !COURSE_TOPICS.some((topic) => topic.code === course.id))
      .map((course) => ({
        code: course.id,
        title: course.title,
        topic: course.id,
        description: course.description,
      })),
  ];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchingCourses = normalizedQuery
    ? courseOptions
        .map((course, index) => {
          const fields = [course.code, course.title, course.topic, course.description]
            .map((field) => field.toLowerCase());
          const score = Math.max(
            ...fields.map((field) =>
              field === normalizedQuery
                ? 3
                : field.startsWith(normalizedQuery)
                  ? 2
                  : field.includes(normalizedQuery)
                    ? 1
                    : 0,
            ),
          );
          return { course, index, score };
        })
        .filter((result) => result.score > 0)
        .sort((left, right) => right.score - left.score || left.index - right.index)
        .slice(0, 5)
        .map((result) => result.course)
    : [];

  const selectCourse = (course: (typeof courseOptions)[number]) => {
    setActiveFilter('all');
    setSearchQuery('');
    setSelectedTopic(course.topic);
  };

  const handleToggleSave = async (article: Article) => {
    if (isResourceSaved(article.id)) {
      await removeResource(article.id);
      return;
    }

    const resource = toResource(article);
    await saveResource(resource);
    setJustSavedItem(resource);
  };

  const handleAddToCourse = async (article: Article) => {
    if (!isResourceSaved(article.id)) {
      await saveResource(toResource(article));
    }

    addResourceToCourse(article.id, article.courseCode);
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
            {customCourse?.title ?? selectedTopic ?? 'Explore'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Search courses"
          onPress={() => {
            focusSearchWhenMounted.current = selectedTopic !== null;
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
          {!customCourse ? (
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
          ) : null}

          <ThemedText type="caption" color="muted" style={styles.verifiedCount}>
            {customCourse
              ? `${customCourseResources.length} saved ${
                  customCourseResources.length === 1 ? 'resource' : 'resources'
                }`
              : `${visibleArticles.length} verified ${
                  visibleArticles.length === 1 ? 'resource' : 'resources'
                }${activeCourse ? ` for ${activeCourse.code}` : ''}`}
          </ThemedText>

          {/* Resource Cards List */}
          <View style={styles.resourceList}>
            {customCourseResources.map((resource) => (
              <View key={resource.id} style={styles.courseResult}>
                <View style={styles.courseResultIcon}>
                  <Feather name="file-text" size={18} color={Colors.primary} />
                </View>
                <View style={styles.courseResultText}>
                  <ThemedText type="label">{resource.title}</ThemedText>
                  <ThemedText type="caption" color="muted">
                    {resource.category} · {resource.dateInfo}
                  </ThemedText>
                </View>
              </View>
            ))}
            {visibleArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                actions={
                  <>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleToggleSave(article)}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isResourceSaved(article.id)
                          ? `Remove ${article.title} from your reading list`
                          : `Save ${article.title} to your reading list`
                      }
                    >
                      <ThemedText type="label" style={{ color: Colors.primary }}>
                        {isResourceSaved(article.id) ? 'Saved ✓' : 'Save'}
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      disabled={isResourceInCourse(article.id, article.courseCode)}
                      onPress={() => handleAddToCourse(article)}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isResourceInCourse(article.id, article.courseCode)
                          ? `${article.title} is in ${article.courseCode}`
                          : `Add ${article.title} to ${article.courseCode}`
                      }
                    >
                      <ThemedText type="label" style={{ color: Colors.primary }}>
                        {isResourceInCourse(article.id, article.courseCode) ? 'Added ✓' : 'Add'}
                      </ThemedText>
                    </TouchableOpacity>
                  </>
                }
              />
            ))}
          </View>

          {visibleArticles.length === 0 && customCourseResources.length === 0 ? (
            <ThemedText type="body" color="muted">
              {customCourse
                ? 'No materials have been added to this course yet.'
                : 'No research papers filed under this topic yet.'}
            </ThemedText>
          ) : null}
        </ScrollView>
      ) : (
        /* --- Default Explore View --- */
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- Hero Section --- */}
          <ThemedText type="display" style={styles.heroTitle}>
            Find one of your courses.
          </ThemedText>

          <View style={styles.searchPill}>
            <Feather name="search" size={16} color={Colors.primary} />
            <TextInput
              ref={(input) => {
                courseSearchRef.current = input;
                if (input && focusSearchWhenMounted.current) {
                  input.focus();
                  focusSearchWhenMounted.current = false;
                }
              }}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search courses by name or code"
              placeholderTextColor={Colors.primary}
              accessibilityLabel="Search courses by name or code"
              returnKeyType="search"
            />
          </View>

          {normalizedQuery ? (
            <View style={styles.courseSearchResults}>
              <ThemedText type="caption" color="muted">
                {matchingCourses.length
                  ? 'Matching courses'
                  : 'No matching courses found'}
              </ThemedText>
              <View style={styles.courseResultList}>
                {matchingCourses.map((course) => (
                  <TouchableOpacity
                    key={course.code}
                    style={styles.courseResult}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${course.title}, ${course.code}`}
                    onPress={() => selectCourse(course)}>
                    <View style={styles.courseResultIcon}>
                      <Feather name="book-open" size={18} color={Colors.primary} />
                    </View>
                    <View style={styles.courseResultText}>
                      <ThemedText type="label">{course.title}</ThemedText>
                      <ThemedText type="caption" color="muted">
                        {course.code}
                        {course.description ? ` · ${course.description}` : ''}
                      </ThemedText>
                    </View>
                    <Feather name="chevron-right" size={18} color={Colors.muted} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          {/* --- Recent Searches --- */}
          <View style={styles.section}>
            <ThemedText type="title">Recent searches</ThemedText>
            <View style={styles.recentList}>
              {COURSE_TOPICS.map((course) => (
                <TouchableOpacity
                  key={course.code}
                  style={styles.recentItem}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTopic(course.topic)}
                >
                  <ThemedText type="label" style={{ color: Colors.primary }}>
                    {course.topic}
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
              contentContainerStyle={styles.coursesScroll}
            >
              {COURSE_TOPICS.map((course) => {
                const articles = getArticlesForCourse(course.code);

                return (
                  <CourseCard
                    key={course.code}
                    code={course.code}
                    icon={course.icon}
                    resourceCount={`${articles.length} ${articles.length === 1 ? 'resource' : 'resources'}`}
                    suggestedReads={`• ${course.topic}`}
                    surface={course.surface}
                    onPress={() => setSelectedTopic(course.topic)}
                  />
                );
              })}
            </ScrollView>
          </View>

          {/* --- Featured Publishers --- */}
          <View style={styles.section}>
            <ThemedText type="title">Featured publishers</ThemedText>

            <View style={styles.publisherGrid}>
              <View style={styles.pubRow}>
                <TouchableOpacity style={styles.pubTextBtn}>
                  <ThemedText type="label" style={{ color: Colors.primary }}>
                    MIT News
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pubTextBtn}>
                  <ThemedText type="label" style={{ color: Colors.primary }}>
                    Nature
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.pubRow}>
                <TouchableOpacity style={styles.pubPillBtn}>
                  <ThemedText type="label" style={{ color: Colors.primary }}>
                    News
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pubPillBtn}>
                  <ThemedText type="label" style={{ color: Colors.primary }}>
                    Research
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* --- Latest Reporting --- */}
          <View style={styles.section}>
            <ThemedText type="title">Latest reporting</ThemedText>
            <View style={styles.reportingList}>
              {COURSE_TOPICS.map((course) => {
                const [latest] = getArticlesForCourse(course.code);
                if (!latest) {
                  return null;
                }

                return (
                  <ArticleCard
                    key={latest.id}
                    article={latest}
                    actions={
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleToggleSave(latest)}
                        accessibilityRole="button"
                        accessibilityLabel={
                          isResourceSaved(latest.id)
                            ? `Remove ${latest.title} from your reading list`
                            : `Save ${latest.title} to your reading list`
                        }
                      >
                        <ThemedText type="label" style={{ color: Colors.primary }}>
                          {isResourceSaved(latest.id) ? 'Saved ✓' : 'Save'}
                        </ThemedText>
                      </TouchableOpacity>
                    }
                  />
                );
              })}
            </View>
          </View>
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
    gap: Spacing.md,
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
  publisherGrid: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  pubRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.md,
  },
  pubTextBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  pubPillBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
    paddingVertical: 12,
  },
  reportingList: {
    marginTop: Spacing.md,
    gap: Spacing.md,
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
