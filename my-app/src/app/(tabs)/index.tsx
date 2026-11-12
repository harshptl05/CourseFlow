import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ArticleCard } from '@/components/article-card';
import { CourseCard } from '@/components/course-card';
import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import { COURSE_TOPICS, getArticlesForCourse } from '@/data/articles';

export default function HomeScreen() {
  const router = useRouter();

  const openTopic = (topic: string) => {
    router.push({ pathname: '/search', params: { topic } });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.intro}>
        <ThemedText type="caption" color="muted">
          Curated for your classroom
        </ThemedText>
        <ThemedText type="display">{'Your daily feed,\ncurated to help you learn.'}</ThemedText>
      </View>

      <ThemedText type="label">For your courses</ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.courses}>
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
              onPress={() => openTopic(course.topic)}
            />
          );
        })}
      </ScrollView>

      {COURSE_TOPICS.map((course) => {
        const articles = getArticlesForCourse(course.code);

        return (
          <View key={course.code} style={styles.feedSection}>
            <View style={styles.feedHeading}>
              <View style={[styles.feedBadge, { backgroundColor: Colors[course.surface] }]}>
                <View style={styles.feedBadgeIcon}>
                  <Image
                    source={course.icon}
                    style={StyleSheet.absoluteFill}
                    contentFit="contain"
                  />
                </View>
              </View>
              <View style={styles.feedHeadingText}>
                <ThemedText type="label">{course.code}</ThemedText>
                <ThemedText type="meta" color="muted">
                  {course.topic}
                </ThemedText>
              </View>
              <Pressable
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`See all ${course.topic} resources`}
                onPress={() => openTopic(course.topic)}>
                <ThemedText type="caption" style={styles.seeAll}>
                  See all {articles.length}
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.feedList}>
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </View>
          </View>
        );
      })}
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
  feedSection: {
    gap: Spacing.md,
  },
  feedHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  feedBadge: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  feedBadgeIcon: {
    width: 18,
    height: 18,
  },
  feedHeadingText: {
    flex: 1,
    gap: 2,
  },
  seeAll: {
    color: Colors.primary,
  },
  feedList: {
    gap: Spacing.md,
  },
});
