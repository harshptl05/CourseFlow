import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ArticleCard } from '@/components/article-card';
import { CourseCard } from '@/components/course-card';
import { FadeIn } from '@/components/fade-in';
import { Marquee } from '@/components/marquee';
import { ShineBorder } from '@/components/shine-border';
import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Shadow, Spacing } from '@/constants/theme';
import { ARTICLES, COURSE_TOPICS, getArticlesForCourse } from '@/data/articles';

const PUBLISHER_CHIPS = Array.from(
  new Set(ARTICLES.map((article) => article.source.split('·')[0].trim())),
);

export default function HomeScreen() {
  const router = useRouter();
  const totalReads = ARTICLES.length;

  const openTopic = (topic: string) => {
    router.push({ pathname: '/search', params: { topic } });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.blobPrimary} pointerEvents="none" />
        <View style={styles.blobCream} pointerEvents="none" />

        <FadeIn>
          <View style={styles.intro}>
            <ThemedText type="display">{'Your feed,\ncurated to help you learn.'}</ThemedText>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <ShineBorder color={Colors.primary} duration={4200}>
            <Pressable
              style={({ pressed }) => [styles.digest, pressed && styles.digestPressed]}
              accessibilityRole="button"
              accessibilityLabel="Explore all curated resources"
              onPress={() => router.push('/search')}>
              <View style={styles.digestIcon}>
                <Feather name="book-open" size={16} color={Colors.primary} />
              </View>
              <View style={styles.digestCopy}>
                <ThemedText type="label">Today&apos;s reading desk</ThemedText>
                <ThemedText type="caption" color="muted">
                  {totalReads} curated reads across {COURSE_TOPICS.length} courses
                </ThemedText>
              </View>
              <Feather name="arrow-right" size={16} color={Colors.primary} />
            </Pressable>
          </ShineBorder>
        </FadeIn>

        <FadeIn delay={110}>
          <Marquee duration={24000} gap={Spacing.sm}>
            {PUBLISHER_CHIPS.map((publisher) => (
              <View key={publisher} style={styles.publisherChip}>
                <ThemedText type="meta" color="primary">
                  {publisher}
                </ThemedText>
              </View>
            ))}
          </Marquee>
        </FadeIn>
      </View>

      <FadeIn delay={120}>
        <ThemedText type="label">For your courses</ThemedText>
      </FadeIn>

      <FadeIn delay={160}>
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
      </FadeIn>

      {COURSE_TOPICS.map((course, courseIndex) => {
        const articles = getArticlesForCourse(course.code);

        return (
          <FadeIn key={course.code} delay={200 + courseIndex * 70}>
            <View style={styles.feedSection}>
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
                {articles.map((article, articleIndex) =>
                  articleIndex === 0 ? (
                    <ShineBorder
                      key={article.id}
                      color={course.surface === 'cream' ? Colors.accent : Colors.primary}
                      duration={5200}
                      delay={courseIndex * 400}>
                      <ArticleCard article={article} />
                    </ShineBorder>
                  ) : (
                    <ArticleCard key={article.id} article={article} />
                  ),
                )}
              </View>
            </View>
          </FadeIn>
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
  hero: {
    position: 'relative',
    gap: Spacing.lg,
    overflow: 'hidden',
    paddingBottom: Spacing.sm,
  },
  blobPrimary: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.tint,
    opacity: 0.85,
  },
  blobCream: {
    position: 'absolute',
    top: 60,
    left: -70,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.cream,
    opacity: 0.7,
  },
  intro: {
    gap: Spacing.sm,
  },
  digest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    ...Shadow.card,
  },
  digestPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  digestIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.tint,
  },
  digestCopy: {
    flex: 1,
    gap: 2,
  },
  publisherChip: {
    marginRight: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
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
