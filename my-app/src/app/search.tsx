import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { CourseCard, type CourseCardProps } from '@/components/course-card';
import { ThemedText } from '@/components/themed-text';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';

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

export default function SearchScreen() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'research'>('all');

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
        
        <TouchableOpacity activeOpacity={0.7}>
          <Feather name="search" size={20} color={Colors.ink} />
        </TouchableOpacity>
      </View>

      {selectedTopic ? (
        /* --- Topic Results View (Step 1: Controls & Filter Bar) --- */
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

          <ThemedText type="caption" color="muted">
            2 verified resources
          </ThemedText>
        </ScrollView>
      ) : (
        /* --- Default Explore View --- */
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Hero Section --- */}
          <ThemedText type="display" style={styles.heroTitle}>
            Follow your curiosity.
          </ThemedText>

          {/* Fake Search Input Pill */}
          <TouchableOpacity style={styles.searchPill} activeOpacity={0.8}>
            <ThemedText type="label" style={{ color: Colors.primary }}>
              Search topics, papers & publishers
            </ThemedText>
          </TouchableOpacity>

          {/* --- Recent Searches --- */}
          <View style={styles.section}>
            <ThemedText type="title">Recent searches</ThemedText>
            <View style={styles.recentList}>
              {['Machine Learning', 'Software Engineering', 'Statistics'].map((item) => (
                <TouchableOpacity 
                  key={item} 
                  style={styles.recentItem} 
                  activeOpacity={0.7}
                  onPress={() => setSelectedTopic(item)}
                >
                  <ThemedText type="label" style={{ color: Colors.primary }}>{item}</ThemedText>
                  <Feather name="arrow-right" size={16} color={Colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- Topic Collections --- */}
          <View style={styles.section}>
            <ThemedText type="title">Topic collections</ThemedText>
            <ThemedText type="label" style={styles.subHeading}>For your courses</ThemedText>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.coursesScroll}
            >
              {COURSES.map((course) => (
                <CourseCard key={course.code} {...course} />
              ))}
            </ScrollView>
          </View>

          {/* --- Featured Publishers --- */}
          <View style={styles.section}>
            <ThemedText type="title">Featured publishers</ThemedText>
            
            <View style={styles.publisherGrid}>
              <View style={styles.pubRow}>
                <TouchableOpacity style={styles.pubTextBtn}>
                  <ThemedText type="label" style={{ color: Colors.primary }}>MIT News</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pubTextBtn}>
                  <ThemedText type="label" style={{ color: Colors.primary }}>Nature</ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.pubRow}>
                <TouchableOpacity style={styles.pubPillBtn}>
                  <ThemedText type="label" style={{ color: Colors.primary }}>News</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pubPillBtn}>
                  <ThemedText type="label" style={{ color: Colors.primary }}>Research</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* --- Latest Reporting --- */}
          <View style={styles.section}>
            <ThemedText type="title">Latest reporting</ThemedText>
            <ThemedText type="caption" color="muted" style={styles.reportingSub}>
              MIT NEWS • NEWS
            </ThemedText>
            <View style={styles.reportingPlaceholder} />
          </View>
        </ScrollView>
      )}
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
    backgroundColor: '#F2F2FF', 
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.xl,
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
    marginBottom: Spacing.xl,
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
  reportingSub: {
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  reportingPlaceholder: {
    height: 100,
    backgroundColor: '#F2F2FF',
    borderRadius: Radius.md,
    marginTop: Spacing.md,
  },
});